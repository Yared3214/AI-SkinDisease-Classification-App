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
import DropdownField from './components/DropdownField';
import MultilineField from './components/MultilineField';
import ErrorMessage from '../SignupScreen/components/ErrorMessage';
import SignupButton from '../SignupScreen/components/SignupButton';
import AuthLinks from '../SignupScreen/components/AuthLinks';
import SocialSignup from '../SignupScreen/components/SocialSignup';
import styles from './styles';

const ExpertSignupScreen = () => {
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [experience, setExperience] = useState('');
  const [bio, setBio] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  /* ------------------------- 📋 Validation ------------------------- */
  const validateForm = () => {
    if (!name || !email || !specialization || !experience || !bio || !password || !confirmPassword) {
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

  /* --------------------------- 🔐 Signup --------------------------- */
  const signUp = async () => {
    setError('');
    if (!validateForm()) return;

    setLoading(true);
    try {
      const { user } = await auth().createUserWithEmailAndPassword(email, password);
      await user.updateProfile({ displayName: name });

      await firestore().collection('experts').doc(user.uid).set({
        uid: user.uid,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        specialization,
        experience,
        bio,
        role: 'expert',
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
        verified: false,
      });

      const cometChatUser = new CometChat.User(user.uid);
      cometChatUser.setName(name.trim());
      cometChatUser.setMetadata({
        email: email.trim().toLowerCase(),
        role: 'expert',
        specialization,
      });

      await CometChat.createUser(cometChatUser, '96e80b8f4460efd9bbf32f14a0068d1bac6920c3');

      Alert.alert('Success', 'Expert account created successfully!', [
        { text: 'OK', onPress: () => navigation.replace('expertLogin') },
      ]);
    } catch (err) {
      let msg = 'Signup failed. Please try again.';
      if (err.code === 'auth/email-already-in-use') msg = 'This email is already registered';
      if (err.code === 'auth/invalid-email') msg = 'Invalid email address';
      if (err.code === 'auth/weak-password') msg = 'Password must be at least 8 characters';
      if (err.code === 'auth/network-request-failed') msg = 'Network error. Check your connection.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#E9F5F1', '#F8FAFC']} style={styles.gradient}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Header />
          <InputField placeholder="Full Name" value={name} onChangeText={setName} />
          <InputField placeholder="Email Address" value={email} onChangeText={setEmail} keyboardType="email-address" />
          <DropdownField
            placeholder="Select Specialization"
            value={specialization}
            options={['Therapist', 'Nutritionist', 'Life Coach', 'Fitness Trainer', 'Career Consultant']}
            onSelect={setSpecialization}
          />
          <InputField placeholder="Years of Experience" value={experience} onChangeText={setExperience} keyboardType="numeric" />
          <MultilineField placeholder="Brief Bio" value={bio} onChangeText={setBio} />
          <InputField placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
          <InputField placeholder="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
          <ErrorMessage message={error} />
          <SignupButton loading={loading} onPress={signUp} />
          <AuthLinks navigation={navigation} loginScreen="expertLogin" />
          <SocialSignup />
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default ExpertSignupScreen;
