import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const ProfileForm = ({ userData, onSubmit, loading }) => {
  const [name, setName] = useState(userData.name);
  const [email, setEmail] = useState(userData.email);

  return (
    <View>
      <View style={styles.inputGroup}>
        <Icon name="user" size={20} color="#006666" />
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Full Name"
          style={styles.input}
        />
      </View>

      <View style={styles.inputGroup}>
        <Icon name="mail" size={20} color="#006666" />
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email Address"
          keyboardType="email-address"
          style={styles.input}
          autoCapitalize="none"
        />
      </View>

      <TouchableOpacity
        onPress={() => onSubmit({ name, email })}
        style={[styles.button, loading && { backgroundColor: '#999' }]}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Saving...' : 'Save Changes'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  input: { marginLeft: 10, flex: 1, fontSize: 16, color: '#333' },
  button: {
    backgroundColor: '#006666',
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default ProfileForm;
