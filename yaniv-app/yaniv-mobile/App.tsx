import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useGameStore } from "./src/store";
import PlayersView from "./src/components/PlayersView";
import RoundEntry from "./src/components/RoundEntry";
import RoundResults from "./src/components/RoundResults";
import WinnerScreen from "./src/components/WinnerScreen";
import Header from "./src/components/Header";
import FooterBar from "./src/components/FooterBar";
import Settings from "./src/components/Settings";

export default function App() {
  const { currentView, settings, updateSettings } = useGameStore();

  return (
    <SafeAreaProvider>
      <StatusBar style={settings.darkMode ? "light" : "dark"} />
      <Header />
      {currentView === "players" && <PlayersView />}
      {currentView === "round-entry" && <RoundEntry />}
      {currentView === "round-results" && <RoundResults />}
      {currentView === "winner" && <WinnerScreen />}
      {currentView === "settings" && <Settings />}
      <FooterBar />
    </SafeAreaProvider>
  );
}
