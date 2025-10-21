import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const ImagePickerButtons = ({ onCamera, onGallery }) => (
  <View style={styles.container}>
    <TouchableOpacity style={[styles.button, { backgroundColor: '#6BA292' }]} onPress={onCamera}>
      <Text style={styles.text}>Take a Photo</Text>
    </TouchableOpacity>
    <TouchableOpacity style={[styles.button, { backgroundColor: '#008CBA' }]} onPress={onGallery}>
      <Text style={styles.text}>Select from Gallery</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 15,
  },
  button: {
    width: '48%',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  text: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default ImagePickerButtons;
