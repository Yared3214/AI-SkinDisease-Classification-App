/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Main entry point for the app.
 * Handles user authentication state, role-based navigation, and CometChat initialization.
 */

import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  View,
  ViewStyle,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import AdminScreenStackNav from './src/Navigation/AdminScreenStackNav';
import DrawerNavigator from './src/Navigation/DrawerNavigator';
import LoginSignupScreenStackNav from './src/Navigation/LoginSignupScreenStackNav';

import { CometChat } from '@cometchat/chat-sdk-react-native';
import { CometChatUIKit } from '@cometchat/chat-uikit-react-native';
import { Buffer } from 'buffer';
import { useNotification } from './src/notifications/useNotification';

// Assigning Buffer to global scope for compatibility
global.Buffer = Buffer;

/* -------------------------------------------------------------------------- */
/* 🔐 CometChat Credentials — Replace with your actual values                 */
/* -------------------------------------------------------------------------- */
const APP_ID = '2749852004e6e162';
const AUTH_KEY = '96e80b8f4460efd9bbf32f14a0068d1bac6920c3';
const REGION = 'in';

/* -------------------------------------------------------------------------- */
/* 🏁 Main App Component                                                      */
/* -------------------------------------------------------------------------- */
function App(): React.JSX.Element {
  // App state hooks
  const [user, setUser] = useState(null);       // Firebase Authenticated User
  const [loading, setLoading] = useState(true); // UI loading state
  const [role, setRole] = useState(null);       // User role from Firestore

  // ⚙️ Initialize CometChat and listen for Firebase auth state changes
  useEffect(() => {
    // Initialize CometChatUIKit for messaging
    const initializeCometChat = async (uid: string) => {
      const uiKitSettings = {
        appId: APP_ID,
        authKey: AUTH_KEY,
        region: REGION,
        subscriptionType: CometChat.AppSettings.SUBSCRIPTION_TYPE_ALL_USERS,
      };

      try {
        await CometChatUIKit.init(uiKitSettings);
        console.log('[CometChatUIKit] initialized');
      } catch (err) {
        console.error('[CometChatUIKit] init/login error', err);
      }
    };

    // Listen to Firebase Auth state
    const unsubscribe = auth().onAuthStateChanged(async (authenticatedUser) => {
      console.log('Auth state changed:', authenticatedUser);

      if (authenticatedUser) {
        // User is signed in
        setUser(authenticatedUser);

        // Initialize chat SDK with UID
        initializeCometChat(authenticatedUser.uid);

        // Fetch user role from Firestore
        try {
          const userDocRef = firestore().collection('users').doc(authenticatedUser.uid);
          const userSnap = await userDocRef.get();

          if (userSnap.exists) {
            const userData = userSnap.data();
            setRole(userData?.role || 'user'); // Default to 'user' if role is missing
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
        }

        setLoading(false);
      } else {
        // User is signed out
        setUser(null);
        setRole(null);
        setLoading(false);
      }
    });

    // Clean up listener on unmount
    return () => unsubscribe();
  }, []);

  // 🛎️ Initialize notifications (custom hook)
  // useNotification();

  // ⏳ Show loading screen while app is initializing
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#6BA292" />
      </View>
    );
  }

  // 🚦 Navigation based on user authentication and role
  return (
    <SafeAreaView style={styles.fullScreen}>
      <NavigationContainer>
        {user ? (
          role == null ? (
            // Still fetching role from Firestore
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <ActivityIndicator size="large" color="#6BA292" />
            </View>
          ) : (
            // Authenticated and role fetched — show appropriate navigation
            role === 'admin' ? (
              <AdminScreenStackNav />
            ) : (
              <DrawerNavigator userRole={role} />
            )
          )
        ) : (
          // User is not signed in
          <LoginSignupScreenStackNav />
        )}
      </NavigationContainer>
    </SafeAreaView>
  );
}

/* -------------------------------------------------------------------------- */
/* 🎨 Styles                                                                  */
/* -------------------------------------------------------------------------- */
const styles: { fullScreen: ViewStyle } = {
  fullScreen: { flex: 1 },
};

export default App;
