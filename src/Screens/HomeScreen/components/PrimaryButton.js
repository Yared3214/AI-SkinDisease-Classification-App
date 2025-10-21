import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

const PrimaryButton = ({ title, onPress, loading, disabled, color = '#6BA292' }) => (
  <TouchableOpacity
    style={[styles.button, { backgroundColor: color, opacity: disabled ? 0.7 : 1 }]}
    onPress={onPress}
    disabled={disabled || loading}
  >
    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.text}>{title}</Text>}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PrimaryButton;
