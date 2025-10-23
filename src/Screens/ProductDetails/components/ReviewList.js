import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import ReviewItem from './ReviewItem';

const ReviewList = ({ reviews }) => (
  <View style={styles.container}>
    <Text style={styles.title}>Customer Reviews</Text>
    {reviews.length === 0 ? (
      <Text style={styles.emptyText}>No reviews yet. Be the first!</Text>
    ) : (
      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ReviewItem review={item} />}
      />
    )}
  </View>
);

const styles = StyleSheet.create({
  container: { backgroundColor: '#f8fdfb', borderRadius: 12, padding: 15, marginBottom: 30 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  emptyText: { color: '#777', fontStyle: 'italic' },
});

export default ReviewList;
