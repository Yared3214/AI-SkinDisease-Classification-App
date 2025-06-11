import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { CometChatUIKit, UIKitSettings } from '@cometchat/chat-uikit-react-native';
import { CometChat } from '@cometchat/chat-sdk-react-native';

/* -------------------------------------------------------------------------- */
/* 💬 CometChat Configuration                                                */
/* -------------------------------------------------------------------------- */
const APP_ID = '2749852004e6e162';
const AUTH_KEY = '96e80b8f4460efd9bbf32f14a0068d1bac6920c3';
const REGION = 'in';

const LoginScreen = () => {
  // 🔧 Local state for email, password, and loading spinner
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  /**
   * 📥 Sign in handler
   * Authenticates user using Firebase and logs them into CometChat
   */
  const signIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Email and password are required.');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // 1️⃣ Sign in with Firebase
      const response = await auth().signInWithEmailAndPassword(email, password);
      const uid = response.user.uid;

      // 2️⃣ Initialize CometChat UIKit
      const uiKitSettings = {
        appId: APP_ID,
        authKey: AUTH_KEY,
        region: REGION,
        subscriptionType: CometChat.AppSettings.SUBSCRIPTION_TYPE_ALL_USERS,
      };

      try {
        await CometChatUIKit.init(uiKitSettings);
        console.log('[CometChatUIKit] initialized');

        // 3️⃣ Request permissions for Android devices
        await requestPermissions();

        // 4️⃣ Log user into CometChat using Firebase UID
        console.log(uid);
        await CometChatUIKit.login({ uid });
      } catch (err) {
        console.error('[CometChatUIKit] init/login error', err);
      }
    } catch (error) {
      console.error('Sign in error:', error);
      Alert.alert('Sign in failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 📱 Requests runtime permissions on Android (e.g. camera, audio, notifications)
   */
  const requestPermissions = async () => {
    if (Platform.OS !== 'android') return;
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      ]);

      const allGranted = Object.values(granted).every(
        status => status === PermissionsAndroid.RESULTS.GRANTED
      );

      if (!allGranted) {
        console.warn('[Permissions] Not all permissions granted');
      }
    } catch (err) {
      console.warn('[Permissions] Error requesting Android permissions', err);
    }
  };

  return (
    <View style={styles.container}>
      {/* 👤 Title */}
      <Text style={styles.title}>
        <FontAwesome name="user" size={18} color="#4F4F4F" />{' '}
        <Text style={styles.titleText}>User Login</Text>
      </Text>

      {/* 📧 Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        placeholderTextColor="#A9A9A9"
        value={email}
        onChangeText={setEmail}
      />

      {/* 🔒 Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        placeholderTextColor="#A9A9A9"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* 🔗 Forgot Password and Create Account Links */}
      <View style={styles.linkContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('forgot-pass')}>
          <Text style={styles.link}>Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('type-selection')}>
          <Text style={styles.link}>Create Account</Text>
        </TouchableOpacity>
      </View>

      {/* 🔓 Login Button */}
      <TouchableOpacity style={styles.loginButton} onPress={signIn}>
        {loading ? (
          <ActivityIndicator size="small" color="#FFF" />
        ) : (
          <Text style={styles.loginButtonText}>Login</Text>
        )}
      </TouchableOpacity>

      {/* 🌐 Social Media Login Options */}
      <Text style={styles.socialText}>Login with Social Media</Text>
      <View style={styles.socialContainer}>
        <TouchableOpacity style={styles.socialButton}>
          <FontAwesome name="google" size={24} color="#DB4437" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <FontAwesome name="facebook" size={24} color="#1877F2" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;

/* -------------------------------------------------------------------------- */
/* 🎨 Styles                                                                 */
/* -------------------------------------------------------------------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#4F4F4F',
  },
  titleText: {
    color: '#4F4F4F',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    color: '#000',
    paddingLeft: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  link: {
    color: '#4F8A8B',
    fontSize: 14,
  },
  loginButton: {
    width: '100%',
    backgroundColor: '#6BA292',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  socialText: {
    fontSize: 14,
    color: '#4F4F4F',
    marginBottom: 10,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  socialButton: {
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 50,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
});
