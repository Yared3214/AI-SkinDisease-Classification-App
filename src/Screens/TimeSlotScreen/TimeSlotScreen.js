import React, { useEffect, useState } from 'react';
import {
  View,
  Alert,
  ActivityIndicator,
  Text,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { isBefore, format, startOfDay } from 'date-fns';

import DaySelector from './components/DaySelector';
import TimeSlotSelector from './components/TimeSlotSelector';
import DateSelector from './components/DateSelector';
import ConfirmButton from './components/ConfirmButton';
import EmptyState from './components/EmptyState';

const TimeSlotScreen = ({ route }) => {
  const { expertId, expertName } = route.params;
  const navigation = useNavigation();
  const currentUser = auth().currentUser;

  const [availability, setAvailability] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [loading, setLoading] = useState(false);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [hasPendingAppointment, setHasPendingAppointment] = useState(false);
  const [userName, setUserName] = useState('');
  const [expertInfo, setExpertInfo] = useState(null);

  useEffect(() => {
    if (!currentUser) return;
    firestore().collection('users').doc(currentUser.uid).get().then((doc) => {
      if (doc.exists) setUserName(doc.data().name);
    });
  }, []);

  // Fetch expert profile for top section
  useEffect(() => {
    if (!expertId) return;
    const unsubscribe = firestore()
      .collection('users')
      .doc(expertId)
      .onSnapshot((doc) => {
        if (doc.exists) setExpertInfo(doc.data());
      });
    return () => unsubscribe();
  }, [expertId]);

  useEffect(() => {
    if (!expertId) return;
    const unsubscribe = firestore()
      .collection('expertAvailability')
      .where('expertId', '==', expertId)
      .onSnapshot(async (snapshot) => {
        setAvailabilityLoading(true);
        try {
          if (!snapshot.empty) {
            const expertData = snapshot.docs[0].data();
            const availabilityDoc = await firestore()
              .collection('availability')
              .doc(expertData.availabilityId)
              .get();
            if (availabilityDoc.exists) setAvailability(availabilityDoc.data());
          }
        } catch {
          Alert.alert('Error', 'Failed to load availability');
        } finally {
          setAvailabilityLoading(false);
        }
      });
    return () => unsubscribe();
  }, [expertId]);

  useEffect(() => {
    if (!currentUser?.uid) return;
    const unsubscribe = firestore()
      .collection('appointments')
      .where('userId', '==', currentUser.uid)
      .where('status', '==', 'pending')
      .onSnapshot((snap) => setHasPendingAppointment(!snap.empty));
    return () => unsubscribe();
  }, [currentUser?.uid]);

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleDateConfirm = (date) => {
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    if (dayName !== selectedDay) {
      Alert.alert('Invalid Date', `Please select a ${selectedDay}.`);
    } else {
      setSelectedDate(date);
    }
    hideDatePicker();
  };

  const handleBooking = async () => {
    if (!selectedDay || !selectedSlot || !selectedDate)
      return Alert.alert('Missing Info', 'Select a day, date, and time slot.');

    if (hasPendingAppointment)
      return Alert.alert('Pending Appointment', 'You already have a pending one.');

    const today = startOfDay(new Date());
    if (isBefore(startOfDay(selectedDate), today))
      return Alert.alert('Invalid Date', 'Please choose a future date.');

    const formattedDate = format(selectedDate, 'EEEE, MMMM do yyyy');

    Alert.alert('Confirm', `Book with ${expertName} on ${formattedDate} at ${selectedSlot}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Confirm',
        onPress: async () => {
          setLoading(true);
          try {
            const formattedDBDate = format(selectedDate, 'yyyy-MM-dd');
            const query = await firestore()
              .collection('appointments')
              .where('expertId', '==', expertId)
              .where('date', '==', formattedDBDate)
              .where('time', '==', selectedSlot)
              .get();

            const valid = query.docs.filter(
              (doc) => !['rejected', 'cancelled'].includes(doc.data().status?.toLowerCase())
            );

            if (valid.length > 0)
              return Alert.alert('Slot Taken', 'That time is already booked.');

            await firestore().collection('appointments').add({
              userId: currentUser.uid,
              userName,
              expertId,
              expertName,
              date: formattedDBDate,
              displayDate: formattedDate,
              time: selectedSlot,
              day: selectedDay,
              status: 'pending',
              meetingId: Math.random().toString(36).substring(2, 10).toUpperCase(),
              createdAt: firestore.FieldValue.serverTimestamp(),
              updatedAt: firestore.FieldValue.serverTimestamp(),
            });

            Alert.alert('Success', `Appointment booked for ${formattedDate}`, [
              { text: 'OK', onPress: () => navigation.goBack() },
            ]);
          } catch {
            Alert.alert('Error', 'Could not complete booking.');
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      {/* 💼 Expert Info Section */}
      {expertInfo && (
        <View style={styles.expertCard}>
          <Image
            source={{
            uri: expertInfo?.photo || 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
          }}
            style={styles.expertImage}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.expertName}>{expertInfo.name}</Text>
            <Text style={styles.expertField}>{expertInfo.specialization || 'Expert Advisor'}</Text>
          </View>
        </View>
      )}

      <Text style={styles.sectionTitle}>📅 Choose Your Appointment</Text>
      <Text style={styles.sectionSubtitle}>
        Select your preferred day, time, and date to book an appointment with{' '}
        <Text style={{ fontWeight: '600', color: '#2E4A43' }}>{expertName}</Text>.
      </Text>

      {availabilityLoading ? (
        <ActivityIndicator size="large" color="#6BA292" style={{ marginTop: 50 }} />
      ) : (
        <>
          <DaySelector
            days={Object.keys(availability || {})}
            selectedDay={selectedDay}
            onSelect={(day) => {
              setSelectedDay(day);
              setSelectedSlot(null);
              setSelectedDate(null);
            }}
          />

          {selectedDay && (
            <>
              {availability[selectedDay]?.length > 0 ? (
                <>
                  <TimeSlotSelector
                    slots={availability[selectedDay]}
                    selectedSlot={selectedSlot}
                    onSelect={setSelectedSlot}
                  />
                  <DateSelector
                    selectedDate={selectedDate}
                    isVisible={isDatePickerVisible}
                    showPicker={showDatePicker}
                    hidePicker={hideDatePicker}
                    onConfirm={handleDateConfirm}
                  />
                </>
              ) : (
                <EmptyState message={`No time slots are available on ${selectedDay}.`} />
              )}
            </>
          )}

          <ConfirmButton onPress={handleBooking} loading={loading} />
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FDFB',
    padding: 20,
  },
  expertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F7F5',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    elevation: 2,
  },
  expertImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  expertName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E4A43',
  },
  expertField: {
    fontSize: 14,
    color: '#6BA292',
    marginTop: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2E4A43',
    marginBottom: 6,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
});

export default TimeSlotScreen;
