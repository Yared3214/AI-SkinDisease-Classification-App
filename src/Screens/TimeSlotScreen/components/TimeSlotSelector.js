import React from 'react';
import { FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';

const TimeSlotSelector = ({ slots, selectedSlot, onSelect }) => (
  <Animatable.View animation="fadeInUp" duration={400} delay={100} style={{ marginBottom: 20 }}>
    <Text style={styles.header}>Select Time Slot</Text>
    <FlatList
      horizontal
      data={slots}
      keyExtractor={(slot) => slot}
      showsHorizontalScrollIndicator={false}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[styles.slot, selectedSlot === item && styles.selected]}
          onPress={() => onSelect(item)}
        >
          <Text style={[styles.slotText, selectedSlot === item && styles.selectedText]}>
            {item}
          </Text>
        </TouchableOpacity>
      )}
    />
  </Animatable.View>
);

const styles = StyleSheet.create({
  header: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E4A43',
    marginVertical: 12,
  },
  slot: {
    backgroundColor: '#F0F0F0',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginRight: 10,
  },
  selected: {
    backgroundColor: '#6BA292',
  },
  slotText: {
    color: '#333',
  },
  selectedText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default TimeSlotSelector;
