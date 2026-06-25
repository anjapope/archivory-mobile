import React, { useState } from "react";
import {
  Alert,
  Image,
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function WelcomeScreen({
  onSignIn,
  onCreateAccountPress,
  onGuestAccess,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  async function runAuthAction(authAction) {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Missing details", "Enter an email and password to continue.");
      return;
    }

    setAuthLoading(true);

    try {
      await authAction({ email: email.trim(), password: password.trim() });
    } catch (error) {
      Alert.alert(
        "Account setup unavailable",
        error?.message === "invalid-auth-api-url" ||
        error?.message === "invalid-auth-api-url-format"
          ? "Set EXPO_PUBLIC_ARCHIVORY_AUTH_API_URL to a valid auth endpoint to enable live account login and registration."
          : "The account service is not reachable right now. Placeholder auth remains active until backend hookup."
      );
    } finally {
      setAuthLoading(false);
    }
  }

  function handleSignIn() {
    runAuthAction(onSignIn);
  }

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Image
          source={require("../../assets/Archivory Logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Welcome to ArchIvory</Text>
        <Text style={styles.subtitle}>
          Capture artifacts, submit evidence, and explore the museum experience.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Sign in</Text>
        <TextInput
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          placeholder="Email address"
          placeholderTextColor="#8f8f8f"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          autoCapitalize="none"
          autoComplete="password"
          placeholder="Password"
          placeholderTextColor="#8f8f8f"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />

        <Pressable
          style={styles.primaryButton}
          onPress={handleSignIn}
          disabled={authLoading}
        >
          <Text style={styles.primaryButtonText}>Log in</Text>
        </Pressable>

        <Pressable
          style={styles.secondaryAuthButton}
          onPress={onCreateAccountPress}
          disabled={authLoading}
        >
          <Text style={styles.secondaryAuthButtonText}>Create account</Text>
        </Pressable>

        {authLoading ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator color="#f28c28" />
            <Text style={styles.loadingText}>Preparing account session...</Text>
          </View>
        ) : null}

        <Text style={styles.helperText}>
          Account flows are wired with placeholder auth now and ready for live
          API hookup through EXPO_PUBLIC_ARCHIVORY_AUTH_API_URL.
        </Text>
      </View>

      <View style={styles.guestCard}>
        <Text style={styles.guestTitle}>No account?</Text>
        <Text style={styles.guestText}>
          Continue as a guest to start capturing evidence right away.
        </Text>
        <Pressable
          style={styles.secondaryButton}
          onPress={onGuestAccess}
          disabled={authLoading}
        >
          <Text style={styles.secondaryButtonText}>Continue as guest</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111111",
    padding: 24,
    justifyContent: "center",
  },
  hero: {
    alignItems: "center",
    marginBottom: 28,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 18,
  },
  title: {
    color: "#f28c28",
    fontSize: 32,
    fontWeight: "800",
    textAlign: "center",
  },
  subtitle: {
    color: "#d1d1d1",
    textAlign: "center",
    lineHeight: 20,
    marginTop: 10,
    maxWidth: 320,
  },
  card: {
    backgroundColor: "#0f3d3e",
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
  },
  cardTitle: {
    color: "#f4f4f4",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  input: {
    backgroundColor: "#111111",
    color: "#f4f4f4",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#2c2c2c",
  },
  primaryButton: {
    backgroundColor: "#f28c28",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 4,
  },
  primaryButtonText: {
    color: "#111111",
    fontWeight: "800",
    fontSize: 16,
  },
  secondaryAuthButton: {
    borderColor: "#f28c28",
    borderWidth: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  secondaryAuthButtonText: {
    color: "#f28c28",
    fontWeight: "700",
    fontSize: 16,
  },
  loadingRow: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  loadingText: {
    color: "#c7c7c7",
    fontSize: 13,
  },
  helperText: {
    color: "#c7c7c7",
    marginTop: 12,
    lineHeight: 18,
  },
  guestCard: {
    backgroundColor: "#1c1c1c",
    borderRadius: 18,
    padding: 18,
  },
  guestTitle: {
    color: "#f4f4f4",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  guestText: {
    color: "#d1d1d1",
    lineHeight: 20,
    marginBottom: 12,
  },
  secondaryButton: {
    borderColor: "#f28c28",
    borderWidth: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#f28c28",
    fontWeight: "700",
    fontSize: 16,
  },
});