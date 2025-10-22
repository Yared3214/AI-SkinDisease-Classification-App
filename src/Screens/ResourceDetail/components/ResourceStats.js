// components/resource/ResourceStats.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const ResourceStats = ({ likes, views, hasLiked, onLike }) => (
  <View style={styles.statsRow}>
    <TouchableOpacity onPress={onLike} style={styles.statItem}>
      <FontAwesome name={hasLiked ? 'heart' : 'heart-o'} size={22} color={hasLiked ? 'red' : '#666'} />
      <Text style={styles.text}>{likes}</Text>
    </TouchableOpacity>
    <View style={styles.statItem}>
      <FontAwesome name="eye" size={22} color="#666" />
      <Text style={styles.text}>{views}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E4F1EE',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
  },
  text: {
    fontSize: 14,
    marginLeft: 6,
    color: '#006666',
  },
});

export default ResourceStats;
