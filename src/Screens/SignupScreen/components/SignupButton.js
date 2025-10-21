import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import styles from '../styles';

const SignupButton = ({ loading, onPress }) => (
  <TouchableOpacity
    style={[styles.signupButton, loading && { opacity: 0.8 }]}
    onPress={onPress}
    disabled={loading}
  >
    {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.signupButtonText}>Sign Up</Text>}
  </TouchableOpacity>
);

export default SignupButton;
