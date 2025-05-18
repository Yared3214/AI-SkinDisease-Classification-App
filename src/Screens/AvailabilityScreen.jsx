import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, FlatList, TouchableOpacity, SafeAreaView, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const AvailabilityScreen = () => {
  const [loading, setLoading] = useState(false);
  const expertId = auth().currentUser?.uid;
  const [saving, setSaving] = useState(false);
  const [availability, setAvailability] = useState({
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
  });
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDay, setSelectedDay] = useState('');
  const [timeSlot, setTimeSlot] = useState('');

  // Load availability data
  useEffect(() => {
    if (!expertId) return;

    const unsubscribe = firestore()
      .collection('expertAvailability')
      .doc(expertId)
      .onSnapshot(async (docSnapshot) => {
        try {
          if (docSnapshot.exists) {
            const data = docSnapshot.data();
            if (data?.availabilityId) {
              const availabilitySnap = await firestore()
                .collection('availability')
                .doc(data.availabilityId)
                .get();

              if (availabilitySnap.exists) {
                setAvailability({
                  ...availabilitySnap.data(),
                });
              }
            }
          }
        } catch (error) {
          console.error("Error loading availability:", error);
          Alert.alert("Error", "Failed to load availability data");
        } finally {
          setLoading(false);
        }
      });

    return () => unsubscribe();
  }, [expertId]);


  const handleAddTimeSlot = () => {
    if (timeSlot.trim() !== '') {
      setAvailability((prevState) => {
        const updatedAvailability = { ...prevState };
        updatedAvailability[selectedDay] = [
          ...updatedAvailability[selectedDay],
          timeSlot,
        ];
        return updatedAvailability;
      });
      setTimeSlot('');
      setShowPicker(false);
    }
  };

  const handleSaveAvailability = async () => {
    if (!expertId) {
      Alert.alert("Error", "No authenticated user found");
      return;
    }

    setSaving(true);
    try {
      const batch = firestore().batch();
      // Create/update availability document
      const availabilityRef = firestore()
        .collection('availability')
        .doc(expertId); // Using expertId as doc ID

      batch.set(availabilityRef, {
        monday: availability.monday,
        tuesday: availability.tuesday,
        wednesday: availability.wednesday,
        thursday: availability.thursday,
        friday: availability.friday,
        saturday: availability.saturday,
        sunday: availability.sunday
      }, { merge: true });

      // Update expert's availability reference
      const expertAvailabilityRef = firestore()
        .collection('expertAvailability')
        .doc(expertId);

      batch.set(expertAvailabilityRef, {
        availabilityId: expertId,
        lastUpdated: firestore.FieldValue.serverTimestamp()
      }, { merge: true });

      await batch.commit();
      
      Alert.alert("Success", "Availability saved successfully");
    } catch (error) {
      console.error("Error saving availability:", error);
      Alert.alert("Error", "Failed to save availability");
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveTimeSlot = (day, index) => {
    setAvailability((prevState) => {
      const updatedAvailability = { ...prevState };
      updatedAvailability[day].splice(index, 1);
      return updatedAvailability;
    });
  };

  const handleDaySelection = (day) => {
    setSelectedDay(day);
    setShowPicker(true); // Show the time picker when a day is selected
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Set Your Availability</Text>

      <ScrollView style={styles.scrollContainer}>
        {Object.keys(availability).map((day) => (
          <TouchableOpacity
            key={day}
            style={[styles.dayContainer, selectedDay === day && styles.selectedDay]}
            onPress={() => handleDaySelection(day)}
          >
            <Text style={styles.dayText}>
              {day.charAt(0).toUpperCase() + day.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {selectedDay && (
        <View style={styles.timeSlotsContainer}>
          <FlatList
            data={availability[selectedDay]}
            renderItem={({ item, index }) => (
              <View style={styles.timeSlotContainer}>
                <Text style={styles.timeSlotText}>{item}</Text>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemoveTimeSlot(selectedDay, index)}
                >
                  <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
          <View style={styles.pickerContainer}>
            <TextInput
              style={styles.timeInput}
              value={timeSlot}
              onChangeText={setTimeSlot}
              placeholder="Enter time slot (e.g., 09:00)"
              keyboardType="default"
            />
            <Button onPress={handleAddTimeSlot} title="Add Time Slot" color="#2196F3" />
          </View>
        </View>
      )}

      <View style={styles.saveButtonContainer}>
      {loading ? <ActivityIndicator size="large" color="#6BA292" />
      : <Button
          onPress={handleSaveAvailability}
          title="Save Availability"
          color="#FF5722"
        />}

      </View>
    </SafeAreaView>
  );
};

export default AvailabilityScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  scrollContainer: {
    flex: 1,
  },
  dayContainer: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  selectedDay: {
    backgroundColor: '#4CAF50', // Highlight selected day with a green background
  },
  dayText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  timeSlotsContainer: {
    marginTop: 20,
  },
  timeSlotContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 5,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  timeSlotText: {
    fontSize: 16,
    color: '#333',
  },
  removeButton: {
    backgroundColor: '#FF1744',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  pickerContainer: {
    marginTop: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  timeInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
  },
  saveButtonContainer: {
    marginTop: 20,
  },
});
