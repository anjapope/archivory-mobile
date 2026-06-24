import React from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";

export default function EvidenceForm({
  notes,
  objectLocation,
  onChangeNotes,
  onChangeLocation,
  onSubmit,
  submitDisabled,
  submitLabel,
}) {
  return (
    <View>
      <TextInput
        style={styles.input}
        placeholder="Where was this object found or viewed?"
        placeholderTextColor="#666666"
        value={objectLocation}
        onChangeText={onChangeLocation}
      />

      <TextInput
        style={[styles.input, styles.notes]}
        placeholder="Add observations, clues, or evidence notes..."
        placeholderTextColor="#666666"
        value={notes}
        onChangeText={onChangeNotes}
        multiline
      />

      <Text style={styles.helperText}>
        Image upload placeholder: this captured image will be sent with the
        evidence record when a live API URL is configured.
      </Text>

      <Button
        title={submitLabel}
        onPress={onSubmit}
        disabled={submitDisabled}
        color="#f28c28"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#f4f4f4",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    fontSize: 16,
  },
  notes: {
    height: 120,
    textAlignVertical: "top",
  },
  helperText: {
    color: "#c7c7c7",
    marginBottom: 12,
    lineHeight: 18,
  },
});
