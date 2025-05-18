import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import React, { useEffect, useState } from 'react';
import { View, Image, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, TextInput, FlatList, Alert, ActivityIndicator } from 'react-native';
import StarRating from 'react-native-star-rating-widget';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';


const ProductDetailsScreen = ({ route }) => {
  const { product } = route.params;
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState();
  const [reviewList, setReviewList] = useState([]);
  const [existingReview, setExistingReview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const user = auth().currentUser;


  // Real-time reviews listener
  useEffect(() => {
    if (!product?.id) {
      console.error('Invalid product ID');
      setLoading(false);
      return;
    }

    const unsubscribe = firestore()
      .collection('reviews')
      .where('productId', '==', product.id)
      .orderBy('publishedAt', 'desc')
      .onSnapshot(
        async (querySnapshot) => {
          try {
            if (!querySnapshot) {
              throw new Error('No snapshot returned');
            }

            const reviewsData = await Promise.all(
              querySnapshot.docs.map(async (doc) => {
                const review = { id: doc.id, ...doc.data() };

                // Safely convert timestamps
                review.publishedAt = review.publishedAt?.toDate?.() || new Date();

                // Fetch user data with error handling
                try {
                  const userSnap = await firestore()
                    .collection('users')
                    .doc(review.userId)
                    .get();
                  review.user = userSnap.exists ? userSnap.data() : {
                    name: 'Anonymous',
                    photoURL: null,
                  };
                } catch (userError) {
                  console.warn('Error fetching user:', userError);
                  review.user = {
                    name: 'Anonymous',
                    photoURL: null,
                  };
                }
                return review;
              })
            );
            setReviewList(reviewsData);
          } catch (error) {
            console.error('Error processing reviews:', error);
            console.error('Failed to load reviews');
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          console.error('Snapshot error:', error);
          console.error('Failed to load reviews');
          setLoading(false);
        }
      );

    return () => unsubscribe();
  }, [product.id]);


  const checkAndSubmitReview = async () => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to submit a review');
      return;
    }

    if (!rating) {
      Alert.alert('Error', 'Please select a rating');
      return;
    }

    setLoading(true);

    try {
      // Check for existing review
      const reviewQuery = await firestore()
        .collection('reviews')
        .where('userId', '==', user.uid)
        .where('productId', '==', product.id)
        .get();

      const reviewKey = `reviewed_${product.id}_${user.uid}`;

      if (!reviewQuery.empty) {
        // Update existing review
        const reviewDoc = reviewQuery.docs[0];
        await reviewDoc.ref.update({
          rating,
          reviewText,
          updatedAt: firestore.FieldValue.serverTimestamp(),
          publishedAt: firestore.FieldValue.serverTimestamp(),
        });

        await AsyncStorage.setItem(reviewKey, 'true');
        Alert.alert('Success', 'Review updated successfully');
      } else {
        // Create new review
        await firestore().collection('reviews').add({
          userId: user.uid,
          productId: product.id,
          rating,
          reviewText,
          publishedAt: firestore.FieldValue.serverTimestamp(),
          userName: user.displayName || 'Anonymous', // Cache user name
        });

        await AsyncStorage.setItem(reviewKey, 'true');
        Alert.alert('Success', 'Review submitted successfully');
      }

      // Reset form
      setRating(0);
      setReviewText('');
    } catch (error) {
      console.error('Review submission error:', error);
      Alert.alert('Error', 'Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Product Image & Details */}
      <Image source={{ uri: product.image }} style={styles.image} />
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.price}>{product.price}birr</Text>
      <Text style={styles.description}>{product.description}</Text>

      {/* Contact Seller Section */}
      <Text style={styles.contactTitle}>Contact Seller:</Text>
      <TouchableOpacity onPress={() => Linking.openURL(`tel:${product.sellerPhone}`)}>
        <Text style={styles.contactText}>📞 Call: {product.sellerPhone}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => Linking.openURL(`mailto:${product.sellerEmail}`)}>
        <Text style={styles.contactText}>✉️ Email: {product.sellerEmail}</Text>
      </TouchableOpacity>

      {/* Rating Section */}
      <Text style={styles.sectionTitle}>Rate this Product:</Text>
      <StarRating rating={rating} onChange={setRating} />

      {/* Review Input Field */}
      <TextInput
        style={styles.input}
        placeholder="Write your review..."
        value={reviewText}
        onChangeText={setReviewText}
        multiline
      />

      {/* Submit Review Button */}
      <TouchableOpacity style={styles.submitButton} onPress={checkAndSubmitReview}>
        {loading ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <Text style={styles.submitButtonText}>Submit Review</Text>
                )}
      </TouchableOpacity>

{/* Display Reviews */}
<Text style={styles.sectionTitle}>Customer Reviews:</Text>{
  loadingReviews ? <ActivityIndicator style={styles.loader} />
  : reviewList.length === 0 ? (
    <Text style={styles.noReviews}>No reviews yet. Be the first to review!</Text>
  ) : (
  <FlatList
    data={reviewList}
    keyExtractor={(item) => item.id}
    renderItem={({ item }) => (
      <View style={styles.reviewContainer}>
        {/* Profile Image */}
        {/* <Image source={{ uri: item.user?.profileImage }} style={styles.profileImage} /> */}
        <View style={{
                      borderRadius: 100,
                      backgroundColor: '#FF5733',
                      width: '18%',
                      height: '90%',
                      alignItems: 'center',
                      paddingTop: 15,
                      color: '#fff'
                    }}><Text style={{alignItems: 'center'}}>{item?.user?.name.split(' ')[0][0] + item?.user?.name.split(' ')[1][0]}</Text></View>

        {/* Review Details */}
        <View>
          <Text style={styles.reviewText}>{item.reviewText}</Text>

          {/* Star Rating */}
          <StarRating rating={item.rating} starSize={18} disabled />

          {/* Reviewer Name & Date */}
          <Text style={styles.reviewDate}>
            <Text style={styles.userName}>{item.user?.name}</Text> at{' '}
            {moment(item.publishedAt).format('DD-MMM-YYYY')}
          </Text>
        </View>
      </View>
    )}
  /> )}

    </ScrollView>
  );
};
const styles = StyleSheet.create({
  loader: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  image: { width: '100%', height: 250, borderRadius: 10, marginBottom: 10 },
  name: { fontSize: 22, fontWeight: 'bold', marginBottom: 5 },
  price: { fontSize: 18, color: '#777', marginBottom: 10 },
  description: { fontSize: 16, color: '#555', marginBottom: 20 },
  contactTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 20 },
  contactText: { fontSize: 16, color: '#007bff', marginTop: 5 },

  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#6BA292',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  // reviewContainer: {
  //   backgroundColor: '#f8f8f8',
  //   padding: 10,
  //   borderRadius: 5,
  //   marginTop: 10,
  // },
  // reviewText: { fontSize: 16, color: '#333', marginTop: 5 },
  noReviews: { fontSize: 16, color: '#777', marginTop: 10, fontStyle: 'italic' },
  reviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  reviewText: {
    fontSize: 16,
    marginBottom: 5,
  },
  reviewDate: {
    fontSize: 12,
    color: '#555',
  },
  userName: {
    fontWeight: 'bold',
  },
});

export default ProductDetailsScreen;
