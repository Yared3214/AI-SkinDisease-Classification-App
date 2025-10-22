import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const ProductCard = ({ product, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image
        source={{ uri: product.image }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {product.name}
        </Text>
        <Text style={styles.category}>{product.category}</Text>
        <Text style={styles.price}>{product.price} Birr</Text>

        <View style={styles.ratingContainer}>
          <Icon name="star" color="#FFD700" size={14} />
          <Text style={styles.rating}>
            {product.rating || 0} ({product.reviews || 0})
          </Text>
        </View>

        <TouchableOpacity style={styles.contactButton}>
          <Text style={styles.contactButtonText}>Contact Seller</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    margin: 8,
    width: '46%',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 130,
  },
  content: {
    padding: 10,
    alignItems: 'center',
  },
  name: {
    fontWeight: '700',
    fontSize: 15,
    color: '#333',
  },
  category: {
    fontSize: 12,
    color: '#6BA292',
    marginVertical: 2,
  },
  price: {
    fontSize: 14,
    color: '#444',
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  rating: {
    fontSize: 12,
    marginLeft: 4,
    color: '#666',
  },
  contactButton: {
    backgroundColor: '#6BA292',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default ProductCard;
