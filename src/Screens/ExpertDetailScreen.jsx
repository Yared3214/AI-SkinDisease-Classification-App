import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, ScrollView, Linking } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useNavigation, useRoute } from '@react-navigation/native';

const ExpertDetailScreen = () => {
  const { params: { expert } } = useRoute();
  const navigation = useNavigation();
  const [reason, setReason] = useState('');

  const handleApprove = async () => {
  try {
    const userRef = firestore().collection('users').doc(expert.id);
    await userRef.update({ role: 'expert' });

    await firestore().collection('experts').doc(expert.id).delete();

    Alert.alert('Success', 'Expert approved.');
    navigation.goBack();
  } catch (err) {
    console.error('Approve Error:', err);
    Alert.alert('Error', 'Failed to approve expert.');
  }
};

const handleReject = async () => {
  if (!reason.trim()) {
    Alert.alert('Missing Reason', 'Please enter a reason for rejection.');
    return;
  }

  try {
    await firestore().collection('experts').doc(expert.id).delete();

    await firestore().collection('users').doc(expert.id).update({
      rejectionReason: reason,
      role: 'user', // retain role as 'user'
    });

    Alert.alert('Rejected', 'Expert application has been rejected.');
    navigation.goBack();
  } catch (err) {
    console.error('Reject Error:', err);
    Alert.alert('Error', 'Failed to reject expert.');
  }
};


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Expert Details</Text>
      <View style={styles.detailCard}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{expert.name}</Text>

        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{expert.email}</Text>

        <Text style={styles.label}>License Number:</Text>
        <Text style={styles.value}>{expert.licenseNumber}</Text>

        <Text style={styles.label}>Qualifications:</Text>
        <Text style={styles.value}>{expert.qualifications}</Text>

        <Text style={styles.label}>Workplace:</Text>
        <Text style={styles.value}>{expert.workplace}</Text>

        <Text style={styles.label}>Certification Document:</Text>
        <TouchableOpacity onPress={() => Linking.openURL(expert.document)}>
          <Text style={[styles.value, { color: '#007bff', textDecorationLine: 'underline' }]}>
            View Certification Document
          </Text>
        </TouchableOpacity>

        <Text style={styles.label}>Rejection Reason (if any):</Text>
        <TextInput
          placeholder="Enter reason for rejection..."
          style={styles.input}
          value={reason}
          onChangeText={setReason}
        />

        <View style={styles.buttonGroup}>
          <TouchableOpacity style={styles.approveButton} onPress={handleApprove}>
            <Text style={styles.buttonText}>Approve</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.rejectButton} onPress={handleReject}>
            <Text style={styles.buttonText}>Reject</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default ExpertDetailScreen;

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#F4FAFA', flexGrow: 1 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  detailCard: { backgroundColor: '#fff', borderRadius: 12, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#555', marginTop: 10 },
  value: { fontSize: 16, color: '#333' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginTop: 5 },
  buttonGroup: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  approveButton: { backgroundColor: '#4CAF50', padding: 12, borderRadius: 8, flex: 1, marginRight: 10 },
  rejectButton: { backgroundColor: '#E53935', padding: 12, borderRadius: 8, flex: 1 },
  buttonText: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },
});
