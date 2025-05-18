/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
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

/* -------------------------------------------------------------------------- */
/*  ⚙️  Replace the placeholders below with your own CometChat credentials.    */
/* -------------------------------------------------------------------------- */
const APP_ID = '2749852004e6e162'; // e.g. "123456abc"
const AUTH_KEY = '96e80b8f4460efd9bbf32f14a0068d1bac6920c3'; // e.g. "0b1c2d3e4f5g6h7i8j9k"
const REGION = 'in'; // e.g. "us" | "eu" | "in"
/* -------------------------------------------------------------------------- */


function App(): React.JSX.Element {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
    useEffect(() => {
      const initializeCometChat = async (uid: string) => {
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
                      // await requestPermissions();
                    } catch (err) {
                      console.error('[CometChatUIKit] init/login error', err);
                    }
        try {
          const loggedInUser = await CometChat.getLoggedinUser();
          if (!loggedInUser) {
            console.log('No CometChat session, logging in...');
            await CometChat.login(uid, AUTH_KEY); // 🔒 This uses your Firebase UID
          } else {
            console.log('CometChat already logged in as:', loggedInUser.getUid());
          }
        } catch (error) {
          console.error('CometChat login error:', error);
        }
      };
      const unsubscribe = auth().onAuthStateChanged(async (authenticatedUser) => {
        setUser(authenticatedUser);
        initializeCometChat(authenticatedUser.uid);

        if (authenticatedUser) {
          try {
            const userDocRef = firestore().collection('users').doc(authenticatedUser.uid);
            const userSnap = await userDocRef.get();

            if (userSnap.exists) {
              const userData = userSnap.data();
              setRole(userData?.role || 'user');
            }
          } catch (error) {
            console.error('Error fetching user role:', error);
          }
        }
        setLoading(false);
      });
      return () => unsubscribe();
    }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#6BA292" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.fullScreen}>
    <NavigationContainer>
    {user ? ( role == null ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#6BA292" />
        </View>
        ) : (
          role === 'admin' ? (
            <AdminScreenStackNav />
          ) : (
            <DrawerNavigator userRole={role}/>
          ) ) ) : (
            <LoginSignupScreenStackNav />
          )
        }
        </NavigationContainer>
    </SafeAreaView>
  );
}
/* -------------------------------------------------------------------------- */
/* Styles                                                                     */
/* -------------------------------------------------------------------------- */
const styles: {fullScreen: ViewStyle} = {
  fullScreen: {flex: 1},
};

export default App;

