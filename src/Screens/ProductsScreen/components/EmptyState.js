import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const EmptyState = ({ message }) => (
  <View style={styles.container}>
    <Image
      source={require('../assets/empty.jpg')}
      style={styles.image}
      resizeMode="contain"
    />
    <Text style={styles.text}>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  image: {
    width: 180,
    height: 180,
    opacity: 0.8,
  },
  text: {
    fontSize: 16,
    color: '#6BA292',
    marginTop: 10,
    fontWeight: '600',
  },
});

export default EmptyState;
