import React from 'react';
import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const categories = [
  'All',
  'Cleanser',
  'Moisturizer',
  'Serum',
  'Sunscreen',
  'Mask',
  'Toner',
  'Exfoliator',
];

const CategoryFilter = ({ selected, onSelect }) => {
  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.chip, selected === cat && styles.chipActive]}
            onPress={() => onSelect(cat)}
          >
            <Text
              style={[
                styles.chipText,
                selected === cat && styles.chipTextActive,
              ]}
              numberOfLines={1}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#F8FDFB',
    paddingVertical: 6,
    borderBottomWidth: 0.3,
    borderColor: '#D6E6E1',
  },
  container: {
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  chip: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#6BA292',
    justifyContent: 'center',
    alignItems: 'center',
    height: 36, // ✅ keeps consistent height
  },
  chipActive: {
    backgroundColor: '#006666',
    borderColor: '#6BA292',
  },
  chipText: {
    color: '#6BA292',
    fontSize: 14,
    fontWeight: '500',
  },
  chipTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default CategoryFilter;
