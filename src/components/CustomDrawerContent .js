import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert
} from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { CometChat } from '@cometchat/chat-sdk-react-native';

const CustomDrawerContent = (props) => {
    const [userData, setUserData] = useState(null);
    const user = auth().currentUser;

  useEffect(() => {
    const fetchUser = async () => {
      if (!user) return;

      try {
        const doc = await firestore().collection('users').doc(user.uid).get();
        if (doc.exists) {
          setUserData(doc.data());
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      // Execute logout
      await auth().signOut();
      CometChat.logout().then(
        () => {
          console.log('Logout completed successfully');
        },
        (error) => {
          console.log('Logout failed with exception:', { error });
        }
      );

      // Show success feedback
      Alert.alert(
        'Logged Out',
        'You have been successfully logged out.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Logout error:', error);
      // User-friendly error messages
      let errorMessage = 'Failed to logout. Please try again.';
      if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Check your internet connection.';
      }
      Alert.alert(
        'Logout Failed',
        errorMessage,
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0, paddingHorizontal: 0}}>
        <View style={styles.profileContainer}>
          <Image
            source={{
              uri: userData?.photo || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.displayName || 'User'),
            }}
            style={styles.avatar}
          />
          <Text style={styles.name}>{userData?.name || 'User'}</Text>
          <Text style={styles.email}>{userData?.email || 'user@domain.com'}</Text>
        </View>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      <View style={styles.logoutContainer}>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
  alignItems: 'center',
  paddingVertical: 20,
//   backgroundColor: '#e0f2f1',
  paddingHorizontal: 0, // remove side padding
  margin: 0,            // ensure no margin from parent
},

  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 10
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3436'
  },
  email: {
    fontSize: 13,
    color: '#636e72'
  },
  logoutContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#ccc'
  },
  logoutText: {
    color: '#d63031',
    fontSize: 16,
    fontWeight: 'bold'
  }
});

export default CustomDrawerContent;
