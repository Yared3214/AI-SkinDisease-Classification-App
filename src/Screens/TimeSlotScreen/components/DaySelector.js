import React from 'react';
import { FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';

const DaySelector = ({ days, selectedDay, onSelect }) => {
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <Animatable.View animation="fadeInUp" duration={400} style={{ marginBottom: 10 }}>
      <Text style={styles.header}>Select Day</Text>
      <FlatList
        horizontal
        data={days}
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.option, selectedDay === item && styles.selected]}
            onPress={() => onSelect(item)}
          >
            <Text style={[styles.optionText, selectedDay === item && styles.selectedText]}>
              {capitalize(item)}
            </Text>
          </TouchableOpacity>
        )}
      />
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E4A43',
    marginBottom: 12,
  },
  option: {
    backgroundColor: '#F0F0F0',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    marginRight: 10,
  },
  selected: {
    backgroundColor: '#6BA292',
  },
  optionText: {
    color: '#333',
    fontSize: 15,
  },
  selectedText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default DaySelector;
