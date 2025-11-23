import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MenuProvider } from 'react-native-popup-menu';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import AddServiceScreen from './src/screens/AddServiceScreen';
import ServiceDetailScreen from './src/screens/ServiceDetailScreen';
import EditServiceScreen from './src/screens/EditServiceScreen';

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
        </Stack.Navigator>
      </NavigationContainer>
    </MenuProvider>
  );
}