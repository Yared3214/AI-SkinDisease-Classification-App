// src/screens/LoginScreen/LoginScreen.js
import React, { useState } from 'react';
import {
  View,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { CometChatUIKit } from '@cometchat/chat-uikit-react-native';
import { CometChat } from '@cometchat/chat-sdk-react-native';
import { requestPermissions } from '../../utils/permissions';

import Header from './components/Header';
import InputField from './components/InputField';
import AuthLinks from './components/AuthLinks';
import LoginButton from './components/LoginButton';
import Divider from './components/Divider';
import SocialLogin from './components/SocialLogin';
import styles from './styles';

/* -------------------------------------------------------------------------- */
/* 💬 CometChat Config                                                       */
/* -------------------------------------------------------------------------- */
const APP_ID = '2749852004e6e162';
const AUTH_KEY = '96e80b8f4460efd9bbf32f14a0068d1bac6920c3';
const REGION = 'in';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const signIn = async () => {
    if (loading) return;
    if (!email || !password) {
      Alert.alert('Error', 'Email and password are required.');
      return;
    }

    setLoading(true);
    try {
      // Firebase authentication
      const response = await auth().signInWithEmailAndPassword(email, password);
      const uid = response.user.uid;

      // Initialize CometChat
      const uiKitSettings = {
        appId: APP_ID,
        authKey: AUTH_KEY,
        region: REGION,
        subscriptionType: CometChat.AppSettings.SUBSCRIPTION_TYPE_ALL_USERS,
      };

      await CometChatUIKit.init(uiKitSettings);
      await requestPermissions();
      await CometChatUIKit.login({ uid });
    } catch (error) {
      if (error.code === 'auth/network-request-failed') {
        Alert.alert('Network Error', 'Check your internet connection.');
      } else if (
        error.code === 'auth/user-not-found' ||
        error.code === 'auth/wrong-password'
      ) {
        Alert.alert('Sign in failed', 'Incorrect email or password.');
      } else {
        Alert.alert('Sign in failed', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#e6f2ef', '#f8f9fa']} style={styles.gradient}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Header />
          <InputField
            placeholder="Email Address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <InputField
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <AuthLinks navigation={navigation} />
          <LoginButton onPress={signIn} loading={loading} />
          <Divider />
          <SocialLogin />
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default LoginScreen;
