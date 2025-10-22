import React, { useEffect, useState } from 'react';
import { View, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import axios from 'axios';
import RNBlobUtil from 'react-native-blob-util';
import { Buffer } from 'buffer';
import { supabase } from '../../supabaseClient';

import Header from './components/Header';
import TextInputField from './components/TextInputField';
import ResourceTypeSelector from './components/ResourceTypeSelector';
import ImagePickerField from './components/ImagePickerField';
import DocumentPickerField from './components/DocumentPickerField';
import VideoInputField from './components/VideoInputField';
import SubmitButton from './components/SubmitButton';
import ErrorText from './components/ErrorText';
import styles from './styles';

const CLOUD_NAME = 'dfnzk8ip2';
const UPLOAD_PRESET = 'educational_resources';

const AddEducationalResource = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [resourceType, setResourceType] = useState('article');
  const [image, setImage] = useState(null);
  const [document, setDocument] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const user = auth().currentUser;

  /* ---------------- Fetch user ---------------- */
  useEffect(() => {
    const fetchUserName = async () => {
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

  /* ---------------- Cloud Uploads ---------------- */

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
      .from('educational-resource')
      .upload(filePath, fileBuffer, {
        contentType: imageFile.type || 'image/jpeg',
      });

    if (error) {
      console.error('Supabase image upload error:', error);
      throw new Error('Image upload failed');
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('educational-resource')
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('uploadImageToSupabase error:', error);
    throw error;
  }
};


  // const uploadImageToCloudinary = async (uri) => {
  //   const data = new FormData();
  //   data.append('file', { uri, type: 'image/jpeg', name: 'upload.jpg' });
  //   data.append('upload_preset', UPLOAD_PRESET);
  //   const res = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, data);
  //   return res.data.secure_url;
  // };

  const uploadToSupabase = async (file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `documents/${fileName}`;
    const base64Data = await RNBlobUtil.fs.readFile(file.uri, 'base64');
    const fileBuffer = Buffer.from(base64Data, 'base64');
    const { error } = await supabase.storage.from('educational-resource').upload(filePath, fileBuffer, {
      contentType: file.type || 'application/pdf',
    });
    if (error) throw error;
    const { data: publicUrl } = supabase.storage.from('educational-resource').getPublicUrl(filePath);
    return publicUrl.publicUrl;
  };

  /* ---------------- Validation ---------------- */
  const validateInputs = () => {
    let valid = true;
    let newErrors = {};
    if (!title.trim()) (newErrors.title = 'Title is required'), (valid = false);
    if (!description.trim()) (newErrors.description = 'Description is required'), (valid = false);
    if (['article', 'infographic'].includes(resourceType)) {
      if (!image) (newErrors.image = 'Image required'), (valid = false);
      if (!document) (newErrors.document = 'Document required'), (valid = false);
    }
    if (resourceType === 'video' && !videoUrl.trim()) {
      newErrors.videoUrl = 'Video URL is required';
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  };

  /* ---------------- Handle Submit ---------------- */
  const handleSubmit = async () => {
    if (!validateInputs()) return;
    setLoading(true);
    try {
      let imageUrl = null;
      let fileUrl = null;

      if (resourceType !== 'video') {
        imageUrl = await uploadImageToSupabase(image);
        fileUrl = await uploadToSupabase(document);
      }

      await firestore().collection('resources').add({
        title: title.trim(),
        description: description.trim(),
        type: resourceType,
        image: imageUrl,
        document: fileUrl,
        videoUrl: resourceType === 'video' ? videoUrl.trim() : null,
        author,
        authorId: user?.uid,
        likes: [],
        views: 0,
        commentCount: 0,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      Alert.alert('Success', 'Resource added successfully!', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#E9F5F1', '#F8FAFC']} style={{ flex: 1 }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Header title={'Add Educational Resource'}/>
          <View style={styles.card}>
            <TextInputField label="Title" value={title} onChangeText={setTitle} error={errors.title} />
            <TextInputField
              label="Description"
              value={description}
              onChangeText={setDescription}
              multiline
              error={errors.description}
            />
            <ResourceTypeSelector selected={resourceType} onSelect={setResourceType} />
            {['article', 'infographic'].includes(resourceType) && (
              <>
                <ImagePickerField image={image} setImage={setImage} error={errors.image} />
                <DocumentPickerField document={document} setDocument={setDocument} error={errors.document} setError={setErrors}/>
              </>
            )}
            {resourceType === 'video' && (
              <VideoInputField value={videoUrl} onChangeText={setVideoUrl} error={errors.videoUrl} />
            )}
            <ErrorText message={errors.global} />
            <SubmitButton loading={loading} onPress={handleSubmit} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default AddEducationalResource;
