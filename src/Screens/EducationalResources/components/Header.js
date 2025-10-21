import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

const Header = () => (
  <View style={styles.container}>
    <View>
      <Text style={styles.title}>Discover</Text>
      <Text style={styles.subtitle}>Health Insights from Trusted Experts</Text>
    </View>
    <Feather name="book-open" size={26} color="#6BA292" />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 10,
  },
  title: { fontSize: 24, fontWeight: 'bold', color: '#004D4D' },
  subtitle: { fontSize: 14, color: '#666', marginTop: 3 },
});

export default Header;
