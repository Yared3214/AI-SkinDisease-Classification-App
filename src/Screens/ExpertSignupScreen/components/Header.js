import React from 'react';
import { View, Text } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import styles from '../styles';

const Header = () => (
  <View style={styles.header}>
    <FontAwesome name="briefcase" size={70} color="#4E9F8D" />
    <Text style={styles.title}>Expert Sign Up</Text>
    <Text style={styles.subtitle}>Join as an expert and connect with clients</Text>
  </View>
);

export default Header;
