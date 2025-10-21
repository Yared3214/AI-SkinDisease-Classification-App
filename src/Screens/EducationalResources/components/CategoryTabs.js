// components/CategoryTabs.js
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

const categories = ['All', 'Skin', 'Hair', 'General', 'Mental'];

const CategoryTabs = ({ selectedCategory, setSelectedCategory }) => {
  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {categories.map((category) => {
          const isSelected = selectedCategory === category;
          return (
            <TouchableOpacity
              key={category}
              onPress={() => setSelectedCategory(category)}
              style={[
                styles.categoryPill,
                isSelected && styles.categorySelected,
              ]}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.categoryText,
                  isSelected && styles.categoryTextSelected,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 12,
    marginBottom: 10,
  },
  scrollContainer: {
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  categoryPill: {
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 20,
    backgroundColor: '#E4F1EE',
    marginHorizontal: 6,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  categorySelected: {
    backgroundColor: '#006666',
  },
  categoryText: {
    fontSize: 14,
    color: '#006666',
    fontWeight: '500',
  },
  categoryTextSelected: {
    color: '#fff',
    fontWeight: '700',
  },
});

export default CategoryTabs;
