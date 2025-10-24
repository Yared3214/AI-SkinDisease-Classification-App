import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const TimeSlotList = ({ slots = [], day, onRemoveSlot }) => {
  if (!slots.length)
    return <Text style={styles.emptyText}>No time slots added for {day} yet.</Text>;

  return (
    <View style={styles.container}>
      {slots.map((slot, index) => (
        <View key={index} style={styles.slotCard}>
          <Text style={styles.slotText}>{slot}</Text>
          <TouchableOpacity onPress={() => onRemoveSlot(day, index)}>
            <Text style={styles.removeText}>✕</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

export default TimeSlotList;

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  slotCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 8,
    elevation: 2,
  },
  slotText: {
    fontSize: 16,
    color: '#333',
  },
  removeText: {
    color: '#cc0000',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#777',
    fontStyle: 'italic',
    marginVertical: 8,
  },
});
