import React, { useState } from 'react';
import { 
    View, Text, TextInput, TouchableOpacity, 
    StyleSheet, Alert, Image 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import userApi from '../api/userApi'; 

const LoginScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        if (!username || !password) {
            Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ thông tin');
            return;
        }

        try {
            const res = await userApi.login({ username, password });
            
            if (res.data) {
                
                const userData = {
                    ...res.data,
                    userId: parseInt(res.data.userId || res.data.UserID || res.data.id),
                    UserID: parseInt(res.data.userId || res.data.UserID || res.data.id),
                    id: parseInt(res.data.userId || res.data.UserID || res.data.id)
                };
                
                await AsyncStorage.setItem('user', JSON.stringify(userData));
                
                const userRole = userData.role || userData.Role;
                const userName = userData.fullName || userData.FullName;
                
                if (userRole === 'Admin') {
                    Alert.alert('Chào Admin', 'Chào mừng quản trị viên ' + userName, [
                        { text: 'OK', onPress: () => navigation.replace('AdminDashboard') }
                    ]);
                } else {
                    Alert.alert('Thành công', 'Chào mừng ' + userName, [
                        { text: 'OK', onPress: () => navigation.replace('Home') }
                    ]);
                }
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Lỗi', 'Sai tài khoản hoặc mật khẩu!');
        }
    };

    return (
        <View style={styles.container}>
            {/* Logo hoặc Tiêu đề */}
            <View style={styles.header}>
                <Text style={styles.logoText}>BOOK STORE</Text>
                <Text style={styles.subText}>Thế giới sách trong tầm tay</Text>
            </View>

            <View style={styles.form}>
                <Text style={styles.label}>Tài khoản</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Nhập tài khoản..."
                    value={username}
                    onChangeText={setUsername}
                />

                <Text style={styles.label}>Mật khẩu</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Nhập mật khẩu..."
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />

                <TouchableOpacity style={styles.btnLogin} onPress={handleLogin}>
                    <Text style={styles.txtLogin}>ĐĂNG NHẬP</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.btnRegister} 
                    onPress={() => navigation.navigate('Register')}
                >
                    <Text style={styles.txtRegister}>Chưa có tài khoản? Đăng ký ngay</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5', justifyContent: 'center' },
    header: { alignItems: 'center', marginBottom: 40 },
    logoText: { fontSize: 32, fontWeight: 'bold', color: '#007AFF' },
    subText: { fontSize: 16, color: '#666', marginTop: 5 },
    form: { paddingHorizontal: 20 },
    label: { fontSize: 16, color: '#333', marginBottom: 5, fontWeight: '600' },
    input: { 
        backgroundColor: 'white', height: 50, borderRadius: 8, 
        paddingHorizontal: 15, marginBottom: 20, borderWidth: 1, borderColor: '#ddd' 
    },
    btnLogin: { 
        backgroundColor: '#007AFF', height: 50, borderRadius: 8, 
        justifyContent: 'center', alignItems: 'center', marginTop: 10, shadowColor: "#000", shadowOpacity: 0.2, elevation: 3
    },
    txtLogin: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    btnRegister: { marginTop: 20, alignItems: 'center' },
    txtRegister: { color: '#007AFF', fontSize: 16 }
});

export default LoginScreen;