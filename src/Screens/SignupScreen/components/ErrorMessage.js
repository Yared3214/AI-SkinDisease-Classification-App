import React from 'react';
import { Text } from 'react-native';
import styles from '../styles';

const ErrorMessage = ({ message }) =>
  message ? <Text style={styles.errorText}>{message}</Text> : null;

export default ErrorMessage;
