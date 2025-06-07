// import React, { useEffect, useState } from 'react';
// import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
// import firestore from '@react-native-firebase/firestore';
// import { useNavigation } from '@react-navigation/native';

// const VerifyExpertsScreen = () => {
//   const [pendingExperts, setPendingExperts] = useState([]);
//   const navigation = useNavigation();

//   useEffect(() => {
//   const fetchPendingExperts = async () => {
//     try {
//       const expertSnapshot = await firestore().collection('experts').get();

//       const enrichedExperts = await Promise.all(
//         expertSnapshot.docs.map(async (expertDoc) => {
//           const expertData = expertDoc.data();

//           const userDoc = await firestore().collection('users').doc(expertDoc.id).get();
//           const userData = userDoc.exists ? userDoc.data() : {};

//           return {
//             id: expertDoc.id,
//             ...expertData,
//             name: userData.name || 'N/A',
//             email: userData.email || 'N/A',
//           };
//         })
//       );

//       setPendingExperts(enrichedExperts);
//     } catch (error) {
//       console.error('Error fetching pending experts:', error);
//     }
//   };

//   fetchPendingExperts();
// }, []);


//   const handleSelectExpert = (expert) => {
//     navigation.navigate("expert-detail", { expert });
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Verify Expert Requests</Text>
//       <FlatList
//         data={pendingExperts}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <TouchableOpacity style={styles.card} onPress={() => handleSelectExpert(item)}>
//             <Text style={styles.cardTitle}>{item.name}</Text>
//             <Text style={styles.cardSubtitle}>{item.email}</Text>
//           </TouchableOpacity>
//         )}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//     container: { flex: 1, padding: 20, backgroundColor: '#F5F5F5' },
//     title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
//     card: {
//       backgroundColor: '#fff',
//       padding: 15,
//       borderRadius: 10,
//       marginBottom: 12,
//       shadowColor: '#000',
//       shadowOffset: { width: 0, height: 2 },
//       shadowOpacity: 0.1,
//       shadowRadius: 5,
//       elevation: 3,
//     },
//     cardTitle: { fontSize: 18, fontWeight: 'bold' },
//     cardSubtitle: { fontSize: 14, color: '#666' },
//   });

// export default VerifyExpertsScreen;


import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const VerifyExpertsScreen = () => {
  const [pendingExperts, setPendingExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchPendingExperts = async () => {
      try {
        const expertSnapshot = await firestore().collection('experts').get();

        const enrichedExperts = await Promise.all(
          expertSnapshot.docs.map(async (expertDoc) => {
            const expertData = expertDoc.data();
            const userDoc = await firestore().collection('users').doc(expertDoc.id).get();
            const userData = userDoc.exists ? userDoc.data() : {};

            return {
              id: expertDoc.id,
              ...expertData,
              name: userData?.name || 'N/A',
              email: userData?.email || 'N/A',
            };
          })
        );

        setPendingExperts(enrichedExperts);
      } catch (error) {
        console.error('Error fetching pending experts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingExperts();
  });

  const handleSelectExpert = (expert) => {
    navigation.navigate('expert-detail', { expert });
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#006666" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Expert Verification</Text>
      <Text style={styles.subtitle}>Tap on an expert to review and verify their credentials</Text>
      <FlatList
        data={pendingExperts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => handleSelectExpert(item)}>
            <View style={styles.cardHeader}>
              <Image
                source={require('../../assets/avatar-placeholder.png')}
                style={styles.avatar}
              />
              <View>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardSubtitle}>{item.email}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No pending experts to verify.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4FAFA',
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4FAFA',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003333',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#eee',
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#777',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 30,
  },
});

export default VerifyExpertsScreen;
