import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MenuProvider } from 'react-native-popup-menu';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import AddServiceScreen from './src/screens/AddServiceScreen';
import ServiceDetailScreen from './src/screens/ServiceDetailScreen';
import EditServiceScreen from './src/screens/EditServiceScreen';
import CustomerScreen from './src/screens/CustormerScreen';
import AddCustomerScreen from './src/screens/AddCustomerScreen';
import CustomerDetailScreen from './src/screens/CustomerDetailScreen';
import EditCustomer from './src/screens/EditCustormer';
import TransactionScreen from './src/screens/TransactionScreen';
import TransactionDetailScreen from './src/screens/TransactionDetailScreen';
import AddTransactionScreen from './src/screens/AddTransactionScreen';
import SettingScreen from './src/screens/SettingScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <MenuProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#E91E63',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AddService"
            component={AddServiceScreen}
            options={{ title: 'Service' }}
          />
          <Stack.Screen
            name="ServiceDetail"
            component={ServiceDetailScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="EditService"
            component={EditServiceScreen}
            options={{ title: 'Service' }}
          />
          <Stack.Screen
            name="Customer"
            component={CustomerScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AddCustomer"
            component={AddCustomerScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CustomerDetail"
            component={CustomerDetailScreen}
            options={{ title: 'Customer detail' }}
          />
          <Stack.Screen
            name="EditCustomer"
            component={EditCustomer}
            options={{ title: 'Edit Customer' }}
          />
          <Stack.Screen
            name="Transaction"
            component={TransactionScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="TransactionDetail"
            component={TransactionDetailScreen}
            options={{ title: 'Transaction detail' }}
          />
          <Stack.Screen
            name="AddTransaction"
            component={AddTransactionScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Setting"
            component={SettingScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </MenuProvider>
  );
}