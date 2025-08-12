import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGameStore } from "../store";

const Settings = () => {
  const { settings, updateSettings } = useGameStore();
  const insets = useSafeAreaInsets();

  const toggleDarkMode = () => {
    updateSettings({ darkMode: !settings.darkMode });
  };

  const toggleRTL = () => {
    updateSettings({ rtl: !settings.rtl });
  };

  const toggleAsafOnTie = () => {
    updateSettings({ asafOnTie: !settings.asafOnTie });
  };

  const togglePersistence = () => {
    updateSettings({ persistence: !settings.persistence });
  };

  return (
    <ScrollView
      style={[styles.container, { paddingBottom: insets.bottom + 80 }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Customize your game experience</Text>
      </View>

      {/* Game Rules */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Game Rules</Text>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Asaf on Tie</Text>
            <Text style={styles.settingDescription}>
              Allow Asaf when scores are equal (not just lower)
            </Text>
          </View>
          <Switch
            value={settings.asafOnTie}
            onValueChange={toggleAsafOnTie}
            trackColor={{ false: "#d1d5db", true: "#2563eb" }}
            thumbColor={settings.asafOnTie ? "#ffffff" : "#ffffff"}
          />
        </View>
      </View>

      {/* App Settings */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>App Settings</Text>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Dark Mode</Text>
            <Text style={styles.settingDescription}>
              Use dark theme for the app
            </Text>
          </View>
          <Switch
            value={settings.darkMode}
            onValueChange={toggleDarkMode}
            trackColor={{ false: "#d1d5db", true: "#2563eb" }}
            thumbColor={settings.darkMode ? "#ffffff" : "#ffffff"}
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Right-to-Left</Text>
            <Text style={styles.settingDescription}>Support RTL languages</Text>
          </View>
          <Switch
            value={settings.rtl}
            onValueChange={toggleRTL}
            trackColor={{ false: "#d1d5db", true: "#2563eb" }}
            thumbColor={settings.rtl ? "#ffffff" : "#ffffff"}
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Data Persistence</Text>
            <Text style={styles.settingDescription}>
              Save game data between sessions
            </Text>
          </View>
          <Switch
            value={settings.persistence}
            onValueChange={togglePersistence}
            trackColor={{ false: "#d1d5db", true: "#2563eb" }}
            thumbColor={settings.persistence ? "#ffffff" : "#ffffff"}
          />
        </View>
      </View>

      {/* About */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>About</Text>

        <View style={styles.aboutRow}>
          <Text style={styles.aboutLabel}>Version</Text>
          <Text style={styles.aboutValue}>1.0.0</Text>
        </View>

        <View style={styles.aboutRow}>
          <Text style={styles.aboutLabel}>Game</Text>
          <Text style={styles.aboutValue}>Yaniv Card Game</Text>
        </View>

        <Text style={styles.aboutDescription}>
          Yaniv is a popular card game where players try to get the lowest
          score. Call "Yaniv" when you think you have the lowest hand, but be
          careful - if someone else has a lower or equal score, you'll get
          penalized!
        </Text>
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
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
  },
  aboutRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  aboutLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
  },
  aboutValue: {
    fontSize: 16,
    color: "#6b7280",
  },
  aboutDescription: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
    marginTop: 16,
    textAlign: "center",
  },
});

export default Settings;
