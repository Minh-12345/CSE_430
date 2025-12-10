import React, { useState } from 'react';
import { 
    View, Text, TextInput, TouchableOpacity, 
    StyleSheet, Alert, ActivityIndicator 
} from 'react-native';
import userApi from '../api/userApi';

const RegisterScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!username || !password || !fullName) {
            Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin!");
            return;
        }

        setLoading(true);
        try {
            const userData = {
                username: username,
                passwordHash: password,
                fullName: fullName,
                phone: phone,
                address: "Vietnam"
            };

            const response = await userApi.register(userData);

            setLoading(false);
            Alert.alert("Thành công", "Tạo tài khoản thành công!", [
                { text: "OK", onPress: () => navigation.navigate("Login") }
            ]);

        } catch (error) {
            setLoading(false);
            Alert.alert("Thất bại", "Tên tài khoản có thể đã tồn tại hoặc lỗi mạng.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>ĐĂNG KÝ</Text>

            <TextInput
                style={styles.input}
                placeholder="Tên đăng nhập"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                placeholder="Mật khẩu"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <TextInput
                style={styles.input}
                placeholder="Họ và tên"
                value={fullName}
                onChangeText={setFullName}
            />
            <TextInput
                style={styles.input}
                placeholder="Số điện thoại"
                keyboardType="numeric"
                value={phone}
                onChangeText={setPhone}
            />

            <TouchableOpacity 
                style={styles.button} 
                onPress={handleRegister}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>ĐĂNG KÝ NGAY</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.link}>Đã có tài khoản? Đăng nhập</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#fff' },
    title: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 30, textAlign: 'center' },
    input: { 
        height: 50, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, 
        paddingHorizontal: 15, marginBottom: 15, fontSize: 16 
    },
    button: { 
        height: 50, backgroundColor: '#007AFF', borderRadius: 8, 
        justifyContent: 'center', alignItems: 'center', marginTop: 10 
    },
    buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    link: { marginTop: 20, textAlign: 'center', color: '#007AFF', fontSize: 16 }
});

export default RegisterScreen;