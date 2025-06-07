import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';

const DISEASE_CLASSES = [
  "Actinic keratoses (akiec)",
  "Basal cell carcinoma (bcc)",
  "Benign keratosis-like lesions (bkl)",
  "Dermatofibroma (df)",
  "Melanocytic Nevi (nv)",
  "Melanoma (mel)",
  "Vascular lesions (vasc)",
];

const ImageAnalysisResultsScreen = () => {
  const route = useRoute();
  const { imageUri, result } = route.params || {};

  const topPredictions = result?.predictions
    ?.map((prob, index) => ({ label: DISEASE_CLASSES[index], prob }))
    .sort((a, b) => b.prob - a.prob)
    .slice(0, 3);

  const mainCondition = topPredictions?.[0];
  const otherConditions = topPredictions?.slice(1);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Image Analysis Results</Text>

      <Image source={{ uri: imageUri }} style={styles.uploadedImage} />
      <Text style={styles.imageLabel}>Uploaded Image</Text>

      <Text style={styles.infoText}>
        These results are for informational purposes only. Consult a dermatologist for a detailed diagnosis.
      </Text>

      {mainCondition && (
        <View style={styles.resultBox}>
          <Text style={styles.conditionTitle}>
            Condition Detected: <Text style={styles.highlight}>{mainCondition.label}</Text>
          </Text>
          <Text style={styles.confidence}>
            Confidence: {(mainCondition.prob * 100).toFixed(2)}%
          </Text>
          <Text style={styles.description}>
            {/* You can optionally load a description per disease */}
            {mainCondition.label} may require further medical assessment. This prediction is based on AI analysis.
          </Text>

          <Text style={styles.subTitle}>Additional Insights</Text>
          {otherConditions?.map((item, idx) => (
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
        <Text style={styles.listItem}>• Consult a dermatologist</Text>
        <Text style={styles.listItem}>• Avoid self-medication</Text>
        <Text style={styles.listItem}>• Monitor the lesion for changes</Text>

        <Text style={styles.subTitle}>Helpful Resources</Text>
        <TouchableOpacity>
          <Text style={styles.linkText}>Read more about {mainCondition?.label}</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.linkText}>Watch a dermatologist explainer video</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.buttonText}>Save Report</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.scheduleButton}>
          <Text style={styles.scheduleButtonText}>Schedule Consultation</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff' },
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

export default ImageAnalysisResultsScreen;
