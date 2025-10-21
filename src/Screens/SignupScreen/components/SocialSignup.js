import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import styles from '../styles';

const SocialSignup = () => (
  <View style={styles.socialContainer}>
    <TouchableOpacity style={[styles.socialButton, { borderColor: '#DB4437' }]}>
      <FontAwesome name="google" size={22} color="#DB4437" />
    </TouchableOpacity>
    <TouchableOpacity style={[styles.socialButton, { borderColor: '#1877F2' }]}>
      <FontAwesome name="facebook" size={22} color="#1877F2" />
    </TouchableOpacity>
  </View>
);

export default SocialSignup;
