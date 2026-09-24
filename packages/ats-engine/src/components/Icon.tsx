/**
 * FOREWORK ATS — Icon Component
 * Lightweight unicode-glyph icon system for cross-platform rendering.
 */

import React from "react";
import { Text, View, StyleSheet } from "react-native";

interface IconProps {
  name: string;
  size?: number;
  color?: string;
}

const ICON_MAP: Record<string, string> = {
  home: "⌂",
  search: "⚲",
  briefcase: "💼",
  user: "👤",
  check: "✓",
  "check-circle": "✓",
  x: "✕",
  close: "✕",
  sparkles: "✨",
  shield: "🛡️",
  zap: "⚡",
  "file-text": "📄",
  target: "🎯",
  award: "🏆",
  lightbulb: "💡",
  layers: "☰",
  help: "?",
  alert: "⚠",
  "alert-triangle": "⚠",
  send: "➤",
  refresh: "⟳",
  info: "ℹ",
};

export const Icon: React.FC<IconProps> = ({
  name,
  size = 18,
  color = "#6B3AC2",
}) => {
  const glyph = ICON_MAP[name] || "•";

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Text
        style={{
          fontSize: size * 0.85,
          color,
          textAlign: "center",
          lineHeight: size,
          fontWeight: "600",
        }}
      >
        {glyph}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Icon;
