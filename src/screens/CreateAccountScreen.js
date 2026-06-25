import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function CreateAccountScreen({ onCreateAccount, onBack }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [creating, setCreating] = useState(false);

  async function handleCreateAccount() {
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert("Missing details", "Complete all fields to create an account.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Password mismatch", "Passwords must match.");
      return;
    }

    setCreating(true);

    try {
      await onCreateAccount({ email: email.trim(), password: password.trim() });
    } catch (error) {
      Alert.alert(
        "Account setup unavailable",
        error?.message === "invalid-auth-api-url" ||
        error?.message === "invalid-auth-api-url-format"
          ? "Set EXPO_PUBLIC_ARCHIVORY_AUTH_API_URL to a valid auth endpoint to enable live registration."
          : "The account service is not reachable right now. Placeholder account creation remains active until backend hookup."
      );
    } finally {
      setCreating(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Image
          source={require("../../assets/Archivory Logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Create account</Text>
        <Text style={styles.subtitle}>
          Set up your ArchIvory account profile. Backend hookup will make this
          persistent.
        </Text>
      </View>

      <View style={styles.card}>
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

        <TextInput
          autoCapitalize="none"
          autoComplete="password"
          placeholder="Confirm password"
          placeholderTextColor="#8f8f8f"
          secureTextEntry
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <Pressable
          style={styles.primaryButton}
          onPress={handleCreateAccount}
          disabled={creating}
        >
          <Text style={styles.primaryButtonText}>Create account</Text>
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={onBack}
          disabled={creating}
        >
          <Text style={styles.secondaryButtonText}>Back to sign in</Text>
        </Pressable>

        {creating ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator color="#f28c28" />
            <Text style={styles.loadingText}>Creating account session...</Text>
          </View>
        ) : null}
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
  secondaryButton: {
    borderColor: "#f28c28",
    borderWidth: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  secondaryButtonText: {
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
});
