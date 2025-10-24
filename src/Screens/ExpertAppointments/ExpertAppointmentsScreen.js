import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Alert,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { CometChat } from '@cometchat/chat-sdk-react-native';
import FilterTabs from './components/FilterTabs';
import AppointmentCard from './components/AppointmentCard';

const ExpertAppointmentsScreen = () => {
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [completingId, setCompletingId] = useState(null);
  const user = auth().currentUser;

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = firestore().collection('appointments').where('expertId', '==', user.uid).
    onSnapshot(
      (snapshot) => {
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data()}));
        setAppointments(list);
        setLoading(false);
      },
      error => {
        console.error('Error loading appointments:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const filteredAppointments = appointments.filter((a) =>
    filter === 'all' ? true : a.status === filter
  );

  const handleUpdateStatus = async (id, status, patientId, displayDate, time) => {
    try {
      await firestore().collection('appointments').doc(id).update({ status });
      Alert.alert('Success', `Appointment ${status} successfully`);
      setAppointments(prev => prev.filter(a => a.id !== id));

      if (status === 'accepted' && patientId) {
        const messageText = `✅ Your appointment is confirmed for ${displayDate} at ${time}`;
        const message = new CometChat.TextMessage(patientId, messageText, CometChat.RECEIVER_TYPE.USER);
        await CometChat.sendMessage(message);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update appointment.');
    }
  };

  const handleComplete = async id => {
    setCompletingId(id);
    try {
      await firestore().collection('appointments').doc(id).update({ status: 'completed' });
      Alert.alert('Success', 'Appointment marked as completed.');
      setAppointments(prev => prev.filter(a => a.id !== id));
    } catch (e) {
      Alert.alert('Error', 'Failed to complete appointment.');
    } finally {
      setCompletingId(null);
    }
  };

  const renderItem = ({ item }) => (
    <AppointmentCard
      appointment={item}
      filter={filter}
      onAccept={() => handleUpdateStatus(item.id, 'accepted', item.userId, item.displayDate, item.time)}
      onReject={() => handleUpdateStatus(item.id, 'rejected', item.userId)}
      onComplete={() => handleComplete(item.id)}
      completing={completingId === item.id}
    />
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6BA292" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Appointments</Text>
      <FilterTabs selected={filter} onSelect={setFilter} />

      {filteredAppointments.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>No {filter} appointments.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredAppointments}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingBottom: 30 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FDFB', paddingTop: 50, paddingHorizontal: 16 },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FDFB' },
  emptyText: { color: '#777', fontSize: 16 },
});

export default ExpertAppointmentsScreen;
