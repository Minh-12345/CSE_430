import React, { useEffect, useState } from 'react';
import { 
    View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import orderApi from '../api/orderApi';

const OrderHistoryScreen = ({ navigation }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const userJson = await AsyncStorage.getItem('user');
                const user = JSON.parse(userJson);
                
                const userId = user.userId || user.UserID || user.id;
                
                const res = await orderApi.getHistory(userId);
                setOrders(res.data);
            } catch (error) {
                
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const getStatusColor = (status) => {
        if (status === 0) return '#FF9800';
        if (status === 1) return '#2196F3';
        if (status === 2) return '#4CAF50';
        return '#999';
    };

    const getStatusText = (status) => {
        if (status === 0) return 'Đang xử lý';
        if (status === 1) return 'Đang giao hàng';
        if (status === 2) return 'Hoàn thành';
        return 'Không rõ';
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.row}>
                <Text style={styles.date}>📅 {new Date(item.orderDate).toLocaleDateString('vi-VN')}</Text>
                <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
                    {getStatusText(item.status)}
                </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.row}>
                <Text style={styles.label}>Mã đơn: #{item.orderId}</Text>
                <Text style={styles.price}>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.totalAmount)}
                </Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backText}>{"< Quay lại"}</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>LỊCH SỬ ĐƠN HÀNG</Text>
                <View style={{width: 50}} />
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#007AFF" style={{marginTop: 50}} />
            ) : orders.length === 0 ? (
                <View style={styles.center}>
                    <Text>Bạn chưa có đơn hàng nào.</Text>
                </View>
            ) : (
                <FlatList
                    data={orders}
                    keyExtractor={item => item.orderId.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={{ padding: 15 }}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F5FA' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { 
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
        paddingTop: 50, paddingBottom: 15, paddingHorizontal: 15, 
        backgroundColor: 'white', elevation: 4 
    },
    backText: { fontSize: 16, color: '#007AFF' },
    headerTitle: { fontSize: 18, fontWeight: 'bold' },

    card: { 
        backgroundColor: 'white', borderRadius: 10, padding: 15, marginBottom: 15, 
        elevation: 2 
    },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    date: { color: '#666', fontSize: 14 },
    status: { fontWeight: 'bold', fontSize: 14 },
    divider: { height: 1, backgroundColor: '#eee', marginVertical: 10 },
    label: { color: '#888' },
    price: { fontSize: 18, fontWeight: 'bold', color: '#d32f2f' }
});

export default OrderHistoryScreen;