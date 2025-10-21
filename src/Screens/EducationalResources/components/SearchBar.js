import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

const SearchBar = ({ value, onChangeText }) => (
  <View style={styles.container}>
    <Feather name="search" size={18} color="#888" />
    <TextInput
      placeholder="Search resources..."
      placeholderTextColor="#999"
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 45,
    marginBottom: 12,
    elevation: 2,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    color: '#333',
    fontSize: 14,
  },
});

export default SearchBar;
