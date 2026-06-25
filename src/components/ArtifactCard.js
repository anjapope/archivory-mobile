import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export default function ArtifactCard({ photoUri, photoAspectRatio = 3 / 4 }) {
  return (
    <View style={styles.card}>
      {photoUri ? (
        <Image
          source={{ uri: photoUri }}
          style={[styles.preview, { aspectRatio: photoAspectRatio }]}
          resizeMode="contain"
        />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderTitle}>Artifact image placeholder</Text>
          <Text style={styles.placeholderText}>
            Capture an object with the phone camera to attach it as evidence.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#1c1c1c",
  },
  preview: {
    width: "100%",
    maxHeight: 300,
    alignSelf: "center",
  },
  placeholder: {
    minHeight: 140,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  placeholderTitle: {
    color: "#f28c28",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  placeholderText: {
    color: "#f4f4f4",
    textAlign: "center",
    lineHeight: 20,
  },
});
