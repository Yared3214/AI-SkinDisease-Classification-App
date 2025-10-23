import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

import Header from './components/Header';
import ProductCard from './components/ProductCard';
import EmptyState from './components/EmptyState';
import SearchBar from './components/SearchBar';
import CategoryFilter from './components/CategoryFilter';
import LinearGradient from 'react-native-linear-gradient';

const SkinCareProductsScreen = () => {
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('products')
      .onSnapshot(
        (snapshot) => {
          const items = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setProducts(items);
          setLoading(false);
          setRefreshing(false);
        },
        (error) => {
          console.error('Firestore error:', error);
          setLoading(false);
          setRefreshing(false);
        }
      );
    return () => unsubscribe();
  }, []);

  const filteredProducts = useMemo(() => {
    let list = [...products];
    if (selectedCategory !== 'All') {
      list = list.filter(
        (item) =>
          item.category &&
          item.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    if (searchText.trim()) {
      list = list.filter((item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    return list;
  }, [products, selectedCategory, searchText]);

  const onRefresh = () => {
    setRefreshing(true);
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#6BA292" />
      </View>
    );
  }

  return (
    <LinearGradient colors={['#F8FDFB', '#E9F7F5']} style={{ flex: 1 }}>
    <View style={styles.container}>
      <Header />
      <SearchBar value={searchText} onChange={setSearchText} />
      <CategoryFilter
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />

      {filteredProducts.length === 0 ? (
        <EmptyState message="No matching products found." />
      ) : (
        <FlatList
          data={filteredProducts}
          numColumns={2}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={() =>
                navigation.navigate('product-detail', { product: item })
              }
            />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#6BA292"
            />
          }
        />
      )}
    </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FDFB'},
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { padding: 10 },
});

export default SkinCareProductsScreen;
