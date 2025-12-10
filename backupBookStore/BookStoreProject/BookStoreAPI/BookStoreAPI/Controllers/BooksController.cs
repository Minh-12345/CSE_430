using BookStoreAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookStoreAPI.Controllers
{
    [Route("api/[controller]")] // Đường dẫn sẽ là: api/books
    [ApiController]
    public class BooksController : ControllerBase
    {
        private readonly BookStoreDbContext _context;

        public BooksController(BookStoreDbContext context)
        {
            _context = context;
        }

        // GET: api/books
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Book>>> GetBooks()
        {
            // Lấy danh sách sách và include luôn tên danh mục
            return await _context.Books
                                 .Include(b => b.Category)
                                 .ToListAsync();
        }

        // GET: api/books/featured (Lấy sách nổi bật - ví dụ lấy 5 cuốn mới nhất)
        [HttpGet("featured")]
        public async Task<ActionResult<IEnumerable<Book>>> GetFeaturedBooks()
        {
            return await _context.Books
                                 .OrderByDescending(b => b.CreatedAt)
                                 .Take(5)
                                 .ToListAsync();
        }

        // GET: api/books/bestseller
        [HttpGet("bestseller")]
        public async Task<ActionResult<IEnumerable<Book>>> GetBestSellerBooks()
        {
            return await _context.Books
                                 .Include(b => b.Category)
                                 .OrderByDescending(b => b.SoldCount)
                                 .ToListAsync();
        }

        // GET: api/books/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Book>> GetBook(int id)
        {
            var book = await _context.Books.Include(b => b.Category).FirstOrDefaultAsync(b => b.BookId == id);

            if (book == null)
            {
                return NotFound();
            }

            return book;
        }

        // POST: api/books
        [HttpPost]
        public async Task<ActionResult<Book>> CreateBook(Book book)
        {
            book.CreatedAt = DateTime.Now;
            _context.Books.Add(book);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Book added successfully", bookId = book.BookId });
        }

        // PUT: api/books/5
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateBook(int id, Book book)
        {
            if (id != book.BookId)
            {
                return BadRequest(new { message = "Book ID mismatch" });
            }

            var existingBook = await _context.Books.FindAsync(id);
            if (existingBook == null)
            {
                return NotFound(new { message = "Book not found" });
            }

            existingBook.Title = book.Title;
            existingBook.Author = book.Author;
            existingBook.Price = book.Price;
            existingBook.Description = book.Description;
            existingBook.ImageUrl = book.ImageUrl;
            existingBook.CategoryId = book.CategoryId;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to update book", error = ex.Message });
            }

            return Ok(new { message = "Book updated successfully" });
        }

        // DELETE: api/books/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteBook(int id)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null)
            {
                return NotFound(new { message = "Book not found" });
            }

            _context.Books.Remove(book);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Book deleted successfully" });
        }
    }
}