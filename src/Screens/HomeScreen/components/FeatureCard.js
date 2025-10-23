import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

/**
 * Informative Feature Card Component
 * - Non-clickable (static)
 * - Clean, accessible layout
 * - Optional color accent for thematic consistency
 */
const FeatureCard = ({ title, icon, description, color = '#006666' }) => (
  <View style={[styles.card, { borderLeftColor: color }]}>
    <View style={styles.iconContainer}>
      <Icon name={icon} size={28} color={color} />
    </View>
    <View style={styles.textContainer}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    borderLeftWidth: 5,
    marginBottom: 12,
  },
  iconContainer: {
    marginRight: 14,
    marginTop: 4,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#006666',
    marginBottom: 4,
  },
  description: {
    color: '#555',
    fontSize: 14,
    lineHeight: 20,
  },
});

export default FeatureCard;
