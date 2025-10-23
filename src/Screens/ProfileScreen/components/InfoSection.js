import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const InfoSection = ({ userData }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account Information</Text>

      <View style={styles.card}>
        <Icon name="phone" size={18} color="#006666" />
        <Text style={styles.text}>{userData?.phone || '-'}</Text>
      </View>

      <View style={styles.card}>
        <Icon name="check-circle" size={18} color="#006666" />
        <Text style={styles.text}>
          Email Verified: {userData?.emailVerified ? 'Yes' : 'No'}
        </Text>
      </View>

      <View style={styles.card}>
        <Icon name="user-check" size={18} color="#006666" />
        <Text style={styles.text}>
          Profile Complete: {userData?.profileComplete ? 'Yes' : 'No'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20 },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#006666',
    marginBottom: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    gap: 10,
  },
  text: { fontSize: 15, color: '#2d3436' },
});

export default InfoSection;
