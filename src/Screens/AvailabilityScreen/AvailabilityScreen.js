import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator, ScrollView, Image } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import DaySelector from './components/DaySelector';
import TimeSlotList from './components/TimeSlotList';
import AddTimeSlot from './components/AddTimeSlot';
import SaveButton from './components/SaveButton';

const AvailabilityScreen = () => {
  const user = auth().currentUser;

  const expertId = auth().currentUser?.uid;
  const [expertInfo, setExpertInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedDay, setSelectedDay] = useState('monday');
  const [availability, setAvailability] = useState({
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
  });

  // Load expert info and availability
  useEffect(() => {
    if (!expertId) return;

    const unsubscribe = firestore()
      .collection('expertAvailability')
      .doc(expertId)
      .onSnapshot(async (doc) => {
        if (!doc.exists) return setLoading(false);
        try {
          const data = doc.data();
          const ref = await firestore().collection('availability').doc(data.availabilityId).get();
          if (ref.exists) setAvailability(ref.data());
        } catch (e) {
          Alert.alert('Error', 'Could not load availability');
        } finally {
          setLoading(false);
        }
      });

    // firestore().collection('experts').doc(expertId).get().then((snap) => {
    //   if (snap.exists) setExpertInfo(snap.data());
    // });

    firestore().collection('users').doc(user.uid).get().then((snap) => {
      if (snap.exists) setExpertInfo(snap.data());
    })

    return () => unsubscribe();
  }, [expertId]);

  // Derived data
  const totalSlots = Object.values(availability).reduce((sum, slots) => sum + slots.length, 0);

  // Get next 5 available slots for preview
  const nextSlots = useMemo(() => {
    const daysOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const preview = [];
    for (let day of daysOrder) {
      if (availability[day]?.length) {
        availability[day].forEach((slot) => {
          preview.push({ day, slot });
        });
      }
    }
    return preview.slice(0, 5);
  }, [availability]);

  // Handlers
  const handleAddSlot = (day, slot) => {
    if (!slot.trim()) return;
    setAvailability((prev) => ({
      ...prev,
      [day]: [...(prev[day] || []), slot],
    }));
  };

  const handleRemoveSlot = (day, index) => {
    setAvailability((prev) => {
      const updated = { ...prev };
      updated[day].splice(index, 1);
      return { ...updated };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const batch = firestore().batch();
      const availabilityRef = firestore().collection('availability').doc(expertId);
      batch.set(availabilityRef, availability, { merge: true });
      const expertRef = firestore().collection('expertAvailability').doc(expertId);
      batch.set(
        expertRef,
        { expertId, availabilityId: expertId, lastUpdated: firestore.FieldValue.serverTimestamp() },
        { merge: true }
      );
      await batch.commit();
      Alert.alert('Success', 'Availability saved successfully.');
    } catch (e) {
      Alert.alert('Error', 'Failed to save availability');
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#006666" />
      </View>
    );

  return (
    <ScrollView 
    style={styles.container}
    contentContainerStyle={{ paddingBottom: 40 }} 
    showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={styles.profileCard}>
        <Image
          source={{
            uri: expertInfo?.photo || 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
          }}
          style={styles.avatar}
        />
        <View style={styles.profileText}>
          <Text style={styles.name}>{expertInfo?.name || 'Expert User'}</Text>
          <Text style={styles.specialization}>{expertInfo?.specialization || 'Dermatologist'}</Text>
        </View>
      </View>

      {/* Summary Section */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryText}>
          You currently have <Text style={styles.summaryHighlight}>{totalSlots}</Text> total
          time slots this week.
        </Text>
      </View>

      {/* Next Appointments Preview */}
      <View style={styles.previewCard}>
        <Text style={styles.previewTitle}>Next Available Appointments</Text>
        {nextSlots.length > 0 ? (
          nextSlots.map((item, index) => (
            <View key={index} style={styles.previewRow}>
              <Text style={styles.previewDay}>
                {item.day.charAt(0).toUpperCase() + item.day.slice(1)}
              </Text>
              <Text style={styles.previewTime}>{item.slot}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noSlotsText}>No upcoming slots added yet.</Text>
        )}
      </View>

      {/* Motivational Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerText}>
          🗓️ Keep your availability updated so patients can easily book appointments with you!
        </Text>
      </View>

      {/* Availability Editor */}
      <Text style={styles.sectionTitle}>Edit Your Availability</Text>
      <DaySelector selectedDay={selectedDay} onSelect={setSelectedDay} />
      <TimeSlotList
        slots={availability[selectedDay]}
        day={selectedDay}
        onRemoveSlot={handleRemoveSlot}
      />
      <AddTimeSlot onAdd={(slot) => handleAddSlot(selectedDay, slot)} />

      <SaveButton loading={saving} onPress={handleSave} />
    </ScrollView>
  );
};

export default AvailabilityScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FDFB',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FDFB'
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 12,
  },
  profileText: { flex: 1 },
  name: { fontSize: 18, fontWeight: '700', color: '#006666' },
  specialization: { fontSize: 14, color: '#555' },
  summaryCard: {
    backgroundColor: '#e0f2f1',
    padding: 14,
    borderRadius: 10,
    marginBottom: 14,
  },
  summaryText: { color: '#004d40', textAlign: 'center', fontSize: 15 },
  summaryHighlight: { fontWeight: '700', color: '#006666' },
  previewCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  previewTitle: {
    fontWeight: '600',
    fontSize: 16,
    color: '#004d40',
    marginBottom: 8,
  },
  previewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderColor: '#e0e0e0',
  },
  previewDay: { fontSize: 15, color: '#333' },
  previewTime: { fontSize: 15, fontWeight: '600', color: '#006666' },
  noSlotsText: { color: '#999', textAlign: 'center', marginTop: 6 },
  banner: {
    backgroundColor: '#006666',
    padding: 14,
    borderRadius: 10,
    marginBottom: 18,
  },
  bannerText: { color: '#fff', textAlign: 'center', fontSize: 14, lineHeight: 20 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#004d40',
    marginBottom: 10,
  },
});
