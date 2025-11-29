import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { getTransactionById } from '../services/api';
import Icon from 'react-native-vector-icons/Ionicons';

export default function TransactionDetailScreen({ route, navigation }) {
    const { id } = route.params;
    const [transaction, setTransaction] = useState(null);

    useEffect(() => {
        loadTransactionDetail();
    }, []);

    const loadTransactionDetail = async () => {
        try {
            const data = await getTransactionById(id);
            setTransaction(data);
        } catch (error) {
            Alert.alert('Error', 'Failed to load transaction details');
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    };

    if (!transaction) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    const totalService = transaction.services?.reduce((sum, service) => {
        return sum + (service.price * service.quantity);
    }, 0) || 0;

    const discount = transaction.priceBeforePromotion - transaction.price || 0;

    return (
        <ScrollView style={styles.container}>
            {/* General Information Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>General information</Text>

                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Transaction code</Text>
                    <Text style={styles.infoValue}>{transaction._id}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Customer</Text>
                    <Text style={styles.infoValue}>{transaction.customer?.name || 'N/A'} - {transaction.customer?.phone || ''}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Creation time</Text>
                    <Text style={styles.infoValue}>{formatDate(transaction.createdAt)}</Text>
                </View>
            </View>

            {/* Services List Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Services list</Text>

                {transaction.services && transaction.services.map((service, index) => (
                    <View key={index} style={styles.serviceItem}>
                        <View style={styles.serviceInfo}>
                            <Text style={styles.serviceName}>{service.name}</Text>
                            <Text style={styles.serviceQuantity}>x{service.quantity}</Text>
                        </View>
                        <Text style={styles.servicePrice}>{(service.price * service.quantity).toLocaleString()} đ</Text>
                    </View>
                ))}

                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalValue}>{totalService.toLocaleString()} đ</Text>
                </View>
            </View>

            {/* Cost Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Cost</Text>

                <View style={styles.costRow}>
                    <Text style={styles.costLabel}>Amount of money</Text>
                    <Text style={styles.costValue}>{totalService.toLocaleString()} đ</Text>
                </View>

                <View style={styles.costRow}>
                    <Text style={styles.costLabel}>Discount</Text>
                    <Text style={styles.discountValue}>-{discount.toLocaleString()} đ</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.finalRow}>
                    <Text style={styles.finalLabel}>Total payment</Text>
                    <Text style={styles.finalValue}>{transaction.price?.toLocaleString() || 0} đ</Text>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    loadingText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        color: '#666',
    },
    section: {
        backgroundColor: '#fff',
        padding: 15,
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#E91E63',
        marginBottom: 15,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    infoLabel: {
        fontSize: 13,
        color: '#666',
        flex: 1,
    },
    infoValue: {
        fontSize: 13,
        color: '#333',
        flex: 2,
        textAlign: 'right',
    },
    serviceItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    serviceInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    serviceName: {
        fontSize: 13,
        color: '#333',
        flex: 1,
    },
    serviceQuantity: {
        fontSize: 12,
        color: '#666',
    },
    servicePrice: {
        fontSize: 13,
        color: '#333',
        fontWeight: '500',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    totalLabel: {
        fontSize: 13,
        fontWeight: '500',
        color: '#333',
    },
    totalValue: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#333',
    },
    costRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    costLabel: {
        fontSize: 13,
        color: '#666',
    },
    costValue: {
        fontSize: 13,
        color: '#333',
    },
    discountValue: {
        fontSize: 13,
        color: '#ff5252',
    },
    divider: {
        height: 1,
        backgroundColor: '#e0e0e0',
        marginVertical: 10,
    },
    finalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    finalLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    finalValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#E91E63',
    },
});
