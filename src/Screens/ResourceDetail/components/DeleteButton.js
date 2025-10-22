// components/resource/DeleteButton.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const DeleteButton = ({ onPress }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Icon name="delete" size={22} color="#fff" />
    <Text style={styles.text}>Delete Resource</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E57373',
    padding: 12,
    borderRadius: 12,
    justifyContent: 'center',
    marginTop: 25,
  },
  text: { color: '#fff', marginLeft: 8, fontWeight: '700', fontSize: 15 },
});

export default DeleteButton;
