// src/screens/LoginScreen/components/InputField.js
import React from 'react';
import { TextInput } from 'react-native';
import styles from '../styles';

const InputField = ({ placeholder, value, onChangeText, secureTextEntry, keyboardType }) => (
  <TextInput
    style={styles.input}
    placeholder={placeholder}
    placeholderTextColor="#999"
    value={value}
    onChangeText={onChangeText}
    secureTextEntry={secureTextEntry}
    keyboardType={keyboardType}
    autoCapitalize="none"
  />
);

export default InputField;
