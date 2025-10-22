import React from 'react';
import { View, Text, TextInput } from 'react-native';
import styles from '../styles';

const TextInputField = ({ label, value, onChangeText, multiline, error }) => (
  <View style={{ marginBottom: 15 }}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[styles.input, multiline && styles.textArea, error && { borderColor: 'red' }]}
      value={value}
      onChangeText={onChangeText}
      multiline={multiline}
      placeholder={`Enter ${label.toLowerCase()}`}
    />
    {error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

export default TextInputField;
