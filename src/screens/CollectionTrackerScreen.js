import React, { useState } from "react";
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function CollectionTrackerScreen({ entries = [], onDeleteEntry }) {
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [pendingDeleteEntry, setPendingDeleteEntry] = useState(null);

  function handleDeletePress(entry) {
    setPendingDeleteEntry(entry);
  }

  function handleConfirmDelete() {
    if (!pendingDeleteEntry) {
      return;
    }

    if (selectedEntry?.id === pendingDeleteEntry.id) {
      setSelectedEntry(null);
    }

    if (typeof onDeleteEntry === "function") {
      onDeleteEntry(pendingDeleteEntry.id);
    }

    setPendingDeleteEntry(null);
  }

  if (selectedEntry) {
    return (
      <View style={styles.container}>
        <View style={styles.headerCard}>
          <Pressable style={styles.backButton} onPress={() => setSelectedEntry(null)}>
            <Text style={styles.backButtonText}>← Back to tracker</Text>
          </Pressable>
          <Text style={styles.title}>{selectedEntry.objectType}</Text>
          <Text style={styles.subtitle}>{selectedEntry.id}</Text>
        </View>

        <ScrollView style={styles.logContainer} contentContainerStyle={styles.detailContent}>
          {selectedEntry.photoUri ? (
            <Image source={{ uri: selectedEntry.photoUri }} style={styles.previewImage} resizeMode="contain" />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.emptyText}>No image attached</Text>
            </View>
          )}

          <View style={styles.detailCard}>
            <Text style={styles.detailSectionTitle}>Attached Information</Text>
            <Text style={styles.detailRow}>Material: {selectedEntry.predictedMaterial || "N/A"}</Text>
            <Text style={styles.detailRow}>Saved status: {selectedEntry.mode || "N/A"}</Text>
            <Text style={styles.detailRow}>Submitted: {selectedEntry.submittedAtLabel || "N/A"}</Text>
          </View>

          <View style={styles.detailCard}>
            <Text style={styles.detailSectionTitle}>Test Results</Text>
            <Text style={styles.detailRow}>Object type: {selectedEntry.objectType || "N/A"}</Text>
            <Text style={styles.detailRow}>Confidence: {selectedEntry.confidence || "N/A"}</Text>
            <Text style={styles.detailRow}>
              Points awarded: {typeof selectedEntry.pointsAwarded === "number" ? selectedEntry.pointsAwarded : "N/A"}
            </Text>
            <Text style={styles.detailRow}>Summary: {selectedEntry.summary || "N/A"}</Text>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerCard}>
        <Text style={styles.title}>Collection Tracker</Text>
        <Text style={styles.subtitle}>
          Your submitted artifacts are logged here.
        </Text>
      </View>

      <View style={styles.logContainer}>
        <View style={styles.tableHeader}>
          <Text style={[styles.headerCell, styles.idCell]}>ID</Text>
          <Text style={[styles.headerCell, styles.objectCell]}>Artifact</Text>
          <Text style={[styles.headerCell, styles.statusCell]}>Status</Text>
          <Text style={[styles.headerCell, styles.timeCell]}>Submitted</Text>
        </View>

        <ScrollView style={styles.tableBody} contentContainerStyle={styles.tableBodyContent}>
          {entries.map((entry) => (
            <View key={entry.id} style={styles.tableRow}>
              <Pressable style={styles.rowMain} onPress={() => setSelectedEntry(entry)}>
                <Text style={[styles.rowCell, styles.idCell]}>{entry.id}</Text>
                <View style={styles.objectCell}>
                  <Text style={styles.rowCell}>{entry.objectType}</Text>
                  <Text style={styles.subText}>{entry.predictedMaterial}</Text>
                </View>
                <Text style={[styles.rowCell, styles.statusCell]}>{entry.mode}</Text>
                <Text style={[styles.rowCell, styles.timeCell]}>{entry.submittedAtLabel}</Text>
              </Pressable>
              <Pressable
                style={styles.deleteButton}
                onPress={() => handleDeletePress(entry)}
                accessibilityLabel={`Delete ${entry.objectType}`}
              >
                <Text style={styles.deleteIcon}>🗑</Text>
              </Pressable>
            </View>
          ))}

          {entries.length === 0 ? (
            <View style={styles.emptyRow}>
              <Text style={styles.emptyText}>
                No artifacts submitted yet. Capture and submit an artifact to add it to this log.
              </Text>
            </View>
          ) : null}
        </ScrollView>
      </View>

      <Modal
        transparent
        visible={Boolean(pendingDeleteEntry)}
        animationType="fade"
        onRequestClose={() => setPendingDeleteEntry(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Delete artifact?</Text>
            <Text style={styles.modalText}>
              Do you want to delete this object from the tracker?
            </Text>
            <View style={styles.modalActions}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setPendingDeleteEntry(null)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.deleteConfirmButton]}
                onPress={handleConfirmDelete}
              >
                <Text style={styles.deleteConfirmButtonText}>Delete</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111111",
    padding: 16,
    gap: 12,
  },
  headerCard: {
    backgroundColor: "#0f3d3e",
    borderRadius: 14,
    padding: 14,
  },
  title: {
    color: "#f28c28",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 6,
  },
  subtitle: {
    color: "#c7c7c7",
    lineHeight: 18,
  },
  backButton: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#f28c28",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
  },
  backButtonText: {
    color: "#f28c28",
    fontWeight: "700",
    fontSize: 13,
  },
  logContainer: {
    flex: 1,
    backgroundColor: "#1c1c1c",
    borderRadius: 14,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#0f3d3e",
    borderBottomWidth: 1,
    borderBottomColor: "#2b5758",
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  headerCell: {
    color: "#f28c28",
    fontWeight: "800",
    fontSize: 12,
  },
  tableBody: {
    flex: 1,
  },
  tableBodyContent: {
    paddingBottom: 12,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#2b2b2b",
    alignItems: "center",
  },
  rowMain: {
    flex: 1,
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  rowCell: {
    color: "#f4f4f4",
    fontSize: 12,
    lineHeight: 16,
  },
  subText: {
    color: "#a8a8a8",
    fontSize: 11,
    marginTop: 2,
  },
  idCell: {
    width: 58,
  },
  objectCell: {
    flex: 1,
    paddingRight: 8,
  },
  statusCell: {
    width: 90,
    textTransform: "capitalize",
  },
  timeCell: {
    width: 84,
  },
  deleteButton: {
    width: 40,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
    paddingVertical: 8,
    borderRadius: 8,
  },
  deleteIcon: {
    fontSize: 16,
  },
  emptyRow: {
    padding: 18,
    alignItems: "center",
  },
  emptyText: {
    color: "#c7c7c7",
    textAlign: "center",
    lineHeight: 20,
  },
  detailContent: {
    padding: 12,
  },
  previewImage: {
    width: "100%",
    height: 260,
    backgroundColor: "#111111",
    borderRadius: 12,
    marginBottom: 12,
  },
  imagePlaceholder: {
    width: "100%",
    height: 140,
    backgroundColor: "#111111",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  detailCard: {
    backgroundColor: "#111111",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#2b2b2b",
  },
  detailSectionTitle: {
    color: "#f28c28",
    fontWeight: "800",
    marginBottom: 8,
  },
  detailRow: {
    color: "#f4f4f4",
    lineHeight: 20,
    marginBottom: 4,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalCard: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#1c1c1c",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#2b2b2b",
  },
  modalTitle: {
    color: "#f28c28",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 8,
  },
  modalText: {
    color: "#f4f4f4",
    lineHeight: 20,
    marginBottom: 14,
  },
  modalActions: {
    flexDirection: "row",
    gap: 10,
  },
  modalButton: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: "#f28c28",
  },
  cancelButtonText: {
    color: "#f28c28",
    fontWeight: "700",
  },
  deleteConfirmButton: {
    backgroundColor: "#f28c28",
  },
  deleteConfirmButtonText: {
    color: "#111111",
    fontWeight: "800",
  },
});
