import React, { useEffect, useState } from 'react';
import { ScrollView, View, ActivityIndicator, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProductHeader from './components/ProductHeader';
import SellerContactCard from './components/SellerContactCard';
import ReviewForm from './components/ReviewForm';
import ReviewList from './components/ReviewList';
import styles from './styles';

const ProductDetailsScreen = ({ route }) => {
  const { product } = route.params;
  const [reviewList, setReviewList] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const user = auth().currentUser;

  // Real-time reviews
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('reviews')
      .where('productId', '==', product.id)
      .orderBy('publishedAt', 'desc')
      .onSnapshot(
        async (snapshot) => {
          const reviews = await Promise.all(snapshot.docs.map(async doc => {
            const data = doc.data();
            const userSnap = await firestore().collection('users').doc(data.userId).get();
            return {
              id: doc.id,
              ...data,
              publishedAt: data.publishedAt?.toDate?.() || new Date(),
              user: userSnap.exists ? userSnap.data() : { name: 'Anonymous' },
            };
          }));
          setReviewList(reviews);
          setLoadingReviews(false);
        },
        () => setLoadingReviews(false)
      );
    return () => unsubscribe();
  }, [product.id]);

  // Submit review logic
  const handleSubmitReview = async (rating, reviewText) => {
    if (!user) return Alert.alert('Error', 'You must be logged in to review');
    if (!rating) return Alert.alert('Error', 'Please select a rating');

    try {
      const existing = await firestore()
        .collection('reviews')
        .where('userId', '==', user.uid)
        .where('productId', '==', product.id)
        .get();

      const reviewKey = `reviewed_${product.id}_${user.uid}`;

      if (!existing.empty) {
        await existing.docs[0].ref.update({
          rating,
          reviewText,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });
      } else {
        await firestore().collection('reviews').add({
          userId: user.uid,
          productId: product.id,
          rating,
          reviewText,
          publishedAt: firestore.FieldValue.serverTimestamp(),
          userName: user.displayName || 'Anonymous',
        });
      }

      await AsyncStorage.setItem(reviewKey, 'true');
      Alert.alert('Success', 'Review submitted!');
    } catch (e) {
      Alert.alert('Error', 'Failed to submit review.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <ProductHeader product={product} />
      <SellerContactCard product={product} />
      <ReviewForm onSubmit={handleSubmitReview} />
      {loadingReviews ? (
        <ActivityIndicator style={styles.loader} color="#6BA292" />
      ) : (
        <ReviewList reviews={reviewList} />
      )}
    </ScrollView>
  );
};

export default ProductDetailsScreen;
