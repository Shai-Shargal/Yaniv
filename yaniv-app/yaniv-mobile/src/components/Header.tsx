import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGameStore } from "../store";

const Header = () => {
  const { settings, updateSettings } = useGameStore();
  const insets = useSafeAreaInsets();

  const toggleSettings = () => {
    updateSettings({ rtl: !settings.rtl });
  };

  return (
    <View style={[styles.header, { paddingTop: insets.top }]}>
      <View style={styles.container}>
        <Text style={styles.title}>Yaniv Score</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2563eb",
  },
  settingsButton: {
    padding: 8,
    borderRadius: 8,
  },
  settingsText: {
    fontSize: 16,
    color: "#374151",
  },
});

export default Header;
