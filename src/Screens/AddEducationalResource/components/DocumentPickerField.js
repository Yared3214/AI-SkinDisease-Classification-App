import React from "react";
import { TouchableOpacity, Text, StyleSheet, Alert, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import DocumentPicker from "react-native-document-picker";

const DocumentPickerField = ({ document, setDocument, error }) => {
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.pdf],
      });

      if (result?.uri) {
        setDocument(result);
        console.log("Selected document:", result);
      }
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        console.log("User canceled document picker");
      } else {
        console.error("Error picking document:", error);
        Alert.alert("Something went wrong.");
      }
    }
  };

  return (
    <>
      <TouchableOpacity
        style={[
          styles.uploadButton,
          error && { borderColor: "red" },
          document && { backgroundColor: "#E8F6F3" },
        ]}
        onPress={pickDocument}
      >
        <Ionicons name="document-attach-outline" size={22} color="#6BA292" />
        <Text style={styles.uploadButtonText}>
          {document ? "Change Document" : "Upload Certification (PDF)"}
        </Text>
      </TouchableOpacity>

      {/* 👇 Show document details if uploaded */}
      {document && (
        <View style={styles.fileInfoContainer}>
          <Ionicons name="document-text-outline" size={20} color="#006666" />
          <View style={{ flex: 1 }}>
            <Text style={styles.fileName} numberOfLines={1}>
              {document.name || "Uploaded Document"}
            </Text>
            {document.size && (
              <Text style={styles.fileSize}>
                {(document.size / 1024).toFixed(1)} KB
              </Text>
            )}
          </View>
        </View>
      )}

      {error && <Text style={styles.errorText}>{error}</Text>}
    </>
  );
};

const styles = StyleSheet.create({
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    backgroundColor: "#FFF",
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#6BA292",
  },
  uploadButtonText: {
    color: "#6BA292",
    fontSize: 16,
    marginLeft: 8,
    fontWeight: "500",
  },
  fileInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    backgroundColor: "#F1FAF8",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#CCE8E2",
  },
  fileName: {
    color: "#006666",
    fontSize: 14,
    fontWeight: "bold",
  },
  fileSize: {
    color: "#666",
    fontSize: 12,
  },
  errorText: {
    color: "red",
    fontSize: 13,
    marginTop: 2,
  },
});

export default DocumentPickerField;
