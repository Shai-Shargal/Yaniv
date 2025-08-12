import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGameStore } from "../store";

const RoundResults = () => {
  const { currentRoundOutcome, activePlayers, confirmRound } = useGameStore();
  const insets = useSafeAreaInsets();

  if (!currentRoundOutcome) return null;

  const { penalties, asafBy, callerId } = currentRoundOutcome;
  const yanivCaller = activePlayers.find((p) => p.id === callerId);
  const asafPlayer = asafBy ? activePlayers.find((p) => p.id === asafBy) : null;

  return (
    <ScrollView
      style={[styles.container, { paddingBottom: insets.bottom + 80 }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Round Results</Text>
        <Text style={styles.subtitle}>Here's what happened this round</Text>
      </View>

      {/* Yaniv Caller Result */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Yaniv Caller</Text>
        <View style={styles.callerResult}>
          <View style={styles.callerAvatar}>
            <Text style={styles.callerAvatarText}>
              {yanivCaller?.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.callerInfo}>
            <Text style={styles.callerName}>{yanivCaller?.name}</Text>
            <Text style={styles.callerPenalty}>
              +{penalties[callerId]} points
            </Text>
          </View>
        </View>
      </View>

      {/* Asaf Result */}
      {asafPlayer && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Asaf!</Text>
          <View style={styles.asafResult}>
            <View style={styles.asafAvatar}>
              <Text style={styles.asafAvatarText}>
                {asafPlayer.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.asafInfo}>
              <Text style={styles.asafName}>{asafPlayer.name}</Text>
              <Text style={styles.asafPenalty}>
                +{penalties[asafPlayer.id]} points
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* All Players Results */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>All Players</Text>
        <View style={styles.resultsList}>
          {activePlayers.map((player) => (
            <View key={player.id} style={styles.resultRow}>
              <View style={styles.playerAvatar}>
                <Text style={styles.playerAvatarText}>
                  {player.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.playerInfo}>
                <Text style={styles.playerName}>{player.name}</Text>
                <Text style={styles.playerPenalty}>
                  +{penalties[player.id]} points
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Confirm Button */}
      <View style={styles.confirmContainer}>
        <TouchableOpacity style={styles.confirmButton} onPress={confirmRound}>
          <Text style={styles.confirmButtonText}>Confirm Round</Text>
        </TouchableOpacity>
      </View>
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
  callerResult: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  callerAvatar: {
    width: 48,
    height: 48,
    backgroundColor: "#2563eb",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  callerAvatarText: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "600",
  },
  callerInfo: {
    flex: 1,
  },
  callerName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  callerPenalty: {
    fontSize: 16,
    color: "#dc2626",
    fontWeight: "500",
  },
  asafResult: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  asafAvatar: {
    width: 48,
    height: 48,
    backgroundColor: "#f59e0b",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  asafAvatarText: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "600",
  },
  asafInfo: {
    flex: 1,
  },
  asafName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  asafPenalty: {
    fontSize: 16,
    color: "#dc2626",
    fontWeight: "500",
  },
  resultsList: {
    gap: 12,
  },
  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
  },
  playerAvatar: {
    width: 40,
    height: 40,
    backgroundColor: "#6b7280",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  playerAvatarText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 2,
  },
  playerPenalty: {
    fontSize: 14,
    color: "#dc2626",
    fontWeight: "500",
  },
  confirmContainer: {
    alignItems: "center",
    marginTop: 16,
  },
  confirmButton: {
    backgroundColor: "#10b981",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  confirmButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default RoundResults;
