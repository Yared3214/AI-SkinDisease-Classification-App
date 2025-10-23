import React from 'react';
import { View, Text, ImageBackground, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';

const HeaderBanner = () => (
  <Animatable.View animation="zoomIn" duration={1000}>
    <ImageBackground
      source={require('../assets/skin-health-banner.png')} // your banner image
      style={styles.banner}
      imageStyle={styles.imageStyle}
    >
      <View style={styles.overlay}>
        <Text style={styles.bannerText}>Healthy Skin Starts with Awareness</Text>
      </View>
    </ImageBackground>
  </Animatable.View>
);

const styles = StyleSheet.create({
  banner: {
    height: 190,
    width: '100%',
    justifyContent: 'flex-end',
  },
  imageStyle: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  overlay: {
    backgroundColor: 'rgba(0, 102, 102, 0.7)',
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  bannerText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
});

export default HeaderBanner;
