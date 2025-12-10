import React, { useState, useEffect } from 'react';
import {
    View, Text, TextInput, StyleSheet,
    TouchableOpacity, Alert, ScrollView, ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import userApi from '../api/userApi';

const EditProfileScreen = ({ navigation }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        address: '',
        password: ''
    });
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const userJson = await AsyncStorage.getItem('user');
            if (userJson) {
                const user = JSON.parse(userJson);
                setUserId(user.userId);
                setFormData({
                    fullName: user.fullName || '',
                    phone: user.phone || '',
                    address: user.address || '',
                    password: ''
                });
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    };

    const handleSave = async () => {
        if (!formData.fullName) {
            Alert.alert('Error', 'Please enter your full name');
            return;
        }

        setLoading(true);
        try {
            const updateData = {
                fullName: formData.fullName,
                phone: formData.phone,
                address: formData.address
            };

            if (formData.password) {
                updateData.password = formData.password;
            }

            await userApi.updateUser(userId, updateData);

            const userJson = await AsyncStorage.getItem('user');
            const user = JSON.parse(userJson);
            user.fullName = formData.fullName;
            user.phone = formData.phone;
            user.address = formData.address;
            await AsyncStorage.setItem('user', JSON.stringify(user));

            Alert.alert('Success', 'Profile updated successfully');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', 'Failed to update profile');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backText}>{"< Back"}</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profile</Text>
                <View style={{ width: 50 }} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={styles.label}>Full Name *</Text>
                <TextInput
                    style={styles.input}
                    value={formData.fullName}
                    onChangeText={(text) => setFormData({...formData, fullName: text})}
                    placeholder="Enter your full name"
                />

                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                    style={styles.input}
                    value={formData.phone}
                    onChangeText={(text) => setFormData({...formData, phone: text})}
                    placeholder="Enter your phone number"
                    keyboardType="phone-pad"
                />

                <Text style={styles.label}>Address</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    value={formData.address}
                    onChangeText={(text) => setFormData({...formData, address: text})}
                    placeholder="Enter your address"
                    multiline
                    numberOfLines={3}
                />

                <Text style={styles.label}>New Password (leave blank to keep current)</Text>
                <TextInput
                    style={styles.input}
                    value={formData.password}
                    onChangeText={(text) => setFormData({...formData, password: text})}
                    placeholder="Enter new password"
                    secureTextEntry
                />

                <TouchableOpacity
                    style={styles.btnSave}
                    onPress={handleSave}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={styles.btnSaveText}>Save Changes</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
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
    content: { flex: 1, padding: 20 },
    label: { fontSize: 14, fontWeight: 'bold', marginTop: 15, marginBottom: 5, color: '#333' },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 14,
        backgroundColor: 'white'
    },
    textArea: { height: 80, textAlignVertical: 'top' },
    btnSave: {
        backgroundColor: '#1976d2',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 20
    },
    btnSaveText: { color: 'white', fontSize: 16, fontWeight: 'bold' }
});

export default EditProfileScreen;
