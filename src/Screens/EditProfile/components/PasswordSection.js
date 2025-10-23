import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import auth from '@react-native-firebase/auth';

const PasswordSection = () => {
  const [oldPwd, setOldPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!oldPwd || !newPwd || !confirmPwd)
      return Alert.alert('Error', 'Please fill in all fields');
    if (newPwd !== confirmPwd)
      return Alert.alert('Error', 'Passwords do not match');

    const user = auth().currentUser;
    setLoading(true);

    try {
      const credential = auth.EmailAuthProvider.credential(user.email, oldPwd);
      await user.reauthenticateWithCredential(credential);
      await user.updatePassword(newPwd);
      setOldPwd('');
      setNewPwd('');
      setConfirmPwd('');
      Alert.alert('Success', 'Password updated successfully.');
    } catch (err) {
      console.error(err);
      Alert.alert('Error', err.message || 'Password update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Change Password</Text>

      <View style={styles.inputGroup}>
        <Icon name="lock" size={20} color="#006666" />
        <TextInput
          value={oldPwd}
          onChangeText={setOldPwd}
          placeholder="Old Password"
          placeholderTextColor={'#000'}
          secureTextEntry
          style={styles.input}
        />
      </View>

      <View style={styles.inputGroup}>
        <Icon name="lock" size={20} color="#006666" />
        <TextInput
          value={newPwd}
          onChangeText={setNewPwd}
          placeholder="New Password"
          placeholderTextColor={'#000'}
          secureTextEntry
          style={styles.input}
        />
      </View>

      <View style={styles.inputGroup}>
        <Icon name="lock" size={20} color="#006666" />
        <TextInput
          value={confirmPwd}
          onChangeText={setConfirmPwd}
          placeholder="Confirm New Password"
          placeholderTextColor={'#000'}
          secureTextEntry
          style={styles.input}
        />
      </View>

      <TouchableOpacity
        onPress={handleChangePassword}
        style={[styles.button, loading && { backgroundColor: '#999' }]}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Updating...' : 'Change Password'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 40 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#006666', marginBottom: 12 },
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
  input: { marginLeft: 10, flex: 1, fontSize: 16 , color: '#000' },
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

export default PasswordSection;
