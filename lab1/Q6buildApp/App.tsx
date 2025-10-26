import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import EmployeeInfo from './EmployeeInfo';
import SumFirstLast from './SumOfFirstAndLast';
import MinOfThree from './FindMinimum';
import Hailstone from './Hailstone';

function App() {
  const line = {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
  };

  return (
    <SafeAreaProvider>
      <ScrollView style={{flex: 1, backgroundColor: '#fff'}}>
        <EmployeeInfo 
          title="Employee Information" 
          buttonColor="#007AFF"
          namePlaceholder="Enter your full name"
          agePlaceholder="Enter your age"
          occupationPlaceholder="e.g., Software Engineer"
          specializationPlaceholder="e.g., Mobile Development"
        />
        <View style={line} />
        <SumFirstLast />
        <View style={line} />
        <MinOfThree />
        <View style={line} />
        <Hailstone />
      </ScrollView>
    </SafeAreaProvider>
  );
}

export default App;
