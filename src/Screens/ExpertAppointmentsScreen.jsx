import { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { CometChat } from '@cometchat/chat-sdk-react-native';

export default function ExpertAppointmentsScreen() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const expert = auth().currentUser;
    if (!expert) {
      setError('No authenticated user found');
      setLoading(false);
      return;
    }

    const unsubscribe = firestore()
      .collection('appointments')
      .where('expertId', '==', expert.uid)
      .where('status', '==', 'pending')
      .onSnapshot(
        (querySnapshot) => {
          try {
            const data = querySnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
              // Convert Firestore timestamps to JS Date objects
              createdAt: doc.data().createdAt?.toDate(),
              updatedAt: doc.data().updatedAt?.toDate()
            }));
            setAppointments(data);
            setError(null);
          } catch (err) {
            console.error('Error processing snapshot:', err);
            setError('Failed to load appointments');
          } finally {
            setLoading(false);
          }
        },
        (err) => {
          console.error('Snapshot error:', err);
          setError('Failed to load appointments');
          setLoading(false);
        }
      );

    return () => unsubscribe();
  }, []);

  const handleResponse = async (appointmentId, action, userId, time, displayDate) => {
    setLoading(true);
    try {
      await firestore()
        .collection('appointments')
        .doc(appointmentId)
        .update({
          status: action,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });

      // Optimistically update UI
      setAppointments(prev => prev.filter(app => app.id !== appointmentId));

      Alert.alert(
        'Success',
        `Appointment ${action} successfully`,
        [{ text: 'OK' }]
      );
      let receiverID = userId;
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
    } catch (error) {
      console.error('Update error:', error);
      Alert.alert(
        'Error', 
        `Failed to ${action} appointment`,
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#6BA292" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pending Appointments</Text>

      {appointments.length === 0 ? (
        <View style={styles.center}>
          <Text style={{ color: '#666', marginTop: 20 }}>No pending appointments.</Text>
        </View>
      ) : (
        <FlatList
          data={appointments}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.clientName}>👤 {item.userName || 'Unknown User'}</Text>
              <Text style={styles.detailText}>📅 {item.date} at {item.time}</Text>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, styles.acceptButton]}
                  onPress={() => handleResponse(item.id, 'accepted', item.userId, item.time, item.displayDate)}
                >
                  <Text style={styles.buttonText}>Accept</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.rejectButton]}
                  onPress={() => handleResponse(item.id, 'rejected')}
                >
                  <Text style={styles.buttonText}>Reject</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 16,
    backgroundColor: '#F8F9FA',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  clientName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    color: '#333',
  },
  detailText: {
    fontSize: 14,
    marginBottom: 12,
    color: '#555',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
