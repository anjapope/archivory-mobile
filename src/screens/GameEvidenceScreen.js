import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import CaptureScreen from "./CaptureScreen";
import ResultScreen from "./ResultScreen";

export default function GameEvidenceScreen({
  result,
  submissionMode,
  onSubmissionComplete,
  onReset,
}) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>ArchIvory Evidence Capture</Text>

      <View style={styles.gameBanner}>
        <Text style={styles.gameTitle}>Digital exhibition evidence mode</Text>
        <Text style={styles.gameText}>
          Game evidence syncing is still a placeholder, but the app already
          shows how many points an artifact submission can award.
        </Text>
      </View>

      {result ? (
        <ResultScreen
          result={result}
          submissionMode={submissionMode}
          onReset={onReset}
        />
      ) : (
        <CaptureScreen onSubmissionComplete={onSubmissionComplete} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#111111",
    minHeight: "100%",
  },
  header: {
    color: "#f28c28",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
  },
  gameBanner: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: "#0f3d3e",
    borderRadius: 12,
  },
  gameTitle: {
    color: "#f28c28",
    fontWeight: "700",
    fontSize: 18,
    marginBottom: 8,
  },
  gameText: {
    color: "#f4f4f4",
    lineHeight: 20,
  },
});
