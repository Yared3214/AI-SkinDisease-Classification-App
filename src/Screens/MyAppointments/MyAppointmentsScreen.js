import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { format } from 'date-fns';

import FilterBar from './components/FilterBar';
import AppointmentCard from './components/AppointmentCard';

export default function MyAppointmentsScreen() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    const user = auth().currentUser;
    if (!user) {
      setLoading(false);
      return;
    }

    const unsubscribe = firestore()
      .collection('appointments')
      .where('userId', '==', user.uid)
      .onSnapshot(
        (snapshot) => {
          try {
            const data = snapshot.docs.map((doc) => {
              const docData = doc.data();
              const convertTimestamp = (timestamp) => {
                if (timestamp?.toDate) return timestamp.toDate();
                if (typeof timestamp === 'string') return new Date(timestamp);
                return null;
              };

              return {
                id: doc.id,
                ...docData,
                date: convertTimestamp(docData.date),
                createdAt: convertTimestamp(docData.createdAt),
                updatedAt: convertTimestamp(docData.updatedAt),
              };
            });
            setAppointments(data);
          } catch (error) {
            console.error('Error processing appointments:', error);
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          console.error('Snapshot error:', error);
          setLoading(false);
        }
      );

    return () => unsubscribe();
  }, []);

  const filteredAppointments = appointments.filter((a) =>
    filter === 'all' ? true : a.status === filter
  );

  const handleCancel = async (appointmentId) => {
    setCancellingId(appointmentId);
    try {
      await firestore().collection('appointments').doc(appointmentId).update({
        status: 'cancelled',
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
    } catch (error) {
      console.error('Failed to cancel:', error);
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6BA292" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Appointments</Text>

      <FilterBar selected={filter} onSelect={setFilter} />

      {filteredAppointments.length === 0 ? (
        <View style={styles.center}>
          <Text style={{ color: '#777', marginTop: 20 }}>
            No appointments found.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredAppointments}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 30 }}
          renderItem={({ item }) => (
            <AppointmentCard
              appointment={item}
              onCancel={() => handleCancel(item.id)}
              cancelling={cancellingId === item.id}
              format={format}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FDFB',
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FDFB'
  },
});
