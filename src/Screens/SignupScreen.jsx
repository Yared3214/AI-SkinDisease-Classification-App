import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { CometChat } from '@cometchat/chat-sdk-react-native';

const SignupScreen = () => {
  const navigation = useNavigation();

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // UI state
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Form validation
  const validateForm = () => {
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError('All fields are required');
      return false;
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }

    // Password length check
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }

    // Confirm password match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  // Handle sign up process
  const signUp = async () => {
    setError('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      // 1. Register user with Firebase Authentication
      const { user } = await auth().createUserWithEmailAndPassword(email, password);

      // 2. Update user profile with display name
      await user.updateProfile({ displayName: name });

      // 3. Store user data in Firestore
      await firestore()
        .collection('users')
        .doc(user.uid)
        .set({
          uid: user.uid,
          name: name.trim(),
          email: email.trim().toLowerCase(),
          role: 'user',
          createdAt: firestore.FieldValue.serverTimestamp(),
          updatedAt: firestore.FieldValue.serverTimestamp(),
          emailVerified: false,
          profileComplete: false,
        });

      // 4. Create user on CometChat platform using Firebase UID
      const cometChatUser = new CometChat.User(user.uid);
      cometChatUser.setName(name.trim());
      cometChatUser.setMetadata({
        email: email.trim().toLowerCase(),
        firebase_uid: user.uid,
      });

      const authKey = '96e80b8f4460efd9bbf32f14a0068d1bac6920c3'; // Use your actual CometChat auth key
      await CometChat.createUser(cometChatUser, authKey);

      console.log('CometChat user created successfully');

      // Notify user of successful signup
      Alert.alert(
        'Success',
        'Account created! Please check your email to verify your account.',
        [{ text: 'OK', onPress: () => navigation.replace('login') }]
      );
    } catch (error) {
      console.error('Signup error:', error);

      // Handle common Firebase auth errors
      let errorMessage = 'Signup failed. Please try again.';
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'This email is already registered';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password should be at least 8 characters';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your connection';
          break;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Screen title */}
      <Text style={styles.title}>
        <FontAwesome name="user-plus" size={18} color="#4F4F4F" />{' '}
        <Text style={styles.titleText}>Create Account</Text>
      </Text>

      {/* Input fields */}
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        placeholderTextColor="#A9A9A9"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        placeholderTextColor="#A9A9A9"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        placeholderTextColor="#A9A9A9"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm your password"
        placeholderTextColor="#A9A9A9"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {/* Display error message */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* Signup button */}
      <TouchableOpacity style={styles.signupButton} onPress={signUp}>
        {loading ? (
          <ActivityIndicator size="small" color="#FFF" />
        ) : (
          <Text style={styles.signupButtonText}>Sign Up</Text>
        )}
      </TouchableOpacity>

      {/* Link to login */}
      <View style={styles.linkContainer}>
        <Text style={styles.linkText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('login')}>
          <Text style={styles.link}>Login</Text>
        </TouchableOpacity>
      </View>

      {/* Social signup section (UI only for now) */}
      <Text style={styles.socialText}>Sign up with Social Media</Text>
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

export default SignupScreen;

// Styles for the component
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
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
  },
  signupButton: {
    width: '100%',
    backgroundColor: '#6BA292',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
  },
  signupButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  linkText: {
    fontSize: 14,
    color: '#4F4F4F',
  },
  link: {
    color: '#4F8A8B',
    fontSize: 14,
    marginLeft: 5,
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
