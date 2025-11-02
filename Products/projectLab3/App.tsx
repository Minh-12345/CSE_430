
import React, { useState } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { BottomNavigation } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Products from './Product/product';
import Product_Add from './Product/ProductAdd';
import Product_Search from './Product/ProductSearch';
import Product_Detail from './Product/ProductDetail';

export default function App() {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'Products', title: 'Products', focusedIcon: 'bomb' },
    { key: 'Product_Add', title: 'Add', focusedIcon: 'bomb' },
    { key: 'Product_Search', title: 'Search', focusedIcon: 'help' },
    { key: 'Product_Detail', title: 'Detail', focusedIcon: 'new-box' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    Products: Products,
    Product_Add: Product_Add,
    Product_Search: Product_Search,
    Product_Detail: Product_Detail,
  });

  return (
    <SafeAreaProvider>
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
      />
    </SafeAreaProvider>
  );
}


