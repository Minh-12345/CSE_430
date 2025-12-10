import React, { useEffect, useState } from 'react';
import { 
    View, Text, Image, StyleSheet, ScrollView, 
    TouchableOpacity, ActivityIndicator, Alert 
} from 'react-native';
import bookApi from '../api/bookApi';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';

const ProductDetailScreen = ({ route, navigation }) => {
    const { bookId } = route.params; 
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    const handleAddToCart = () => {
        if (!book) return;

        dispatch(addToCart(book));
        
        Alert.alert("Thành công", "Đã thêm sách vào giỏ hàng!", [
            { text: "Ở lại đây", style: 'cancel' },
            { text: "Xem giỏ hàng", onPress: () => navigation.navigate('Cart') },
            { text: "OK" }
        ]);
    };

    useEffect(() => {
        const fetchBookDetail = async () => {
            try {
                const res = await bookApi.get(bookId);
                setBook(res.data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchBookDetail();
    }, [bookId]);

    if (loading) return <ActivityIndicator size="large" color="#007AFF" style={styles.center} />;
    if (!book) return <View style={styles.center}><Text>Không tìm thấy sách</Text></View>;

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backText}>{"< Quay lại"}</Text>
            </TouchableOpacity>

            <ScrollView showsVerticalScrollIndicator={false}>
                <Image 
                    source={{ 
                        uri: book.imageUrl || book.ImageUrl || 'https://via.placeholder.com/300' 
                    }} 
                    style={styles.image} 
                    resizeMode="contain" 
                />
                
                <View style={styles.infoContainer}>
                    <Text style={styles.title}>{book.title}</Text>
                    <Text style={styles.price}>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(book.price)}
                    </Text>
                    
                    <Text style={styles.label}>Tác giả:</Text>
                    <Text style={styles.text}>{book.author}</Text>
                    
                    <Text style={styles.label}>Mô tả:</Text>
                    <Text style={styles.description}>{book.description}</Text>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.btnBuy} onPress={handleAddToCart}>
                    <Text style={styles.btnText}>THÊM VÀO GIỎ</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    backButton: { position: 'absolute', top: 50, left: 10, zIndex: 10, padding: 10, backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 20 },
    backText: { fontWeight: 'bold' },
    
    image: { width: '100%', height: 300, backgroundColor: '#f9f9f9', marginTop: 20 },
    infoContainer: { padding: 20, paddingBottom: 100 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 10 },
    price: { fontSize: 22, color: '#d32f2f', fontWeight: 'bold', marginBottom: 20 },
    label: { fontSize: 16, fontWeight: 'bold', marginTop: 10, color: '#555' },
    text: { fontSize: 16, color: '#333' },
    description: { fontSize: 15, color: '#666', lineHeight: 22, marginTop: 5 },

    footer: { 
        position: 'absolute', bottom: 0, left: 0, right: 0, 
        padding: 15, borderTopWidth: 1, borderColor: '#eee', backgroundColor: '#fff' 
    },
    btnBuy: { 
        backgroundColor: '#007AFF', height: 50, borderRadius: 8, 
        justifyContent: 'center', alignItems: 'center' 
    },
    btnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});

export default ProductDetailScreen;