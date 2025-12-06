import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getCustomers } from '../services/api';
import Icon from 'react-native-vector-icons/Ionicons';


export default function CustomerScreen({ navigation }) {
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        loadCustomers();

        const unsubscribe = navigation.addListener('focus', () => {
            loadCustomers();
        });

        return unsubscribe;
    }, [navigation]);

    const loadCustomers = async () => {
        try {
            const data = await getCustomers();
            setCustomers(data);
        } catch (error) {
            Alert.alert('Error', 'Failed to load customers');
        }
    };

    const renderCustomerItem = ({ item }) => {
        const loyalty = item.loyalty === 'member' ? 'Member' : 'Guest';
        const loyaltyColor = item.loyalty === 'member' ? '#E91E63' : '#E91E63';

        return (
            <TouchableOpacity
                style={styles.customerCard}
                onPress={() => navigation.navigate('CustomerDetail', { itemId: item._id })}
                activeOpacity={0.7}
            >
                <View style={styles.customerInfo}>
                    <Text style={styles.customerName}>Customer: {item.name}</Text>
                    <Text style={styles.customerPhone}>Phone: {item.phone}</Text>
                    <Text style={styles.totalMoney}>
                        Total money: <Text style={styles.moneyAmount}>{item.totalSpent?.toLocaleString() || 0} đ</Text>
                    </Text>
                </View>
                <View style={styles.loyaltyBadge}>
                    <Icon name="person-circle" size={24} color={loyaltyColor} solid />
                    <Text style={[styles.loyaltyText, { color: loyaltyColor }]}>{loyalty}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Customer</Text>
            </View>

            {/* Customer List */}
            <FlatList
                data={customers}
                keyExtractor={(item) => item._id}
                renderItem={renderCustomerItem}
                contentContainerStyle={styles.listContent}
            />

            {/* Floating Action Button */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('AddCustomer')}
            >
                <Icon name="add" size={28} color="#fff" />
            </TouchableOpacity>

            {/* Bottom Navigation */}
            <View style={styles.bottomNav}>
                <TouchableOpacity
                    style={styles.navItem}
                    onPress={() => navigation.navigate('Home')}
                >
                    <Icon name="home-outline" size={24} color="#999" />
                    <Text style={styles.navText}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.navItem}
                    onPress={() => navigation.navigate('Transaction')}
                >
                    <Icon name="card-outline" size={24} color="#999" />
                    <Text style={styles.navText}>Transaction</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}>
                    <Icon name="people" size={24} color="#E91E63" />
                    <Text style={styles.navTextActive}>Customer</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.navItem}
                    onPress={() => navigation.navigate('Setting')}
                >
                    <Icon name="settings-outline" size={24} color="#999" />
                    <Text style={styles.navText}>Setting</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: '#E91E63',
        padding: 15,
        alignItems: 'center',
    },
    headerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    listContent: {
        padding: 10,
        paddingBottom: 80,
    },
    customerCard: {
        backgroundColor: '#fff',
        padding: 15,
        marginVertical: 5,
        marginHorizontal: 10,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    customerInfo: {
        flex: 1,
    },
    customerName: {
        fontSize: 14,
        color: '#333',
        marginBottom: 4,
    },
    customerPhone: {
        fontSize: 13,
        color: '#666',
        marginBottom: 4,
    },
    totalMoney: {
        fontSize: 13,
        color: '#333',
    },
    moneyAmount: {
        color: '#E91E63',
        fontWeight: 'bold',
    },
    loyaltyBadge: {
        alignItems: 'center',
        marginLeft: 15,
    },
    loyaltyText: {
        fontSize: 11,
        marginTop: 2,
        fontWeight: '500',
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 80,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#E91E63',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    bottomNav: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        paddingVertical: 8,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    navItem: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 5,
        gap: 3,
    },
    navText: {
        fontSize: 11,
        color: '#999',
    },
    navTextActive: {
        fontSize: 11,
        color: '#E91E63',
        fontWeight: 'bold',
    },
});
