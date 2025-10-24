import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import firestore from "@react-native-firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import auth from "@react-native-firebase/auth";

const HistoryScreen = () => {
  const navigation = useNavigation();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const user = auth().currentUser;
    if (user) setUserId(user.uid);
  }, []);

  useEffect(() => {
    if (!userId) return;
    const unsubscribe = firestore()
      .collection("history")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .onSnapshot(
        (snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setHistory(data);
          setLoading(false);
        },
        (err) => {
          setLoading(false);
        }
      );
    return () => unsubscribe();
  });

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("history-detail", { history: item })
      }
    >
      <Image
        source={{ uri: item.imageUri }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={{ flex: 1, marginLeft: 15 }}>
        <Text style={styles.condition}>
          {item.mainCondition}
        </Text>
        <Text style={styles.confidence}>
          Confidence: {(item.mainConditionConfidence * 100).toFixed(2)}%
        </Text>
        <Text style={styles.date}>
          {item.createdAt?.toDate
            ? item.createdAt.toDate().toLocaleString()
            : ""}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6BA292" />
      </View>
    );
  }

  if (!history.length) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>No analysis history found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Analysis History</Text>
      <FlatList
        data={history}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 30 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FDFB', paddingTop: 16, paddingHorizontal: 10 },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#6BA292",
    marginBottom: 16,
    alignSelf: "center",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#f4f4f4",
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  image: { width: 70, height: 70, borderRadius: 10, backgroundColor: "#eaeaea" },
  condition: { fontSize: 16, fontWeight: "bold", color: "#333" },
  confidence: { fontSize: 13, color: "#666", marginTop: 2 },
  date: { fontSize: 12, color: "#999", marginTop: 4 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: '#F8FDFB' },
  emptyText: { fontSize: 16, color: "#666" },
});

export default HistoryScreen;