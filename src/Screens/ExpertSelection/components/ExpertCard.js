import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Image } from 'react-native';

const ExpertCard = ({ expert, onPress }) => (
  <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={onPress}>
    <View style={styles.avatarContainer}>
      <Image
        source={{
          uri: expert.photo || 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
        }}
        style={styles.avatar}
      />
    </View>
    <View style={styles.infoContainer}>
      <Text style={styles.name}>{expert.name}</Text>
      <Text style={styles.specialty}>{expert.specialization || 'Specialist'}</Text>
      <Text style={styles.email}>{expert.email}</Text>
    </View>
  </TouchableOpacity>
);

export default ExpertCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 5,
  },
  avatarContainer: {
    marginRight: 15,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    color: '#2E4A43',
  },
  specialty: {
    color: '#6BA292',
    fontSize: 14,
    marginTop: 2,
  },
  email: {
    fontSize: 13,
    color: '#777',
    marginTop: 4,
  },
});
