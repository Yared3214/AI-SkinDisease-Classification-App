import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

const PatientProfileScreen = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUser = async () => {
      const user = auth().currentUser;
      if (!user) return;

      try {
        const doc = await firestore().collection('users').doc(user.uid).get();
        if (doc.exists) {
          setUserData(doc.data());
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await auth().signOut();
      navigation.replace('login');
    } catch (err) {
      Alert.alert('Logout failed', err.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00b894" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <Image
          source={{
            uri:
              userData?.photo ||
              'https://ui-avatars.com/api/?name=' + encodeURIComponent(userData?.name || 'User')
          }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{userData?.name}</Text>
        <Text style={styles.email}>{userData?.email}</Text>
      </View>

      {/* Info Cards */}
      <View style={styles.infoCard}>
        <Icon name="phone" size={18} color="#2d3436" />
        <Text style={styles.infoText}>{userData?.phone || '-'}</Text>
      </View>

      <View style={styles.infoCard}>
  <Icon name="check-circle" size={18} color="#2d3436" />
  <Text style={styles.infoText}>
    Email Verified: {userData?.emailVerified ? 'Yes' : 'No'}
  </Text>
</View>

<View style={styles.infoCard}>
  <Icon name="user-check" size={18} color="#2d3436" />
  <Text style={styles.infoText}>
    Profile Complete: {userData?.profileComplete ? 'Yes' : 'No'}
  </Text>
</View>



      {/* Actions */}
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate('edit-profile', {userData: userData})}
      >
        <Text style={styles.buttonText}>Edit Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: {
    padding: 20,
    backgroundColor: '#f5f6fa',
    flexGrow: 1
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 10
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d3436'
  },
  email: {
    fontSize: 14,
    color: '#636e72',
    marginTop: 4
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    gap: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 3
  },
  infoText: {
    fontSize: 15,
    color: '#2d3436'
  },
  editButton: {
    backgroundColor: '#006666',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20
  },
  logoutButton: {
    backgroundColor: '#d63031',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15
  }
});

export default PatientProfileScreen;
