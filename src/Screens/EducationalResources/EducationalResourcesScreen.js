import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';

import Header from './components/Header';
import SearchBar from './components/SearchBar';
import ResourceCard from './components/ResourceCard';
import AddResourceButton from './components/AddResourceButton';
import CategoryTabs from './components/CategoryTabs'; // adjust path

const EducationalResourcesScreen = () => {
  const navigation = useNavigation();
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Fetch data from Firebase
  const fetchData = async () => {
    try {
      const user = auth().currentUser;
      if (user) {
        const userDoc = await firestore().collection('users').doc(user.uid).get();
        if (userDoc.exists) setUserRole(userDoc.data().role);
      }

      const snapshot = await firestore().collection('resources').get();
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setResources(data);
      setFilteredResources(data);
    } catch (error) {
      Alert.alert('Error', 'Could not load resources.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle resource click
  const handlePress = async (item) => {
    try {
      const viewed = await AsyncStorage.getItem('viewedResources');
      let viewedArray = viewed ? JSON.parse(viewed) : [];

      if (!viewedArray.includes(item.id)) {
        await firestore().collection('resources').doc(item.id).update({
          views: firestore.FieldValue.increment(1),
        });
        viewedArray.push(item.id);
        await AsyncStorage.setItem('viewedResources', JSON.stringify(viewedArray));
      }

      navigation.navigate('resource-detail', { resource: item });
    } catch (error) {
      Alert.alert('Error', 'Failed to open resource.');
    }
  };

  // Filtering logic
  useEffect(() => {
    let filtered = resources;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter((item) =>
        item.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (searchQuery) {
      filtered = filtered.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredResources(filtered);
  }, [searchQuery, selectedCategory, resources]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#6BA292" />
      </View>
    );
  }

  return (
    <LinearGradient colors={['#F8FDFB', '#E9F7F5']} style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <Header />
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
        <CategoryTabs
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        <FlatList
          data={filteredResources}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ResourceCard item={item} onPress={() => handlePress(item)} />
          )}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#6BA292']} />
          }
          contentContainerStyle={{ paddingBottom: 120 }}
        />

        {userRole === 'expert' && (
          <AddResourceButton onPress={() => navigation.navigate('add-resource')} />
        )}
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, paddingHorizontal: 20 },
});

export default EducationalResourcesScreen;
