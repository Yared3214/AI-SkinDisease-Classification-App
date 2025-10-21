import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { FIREBASE_AUTH } from '../../../FireBaseConfig/FirebaseConfig';

import InputField from '../../components/InputField';
import PrimaryButton from '../../components/PrimaryButton';
import Header from '../../components/Header';

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(FIREBASE_AUTH, email);
      Alert.alert('Success', 'A password reset link has been sent to your email.');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header icon="unlock-alt" title="Reset Password" />

      <InputField
        icon="envelope"
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <PrimaryButton title="Send Reset Link" onPress={handleResetPassword} loading={loading} />

      <TouchableOpacity onPress={() => navigation.navigate('login')}>
        <Text style={styles.link}>← Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    color: '#4F8A8B',
    fontSize: 15,
    marginTop: 15,
  },
});
