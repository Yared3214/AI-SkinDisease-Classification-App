import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SearchBar = ({ value, onChange }) => {
  return (
    <View style={styles.container}>
      <Ionicons name="search-outline" size={20} color="#6BA292" />
      <TextInput
        style={styles.input}
        placeholder="Search products..."
        placeholderTextColor="#9CA3AF"
        value={value}
        onChangeText={onChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 25,
    alignItems: 'center',
    paddingHorizontal: 15,
    marginHorizontal: 10,
    marginTop: 12,
    height: 45,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 15,
    color: '#333',
  },
});

export default SearchBar;
