import React, { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const MOCK_SUBMISSIONS = [
  { id: "CS-001", title: "Lace Making Kit", source: "Testing", location: "", status: "In review" },
  { id: "CS-002", title: "Ivory Cane", source: "Database", location: "", status: "Stored" },
  { id: "CS-003", title: "Beaded Necklace", source: "Testing", location: "", status: "Queued" },
  { id: "CS-004", title: "Assorted Piano Keys- Kentucy", source: "Database", location: "", status: "Stored" },
  { id: "CS-005", title: "Organ Piano- 1833", source: "Testing", location: "", status: "In review" },
];

export default function CitizenScienceScreen() {
  const [query, setQuery] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [sourceFilter, setSourceFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedEntry, setSelectedEntry] = useState(null);

  const filteredRows = useMemo(() => {
    return MOCK_SUBMISSIONS.filter((row) => {
      const textMatches =
        !query.trim() ||
        `${row.id} ${row.title} ${row.location}`
          .toLowerCase()
          .includes(query.trim().toLowerCase());

      const sourceMatches =
        !sourceFilter.trim() ||
        row.source.toLowerCase().includes(sourceFilter.trim().toLowerCase());

      const statusMatches =
        !statusFilter.trim() ||
        row.status.toLowerCase().includes(statusFilter.trim().toLowerCase());

      return textMatches && sourceMatches && statusMatches;
    });
  }, [query, sourceFilter, statusFilter]);

  if (selectedEntry) {
    return (
      <View style={styles.container}>
        <View style={styles.objectPageHeader}>
          <Pressable
            style={styles.objectPageBackButton}
            onPress={() => setSelectedEntry(null)}
          >
            <Text style={styles.objectPageBackButtonText}>← Back to log book</Text>
          </Pressable>
          <Text style={styles.objectPageTitle}>{selectedEntry.title}</Text>
          <Text style={styles.objectPageSubtitle}>Object page</Text>
        </View>

        <View style={styles.objectPageCard}>
          <View style={styles.objectPageRow}>
            <Text style={styles.objectPageLabel}>Entry ID</Text>
            <Text style={styles.objectPageValue}>{selectedEntry.id}</Text>
          </View>
          <View style={styles.objectPageRow}>
            <Text style={styles.objectPageLabel}>Source</Text>
            <Text style={styles.objectPageValue}>{selectedEntry.source}</Text>
          </View>
          <View style={styles.objectPageRow}>
            <Text style={styles.objectPageLabel}>Status</Text>
            <Text style={styles.objectPageValue}>{selectedEntry.status}</Text>
          </View>
          <View style={styles.objectPageRow}>
            <Text style={styles.objectPageLabel}>Location</Text>
            <Text style={styles.objectPageValue}>
              {selectedEntry.location || "Not set yet"}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchPanel}>
        <Text style={styles.title}>Citizen Science Log Book</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search submissions by ID, object, or location"
          placeholderTextColor="#7d7d7d"
          value={query}
          onChangeText={setQuery}
        />

        <Pressable
          style={styles.advancedButton}
          onPress={() => setShowAdvanced((previous) => !previous)}
        >
          <Text style={styles.advancedButtonText}>
            {showAdvanced ? "Hide advanced search" : "Advanced search"}
          </Text>
        </Pressable>

        {showAdvanced ? (
          <View style={styles.advancedFields}>
            <TextInput
              style={styles.searchInput}
              placeholder="Filter by source (Testing or Database)"
              placeholderTextColor="#7d7d7d"
              value={sourceFilter}
              onChangeText={setSourceFilter}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Filter by status"
              placeholderTextColor="#7d7d7d"
              value={statusFilter}
              onChangeText={setStatusFilter}
            />
          </View>
        ) : null}
      </View>

      <View style={styles.logBookContainer}>
        <View style={styles.tableHeader}>
          <Text style={[styles.headerCell, styles.idCell]}>ID</Text>
          <Text style={[styles.headerCell, styles.objectCell]}>Object</Text>
          <Text style={[styles.headerCell, styles.sourceCell]}>Source</Text>
          <Text style={[styles.headerCell, styles.statusCell]}>Status</Text>
        </View>

        <ScrollView style={styles.tableBody} contentContainerStyle={styles.tableBodyContent}>
          {filteredRows.map((row) => (
            <Pressable
              key={row.id}
              style={styles.tableRow}
              onPress={() => setSelectedEntry(row)}
            >
              <Text style={[styles.rowCell, styles.idCell]}>{row.id}</Text>
              <View style={styles.objectCell}>
                <Text style={styles.rowCell}>{row.title}</Text>
                {row.location ? <Text style={styles.subText}>{row.location}</Text> : null}
              </View>
              <Text style={[styles.rowCell, styles.sourceCell]}>{row.source}</Text>
              <Text style={[styles.rowCell, styles.statusCell]}>{row.status}</Text>
            </Pressable>
          ))}

          {filteredRows.length === 0 ? (
            <View style={styles.emptyRow}>
              <Text style={styles.emptyText}>No submissions match the current search.</Text>
            </View>
          ) : null}
        </ScrollView>
      </View>
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
  searchPanel: {
    backgroundColor: "#0f3d3e",
    borderRadius: 14,
    padding: 14,
  },
  title: {
    color: "#f28c28",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 10,
  },
  searchInput: {
    backgroundColor: "#111111",
    color: "#f4f4f4",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#2c2c2c",
    marginBottom: 10,
  },
  advancedButton: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#f28c28",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
  },
  advancedButtonText: {
    color: "#f28c28",
    fontWeight: "700",
    fontSize: 13,
  },
  advancedFields: {
    marginTop: 4,
  },
  logBookContainer: {
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
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#2b2b2b",
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
  sourceCell: {
    width: 78,
  },
  statusCell: {
    width: 82,
  },
  emptyRow: {
    padding: 18,
    alignItems: "center",
  },
  emptyText: {
    color: "#c7c7c7",
  },
  objectPageHeader: {
    backgroundColor: "#0f3d3e",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  objectPageBackButton: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#f28c28",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
  },
  objectPageBackButtonText: {
    color: "#f28c28",
    fontWeight: "700",
    fontSize: 13,
  },
  objectPageTitle: {
    color: "#f28c28",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 6,
  },
  objectPageSubtitle: {
    color: "#c7c7c7",
    fontSize: 13,
  },
  objectPageCard: {
    flex: 1,
    backgroundColor: "#1c1c1c",
    borderRadius: 14,
    padding: 16,
  },
  objectPageRow: {
    borderBottomWidth: 1,
    borderBottomColor: "#2b2b2b",
    paddingVertical: 12,
  },
  objectPageLabel: {
    color: "#f28c28",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 6,
    textTransform: "uppercase",
  },
  objectPageValue: {
    color: "#f4f4f4",
    fontSize: 15,
  },
});
