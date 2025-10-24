import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const ExpertSearchBar = ({ value, onChangeText }) => (
  <View style={styles.searchContainer}>
    <Icon name="search" size={20} color="#6BA292" style={styles.icon} />
    <TextInput
      placeholder="Search experts by name"
      placeholderTextColor="#999"
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
    />
  </View>
);

export default ExpertSearchBar;

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 15,
    elevation: 2,
    marginBottom: 16,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#333',
  },
});
