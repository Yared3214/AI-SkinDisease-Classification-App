import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import StarRating from 'react-native-star-rating-widget';
import moment from 'moment';

const ReviewItem = ({ review }) => (
  <View style={styles.card}>
    <View style={styles.avatar}>
      <Text style={styles.avatarText}>
        {review.user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
      </Text>
    </View>
    <View style={styles.content}>
      <Text style={styles.text}>{review.reviewText}</Text>
      <StarRating rating={review.rating} starSize={18} disabled />
      <Text style={styles.meta}>
        {review.user?.name} · {moment(review.publishedAt).format('DD MMM YYYY')}
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: { flexDirection: 'row', padding: 10, backgroundColor: '#fff', borderRadius: 10, marginBottom: 10, elevation: 1 },
  avatar: { width: 45, height: 45, borderRadius: 22, backgroundColor: '#6BA292', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  avatarText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  content: { flex: 1 },
  text: { fontSize: 15, color: '#333' },
  meta: { fontSize: 12, color: '#666', marginTop: 5 },
});

export default ReviewItem;
