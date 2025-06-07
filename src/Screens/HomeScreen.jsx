import React, { useState, useEffect } from 'react';
import { View, Image, Text, TouchableOpacity, Button, StyleSheet, Alert, Platform, PermissionsAndroid, ActivityIndicator } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { createStaticNavigation, useNavigation } from '@react-navigation/native';
import { FIREBASE_AUTH } from '../../FireBaseConfig/FirebaseConfig';
import axios from 'axios';


const SkinImageUploadScreen = () => {
  const navigation = useNavigation();
  const [selectedImage, setSelectedImage] = useState(null);
  const [uri, setUri] = useState(null);
  const [loading, setLoading] = useState(false);

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
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES, // or READ_EXTERNAL_STORAGE for older devices
        {
          title: 'Storage Permission',
          message: 'App needs access to your gallery',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };
const pickImage = async (fromCamera) => {
  const hasPermission = fromCamera ? await requestCameraPermission() : await requestStoragePermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied');
      return;
    }

    const result = fromCamera
      ? await launchCamera({ mediaType: 'photo', quality: 1 })
      : await launchImageLibrary({ mediaType: 'photo', quality: 1 });

    if (result.didCancel) {
      console.log('User cancelled image picker');
    } else if (result.errorCode) {
      console.error('ImagePicker Error:', result.errorMessage);
      Alert.alert('Error', result.errorMessage);
    } else {
      const uri = result.assets?.[0]?.uri;
      const image = result.assets?.[0]
      if (uri && image) {
        setSelectedImage(image);
        setUri(uri)
      }
    }
};

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
    //   const checkResponse = await fetch('https://skin-disease-detection-backend-gmc4.onrender.com/predict/checkImage', {
    //   method: 'POST',
    //   body: formData,
    //   headers: {
    //         'Content-Type': 'multipart/form-data',
    //       },
    // });

    // const checkResult = await checkResponse.json();

    // if (!checkResult.success || !checkResult.is_skin_disease) {
    //   Alert.alert('Invalid Image', 'Please provide a valid skin image.');
    //   return;
    // }
      const response = await axios.post(
    'https://skin-disease-detection-backend-gmc4.onrender.com/predict',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 10000, // Optional: timeout after 10s
    }
  );

      const data = await response.data();

      if (data.success) {
        navigation.navigate('analysis-result', {
          imageUri: uri,
          result: data,
        });
      } else {
        Alert.alert('Prediction Failed', data.error || 'Try again later');
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
      Alert.alert('Error', 'Unable to process the image');
    } finally {
      setLoading(false);
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.header}>Upload Affected Skin Image</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.photoButton, { backgroundColor: '#6BA292' }]} onPress={() => pickImage(true)}>
            <Text style={styles.buttonText}>Take a Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.photoButton, { backgroundColor: '#008CBA' }]} onPress={() => pickImage(false)}>
            <Text style={styles.buttonText}>Select from Gallery</Text>
        </TouchableOpacity>

      </View>

      {selectedImage && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: uri }} style={styles.image} />
          <TouchableOpacity onPress={() => setSelectedImage(null)}>
            <Text style={styles.removeText}>Remove</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.instructions}>
        Ensure the image is clear and well-lit, focusing on the affected skin area.
      </Text>

      {/* Wrapper to push the button to the bottom */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.analyzeButton} onPress={analyzeImage} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.analyzeText}>Analyze Image</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginVertical: 10 },
  imageContainer: { alignItems: 'center', marginVertical: 10 },
  image: { width: 100, height: 100, borderRadius: 10 },
  removeText: { color: 'red', marginTop: 5 },
  instructions: { textAlign: 'center', marginVertical: 10, color: '#555' },

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
  analyzeText: { color: '#fff', fontWeight: 'bold' },
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

});

export default SkinImageUploadScreen;
