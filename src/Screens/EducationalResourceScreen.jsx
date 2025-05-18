import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import Feather  from 'react-native-vector-icons/Feather'; // For icons
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EducationalResources = () => {
  const navigation = useNavigation();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

   // Fetch user role and resources
   useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth().currentUser;
        // Fetch user role
        if (user) {
          const userDoc = await firestore()
            .collection('users')
            .doc(user.uid)
            .get();
          if (userDoc.exists) {
            setUserRole(userDoc.data().role);
          }
        }

        // Fetch resources
        const querySnapshot = await firestore()
          .collection('resources')
          .get();

        const resourceList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setResources(resourceList);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  },);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#006666" />
      </View>
    );
  }

  const renderItem = ({ item }) => {

    const handlePress = async () => {
      try {
        const viewedResources = await AsyncStorage.getItem('viewedResources');
        let viewedResourcesArray = viewedResources ? JSON.parse(viewedResources) : [];

        if (!Array.isArray(viewedResourcesArray)) {
          viewedResourcesArray = [];
        }

        if (!viewedResourcesArray.includes(item.id)) {
          await firestore()
            .collection('resources')
            .doc(item.id)
            .update({
              views: firestore.FieldValue.increment(1),
            });

          viewedResourcesArray.push(item.id);
          await AsyncStorage.setItem(
            'viewedResources',
            JSON.stringify(viewedResourcesArray)
          );
        }

        navigation.navigate('resource-detail', { resource: item });
      } catch (error) {
        console.error('Error handling resource view:', error);
        Alert.alert('Error', 'Failed to record view. Please try again.');
      }
    };
    return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <View style={styles.cardContent}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.type}>{item.type}</Text>
          <Text style={styles.author}>by {item.author}</Text>

          {/* Likes, Comments, Views */}
          <View style={styles.stats}>
            <FontAwesome name="heart" size={14} color="gray" />
            <Text style={styles.statText}>{item.likes.length}</Text>
            <FontAwesome name="comment" size={14} color="gray" />
            <Text style={styles.statText}>{item.commentCount}</Text>
            <FontAwesome name="eye" size={14} color="gray" />
            <Text style={styles.statText}>{item.views}</Text>
          </View>
        </View>

        {/* Thumbnail */}
        <Image source={{ uri: item.image }} style={styles.image} />
      </View>
    </TouchableOpacity>
  );
};
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.header}>Educational Resources</Text>
        <Feather name="search" size={20} color="black" />
      </View>
      <Text style={styles.subHeader}>
        Explore dermatologist-approved resources to learn more about skin health.
      </Text>

      {/* List of Resources */}
      <FlatList data={resources} keyExtractor={(item) => item.id} renderItem={renderItem} />
      {userRole === 'expert' && (
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('add-resource')}>
          <Text style={styles.addButtonText}>+ Add Post</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  loader: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  header: { fontSize: 20, fontWeight: 'bold' },
  subHeader: { fontSize: 14, color: '#666', marginBottom: 15 },

  card: { backgroundColor: '#f9f9f9', borderRadius: 8, padding: 12, marginBottom: 10, elevation: 2 },
  cardContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 16, fontWeight: 'bold', color: '#006666' },
  type: { fontSize: 14, color: '#444', marginBottom: 3 },
  author: { fontSize: 13, color: '#777' },

  stats: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  statText: { fontSize: 12, color: 'gray', marginLeft: 3, marginRight: 8 },

  image: { width: 50, height: 50, borderRadius: 5 },
  addButton: { position: 'absolute', bottom: 20, right: 20, backgroundColor: '#006666', padding: 15, borderRadius: 50, elevation: 3 },
  addButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

export default EducationalResources;
