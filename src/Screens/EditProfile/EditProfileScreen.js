import React, { useState } from 'react';
import { ScrollView, View, Alert, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import RNBlobUtil from 'react-native-blob-util';
import { Buffer } from 'buffer';
import { supabase } from '../../supabaseClient';

import HeaderSection from './components/HeaderSection';
import AvatarPicker from './components/AvatarPicker';
import ProfileForm from './components/ProfileForm';
import PasswordSection from './components/PasswordSection';

const EditProfileScreen = ({ route }) => {
  const { userData } = route.params;
  const [photo, setPhoto] = useState(null);
  const [uploading, setUploading] = useState(false);

  const uid = auth().currentUser?.uid;

  /* ---------- Upload image helper ---------- */
  const uploadImageToSupabase = async (imageFile) => {
    try {
      // Get the file extension (jpg, png, etc.)
      const fileExt = imageFile.fileName ? imageFile.fileName.split('.').pop() : 'jpg';
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `images/${fileName}`;
  
      // Read the image as base64
      const base64Data = await RNBlobUtil.fs.readFile(imageFile.uri, 'base64');
      const fileBuffer = Buffer.from(base64Data, 'base64');
  
      // Upload to Supabase
      const { data, error } = await supabase.storage
        .from('profile-photos')
        .upload(filePath, fileBuffer, {
          contentType: imageFile.type || 'image/jpeg',
        });
  
      if (error) {
        console.error('Supabase image upload error:', error);
        throw new Error('Image upload failed');
      }
  
      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(filePath);
  
      return publicUrlData.publicUrl;
    } catch (error) {
      console.error('uploadImageToSupabase error:', error);
      throw error;
    }
  };

  /* ---------- Update profile ---------- */
  const handleUpdateProfile = async (updatedData) => {
    if (!updatedData.name || !updatedData.email)
      return Alert.alert('Error', 'Name & Email are required');

    setUploading(true);
    try {
      const photoUrl = photo ? await uploadImageToSupabase(photo) : userData.photo;
      await firestore().collection('users').doc(uid).update({
        ...updatedData,
        photo: photoUrl,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (err) {
      console.error('Profile Update Error:', err);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 60 }}>
      <HeaderSection title="Edit Profile" />
      <View style={styles.content}>
        <AvatarPicker
          currentPhoto={photo || userData.photo}
          onPhotoSelect={setPhoto}
        />
        <ProfileForm
          userData={userData}
          onSubmit={handleUpdateProfile}
          loading={uploading}
        />
        <PasswordSection />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FDFB' },
  content: { padding: 20 },
});

export default EditProfileScreen;
