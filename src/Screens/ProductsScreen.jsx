import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import React, { useEffect, useState } from 'react';
import { View, FlatList, Image, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Button, Card, Icon } from 'react-native-elements';

const SkinCareProductsScreen = () => {
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Real-time listener for products
    const unsubscribe = firestore()
      .collection('products')
      .onSnapshot(
        (querySnapshot) => {
          const productList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            // Convert Firestore timestamps to Date objects if needed
            createdAt: doc.data().createdAt?.toDate(),
            updatedAt: doc.data().updatedAt?.toDate(),
          }));
          setProducts(productList);
          setLoading(false);
          setError(null);
        },
        (error) => {
          console.error('Products snapshot error:', error);
          setError('Failed to load products');
          setLoading(false);
        }
      );

    return () => unsubscribe(); // Clean up listener on unmount
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#6BA292" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <Button
          title="Retry"
          onPress={() => {
            setLoading(true);
            setError(null);
          }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('product-detail', { product: item })}
          >
            <Card containerStyle={styles.card}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <Text style={styles.category}>{item.category}</Text>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>{item.price}</Text>

              {/* Rating & Reviews */}
              <View style={styles.ratingContainer}>
                <Icon name="star" type="font-awesome" color="#FFD700" size={16} />
                <Text style={styles.rating}>{item.rating} ({item.reviews} reviews)</Text>
              </View>

              {/* Contact Seller Button */}
              <TouchableOpacity style={styles.contactButton}>
                <Text style={styles.contactButtonText}>Contact Seller</Text>
              </TouchableOpacity>
            </Card>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  loader: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  container: { flex: 1, backgroundColor: '#f8f8f8', padding: 10 },
  card: { borderRadius: 10, padding: 15, alignItems: 'center', elevation: 3 },
  image: { width: 120, height: 120, borderRadius: 10 },
  category: { fontSize: 12, color: '#007bff', marginTop: 5 },
  name: { fontSize: 16, fontWeight: 'bold', marginVertical: 5, textAlign: 'center' },
  price: { fontSize: 14, color: '#555', marginBottom: 5 },
  ratingContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  rating: { fontSize: 14, marginLeft: 5, color: '#444' },
  contactButton: { backgroundColor: '#6BA292', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 8 },
  contactButtonText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
});

export default SkinCareProductsScreen;


