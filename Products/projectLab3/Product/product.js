
import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, Button } from 'react-native';

export default function Product() {
  const [data, setData] = useState([]);
  const filePath = 'https://dummyjson.com/products';

  useEffect(() => {
    fetch(filePath)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((d) => {
        setData(d.products);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.thumbnail }} style={styles.image} />
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>Title: {item.title}</Text>
        <Text>Description: {item.description}</Text>
        <Text>Price: ${item.price}</Text>
        <Text style={styles.discount}>
          Discount: {item.discountPercentage}% off
        </Text>
        <Text>Rating: {item.rating}</Text>
        <Text>Stock: {item.stock}</Text>
        <Text>Brand: {item.brand}</Text>
        <Text>Category: {item.category}</Text>

        {}
        <View style={styles.buttonRow}>
          <View style={styles.button}>
            <Button title="DETAIL" color="#2196F3" />
          </View>
          <View style={styles.button}>
            <Button title="ADD" color="#4CAF50" />
          </View>
          <View style={styles.button}>
            <Button title="DELETE" color="#f44336" />
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Product list</Text>

      {data.length === 0 ? (
        <Text style={{ textAlign: 'center', marginTop: 20 }}>Loading...</Text>
      ) : (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#fff' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
    marginBottom: 10,
    padding: 10,
    borderRadius: 8,
  },
  image: { width: 80, height: 80, marginRight: 10, borderRadius: 8 },
  title: { fontWeight: 'bold' },
  discount: { color: 'green' },


  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly', 
    marginTop: 8,
  },
  button: {
    width: 85, 
  },
});
