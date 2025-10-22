import React from 'react';
import { View, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import styles from '../styles';

const ResourceTypeSelector = ({ selected, onSelect }) => (
  <View style={{ marginBottom: 15 }}>
    <Text style={styles.label}>Resource Type</Text>
    <View style={styles.pickerContainer}>
      <Picker style={styles.picker} selectedValue={selected} onValueChange={onSelect}>
        <Picker.Item label="Article" value="article" />
        <Picker.Item label="Video" value="video" />
        <Picker.Item label="Infographic" value="infographic" />
      </Picker>
    </View>
  </View>
);

export default ResourceTypeSelector;
