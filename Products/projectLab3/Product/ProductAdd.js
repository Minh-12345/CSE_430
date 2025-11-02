
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, ScrollView, StyleSheet } from 'react-native';

export default function Product_Add() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState('');
  const [rating, setRating] = useState('');
  const [stock, setStock] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [images, setImages] = useState('');

  const handleSubmit = () => {
    fetch('https://dummyjson.com/products/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title, description, price, discountPercentage, rating, stock, brand, category, images
      }),
    })
      .then(res => res.json())
      .then(console.log);
    Alert.alert("Add successful");
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={styles.header}>Add a Product</Text>
      {[
        ['Title', title, setTitle],
        ['Description', description, setDescription],
        ['Price', price, setPrice],
        ['Discount Percentage', discountPercentage, setDiscountPercentage],
        ['Rating', rating, setRating],
        ['Stock', stock, setStock],
        ['Brand', brand, setBrand],
        ['Category', category, setCategory],
        ['Images', images, setImages],
      ].map(([label, value, setter]) => (
        <View key={label}>
          <Text>{label}</Text>
          <TextInput style={styles.input} placeholder={`Enter ${label.toLowerCase()}`} value={value} onChangeText={setter} />
        </View>
      ))}
      <Button title="SUBMIT" onPress={handleSubmit} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { fontSize: 20, color: 'blue', fontWeight: 'bold', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 10, borderRadius: 5 }
});
