import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import * as Animatable from 'react-native-animatable';

const ConfirmButton = ({ onPress, loading }) => (
  <Animatable.View animation="fadeInUp" duration={400} delay={300}>
    <TouchableOpacity style={styles.button} onPress={onPress} disabled={loading}>
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.text}>Confirm Booking</Text>
      )}
    </TouchableOpacity>
  </Animatable.View>
);

const styles = StyleSheet.create({
  button: {
    marginTop: 30,
    backgroundColor: '#6BA292',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default ConfirmButton;
