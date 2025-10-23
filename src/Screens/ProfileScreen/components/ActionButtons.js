import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const ActionButtons = ({ onEdit, onLogout }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.editButton} onPress={onEdit}>
        <Icon name="edit" size={18} color="#fff" />
        <Text style={styles.buttonText}>Edit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <Icon name="log-out" size={18} color="#fff" />
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, marginTop: 20 },
  editButton: {
    backgroundColor: '#006666',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 10,
  },
  logoutButton: {
    backgroundColor: '#d63031',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 15 },
});

export default ActionButtons;
