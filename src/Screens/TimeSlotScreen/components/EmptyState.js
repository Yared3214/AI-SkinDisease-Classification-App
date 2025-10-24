import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Ionicons from 'react-native-vector-icons/Ionicons';

const EmptyState = ({ message = 'No available time slots for this day.' }) => (
  <Animatable.View animation="fadeIn" duration={400} style={styles.container}>
    <Ionicons name="calendar-outline" size={48} color="#6BA292" style={{ marginBottom: 10 }} />
    <Text style={styles.title}>No Availability</Text>
    <Text style={styles.message}>{message}</Text>
  </Animatable.View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    backgroundColor: '#F9F9F9',
    borderRadius: 16,
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E4A43',
    marginBottom: 6,
  },
  message: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 30,
  },
});

export default EmptyState;
