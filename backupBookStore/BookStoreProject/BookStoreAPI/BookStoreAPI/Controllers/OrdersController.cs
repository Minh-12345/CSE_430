using BookStoreAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Data.SqlClient;
using System.Data;

namespace BookStoreAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly BookStoreDbContext _context;

        public OrdersController(BookStoreDbContext context)
        {
            _context = context;
        }

        // POST: api/orders
        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequest request)
        {
            var order = new Order
            {
                UserId = request.UserId,
                OrderDate = DateTime.Now,
                TotalAmount = request.TotalAmount,
                Status = 0
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            foreach (var item in request.Items)
            {
                var detail = new OrderDetail
                {
                    OrderId = order.OrderId,
                    BookId = item.BookId,
                    Quantity = item.Quantity,
                    Price = item.Price
                };
                _context.OrderDetails.Add(detail);

                var book = await _context.Books.FindAsync(item.BookId);
                if (book != null)
                {
                    book.SoldCount += item.Quantity;
                }
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Đặt hàng thành công!", orderId = order.OrderId });
        }
        // GET: api/orders/user/5
        [HttpGet("user/{userId}")]
        public async Task<ActionResult> GetOrdersByUser(int userId)
        {
            try
            {
                var orders = new List<object>();
                var connectionString = "Server=DESKTOP-GOTUQ9M;Database=BookStoreDB;Trusted_Connection=True;TrustServerCertificate=True;";

                using (var connection = new SqlConnection(connectionString))
                {
                    await connection.OpenAsync();
                    
                    var command = new SqlCommand(@"
                        SELECT 
                            OrderID,
                            UserID,
                            OrderDate,
                            TotalAmount,
                            Status
                        FROM Orders
                        WHERE TRY_CAST(UserID AS INT) = @UserId
                        ORDER BY OrderDate DESC
                    ", connection);
                    
                    command.Parameters.AddWithValue("@UserId", userId);

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            // Helper function để đọc int an toàn
                            int GetSafeInt(int ordinal)
                            {
                                if (reader.IsDBNull(ordinal)) return 0;
                                var fieldType = reader.GetFieldType(ordinal);
                                if (fieldType == typeof(string))
                                {
                                    var strValue = reader.GetString(ordinal);
                                    return int.TryParse(strValue, out int result) ? result : 0;
                                }
                                return reader.GetInt32(ordinal);
                            }

                            orders.Add(new
                            {
                                orderId = GetSafeInt(0),
                                userId = GetSafeInt(1),
                                orderDate = reader.IsDBNull(2) ? (DateTime?)null : reader.GetDateTime(2),
                                totalAmount = reader.IsDBNull(3) ? 0 : reader.GetDecimal(3),
                                status = GetSafeInt(4)
                            });
                        }
                    }
                }

                return Ok(orders);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { 
                    message = "Lỗi khi lấy đơn hàng", 
                    error = ex.Message, 
                    innerError = ex.InnerException?.Message,
                    stack = ex.StackTrace 
                });
            }
        }

        // GET: api/orders - Lấy tất cả đơn hàng (cho Admin)
        [HttpGet]
        public async Task<ActionResult> GetAllOrders()
        {
            try
            {
                var orders = new List<object>();
                var connectionString = "Server=DESKTOP-GOTUQ9M;Database=BookStoreDB;Trusted_Connection=True;TrustServerCertificate=True;";

                using (var connection = new SqlConnection(connectionString))
                {
                    await connection.OpenAsync();
                    
                    var command = new SqlCommand(@"
                        SELECT 
                            o.OrderID,
                            o.UserID,
                            o.OrderDate,
                            o.TotalAmount,
                            o.Status,
                            u.FullName
                        FROM Orders o
                        LEFT JOIN Users u ON TRY_CAST(o.UserID AS INT) = u.UserID
                        ORDER BY o.OrderDate DESC
                    ", connection);

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            int GetSafeInt(int ordinal)
                            {
                                if (reader.IsDBNull(ordinal)) return 0;
                                var fieldType = reader.GetFieldType(ordinal);
                                if (fieldType == typeof(string))
                                {
                                    var strValue = reader.GetString(ordinal);
                                    return int.TryParse(strValue, out int result) ? result : 0;
                                }
                                return reader.GetInt32(ordinal);
                            }

                            orders.Add(new
                            {
                                orderId = GetSafeInt(0),
                                userId = GetSafeInt(1),
                                orderDate = reader.IsDBNull(2) ? (DateTime?)null : reader.GetDateTime(2),
                                totalAmount = reader.IsDBNull(3) ? 0 : reader.GetDecimal(3),
                                status = GetSafeInt(4),
                                customerName = reader.IsDBNull(5) ? "N/A" : reader.GetString(5)
                            });
                        }
                    }
                }

                return Ok(orders);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { 
                    message = "Lỗi khi lấy danh sách đơn hàng", 
                    error = ex.Message 
                });
            }
        }

        // PUT: api/orders/5/status
        [HttpPut("{orderId}/status")]
        public async Task<ActionResult> UpdateOrderStatus(int orderId, [FromBody] UpdateStatusRequest request)
        {
            try
            {
                var connectionString = "Server=DESKTOP-GOTUQ9M;Database=BookStoreDB;Trusted_Connection=True;TrustServerCertificate=True;";

                using (var connection = new SqlConnection(connectionString))
                {
                    await connection.OpenAsync();
                    
                    var command = new SqlCommand(@"
                        UPDATE Orders 
                        SET Status = @Status 
                        WHERE OrderID = @OrderId
                    ", connection);
                    
                    command.Parameters.AddWithValue("@OrderId", orderId);
                    command.Parameters.AddWithValue("@Status", request.Status);

                    int rowsAffected = await command.ExecuteNonQueryAsync();

                    if (rowsAffected == 0)
                    {
                        return NotFound(new { message = "Order not found" });
                    }

                    return Ok(new { message = "Status updated successfully", orderId, status = request.Status });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { 
                    message = "Error updating status", 
                    error = ex.Message,
                    innerError = ex.InnerException?.Message
                });
            }
        }
    }

    // Class phụ để nhận dữ liệu từ App gửi lên
    public class CreateOrderRequest
    {
        public int UserId { get; set; }
        public decimal TotalAmount { get; set; }
        public List<CartItemDto> Items { get; set; }
    }

    public class CartItemDto
    {
        public int BookId { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
    }

    public class UpdateStatusRequest
    {
        public int Status { get; set; }
    }
}