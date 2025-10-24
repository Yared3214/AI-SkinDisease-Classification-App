import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as Animatable from 'react-native-animatable';

const DateSelector = ({
  selectedDate,
  isVisible,
  showPicker,
  hidePicker,
  onConfirm,
}) => (
  <Animatable.View animation="fadeInUp" duration={400} delay={200}>
    <TouchableOpacity style={styles.dateButton} onPress={showPicker}>
      <Text style={styles.dateText}>
        {selectedDate ? selectedDate.toDateString() : 'Select Date'}
      </Text>
    </TouchableOpacity>

    <DateTimePickerModal
      isVisible={isVisible}
      mode="date"
      onConfirm={onConfirm}
      onCancel={hidePicker}
    />
  </Animatable.View>
);

const styles = StyleSheet.create({
  dateButton: {
    marginTop: 16,
    paddingVertical: 14,
    backgroundColor: '#E6F0ED',
    borderRadius: 12,
    alignItems: 'center',
  },
  dateText: {
    color: '#2E4A43',
    fontWeight: '600',
  },
});

export default DateSelector;
