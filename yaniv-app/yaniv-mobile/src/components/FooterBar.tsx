import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGameStore } from "../store";

const FooterBar = () => {
  const {
    players,
    history,
    undoLastRound,
    newGame,
    currentRoundInput,
    currentRoundOutcome,
  } = useGameStore();
  const insets = useSafeAreaInsets();

  const isInRound = !!(currentRoundInput || currentRoundOutcome);
  const hasHistory = history.length > 0;
  const hasActiveGame = players.length > 0;

  return (
    <View style={[styles.footer, { paddingBottom: insets.bottom }]}>
      <View style={styles.container}>
        <View style={styles.stats}>
          <Text style={styles.statText}>{players.length} players</Text>
          <Text style={styles.statText}>{history.length} rounds</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[
              styles.button,
              styles.secondaryButton,
              (!hasHistory || isInRound) && styles.disabledButton,
            ]}
            onPress={undoLastRound}
            disabled={!hasHistory || isInRound}
          >
            <Text
              style={[
                styles.buttonText,
                styles.secondaryButtonText,
                (!hasHistory || isInRound) && styles.disabledButtonText,
              ]}
            >
              Undo
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              styles.primaryButton,
              (!hasActiveGame || isInRound) && styles.disabledButton,
            ]}
            onPress={() => newGame()}
            disabled={!hasActiveGame || isInRound}
          >
            <Text
              style={[
                styles.buttonText,
                styles.primaryButtonText,
                (!hasActiveGame || isInRound) && styles.disabledButtonText,
              ]}
            >
              New Game
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 24,
    paddingBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  stats: {
    flexDirection: "row",
    gap: 16,
  },
  statText: {
    fontSize: 14,
    color: "#6b7280",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 10,
    minWidth: 100,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  primaryButton: {
    backgroundColor: "#2563eb",
  },
  secondaryButton: {
    backgroundColor: "#6b7280",
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "700",
  },
  primaryButtonText: {
    color: "#ffffff",
  },
  secondaryButtonText: {
    color: "#ffffff",
  },
  disabledButtonText: {
    color: "#9ca3af",
  },
});

export default FooterBar;
