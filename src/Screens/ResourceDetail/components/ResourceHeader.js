// components/resource/ResourceHeader.js
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';

const extractYoutubeVideoId = (url) => {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([\w-]{11})/);
  return match ? match[1] : null;
};

const ResourceHeader = ({ resource }) => {
  return (
    <View style={styles.container}>
      {resource.type === 'video' && resource.videoUrl ? (
        <YoutubePlayer height={220} play={false} videoId={extractYoutubeVideoId(resource.videoUrl)} />
      ) : (
        <Image source={{ uri: resource.image }} style={styles.image} />
      )}
      <Text style={styles.title}>{resource.title}</Text>
      <Text style={styles.type}>{resource.type}</Text>
      <Text style={styles.author}>by {resource.author}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 15 },
  image: { width: '100%', height: 220, borderRadius: 14, marginBottom: 15 },
  title: { fontSize: 24, fontWeight: '700', color: '#003333', marginBottom: 5 },
  type: { fontSize: 15, color: '#006666', fontWeight: '500' },
  author: { fontSize: 13, color: '#777', marginTop: 5 },
});

export default ResourceHeader;
