import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';
import { getTransactionById, deleteTransaction } from '../services/api';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

const TransactionDetail = ({ navigation, route }) => {
  const { itemId } = route.params;
  const [transactionData, setTransactionData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const formatMoney = val => {
    if (val === undefined || val === null) return '0 ₫';
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' ₫';
  };

  const loadTransactionInfo = async () => {
    try {
      const result = await getTransactionById(itemId);
      setTransactionData(result);
    } catch (err) {
      console.error('Error loading transaction:', err);
      Alert.alert('Lỗi', 'Không thể tải thông tin giao dịch');
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTransactionInfo();
  }, [itemId]);
  const cancelTransaction = () => {
    Alert.alert(
      'Warning',
      'Are you sure you want to cancel this transaction? This will affect the customer transaction information',
      [
        {
          text: 'CANCEL',
          style: 'cancel',
        },
        {
          text: 'YES',
          onPress: async () => {
            try {
              await deleteTransaction(itemId);

              Alert.alert('Thành công', 'Đã hủy giao dịch thành công', [
                { text: 'Đồng ý', onPress: () => navigation.goBack() },
              ]);
            } catch (err) {
              console.error('Hủy giao dịch lỗi:', err);
              Alert.alert('Lỗi', 'Không thể hủy giao dịch');
            }
          },
        },
      ],
    );
  };

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
            <MenuOption onSelect={() => {}}>
              <View style={styles.menuRow}>
                <Text style={styles.menuText}>See more details</Text>
              </View>
            </MenuOption>
            <MenuOption onSelect={cancelTransaction}>
              <View style={styles.menuRow}>
                <Text style={styles.cancelText}>Cancel transaction</Text>
              </View>
            </MenuOption>
          </MenuOptions>
        </Menu>
      ),
    });
  }, [navigation, cancelTransaction]);

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#f57377ff" />
      </View>
    );
  }

  if (!transactionData) return null;

  return (
    <ScrollView style={styles.mainContainer}>
      <View style={styles.sectionCard}>
        <Text style={styles.sectionHeader}>GENERAL INFORMATION</Text>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Transaction code</Text>
          <Text style={styles.detailValue}>{transactionData.id}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Customer</Text>
          <Text style={styles.detailValue}>
            {transactionData.customer?.name || 'Guest'} - {transactionData.customer?.phone || ''}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Creation time</Text>
          <Text style={styles.detailValue}>
            {new Date(transactionData.createdAt).toLocaleString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Status</Text>
          <Text style={[styles.detailValue, { color: transactionData.status === 'cancelled' ? '#FF6B6B' : '#4CAF50' }]}>
            {transactionData.status === 'cancelled' ? 'Cancelled' : 'Completed'}
          </Text>
        </View>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionHeader}>SERVICE LIST</Text>

        {transactionData.services.map((svc, idx) => (
          <View key={svc._id || idx} style={styles.serviceItemRow}>
            <Text style={styles.serviceName}>{svc.name}</Text>
            <Text style={styles.serviceQty}>x{svc.quantity}</Text>
            <Text style={styles.serviceAmount}>{formatMoney(svc.price)}</Text>
          </View>
        ))}

        <View style={styles.dividerLine} />

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Total</Text>
          <Text style={styles.totalAmount}>{formatMoney(transactionData.priceBeforePromotion)}</Text>
        </View>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionHeader}>COST</Text>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Amount of money</Text>
          <Text style={styles.detailValue}>{formatMoney(transactionData.priceBeforePromotion)}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Discount</Text>
          <Text style={styles.detailValue}>- {formatMoney(transactionData.priceBeforePromotion - transactionData.price)}</Text>
        </View>

        <View style={styles.dividerLine} />

        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, styles.boldText]}>Total payment</Text>
          <Text style={styles.finalTotal}>{formatMoney(transactionData.price)}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#cacaccff',
    padding: 12,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FF6B6B',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  detailLabel: {
    fontSize: 14,
    color: '#0f0e0eff',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: '#0f0e0eff',
    fontWeight: '600',
    textAlign: 'right',
    flex: 1,
    marginLeft: 10,
  },
  serviceItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceName: {
    fontSize: 14,
    color: '#0f0e0eff',
    flex: 1,
  },
  serviceQty: {
    fontSize: 14,
    color: '#0f0e0eff',
    marginHorizontal: 12,
    minWidth: 40,
    textAlign: 'center',
  },
  serviceAmount: {
    fontSize: 14,
    color: '#0f0e0eff',
    fontWeight: '600',
    minWidth: 80,
    textAlign: 'right',
  },
  dividerLine: {
    height: 1,
    backgroundColor: '#555',
    marginVertical: 12,
  },
  totalAmount: {
    fontSize: 14,
    color: '#0f0e0eff',
    fontWeight: '700',
    textAlign: 'right',
    flex: 1,
  },
  finalTotal: {
    fontSize: 18,
    color: '#FF6B6B',
    fontWeight: '700',
    textAlign: 'right',
    flex: 1,
  },
  boldText: {
    fontWeight: '700',
    color: '#0f0e0eff',
  },
  cancelText: {
    color: '#FF6B6B',
    fontWeight: '600',
    fontSize: 16,
  },
  menuIcon: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  menuTrigger: {
    padding: 8,
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
  menuRow: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
});

export default TransactionDetail;