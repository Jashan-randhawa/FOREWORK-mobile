import React from "react";
import { Text, View, StyleSheet } from "react-native";

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  className?: string;
}

// Map common icon names to visual unicode / SVG-like glyph symbols for universal cross-platform rendering
// without external runtime binary font loading issues.
const ICON_MAP: Record<string, string> = {
  home: "⌂",
  search: "⚲",
  briefcase: "💼",
  user: "👤",
  bookmark: "🔖",
  "bookmark-check": "🏷️",
  bell: "🔔",
  calendar: "📅",
  clock: "🕒",
  filter: "⚡",
  share: "↗",
  check: "✓",
  "check-circle": "✓",
  circle: "○",
  close: "✕",
  x: "✕",
  "arrow-right": "→",
  "arrow-left": "←",
  "arrow-up-right": "↗",
  sparkles: "✨",
  shield: "🛡️",
  zap: "⚡",
  building: "🏢",
  video: "📹",
  mail: "✉",
  phone: "📞",
  lock: "🔒",
  eye: "👁",
  "eye-off": "🙈",
  edit: "✎",
  trash: "🗑",
  info: "ℹ",
  plus: "+",
  chevronLeft: "‹",
  chevronRight: "›",
  "file-text": "📄",
  target: "🎯",
  award: "🏆",
  lightbulb: "💡",
  layers: "☰",
  help: "?",
  alert: "⚠",
  "alert-triangle": "⚠",
  github: "🐙",
  send: "➤",
  refresh: "⟳",
};

export const Icon: React.FC<IconProps> = ({
  name,
  size = 18,
  color = "#6B3AC2",
  className,
}) => {
  const glyph = ICON_MAP[name] || "•";

  return (
    <View style={[styles.container, { width: size, height: size }]} className={className}>
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
