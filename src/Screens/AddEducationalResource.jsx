import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {Picker} from '@react-native-picker/picker';
import axios from 'axios';
import DocumentPicker from 'react-native-document-picker';
import { supabase } from '../supabaseClient';
import RNBlobUtil from 'react-native-blob-util';
import { Buffer } from 'buffer';

const CLOUD_NAME = 'dfnzk8ip2';
const UPLOAD_PRESET = 'educational_resources';


const AddEducationalResource = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [resourceType, setResourceType] = useState('article');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [document, setDocument] = useState(null);

  // Fetch current user's name
  useEffect(() => {
    const fetchUserName = async () => {
      const user = auth().currentUser;
      if (user) {
        try {
          const userDoc = await firestore()
            .collection('users')
            .doc(user.uid)
            .get();

          if (userDoc.exists) {
            setAuthor(userDoc.data().name || user.displayName || 'Anonymous');
          }
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      }
    };

    fetchUserName();
  }, []);


  const pickImage = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
      includeBase64: false,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.error('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri;
        setImage(uri);
      }
    });
  };

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

  // Upload Image to Cloudinary
  const uploadImageToCloudinary = async (imageUri) => {
    try {
      const data = new FormData();
      data.append('file', { uri: imageUri, type: 'image/jpeg', name: 'upload.jpg' });
      data.append('upload_preset', UPLOAD_PRESET);
      data.append('cloud_name', CLOUD_NAME);

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        data,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      return response.data.secure_url;
    } catch (error) {
      console.error('Cloudinary Upload Error:', error);
      return null;
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
      .from('educational-resource')
      .upload(filePath, fileBuffer, {
        contentType: file.type || 'application/octet-stream',
        upsert: false,
      });
  
    if (error) {
      console.error("Supabase upload error:", error);
      throw new Error("File upload failed");
    }
  
    const { data: publicUrlData } = supabase.storage
      .from('educational-resource')
      .getPublicUrl(filePath);
  
    return publicUrlData.publicUrl;
  };

  const handleSubmit = async () => {
    // Validate fields
    if (!title || !description || !resourceType) {
      Alert.alert('Error', 'Title, description and type are required!');
      return;
    }

    if ((resourceType === 'article' || resourceType === 'infographic') && !image) {
      Alert.alert('Error', 'Image is required for this resource type');
      return;
    }

    if (resourceType === 'video' && !videoUrl) {
      Alert.alert('Error', 'Video URL is required');
      return;
    }
    setLoading(true);
    try {
        if (resourceType === 'infographic' || resourceType === 'article') {
          const imageUrl = await uploadImageToCloudinary(image);
          if (!imageUrl) {
            throw new Error('Image upload failed.');
          }
          const fileUrl = await uploadToSupabase(document);
        }
        await firestore().collection('resources').add({
          title,
          description,
          type: resourceType,
          image:image && resourceType !== 'video' ? await uploadImageToCloudinary(image) : null, // Upload image if provided
          videoUrl: resourceType === 'video' ? videoUrl : null,
          document: resourceType !== 'video' ?  await uploadToSupabase(document) : null, // Upload document if provided
          author,
          likes: [],
          commentCount: 0,
          views: 0,
          createdAt: firestore.FieldValue.serverTimestamp(),
          authorId: auth().currentUser?.uid, // Store author ID for reference
        });
      Alert.alert('Success', 'Resource posted successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error posting resource:', error);
      Alert.alert('Error', 'Something went wrong. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Title</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Enter title" />

      <Text style={styles.label}>Description</Text>
      <TextInput style={[styles.input, styles.textArea]} value={description} onChangeText={setDescription} placeholder="Enter description" multiline />


      <Text style={styles.label}>Resource Type</Text>
      <View style={styles.pickerContainer}>
      <Picker style={styles.picker} selectedValue={resourceType} onValueChange={(itemValue) => setResourceType(itemValue)}>
        <Picker.Item label="Article" value="article" />
        <Picker.Item label="Video" value="video" />
        <Picker.Item label="Infographic" value="infographic" />
      </Picker>
      </View>

      {(resourceType === 'infographic' || resourceType === 'article') && (
        <>
          <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
            {image ? <Image source={{ uri: image }} style={styles.imagePreview} /> : <Text>Pick an Image</Text>}
          </TouchableOpacity>
          <TouchableOpacity style={styles.uploadButton} onPress={pickDocument}>
                  <Text style={styles.uploadButtonText}>{document ? 'Document Uploaded' : 'Upload Certification (PDF)'}</Text>
          </TouchableOpacity>
        </>
      )}

      {resourceType === 'video' && (
        <>
          <Text style={styles.label}>Video URL</Text>
          <TextInput style={styles.input} value={videoUrl} onChangeText={setVideoUrl} placeholder="Enter YouTube or Video URL" />
        </>
      )}

      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Post Resource</Text>}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  label: { fontSize: 16, fontWeight: 'bold', marginTop: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginTop: 5 },
  textArea: { height: 100 },
  imagePicker: { backgroundColor: '#f0f0f0', padding: 10, alignItems: 'center', justifyContent: 'center', marginTop: 10, borderRadius: 8 },
  imagePreview: { width: 100, height: 100, borderRadius: 8 },
  uploadButton: { width: '100%', backgroundColor: '#FFF', paddingVertical: 15, borderRadius: 25, alignItems: 'center', marginTop: 10, borderWidth: 1, borderColor: '#6BA292' },
  uploadButtonText: { color: '#6BA292', fontSize: 16 },
  button: { backgroundColor: '#006666', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 20 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  pickerContainer: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, backgroundColor: '#f9f9f9', marginTop: 10, paddingHorizontal: 10, justifyContent: 'center'},
  picker: { height: 50, fontSize: 16, color: '#333'},
});

export default AddEducationalResource;
