import { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { format } from 'date-fns'

export default function MyAppointmentsScreen() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  // Real-time appointments listener with filtering
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
            const data = snapshot.docs.map(doc => {
              const docData = doc.data();

              // Safe timestamp conversion
              const convertTimestamp = (timestamp) => {
                if (timestamp?.toDate) {
                  return timestamp.toDate();
                }
                // Handle cases where date might be stored as string
                if (typeof timestamp === 'string') {
                  return new Date(timestamp);
                }
                return null;
              };

              return {
                id: doc.id,
                ...docData,
                date: convertTimestamp(docData.date),
                createdAt: convertTimestamp(docData.createdAt),
                updatedAt: convertTimestamp(docData.updatedAt),
                // Add fallback dates if needed
                displayDate: docData.date
                  ? convertTimestamp(docData.date)
                  : new Date(), // Fallback to current date
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

  const filteredAppointments = appointments.filter(appointment => {
    if (filter === 'all') return true;
    return appointment.status === filter;
  });

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size='large' color='#6BA292' />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>My Appointments</Text> */}

      {/* Filters */}
      <View style={styles.filterContainer}>
        {['all', 'pending', 'accepted', 'completed'].map(status => (
          <TouchableOpacity
            key={status}
            style={[
              styles.filterButton,
              filter === status && styles.activeFilterButton
            ]}
            onPress={() => setFilter(status)}
          >
            <Text style={filter === status ? styles.activeFilterText : styles.filterText}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      {filteredAppointments.length === 0 ? (
        <View style={styles.center}>
          <Text style={{ color: '#666', marginTop: 20 }}>No appointments found.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredAppointments}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
    <Text style={styles.expertName}>{item.expertName}</Text>
    <Text style={styles.dateText}>
      📅 {item.date ? format(item.date, 'MMMM do, yyyy') : 'No date'} at {item.time}
    </Text>
    <Text style={styles.statusText}>
      Status: {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
    </Text>
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
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    flexWrap: 'wrap',
    gap: 8,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#6BA292',
    marginHorizontal: 5,
    marginBottom: 8,
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
  expertName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    color: '#333',
  },
  dateText: {
    fontSize: 14,
    marginBottom: 4,
    color: '#555',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    color: '#6BA292',
  },
});
