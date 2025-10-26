import React, { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';

function EmployeeInfo(props) {
  const [hoTen, setHoTen] = useState('');
  const [tuoi, setTuoi] = useState('');
  const [ngheNghiep, setNgheNghiep] = useState('');
  const [chuyenMon, setChuyenMon] = useState('');
  const [thongBao, setThongBao] = useState('');

  const capNhat = () => {
    setThongBao('Update information successfully!');
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
      <Text style={{fontSize: 20, fontWeight: 'bold', marginBottom: 15}}>
        {props.title}
      </Text>
      
      <Text>Full Name:</Text>
      <TextInput 
        style={oNhap} 
        value={hoTen} 
        onChangeText={setHoTen}
        placeholder={props.namePlaceholder || "Enter full name"}
      />

      <Text>Age:</Text>
      <TextInput
        style={oNhap}
        value={tuoi} 
        onChangeText={setTuoi}
        keyboardType="numeric"
        placeholder={props.agePlaceholder || "Enter age"}
      />
      
      <Text>Occupation:</Text>
      <TextInput 
        style={oNhap} 
        value={ngheNghiep} 
        onChangeText={setNgheNghiep}
        placeholder={props.occupationPlaceholder || "Enter occupation"}
      />

      <Text>Specialization:</Text>
      <TextInput 
        style={oNhap} 
        value={chuyenMon} 
        onChangeText={setChuyenMon}
        placeholder={props.specializationPlaceholder || "Enter specialization"}
      />
      
      <Pressable 
        style={{
          backgroundColor: props.buttonColor,
          padding: 12,
          borderRadius: 5,
          alignItems: 'center',
          marginTop: 10,
        }}
        onPress={capNhat}
      >
        <Text style={{color: 'white', fontSize: 16}}>Update</Text>
      </Pressable>
      
      {thongBao ? (
        <Text style={{color: 'green', marginTop: 10}}>
          {thongBao}
        </Text>
      ) : null}
    </View>
  );
}

export default EmployeeInfo;
