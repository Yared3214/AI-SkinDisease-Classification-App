import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { isBefore, format, startOfDay } from 'date-fns';

// Main screen component for selecting and booking a time slot with an expert
const TimeSlotScreen = ({ route }) => {
  const { expertId, expertName } = route.params; // Props from previous screen
  const navigation = useNavigation();
  const currentUser = auth().currentUser;

  // State variables
  const [availability, setAvailability] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [loading, setLoading] = useState(false);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [hasPendingAppointment, setHasPendingAppointment] = useState(false);
  const [userName, setUserName] = useState('');

  // Fetch user name on component mount
  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return;

      const userDoc = await firestore()
        .collection('users')
        .doc(currentUser.uid)
        .get();

      if (userDoc.exists) {
        setUserName(userDoc.data().name);
      }
    };
    fetchData();
  }, []);

  // Fetch expert availability in real-time
  useEffect(() => {
    if (!expertId) return;

    const unsubscribe = firestore()
      .collection('expertAvailability')
      .where('expertId', '==', expertId)
      .onSnapshot(async (snapshot) => {
        try {
          setAvailabilityLoading(true);

          if (!snapshot.empty) {
            const expertData = snapshot.docs[0].data();
            const availabilityId = expertData.availabilityId;

            const availabilityDoc = await firestore()
              .collection('availability')
              .doc(availabilityId)
              .get();

            if (availabilityDoc.exists) {
              setAvailability(availabilityDoc.data());
            }
          }
        } catch (error) {
          console.error('Error loading availability:', error);
          Alert.alert('Error', 'Failed to load availability');
        } finally {
          setAvailabilityLoading(false);
        }
      });

    return () => unsubscribe();
  }, [expertId]);

  // Check if user has a pending appointment in real-time
  useEffect(() => {
    if (!currentUser?.uid) return;

    const unsubscribe = firestore()
      .collection('appointments')
      .where('userId', '==', currentUser.uid)
      .where('status', '==', 'pending')
      .onSnapshot((snapshot) => {
        setHasPendingAppointment(!snapshot.empty);
      });

    return () => unsubscribe();
  }, [currentUser?.uid]);

  // Capitalize a string
  const capitalize = (str) => {
    if (typeof str !== 'string') return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // Show/hide date picker modal
  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  // Handle date selection and validation
  const handleDateConfirm = (date) => {
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    if (dayName !== selectedDay) {
      Alert.alert('Invalid date', `Please select a ${capitalize(selectedDay)}.`);
    } else {
      setSelectedDate(date);
    }
    hideDatePicker();
  };

  // Generate random meeting ID
  const generateMeetingId = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  };

  // Handle appointment booking logic
  const handleBooking = async () => {
    if (!selectedDay || !selectedSlot || !selectedDate) {
      Alert.alert('Missing Information', 'Please select a day, date, and time slot');
      return;
    }

    const today = startOfDay(new Date());
    const selectedDayStart = startOfDay(selectedDate);

    if (isBefore(selectedDayStart, today)) {
      Alert.alert(
        'Invalid Date',
        'You cannot book appointments for past dates. Please select a future date.'
      );
      return;
    }

    if (hasPendingAppointment) {
      Alert.alert(
        'Pending Appointment',
        'You already have a pending appointment. Please complete it before booking another.'
      );
      return;
    }

    const formattedDate = format(selectedDate, 'EEEE, MMMM do yyyy');

    Alert.alert(
      'Confirm Booking',
      `Book with ${expertName} on ${formattedDate} at ${selectedSlot}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            setLoading(true);
            try {
              const formattedDBDate = format(selectedDate, 'yyyy-MM-dd');

              // Check if slot already booked
              const slotQuery = await firestore()
                .collection('appointments')
                .where('expertId', '==', expertId)
                .where('date', '==', formattedDBDate)
                .where('time', '==', selectedSlot)
                .get();

              if (!slotQuery.empty) {
                Alert.alert('Slot Unavailable', 'This time slot is already booked');
                return;
              }

              // Prepare appointment data
              const appointmentData = {
                userId: currentUser.uid,
                userName: userName || 'User',
                expertId,
                expertName,
                date: formattedDBDate,
                displayDate: formattedDate,
                time: selectedSlot,
                day: selectedDay,
                status: 'pending',
                meetingId: generateMeetingId(),
                createdAt: firestore.FieldValue.serverTimestamp(),
                updatedAt: firestore.FieldValue.serverTimestamp(),
              };

              // Create appointment in Firestore
              await firestore().collection('appointments').add(appointmentData);

              Alert.alert(
                'Success',
                `Appointment booked for ${formattedDate} at ${selectedSlot}`,
                [{ text: 'OK', onPress: () => navigation.goBack() }]
              );
            } catch (error) {
              console.error('Booking error:', error);
              Alert.alert('Error', 'Failed to book appointment. Please try again.');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Select Day:</Text>

      {/* Show loading spinner while availability is being fetched */}
      {availabilityLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#006666" />
        </View>
      ) : (
        <FlatList
          vertical
          data={Object.keys(availability || {})}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.option, selectedDay === item && styles.selected]}
              onPress={() => {
                setSelectedDay(item);
                setSelectedSlot(null);
                setSelectedDate(null);
              }}
            >
              <Text>{capitalize(item)}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* If day is selected, show time slots and date picker */}
      {selectedDay && (
        <>
          {availability[selectedDay] && availability[selectedDay].length > 0 ? (
            <>
              <Text style={styles.header}>Select Time Slot:</Text>
              <FlatList
                horizontal
                data={Array.isArray(availability[selectedDay]) ? availability[selectedDay] : []}
                keyExtractor={(slot) => slot}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[styles.option, selectedSlot === item && styles.selected]}
                    onPress={() => setSelectedSlot(item)}
                  >
                    <Text>{item}</Text>
                  </TouchableOpacity>
                )}
              />

              {/* Date picker button */}
              <TouchableOpacity style={styles.dateButton} onPress={showDatePicker}>
                <Text>{selectedDate ? selectedDate.toDateString() : 'Select Date'}</Text>
              </TouchableOpacity>

              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleDateConfirm}
                onCancel={hideDatePicker}
              />
            </>
          ) : (
            <Text style={{ marginTop: 10, fontStyle: 'italic', color: 'gray' }}>
              Not available on {capitalize(selectedDay)}
            </Text>
          )}
        </>
      )}

      {/* Confirm Booking Button */}
      <TouchableOpacity style={styles.confirmButton} onPress={handleBooking}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: 'white' }}>Confirm Booking</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 18,
    marginVertical: 10,
  },
  option: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#eee',
    marginRight: 10,
    borderRadius: 8,
  },
  selected: {
    backgroundColor: '#6BA292',
  },
  dateButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#eee',
    alignItems: 'center',
    borderRadius: 8,
  },
  confirmButton: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#6BA292',
    alignItems: 'center',
    borderRadius: 8,
  },
});

export default TimeSlotScreen;
