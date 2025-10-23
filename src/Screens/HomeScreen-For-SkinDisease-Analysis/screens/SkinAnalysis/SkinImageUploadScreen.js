import React, { useState } from 'react';
import {
  View,
  Text,
  Alert,
  StyleSheet,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';

import ImagePickerButtons from '../../components/ImagePickerButtons';
import ImagePreview from '../../components/ImagePreview';
import PrimaryButton from '../../components/PrimaryButton';

const SkinImageUploadScreen = () => {
  const navigation = useNavigation();
  const [selectedImage, setSelectedImage] = useState(null);
  const [uri, setUri] = useState(null);
  const [loading, setLoading] = useState(false);

  /** ✅ Permissions */
  const requestPermission = async (type) => {
    if (Platform.OS === 'android') {
      const permission =
        type === 'camera'
          ? PermissionsAndroid.PERMISSIONS.CAMERA
          : PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES ||
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

      const granted = await PermissionsAndroid.request(permission);
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  /** ✅ Image Picker */
  const pickImage = async (fromCamera) => {
    const hasPermission = await requestPermission(fromCamera ? 'camera' : 'storage');
    if (!hasPermission) return Alert.alert('Permission required');

    const result = fromCamera
      ? await launchCamera({ mediaType: 'photo', quality: 1 })
      : await launchImageLibrary({ mediaType: 'photo', quality: 1 });

    if (result.didCancel) return;
    if (result.errorCode) return Alert.alert('Error', result.errorMessage);

    const image = result.assets?.[0];
    if (image?.uri) {
      setSelectedImage(image);
      setUri(image.uri);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setUri(null);
  };

  /** ✅ Analyze Image */
  const analyzeImage = async () => {
    if (!selectedImage) return Alert.alert('Select an image first.');

    setLoading(true);
    const formData = new FormData();
    formData.append('file', {
      uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
      name: selectedImage.fileName || 'photo.jpg',
      type: selectedImage.type || 'image/jpeg',
    });

    try {
      const response = await axios.post(
        'http://172.20.10.5:5000/predict',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 60000 }
      );

      const data = response.data;
      if (!data?.is_skin_disease) {
        return Alert.alert('Invalid Image', 'Please provide a valid skin image.');
      }

      navigation.navigate('analysis-result', { imageUri: uri, result: data });
    } catch (error) {
      Alert.alert('Error', 'Unable to process the image.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Affected Skin Image</Text>
      <Text style={styles.subtitle}>
        Ensure the photo is clear, bright, and focused on the affected area.
      </Text>

      <ImagePickerButtons onCamera={() => pickImage(true)} onGallery={() => pickImage(false)} />

      {uri && <ImagePreview uri={uri} onRemove={removeImage} />}

      <View style={styles.bottom}>
        <PrimaryButton
          title="Analyze Image"
          onPress={analyzeImage}
          loading={loading}
          disabled={!uri}
        />
      </View>
    </View>
  );
};

export default SkinImageUploadScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  bottom: {
    width: '100%',
    marginTop: 30,
  },
});
