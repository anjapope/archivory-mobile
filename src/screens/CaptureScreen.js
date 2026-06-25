import React, { useRef, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import ArtifactCard from "../components/ArtifactCard";
import EvidenceForm from "../components/EvidenceForm";
import { submitEvidence } from "../services/api";

const PHOTO_QUALITY = 0.8;

export default function CaptureScreen({ authSession, onSubmissionComplete }) {
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraInstanceKey, setCameraInstanceKey] = useState(0);
  const [photoUri, setPhotoUri] = useState(null);
  const [photoAspectRatio, setPhotoAspectRatio] = useState(3 / 4);
  const [confirmed, setConfirmed] = useState(false);
  const [readyToSubmit, setReadyToSubmit] = useState(false);
  const [notes, setNotes] = useState("");
  const [objectLocation, setObjectLocation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [saveToAccount, setSaveToAccount] = useState(true);
  const isGuest = authSession?.mode === "guest";

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
        <Pressable style={styles.captureButton} onPress={requestPermission}>
          <Text style={styles.captureButtonText}>Grant camera permission</Text>
        </Pressable>
      </View>
    );
  }

  async function handleTakePhoto() {
    if (!cameraRef.current) {
      return;
    }

    const photo = await cameraRef.current.takePictureAsync({
      quality: PHOTO_QUALITY,
    });

    if (typeof photo?.width === "number" && typeof photo?.height === "number" && photo.height > 0) {
      setPhotoAspectRatio(photo.width / photo.height);
    }

    setPhotoUri(photo.uri);
    setConfirmed(false);
  }

  function handleRetake() {
    setPhotoUri(null);
    setConfirmed(false);
    setReadyToSubmit(false);
    setPhotoAspectRatio(3 / 4);
    setNotes("");
    setObjectLocation("");
    setSaveToAccount(true);
    setCameraInstanceKey((previousKey) => previousKey + 1);
  }

  function handleConfirmPhoto() {
    setConfirmed(true);
    setReadyToSubmit(false);
  }

  function handleContinueToSubmission() {
    if (!photoUri) {
      Alert.alert("No image", "Take a photo first.");
      return;
    }

    setReadyToSubmit(true);
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

      onSubmissionComplete({
        ...submission,
        photoUri,
        saveToAccount,
      });
    } catch (error) {
      Alert.alert(
        "Submission failed",
        error?.message === "invalid-api-url" ||
        error?.message === "invalid-api-url-format"
          ? "Set EXPO_PUBLIC_ARCHIVORY_API_URL to a valid submission endpoint before using live uploads."
          : "The app could not reach the server. Keep the evidence locally and try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  // Stage 1 – camera
  if (!photoUri) {
    return (
      <View style={styles.cameraBox}>
        <View style={styles.cameraFrame}>
          <CameraView
            key={cameraInstanceKey}
            ref={cameraRef}
            style={styles.camera}
            facing="back"
          />
        </View>
        <Pressable style={styles.captureButton} onPress={handleTakePhoto}>
          <Text style={styles.captureButtonText}>Capture artifact image</Text>
        </Pressable>
      </View>
    );
  }

  // Stage 2 – confirm photo
  if (!confirmed) {
    return (
      <View style={styles.confirmContainer}>
        <Text style={styles.confirmHeading}>Use this image?</Text>
        <Image
          source={{ uri: photoUri }}
          style={[styles.confirmPreview, { aspectRatio: photoAspectRatio }]}
          resizeMode="contain"
        />
        <View style={styles.confirmActions}>
          <Pressable style={styles.retakeButton} onPress={handleRetake}>
            <Text style={styles.retakeButtonText}>Retake</Text>
          </Pressable>
          <Pressable style={styles.useButton} onPress={handleConfirmPhoto}>
            <Text style={styles.useButtonText}>Use photo</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // Stage 3 – evidence form + identify
  if (!readyToSubmit) {
    return (
      <View>
        <ArtifactCard photoUri={photoUri} photoAspectRatio={photoAspectRatio} />
        <Pressable style={styles.retakeSmall} onPress={handleRetake}>
          <Text style={styles.retakeSmallText}>← Retake photo</Text>
        </Pressable>
        <EvidenceForm
          notes={notes}
          objectLocation={objectLocation}
          onChangeNotes={setNotes}
          onChangeLocation={setObjectLocation}
          onSubmit={handleContinueToSubmission}
          submitDisabled={submitting}
          submitLabel="Continue to database submission"
        />
      </View>
    );
  }

  // Stage 4 – review and submit to database
  return (
    <View style={styles.reviewContainer}>
      <Text style={styles.reviewTitle}>Ready to submit evidence</Text>
      <Text style={styles.reviewText}>
        This step submits the image and evidence record to the database endpoint.
        Live storage will activate once the backend URL is connected.
      </Text>
      <ArtifactCard photoUri={photoUri} photoAspectRatio={photoAspectRatio} />

      <View style={styles.reviewDetails}>
        <Text style={styles.reviewLabel}>Location</Text>
        <Text style={styles.reviewValue}>
          {objectLocation || "No location provided"}
        </Text>
        <Text style={styles.reviewLabel}>Notes</Text>
        <Text style={styles.reviewValue}>{notes || "No notes provided"}</Text>
      </View>

      {isGuest ? (
        <Text style={styles.guestSaveNote}>
          Guest mode: this artifact will be logged for this session.
        </Text>
      ) : (
        <Pressable
          style={styles.saveToggle}
          onPress={() => setSaveToAccount((previousValue) => !previousValue)}
          disabled={submitting}
        >
          <Text style={styles.saveToggleIndicator}>{saveToAccount ? "☑" : "☐"}</Text>
          <Text style={styles.saveToggleText}>Save this artifact to my account</Text>
        </Pressable>
      )}

      <View style={styles.confirmActions}>
        <Pressable
          style={styles.retakeButton}
          onPress={() => setReadyToSubmit(false)}
          disabled={submitting}
        >
          <Text style={styles.retakeButtonText}>Edit details</Text>
        </Pressable>
        <Pressable
          style={styles.useButton}
          onPress={handleSubmit}
          disabled={submitting}
        >
          <Text style={styles.useButtonText}>
            {submitting ? "Submitting..." : "Submit image to database"}
          </Text>
        </Pressable>
      </View>
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
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  cameraFrame: {
    width: "38%",
    height: 620,
    alignSelf: "center",
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#1c1c1c",
    marginBottom: 16,
  },
  camera: {
    width: "100%",
    height: "100%",
  },
  captureButton: {
    backgroundColor: "#f28c28",
    marginBottom: 16,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  captureButtonText: {
    color: "#111111",
    fontWeight: "800",
    fontSize: 16,
  },
  confirmContainer: {
    padding: 24,
    backgroundColor: "#111111",
  },
  confirmHeading: {
    color: "#f4f4f4",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 16,
    textAlign: "center",
  },
  confirmPreview: {
    width: "100%",
    maxHeight: 300,
    alignSelf: "center",
    borderRadius: 18,
    marginBottom: 20,
    backgroundColor: "#1c1c1c",
  },
  confirmActions: {
    flexDirection: "row",
    gap: 12,
  },
  retakeButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#f28c28",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  retakeButtonText: {
    color: "#f28c28",
    fontWeight: "700",
    fontSize: 16,
  },
  useButton: {
    flex: 2,
    backgroundColor: "#f28c28",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  useButtonText: {
    color: "#111111",
    fontWeight: "800",
    fontSize: 16,
  },
  retakeSmall: {
    marginBottom: 12,
  },
  retakeSmallText: {
    color: "#f28c28",
    fontWeight: "600",
    fontSize: 14,
  },
  reviewContainer: {
    backgroundColor: "#111111",
    paddingBottom: 8,
  },
  reviewTitle: {
    color: "#f4f4f4",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 8,
  },
  reviewText: {
    color: "#c7c7c7",
    lineHeight: 18,
    marginBottom: 12,
  },
  reviewDetails: {
    backgroundColor: "#0f3d3e",
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },
  reviewLabel: {
    color: "#f28c28",
    fontWeight: "700",
    marginBottom: 4,
  },
  reviewValue: {
    color: "#f4f4f4",
    marginBottom: 10,
    lineHeight: 18,
  },
  saveToggle: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  saveToggleIndicator: {
    color: "#f28c28",
    fontSize: 18,
    marginRight: 8,
  },
  saveToggleText: {
    color: "#f4f4f4",
    fontSize: 14,
    fontWeight: "600",
  },
  guestSaveNote: {
    color: "#c7c7c7",
    marginBottom: 14,
    lineHeight: 18,
  },
});
