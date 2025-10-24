import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import ScreenHeader from './components/ScreenHeader';
import ExpertSearchBar from './components/ExpertSearchBar';
import ExpertList from './components/ExpertList';

const ExpertSelectionScreen = ({ navigation }) => {
  const [experts, setExperts] = useState([]);
  const [filteredExperts, setFilteredExperts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch experts in real-time
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('users')
      .where('role', '==', 'expert')
      .onSnapshot(
        (snapshot) => {
          const expertData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setExperts(expertData);
          setFilteredExperts(expertData);
          setLoading(false);
        },
        (error) => {
          console.error('Error loading experts:', error);
          setLoading(false);
        }
      );

    return () => unsubscribe();
  }, []);

  const handleSearch = (text) => {
    setSearch(text);
    const filtered = experts.filter((expert) =>
      expert.name?.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredExperts(filtered);
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Book an Appointment" subtitle="Select an expert to continue" />
      <ExpertSearchBar value={search} onChangeText={handleSearch} />

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#6BA292" />
        </View>
      ) : filteredExperts.length === 0 ? (
        <Text style={styles.noResults}>No experts found.</Text>
      ) : (
        <ExpertList data={filteredExperts} navigation={navigation} />
      )}
    </View>
  );
};

export default ExpertSelectionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAF9',
    paddingHorizontal: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResults: {
    textAlign: 'center',
    color: '#888',
    marginTop: 40,
    fontSize: 16,
  },
});
