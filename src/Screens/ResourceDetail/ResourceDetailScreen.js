import React, { useEffect, useState } from 'react';
import { View, ScrollView, ActivityIndicator, Alert, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import ResourceHeader from './components/ResourceHeader';
import ResourceStats from './components/ResourceStats';
import ResourceContent from './components/ResourceContent';
import CommentsSection from './components/CommentsSection';
import DeleteButton from './components/DeleteButton';

const ResourceDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { resource } = route.params;

  const [likes, setLikes] = useState(resource.likes);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const user = auth().currentUser;
  const resourceRef = firestore().collection('resources').doc(resource.id);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = resourceRef.onSnapshot((doc) => {
      if (doc.exists) {
        const data = doc.data();
        setLikes(data?.likes?.length || 0);
        setHasLiked(data?.likes?.includes(user.uid));
      }
    });
    return unsubscribe;
  }, [user, resource.id]);

  const handleLikeToggle = async () => {
    if (!user) return Alert.alert('Please sign in to like resources');
    await resourceRef.update({
      likes: hasLiked
        ? firestore.FieldValue.arrayRemove(user.uid)
        : firestore.FieldValue.arrayUnion(user.uid),
    });
  };

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      const snapshot = await firestore()
        .collection('comment')
        .where('resourceId', '==', resource.id)
        .orderBy('createdAt', 'desc')
        .get();

      const data = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const comment = { id: doc.id, ...doc.data() };
          const userSnap = await firestore().collection('users').doc(comment.userId).get();
          return {
            ...comment,
            user: userSnap.exists
              ? userSnap.data()
              : { name: 'Anonymous', profileImage: 'https://via.placeholder.com/50' },
          };
        })
      );
      setComments(data);
      setLoading(false);
    };
    fetchComments();
  }, [resource.id]);

  const handleComment = async () => {
    if (!newComment.trim()) return;
    if (!user) return Alert.alert('Please sign in to comment');
    await firestore().collection('comment').add({
      text: newComment,
      userId: user.uid,
      resourceId: resource.id,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
    setNewComment('');
  };

  const handleDelete = async () => {
    Alert.alert('Delete Resource', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          setDeleting(true);
          await resourceRef.delete();
          navigation.goBack();
        },
      },
    ]);
  };

  if (deleting)
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );

  const canDelete = user && user.uid === resource.authorId;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={80}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ paddingBottom: 100 }} // 👈 prevents overlap with bottom tabs
        >
          <ResourceHeader resource={resource} />
          <ResourceStats
            likes={likes}
            views={resource.views}
            hasLiked={hasLiked}
            onLike={handleLikeToggle}
          />
          <ResourceContent description={resource.description} document={resource.document} />
          <CommentsSection
            comments={comments}
            loading={loading}
            newComment={newComment}
            setNewComment={setNewComment}
            handleComment={handleComment}
            user={user}
          />
          {canDelete && <DeleteButton onPress={handleDelete} />}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, padding: 20 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default ResourceDetailScreen;
