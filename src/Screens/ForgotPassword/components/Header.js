import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const Header = ({ icon, title }) => (
  <View style={styles.container}>
    <FontAwesome name={icon} size={22} color="#4F4F4F" />
    <Text style={styles.title}>{title}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4F4F4F',
    marginLeft: 10,
  },
});

export default Header;
