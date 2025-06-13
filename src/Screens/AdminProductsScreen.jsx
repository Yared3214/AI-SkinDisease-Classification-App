import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import React, { useEffect, useState } from 'react';
import { View, FlatList, Image, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Button, Card, Icon } from 'react-native-elements';

const AdminProductsScreen = () => {
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

  const handleDelete = (productId) => {
    Alert.alert(
      'Delete Product',
      'Are you sure you want to delete this product?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await firestore().collection('products').doc(productId).delete();
              setProducts((prev) => prev.filter((item) => item.id !== productId));
            } catch (e) {
              Alert.alert('Error', 'Failed to delete product.');
            }
          }
        }
      ]
    );
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>Products</Text>
      <Text style={styles.headerSubtitle}>Manage and review all skincare products</Text>
    </View>
  );

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
        {renderHeader()}    
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
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

              {/* Delete Button */}
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(item.id)}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </Card>
          </TouchableOpacity>
        )}
      />

      {/* Add Product Floating Button */}
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('post-product')}>
                <Text style={styles.addButtonText}>+ Add Product</Text>
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  loader: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  container: { flex: 1, backgroundColor: '#F4FAFA', padding: 10 },
  headerContainer: {
    paddingHorizontal: 8,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: '#fff',
    marginBottom: 12,
    alignItems: 'center',
    elevation: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6BA292',
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#555',
    marginTop: 2,
    marginBottom: 2,
  },
  card: { borderRadius: 10, padding: 15, alignItems: 'center', elevation: 3 },
  image: { width: 120, height: 120, borderRadius: 10 },
  category: { fontSize: 12, color: '#007bff', marginTop: 5 },
  name: { fontSize: 16, fontWeight: 'bold', marginVertical: 5, textAlign: 'center' },
  price: { fontSize: 14, color: '#555', marginBottom: 5 },
  ratingContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  rating: { fontSize: 14, marginLeft: 5, color: '#444' },
  deleteButton: { backgroundColor: '#E57373', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 8 },
  deleteButtonText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 32,
    backgroundColor: '#6BA292',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  addButton: { position: 'absolute', bottom: 20, right: 20, backgroundColor: '#006666', padding: 15, borderRadius: 50, elevation: 3 },
  addButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

export default AdminProductsScreen;