import React from 'react';
import { TextInput, StyleSheet, View } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const InputField = ({ icon, placeholder, value, onChangeText, keyboardType = 'default', secureTextEntry }) => {
  return (
    <View style={styles.inputContainer}>
      <FontAwesome name={icon} size={18} color="#6BA292" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#A9A9A9"
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        autoCapitalize="none"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    width: '100%',
    height: 50,
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#000',
  },
});

export default InputField;
