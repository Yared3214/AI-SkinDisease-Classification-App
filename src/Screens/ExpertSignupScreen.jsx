import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import DocumentPicker from 'react-native-document-picker';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../FireBaseConfig/FirebaseConfig';
import { useNavigation } from '@react-navigation/native';

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

  // const pickDocument = async () => {
  //   let result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
  //   if (!result.canceled) {
  //     setDocument(result.uri);
  //   }
  // };
  const pickDocument = async () => {
        try {
          const result = await DocumentPicker.pickSingle({
            type: [DocumentPicker.types.allFiles], // Or specify MIME types
          });
          if (result.canceled) {
            alert('No file selected.');
            return;
          }
          setDocument(result.uri);  // For SDK 49+
          console.log(result);
        } catch (error) {
          console.error('Error picking document:', error);
          alert('Something went wrong.');
        }
      };

  const signUpExpert = async () => {
    if (!name || !email || !password || !licenseNumber || !qualifications || !workplace || !document) {
      setError('All fields are required, including document upload.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
      // ✅ Sign out the user after creating the account
      await signOut(FIREBASE_AUTH);
      const user = userCredential.user;
      await setDoc(doc(FIRESTORE_DB, 'experts', user.uid), {
        licenseNumber,
        qualifications,
        workplace,
        document,
      });

      await setDoc(doc(FIRESTORE_DB, 'users', user.uid), {
        uid: user.uid,
        name,
        email,
        role: 'user',
        createdAt: new Date(),
      });

      alert('Signup Successful! Your profile will be reviewed.');
      navigation.navigate('login');
    } catch (error) {
      setError(error.message);
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
