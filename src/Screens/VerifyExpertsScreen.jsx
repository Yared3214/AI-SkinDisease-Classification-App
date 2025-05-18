import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { collection, getDocs, getDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { FIRESTORE_DB } from '@/FirebaseConfig';

const VerifyExpertsScreen = () => {
  const [pendingExperts, setPendingExperts] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchPendingExperts = async () => {
      const expertSnapshot = await getDocs(collection(FIRESTORE_DB, "expert"));

      const enrichedExperts = await Promise.all(
        expertSnapshot.docs.map(async (expertDoc) => {
          const expertData = expertDoc.data();
          const userDoc = await getDoc(doc(FIRESTORE_DB, "users", expertDoc.id));
          const userData = userDoc.exists() ? userDoc.data() : {};

          return {
            id: expertDoc.id,
            ...expertData,
            name: userData.name || "N/A",
            email: userData.email || "N/A",
          };
        })
      );

      setPendingExperts(enrichedExperts);
    };

    fetchPendingExperts();
  }, []);

  const handleSelectExpert = (expert) => {
    navigation.navigate("expert-detail", { expert });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Expert Requests</Text>
      <FlatList
        data={pendingExperts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => handleSelectExpert(item)}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardSubtitle}>{item.email}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#F5F5F5' },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
    card: {
      backgroundColor: '#fff',
      padding: 15,
      borderRadius: 10,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3,
    },
    cardTitle: { fontSize: 18, fontWeight: 'bold' },
    cardSubtitle: { fontSize: 14, color: '#666' },
  });

export default VerifyExpertsScreen;
