import React, { useEffect, useState, useRef } from 'react';
import {
    View, Text, FlatList, Image, StyleSheet,
    ActivityIndicator, TouchableOpacity, TextInput, ScrollView, Dimensions
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import bookApi from '../api/bookApi';
import { useSelector } from 'react-redux';

const { width } = Dimensions.get('window');

const removeVietnameseTones = (str) => {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Ð/g, "D");
    str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return str;
}

const HomeScreen = ({ navigation }) => {
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [search, setSearch] = useState('');

    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    const flatListRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const bannerImages = [
        'https://as2.ftcdn.net/jpg/04/32/32/87/1000_F_432328795_gyl6zdxtuKrwTDLSOgLF2NfnHNLkg1oC.jpg',
        'https://t3.ftcdn.net/jpg/04/70/23/32/240_F_470233270_msHa5X0e6Mz3KS90QS8w1RoQyqKsMBjP.jpg',
        'https://t4.ftcdn.net/jpg/03/49/90/19/240_F_349901969_JwlkbIcZq9epfMykMDwrXOFZjIUyrSM0.jpg'
    ];
    
    const infiniteBanners = [...bannerImages, ...bannerImages, ...bannerImages];
    const cartItems = useSelector(state => state.cart.items);

    useEffect(() => {
        const loadData = async () => {
            try {
                const userJson = await AsyncStorage.getItem('user');
                if (userJson) setUser(JSON.parse(userJson));

                const res = await bookApi.getAll();
                setBooks(res.data);
                setFilteredBooks(res.data);

                setLoading(false);
            } catch (error) {
                console.error("Error loading data:", error);
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // Auto-scroll banner 
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex(prevIndex => {
                const nextIndex = prevIndex + 1;
                flatListRef.current?.scrollToIndex({
                    index: nextIndex,
                    animated: true
                });
                
                // Reset về giữa khi đến cuối để tạo infinite loop
                if (nextIndex >= bannerImages.length * 2) {
                    setTimeout(() => {
                        flatListRef.current?.scrollToIndex({
                            index: bannerImages.length,
                            animated: false
                        });
                    }, 300);
                    return bannerImages.length;
                }
                
                return nextIndex;
            });
        }, 3000);

        return () => clearInterval(interval);
    }, []);
    
    // Scroll to middle khi mount
    useEffect(() => {
        setTimeout(() => {
            flatListRef.current?.scrollToIndex({
                index: bannerImages.length,
                animated: false
            });
            setCurrentIndex(bannerImages.length);
        }, 100);
    }, []);

    const searchFilter = (text) => {
        if (text) {
            const newData = books.filter((item) => {
                const itemData = removeVietnameseTones(item.title ? item.title : '').toUpperCase();
                const textData = removeVietnameseTones(text).toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            setFilteredBooks(newData);
            setSearch(text);
        } else {
            setFilteredBooks(books);
            setSearch(text);
        }
    };

    const renderBookItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('ProductDetail', { bookId: item.bookId || item.BookId })}
        >
            <Image
                source={{
                    uri: item.imageUrl || item.ImageUrl || 'https://via.placeholder.com/150'
                }}
                style={styles.bookImage}
                resizeMode="contain"
            />
            <Text style={styles.bookTitle} numberOfLines={2}>{item.title || item.Title}</Text>
            <Text style={styles.bookPrice}>
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price || item.Price || 0)}
            </Text>
        </TouchableOpacity>
    );

    if (loading) return <ActivityIndicator size="large" color="#007AFF" style={styles.center} />;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('TabProfile')}>
                    <Text style={styles.greeting}>Xin chào,</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontSize: 20, marginRight: 5 }}>👤</Text>
                        <Text style={styles.username}>{user ? user.fullName : 'Bạn mới'}</Text>
                    </View>
                </TouchableOpacity>
            </View>

            <FlatList
                ref={flatListRef}
                data={infiniteBanners}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => `banner-${index}`}
                renderItem={({ item }) => (
                    <Image source={{ uri: item }} style={styles.bannerImage} />
                )}
                style={styles.bannerContainer}
                getItemLayout={(data, index) => ({
                    length: width,
                    offset: width * index,
                    index,
                })}
                onScrollToIndexFailed={() => {}}
            />

            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Tìm kiếm sách..."
                    value={search}
                    onChangeText={(text) => searchFilter(text)} // Gọi hàm lọc khi gõ chữ
                />
            </View>

            {/* DANH SÁCH SÁCH (Dùng filteredBooks để hiển thị) */}
            <Text style={styles.sectionTitle}>Sách Mới Nhập</Text>
            <FlatList
                data={filteredBooks} // <--- QUAN TRỌNG: Hiển thị danh sách đã lọc
                renderItem={renderBookItem}
                keyExtractor={item => (item.bookId || item.BookId).toString()}
                numColumns={2}
                columnWrapperStyle={styles.row}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F5FA', padding: 15 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingTop: 45, paddingBottom: 15, paddingHorizontal: 15,
        backgroundColor: 'white', elevation: 5, zIndex: 100,
        marginHorizontal: -15, marginTop: -15, marginBottom: 15 // Hack để header tràn viền
    },
    bannerContainer: { height: 150, marginBottom: 15 },
    bannerImage: { width: width, height: 150, borderRadius: 8 },
    greeting: { fontSize: 14, color: '#888' },
    username: { fontSize: 18, fontWeight: 'bold', color: '#333' },

    cartButton: { padding: 5, position: 'relative' },
    badge: {
        position: 'absolute', right: -5, top: -5, backgroundColor: 'red',
        borderRadius: 10, width: 20, height: 20,
        justifyContent: 'center', alignItems: 'center',
    },
    badgeText: { color: 'white', fontSize: 12, fontWeight: 'bold' },

    searchContainer: { marginBottom: 20 },
    searchInput: {
        backgroundColor: 'white', padding: 10, borderRadius: 10,
        borderWidth: 1, borderColor: '#eee', elevation: 2
    },

    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#333' },

    row: { justifyContent: 'space-between' },
    card: {
        width: '48%', backgroundColor: 'white', borderRadius: 10,
        padding: 10, marginBottom: 15, elevation: 3,
    },
    bookImage: {
        width: '100%', height: 160, borderRadius: 8, marginBottom: 8,
        backgroundColor: '#eee'
    },
    bookTitle: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 4, height: 40 },
    bookPrice: { fontSize: 16, fontWeight: 'bold', color: '#007AFF' }
});

export default HomeScreen;