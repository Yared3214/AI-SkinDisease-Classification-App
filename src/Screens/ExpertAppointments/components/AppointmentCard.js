import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

export default function AppointmentCard({
  appointment,
  filter,
  onAccept,
  onReject,
  onComplete,
  completing,
}) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.patientName}>
          {appointment.patientName || 'Unnamed Patient'}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(appointment.status) }]}>
          <Text style={styles.statusText}>
            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
          </Text>
        </View>
      </View>

      <Text style={styles.text}>📅 {appointment.displayDate || appointment.date}</Text>
      <Text style={styles.text}>🕒 {appointment.time || 'N/A'}</Text>

      {filter === 'pending' && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#6BA292' }]}
            onPress={onAccept}
          >
            <Text style={styles.buttonText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#E57373' }]}
            onPress={onReject}
          >
            <Text style={styles.buttonText}>Reject</Text>
          </TouchableOpacity>
        </View>
      )}

      {filter === 'accepted' && (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#6BA292', marginTop: 10 }]}
          onPress={onComplete}
          disabled={completing}
        >
          {completing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Mark as Completed</Text>
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
    case 'rejected':
      return '#E57373';
    case 'completed':
      return '#64B5F6';
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
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  patientName: { fontSize: 18, fontWeight: '700', color: '#333' },
  statusBadge: {
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  statusText: { color: '#fff', fontWeight: '600', fontSize: 12 },
  text: { fontSize: 15, color: '#555', marginTop: 6 },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 14 },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
