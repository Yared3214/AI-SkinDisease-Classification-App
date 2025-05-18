import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Platform, PermissionsAndroid } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import { FIREBASE_AUTH } from '../../FireBaseConfig/FirebaseConfig';
// import { signInWithEmailAndPassword } from 'firebase/auth';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { CometChatUIKit, UIKitSettings } from '@cometchat/chat-uikit-react-native';
import { CometChat } from '@cometchat/chat-sdk-react-native';

/* -------------------------------------------------------------------------- */
/*  ⚙️  Replace the placeholders below with your own CometChat credentials.    */
/* -------------------------------------------------------------------------- */
const APP_ID = '2749852004e6e162'; // e.g. "123456abc"
const AUTH_KEY = '96e80b8f4460efd9bbf32f14a0068d1bac6920c3'; // e.g. "0b1c2d3e4f5g6h7i8j9k"
const REGION = 'in'; // e.g. "us" | "eu" | "in"
/* -------------------------------------------------------------------------- */

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const signIn = async () => {
    setLoading(true);
    try {
      const response = await auth().signInWithEmailAndPassword(email, password);
      const uid = response.user.uid; // Get the Firebase UID
      const uiKitSettings = {
              appId: APP_ID,
              authKey: AUTH_KEY,
              region: REGION,
              subscriptionType: CometChat.AppSettings
                .SUBSCRIPTION_TYPE_ALL_USERS,
            };

            try {
              await CometChatUIKit.init(uiKitSettings);
              console.log('[CometChatUIKit] initialized');

              // 2️⃣  Android runtime permissions (camera, mic, etc.).
              await requestPermissions();

              // 3️⃣  Login.
              await CometChatUIKit.login({uid: uid});
              Alert.alert('Success', 'Logged in as user: Unknown');
              let receiverID = 'yared';
              let messageText = 'Hello world!';
              let receiverType = CometChat.RECEIVER_TYPE.USER;

              let textMessage = new CometChat.TextMessage(receiverID, messageText, receiverType);

              CometChat.sendMessage(textMessage)
                .then(message => {
                  console.log('Message sent successfully:', message);
                })
                .catch(error => {
          console.log('Message sending failed with error:', error);
                });
            } catch (err) {
              console.error('[CometChatUIKit] init/login error', err);
            }
    } catch (error) {
      console.error('Sign in error:', error);
      alert('Sign in failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  /* ------------------------------------------------------------------ */
        /* Helper: request common Android permissions                          */
        /* ------------------------------------------------------------------ */
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
              status => status === PermissionsAndroid.RESULTS.GRANTED,
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
      {/* User Login Title */}
      <Text style={styles.title}>
        <FontAwesome name="user" size={18} color="#4F4F4F" />{''}
        <Text style={styles.titleText}>User Login</Text>
      </Text>

      {/* Input Fields */}
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        placeholderTextColor="#A9A9A9"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        placeholderTextColor="#A9A9A9"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Forgot Password & Create Account */}
      <View style={styles.linkContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('forgot-pass')}>
          <Text style={styles.link}>Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('type-selection')}>
          <Text style={styles.link}>Create Account</Text>
        </TouchableOpacity>
      </View>

      {/* Login Button */}
      <TouchableOpacity style={styles.loginButton}
      onPress={signIn}>
        {loading ? <ActivityIndicator size="small" color="#FFF" />
      : <Text style={styles.loginButtonText}>Login</Text>}
      </TouchableOpacity>

      {/* Social Login */}
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
