import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';
import { getCustomerById, deleteCustomer } from '../services/api';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

const CustomerDetail = ({ navigation, route }) => {
  const { itemId } = route.params;
  const [customerData, setCustomerData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const formatMoney = val => {
    if (val === undefined || val === null) return '0 ₫';
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' ₫';
  };

  const loadCustomerInfo = async () => {
    try {
      const result = await getCustomerById(itemId);
      setCustomerData(result);
      console.log(result);
    } catch (err) {
      console.error('Error loading customer info:', err);
      Alert.alert('Lỗi', 'Không thể tải thông tin khách hàng');
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  };
  const removeCustomer = () => {
    Alert.alert(
      'Alert',
      'Are you sure you want to remove this client? This will not be possible to return.',
      [
        { text: 'CANCEL', style: 'cancel' },
        { text: 'DELETE', style: 'destructive', onPress: executeDelete },
      ],
      { cancelable: true },
    );
  };
  
  const executeDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteCustomer(itemId);
      Alert.alert('Thành công', 'Đã xóa khách hàng thành công', [
        { text: 'Đồng ý', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      console.error('Lỗi khi xóa:', err);
      const msg = err?.response?.data?.message || 'Không thể xóa khách hàng';
      Alert.alert('Lỗi', msg);
    } finally {
      setIsDeleting(false);
    }
  };
  useEffect(() => {
    loadCustomerInfo();
  }, [itemId]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Menu>
          <MenuTrigger>
            <View style={styles.menuTrigger}>
              <Text style={styles.menuIcon}>⋮</Text>
            </View>
          </MenuTrigger>
          <MenuOptions customStyles={{
            optionsContainer: styles.menuContainer,
          }}>
            <MenuOption
              onSelect={() => navigation.navigate('EditCustomer', { itemId })}
            >
              <View style={styles.menuRow}>
                <EvilIcons name="pencil" size={24} color="#333" />
                <Text style={styles.menuText}>Edit</Text>
              </View>
            </MenuOption>
            <MenuOption onSelect={removeCustomer}>
              <View style={styles.menuRow}>
                <EvilIcons name="trash" size={24} color="#f57377ff" />
                <Text style={styles.deleteText}>Delete</Text>
              </View>
            </MenuOption>
          </MenuOptions>
        </Menu>
      ),
    });
  }, [navigation, itemId, removeCustomer]);

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#f57377ff" />
      </View>
    );
  }
  const formatDateTime = dateString => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };
  if (!customerData) return null;

  return (
    <ScrollView style={styles.mainContainer}>
      <View style={styles.infoCard}>
        <Text style={styles.sectionHeader}>General information</Text>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Name:</Text>
          <Text style={styles.detailValue}>{customerData.name}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Phone:</Text>
          <Text style={styles.detailValue}>{customerData.phone}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Total spent:</Text>
          <Text style={styles.detailValue}>{formatMoney(customerData.totalSpent)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Time:</Text>
          <Text style={styles.detailValue}>
            {new Date(customerData.createdAt).toLocaleString('vi-VN')}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Last update:</Text>
          <Text style={styles.detailValue}>
            {new Date(customerData.updateBy).toLocaleString('vi-VN')}
          </Text>
        </View>
      </View>

      <View style={styles.historyCard}>
        <Text style={styles.sectionHeader}>Transaction history</Text>
        {customerData.transactions && customerData.transactions.length > 0 ? (
          customerData.transactions.map((transaction, index) => {
            const isCancelled = transaction.status === 'cancelled';
            return (
              <View key={transaction._id || index} style={styles.transactionItem}>
                <Text style={styles.transactionId}>
                  {transaction.id} - {formatDateTime(transaction.createdAt)}
                  {isCancelled && <Text style={styles.statusCancelled}> - Đã hủy</Text>}
                </Text>
                <View style={styles.transactionContent}>
                  <View style={styles.serviceList}>
                    {transaction.services.map((svc, idx) => (
                      <Text key={svc._id || idx} style={styles.serviceItem} numberOfLines={2}>
                        - {svc.name}
                      </Text>
                    ))}
                  </View>
                  <Text style={styles.totalPrice}>{formatMoney(transaction.price)}</Text>
                </View>
              </View>
            );
          })
        ) : (
          <View style={styles.emptyWrapper}>
            <Text style={styles.emptyMessage}>Chưa có giao dịch nào</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#dcdce1ff',
    padding: 12,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
  },
  historyCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FF6B6B',
    marginBottom: 12,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  detailLabel: {
    fontSize: 14,
    color: '#1C1C1E',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: '#1C1C1E',
    fontWeight: '600',
    textAlign: 'right',
    flex: 1,
    marginLeft: 10,
  },
  transactionItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#444',
    paddingVertical: 12,
    marginBottom: 8,
  },
  transactionId: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 6,
  },
  transactionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  serviceList: {
    flex: 1,
    marginRight: 10,
  },
  serviceItem: {
    fontSize: 13,
    color: '#1C1C1E',
    marginBottom: 3,
  },
  totalPrice: {
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: '700',
  },
  statusCancelled: {
    color: '#FF6B6B',
    fontWeight: '600',
  },
  emptyWrapper: {
    padding: 20,
    alignItems: 'center',
  },
  emptyMessage: {
    fontSize: 14,
    color: '#B0B0B0',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  menuTrigger: {
    padding: 8,
  },
  menuIcon: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  menuContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  deleteText: {
    fontSize: 16,
    color: '#f57377ff',
    marginLeft: 12,
  },
});

export default CustomerDetail;