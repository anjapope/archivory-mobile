import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import DashboardScreen from "./DashboardScreen";
import GameEvidenceScreen from "./GameEvidenceScreen";
import CitizenScienceScreen from "./CitizenScienceScreen";
import CollectionTrackerScreen from "./CollectionTrackerScreen";

function renderIvoryIDScreen({
  authSession,
  result,
  submissionMode,
  gameSubmissionMode,
  gameSubmissionMessage,
  gameSubmitting,
  submissionHistory,
  onDeleteCollectionEntry,
  onSubmissionComplete,
  onSubmitResultToGame,
  onReset,
  onBackToDashboard,
}) {
  return (
    <GameEvidenceScreen
      authSession={authSession}
      result={result}
      submissionMode={submissionMode}
      gameSubmissionMode={gameSubmissionMode}
      gameSubmissionMessage={gameSubmissionMessage}
      gameSubmitting={gameSubmitting}
      onSubmissionComplete={onSubmissionComplete}
      onSubmitResultToGame={onSubmitResultToGame}
      onReset={onReset}
      onBackToDashboard={onBackToDashboard}
    />
  );
}

const TABS = [
  { key: "dashboard", label: "Home" },
  { key: "citizen", label: "Citizen\nScience" },
  { key: "collection", label: "Collection\nTracker" },
  { key: "game", label: "Game" },
];

const SECTION_LABELS = {
  dashboard: "Home",
  artifact: "Ivory ID",
  citizen: "Citizen Science",
  collection: "Collection Tracker",
  game: "Game",
  academy: "Academy",
};

export default function HomeScreen({
  authSession,
  authMode,
  result,
  submissionMode,
  gameSubmissionMode,
  gameSubmissionMessage,
  gameSubmitting,
  submissionHistory,
  onDeleteCollectionEntry,
  onSubmissionComplete,
  onSubmitResultToGame,
  onReset,
  onSignOut,
}) {
  const [activeTab, setActiveTab] = useState("dashboard");

  const activeLabel = useMemo(() => SECTION_LABELS[activeTab] || "Home", [activeTab]);

  function handleSelectDashboardSection(sectionKey) {
    const sectionMap = {
      "ivory-id": "artifact",
      "global-map": "citizen",
      "education": "academy",
      "database": "collection",
    };
    setActiveTab(sectionMap[sectionKey] || sectionKey);
  }

  function renderContent() {
    if (activeTab === "dashboard") {
      return (
        <DashboardScreen
          authSession={authSession}
          onSelectSection={handleSelectDashboardSection}
          onSignOut={onSignOut}
        />
      );
    }

    if (activeTab === "artifact") {
      return renderIvoryIDScreen({
        authSession,
        result,
        submissionMode,
        gameSubmissionMode,
        gameSubmissionMessage,
        gameSubmitting,
        onSubmissionComplete,
        onSubmitResultToGame,
        onReset,
        onBackToDashboard: () => setActiveTab("dashboard"),
      });
    }

    if (activeTab === "citizen") {
      return <CitizenScienceScreen />;
    }

    if (activeTab === "collection") {
      return (
        <CollectionTrackerScreen
          entries={submissionHistory}
          onDeleteEntry={onDeleteCollectionEntry}
        />
      );
    }

    const sectionTitles = {
      game: "Game",
      academy: "Academy",
    };

    return (
      <View style={styles.placeholderContainer}>
        <Text style={styles.placeholderKicker}>ArchIvory</Text>
        <Text style={styles.placeholderTitle}>{sectionTitles[activeTab]}</Text>
        <Text style={styles.placeholderText}>
          This section is ready for content next. The navigation is in place so
          each area can grow into its own feature set.
        </Text>
        <Pressable
          style={styles.placeholderBackButton}
          onPress={() => setActiveTab("dashboard")}
        >
          <Text style={styles.placeholderBackButtonText}>← Back to Home</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>{renderContent()}</View>

      <View style={styles.bottomBar}>
        {TABS.map((tab) => {
          const selected = tab.key === activeTab;
          return (
            <Pressable
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              style={[styles.tabButton, selected && styles.tabButtonActive]}
            >
              <Text style={[styles.tabLabel, selected && styles.tabLabelActive]}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {activeTab !== "dashboard" && (
        <View style={styles.topBadge}>
          <Text style={styles.topBadgeText}>
            {authSession.mode === "guest"
              ? "Guest access"
              : `Account: ${authSession.user.email || authSession.user.displayName}`} · {activeLabel}
          </Text>
          {authSession.mode !== "guest" ? (
            <Text style={styles.modeText}>
              {authMode === "placeholder" ? "Auth mode: placeholder" : "Auth mode: live"}
            </Text>
          ) : null}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111111",
  },
  content: {
    flex: 1,
  },
  bottomBar: {
    flexDirection: "row",
    backgroundColor: "#0f3d3e",
    borderTopWidth: 1,
    borderTopColor: "#1f4d4e",
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 12,
  },
  tabButton: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  tabButtonActive: {
    backgroundColor: "#f28c28",
  },
  tabLabel: {
    color: "#f4f4f4",
    fontSize: 11,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 13,
  },
  tabLabelActive: {
    color: "#111111",
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  placeholderKicker: {
    color: "#f28c28",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
    fontWeight: "700",
  },
  placeholderTitle: {
    color: "#f4f4f4",
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 12,
  },
  placeholderText: {
    color: "#c7c7c7",
    textAlign: "center",
    lineHeight: 20,
    maxWidth: 320,
  },
  placeholderBackButton: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#f28c28",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  placeholderBackButtonText: {
    color: "#f28c28",
    fontWeight: "700",
    fontSize: 14,
    textAlign: "center",
  },
  topBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    right: 12,
    alignItems: "flex-end",
  },
  topBadgeText: {
    color: "#f4f4f4",
    backgroundColor: "rgba(17, 17, 17, 0.72)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    overflow: "hidden",
    fontSize: 12,
    fontWeight: "600",
  },
  modeText: {
    color: "#c7c7c7",
    backgroundColor: "rgba(17, 17, 17, 0.72)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: "hidden",
    fontSize: 11,
    marginTop: 6,
  },
  signOutButton: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#f28c28",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "rgba(17, 17, 17, 0.72)",
  },
  signOutButtonText: {
    color: "#f28c28",
    fontSize: 11,
    fontWeight: "700",
  },
});