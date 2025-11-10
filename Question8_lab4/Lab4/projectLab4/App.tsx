import 'react-native-gesture-handler';
import React, { useRef, useEffect, useState, useContext, useCallback } from 'react';
import Contacts from './src/Contact';
import Favorites from './src/Favorites';
import ProfileContact from './src/ProfileContact';
import store, { persistor } from './src/Store';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { PersistGate } from 'redux-persist/integration/react';
import { Text, View, Animated, StyleSheet, Dimensions, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const Stack = createStackNavigator();
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DRAWER_WIDTH = Math.min(320, Math.round(SCREEN_WIDTH * 0.78));

// TODO: menu logic could be extracted later
const DrawerContext = React.createContext({
  open: () => {},
  close: () => {},
  isOpen: false,
});

function ContactsScreens() {
  return (
    <Stack.Navigator
      initialRouteName="Contacts"
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#1976d2' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
        headerTitleAlign: 'left',
      }}
    >
      <Stack.Screen
        name="Contacts"
        component={Contacts}
        options={{ title: 'Contacts', headerLeft: () => <HeaderMenuButton /> }}
      />
      <Stack.Screen
        name="ProfileContact"
        component={ProfileContact}
        options={{ title: 'Profile contact', headerLeft: () => <HeaderMenuButton /> }}
      />
    </Stack.Navigator>
  );
}

function FavoriteScreens() {
  return (
    <Stack.Navigator
      initialRouteName="Favorites"
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#1976d2' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
        headerTitleAlign: 'left',
      }}
    >
      <Stack.Screen
        name="Favorites"
        component={Favorites}
        options={{ title: 'Favorites', headerLeft: () => <HeaderMenuButton /> }}
      />
      <Stack.Screen
        name="ProfileContact"
        component={ProfileContact}
        options={{ title: 'Profile contact', headerLeft: () => <HeaderMenuButton /> }}
      />
    </Stack.Navigator>
  );
}

function HeaderMenuButton() {
  const { open } = useContext(DrawerContext);
  return (
    <TouchableOpacity onPress={open} style={{ marginLeft: 12 }}>
      <MaterialIcons name="menu" size={26} color="#fff" />
    </TouchableOpacity>
  );
}

type DrawerRoute = 'ContactsStack' | 'FavoritesStack';
// NOTE: keep routes simple, maybe refactor to data map later
interface DrawerContentProps { onNavigate: (route: DrawerRoute) => void }
function DrawerContent({ onNavigate }: DrawerContentProps) {
  return (
    <View style={styles.drawerContent}>
      <View style={styles.drawerHeader}>
        <MaterialIcons name="menu" size={28} color="#fff" />
        <Text style={styles.drawerHeaderText}>  Menu</Text>
      </View>
      <TouchableOpacity style={styles.drawerItem} onPress={() => onNavigate('ContactsStack')}>
        <FontAwesome name="address-book" size={22} color="#333" />
        <Text style={styles.drawerItemText}>  Contacts</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.drawerItem} onPress={() => onNavigate('FavoritesStack')}>
        <FontAwesome name="star" size={22} color="#333" />
        <Text style={styles.drawerItemText}>  Favorites</Text>
      </TouchableOpacity>
    </View>
  );
}

const AppContent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const translateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const navigationRef = useRef<any>(null);

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: isOpen ? 0 : -DRAWER_WIDTH,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [isOpen, translateX]);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  const onNavigate = useCallback((screenName: DrawerRoute) => {
    close();
    setTimeout(() => {
      if (screenName === 'ContactsStack') {
        setActive(<ContactsScreens />);
      } else if (screenName === 'FavoritesStack') {
        setActive(<FavoriteScreens />);
      }
    }, 150);
  }, [close]);

  const [active, setActive] = useState<React.ReactNode>(<ContactsScreens />); // TODO: consider index instead of element
  return (
    <DrawerContext.Provider value={{ open, close, isOpen }}>
      <NavigationContainer ref={navigationRef}>
        <View style={{ flex: 1 }}>
          {active}

          {isOpen && (
            <TouchableWithoutFeedback onPress={close}>
              <View style={styles.overlay} />
            </TouchableWithoutFeedback>
          )}

          <Animated.View
            style={[
              styles.drawer,
              { width: DRAWER_WIDTH, transform: [{ translateX }] },
            ]}
          >
            <DrawerContent onNavigate={onNavigate} />
          </Animated.View>
        </View>
      </NavigationContainer>
    </DrawerContext.Provider>
  );
};

const App = () => {
  return (
  <Provider store={store}>
      <PersistGate loading={<Text>Loading...</Text>} persistor={persistor}>
        <AppContent />
      </PersistGate>
    </Provider>
  );
};

const styles = StyleSheet.create({
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#fff',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 2, height: 0 },
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  drawerContent: {
    flex: 1,
    backgroundColor: '#fff',
  },
  drawerHeader: {
    height: 64,
    backgroundColor: '#1976d2',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  drawerHeaderText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  drawerItem: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  drawerItemText: {
    fontSize: 18,
    color: '#333',
  },
});

export default App;
