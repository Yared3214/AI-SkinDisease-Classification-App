import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';

const SaveButton = ({ onPress, loading }) => (
  <View style={styles.container}>
    <TouchableOpacity
      style={[styles.button, loading && { opacity: 0.7 }]}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.text}>Save Changes</Text>}
    </TouchableOpacity>
  </View>
);

export default SaveButton;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20, // adds spacing between content
  },
  button: {
    backgroundColor: '#006666',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    elevation: 5,
  },
  text: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
