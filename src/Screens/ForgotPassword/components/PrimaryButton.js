import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

const PrimaryButton = ({ title, onPress, loading }) => {
  return (
    <TouchableOpacity
      style={[styles.button, loading && { opacity: 0.7 }]}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.text}>{title}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    backgroundColor: '#6BA292',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  text: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PrimaryButton;
