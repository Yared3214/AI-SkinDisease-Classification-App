import React from "react";
import { Text, StyleSheet } from "react-native";

const ErrorText = ({ error }) => {
  if (!error) return null;
  return <Text style={styles.errorText}>{error}</Text>;
};

const styles = StyleSheet.create({
  errorText: {
    color: "red",
    fontSize: 13,
    marginTop: 4,
  },
});

export default ErrorText;
