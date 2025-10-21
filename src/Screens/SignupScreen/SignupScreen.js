// src/screens/SignupScreen/SignupScreen.js
import React, { useState } from 'react';
import {
  View,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { CometChat } from '@cometchat/chat-sdk-react-native';

import Header from './components/Header';
import InputField from './components/InputField';
import ErrorMessage from './components/ErrorMessage';
import SignupButton from './components/SignupButton';
import AuthLinks from './components/AuthLinks';
import Divider from './components/Divider';
import SocialSignup from './components/SocialSignup';
import styles from './styles';

const SignupScreen = () => {
  const navigation = useNavigation();

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  /* -------------------------- 📋 Validate Form -------------------------- */
  const validateForm = () => {
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError('All fields are required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  /* ----------------------------- 🔐 Sign Up ----------------------------- */
  const signUp = async () => {
    setError('');
    if (!validateForm()) return;

    setLoading(true);
    try {
      // 1️⃣ Register user in Firebase
      const { user } = await auth().createUserWithEmailAndPassword(email, password);
      await user.updateProfile({ displayName: name });

      // 2️⃣ Save in Firestore
      await firestore().collection('users').doc(user.uid).set({
        uid: user.uid,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role: 'user',
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
        emailVerified: false,
        profileComplete: false,
      });

      // 3️⃣ Create CometChat User
      const cometChatUser = new CometChat.User(user.uid);
      cometChatUser.setName(name.trim());
      cometChatUser.setMetadata({ email: email.trim().toLowerCase(), firebase_uid: user.uid });
      await CometChat.createUser(cometChatUser, '96e80b8f4460efd9bbf32f14a0068d1bac6920c3');

      Alert.alert('Success', 'Account created successfully! Please verify your email.', [
        { text: 'OK', onPress: () => navigation.replace('login') },
      ]);
    } catch (err) {
      let msg = 'Signup failed. Please try again.';
      if (err.code === 'auth/email-already-in-use') msg = 'This email is already registered';
      if (err.code === 'auth/invalid-email') msg = 'Please enter a valid email address';
      if (err.code === 'auth/weak-password') msg = 'Password must be at least 8 characters';
      if (err.code === 'auth/network-request-failed') msg = 'Network error. Check your connection.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#e6f2ef', '#f8f9fa']} style={styles.gradient}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Header />
          <InputField placeholder="Full Name" value={name} onChangeText={setName} />
          <InputField placeholder="Email Address" value={email} onChangeText={setEmail} keyboardType="email-address" />
          <InputField placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
          <InputField placeholder="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
          <ErrorMessage message={error} />
          <SignupButton loading={loading} onPress={signUp} />
          <AuthLinks navigation={navigation} />
          <Divider />
          <SocialSignup />
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default SignupScreen;
