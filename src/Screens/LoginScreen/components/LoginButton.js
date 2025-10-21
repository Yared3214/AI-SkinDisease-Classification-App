// src/screens/LoginScreen/components/LoginButton.js
import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import styles from '../styles';

const LoginButton = ({ onPress, loading }) => (
  <TouchableOpacity
    style={styles.loginButton}
    onPress={onPress}
    disabled={loading}
    activeOpacity={0.8}
  >
    {loading ? <ActivityIndicator size="small" color="#FFF" /> : <Text style={styles.loginButtonText}>Sign In</Text>}
  </TouchableOpacity>
);

export default LoginButton;
