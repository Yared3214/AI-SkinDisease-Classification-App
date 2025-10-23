import React from 'react';
import { View, Text, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const SellerContactCard = ({ product }) => (
  <View style={styles.card}>
    <Text style={styles.title}>Contact Seller</Text>
    <TouchableOpacity style={styles.row} onPress={() => Linking.openURL(`tel:${product.sellerPhone}`)}>
      <Icon name="call-outline" size={20} color="#6BA292" />
      <Text style={styles.text}>{product.sellerPhone}</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.row} onPress={() => Linking.openURL(`mailto:${product.sellerEmail}`)}>
      <Icon name="mail-outline" size={20} color="#6BA292" />
      <Text style={styles.text}>{product.sellerEmail}</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  card: { backgroundColor: '#f8fdfb', borderRadius: 12, padding: 15, marginBottom: 15 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  text: { fontSize: 15, color: '#333', marginLeft: 10 },
});

export default SellerContactCard;
