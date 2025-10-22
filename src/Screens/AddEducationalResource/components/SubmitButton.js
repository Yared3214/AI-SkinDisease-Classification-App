import React from 'react';
import { TouchableOpacity, ActivityIndicator, Text } from 'react-native';
import styles from '../styles';

const SubmitButton = ({ loading, onPress }) => (
  <TouchableOpacity style={styles.submitButton} onPress={onPress} disabled={loading}>
    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>Post Resource</Text>}
  </TouchableOpacity>
);

export default SubmitButton;
