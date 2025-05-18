import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const ImageAnalysisResultsScreen = () => {
  // Sample Image (Replace with dynamic image source)
  const uploadedImage = 'https://via.placeholder.com/300'; // Replace with actual URI

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Image Analysis Results</Text>

      {/* Uploaded Image */}
      <Image source={{ uri: uploadedImage }} style={styles.uploadedImage} />
      <Text style={styles.imageLabel}>Uploaded Image</Text>

      <Text style={styles.infoText}>
        These results are for informational purposes only. Consult a dermatologist for a detailed diagnosis.
      </Text>

      {/* Condition Detected */}
      <View style={styles.resultBox}>
        <Text style={styles.conditionTitle}>Condition Detected: <Text style={styles.highlight}>Eczema</Text></Text>
        <Text style={styles.confidence}>Confidence: 85%</Text>
        <Text style={styles.description}>
          Eczema is a condition characterized by itchy, inflamed skin...
        </Text>

        {/* Additional Insights */}
        <Text style={styles.subTitle}>Additional Insights</Text>
        <View style={styles.insight}>
          <Text style={styles.insightText}>Psoriasis</Text>
          <Text style={styles.confidence}>Confidence: 60%</Text>
        </View>
        <View style={{ borderBottomColor: "#ccc", borderBottomWidth: 1, marginVertical: 10 }} />
        <View style={styles.insight}>
          <Text style={styles.insightText}>Contact Dermatitis</Text>
          <Text style={styles.confidence}>Confidence: 45%</Text>
        </View>
      </View>

      {/* Recommended Actions */}
      <View style={styles.resultBox}>
        <Text style={styles.subTitle}>Recommended Actions</Text>
        <Text style={styles.listItem}>• Consult a dermatologist</Text>
        <Text style={styles.listItem}>• Avoid using harsh soaps</Text>

        <Text style={styles.subTitle}>Helpful Resources</Text>
        <TouchableOpacity>
          <Text style={styles.linkText}>Read more about eczema</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.linkText}>View informational video</Text>
        </TouchableOpacity>
      </View>

      {/* Buttons */}
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
  insight: { flexDirection: 'column', paddingVertical: 5, paddingLeft: '20px' },
  insightText: { fontSize: 14, fontWeight: '500', paddingBottom: '10px', color: '#007bff' },
  listItem: { fontSize: 14, color: '#555', paddingVertical: 2 },
  linkText: { color: '#007bff', fontSize: 14, marginVertical: 5 },

  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  saveButton: { flex: 1, backgroundColor: '#6BA292', padding: 12, borderRadius: 5, marginRight: 5, alignItems: 'center' },
  scheduleButton: { flex: 1, backgroundColor: '#e0e0e0', padding: 12, borderRadius: 5, marginLeft: 5, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  scheduleButtonText: { color: '#333', fontWeight: 'bold' },
});

export default ImageAnalysisResultsScreen;
