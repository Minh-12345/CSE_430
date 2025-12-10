import React, { useEffect, useState } from 'react';
import {
    View, Text, FlatList, StyleSheet,
    TouchableOpacity, ActivityIndicator, Alert, Modal, TextInput, ScrollView
} from 'react-native';
import userApi from '../api/userApi';

const ManageUsersScreen = ({ navigation }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        address: ''
    });

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const response = await userApi.getAllUsers();
            setUsers(response.data);
        } catch (error) {
            Alert.alert('Error', 'Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleEditUser = (user) => {
        setSelectedUser(user);
        setFormData({
            fullName: user.fullName || '',
            phone: user.phone || '',
            address: user.address || ''
        });
        setModalVisible(true);
    };

    const handleSaveUser = async () => {
        if (!formData.fullName) {
            Alert.alert('Error', 'Full name is required');
            return;
        }

        try {
            await userApi.updateUser(selectedUser.userId, formData);
            Alert.alert('Success', 'User updated successfully');
            setModalVisible(false);
            loadUsers();
        } catch (error) {
            Alert.alert('Error', 'Failed to update user');
        }
    };

    const handleRoleChange = (user) => {
        Alert.alert(
            'Change Role',
            `Current role: ${user.role}`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Set Admin',
                    onPress: () => updateRole(user.userId, 'Admin')
                },
                {
                    text: 'Set User',
                    onPress: () => updateRole(user.userId, 'User')
                }
            ]
        );
    };

    const updateRole = async (userId, role) => {
        try {
            await userApi.updateUserRole(userId, role);
            Alert.alert('Success', 'Role updated successfully');
            loadUsers();
        } catch (error) {
            Alert.alert('Error', 'Failed to update role');
        }
    };

    const handleDelete = (user) => {
        Alert.alert(
            'Delete User',
            `Are you sure you want to delete ${user.fullName}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => deleteUser(user.userId)
                }
            ]
        );
    };

    const deleteUser = async (userId) => {
        try {
            await userApi.deleteUser(userId);
            Alert.alert('Success', 'User deleted successfully');
            loadUsers();
        } catch (error) {
            Alert.alert('Error', 'Failed to delete user');
        }
    };

    const renderUserItem = ({ item }) => (
        <View style={styles.userCard}>
            <TouchableOpacity 
                style={styles.userMainInfo}
                onPress={() => handleEditUser(item)}
            >
                <View style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarText}>{item.fullName?.charAt(0)}</Text>
                </View>
                <View style={styles.userInfo}>
                    <Text style={styles.userName}>{item.fullName}</Text>
                    <Text style={styles.userEmail}>@{item.username}</Text>
                    <Text style={styles.userPhone}>{item.phone || 'No phone'}</Text>
                    <TouchableOpacity onPress={() => handleRoleChange(item)}>
                        <Text style={styles.userRole}>
                            {item.role === 'Admin' ? '👑 Admin' : '👤 User'} (Tap to change)
                        </Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
            <View style={styles.actions}>
                <TouchableOpacity 
                    style={styles.editBtn}
                    onPress={() => handleEditUser(item)}
                >
                    <Text style={styles.editText}>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.deleteBtn}
                    onPress={() => handleDelete(item)}
                >
                    <Text style={styles.deleteText}>🗑️</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text style={styles.backText}>{"< Back"}</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Manage Users</Text>
                    <View style={{ width: 50 }} />
                </View>
                <ActivityIndicator size="large" color="#1976d2" style={styles.loader} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backText}>{"< Back"}</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Manage Users</Text>
                <View style={{ width: 50 }} />
            </View>

            <FlatList
                data={users}
                renderItem={renderUserItem}
                keyExtractor={item => item.userId.toString()}
                contentContainerStyle={styles.listContent}
            />

            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Edit User Information</Text>

                        <ScrollView style={styles.formScroll} showsVerticalScrollIndicator={false}>
                            <Text style={styles.label}>Full Name *</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.fullName}
                                onChangeText={(text) => setFormData({...formData, fullName: text})}
                                placeholder="Enter full name"
                            />

                            <Text style={styles.label}>Phone Number</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.phone}
                                onChangeText={(text) => setFormData({...formData, phone: text})}
                                placeholder="Enter phone number"
                                keyboardType="phone-pad"
                            />

                            <Text style={styles.label}>Address</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                value={formData.address}
                                onChangeText={(text) => setFormData({...formData, address: text})}
                                placeholder="Enter address"
                                multiline
                                numberOfLines={3}
                            />
                        </ScrollView>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.btnModal, styles.btnCancel]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.btnCancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.btnModal, styles.btnSave]}
                                onPress={handleSaveUser}
                            >
                                <Text style={styles.btnSaveText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    listContent: { padding: 15 },
    userCard: {
        flexDirection: 'row',
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        elevation: 2,
        alignItems: 'center'
    },
    userMainInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    avatarPlaceholder: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#1976d2',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15
    },
    avatarText: { color: 'white', fontSize: 20, fontWeight: 'bold' },
    userInfo: { flex: 1 },
    userName: { fontSize: 16, fontWeight: 'bold', marginBottom: 3 },
    userEmail: { fontSize: 14, color: '#666', marginBottom: 3 },
    userPhone: { fontSize: 12, color: '#888', marginBottom: 3 },
    userRole: { fontSize: 12, color: '#1976d2', marginTop: 3 },
    actions: { flexDirection: 'row' },
    editBtn: { padding: 8, marginRight: 5 },
    editText: { fontSize: 20 },
    deleteBtn: { padding: 8 },
    deleteText: { fontSize: 20 },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modalContent: {
        width: '90%',
        maxHeight: '70%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10
    },
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
    formScroll: { maxHeight: 300 },
    label: { fontSize: 14, fontWeight: 'bold', marginTop: 10, marginBottom: 5, color: '#333' },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
        fontSize: 14,
        backgroundColor: '#f9f9f9'
    },
    textArea: { height: 80, textAlignVertical: 'top' },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20
    },
    btnModal: {
        flex: 1,
        padding: 12,
        borderRadius: 5,
        alignItems: 'center',
        marginHorizontal: 5
    },
    btnCancel: { backgroundColor: '#f5f5f5', borderWidth: 1, borderColor: '#ddd' },
    btnCancelText: { color: '#666', fontWeight: 'bold' },
    btnSave: { backgroundColor: '#1976d2' },
    btnSaveText: { color: 'white', fontWeight: 'bold' }
});

export default ManageUsersScreen;
