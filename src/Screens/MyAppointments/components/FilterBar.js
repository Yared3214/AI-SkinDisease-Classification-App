import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const STATUSES = ['all', 'pending', 'accepted', 'completed', 'cancelled'];

export default function FilterBar({ selected, onSelect }) {
  return (
    <View style={styles.container}>
      {STATUSES.map((status) => {
        const isActive = selected === status;
        return (
          <TouchableOpacity
            key={status}
            style={[styles.chip, isActive && styles.activeChip]}
            onPress={() => onSelect(status)}
          >
            <Text style={[styles.chipText, isActive && styles.activeChipText]}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#6BA292',
    backgroundColor: '#fff',
  },
  activeChip: {
    backgroundColor: '#6BA292',
  },
  chipText: {
    color: '#6BA292',
    fontWeight: '600',
  },
  activeChipText: {
    color: '#fff',
  },
});
