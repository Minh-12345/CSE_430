import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider, useSelector } from 'react-redux';
import { store } from './src/redux/store';

import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import CartScreen from './src/screens/CartScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';
import OrderHistoryScreen from './src/screens/OrderHistoryScreen';
import BestSellerScreen from './src/screens/BestSellerScreen';
import AdminDashboardScreen from './src/screens/AdminDashboardScreen';
import ManageBooksScreen from './src/screens/ManageBooksScreen';
import ManageOrdersScreen from './src/screens/ManageOrdersScreen';
import ManageUsersScreen from './src/screens/ManageUsersScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabNavigator() {
  const cartItems = useSelector((state: any) => state.cart.items);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { 
            backgroundColor: '#00a99d',
            height: 60,
            paddingBottom: 5 
        },
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: '#b2dfdb',
        tabBarLabelStyle: { fontSize: 12, fontWeight: 'bold' },
      })}
    >
      <Tab.Screen 
        name="TabHome" 
        component={HomeScreen} 
        options={{ 
            tabBarLabel: 'Hàng mới',
            tabBarIcon: ({ color }) => <Text style={{color, fontSize: 20}}>🔥</Text>
        }}
      />
      
      <Tab.Screen 
        name="BestSeller" 
        component={BestSellerScreen} 
        options={{ 
            tabBarLabel: 'Bán chạy',
            tabBarIcon: ({ color }) => <Text style={{color, fontSize: 20}}>⚡</Text>
        }}
      />

      <Tab.Screen 
        name="TabProfile" 
        component={ProfileScreen} 
        options={{ 
            tabBarLabel: 'Tài khoản',
            tabBarIcon: ({ color }) => <Text style={{color, fontSize: 20}}>👤</Text>
        }}
      />

      <Tab.Screen 
        name="TabCart" 
        component={CartScreen} 
        options={{ 
            tabBarLabel: 'Giỏ hàng',
            tabBarIcon: ({ color }) => <Text style={{color, fontSize: 20}}>🛒</Text>,
            tabBarBadge: cartItems.length > 0 ? cartItems.length : null,
            tabBarBadgeStyle: { backgroundColor: 'white', color: '#00a99d' }
        }}
      />
    </Tab.Navigator>
  );
}

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          
          <Stack.Screen name="Home" component={MainTabNavigator} />
          
          <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
          <Stack.Screen name="ManageBooks" component={ManageBooksScreen} />
          <Stack.Screen name="ManageOrders" component={ManageOrdersScreen} />
          <Stack.Screen name="ManageUsers" component={ManageUsersScreen} />
          
          <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />
          <Stack.Screen name="Cart" component={CartScreen} /> 
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;