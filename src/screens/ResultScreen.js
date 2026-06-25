import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";

export default function ResultScreen({
  result,
  submissionMode,
  gameSubmissionMode,
  gameSubmissionMessage,
  gameSubmitting,
  onSubmitResultToGame,
  onReset,
}) {
  const placeholderMode = submissionMode === "placeholder";
  const gamePlaceholderMode = gameSubmissionMode === "placeholder";

  return (
    <View style={styles.resultBox}>
      <Text style={styles.resultTitle}>Database Submission Result</Text>
      <Text style={styles.resultText}>Material: {result.predictedMaterial}</Text>
      <Text style={styles.resultText}>Object type: {result.objectType}</Text>
      <Text style={styles.resultText}>Confidence: {result.confidence}</Text>
      <Text style={styles.resultText}>
        Evidence points: {result.pointsAwarded}
      </Text>
      <Text style={styles.resultText}>Notes summary: {result.summary}</Text>
      <Text style={styles.modeText}>
        {placeholderMode
          ? "Showing placeholder submission data until live database storage is configured."
          : "Showing live response returned from the ArchIvory submission API."}
      </Text>
      <Text style={styles.gameLabel}>Interactive Digital Exhibition Game</Text>
      <Button
        title={
          gameSubmitting
            ? "Submitting to game..."
            : "Submit to Interactive Digital Exhibition Game"
        }
        onPress={onSubmitResultToGame}
        color="#f28c28"
        disabled={gameSubmitting}
      />
      {gameSubmissionMessage ? (
        <Text style={styles.gameStatusText}>
          {gamePlaceholderMode ? "Placeholder mode: " : "Live mode: "}
          {gameSubmissionMessage}
        </Text>
      ) : null}
      <View style={styles.spacer} />
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
  gameLabel: {
    color: "#f4f4f4",
    fontWeight: "700",
    marginBottom: 10,
  },
  gameStatusText: {
    color: "#c7c7c7",
    marginTop: 10,
    lineHeight: 18,
  },
  spacer: {
    height: 12,
  },
});
