import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { getCustomers, getServices, getUsers, addTransaction } from '../services/api';

const AddTransaction = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [customerList, setCustomerList] = useState([]);
  const [serviceList, setServiceList] = useState([]);
  const [executorList, setExecutorList] = useState([]);
  const [chosenCustomer, setChosenCustomer] = useState(null);
  const [chosenServices, setChosenServices] = useState({});
  const [isFocusCustomer, setIsFocusCustomer] = useState(false);

  // Fetch initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [customersResponse, servicesResponse, usersResponse] = await Promise.all([
        getCustomers(),
        getServices(),
        getUsers(),
      ]);

      setCustomerList(customersResponse);
      setServiceList(servicesResponse);
      setExecutorList(usersResponse);
    } catch (err) {
      console.error('Data loading error:', err);
      Alert.alert('Lỗi', 'Không thể tải dữ liệu từ server.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleServiceSelection = (serviceObj, checked) => {
    setChosenServices(currentState => {
      const updatedState = { ...currentState };
      if (checked) {
        updatedState[serviceObj._id] = {
          _id: serviceObj._id,
          quantity: 1,
          userId: executorList.length > 0 ? executorList[0]._id : null,
          price: serviceObj.price,
        };
      } else {
        delete updatedState[serviceObj._id];
      }
      return updatedState;
    });
  };

  const adjustQuantity = (svcId, change) => {
    setChosenServices(prev => {
      const item = prev[svcId];
      if (!item) return prev;

      const updatedQty = item.quantity + change;
      if (updatedQty < 1) return prev;

      return {
        ...prev,
        [svcId]: { ...item, quantity: updatedQty },
      };
    });
  };

  const changeExecutor = (svcId, execId) => {
    setChosenServices(prev => ({
      ...prev,
      [svcId]: { ...prev[svcId], userId: execId },
    }));
  };

  const computeTotal = () => {
    return Object.values(chosenServices).reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  };

  const submitTransaction = async () => {
    if (!chosenCustomer) {
      Alert.alert('Thiếu thông tin', 'Vui lòng chọn khách hàng.');
      return;
    }

    const servicesArray = Object.values(chosenServices);
    if (servicesArray.length === 0) {
      Alert.alert('Thiếu thông tin', 'Vui lòng chọn ít nhất một dịch vụ.');
      return;
    }

    try {
      const servicesPayload = servicesArray.map(item => ({
        _id: item._id,
        quantity: item.quantity,
        userId: item.userId,
      }));

      await addTransaction(chosenCustomer, servicesPayload);

      Alert.alert('Thành công', 'Giao dịch đã được tạo thành công!', [
        { text: 'Đồng ý', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      console.error('Transaction error:', err);
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi tạo giao dịch.');
    }
  };

  const formatMoney = val => {
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' ₫';
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#E91E63" />
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <ScrollView 
        contentContainerStyle={styles.contentPadding}
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.labelText}>Customer *</Text>
        <Dropdown
          style={[styles.customerDropdown, isFocusCustomer && { borderColor: '#E91E63' }]}
          placeholderStyle={styles.dropdownPlaceholder}
          selectedTextStyle={styles.dropdownSelected}
          inputSearchStyle={styles.searchInput}
          containerStyle={styles.dropdownContainer}
          data={customerList}
          search
          maxHeight={300}
          labelField="name"
          valueField="_id"
          placeholder="Select customer"
          searchPlaceholder="Search..."
          value={chosenCustomer}
          onChange={item => {
            setChosenCustomer(item._id);
            setIsFocusCustomer(false);
          }}
          onFocus={() => setIsFocusCustomer(true)}
          onBlur={() => setIsFocusCustomer(false)}
          autoScroll={false}
        />

        {serviceList.map(svc => {
          const selected = !!chosenServices[svc._id];
          const serviceData = chosenServices[svc._id];

          return (
            <View key={svc._id} style={styles.serviceRow}>
              <BouncyCheckbox
                size={25}
                fillColor="#f6e79eff"
                unfillColor="#FFFFFF"
                text={svc.name}
                iconStyle={{ borderColor: '#f6e79eff' }}
                innerIconStyle={{ borderWidth: 2 }}
                textStyle={{
                  textDecorationLine: 'none',
                  color: '#333',
                  fontWeight: '500',
                }}
                onPress={checked => toggleServiceSelection(svc, checked)}
              />

              {selected && (
                <View style={styles.expandedDetails}>
                  <View style={styles.actionRow}>
                    <View style={styles.qtyContainer}>
                      <TouchableOpacity
                        style={styles.qtyButton}
                        onPress={() => adjustQuantity(svc._id, -1)}
                      >
                        <Text style={styles.qtySymbol}>-</Text>
                      </TouchableOpacity>
                      <Text style={styles.qtyDisplay}>
                        {serviceData.quantity}
                      </Text>
                      <TouchableOpacity
                        style={styles.qtyButton}
                        onPress={() => adjustQuantity(svc._id, 1)}
                      >
                        <Text style={styles.qtySymbol}>+</Text>
                      </TouchableOpacity>
                    </View>

                    <Dropdown
                      style={styles.executorSelect}
                      placeholderStyle={{ fontSize: 12, color: '#999' }}
                      selectedTextStyle={{ fontSize: 12 }}
                      containerStyle={styles.executorDropdownContainer}
                      data={executorList}
                      labelField="name"
                      valueField="_id"
                      placeholder="Executor"
                      value={serviceData.userId}
                      onChange={item => changeExecutor(svc._id, item._id)}
                      disable={false}
                    />
                  </View>
                  <Text>
                    Price:  
                    <Text style={styles.priceDisplay}>
                      {' '}
                      {formatMoney(svc.price)}
                    </Text>
                  </Text>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.confirmButton} onPress={submitTransaction}>
          <Text style={styles.confirmButtonText}>
            See summary: ({formatMoney(computeTotal())})
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  centerContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  contentPadding: { 
    padding: 20, 
    paddingBottom: 100 
  },
  labelText: { 
    fontWeight: 'bold', 
    marginBottom: 5, 
    color: '#333' 
  },
  customerDropdown: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 20,
    backgroundColor: '#fff',
    zIndex: 1000,
  },
  dropdownContainer: {
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  executorDropdownContainer: {
    borderRadius: 5,
    borderColor: '#ddd',
    borderWidth: 1,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dropdownPlaceholder: { 
    fontSize: 16, 
    color: '#999' 
  },
  dropdownSelected: { 
    fontSize: 16, 
    color: '#333' 
  },
  searchInput: { 
    height: 40, 
    fontSize: 16 
  },
  serviceRow: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  expandedDetails: {
    marginLeft: 35,
    marginTop: 10,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginRight: 10,
  },
  qtyButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  qtySymbol: { 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  qtyDisplay: { 
    width: 30, 
    textAlign: 'center', 
    fontSize: 16 
  },
  executorSelect: {
    flex: 1,
    height: 35,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    zIndex: 100,
  },
  priceDisplay: {
    color: '#E91E63',
    fontWeight: 'bold',
    marginTop: 5,
    textAlign: 'left',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 25,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  confirmButton: {
    backgroundColor: '#E91E63',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddTransaction;