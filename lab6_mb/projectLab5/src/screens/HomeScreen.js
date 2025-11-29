import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { getServices } from '../services/api';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import Icon from 'react-native-vector-icons/Ionicons';

export default function HomeScreen({ navigation }) {
  const [services, setServices] = useState([]);

  useEffect(() => {
    loadServices();

    // load lại services khi vào screen
    const unsubscribe = navigation.addListener('focus', () => {
      loadServices();
    });

    return unsubscribe;
  }, [navigation]);

  const loadServices = async () => {
    const data = await getServices();
    setServices(data);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>HUYỀN TRINH</Text>
        <TouchableOpacity style={styles.userIcon}>
          <Text style={styles.userIconText}>👤</Text>
        </TouchableOpacity>
      </View>

      {/* Logo */}
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>🌸 KAMI SPA</Text>
      </View>

      {/* Danh sách dịch vụ */}
      <View style={styles.contentContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.sectionTitle}>Danh sách dịch vụ</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('AddService')}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={services}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.serviceItem}>
              <TouchableOpacity
                style={styles.serviceContent}
                onPress={() => navigation.navigate('ServiceDetail', { id: item._id })}
                activeOpacity={0.7}
              >
                <Text style={styles.serviceName}>{item.name}</Text>
                <Text style={styles.servicePrice}>{item.price.toLocaleString()} đ</Text>
              </TouchableOpacity>
              <Menu>
                <MenuTrigger customStyles={triggerStyles}>
                  <View style={styles.menuTrigger}>
                    <Text style={styles.menuDots}>⋮</Text>
                  </View>
                </MenuTrigger>
                <MenuOptions customStyles={menuStyles}>
                  <MenuOption onSelect={() => navigation.navigate('EditService', { id: item._id })}>
                    <Text style={styles.menuText}>Edit</Text>
                  </MenuOption>
                </MenuOptions>
              </Menu>
            </View>
          )}
          contentContainerStyle={styles.listContent}
        />
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="home" size={24} color="#E91E63" />
          <Text style={styles.navTextActive}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('Transaction')}
        >
          <Icon name="card-outline" size={24} color="#999" />
          <Text style={styles.navText}>Transaction</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('Customer')}
        >
          <Icon name="people-outline" size={24} color="#999" />
          <Text style={styles.navText}>Customer</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('Setting')}
        >
          <Icon name="settings-outline" size={24} color="#999" />
          <Text style={styles.navText}>Setting</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const menuStyles = {
  optionsContainer: {
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
};

const triggerStyles = {
  triggerTouchable: {
    underlayColor: 'transparent',
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#E91E63',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userIcon: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userIconText: {
    fontSize: 18,
  },
  logoContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E91E63',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E91E63',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  listContent: {
    padding: 10,
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 0,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  serviceContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  serviceName: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  servicePrice: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    marginLeft: 10,
  },
  menuTrigger: {
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuDots: {
    fontSize: 20,
    color: '#666',
    paddingHorizontal: 10,
  },
  menuText: {
    fontSize: 14,
    padding: 10,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 5,
    gap: 3,
  },
  navText: {
    fontSize: 11,
    color: '#999',
  },
  navTextActive: {
    fontSize: 11,
    color: '#E91E63',
    fontWeight: 'bold',
  },
});