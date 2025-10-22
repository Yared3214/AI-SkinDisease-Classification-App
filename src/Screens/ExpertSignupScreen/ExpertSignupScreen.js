import React, { useState } from 'react';
import {
  View,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { CometChat } from '@cometchat/chat-sdk-react-native';
import DocumentPicker from 'react-native-document-picker';
import Icon from 'react-native-vector-icons/Feather';
import RNBlobUtil from 'react-native-blob-util';
import { Buffer } from 'buffer';
import { supabase } from '../../supabaseClient';

import Header from './components/Header';
import InputField from './components/InputField';
import DropdownField from './components/DropdownField';
import MultilineField from './components/MultilineField';
import ErrorMessage from '../SignupScreen/components/ErrorMessage';
import SignupButton from '../SignupScreen/components/SignupButton';
import AuthLinks from '../SignupScreen/components/AuthLinks';
import SocialSignup from '../SignupScreen/components/SocialSignup';
import styles from './styles';
import { Input } from 'react-native-elements';

const ExpertSignupScreen = () => {
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [experience, setExperience] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [workplace, setWorkplace] = useState('');
  const [bio, setBio] = useState('');
  const [document, setDocument] = useState(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  /* ------------------------- 📋 Validation ------------------------- */
  // const validateForm = () => {
  //   if (
  //     !name ||
  //     !email ||
  //     !specialization ||
  //     !experience ||
  //     !licenseNumber ||
  //     !pastWorkplaces ||
  //     !bio ||
  //     !password ||
  //     !confirmPassword ||
  //     !certFile
  //   ) {
  //     setError('All fields including certification document are required.');
  //     return false;
  //   }
  //   if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  //     setError('Please enter a valid email address');
  //     return false;
  //   }
  //   if (password.length < 8) {
  //     setError('Password must be at least 8 characters');
  //     return false;
  //   }
  //   if (password !== confirmPassword) {
  //     setError('Passwords do not match');
  //     return false;
  //   }
  //   return true;
  // };

  const validateInputs = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/; // Min 6 chars, 1 letter, 1 number

    if (!name.trim()) return "Full Name is required.";
    if (!emailRegex.test(email)) return "Please enter a valid email address.";
    if (!passwordRegex.test(password)) return "Password must be at least 6 characters, including a letter and a number.";
    if (password !== confirmPassword) return "Passwords do not match.";
    if (!licenseNumber.trim()) return "Medical License Number is required.";
    if (licenseNumber.length < 5) return "License Number seems too short.";
    if (!specialization.trim()) return "Qualifications are required.";
    if (!workplace.trim()) return "Workplace is required.";
    if (!document) return "Please upload a certification document.";
    return null;
  };

  /* ------------------------ 📄 File Picker ------------------------- */
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.pdf], // Or allFiles
      });

      if (result?.uri) {
        setDocument(result);
        console.log("Selected document:", result);
      }
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        console.log("User canceled document picker");
      } else {
        console.error("Error picking document:", error);
        Alert.alert("Something went wrong.");
      }
    }
  };

  const uploadToSupabase = async (file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `documents/${fileName}`;

    // Read file as base64 from content:// URI
    const base64Data = await RNBlobUtil.fs.readFile(file.uri, 'base64');

    const fileBuffer = Buffer.from(base64Data, 'base64');

    const { data, error } = await supabase.storage
      .from('experts-credentials')
      .upload(filePath, fileBuffer, {
        contentType: file.type || 'application/octet-stream',
        upsert: false,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      throw new Error("File upload failed");
    }

    const { data: publicUrlData } = supabase.storage
      .from('experts-credentials')
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  };

  /* --------------------------- 🔐 Signup --------------------------- */
  const signUp = async () => {
    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      console.log("Uploading document to Supabase...");
      const fileUrl = await uploadToSupabase(document);
      console.log("File uploaded to Supabase:", fileUrl);
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      await user.updateProfile({
        displayName: name,
      });

       // Save expert profile
       await firestore().collection("experts").doc(user.uid).set({
        licenseNumber,
        specialization,
        workplace,
        document: fileUrl, // NOTE: This is a URI, not a file in cloud storage
      });

      await firestore().collection("users").doc(user.uid).set({
        uid: user.uid,
        name,
        email,
        role: "user",
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
        emailVerified: false,
        profileComplete: false,
      });

      const cometChatUser = new CometChat.User(user.uid); // Using Firebase UID as CometChat UID
      cometChatUser.setName(name.trim());
      // Add additional CometChat user attributes if needed
      cometChatUser.setMetadata({
        email: email.trim().toLowerCase(),
        firebase_uid: user.uid,
      });

      const authKey = '96e80b8f4460efd9bbf32f14a0068d1bac6920c3'; // Replace with your actual auth key

      await CometChat.createUser(cometChatUser, authKey);
      console.log('CometChat user created successfully');

      Alert.alert("Success", "Signup Successful! Your profile will be reviewed.");
      navigation.navigate("login");
    } catch (err) {
      let msg = 'Signup failed. Please try again.';
      if (err.code === 'auth/email-already-in-use') msg = 'This email is already registered';
      if (err.code === 'auth/invalid-email') msg = 'Invalid email address';
      if (err.code === 'auth/weak-password') msg = 'Password must be at least 8 characters';
      if (err.code === 'auth/network-request-failed') msg = 'Network error. Check your connection.';
      setError(msg);
      console.error(msg, err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#E9F5F1', '#F8FAFC']} style={styles.gradient}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Header />

          {/* Core Fields */}
          <InputField placeholder="Full Name" value={name} onChangeText={setName} />
          <InputField
            placeholder="Email Address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <DropdownField
            placeholder="Select Specialization"
            value={specialization}
            options={[
              'Therapist',
              'Nutritionist',
              'Life Coach',
              'Fitness Trainer',
              'Career Consultant',
            ]}
            onSelect={setSpecialization}
          />
          <InputField
            placeholder="Years of Experience"
            value={experience}
            onChangeText={setExperience}
            keyboardType="numeric"
          />
          <InputField
            placeholder="Medical License Number"
            value={licenseNumber}
            onChangeText={setLicenseNumber}
          />
          <InputField
            placeholder="Current Workplace (Hospital/Clinic)"
            value={workplace}
            onChangeText={setWorkplace}
          />
          {/* <MultilineField
            placeholder="Past Workplaces"
            value={pastWorkplaces}
            onChangeText={setPastWorkplaces}
          /> */}
          <MultilineField placeholder="Brief Bio" value={bio} onChangeText={setBio} />

          {/* PDF Upload */}
          <TouchableOpacity style={styles.uploadButton} onPress={pickDocument}>
        <Text style={styles.uploadButtonText}>{document ? 'Document Uploaded' : 'Upload Certification (PDF)'}</Text>
      </TouchableOpacity>

          <InputField
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <InputField
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <ErrorMessage message={error} />
          <SignupButton loading={loading} onPress={signUp} />
          <AuthLinks navigation={navigation} loginScreen="expertLogin" />
          <SocialSignup />
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default ExpertSignupScreen;
