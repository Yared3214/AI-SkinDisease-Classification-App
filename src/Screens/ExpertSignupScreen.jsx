import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import DocumentPicker from 'react-native-document-picker';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../supabaseClient';
import RNBlobUtil from 'react-native-blob-util';
import { Buffer } from 'buffer';
import { CometChat } from '@cometchat/chat-sdk-react-native';

const ExpertSignupScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [qualifications, setQualifications] = useState('');
  const [workplace, setWorkplace] = useState('');
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const validateInputs = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/; // Min 6 chars, 1 letter, 1 number

    if (!name.trim()) return "Full Name is required.";
    if (!emailRegex.test(email)) return "Please enter a valid email address.";
    if (!passwordRegex.test(password)) return "Password must be at least 6 characters, including a letter and a number.";
    if (!licenseNumber.trim()) return "Medical License Number is required.";
    if (licenseNumber.length < 5) return "License Number seems too short.";
    if (!qualifications.trim()) return "Qualifications are required.";
    if (!workplace.trim()) return "Workplace is required.";
    if (!document) return "Please upload a certification document.";
    return null;
  };

  // const pickDocument = async () => {
  //   let result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
  //   if (!result.canceled) {
  //     setDocument(result.uri);
  //   }
  // };

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




  const signUpExpert = async () => {
    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const fileUrl = await uploadToSupabase(document);
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

       await user.updateProfile({
        displayName: name,
      });

      // Save expert profile
      await firestore().collection("experts").doc(user.uid).set({
        licenseNumber,
        qualifications,
        workplace,
        document: fileUrl, // NOTE: This is a URI, not a file in cloud storage
      });

      // Save user profile
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
      console.error("Signup error:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}><FontAwesome name="user-md" size={18} color="#4F4F4F" /> Expert Signup</Text>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <TextInput
      style={styles.input}
      placeholder="Full Name"
      placeholderTextColor="#A9A9A9"
      value={name}
      onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#A9A9A9" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#A9A9A9" secureTextEntry value={password} onChangeText={setPassword} />
      <TextInput style={styles.input} placeholder="Medical License Number" placeholderTextColor="#A9A9A9" value={licenseNumber} onChangeText={setLicenseNumber} />
      <TextInput style={styles.input} placeholder="Qualifications (e.g. MD, Dermatology)" placeholderTextColor="#A9A9A9" value={qualifications} onChangeText={setQualifications} />
      <TextInput style={styles.input} placeholder="Workplace (Hospital/Clinic)" placeholderTextColor="#A9A9A9" value={workplace} onChangeText={setWorkplace} />
      <TouchableOpacity style={styles.uploadButton} onPress={pickDocument}>
        <Text style={styles.uploadButtonText}>{document ? 'Document Uploaded' : 'Upload Certification (PDF)'}</Text>
      </TouchableOpacity>

      {loading ? <ActivityIndicator size="large" color="#6BA292" /> : (
        <TouchableOpacity style={styles.signupButton} onPress={signUpExpert}>
          <Text style={styles.signupButtonText}>Sign Up</Text>
        </TouchableOpacity>
      )}

      <View style={styles.linkContainer}>
        <Text style={styles.linkText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('login')}>
          <Text style={styles.link}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#4F4F4F' },
  errorText: { color: 'red', marginBottom: 10 },
  input: { width: '100%', height: 50, backgroundColor: '#FFF', borderRadius: 25, paddingLeft: 15, marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  uploadButton: { width: '100%', backgroundColor: '#FFF', paddingVertical: 15, borderRadius: 25, alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: '#6BA292' },
  uploadButtonText: { color: '#6BA292', fontSize: 16 },
  signupButton: { width: '100%', backgroundColor: '#6BA292', paddingVertical: 15, borderRadius: 25, alignItems: 'center', marginBottom: 20 },
  signupButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  linkContainer: { flexDirection: 'row', marginBottom: 20 },
  linkText: { fontSize: 14, color: '#4F4F4F' },
  link: { color: '#4F8A8B', fontSize: 14, marginLeft: 5 },
});

export default ExpertSignupScreen;
