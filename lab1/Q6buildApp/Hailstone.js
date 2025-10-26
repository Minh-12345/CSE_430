import React, { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';

function Hailstone() {
  const [n, setN] = useState('');
  const [ketQua, setKetQua] = useState('');

  const taoHailstone = () => {
    let so = Number(n);
    let dayso = [];
    
    if (so > 0) {
      while (so !== 1) {
        dayso.push(so);
        if (so % 2 === 0) {
          so = so / 2;
        } else {
          so = so * 3 + 1;
        }
      }
      dayso.push(1);
      setKetQua(dayso.join(' → '));
    } else {
      setKetQua('Please enter n > 0');
    }
  };

  return (
    <View style={{padding: 20}}>
      <Text style={{fontSize: 20, fontWeight: 'bold', marginBottom: 10}}>
        Hailstone Sequence
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
        value={n}
        onChangeText={setN}
        placeholder="Enter n > 0"
      />
      
      <Pressable 
        style={{
          backgroundColor: '#007AFF',
          padding: 12,
          borderRadius: 5,
          alignItems: 'center',
        }}
        onPress={taoHailstone}
      >
        <Text style={{color: 'white', fontSize: 16}}>Generate</Text>
      </Pressable>
      
      {ketQua ? (
        <Text style={{marginTop: 15, fontSize: 14}}>
          {ketQua}
        </Text>
      ) : null}
    </View>
  );
}

export default Hailstone;
