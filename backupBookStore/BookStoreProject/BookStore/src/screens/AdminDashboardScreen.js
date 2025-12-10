import React, { useEffect, useState } from 'react';
import { 
    View, Text, TouchableOpacity, StyleSheet, 
    ScrollView, Alert 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AdminDashboardScreen = ({ navigation }) => {
    const [admin, setAdmin] = useState(null);

    useEffect(() => {
        const loadAdmin = async () => {
            const userJson = await AsyncStorage.getItem('user');
            if (userJson) {
                const user = JSON.parse(userJson);
                if (user.role !== 'Admin' && user.Role !== 'Admin') {
                    Alert.alert('Không có quyền', 'Bạn không phải là admin!', [
                        { text: 'OK', onPress: () => navigation.replace('Home') }
                    ]);
                    return;
                }
                setAdmin(user);
            }
        };
        loadAdmin();
    }, []);

    const handleLogout = async () => {
        Alert.alert('Xác nhận', 'Bạn có chắc muốn đăng xuất?', [
            { text: 'Hủy', style: 'cancel' },
            { 
                text: 'Đăng xuất', 
                onPress: async () => {
                    await AsyncStorage.removeItem('user');
                    navigation.replace('Login');
                }
            }
        ]);
    };

    if (!admin) return null;

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>🔧 QUẢN TRỊ HỆ THỐNG</Text>
                <Text style={styles.adminName}>Admin: {admin.fullName || admin.FullName}</Text>
            </View>

            <ScrollView style={styles.content}>
                {/* Dashboard Cards */}
                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <Text style={styles.statIcon}>📚</Text>
                        <Text style={styles.statTitle}>Quản lý Sách</Text>
                        <Text style={styles.statDesc}>Thêm, sửa, xóa sách</Text>
                    </View>

                    <View style={styles.statCard}>
                        <Text style={styles.statIcon}>📦</Text>
                        <Text style={styles.statTitle}>Đơn hàng</Text>
                        <Text style={styles.statDesc}>Xem tất cả đơn</Text>
                    </View>

                    <View style={styles.statCard}>
                        <Text style={styles.statIcon}>👥</Text>
                        <Text style={styles.statTitle}>Người dùng</Text>
                        <Text style={styles.statDesc}>Quản lý user</Text>
                    </View>

                    <View style={styles.statCard}>
                        <Text style={styles.statIcon}>📊</Text>
                        <Text style={styles.statTitle}>Thống kê</Text>
                        <Text style={styles.statDesc}>Báo cáo doanh thu</Text>
                    </View>
                </View>

                {/* Menu Actions */}
                <View style={styles.menuSection}>
                    <Text style={styles.sectionTitle}>Chức năng quản lý</Text>

                    <TouchableOpacity 
                        style={styles.menuItem}
                        onPress={() => navigation.navigate('ManageBooks')}
                    >
                        <Text style={styles.menuIcon}>📚</Text>
                        <View style={styles.menuContent}>
                            <Text style={styles.menuTitle}>Quản lý Sách</Text>
                            <Text style={styles.menuDesc}>Thêm, sửa, xóa sách trong kho</Text>
                        </View>
                        <Text style={styles.menuArrow}>›</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.menuItem}
                        onPress={() => navigation.navigate('ManageOrders')}
                    >
                        <Text style={styles.menuIcon}>📦</Text>
                        <View style={styles.menuContent}>
                            <Text style={styles.menuTitle}>Quản lý Đơn hàng</Text>
                            <Text style={styles.menuDesc}>Xem và xử lý đơn hàng</Text>
                        </View>
                        <Text style={styles.menuArrow}>›</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.menuItem}
                        onPress={() => navigation.navigate('ManageUsers')}
                    >
                        <Text style={styles.menuIcon}>👥</Text>
                        <View style={styles.menuContent}>
                            <Text style={styles.menuTitle}>Quản lý Người dùng</Text>
                            <Text style={styles.menuDesc}>Xem danh sách khách hàng</Text>
                        </View>
                        <Text style={styles.menuArrow}>›</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.menuItem, styles.logoutItem]}
                        onPress={handleLogout}
                    >
                        <Text style={styles.menuIcon}>🚪</Text>
                        <View style={styles.menuContent}>
                            <Text style={[styles.menuTitle, { color: '#d32f2f' }]}>Đăng xuất</Text>
                            <Text style={styles.menuDesc}>Thoát khỏi tài khoản admin</Text>
                        </View>
                        <Text style={styles.menuArrow}>›</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#f5f5f5' 
    },
    header: {
        backgroundColor: '#1976d2',
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 20,
        elevation: 4
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 5
    },
    adminName: {
        fontSize: 14,
        color: '#e3f2fd'
    },
    content: {
        flex: 1,
        padding: 15
    },
    statsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 20
    },
    statCard: {
        width: '48%',
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        elevation: 2,
        alignItems: 'center'
    },
    statIcon: {
        fontSize: 40,
        marginBottom: 10
    },
    statTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5
    },
    statDesc: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center'
    },
    menuSection: {
        marginBottom: 20
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        elevation: 2
    },
    logoutItem: {
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#ffcdd2'
    },
    menuIcon: {
        fontSize: 30,
        marginRight: 15
    },
    menuContent: {
        flex: 1
    },
    menuTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 3
    },
    menuDesc: {
        fontSize: 13,
        color: '#666'
    },
    menuArrow: {
        fontSize: 30,
        color: '#ccc',
        fontWeight: 'bold'
    }
});

export default AdminDashboardScreen;
