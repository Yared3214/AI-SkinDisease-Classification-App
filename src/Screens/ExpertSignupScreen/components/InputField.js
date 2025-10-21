import React from 'react';
import { TextInput } from 'react-native';
import styles from '../styles';

const InputField = ({ placeholder, value, onChangeText, secureTextEntry, keyboardType }) => (
  <TextInput
    style={styles.input}
    placeholder={placeholder}
    placeholderTextColor="#A0A0A0"
    value={value}
    onChangeText={onChangeText}
    secureTextEntry={secureTextEntry}
    keyboardType={keyboardType}
    autoCapitalize="none"
  />
);

export default InputField;
