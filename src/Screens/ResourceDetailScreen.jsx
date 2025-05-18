import { FIREBASE_AUTH, FIRESTORE_DB } from '../../FireBaseConfig/FirebaseConfig';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useRoute } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, FlatList, TextInput, Dimensions, ActivityIndicator, Alert } from 'react-native';
import RenderHtml from 'react-native-render-html';
import AsyncStorage from '@react-native-async-storage/async-storage';
import YoutubePlayer from 'react-native-youtube-iframe';


const ResourceDetailScreen = () => {
  const route = useRoute();
  const { resource } = route.params;
  const [likes, setLikes] = useState(resource.likes);
  const [comments, setComments] = useState(resource.comments || []);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const user_ = auth().currentUser;
  const resourceRef = firestore().collection('resources').doc(resource.id);
  const width = Dimensions.get('window').width;

  // Real-time like tracking
  useEffect(() => {
    if (!user_) return;

    const unsubscribe = resourceRef.onSnapshot((docSnap) => {
      if (docSnap.exists) {
        const data = docSnap.data();
        setLikes(data?.likes?.length || 0);
        setHasLiked(data?.likes?.includes(user_.uid));
      }
    });

    return unsubscribe;
  }, [resource.id, user_, resourceRef]);


  // Fetch comments with user data
  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const querySnapshot = await firestore()
          .collection('comment')
          .where('resourceId', '==', resource.id)
          .orderBy('createdAt', 'desc')
          .get();

        const commentsData = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const comment = { id: doc.id, ...doc.data() };
            const userSnap = await firestore()
              .collection('users')
              .doc(comment.userId)
              .get();

            return {
              ...comment,
              user: userSnap.exists ? userSnap.data() : {
                name: 'Anonymous',
                profileImage: 'https://via.placeholder.com/50',
              },
              // Convert Firestore timestamp to  Date
              createdAt: comment.createdAt?.toDate(),
            };
          })
        );

        setComments(commentsData);
      } catch (error) {
        console.error('Error fetching comments:', error);
        Alert.alert('Error', 'Failed to load comments');
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [resource.id]);

  const handleLikeToggle = async () => {
    if (!user_) {
      Alert.alert('Please sign in to like resources');
      return;
    }

    try {
      await resourceRef.update({
        likes: hasLiked
          ? firestore.FieldValue.arrayRemove(user_.uid)
          : firestore.FieldValue.arrayUnion(user_.uid),
      });
    } catch (error) {
      console.error('Error updating like:', error);
      Alert.alert('Error', 'Failed to update like status');
    }
  };

  const handleComment = async () => {
    if (!newComment.trim()) return;
    if (!user_) {
      Alert.alert('Please sign in to comment');
      return;
    }

    try {
      // Check for existing comment
      const existingComment = await firestore()
        .collection('comment')
        .where('resourceId', '==', resource.id)
        .where('userId', '==', user_.uid)
        .get();

      if (!existingComment.empty) {
        Alert.alert('You can only comment once per resource');
        return;
      }

      // Add new comment
      const commentRef = await firestore()
        .collection('comment')
        .add({
          text: newComment,
          userId: user_.uid,
          resourceId: resource.id,
          createdAt: firestore.FieldValue.serverTimestamp(),
        });

      // Update comment count
      await resourceRef.update({
        commentCount: firestore.FieldValue.increment(1),
      });

      // Optimistic UI update
      setComments(prev => [{
        id: commentRef.id,
        text: newComment,
        userId: user_.uid,
        user: { displayName: user_.displayName },
        createdAt: new Date(),
      }, ...prev]);

      setNewComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
      Alert.alert('Error', 'Failed to post comment');
    }
  };

  const extractYoutubeVideoId = (url) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([\w-]{11})/);
    return match ? match[1] : null;
  };

  return (
    <ScrollView style={styles.container}>
{resource.type === 'video' && resource.videoUrl ? (
        <View style={{ marginBottom: 15 }}>
          <YoutubePlayer height={200} play={false} videoId={extractYoutubeVideoId(resource.videoUrl)} />
        </View>
      ) : (
        <Image source={{ uri: resource.image }} style={styles.image} />
      )}
      <Text style={styles.title}>{resource.title}</Text>
      <Text style={styles.type}>{resource.type}</Text>
      <Text style={styles.author}>by {resource.author}</Text>

      {/* Like & Views */}
      <View style={styles.statsRow}>
        <TouchableOpacity onPress={handleLikeToggle} style={styles.statItem}>
          <FontAwesome name={hasLiked ? 'heart' : 'heart-o'} size={20} color="red" />
          <Text>{likes}</Text>
        </TouchableOpacity>
        <View style={styles.statItem}>
          <FontAwesome name="eye" size={20} color="gray" />
          <Text>{resource.views}</Text> 
        </View>
      </View>

      {/* Full Article Content */}
      <RenderHtml contentWidth={width} source={{ html: resource.description }} />

      {/* Comments Section */}
      <Text style={styles.commentHeader}>Comments:</Text>
      {loading ? <ActivityIndicator style={styles.loader} />
      : comments.length === 0 ? (
          <Text style={styles.noReviews}>No comments yet. Be the first to comment!</Text>
        ) : (
          <FlatList
        data={comments}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
            gap: 10
          }}>
            <View style={{
              borderRadius: 100,
              backgroundColor: '#FF5733',
              width: '14%',
              height: '100%',
              alignItems: 'center',
              paddingTop: 15,
              color: '#fff'
            }}>{item.user.name && <Text>{item?.user?.name?.split(' ')[0][0] + item?.user?.name.split(' ')[1][0]}</Text>}</View>
            <View style={styles.commentContainer}>
            {/* <Image source={{ uri: item?.user?.profileImage }} style={styles.profileImage} /> */}
            <View>
              <Text style={styles.commentUser}>{item?.user?.name}</Text>
              <Text style={styles.comment}>{item?.text}</Text>
            </View>
          </View>
          </View>
        )}
      />
        )}

      {/* Comment Input */}
      {user_ && (
        <View style={styles.commentBox}>
          <TextInput
            style={styles.input}
            placeholder="Write a comment..."
            value={newComment}
            onChangeText={setNewComment}
          />
          <TouchableOpacity onPress={handleComment} style={styles.sendButton}>
            <FontAwesome name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

export default ResourceDetailScreen;

const styles = StyleSheet.create({
  loader: {flex: 1, justifyContent: 'center', alignItems: 'center'  },
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  image: { width: '100%', height: 200, borderRadius: 8, marginBottom: 15 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 5 },
  type: { fontSize: 16, color: 'gray', marginBottom: 3 },
  author: { fontSize: 14, color: '#666', marginBottom: 10 },

  statsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  statItem: { flexDirection: 'row', alignItems: 'center', marginRight: 15 },

  commentHeader: { fontSize: 18, fontWeight: 'bold', marginTop: 15, marginBottom: 5 },
  commentContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  profileImage: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  commentUser: { fontSize: 14, fontWeight: 'bold' },
  comment: { fontSize: 14, color: '#333' },

  commentBox: { flexDirection: 'row', alignItems: 'center', marginTop: 10, borderColor: '#ccc', borderWidth: 1, borderRadius: 5, paddingHorizontal: 10 },
  input: { flex: 1, height: 40, paddingHorizontal: 5 },
  sendButton: { backgroundColor: '#006666', padding: 10, borderRadius: 5, marginLeft: 10 },
  content: { fontSize: 16, lineHeight: 24, textAlign: 'justify' },
  markdown: { fontSize: 16, lineHeight: 24 },
});