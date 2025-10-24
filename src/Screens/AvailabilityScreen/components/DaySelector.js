import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const DaySelector = ({ selectedDay, onSelect }) => (
  <View style={styles.wrapper}>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {days.map((day) => (
        <TouchableOpacity
          key={day}
          style={[styles.dayButton, selectedDay === day && styles.selectedDay]}
          onPress={() => onSelect(day)}
          activeOpacity={0.8}
        >
          <Text style={[styles.dayText, selectedDay === day && styles.selectedText]}>
            {day.charAt(0).toUpperCase() + day.slice(1, 3)}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </View>
);

export default DaySelector;

const styles = StyleSheet.create({
  wrapper: {
    height: 70, // keeps consistent vertical size
    justifyContent: 'center',
  },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  dayButton: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: '#E0F2F1',
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  selectedDay: {
    backgroundColor: '#006666',
  },
  dayText: {
    color: '#006666',
    fontWeight: '600',
    fontSize: 14,
  },
  selectedText: {
    color: '#fff',
  },
});
