import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { CometChat } from '@cometchat/chat-sdk-react-native';

const FILTERS = [
  { key: 'pending', label: 'Pending' },
  { key: 'accepted', label: 'Accepted' },
  { key: 'rejected', label: 'Rejected' },
];

const ExpertAppointmentsScreen = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('pending');
  const [completingId, setCompletingId] = useState(null);

  const user = auth().currentUser;

  useEffect(() => {
    if (!user) {
      setError('No authenticated user found');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    let query = firestore().collection('appointments').where('expertId', '==', user.uid);
    if (filter === 'pending' || filter === 'accepted' || filter === 'rejected') {
      query = query.where('status', '==', filter);
    }
    const unsubscribe = query.onSnapshot(
      snapshot => {
        const list = [];
        snapshot.forEach(doc => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setAppointments(list);
        setLoading(false);
      },
      err => {
        setError('Failed to load appointments');
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [user, filter]);

  const handleUpdateStatus = async (id, status, patientId, displayDate, time) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
    try {
      await firestore().collection('appointments').doc(id).update({ status });
      Alert.alert('Success', `Appointment ${status === 'accepted' ? 'accepted' : status === 'rejected' ? 'rejected' : 'updated'}`);
      if (status === 'accepted' && patientId) {
      let receiverID = patientId;
      let messageText = 'Success, ' + `Appointment booked for ${displayDate} at ${time}`;
      let receiverType = CometChat.RECEIVER_TYPE.USER;
      
      let textMessage = new CometChat.TextMessage(receiverID, messageText, receiverType);
      
      CometChat.sendMessage(textMessage)
        .then(message => {
          console.log('Message sent successfully:', message);
        })
        .catch(error => {
          console.log('Message sending failed with error:', error);
        });
      }
    } catch (e) {
      Alert.alert('Failed to update appointment');
    }
  };

  // NEW: Handle mark as completed
  const handleComplete = async (id) => {
    setCompletingId(id);
    try {
      await firestore().collection('appointments').doc(id).update({ status: 'completed' });
      Alert.alert('Success', 'Appointment marked as completed');
      setAppointments(prev => prev.filter(a => a.id !== id));
    } catch (e) {
      Alert.alert('Failed to complete appointment');
    } finally {
      setCompletingId(null);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.text}>Patient: {item.patientName || item.patientId}</Text>
      <Text style={styles.text}>Date: {item.date}</Text>
      <Text style={styles.text}>Time: {item.time}</Text>
      {filter === 'pending' && (
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#6BA292' }]}
            onPress={() => handleUpdateStatus(item.id, 'accepted', item.userId, item.displayDate, item.time)}
          >
            <Text style={styles.buttonText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#E57373' }]}
            onPress={() => handleUpdateStatus(item.id, 'rejected', item.userId)}
          >
            <Text style={styles.buttonText}>Reject</Text>
          </TouchableOpacity>
        </View>
      )}
      {/* Show "Complete" for accepted appointments */}
      {filter === 'accepted' && (
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#6BA292' }]}
            onPress={() => handleComplete(item.id)}
            disabled={completingId === item.id}
          >
            {completingId === item.id ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Complete</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Filter Buttons */}
      <View style={styles.filterRow}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f.key}
            style={[
              styles.filterButton,
              filter === f.key && styles.activeFilterButton
            ]}
            onPress={() => setFilter(f.key)}
          >
            <Text style={filter === f.key ? styles.activeFilterText : styles.filterText}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {appointments.length === 0 ? (
        <View style={styles.centered}>
          <Text>No {filter} appointments.</Text>
        </View>
      ) : (
        <FlatList
          data={appointments}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  error: { color: 'red', fontSize: 16, margin: 8 },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 18,
    gap: 8,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#6BA292',
    marginHorizontal: 5,
  },
  activeFilterButton: {
    backgroundColor: '#6BA292',
    borderColor: '#6BA292',
  },
  filterText: {
    color: '#6BA292',
    fontWeight: '600',
  },
  activeFilterText: {
    color: '#fff',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  text: { fontSize: 16, marginBottom: 6 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 5,
    marginHorizontal: 4,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default ExpertAppointmentsScreen;