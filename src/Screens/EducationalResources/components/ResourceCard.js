import React from 'react';
import { TouchableOpacity, ImageBackground, View, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const ResourceCard = ({ item, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
    <ImageBackground
      source={{ uri: item.image }}
      style={styles.imageBackground}
      imageStyle={{ borderRadius: 15 }}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.6)']}
        style={styles.overlay}
      >
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.author}>By {item.author}</Text>
          <View style={styles.stats}>
            <FontAwesome name="heart" size={12} color="#fff" />
            <Text style={styles.stat}>{item.likes?.length || 0}</Text>
            <FontAwesome name="eye" size={12} color="#fff" />
            <Text style={styles.stat}>{item.views || 0}</Text>
          </View>
        </View>
      </LinearGradient>
    </ImageBackground>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    marginBottom: 15,
    marginTop: 8,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 3,
  },
  imageBackground: {
    height: 180,
    justifyContent: 'flex-end',
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    borderRadius: 15,
  },
  textContainer: {
    padding: 12,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  author: {
    color: '#e0e0e0',
    fontSize: 12,
    marginBottom: 5,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stat: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 4,
    marginRight: 10,
  },
});

export default ResourceCard;
