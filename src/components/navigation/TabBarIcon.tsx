import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Icon from "../common/Icon";

interface TabBarIconProps {
  name: string;
  focused: boolean;
  color: string;
  label: string;
  size?: number;
}

// Tab config with emoji fallback glyphs for maximum visibility
const TAB_CONFIG: Record<string, { emoji: string; activeEmoji: string }> = {
  home:      { emoji: "⌂",  activeEmoji: "⌂"  },
  briefcase: { emoji: "💼", activeEmoji: "💼" },
  search:    { emoji: "🔍", activeEmoji: "🔍" },
  user:      { emoji: "👤", activeEmoji: "👤" },
};

const PURPLE = "#6B3AC2";
const PURPLE_LIGHT = "#EDE9FF";
const INACTIVE = "#A09BB8";

export const TabBarIcon: React.FC<TabBarIconProps> = ({
  name,
  focused,
  label,
  size = 22,
}) => {
  const config = TAB_CONFIG[name] || { emoji: "●", activeEmoji: "●" };

  if (focused) {
    // Active: pill shape with purple background, emoji + label side by side
    return (
      <View style={styles.activePill}>
        <Text style={styles.activeEmoji}>{config.activeEmoji}</Text>
        <Text style={styles.activeLabel}>{label}</Text>
      </View>
    );
  }

  // Inactive: just the emoji, slightly muted
  return (
    <View style={styles.inactiveWrap}>
      <Text style={[styles.inactiveEmoji, { fontSize: size * 0.9 }]}>
        {config.emoji}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  activePill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: PURPLE_LIGHT,
    borderRadius: 100,
    paddingHorizontal: 14,
    paddingVertical: 7,
    gap: 6,
    // subtle purple glow
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  activeEmoji: {
    fontSize: 17,
    lineHeight: 20,
  },
  activeLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: PURPLE,
    letterSpacing: 0.2,
  },
  inactiveWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
  },
  inactiveEmoji: {
    opacity: 0.65,
    lineHeight: 24,
  },
});

export default TabBarIcon;
