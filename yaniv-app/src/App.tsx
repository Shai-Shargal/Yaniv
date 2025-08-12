import { useEffect } from "react";
import { useGameStore } from "./store";
import PlayersView from "./components/PlayersView";
import RoundEntry from "./components/RoundEntry";
import RoundResults from "./components/RoundResults";
import WinnerScreen from "./components/WinnerScreen";
import Header from "./components/Header";
import FooterBar from "./components/FooterBar";
import Settings from "./components/Settings";

function App() {
  const { currentView, settings, updateSettings } = useGameStore();

  // Auto-detect dark mode
  useEffect(() => {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (isDark && !settings.darkMode) {
      updateSettings({ darkMode: true });
    }
  }, [settings.darkMode, updateSettings]);

  // Set RTL direction
  useEffect(() => {
    document.documentElement.dir = settings.rtl ? "rtl" : "ltr";
  }, [settings.rtl]);

  // Set dark mode class
  useEffect(() => {
    document.documentElement.classList.toggle("dark", settings.darkMode);
  }, [settings.darkMode]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header />
      <main className="container mx-auto px-4 py-6 pb-24">
        {currentView === "players" && <PlayersView />}
        {currentView === "round-entry" && <RoundEntry />}
        {currentView === "round-results" && <RoundResults />}
        {currentView === "winner" && <WinnerScreen />}
        {currentView === "settings" && <Settings />}
      </main>
      <FooterBar />
    </div>
  );
}

export default App;
