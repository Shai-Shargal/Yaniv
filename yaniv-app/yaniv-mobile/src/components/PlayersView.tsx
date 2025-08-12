import React, { useState } from "react";
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
import type { Player } from "../lib/scoring.js";

const PlayersView = () => {
  const {
    players,
    addPlayer,
    updatePlayerName,
    removePlayer,
    reorderPlayers,
    startRound,
  } = useGameStore();
  const [newPlayerName, setNewPlayerName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const insets = useSafeAreaInsets();

  const handleAddPlayer = () => {
    if (newPlayerName.trim() && players.length < 8) {
      addPlayer(newPlayerName);
      setNewPlayerName("");
    }
  };

  const handleEditStart = (player: Player) => {
    setEditingId(player.id);
    setEditingName(player.name);
  };

  const handleEditSave = () => {
    if (editingId && editingName.trim()) {
      updatePlayerName(editingId, editingName);
      setEditingId(null);
      setEditingName("");
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditingName("");
  };

  const handleRemovePlayer = (player: Player) => {
    Alert.alert(
      "Remove Player",
      `Are you sure you want to remove ${player.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => removePlayer(player.id),
        },
      ]
    );
  };

  const canStartGame = players.length >= 2;

  return (
    <ScrollView
      style={[styles.container, { paddingBottom: insets.bottom + 80 }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Players</Text>
        <Text style={styles.subtitle}>Add players to start a new game</Text>
      </View>

      {/* Add Player Form */}
      <View style={styles.card}>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={newPlayerName}
            onChangeText={setNewPlayerName}
            placeholder="Player name"
            maxLength={20}
            onSubmitEditing={handleAddPlayer}
            returnKeyType="done"
          />
          <TouchableOpacity
            style={[
              styles.addButton,
              (!newPlayerName.trim() || players.length >= 8) &&
                styles.disabledButton,
            ]}
            onPress={handleAddPlayer}
            disabled={!newPlayerName.trim() || players.length >= 8}
          >
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
        {players.length >= 8 && (
          <Text style={styles.maxPlayersText}>Maximum 8 players reached</Text>
        )}
      </View>

      {/* Players List */}
      {players.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Current Players ({players.length}/8)
          </Text>
          <View style={styles.playersList}>
            {players.map((player, index) => (
              <View key={player.id} style={styles.playerItem}>
                {/* Player Avatar */}
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {player.name.charAt(0).toUpperCase()}
                  </Text>
                </View>

                {/* Player Name */}
                {editingId === player.id ? (
                  <View style={styles.editRow}>
                    <TextInput
                      style={styles.editInput}
                      value={editingName}
                      onChangeText={setEditingName}
                      autoFocus
                      onSubmitEditing={handleEditSave}
                      returnKeyType="done"
                    />
                    <TouchableOpacity
                      style={styles.saveButton}
                      onPress={handleEditSave}
                    >
                      <Text style={styles.saveButtonText}>✓</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={handleEditCancel}
                    >
                      <Text style={styles.cancelButtonText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.playerInfo}>
                    <Text style={styles.playerName}>{player.name}</Text>
                  </View>
                )}

                {/* Actions */}
                {editingId !== player.id && (
                  <View style={styles.actions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleEditStart(player)}
                    >
                      <Text style={styles.actionButtonText}>✏️</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleRemovePlayer(player)}
                    >
                      <Text style={styles.actionButtonText}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Start Game Button */}
      {canStartGame && (
        <View style={styles.startButtonContainer}>
          <TouchableOpacity style={styles.startButton} onPress={startRound}>
            <Text style={styles.startButtonText}>Start Round</Text>
          </TouchableOpacity>
        </View>
      )}

      {players.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            No players yet. Add at least 2 players to start a game.
          </Text>
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
  inputRow: {
    flexDirection: "row",
    gap: 12,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: "center",
  },
  addButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.5,
  },
  maxPlayersText: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 8,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#111827",
  },
  playersList: {
    gap: 12,
  },
  playerItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    backgroundColor: "#2563eb",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
  },
  editRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  editInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 6,
    padding: 8,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#10b981",
    padding: 8,
    borderRadius: 6,
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  cancelButton: {
    backgroundColor: "#6b7280",
    padding: 8,
    borderRadius: 6,
  },
  cancelButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
  actionButtonText: {
    fontSize: 16,
  },
  startButtonContainer: {
    alignItems: "center",
    marginTop: 32,
    marginBottom: 16,
  },
  startButton: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 40,
    paddingVertical: 18,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  startButtonText: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "700",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
  },
});

export default PlayersView;
