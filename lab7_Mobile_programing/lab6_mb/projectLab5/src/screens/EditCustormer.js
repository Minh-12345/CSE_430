import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { getCustomerById, updateCustomer } from '../services/api';

const EditCustomer = ({ navigation, route }) => {
  const { itemId } = route.params;
  const [customerInfo, setCustomerInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const loadCustomerData = async () => {
    setIsLoading(true);
    try {
      const result = await getCustomerById(itemId);
      setCustomerInfo(result);
      setCustomerName(result.name ?? '');
      setPhoneNumber(result.phone != null ? String(result.phone) : '0');
    } catch (err) {
      console.error('Lỗi tải thông tin:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadCustomerData();
    });

    loadCustomerData();
    return unsubscribe;
  }, [navigation]);

  const handlePhoneInput = text => {
    const cleaned = text.replace(/[^0-9]/g, '');
    setPhoneNumber(cleaned);
  };
  
  const saveCustomerInfo = async () => {
    const name = customerName.trim();
    const phone = Number(phoneNumber || 0);

    if (!name) {
      Alert.alert('Lỗi', 'Tên không được để trống');
      return;
    }
    if (isNaN(phone)) {
      Alert.alert('Lỗi', 'Số điện thoại không hợp lệ');
      return;
    }

    setIsSaving(true);
    try {
      const result = await updateCustomer(itemId, name, String(phone));

      if (result) {
        setCustomerInfo(result);
        setCustomerName(result.name ?? name);
        setPhoneNumber(
          result.phone != null ? String(result.phone) : String(phone),
        );
      }

      Alert.alert('Thành công', 'Đã cập nhật thông tin thành công.', [
        {
          text: 'Đồng ý',
          onPress: () => navigation.navigate('CustomerDetail', { itemId: customerInfo._id }),
        },
      ]);
    } catch (err) {
      console.error('Lỗi cập nhật:', err);
      Alert.alert('Lỗi', 'Không thể cập nhật thông tin khách hàng');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#f57377ff" />
      </View>
    );
  }

  if (!customerInfo) {
    return (
      <View style={styles.notFoundContainer}>
        <Text>Không tìm thấy khách hàng</Text>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.formCard}>
        <Text style={styles.inputLabel}>Customer name *</Text>
        <TextInput
          value={customerName}
          onChangeText={setCustomerName}
          placeholder="Input customer name"
          placeholderTextColor="#666"
          style={styles.inputField}
          returnKeyType="done"
          autoCapitalize="words"
        />

        <Text style={[styles.inputLabel, { marginTop: 16 }]}>Phone *</Text>
        <TextInput
          value={phoneNumber}
          onChangeText={handlePhoneInput}
          placeholder="0"
          placeholderTextColor="#666"
          keyboardType="numeric"
          style={styles.inputField}
          returnKeyType="done"
        />

        <TouchableOpacity
          style={[styles.saveButton, isSaving && styles.disabledButton]}
          onPress={saveCustomerInfo}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Update</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: { 
    flex: 1, 
    backgroundColor: '#f9f9faff',
    padding: 12,
  },
  centerContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
  },
  formCard: {
    backgroundColor: '#dcdcdeff',
    borderRadius: 12,
    padding: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#1e1d1dff',
    marginBottom: 8,
    fontWeight: '600',
  },
  inputField: {
    backgroundColor: '#efeff1ff',
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#1d1c1cff',
  },
  saveButton: {
    backgroundColor: '#ff6babff',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  disabledButton: { 
    opacity: 0.6 
  },
  saveButtonText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: '700' 
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#2C2C2E',
  },
});

export default EditCustomer;