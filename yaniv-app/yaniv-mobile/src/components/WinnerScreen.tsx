import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGameStore } from "../store";

const WinnerScreen = () => {
  const { winner, players, newGame, currentView } = useGameStore();
  const insets = useSafeAreaInsets();

  // Debug logging
  console.log("WinnerScreen rendered:", { winner, players, currentView });

  // If no winner, show a fallback message
  if (!winner) {
    return (
      <View
        style={[
          styles.container,
          { paddingTop: insets.top, paddingBottom: insets.bottom },
        ]}
      >
        <View style={styles.content}>
          <Text style={styles.errorText}>No winner found</Text>
          <TouchableOpacity
            style={styles.newGameButton}
            onPress={() => newGame()}
          >
            <Text style={styles.newGameButtonText}>Back to Players</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <View style={styles.content}>
        {/* Winner Crown */}
        <View style={styles.crownContainer}>
          <Text style={styles.crown}>👑</Text>
        </View>

        {/* Winner Announcement */}
        <View style={styles.winnerSection}>
          <Text style={styles.congratulations}>Congratulations!</Text>
          <Text style={styles.winnerName}>{winner.name}</Text>
          <Text style={styles.winnerTitle}>is the winner!</Text>
        </View>

        {/* Winner Stats */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Final Score</Text>
          <Text style={styles.winnerScore}>{winner.total}</Text>
          <Text style={styles.statsSubtitle}>points</Text>
        </View>

        {/* Game Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Game Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Players:</Text>
            <Text style={styles.summaryValue}>{players.length}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Rounds Played:</Text>
            <Text style={styles.summaryValue}>
              {players.length > 0
                ? Math.max(...players.map((p) => p.total))
                : 0}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.newGameButton}
            onPress={() => newGame()}
          >
            <Text style={styles.newGameButtonText}>New Game</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => newGame(true)}
          >
            <Text style={styles.resetButtonText}>Reset All</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    minHeight: "100%",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    paddingBottom: 100, // Account for FooterBar
  },
  crownContainer: {
    marginBottom: 32,
  },
  crown: {
    fontSize: 80,
  },
  winnerSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  congratulations: {
    fontSize: 24,
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: 8,
  },
  winnerName: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#2563eb",
    marginBottom: 8,
  },
  winnerTitle: {
    fontSize: 20,
    fontWeight: "500",
    color: "#374151",
  },
  statsCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    minWidth: 200,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: 8,
  },
  winnerScore: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#10b981",
    marginBottom: 4,
  },
  statsSubtitle: {
    fontSize: 16,
    color: "#6b7280",
  },
  summaryCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    minWidth: 250,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
    textAlign: "center",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  summaryLabel: {
    fontSize: 16,
    color: "#6b7280",
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  actionsContainer: {
    flexDirection: "row",
    gap: 16,
  },
  newGameButton: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  newGameButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  resetButton: {
    backgroundColor: "#6b7280",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resetButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  errorText: {
    fontSize: 20,
    color: "#dc2626",
    textAlign: "center",
    marginBottom: 20,
  },
});

export default WinnerScreen;
