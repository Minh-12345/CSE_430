/**
 * Sample React Native App - Calculator
 * https://github.com/facebook/react-native
 *
 * @format
 */

// App.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './style';

// ---------------- State variables ----------------
const App = () => {
  const [displayValue, setDisplayValue] = useState('0');
  const [operator, setOperator] = useState<string | null>(null);
  const [firstValue, setFirstValue] = useState('');

  // ---------------- Function to handle number inputs ----------------
  const handleNumberInput = (num: number) => {
    if (displayValue === '0') {
      setDisplayValue(num.toString());
    } else {
      setDisplayValue(displayValue + num);
    }
  };

  // ---------------- Function to handle operator inputs ----------------
  const handleOperatorInput = (op: string) => {
    setOperator(op);
    setFirstValue(displayValue);
    setDisplayValue('0');
  };

  // ---------------- Function to handle equal button press ----------------
  const handleEqual = () => {
    const num1 = parseFloat(firstValue);
    const num2 = parseFloat(displayValue);

    if (operator === '+') {
      setDisplayValue((num1 + num2).toString());
    } else if (operator === '-') {
      setDisplayValue((num1 - num2).toString());
    } else if (operator === '*') {
      setDisplayValue((num1 * num2).toString());
    } else if (operator === '/') {
      setDisplayValue((num1 / num2).toString());
    }

    setOperator(null);
    setFirstValue('');
  };

  // ---------------- Function to handle clear button press ----------------
  const handleClear = () => {
    setDisplayValue('0');
    setOperator(null);
    setFirstValue('');
  };

  // ---------------- UI layout ----------------
  return (
    <View style={styles.container}>
      <Text style={styles.display}>{displayValue}</Text>

      <View style={styles.row}>
        {[7, 8, 9].map((n) => (
          <TouchableOpacity key={n} style={styles.button} onPress={() => handleNumberInput(n)}>
            <Text style={styles.buttonText}>{n}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={[styles.button, styles.operatorButton]} onPress={() => handleOperatorInput('/')}>
          <Text style={styles.operatorText}>÷</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        {[4, 5, 6].map((n) => (
          <TouchableOpacity key={n} style={styles.button} onPress={() => handleNumberInput(n)}>
            <Text style={styles.buttonText}>{n}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={[styles.button, styles.operatorButton]} onPress={() => handleOperatorInput('*')}>
          <Text style={styles.operatorText}>×</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        {[1, 2, 3].map((n) => (
          <TouchableOpacity key={n} style={styles.button} onPress={() => handleNumberInput(n)}>
            <Text style={styles.buttonText}>{n}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={[styles.button, styles.operatorButton]} onPress={() => handleOperatorInput('-')}>
          <Text style={styles.operatorText}>−</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <TouchableOpacity style={styles.button} onPress={() => handleNumberInput(0)}>
          <Text style={styles.buttonText}>0</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.operatorButton]} onPress={handleEqual}>
          <Text style={styles.operatorText}>=</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.operatorButton]} onPress={() => handleOperatorInput('+')}>
          <Text style={styles.operatorText}>+</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.operatorButton]} onPress={handleClear}>
          <Text style={styles.operatorText}>C</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default App;

