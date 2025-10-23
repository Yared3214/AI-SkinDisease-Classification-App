import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

const ProductHeader = ({ product }) => (
  <View style={styles.card}>
    <Image source={{ uri: product.image }} style={styles.image} />
    <Text style={styles.name}>{product.name}</Text>
    <Text style={styles.price}>{product.price} Birr</Text>
    <Text style={styles.description}>{product.description}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 12, elevation: 2, padding: 15, marginBottom: 15 },
  image: { width: '100%', height: 240, borderRadius: 10, marginBottom: 10 },
  name: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  price: { fontSize: 18, color: '#6BA292', marginVertical: 5 },
  description: { fontSize: 15, color: '#666' },
});

export default ProductHeader;
