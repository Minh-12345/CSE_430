import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView, Alert, Modal } from 'react-native';
import { getServiceById, deleteService } from '../services/api';

export default function ServiceDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    loadService();
  }, []);

  const loadService = async () => {
    try {
      const data = await getServiceById(id);
      console.log('Raw data:', data);
      console.log('Type:', typeof data);
      console.log('Keys:', data ? Object.keys(data) : 'null');
      console.log('name:', data?.name, typeof data?.name);
      console.log('price:', data?.price, typeof data?.price);
      console.log('user:', data?.user, typeof data?.user);
      console.log('createdBy:', data?.createdBy, typeof data?.createdBy);
      setService(data);
    } catch (error) {
      console.log('Error loading service:', error);
      Alert.alert('Error', 'Cannot load service information');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteService(id);
      setShowDeleteDialog(false);
      Alert.alert('Success', 'Delete service successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Cannot delete service');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Service detail</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E91E63" />
        </View>
      </View>
    );
  }

  if (!service) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Service detail</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <Text>Service not found</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Service detail</Text>
        <TouchableOpacity onPress={() => setShowMenu(!showMenu)} style={styles.menuButton}>
          <Text style={styles.menuIcon}>⋮</Text>
        </TouchableOpacity>
      </View>

      {/* Menu Dropdown */}
      {showMenu && (
        <View style={styles.menuDropdown}>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => {
              setShowMenu(false);
              setShowDeleteDialog(true);
            }}
          >
            <Text style={styles.menuItemText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView style={styles.content}>
        <View style={styles.detailContainer}>
          <Text style={styles.detailLabel}>
            Service name: <Text style={styles.detailValue}>{String(service?.name || '')}</Text>
          </Text>
          <Text style={styles.detailLabel}>
            Price: <Text style={styles.detailValue}>{service?.price ? `${service.price.toLocaleString()} đ` : '0 đ'}</Text>
          </Text>
          <Text style={styles.detailLabel}>
            Creator: <Text style={styles.detailValue}>{String(service?.createdBy || service?.user || 'Hung')}</Text>
          </Text>
          <Text style={styles.detailLabel}>
            Time: <Text style={styles.detailValue}>
              {service?.createdAt ? new Date(service.createdAt).toLocaleString('vi-VN') : '12/03/2023 22:56:59'}
            </Text>
          </Text>
          <Text style={styles.detailLabel}>
            Final update: <Text style={styles.detailValue}>
              {service?.updatedAt ? new Date(service.updatedAt).toLocaleString('vi-VN') : '12/03/2023 22:56:59'}
            </Text>
          </Text>
        </View>
      </ScrollView>

      {/* Delete Confirmation Dialog */}
      <Modal
        transparent={true}
        visible={showDeleteDialog}
        animationType="fade"
        onRequestClose={() => setShowDeleteDialog(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.dialogContainer}>
            <Text style={styles.dialogTitle}>Warning</Text>
            <Text style={styles.dialogMessage}>
              Are you sure you want to remove this service? This operation cannot be returned
            </Text>
            <View style={styles.dialogButtons}>
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={handleDelete}
              >
                <Text style={styles.deleteButtonText}>DELETE</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowDeleteDialog(false)}
              >
                <Text style={styles.cancelButtonText}>CANCEL</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#E91E63',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 12,
    paddingTop: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIcon: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  menuDropdown: {
    position: 'absolute',
    top: 85,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  menuItem: {
    padding: 15,
    minWidth: 120,
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
  },
  content: {
    flex: 1,
  },
  detailContainer: {
    backgroundColor: '#fff',
    margin: 0,
    padding: 20,
  },
  detailLabel: {
    fontSize: 14,
    color: '#000',
    marginBottom: 15,
    fontWeight: 'bold',
  },
  detailValue: {
    fontWeight: 'normal',
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogContainer: {
    backgroundColor: '#fff',
    borderRadius: 4,
    padding: 20,
    width: '80%',
    maxWidth: 340,
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
  },
  dialogMessage: {
    fontSize: 14,
    color: '#333',
    marginBottom: 20,
    lineHeight: 20,
  },
  dialogButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 15,
  },
  deleteButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  deleteButtonText: {
    color: '#1ee6e9ff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  cancelButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  cancelButtonText: {
    color: '#1ee6e9ff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
