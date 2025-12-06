import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet, Alert, Pressable } from 'react-native';
import { addCustomer, updateCustomer } from '../services/api';
import Icon from 'react-native-vector-icons/Ionicons';

export default function AddCustomerScreen({ navigation, route }) {
    const { customer, isEdit } = route.params || {};
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');

    // Quay lại màn hình Customer
    const goBack = () => {
        navigation.navigate('Customer');
    };

    useEffect(() => {
        if (isEdit && customer) {
            setName(customer.name || '');
            setPhone(customer.phone || '');
        }
    }, [customer, isEdit]);

    const handleSubmit = async () => {
        // Validate input trước khi submit
        if (!name.trim()) {
            Alert.alert('Error', 'Please enter customer name');
            return;
        }
        if (!phone.trim()) {
            Alert.alert('Error', 'Please enter phone number');
            return;
        }

        try {
            // Check xem là edit hay add mới
            if (isEdit && customer) {
                await updateCustomer(customer._id, name, phone);
                Alert.alert('Success', 'Customer updated successfully');
            } else {
                await addCustomer(name, phone);
                Alert.alert('Success', 'Customer added successfully');
            }
            navigation.navigate('Customer');
        } catch (error) {
            Alert.alert('Error', isEdit ? 'Failed to update customer' : 'Failed to add customer');
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={goBack} style={styles.backButton}>
                    <Icon name="arrow-back" size={24} color="#fff" />
                </Pressable>
                <Text style={styles.headerTitle}>Add customer</Text>
            </View>

            <View style={styles.form}>
                <Text style={styles.label}>Customer name *</Text>
                <TextInput
                    placeholder="Input your customer's name"
                    value={name}
                    onChangeText={setName}
                    style={styles.input}
                />

                <Text style={styles.label}>Phone *</Text>
                <TextInput
                    placeholder="Input phone number"
                    value={phone}
                    onChangeText={setPhone}
                    style={styles.input}
                    keyboardType="phone-pad"
                />

                <Pressable style={styles.updateButton} onPress={handleSubmit}>
                    <Text style={styles.updateButtonText}>{isEdit ? 'Update' : 'Add'}</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        backgroundColor: '#E91E63',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 10,
        elevation: 4,
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        flex: 1,
        color: '#fff',
        fontSize: 20,
        fontWeight: '600',
        marginLeft: 10,
    },
    form: {
        flex: 1,
        padding: 20,
    },
    label: {
        fontSize: 14,
        color: '#333',
        marginBottom: 8,
        marginTop: 15,
    },
    input: {
        backgroundColor: '#f5f5f5',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        padding: 15,
        borderRadius: 8,
        fontSize: 14,
        color: '#333',
    },
    updateButton: {
        backgroundColor: '#E91E63',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 30,
    },
    updateButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
