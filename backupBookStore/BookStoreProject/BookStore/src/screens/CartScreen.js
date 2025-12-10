import React from 'react';
import { 
    View, Text, FlatList, Image, StyleSheet, 
    TouchableOpacity, Alert 
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, clearCart, increaseQuantity, decreaseQuantity } from '../redux/cartSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import orderApi from '../api/orderApi';

const CartScreen = ({ navigation }) => {
    const cartItems = useSelector(state => state.cart.items);
    const totalAmount = useSelector(state => state.cart.totalAmount);
    const dispatch = useDispatch();

    const handleRemoveItem = (id) => {
        Alert.alert("Xác nhận", "Bạn có muốn xóa sách này không?", [
            { text: "Hủy", style: "cancel" },
            { text: "Xóa", onPress: () => dispatch(removeFromCart(id)) }
        ]);
    };

    const handleCheckout = async () => {
        if (cartItems.length === 0) {
            Alert.alert("Thông báo", "Giỏ hàng đang trống!");
            return;
        }

        try {
            const userJson = await AsyncStorage.getItem('user');
            if (!userJson) {
                Alert.alert("Lỗi", "Bạn chưa đăng nhập!");
                return;
            }
            const user = JSON.parse(userJson);

            const orderData = {
                userId: user.userId,
                totalAmount: totalAmount,
                items: cartItems.map(item => ({
                    bookId: item.bookId,
                    quantity: item.quantity,
                    price: item.price
                }))
            };

            await orderApi.createOrder(orderData);

            dispatch(clearCart());
            Alert.alert("Thành công", "Đơn hàng của bạn đã được ghi nhận!", [
                { text: "OK", onPress: () => navigation.navigate('Home') }
            ]);

        } catch (error) {
            console.error("Lỗi đặt hàng:", error);
            Alert.alert("Thất bại", "Có lỗi xảy ra khi gửi đơn hàng.");
        };
    };

    const renderItem = ({ item }) => (
        <View style={styles.cartItem}>
            <Image 
                source={{ uri: item.imageUrl || item.ImageUrl || 'https://via.placeholder.com/150' }} 
                style={styles.itemImage} 
            />
            <View style={styles.itemInfo}>
                <Text style={styles.itemTitle} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.itemPrice}>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                </Text>
                
                <View style={styles.quantityContainer}>
                    <TouchableOpacity 
                        style={styles.quantityButton} 
                        onPress={() => dispatch(decreaseQuantity(item.bookId))}
                    >
                        <Text style={styles.quantityButtonText}>−</Text>
                    </TouchableOpacity>
                    
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                    
                    <TouchableOpacity 
                        style={styles.quantityButton} 
                        onPress={() => dispatch(increaseQuantity(item.bookId))}
                    >
                        <Text style={styles.quantityButtonText}>+</Text>
                    </TouchableOpacity>
                </View>
                
                <Text style={styles.itemTotal}>
                    Tổng: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.totalPrice)}
                </Text>
            </View>
            
            <TouchableOpacity onPress={() => handleRemoveItem(item.bookId)} style={styles.deleteButton}>
                <Text style={styles.deleteText}>🗑️</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backText}>{"< Trở về"}</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>GIỎ HÀNG</Text>
                <View style={{ width: 50 }} /> 
            </View>

            {cartItems.length === 0 ? (
                <View style={styles.center}>
                    <Text style={styles.emptyIcon}>🛒</Text>
                    <Text style={styles.emptyText}>Giỏ hàng trống</Text>
                    <Text style={styles.emptySubtext}>Hãy thêm sản phẩm vào giỏ hàng của bạn!</Text>
                    <TouchableOpacity 
                        style={styles.btnGoHome} 
                        onPress={() => navigation.navigate('TabHome')}
                    >
                        <Text style={styles.btnText}>🛍️ Đi mua sắm ngay</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={cartItems}
                    renderItem={renderItem}
                    keyExtractor={item => item.bookId.toString()}
                    contentContainerStyle={{ paddingBottom: 100 }}
                />
            )}

            {cartItems.length > 0 && (
                <View style={styles.footer}>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Tổng cộng:</Text>
                        <Text style={styles.totalPrice}>
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount)}
                        </Text>
                    </View>
                    <TouchableOpacity style={styles.btnCheckout} onPress={handleCheckout}>
                        <Text style={styles.btnText}>THANH TOÁN NGAY</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F5FA' },
    header: { 
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
        paddingHorizontal: 15, 
        paddingTop: 50,        
        paddingBottom: 15, backgroundColor: 'white', elevation: 2 
    },
    backText: { fontSize: 16, color: '#007AFF' },
    headerTitle: { fontSize: 18, fontWeight: 'bold' },
    
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    emptyIcon: { fontSize: 80, marginBottom: 20 },
    emptyText: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 10 },
    emptySubtext: { fontSize: 16, color: '#888', marginBottom: 30, textAlign: 'center' },
    btnGoHome: { 
        backgroundColor: '#FF6B6B', 
        paddingHorizontal: 30, 
        paddingVertical: 15, 
        borderRadius: 25,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84
    },
    
    cartItem: { 
        flexDirection: 'row', backgroundColor: 'white', padding: 10, margin: 10, 
        borderRadius: 8, alignItems: 'center', elevation: 2 
    },
    itemImage: { width: 60, height: 80, borderRadius: 4, marginRight: 10 },
    itemInfo: { flex: 1 },
    itemTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
    itemPrice: { color: '#d32f2f', fontWeight: 'bold', marginBottom: 8 },
    
    quantityContainer: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginVertical: 8 
    },
    quantityButton: { 
        width: 32, 
        height: 32, 
        backgroundColor: '#007AFF', 
        borderRadius: 16, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    quantityButtonText: { 
        color: 'white', 
        fontSize: 20, 
        fontWeight: 'bold' 
    },
    quantityText: { 
        fontSize: 18, 
        fontWeight: 'bold', 
        marginHorizontal: 15,
        minWidth: 30,
        textAlign: 'center'
    },
    itemTotal: { 
        fontSize: 15, 
        fontWeight: 'bold', 
        color: '#4CAF50',
        marginTop: 5
    },
    
    deleteButton: { padding: 10 },
    deleteText: { fontSize: 24 },

    footer: { 
        position: 'absolute', bottom: 0, left: 0, right: 0, 
        backgroundColor: 'white', padding: 15, borderTopWidth: 1, borderColor: '#eee',
        elevation: 8
    },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
    totalLabel: { fontSize: 18, fontWeight: 'bold' },
    totalPrice: { fontSize: 20, color: '#d32f2f', fontWeight: 'bold' },
    btnCheckout: { 
        backgroundColor: '#007AFF', height: 50, borderRadius: 8, 
        justifyContent: 'center', alignItems: 'center' 
    },
    btnText: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});

export default CartScreen;