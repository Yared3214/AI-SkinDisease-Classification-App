import { View, Text, TouchableOpacity, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import { CometChat } from '@cometchat/chat-sdk-react-native';
// import { FIREBASE_AUTH } from '../firebaseConfig';

const ProfileScreen = () => {
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
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome to Profile</Text>
      <TouchableOpacity onPress={handleLogout} style={{ marginTop: 20, padding: 10, backgroundColor: 'red' }}>
        <Text style={{ color: 'white' }}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;
