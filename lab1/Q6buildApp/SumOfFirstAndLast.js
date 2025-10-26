import React, { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';

function SumFirstLast() {
  const [so, setSo] = useState('');
  const [ketQua, setKetQua] = useState('');

  const tinhTong = () => {
    if (so.length > 0) {
      const chuSoDau = Number(so[0]);
      const chuSoCuoi = Number(so[so.length - 1]);
      const tong = chuSoDau + chuSoCuoi;
      setKetQua('Result: ' + tong);
    }
  };

  return (
    <View style={{padding: 20}}>
      <Text style={{fontSize: 20, fontWeight: 'bold', marginBottom: 10}}>
        Sum of First and Last Digits
      </Text>
      
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          borderRadius: 5,
          marginBottom: 10,
        }}
        keyboardType="numeric"
        value={so}
        onChangeText={setSo}
        placeholder="Enter a number"
      />
      
      <Pressable 
        style={{
          backgroundColor: '#007AFF',
          padding: 12,
          borderRadius: 5,
          alignItems: 'center',
        }}
        onPress={tinhTong}
      >
        <Text style={{color: 'white', fontSize: 16}}>Calculate</Text>
      </Pressable>
      
      {ketQua ? (
        <Text style={{marginTop: 15, fontSize: 16}}>
          {ketQua}
        </Text>
      ) : null}
    </View>
  );
}

export default SumFirstLast;
