// src/screens/LoginScreen/components/Header.js
import React from 'react';
import { View, Text } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import styles from '../styles';

const Header = () => (
  <View style={styles.header}>
    <FontAwesome name="user-circle" size={80} color="#6BA292" />
    <Text style={styles.title}>Welcome Back</Text>
    <Text style={styles.subtitle}>Sign in to continue</Text>
  </View>
);

export default Header;
