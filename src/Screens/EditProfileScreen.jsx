import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { launchImageLibrary } from 'react-native-image-picker';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import axios from 'axios';

const CLOUD_NAME   = 'dfnzk8ip2';
const UPLOAD_PRESET = 'educational_resources';

const EditProfileScreen = ({ route }) => {
  const { userData } = route.params;

  /* ------------- edit-profile state ------------- */
  const [name, setName]         = useState(userData.name);
  const [email, setEmail]       = useState(userData.email);
  const [photo, setPhoto]       = useState(null);
  const [uploading, setUploading] = useState(false);

  /* ------------- change-password state ------------- */
  const [oldPwd, setOldPwd]     = useState('');
  const [newPwd, setNewPwd]     = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [pwdLoading, setPwdLoading] = useState(false);

  const uid = auth().currentUser?.uid;

  /* ---------- pick avatar helper ---------- */
  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 1 }, (res) => {
      if (res.assets?.[0]?.uri) setPhoto(res.assets[0].uri);
    });
  };

  /* ---------- upload avatar to Cloudinary ---------- */
  const uploadImageToCloudinary = async (uri) => {
    try {
      const data = new FormData();
      data.append('file', { uri, type: 'image/jpeg', name: 'upload.jpg' });
      data.append('upload_preset', UPLOAD_PRESET);
      data.append('cloud_name', CLOUD_NAME);

      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        data,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      );
      return res.data.secure_url;
    } catch (e) {
      console.error('Cloudinary Error:', e);
      return null;
    }
  };

  /* ---------- save profile changes ---------- */
  const handleUpdateProfile = async () => {
    if (!name || !email) return Alert.alert('Error', 'Name & email are required');

    setUploading(true);
    try {
      const photoUrl = photo ? await uploadImageToCloudinary(photo) : userData.photo;

      await firestore().collection('users').doc(uid).update({
        name,
        email,
        photo: photoUrl,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });

      Alert.alert('Success', 'Profile updated');
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setUploading(false);
    }
  };

  /* ---------- change password ---------- */
  const handleChangePassword = async () => {
    if (!oldPwd || !newPwd || !confirmPwd)
      return Alert.alert('Error', 'Please fill in all password fields');

    if (newPwd !== confirmPwd)
      return Alert.alert('Error', 'New passwords do not match');

    setPwdLoading(true);
    const user = auth().currentUser;

    try {
      // 1) Re-authenticate
      const credential = auth.EmailAuthProvider.credential(user.email, oldPwd);
      await user.reauthenticateWithCredential(credential);

      // 2) Update password
      await user.updatePassword(newPwd);

      // 3) Clear inputs + notify
      setOldPwd('');
      setNewPwd('');
      setConfirmPwd('');
      Alert.alert('Password Changed', 'Your password has been updated successfully.');
    } catch (err) {
      console.error(err);
      const msg =
        err.code === 'auth/wrong-password'
          ? 'Old password is incorrect'
          : err.message || 'Password update failed';
      Alert.alert('Error', msg);
    } finally {
      setPwdLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* ----------- title ----------- */}
      <Text style={styles.title}>Edit Profile</Text>

      {/* ----------- avatar ----------- */}
      <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
        {photo || userData.photo ? (
          <Image
            source={{ uri: photo || userData.photo }}
            style={styles.avatar}
          />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Icon name="camera" size={28} color="#888" />
          </View>
        )}
      </TouchableOpacity>

      {/* ----------- name ----------- */}
      <View style={styles.inputGroup}>
        <Icon name="user" size={20} color="#555" />
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Full Name"
          style={styles.input}
        />
      </View>

      {/* ----------- email ----------- */}
      <View style={styles.inputGroup}>
        <Icon name="mail" size={20} color="#555" />
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email Address"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />
      </View>

      {/* ----------- save button ----------- */}
      <TouchableOpacity
        onPress={handleUpdateProfile}
        style={[styles.button, uploading && { backgroundColor: '#aaa' }]}
        disabled={uploading}
      >
        <Text style={styles.buttonText}>{uploading ? 'Saving...' : 'Save Changes'}</Text>
      </TouchableOpacity>

      {/* ================================================== */}
      {/* ===========  CHANGE PASSWORD SECTION  ============ */}
      {/* ================================================== */}
      <Text style={[styles.title, { marginTop: 35 }]}>Change Password</Text>

      {/* old password */}
      <View style={styles.inputGroup}>
        <Icon name="lock" size={20} color="#555" />
        <TextInput
          value={oldPwd}
          onChangeText={setOldPwd}
          placeholder="Old Password"
          placeholderTextColor="#888" 
          secureTextEntry
          style={styles.input}
        />
      </View>

      {/* new password */}
      <View style={styles.inputGroup}>
        <Icon name="lock" size={20} color="#555" />
        <TextInput
          value={newPwd}
          onChangeText={setNewPwd}
          placeholder="New Password"
          placeholderTextColor="#888" 
          secureTextEntry
          style={styles.input}
        />
      </View>

      {/* confirm password */}
      <View style={styles.inputGroup}>
        <Icon name="lock" size={20} color="#555" />
        <TextInput
          value={confirmPwd}
          onChangeText={setConfirmPwd}
          placeholder="Confirm New Password"
          placeholderTextColor="#888" 
          secureTextEntry
          style={styles.input}
        />
      </View>

      {/* change password button */}
      <TouchableOpacity
        onPress={handleChangePassword}
        style={[styles.button, pwdLoading && { backgroundColor: '#aaa' }]}
        disabled={pwdLoading}
      >
        <Text style={styles.buttonText}>{pwdLoading ? 'Updating...' : 'Change Password'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 24, backgroundColor: '#f9f9f9', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 16, color: '#006666' },
  avatarContainer: { marginBottom: 20 },
  avatar: { width: 110, height: 110, borderRadius: 55 },
  avatarPlaceholder: {
    width: 110, height: 110, borderRadius: 55,
    backgroundColor: '#ddd', alignItems: 'center', justifyContent: 'center'
  },
  inputGroup: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 10,
    marginVertical: 6, width: '100%', elevation: 2
  },
  input: { marginLeft: 10, flex: 1, fontSize: 16, color: '#000' },
  button: {
    backgroundColor: '#006666',
    paddingVertical: 12, borderRadius: 8,
    marginTop: 18, width: '100%', alignItems: 'center', elevation: 3
  },
  buttonText: { color: '#fff', fontSize: 15, fontWeight: '600' },
});

export default EditProfileScreen;
