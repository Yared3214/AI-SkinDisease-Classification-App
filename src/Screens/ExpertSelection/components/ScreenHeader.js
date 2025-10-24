import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const ScreenHeader = ({ title, subtitle }) => (
  <LinearGradient colors={['#6BA292', '#4C8577']} style={styles.header}>
    <Text style={styles.title}>{title}</Text>
    {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
  </LinearGradient>
);

export default ScreenHeader;

const styles = StyleSheet.create({
  header: {
    borderRadius: 14,
    paddingVertical: 24,
    paddingHorizontal: 18,
    marginTop: 40,
    marginBottom: 20,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },
  subtitle: {
    fontSize: 15,
    color: '#e6f2ef',
    marginTop: 6,
  },
});
