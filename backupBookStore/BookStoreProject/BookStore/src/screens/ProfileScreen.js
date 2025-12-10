import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = ({ navigation }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loadUser = async () => {
            const userJson = await AsyncStorage.getItem('user');
            if (userJson) setUser(JSON.parse(userJson));
        };
        loadUser();
    }, []);

    const handleLogout = async () => {
        await AsyncStorage.removeItem('user');
        navigation.replace('Login');
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>TÀI KHOẢN</Text>
            </View>

            <View style={styles.infoSection}>
                <View style={styles.avatarPlaceholder}><Text style={styles.avatarText}>{user?.fullName?.charAt(0)}</Text></View>
                <Text style={styles.name}>{user?.fullName}</Text>
                <Text style={styles.username}>@{user?.username}</Text>
            </View>

            <View style={styles.menu}>
                <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('EditProfile')}>
                    <Text style={styles.menuText}>✏️  Edit Profile</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={() => navigation.getParent()?.navigate('OrderHistory')}>
                    <Text style={styles.menuText}>📦  Order History</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                    <Text style={[styles.menuText, { color: 'red' }]}>🚪  Logout</Text>
                </TouchableOpacity>
            </View>
            
             <TouchableOpacity style={styles.btnHome} onPress={() => navigation.navigate('Home')}>
                    <Text style={{color:'white'}}>Về trang chủ</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    header: { paddingTop: 50, paddingBottom: 20, alignItems: 'center', backgroundColor: 'white' },
    title: { fontSize: 20, fontWeight: 'bold' },
    infoSection: { alignItems: 'center', marginTop: 20, marginBottom: 30 },
    avatarPlaceholder: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#ddd', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
    avatarText: { fontSize: 30, fontWeight: 'bold', color: '#555' },
    name: { fontSize: 22, fontWeight: 'bold' },
    username: { color: '#666' },
    menu: { paddingHorizontal: 20 },
    menuItem: { backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 10, elevation: 1 },
    menuText: { fontSize: 16, fontWeight: '600' },
    btnHome: { margin: 20, padding: 15, backgroundColor: '#007AFF', borderRadius: 8, alignItems: 'center'}
});

export default ProfileScreen;