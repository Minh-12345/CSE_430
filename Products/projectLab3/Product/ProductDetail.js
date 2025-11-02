
import React, { useEffect, useState } from 'react';
import { View, Text, Image } from 'react-native';
import { Card, Button } from 'react-native-paper';

export default function Product_Detail() {
  const [data, setData] = useState([]);
  const filePath = 'https://dummyjson.com/products/2';

  useEffect(() => {
    fetch(filePath)
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(d => setData(d))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Product Detail</Text>
      <Card style={{ marginTop: 10, padding: 10 }}>
        <Image source={{ uri: data.thumbnail }} style={{ height: 150 }} />
        <Text style={{ fontWeight: 'bold' }}>Title: {data.title}</Text>
        <Text>Description: {data.description}</Text>
        <Text>Price: ${data.price}</Text>
        <Text>Discount: {data.discountPercentage}%</Text>
        <Text>Rating: {data.rating}</Text>
        <Text>Stock: {data.stock}</Text>
        <Text>Brand: {data.brand}</Text>
        <Text>Category: {data.category}</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 }}>
          <Button mode="contained">Delete</Button>
          <Button mode="contained-tonal">Cancel</Button>
        </View>
      </Card>
    </View>
  );
}
