import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const UserTypeSelectionScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up As</Text>

      {/* Normal User Signup */}
      <TouchableOpacity
        style={styles.optionButton}
        onPress={() => navigation.navigate('signup')}
      >
        <FontAwesome5 name="user" size={24} color="#6BA292" />
        <Text style={styles.optionText}>Normal User</Text>
      </TouchableOpacity>

      {/* Expert Signup */}
      <TouchableOpacity
        style={styles.optionButton}
        onPress={() => navigation.navigate('expert-signup')}
      >
        <FontAwesome5 name="user-md" size={24} color="#6BA292" />
        <Text style={styles.optionText}>Expert (Dermatologist)</Text>
      </TouchableOpacity>

      {/* Back to Login */}
      <View style={styles.linkContainer}>
        <Text style={styles.linkText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('login')}>
          <Text style={styles.link}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4F4F4F',
    marginBottom: 30,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 15,
    width: '100%',
    borderRadius: 25,
    justifyContent: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  optionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4F4F4F',
    marginLeft: 10,
  },
  linkContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  linkText: {
    fontSize: 14,
    color: '#4F4F4F',
  },
  link: {
    color: '#4F8A8B',
    fontSize: 14,
    marginLeft: 5,
  },
});

export default UserTypeSelectionScreen;
