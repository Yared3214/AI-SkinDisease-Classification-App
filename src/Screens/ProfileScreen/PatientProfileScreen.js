import React, { useEffect, useState } from 'react';
import { View, ScrollView, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

import ProfileHeader from './components/ProfileHeader';
import InfoSection from './components/InfoSection';
import ActionButtons from './components/ActionButtons';

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
        if (doc.exists) setUserData(doc.data());
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
        <ActivityIndicator size="large" color="#006666" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <ProfileHeader userData={userData} />
      <InfoSection userData={userData} />
      <ActionButtons
        onEdit={() => navigation.navigate('edit-profile', { userData })}
        onLogout={handleLogout}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, backgroundColor: '#f8f9fa' },
});

export default PatientProfileScreen;
