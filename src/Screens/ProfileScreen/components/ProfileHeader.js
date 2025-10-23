import React from 'react';
import { View, Text, Image, StyleSheet, LinearGradient } from 'react-native';

const ProfileHeader = ({ userData }) => {
  const avatarUri =
    userData?.photo ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(userData?.name || 'User')}&background=006666&color=fff`;

  return (
    <View style={styles.headerContainer}>
      <View style={styles.cover}></View>
      <View style={styles.avatarContainer}>
        <Image source={{ uri: avatarUri }} style={styles.avatar} />
      </View>
      <Text style={styles.name}>{userData?.name}</Text>
      <Text style={styles.email}>{userData?.email}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    marginBottom: 25,
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    paddingBottom: 20,
  },
  cover: {
    backgroundColor: '#006666',
    height: 120,
    width: '100%',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  avatarContainer: {
    marginTop: -45,
    borderWidth: 4,
    borderColor: '#fff',
    borderRadius: 75,
    overflow: 'hidden',
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  name: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d3436',
  },
  email: {
    fontSize: 14,
    color: '#636e72',
    marginTop: 3,
  },
});

export default ProfileHeader;
