// LoginScreen.tsx

import { CometChat } from '@cometchat/chat-sdk-react-native';
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
// import { CometChat } from '@cometchat-pro/react-native-chat';

const APP_AUTH_KEY = 'YOUR_COMETCHAT_AUTH_KEY'; // Replace with your Auth Key

const LoginScreen = () => {
  const [userId, setUserId] = useState('');

  const handleLogin = () => {
    if (!userId.trim()) {
      Alert.alert('Error', 'Please enter a valid user ID');
      return;
    }

    CometChat.login(userId, APP_AUTH_KEY).then(
      user => {
        Alert.alert('Success', `Logged in as ${user.getName() || user.getUid()}`);
        // Navigate to chat/home screen
        // navigation.navigate('Home'); <-- Uncomment when using React Navigation
      },
      error => {
        console.log('Login failed:', error);
        Alert.alert('Login Failed', error.message || 'Something went wrong');
      }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CometChat Login</Text>
      <TextInput
        placeholder="Enter User ID"
        value={userId}
        onChangeText={setUserId}
        style={styles.input}
        autoCapitalize="none"
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input: {
    height: 50,
    borderColor: '#888',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
});
