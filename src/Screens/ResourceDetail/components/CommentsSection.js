// components/resource/CommentsSection.js
import React from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const CommentsSection = ({
  comments,
  loading,
  newComment,
  setNewComment,
  handleComment,
  user,
}) => (
  <View style={styles.container}>
    <Text style={styles.header}>Comments</Text>
    {loading ? (
      <ActivityIndicator size="small" />
    ) : comments.length === 0 ? (
      <Text style={styles.empty}>No comments yet. Be the first!</Text>
    ) : (
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.commentItem}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {item.user?.name ? item.user.name[0].toUpperCase() : '?'}
              </Text>
            </View>
            <View>
              <Text style={styles.user}>{item.user?.name || 'Anonymous'}</Text>
              <Text style={styles.comment}>{item.text}</Text>
            </View>
          </View>
        )}
      />
    )}

    {user && (
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Write a comment..."
          value={newComment}
          onChangeText={setNewComment}
        />
        <TouchableOpacity onPress={handleComment} style={styles.sendButton}>
          <FontAwesome name="send" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: { marginTop: 20 },
  header: { fontSize: 18, fontWeight: '700', color: '#003333', marginBottom: 8 },
  empty: { color: '#666', fontStyle: 'italic' },
  commentItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  avatar: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#006666',
    justifyContent: 'center', alignItems: 'center', marginRight: 10,
  },
  avatarText: { color: '#fff', fontWeight: 'bold' },
  user: { fontWeight: '600', color: '#333' },
  comment: { color: '#555', fontSize: 14 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    paddingHorizontal: 10,
  },
  input: { flex: 1, height: 40 },
  sendButton: {
    backgroundColor: '#006666',
    padding: 10,
    borderRadius: 20,
    marginLeft: 8,
  },
});

export default CommentsSection;
