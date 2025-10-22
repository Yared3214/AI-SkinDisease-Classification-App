import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import ErrorText from "./ErrorText";

const VideoInputField = ({ value, onChangeText, error }) => {
  return (
    <View style={{ width: "100%" }}>
      <Text style={styles.label}>Video URL</Text>
      <TextInput
        style={[styles.input, error && { borderColor: "red" }]}
        placeholder="Enter YouTube or Video URL"
        placeholderTextColor="#A9A9A9"
        value={value}
        onChangeText={onChangeText}
      />
      <ErrorText error={error} />
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
    backgroundColor: "#F9F9F9",
  },
});

export default VideoInputField;
