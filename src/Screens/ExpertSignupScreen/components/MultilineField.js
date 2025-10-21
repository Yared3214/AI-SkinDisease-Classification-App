import React from 'react';
import { TextInput } from 'react-native';
import styles from '../styles';

const MultilineField = ({ placeholder, value, onChangeText }) => (
  <TextInput
    style={[styles.input, styles.multiline]}
    placeholder={placeholder}
    placeholderTextColor="#A0A0A0"
    value={value}
    onChangeText={onChangeText}
    multiline
    numberOfLines={4}
  />
);

export default MultilineField;
