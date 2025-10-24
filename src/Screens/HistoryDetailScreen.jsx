import React from "react";
import ImageAnalysisResultsScreen from "../Screens/ResultScreen";
import { useRoute } from "@react-navigation/native";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// This screen simply passes the history object as params to ImageAnalysisResultsScreen
const HistoryDetailScreen = () => {
  const route = useRoute();
  // history object contains all relevant details (imageUri, mainCondition, etc.)
  const { history } = route.params || {};

  // Build the same "result" structure as expected by ImageAnalysisResultsScreen
  const result = {
    predictions: history?.predictions || [],
  };

  // Pass all needed props to ImageAnalysisResultsScreen
  return (
    <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.header}>Image Analysis Results</Text>
    
          <Image source={{ uri: history.imageUri }} style={styles.uploadedImage} />
          <Text style={styles.imageLabel}>Uploaded Image</Text>
    
          <Text style={styles.infoText}>
            These results are for informational purposes only. Consult a dermatologist for a detailed diagnosis.
          </Text>
    
          {history.mainCondition && (
            <View style={styles.resultBox}>
              <Text style={styles.conditionTitle}>
                Condition Detected: <Text style={styles.highlight}>{history.mainCondition}</Text>
              </Text>
              <Text style={styles.confidence}>
                Confidence: {(history.mainConditionConfidence * 100).toFixed(2)}%
              </Text>
              <Text style={styles.description}>
                {history.mainCondition.label} may require further medical assessment. This prediction is based on AI analysis.
              </Text>
    
              <Text style={styles.subTitle}>Symptoms</Text>
              {history.symptoms.map((symp, idx) => (
                <Text key={idx} style={styles.listItem}>• {symp}</Text>
              ))}
    
              <Text style={styles.subTitle}>Additional Insights</Text>
              {history.otherConditions?.map((item, idx) => (
                <View key={idx} style={styles.insight}>
                  <Text style={styles.insightText}>{item.label}</Text>
                  <Text style={styles.confidence}>
                    Confidence: {(item.prob * 100).toFixed(2)}%
                  </Text>
                </View>
              ))}
            </View>
          )}
    
          <View style={styles.resultBox}>
            <Text style={styles.subTitle}>Recommended Actions</Text>
            {history.recommendedActions.map((action, idx) => (
              <Text key={idx} style={styles.listItem}>• {action}</Text>
            ))}
          </View>
        </ScrollView>
      );
    };
    
    const styles = StyleSheet.create({
      container: { padding: 20, backgroundColor: '#F8FDFB' },
      header: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, textAlign: 'center', color: '#6BA292' },
      uploadedImage: { width: '100%', height: 200, borderRadius: 10, marginBottom: 5 },
      imageLabel: { textAlign: 'center', color: '#555', marginBottom: 10 },
      infoText: { textAlign: 'center', color: '#777', marginBottom: 15 },
    
      resultBox: { backgroundColor: '#f9f9f9', padding: 15, borderRadius: 10, marginBottom: 15 },
      conditionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 5, color: '#6BA292'},
      highlight: { color: '#007bff' },
      confidence: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 5 },
      description: { color: '#555', marginBottom: 10 },
      subTitle: { fontSize: 15, fontWeight: 'bold', marginTop: 10, marginBottom: 5, color: '#6BA292' },
      insight: { flexDirection: 'column', paddingVertical: 5, paddingLeft: 20 },
      insightText: { fontSize: 14, fontWeight: '500', paddingBottom: 10, color: '#007bff' },
      listItem: { fontSize: 14, color: '#555', paddingVertical: 2 },
      linkText: { color: '#007bff', fontSize: 14, marginVertical: 5 },
    
      buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
      saveButton: { flex: 1, backgroundColor: '#6BA292', padding: 12, borderRadius: 5, marginRight: 5, alignItems: 'center' },
      scheduleButton: { flex: 1, backgroundColor: '#e0e0e0', padding: 12, borderRadius: 5, marginLeft: 5, alignItems: 'center' },
      buttonText: { color: '#fff', fontWeight: 'bold' },
      scheduleButtonText: { color: '#333', fontWeight: 'bold' },
    });
    

export default HistoryDetailScreen;