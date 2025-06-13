import React, { useState } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  PermissionsAndroid,
  ActivityIndicator,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

// Main screen for uploading and analyzing a skin image
const SkinImageUploadScreen = () => {
  const navigation = useNavigation();

  // Local state management
  const [selectedImage, setSelectedImage] = useState(null); // Stores the selected image data
  const [uri, setUri] = useState(null); // Stores the image URI
  const [loading, setLoading] = useState(false); // Indicates whether the image is being analyzed

  // Request permission to access the camera (Android-specific)
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'App needs camera access to take pictures',
          buttonPositive: 'OK',
        }
      );
      if (granted === PermissionsAndroid.RESULTS.DENIED) {
        Alert.alert('Permission Denied');
        return false;
      }
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  // Request permission to access the device's image gallery (Android-specific)
  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES || PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE, // Fallback for older Android
        {
          title: 'Storage Permission',
          message: 'App needs access to your gallery',
          buttonPositive: 'OK',
        }
      );
      if (granted === PermissionsAndroid.RESULTS.DENIED) {
        Alert.alert('Permission Denied');
        return false;
      }
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  // Pick image either from the camera or gallery
  const pickImage = async (fromCamera) => {
    const hasPermission = fromCamera
      ? await requestCameraPermission()
      : await requestStoragePermission();

    if (!hasPermission) {
      // Alert already shown in permission functions
      return;
    }

    try {
      const result = fromCamera
        ? await launchCamera({ mediaType: 'photo', quality: 1 })
        : await launchImageLibrary({ mediaType: 'photo', quality: 1 });

      // Handle response
      if (result.didCancel) {
        // User cancelled, do nothing
        setSelectedImage(null);
        setUri(null);
      } else if (result.errorCode) {
        console.error('ImagePicker Error:', result.errorMessage);
        Alert.alert('Error', result.errorMessage);
      } else {
        const image = result.assets?.[0];
        const imageUri = image?.uri;
        if (image && imageUri) {
          setSelectedImage(image);
          setUri(imageUri);
        }
      }
    } catch (err) {
      Alert.alert('Error', 'Could not access camera or gallery.');
    }
  };

  // Remove selected image
  const removeImage = () => {
    setSelectedImage(null);
    setUri(null);
  };

  // Send image to the server for analysis
  const analyzeImage = async () => {
    if (!selectedImage) {
      Alert.alert('Please select an image first');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('file', {
      uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
      name: selectedImage.fileName || 'photo.jpg',
      type: selectedImage.type || 'image/jpeg',
    });

    try {
      const response = await axios.post(
        'http://172.20.10.5:5000/predict', // Local Flask server endpoint
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 60000, // Timeout after 60 seconds
        }
      );

      const data = response.data;

      // Validate response
      if (!data['success'] || typeof data['is_skin_disease'] === 'undefined') {
        Alert.alert('Invalid Image', 'Please provide a valid skin image.');
        return;
      }

      if (!data['is_skin_disease']) {
        Alert.alert('Invalid Image', 'Please provide a valid skin image.');
        return;
      }

      // Navigate to the result screen with analysis data
      navigation.navigate('analysis-result', {
        imageUri: uri,
        result: data,
      });
    } catch (error) {
      if (
        error.message &&
        (error.message.includes('Network Error') ||
          error.message.includes('timeout') ||
          error.code === 'ECONNABORTED')
      ) {
        Alert.alert('Error', 'Unable to process the image');
      } else {
        Alert.alert('Error', 'Unable to process the image');
      }
    } finally {
      setLoading(false);
    }
  };

  // UI Rendering
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Upload Affected Skin Image</Text>

      {/* Photo Picker Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.photoButton, { backgroundColor: '#6BA292' }]}
          onPress={() => pickImage(true)}
        >
          <Text style={styles.buttonText}>Take a Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.photoButton, { backgroundColor: '#008CBA' }]}
          onPress={() => pickImage(false)}
        >
          <Text style={styles.buttonText}>Select from Gallery</Text>
        </TouchableOpacity>
      </View>

      {/* Display selected image preview */}
      {selectedImage && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: uri }} style={styles.image} />
          <TouchableOpacity onPress={removeImage}>
            <Text style={styles.removeText}>Remove</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.instructions}>
        Ensure the image is clear and well-lit, focusing on the affected skin area.
      </Text>

      {/* Analyze Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.analyzeButton}
          onPress={analyzeImage}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.analyzeText}>Analyze Image</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 10,
  },
  photoButton: {
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    width: '40%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  removeText: {
    color: 'red',
    marginTop: 5,
  },
  instructions: {
    textAlign: 'center',
    marginVertical: 10,
    color: '#555',
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    width: '100%',
    paddingBottom: 20,
  },
  analyzeButton: {
    backgroundColor: '#6BA292',
    padding: 15,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
    alignSelf: 'center',
  },
  analyzeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default SkinImageUploadScreen;