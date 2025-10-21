import React from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet } from 'react-native';

const ImagePreview = ({ uri, onRemove }) => (
  <View style={styles.container}>
    <Image source={{ uri }} style={styles.image} />
    <TouchableOpacity onPress={onRemove}>
      <Text style={styles.removeText}>Remove Image</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 15,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 15,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#6BA292',
  },
  removeText: {
    color: '#E63946',
    fontWeight: '600',
  },
});

export default ImagePreview;
