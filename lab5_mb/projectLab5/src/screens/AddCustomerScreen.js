import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { addCustomer } from '../services/api';

export default function AddCustomerScreen({ navigation }) {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');

    const handleAddCustomer = async () => {
        if (!name.trim()) {
            Alert.alert('Error', 'Please enter customer name');
            return;
        }
        if (!phone.trim()) {
            Alert.alert('Error', 'Please enter phone number');
            return;
        }

        try {
            await addCustomer(name, phone);
            Alert.alert('Success', 'Customer added successfully');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', 'Failed to add customer');
        }
    };

    return (
        <View style={styles.container}>
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

                <TouchableOpacity style={styles.addButton} onPress={handleAddCustomer}>
                    <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    form: {
        flex: 1,
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
    addButton: {
        backgroundColor: '#E91E63',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 30,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
