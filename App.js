import React, { useState } from "react";
import { SafeAreaView, StatusBar, StyleSheet } from "react-native";
import WelcomeScreen from "./src/screens/WelcomeScreen";
import CreateAccountScreen from "./src/screens/CreateAccountScreen";
import HomeScreen from "./src/screens/HomeScreen";
import { continueAsGuest, signIn, signUp } from "./src/services/auth";
import { submitResultToInteractiveGame } from "./src/services/api";

export default function App() {
  const [authScreen, setAuthScreen] = useState("welcome");
  const [authSession, setAuthSession] = useState(null);
  const [authMode, setAuthMode] = useState("placeholder");
  const [submissionResult, setSubmissionResult] = useState(null);
  const [submissionPhotoUri, setSubmissionPhotoUri] = useState(null);
  const [accountCollection, setAccountCollection] = useState([]);
  const [guestSessionScans, setGuestSessionScans] = useState([]);
  const [submissionMode, setSubmissionMode] = useState("placeholder");
  const [gameSubmissionMode, setGameSubmissionMode] = useState("placeholder");
  const [gameSubmissionMessage, setGameSubmissionMessage] = useState("");
  const [gameSubmitting, setGameSubmitting] = useState(false);

  async function handleSignIn(credentials) {
    const { session, mode } = await signIn(credentials);
    setAuthSession(session);
    setAuthMode(mode);
  }

  async function handleSignUp(credentials) {
    const { session, mode } = await signUp(credentials);
    setAuthSession(session);
    setAuthMode(mode);
  }

  function handleGuestAccess() {
    const { session, mode } = continueAsGuest();
    setAuthSession(session);
    setAuthMode(mode);
  }

  function handleSignOut() {
    setAuthSession(null);
    setAuthScreen("welcome");
    setAuthMode("placeholder");
    setSubmissionResult(null);
    setSubmissionPhotoUri(null);
    setAccountCollection([]);
    setGuestSessionScans([]);
    setSubmissionMode("placeholder");
    setGameSubmissionMode("placeholder");
    setGameSubmissionMessage("");
    setGameSubmitting(false);
  }

  function handleSubmissionComplete({ result, mode, photoUri, saveToAccount }) {
    setSubmissionResult(result);
    setSubmissionPhotoUri(photoUri || null);
    setSubmissionMode(mode);

    const submissionEntry = {
      id: `SUB-${Date.now()}`,
      objectType: result?.objectType || "Unclassified artifact",
      predictedMaterial: result?.predictedMaterial || "Awaiting AI backend",
      confidence: result?.confidence || "placeholder",
      pointsAwarded:
        typeof result?.pointsAwarded === "number" ? result.pointsAwarded : null,
      summary: result?.summary || "",
      mode,
      photoUri: photoUri || null,
      submittedAtLabel: new Date().toLocaleDateString(),
    };

    if (authSession?.mode === "guest") {
      setGuestSessionScans((previousEntries) => [
        submissionEntry,
        ...previousEntries,
      ]);
    } else if (saveToAccount) {
      setAccountCollection((previousEntries) => [
        submissionEntry,
        ...previousEntries,
      ]);
    }

    setGameSubmissionMode("placeholder");
    setGameSubmissionMessage("");
  }

  function handleReset() {
    setSubmissionResult(null);
    setSubmissionPhotoUri(null);
    setSubmissionMode("placeholder");
    setGameSubmissionMode("placeholder");
    setGameSubmissionMessage("");
    setGameSubmitting(false);
  }

  function handleDeleteCollectionEntry(entryId) {
    if (!entryId) {
      return;
    }

    if (authSession?.mode === "guest") {
      setGuestSessionScans((previousEntries) =>
        previousEntries.filter((entry) => entry.id !== entryId)
      );
      return;
    }

    setAccountCollection((previousEntries) =>
      previousEntries.filter((entry) => entry.id !== entryId)
    );
  }

  async function handleSubmitResultToGame() {
    if (!submissionResult) {
      return;
    }

    setGameSubmitting(true);

    try {
      const response = await submitResultToInteractiveGame({
        result: submissionResult,
        photoUri: submissionPhotoUri,
        authSession,
      });

      setGameSubmissionMode(response.mode);
      setGameSubmissionMessage(response.message);
    } catch (error) {
      setGameSubmissionMode("placeholder");
      setGameSubmissionMessage(
        error?.message === "invalid-api-url" ||
          error?.message === "invalid-api-url-format"
          ? "Set EXPO_PUBLIC_ARCHIVORY_GAME_API_URL to a valid endpoint for live game submission."
          : "Could not submit to Interactive Digital Exhibition Game. Try again later."
      );
    } finally {
      setGameSubmitting(false);
    }
  }

  const collectionEntries =
    authSession?.mode === "guest" ? guestSessionScans : accountCollection;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      {authSession ? (
        <HomeScreen
          authSession={authSession}
          authMode={authMode}
          result={submissionResult}
          submissionMode={submissionMode}
          gameSubmissionMode={gameSubmissionMode}
          gameSubmissionMessage={gameSubmissionMessage}
          gameSubmitting={gameSubmitting}
          submissionHistory={collectionEntries}
          onDeleteCollectionEntry={handleDeleteCollectionEntry}
          onSubmissionComplete={handleSubmissionComplete}
          onSubmitResultToGame={handleSubmitResultToGame}
          onReset={handleReset}
          onSignOut={handleSignOut}
        />
      ) : authScreen === "create-account" ? (
        <CreateAccountScreen
          onCreateAccount={handleSignUp}
          onBack={() => setAuthScreen("welcome")}
        />
      ) : (
        <WelcomeScreen
          onSignIn={handleSignIn}
          onCreateAccountPress={() => setAuthScreen("create-account")}
          onGuestAccess={handleGuestAccess}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111111",
  },
});
