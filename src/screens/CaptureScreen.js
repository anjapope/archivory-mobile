import React, { useRef, useState } from "react";
import {
  Alert,
  Button,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import ArtifactCard from "../components/ArtifactCard";
import EvidenceForm from "../components/EvidenceForm";
import { submitEvidence } from "../services/api";

export default function CaptureScreen({ onSubmissionComplete }) {
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [photoUri, setPhotoUri] = useState(null);
  const [notes, setNotes] = useState("");
  const [objectLocation, setObjectLocation] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!permission) {
    return (
      <View style={styles.center}>
        <Text style={styles.statusText}>Loading camera...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>ArchIvory needs camera access.</Text>
        <Button
          title="Grant camera permission"
          onPress={requestPermission}
          color="#f28c28"
        />
      </View>
    );
  }

  async function handleTakePhoto() {
    if (!cameraRef.current) {
      return;
    }

    const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
    setPhotoUri(photo.uri);
  }

  async function handleSubmit() {
    if (!photoUri) {
      Alert.alert("No image", "Take a photo first.");
      return;
    }

    setSubmitting(true);

    try {
      const submission = await submitEvidence({
        photoUri,
        notes,
        objectLocation,
      });

      onSubmissionComplete(submission);
    } catch (error) {
      Alert.alert(
        "Submission failed",
        "The app could not reach the server. Keep the evidence locally and try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <View>
      {!photoUri ? (
        <View style={styles.cameraBox}>
          <CameraView ref={cameraRef} style={styles.camera} facing="back" />
          <Button
            title="Capture artifact image"
            onPress={handleTakePhoto}
            color="#f28c28"
          />
        </View>
      ) : (
        <View>
          <ArtifactCard photoUri={photoUri} />
          <Button
            title="Retake photo"
            onPress={() => setPhotoUri(null)}
            color="#f28c28"
          />
        </View>
      )}

      <EvidenceForm
        notes={notes}
        objectLocation={objectLocation}
        onChangeNotes={setNotes}
        onChangeLocation={setObjectLocation}
        onSubmit={handleSubmit}
        submitDisabled={submitting}
        submitLabel={submitting ? "Submitting..." : "Submit to ArchIvory"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    color: "#f4f4f4",
    fontSize: 18,
    marginBottom: 12,
    textAlign: "center",
  },
  statusText: {
    color: "#f4f4f4",
  },
  cameraBox: {
    marginBottom: 20,
  },
  camera: {
    height: 420,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 12,
  },
});
