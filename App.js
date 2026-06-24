import React, { useState } from "react";
import { SafeAreaView, StatusBar, StyleSheet } from "react-native";
import GameEvidenceScreen from "./src/screens/GameEvidenceScreen";

export default function App() {
  const [submissionResult, setSubmissionResult] = useState(null);
  const [submissionMode, setSubmissionMode] = useState("placeholder");

  function handleSubmissionComplete({ result, mode }) {
    setSubmissionResult(result);
    setSubmissionMode(mode);
  }

  function handleReset() {
    setSubmissionResult(null);
    setSubmissionMode("placeholder");
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <GameEvidenceScreen
        result={submissionResult}
        submissionMode={submissionMode}
        onSubmissionComplete={handleSubmissionComplete}
        onReset={handleReset}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111111",
  },
});
