import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import StarRating from 'react-native-star-rating-widget';

const ReviewForm = ({ onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePress = async () => {
    setLoading(true);
    await onSubmit(rating, reviewText);
    setLoading(false);
    setRating(0);
    setReviewText('');
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Rate this Product</Text>
      <StarRating rating={rating} onChange={setRating} />
      <TextInput
        style={styles.input}
        placeholder="Write your review..."
        value={reviewText}
        onChangeText={setReviewText}
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Submit</Text>}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 15, elevation: 2, marginBottom: 15 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  input: { borderColor: '#ccc', borderWidth: 1, borderRadius: 8, padding: 10, marginVertical: 10, textAlignVertical: 'top' },
  button: { backgroundColor: '#6BA292', padding: 10, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});

export default ReviewForm;
