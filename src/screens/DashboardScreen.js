import React from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

const TILES = [
  {
    key: "ivory-id",
    title: "Ivory ID",
    description: "Capture and identify ivory artifacts using the camera.",
    accent: "#f28c28",
  },
  {
    key: "global-map",
    title: "Global Ivory Map",
    description: "View ivory sightings and reports plotted worldwide.",
    accent: "#2a9d8f",
  },
  {
    key: "education",
    title: "Academy",
    description: "Learn about ivory identification, conservation, and law.",
    accent: "#457b9d",
  },
  {
    key: "database",
    title: "Database",
    description: "Browse and search the full ArchIvory evidence archive.",
    accent: "#6a4c93",
  },
];

export default function DashboardScreen({ authSession, onSelectSection, onSignOut }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../../assets/Archivory Logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.headerText}>
          <Text style={styles.title}>ArchIvory</Text>
          <Text style={styles.subtitle}>
            {authSession.mode === "guest"
              ? "Guest access"
              : authSession.user.email || authSession.user.displayName}
          </Text>
        </View>
        <Pressable style={styles.signOutButton} onPress={onSignOut}>
          <Text style={styles.signOutText}>Sign out</Text>
        </Pressable>
      </View>

      <View style={styles.grid}>
        {TILES.map((tile) => (
          <Pressable
            key={tile.key}
            style={[styles.tile, { borderTopColor: tile.accent }]}
            onPress={() => onSelectSection(tile.key)}
          >
            <Text style={[styles.tileTitle, { color: tile.accent }]}>
              {tile.title}
            </Text>
            <Text style={styles.tileDescription}>{tile.description}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111111",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1f4d4e",
    gap: 12,
  },
  logo: {
    width: 44,
    height: 44,
  },
  headerText: {
    flex: 1,
  },
  title: {
    color: "#f28c28",
    fontSize: 22,
    fontWeight: "800",
  },
  subtitle: {
    color: "#c7c7c7",
    fontSize: 13,
    marginTop: 2,
  },
  signOutButton: {
    borderWidth: 1,
    borderColor: "#f28c28",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  signOutText: {
    color: "#f28c28",
    fontSize: 12,
    fontWeight: "700",
  },
  grid: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 10,
    gap: 10,
  },
  tile: {
    width: "48%",
    flexGrow: 1,
    flexBasis: "48%",
    height: "48%",
    backgroundColor: "#1c1c1c",
    borderRadius: 16,
    borderTopWidth: 4,
    padding: 20,
    justifyContent: "flex-end",
    minHeight: 190,
  },
  tileTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 8,
  },
  tileDescription: {
    color: "#c7c7c7",
    fontSize: 13,
    lineHeight: 18,
  },
});
