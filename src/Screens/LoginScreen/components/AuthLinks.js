// src/screens/LoginScreen/components/AuthLinks.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../styles';

const AuthLinks = ({ navigation }) => (
  <View style={styles.linkContainer}>
    <TouchableOpacity onPress={() => navigation.navigate('forgot-pass')}>
      <Text style={styles.link}>Forgot Password?</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => navigation.navigate('type-selection')}>
      <Text style={styles.link}>Create Account</Text>
    </TouchableOpacity>
  </View>
);

export default AuthLinks;
