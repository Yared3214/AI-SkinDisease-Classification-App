import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../styles';

const AuthLinks = ({ navigation }) => (
  <View style={styles.linkContainer}>
    <Text style={styles.linkText}>Already have an account?</Text>
    <TouchableOpacity onPress={() => navigation.navigate('login')}>
      <Text style={styles.link}>Login</Text>
    </TouchableOpacity>
  </View>
);

export default AuthLinks;
