import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const ExpertSelectionScreen = ({ navigation }) => {
  const [experts, setExperts] = useState([]);
  const [filteredExperts, setFilteredExperts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Real-time expert data listener
  useEffect(() => {
    if (!auth().currentUser) return;

    const unsubscribe = firestore()
      .collection('users')
      .where('role', '==', 'expert')
      .onSnapshot(
        (querySnapshot) => {
          try {
            const expertData = querySnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
              // Convert Firestore timestamps if needed
              createdAt: doc.data().createdAt?.toDate(),
              lastActive: doc.data().lastActive?.toDate()
            }));

            setExperts(expertData);
            setFilteredExperts(expertData); // Initial filter with all experts
          } catch (error) {
            console.error('Error processing experts:', error);
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          console.error('Snapshot error:', error);
          setLoading(false);
        }
      );

    return () => unsubscribe();
  }, []);

  const handleSearch = (text) => {
    setSearch(text);
    const filtered = experts.filter(expert =>
      expert.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredExperts(filtered);
  };

  const renderExpert = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('time-slot', { expertId: item.id, expertName: item.name })}
      activeOpacity={0.8}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.name?.charAt(0).toUpperCase()}</Text>
      </View>
      <View style={styles.cardTextContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.email}>{item.email}</Text>
      </View>
    </TouchableOpacity>
  );


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select an Expert</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by name"
        value={search}
        onChangeText={handleSearch}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#6BA292" />
      ) : filteredExperts.length === 0 ? (
        <Text style={styles.noResults}>No experts found.</Text>
      ) : (
        <FlatList
          data={filteredExperts}
          keyExtractor={item => item.id}
          renderItem={renderExpert}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

export default ExpertSelectionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    backgroundColor: '#FAFAFA',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#222',
  },
  searchInput: {
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingHorizontal: 20,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    marginBottom: 20,
    fontSize: 16,
  },
  list: {
    paddingBottom: 30,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    backgroundColor: '#6BA292',
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 20,
  },
  cardTextContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  email: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
  },
  noResults: {
    textAlign: 'center',
    color: '#999',
    marginTop: 40,
    fontSize: 16,
  },
});

