import React from 'react';
import { View, Text } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import styles from '../styles';

const Header = () => (
  <View style={styles.header}>
    <FontAwesome name="user-plus" size={70} color="#6BA292" />
    <Text style={styles.title}>Create Account</Text>
    <Text style={styles.subtitle}>Join us and get started</Text>
  </View>
);

export default Header;
