import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://kami-backend-5rs0.onrender.com';

// Login
export const login = async (phone: string, password: string) => {
  const response = await axios.post(`${BASE_URL}/auth`, { phone, password });
  const token = response.data.token;
  await AsyncStorage.setItem('token', token);
  return token;
};

// Get all services
export const getServices = async () => {
  const response = await axios.get(`${BASE_URL}/services`);
  return response.data;
};

// Get service by ID
export const getServiceById = async (id: string) => {
  const response = await axios.get(`${BASE_URL}/services/${id}`);
  return response.data;
};

// Add service
export const addService = async (name: string, price: number) => {
  const token = await AsyncStorage.getItem('token');
  const response = await axios.post(
    `${BASE_URL}/services`,
    { name, price },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

// Update service
export const updateService = async (id: string, name: string, price: number) => {
  const token = await AsyncStorage.getItem('token');
  const response = await axios.put(
    `${BASE_URL}/services/${id}`,
    { name, price },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

// Delete service
export const deleteService = async (id: string) => {
  const token = await AsyncStorage.getItem('token');
  const response = await axios.delete(`${BASE_URL}/services/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Get all users
export const getUsers = async () => {
  const token = await AsyncStorage.getItem('token');
  const response = await axios.get(`${BASE_URL}/users`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Get all customers
export const getCustomers = async () => {
  const response = await axios.get(`${BASE_URL}/customers`);
  return response.data;
};

// Lấy thông tin chi tiết 1 customer
export const getCustomerById = async (id: string) => {
  const response = await axios.get(`${BASE_URL}/customers/${id}`);
  return response.data;
};

// Add new customer
export const addCustomer = async (name: string, phone: string) => {
  const token = await AsyncStorage.getItem('token');
  const response = await axios.post(
    `${BASE_URL}/customers`,
    { name, phone },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

// Cập nhật thông tin customer
export const updateCustomer = async (id: string, name: string, phone: string) => {
  const token = await AsyncStorage.getItem('token');
  const response = await axios.put(
    `${BASE_URL}/Customers/${id}`,
    { name, phone },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

// Xóa customer
export const deleteCustomer = async (id: string) => {
  const token = await AsyncStorage.getItem('token');
  const response = await axios.delete(`${BASE_URL}/Customers/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Get all transactions
export const getTransactions = async () => {
  const response = await axios.get(`${BASE_URL}/transactions`);
  return response.data;
};

// Get transaction by ID
export const getTransactionById = async (id: string) => {
  const response = await axios.get(`${BASE_URL}/transactions/${id}`);
  return response.data;
};

// Thêm giao dịch mới
export const addTransaction = async (customerId: string, services: any[]) => {
  const token = await AsyncStorage.getItem('token');
  const response = await axios.post(
    `${BASE_URL}/transactions`,
    { customerId, services },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

// Hủy giao dịch
export const deleteTransaction = async (id: string) => {
  const token = await AsyncStorage.getItem('token');
  const response = await axios.delete(`${BASE_URL}/transactions/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};