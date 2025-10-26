import React, { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';

function MinOfThree() {
  const [soA, setSoA] = useState('');
  const [soB, setSoB] = useState('');
  const [soC, setSoC] = useState('');
  const [ketQua, setKetQua] = useState('');

  const timSoNhoNhat = () => {
    const soNhoNhat = Math.min(Number(soA), Number(soB), Number(soC));
    setKetQua('Minimum number: ' + soNhoNhat);
  };

  const oNhap = {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  };

  return (
    <View style={{padding: 20}}>
      <Text style={{fontSize: 20, fontWeight: 'bold', marginBottom: 10}}>
        Find Minimum of Three Numbers
      </Text>
      
      <TextInput 
        style={oNhap}
        value={soA}
        onChangeText={setSoA}
        placeholder="Enter A"
        keyboardType="numeric"
      />
      
      <TextInput 
        style={oNhap}
        value={soB}
        onChangeText={setSoB}
        placeholder="Enter B"
        keyboardType="numeric"
      />
      
      <TextInput 
        style={oNhap}
        value={soC}
        onChangeText={setSoC}
        placeholder="Enter C"
        keyboardType="numeric"
      />
      
      <Pressable 
        style={{
          backgroundColor: '#007AFF',
          padding: 12,
          borderRadius: 5,
          alignItems: 'center',
        }}
        onPress={timSoNhoNhat}
      >
        <Text style={{color: 'white', fontSize: 16}}>Find Minimum</Text>
      </Pressable>
      
      {ketQua ? (
        <Text style={{marginTop: 15, fontSize: 16}}>
          {ketQua}
        </Text>
      ) : null}
    </View>
  );
}

export default MinOfThree;
