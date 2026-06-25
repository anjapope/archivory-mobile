import React from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import CaptureScreen from "./CaptureScreen";
import ResultScreen from "./ResultScreen";

export default function GameEvidenceScreen({
  authSession,
  result,
  submissionMode,
  gameSubmissionMode,
  gameSubmissionMessage,
  gameSubmitting,
  onSubmissionComplete,
  onSubmitResultToGame,
  onReset,
  onBackToDashboard,
}) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.brandRow}>
        <Pressable onPress={onBackToDashboard} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Home</Text>
        </Pressable>
        <Image
          source={require("../../assets/Archivory Logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.brandTextBlock}>
          <Text style={styles.header}>ArchIvory Evidence Capture</Text>
          <Text style={styles.subheader}>Artifact intake and exhibition evidence</Text>
          <Text style={styles.accessBadge}>
            {authSession.mode === "guest" ? "Guest access" : "Signed in"}
          </Text>
        </View>
      </View>

      {result ? (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ResultScreen
            result={result}
            submissionMode={submissionMode}
            gameSubmissionMode={gameSubmissionMode}
            gameSubmissionMessage={gameSubmissionMessage}
            gameSubmitting={gameSubmitting}
            onSubmitResultToGame={onSubmitResultToGame}
            onReset={onReset}
          />
        </ScrollView>
      ) : (
        <View style={styles.captureContent}>
          <CaptureScreen
            authSession={authSession}
            onSubmissionComplete={onSubmissionComplete}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#111111",
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 12,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#1f4d4e",
  },
  backButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
  },
  backButtonText: {
    color: "#f28c28",
    fontSize: 12,
    fontWeight: "700",
  },
  brandTextBlock: {
    flex: 1,
  },
  logo: {
    width: 36,
    height: 36,
  },
  header: {
    color: "#f28c28",
    fontSize: 17,
    fontWeight: "700",
  },
  subheader: {
    color: "#c7c7c7",
    fontSize: 12,
    lineHeight: 16,
  },
  accessBadge: {
    alignSelf: "flex-start",
    marginTop: 4,
    color: "#111111",
    backgroundColor: "#f28c28",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    overflow: "hidden",
    fontSize: 11,
    fontWeight: "700",
  },
  captureContent: {
    flex: 1,
    justifyContent: "center",
  },
  scrollContent: {
    padding: 20,
  },
});
