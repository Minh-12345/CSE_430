
import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, Image } from 'react-native';
import { Card } from 'react-native-paper';

export default function Product_Search() {
  const [data, setData] = useState([]);
  const [value, setValue] = useState('');

  const searchProduct = () => {
    let filePath = 'https://dummyjson.com/products';
    if (value !== '') filePath = 'https://dummyjson.com/products/search?q=' + value;

    fetch(filePath)
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(d => setData(d.products))
      .catch(error => console.error('Error fetching data:', error));
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <Text>Search Products</Text>
      <TextInput style={{ borderWidth: 1, padding: 8, marginBottom: 10 }} value={value} onChangeText={setValue} placeholder="Enter product name" />
      <Button title="SEARCH" onPress={searchProduct} />
      <FlatList
        data={data}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <Card style={{ marginVertical: 10, padding: 10 }}>
            <Image source={{ uri: item.thumbnail }} style={{ height: 150 }} />
            <Text style={{ fontWeight: 'bold' }}>Title: {item.title}</Text>
            <Text>Description: {item.description}</Text>
            <Text>Price: ${item.price}</Text>
            <Text>Discount: {item.discountPercentage}%</Text>
            <Text>Rating: {item.rating}</Text>
            <Text>Stock: {item.stock}</Text>
            <Text>Brand: {item.brand}</Text>
            <Text>Category: {item.category}</Text>
          </Card>
        )}
      />
    </View>
  );
}
