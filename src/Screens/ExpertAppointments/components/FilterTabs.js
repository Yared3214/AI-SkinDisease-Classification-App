import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const FILTERS = [
  { key: 'pending', label: 'Pending' },
  { key: 'accepted', label: 'Accepted' },
  { key: 'rejected', label: 'Rejected' },
];

export default function FilterTabs({ selected, onSelect }) {
  return (
    <View style={styles.container}>
      {FILTERS.map(f => {
        const active = selected === f.key;
        return (
          <TouchableOpacity
            key={f.key}
            style={[styles.tab, active && styles.activeTab]}
            onPress={() => onSelect(f.key)}
          >
            <Text style={[styles.tabText, active && styles.activeTabText]}>
              {f.label}
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
    justifyContent: 'center',
    gap: 10,
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#6BA292',
    backgroundColor: '#fff',
  },
  activeTab: {
    backgroundColor: '#6BA292',
  },
  tabText: {
    color: '#6BA292',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#fff',
  },
});
