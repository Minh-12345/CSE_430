import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getTransactions } from '../services/api';
import Icon from 'react-native-vector-icons/Ionicons';

export default function TransactionScreen({ navigation }) {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        loadTransactions();

        const unsubscribe = navigation.addListener('focus', () => {
            loadTransactions();
        });

        return unsubscribe;
    }, [navigation]);

    const loadTransactions = async () => {
        try {
            const data = await getTransactions();
            setTransactions(data);
        } catch (error) {
            Alert.alert('Error', 'Failed to load transactions');
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    };

    const renderTransactionItem = ({ item }) => {
        const status = item.status === 'cancelled' ? 'Cancelled' : '';
        const statusColor = item.status === 'cancelled' ? '#ff5252' : '#666';

        return (
            <TouchableOpacity
                style={styles.transactionCard}
                onPress={() => navigation.navigate('TransactionDetail', { itemId: item._id })}
                activeOpacity={0.7}
            >
                <View style={styles.transactionHeader}>
                    <Text style={styles.transactionCode}>{item._id} - {formatDate(item.createdAt)}</Text>
                    {status && <Text style={[styles.statusText, { color: statusColor }]}>{status}</Text>}
                </View>

                <View style={styles.serviceList}>
                    {item.services && item.services.slice(0, 2).map((service, index) => (
                        <Text key={index} style={styles.serviceName}>- {service.name}</Text>
                    ))}
                </View>

                <View style={styles.transactionFooter}>
                    <Text style={styles.customerText}>Customer: {item.customer?.name || 'N/A'}</Text>
                    <Text style={styles.priceText}>{item.price?.toLocaleString() || 0} đ</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Transaction</Text>
            </View>

            {/* Transaction List */}
            <FlatList
                data={transactions}
                keyExtractor={(item) => item._id}
                renderItem={renderTransactionItem}
                contentContainerStyle={styles.listContent}
            />

            {/* Floating Action Button */}
            <TouchableOpacity 
                style={styles.fab}
                onPress={() => navigation.navigate('AddTransaction')}
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
                <TouchableOpacity style={styles.navItem}>
                    <Icon name="card" size={24} color="#E91E63" />
                    <Text style={styles.navTextActive}>Transaction</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.navItem}
                    onPress={() => navigation.navigate('Customer')}
                >
                    <Icon name="people-outline" size={24} color="#999" />
                    <Text style={styles.navText}>Customer</Text>
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
    transactionCard: {
        backgroundColor: '#fff',
        padding: 15,
        marginVertical: 5,
        marginHorizontal: 10,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    transactionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    transactionCode: {
        fontSize: 12,
        color: '#333',
        fontWeight: '500',
        flex: 1,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '500',
    },
    serviceList: {
        marginBottom: 8,
    },
    serviceName: {
        fontSize: 12,
        color: '#666',
        marginBottom: 2,
    },
    transactionFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 5,
    },
    customerText: {
        fontSize: 12,
        color: '#666',
    },
    priceText: {
        fontSize: 14,
        color: '#E91E63',
        fontWeight: 'bold',
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
