import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const AddResourceButton = ({ onPress }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Text style={styles.text}>+ Add</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 25,
    right: 25,
    backgroundColor: '#6BA292',
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },
  text: { color: '#fff', fontSize: 20, fontWeight: '700' },
});

export default AddResourceButton;
