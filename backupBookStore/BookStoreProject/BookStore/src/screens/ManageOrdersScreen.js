import React, { useEffect, useState } from 'react';
import {
    View, Text, FlatList, StyleSheet,
    TouchableOpacity, ActivityIndicator, Alert
} from 'react-native';
import orderApi from '../api/orderApi';

const ManageOrdersScreen = ({ navigation }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAllOrders();
    }, []);

    const loadAllOrders = async () => {
        try {
            const res = await orderApi.getAllOrders();
            setOrders(res.data);
        } catch (error) {
            console.error("❌ Lỗi lấy đơn hàng:", error);
            Alert.alert('Lỗi', 'Không thể tải danh sách đơn hàng');
        } finally {
            setLoading(false);
        }
    };

    const getStatusText = (status) => {
        if (status === 0) return 'Đang xử lý';
        if (status === 1) return 'Đang giao';
        if (status === 2) return 'Hoàn thành';
        return 'Không rõ';
    };

    const getStatusColor = (status) => {
        if (status === 0) return '#FF9800';
        if (status === 1) return '#2196F3';
        if (status === 2) return '#4CAF50';
        return '#999';
    };

    const handleUpdateStatus = (orderId, currentStatus) => {
        const statusOptions = [
            { text: 'Đang xử lý (0)', value: 0 },
            { text: 'Đang giao hàng (1)', value: 1 },
            { text: 'Hoàn thành (2)', value: 2 }
        ];

        Alert.alert(
            'Cập nhật trạng thái',
            `Đơn hàng #${orderId} - Trạng thái hiện tại: ${getStatusText(currentStatus)}`,
            [
                ...statusOptions.map(option => ({
                    text: option.text,
                    onPress: () => updateOrderStatus(orderId, option.value)
                })),
                { text: 'Hủy', style: 'cancel' }
            ]
        );
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            await orderApi.updateOrderStatus(orderId, newStatus);
            Alert.alert('Thành công', 'Đã cập nhật trạng thái đơn hàng');
            loadAllOrders(); // Reload lại danh sách
        } catch (error) {
            console.error('❌ Lỗi cập nhật:', error);
            Alert.alert('Lỗi', 'Không thể cập nhật trạng thái');
        }
    };

    const renderOrderItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.orderCard}
            onPress={() => handleUpdateStatus(item.orderId, item.status)}
        >
            <View style={styles.orderHeader}>
                <Text style={styles.orderId}>#{item.orderId}</Text>
                <Text style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                    {getStatusText(item.status)}
                </Text>
            </View>
            <Text style={styles.orderDate}>
                📅 {new Date(item.orderDate).toLocaleDateString('vi-VN')}
            </Text>
            <Text style={styles.customerName}>👤 {item.customerName}</Text>
            <Text style={styles.orderTotal}>
                💰 {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.totalAmount)}
            </Text>
            <Text style={styles.tapHint}>👆 Nhấn để cập nhật trạng thái</Text>
        </TouchableOpacity>
    );

    if (loading) {
        return <ActivityIndicator size="large" color="#1976d2" style={{ flex: 1 }} />;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backText}>{"< Quay lại"}</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Quản lý Đơn hàng</Text>
                <TouchableOpacity onPress={loadAllOrders}>
                    <Text style={styles.refreshText}>🔄</Text>
                </TouchableOpacity>
            </View>

            {orders.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>📦</Text>
                    <Text style={styles.emptyTitle}>Chưa có đơn hàng nào</Text>
                </View>
            ) : (
                <FlatList
                    data={orders}
                    keyExtractor={(item) => item.orderId.toString()}
                    renderItem={renderOrderItem}
                    contentContainerStyle={styles.listContent}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 50,
        paddingBottom: 15,
        paddingHorizontal: 15,
        backgroundColor: '#1976d2',
        elevation: 4
    },
    backText: { color: 'white', fontSize: 16 },
    headerTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    refreshText: { color: 'white', fontSize: 20 },
    listContent: { padding: 15 },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyText: { fontSize: 80, marginBottom: 20 },
    emptyTitle: { fontSize: 20, fontWeight: 'bold', color: '#666' },
    orderCard: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        elevation: 2
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10
    },
    orderId: { fontSize: 16, fontWeight: 'bold', color: '#1976d2' },
    orderDate: { fontSize: 14, color: '#666', marginBottom: 5 },
    customerName: { fontSize: 14, marginBottom: 5, color: '#333' },
    orderTotal: { fontSize: 16, fontWeight: 'bold', color: '#d32f2f', marginBottom: 5 },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
        overflow: 'hidden'
    },
    tapHint: { fontSize: 12, color: '#1976d2', fontStyle: 'italic', marginTop: 5 }
});

export default ManageOrdersScreen;
