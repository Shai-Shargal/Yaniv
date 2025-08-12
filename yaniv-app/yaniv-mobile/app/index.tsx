import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useGameStore } from "../src/store";
import PlayersView from "../src/components/PlayersView";
import RoundEntry from "../src/components/RoundEntry";
import RoundResults from "../src/components/RoundResults";
import WinnerScreen from "../src/components/WinnerScreen";
import Header from "../src/components/Header";
import FooterBar from "../src/components/FooterBar";
import Settings from "../src/components/Settings";

export default function Page() {
  const { currentView, settings, updateSettings, winner, players } =
    useGameStore();

  // Debug logging
  console.log("Main app render:", {
    currentView,
    winner: winner?.name,
    playersCount: players.length,
  });

  return (
    <SafeAreaProvider>
      <StatusBar style={settings.darkMode ? "light" : "dark"} />
      <Header />
      {currentView === "players" && <PlayersView />}
      {currentView === "round-entry" && <RoundEntry />}
      {currentView === "round-results" && <RoundResults />}
      {currentView === "winner" && winner && <WinnerScreen />}
      {/* Fallback when winner view is set but no winner exists */}
      {currentView === "winner" && !winner && (
        <View
          style={{
            flex: 1,
            backgroundColor: "#f9fafb",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 18, color: "#6b7280" }}>
            Game Over - No Winner Found
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: "#2563eb",
              paddingHorizontal: 24,
              paddingVertical: 16,
              borderRadius: 12,
              marginTop: 20,
            }}
            onPress={() => {
              // Force back to players view
              const { newGame } = useGameStore.getState();
              newGame();
            }}
          >
            <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
              Back to Players
            </Text>
          </TouchableOpacity>
        </View>
      )}
      {/* Fallback to prevent black screen */}
      {!currentView && (
        <View
          style={{
            flex: 1,
            backgroundColor: "#f9fafb",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 18, color: "#6b7280" }}>Loading...</Text>
        </View>
      )}

      {currentView === "settings" && <Settings />}
      <FooterBar />
    </SafeAreaProvider>
  );
}
