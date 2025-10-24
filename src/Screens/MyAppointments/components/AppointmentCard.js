import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { format } from 'date-fns';

export default function AppointmentCard({ appointment, onCancel, cancelling }) {
  const handleCancelPress = () => {
    Alert.alert(
      'Cancel Appointment',
      'Are you sure you want to cancel this appointment?',
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes, Cancel', style: 'destructive', onPress: onCancel },
      ]
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.expertName}>{appointment.expertName}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(appointment.status) },
          ]}
        >
          <Text style={styles.statusText}>
            {appointment.status.charAt(0).toUpperCase() +
              appointment.status.slice(1)}
          </Text>
        </View>
      </View>

      <Text style={styles.dateText}>
        📅 {appointment.date ? format(appointment.date, 'MMMM do, yyyy') : 'No date'}
      </Text>
      <Text style={styles.timeText}>🕒 {appointment.time || 'N/A'}</Text>

      {appointment.status === 'pending' && (
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={handleCancelPress}
          disabled={cancelling}
        >
          {cancelling ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.cancelButtonText}>Cancel Appointment</Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

function getStatusColor(status) {
  switch (status) {
    case 'pending':
      return '#FFD54F';
    case 'accepted':
      return '#81C784';
    case 'completed':
      return '#64B5F6';
    case 'cancelled':
      return '#E57373';
    default:
      return '#BDBDBD';
  }
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expertName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  statusBadge: {
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  statusText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  dateText: {
    fontSize: 14,
    marginTop: 10,
    color: '#555',
  },
  timeText: {
    fontSize: 14,
    color: '#555',
    marginTop: 2,
  },
  cancelButton: {
    marginTop: 16,
    backgroundColor: '#E57373',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
