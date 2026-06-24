import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";

export default function ResultScreen({ result, submissionMode, onReset }) {
  const placeholderMode = submissionMode === "placeholder";

  return (
    <View style={styles.resultBox}>
      <Text style={styles.resultTitle}>AI Result Placeholder</Text>
      <Text style={styles.resultText}>Material: {result.predictedMaterial}</Text>
      <Text style={styles.resultText}>Object type: {result.objectType}</Text>
      <Text style={styles.resultText}>Confidence: {result.confidence}</Text>
      <Text style={styles.resultText}>
        Evidence points: {result.pointsAwarded}
      </Text>
      <Text style={styles.resultText}>Notes summary: {result.summary}</Text>
      <Text style={styles.modeText}>
        {placeholderMode
          ? "Showing placeholder AI and game data until a live backend is configured."
          : "Showing live response from the ArchIvory submission API."}
      </Text>
      <Button
        title="Capture another artifact"
        onPress={onReset}
        color="#f28c28"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  resultBox: {
    padding: 16,
    backgroundColor: "#0f3d3e",
    borderRadius: 12,
  },
  resultTitle: {
    color: "#f28c28",
    fontWeight: "700",
    fontSize: 20,
    marginBottom: 8,
  },
  resultText: {
    color: "#f4f4f4",
    marginBottom: 6,
  },
  modeText: {
    color: "#c7c7c7",
    marginVertical: 14,
    lineHeight: 18,
  },
});
