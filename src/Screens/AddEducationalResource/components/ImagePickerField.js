import React from 'react';
import { TouchableOpacity, Image, Text } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import styles from '../styles';

const ImagePickerField = ({ image, setImage, error }) => {
  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, (res) => {
      if (res?.assets?.length) {
        setImage(res.assets[0]); // store the full asset, not just .uri
        console.log(res.assets[0]);
      }
    });
  };
  
  return (
    <TouchableOpacity style={[styles.uploadBox, error && { borderColor: 'red' }]} onPress={pickImage}>
      {image ? <Image source={{ uri: image.uri }} style={styles.imagePreview} /> : <Text style={styles.uploadText}>Select Image</Text>}
    </TouchableOpacity>
  );
};

export default ImagePickerField;
