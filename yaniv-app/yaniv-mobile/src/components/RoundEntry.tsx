import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGameStore } from "../store";
import type { RoundInput } from "../lib/scoring.js";

const RoundEntry = () => {
  const { activePlayers, currentRoundInput, submitRound } = useGameStore();
  const insets = useSafeAreaInsets();

  // Initialize input state from store or create default
  const [input, setInput] = useState<RoundInput>(() => {
    if (currentRoundInput && activePlayers.length > 0) {
      return currentRoundInput;
    }
    return {
      yanivCallerId: activePlayers[0]?.id || "",
      sums: Object.fromEntries(activePlayers.map((p) => [p.id, null])),
    };
  });

  // Update local state when store changes
  useEffect(() => {
    if (currentRoundInput && activePlayers.length > 0) {
      setInput(currentRoundInput);
    }
  }, [currentRoundInput, activePlayers]);

  const handleCallerChange = (playerId: string) => {
    setInput((prev) => ({ ...prev, yanivCallerId: playerId }));
  };

  const handleSumChange = (playerId: string, sum: string) => {
    const numValue = sum === "" ? null : parseInt(sum) || 0;
    setInput((prev) => ({
      ...prev,
      sums: { ...prev.sums, [playerId]: numValue },
    }));
  };

  const handleSubmit = () => {
    // Convert null values to 0 before submitting
    const cleanInput = {
      ...input,
      sums: Object.fromEntries(
        Object.entries(input.sums).map(([id, sum]) => [id, sum ?? 0])
      ),
    };
    submitRound(cleanInput);
  };

  const canSubmit =
    input.yanivCallerId &&
    Object.values(input.sums).every((sum) => sum !== null && sum >= 0) &&
    activePlayers.length >= 2;

  return (
    <ScrollView
      style={[styles.container, { paddingBottom: insets.bottom + 80 }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Round Entry</Text>
        <Text style={styles.subtitle}>
          Select who called Yaniv and enter hand sums
        </Text>
      </View>

      {/* Yaniv Caller Selection */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Who called Yaniv?</Text>
        <View style={styles.callerGrid}>
          {activePlayers.map((player) => (
            <TouchableOpacity
              key={player.id}
              style={[
                styles.callerOption,
                input.yanivCallerId === player.id &&
                  styles.callerOptionSelected,
              ]}
              onPress={() => handleCallerChange(player.id)}
            >
              <View style={styles.callerAvatar}>
                <Text style={styles.callerAvatarText}>
                  {player.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <Text
                style={[
                  styles.callerName,
                  input.yanivCallerId === player.id &&
                    styles.callerNameSelected,
                ]}
              >
                {player.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Hand Sums Input */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Hand Sums</Text>
        <View style={styles.sumsContainer}>
          {activePlayers.map((player) => (
            <View key={player.id} style={styles.sumRow}>
              <View style={styles.playerAvatar}>
                <Text style={styles.playerAvatarText}>
                  {player.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <Text style={styles.playerName}>{player.name}</Text>
              <View style={styles.sumInputContainer}>
                <TextInput
                  style={styles.sumInput}
                  value={input.sums[player.id]?.toString() || ""}
                  onChangeText={(text) => handleSumChange(player.id, text)}
                  keyboardType="numeric"
                  placeholder="0"
                  maxLength={2}
                />
                <Text style={styles.sumUnit}>pts</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Calculate Button */}
      <View style={styles.submitContainer}>
        <TouchableOpacity
          style={[styles.submitButton, !canSubmit && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={!canSubmit}
        >
          <Text style={styles.submitButtonText}>Calculate Round</Text>
        </TouchableOpacity>
      </View>

      {/* Current Totals Preview */}
      {activePlayers.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Current Totals</Text>
          <View style={styles.totalsContainer}>
            {activePlayers.map((player) => (
              <View key={player.id} style={styles.totalRow}>
                <Text style={styles.totalPlayerName}>{player.name}</Text>
                <Text
                  style={[
                    styles.totalScore,
                    player.total === 0 && styles.totalScoreZero,
                    player.total >= 50 && styles.totalScoreWarning,
                  ]}
                >
                  {player.total}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#111827",
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#111827",
  },
  callerGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  callerOption: {
    flex: 1,
    minWidth: "45%",
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#d1d5db",
    backgroundColor: "#ffffff",
  },
  callerOptionSelected: {
    borderColor: "#2563eb",
    backgroundColor: "#eff6ff",
  },
  callerAvatar: {
    width: 32,
    height: 32,
    backgroundColor: "#2563eb",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  callerAvatarText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  callerName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  callerNameSelected: {
    color: "#1e40af",
    fontWeight: "600",
  },
  sumsContainer: {
    gap: 16,
  },
  sumRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  playerAvatar: {
    width: 40,
    height: 40,
    backgroundColor: "#2563eb",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  playerAvatarText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  playerName: {
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
    color: "#111827",
  },
  sumInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  sumInput: {
    width: 70,
    borderWidth: 2,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    textAlign: "center",
    backgroundColor: "#ffffff",
  },
  sumUnit: {
    fontSize: 14,
    color: "#6b7280",
  },
  submitContainer: {
    alignItems: "center",
    marginTop: 16,
  },
  submitButton: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.5,
  },
  totalsContainer: {
    gap: 8,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalPlayerName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
  },
  totalScore: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#374151",
  },
  totalScoreZero: {
    color: "#059669",
  },
  totalScoreWarning: {
    color: "#d97706",
  },
});

export default RoundEntry;
