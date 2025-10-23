import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { launchImageLibrary } from 'react-native-image-picker';

const AvatarPicker = ({ currentPhoto, onPhotoSelect }) => {
  const pickImage = () => {
      launchImageLibrary({ mediaType: 'photo' }, (res) => {
        if (res?.assets?.length) {
          onPhotoSelect(res.assets[0]); // store the full asset, not just .uri
          console.log(res.assets[0]);
        }
      });
    };

  return (
    <TouchableOpacity onPress={pickImage} style={styles.avatarWrapper}>
      {currentPhoto ? (
        <Image source={{ uri: currentPhoto.uri }} style={styles.avatar} />
      ) : (
        <View style={styles.placeholder}>
          <Icon name="camera" size={30} color="#888" />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  avatarWrapper: {
    alignSelf: 'center',
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#006666',
    borderRadius: 80,
    padding: 4,
  },
  avatar: { width: 110, height: 110, borderRadius: 55 },
  placeholder: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#dcdcdc',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AvatarPicker;
