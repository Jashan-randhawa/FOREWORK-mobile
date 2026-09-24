/**
 * FOREWORK ATS — Score Gauge Disc Component
 *
 * Renders a circular score gauge with dynamic color coding
 * based on the deterministic scoring rubric.
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { getScoreTone } from "../engine/scoring";

interface ScoreDiscProps {
  /** Numeric score (0-100) */
  score: number;
  /** Label displayed below the disc */
  title: string;
  /** Optional badge subtitle */
  subtitle?: string;
  /** Disc diameter in pixels (default: 110) */
  size?: number;
}

export const ScoreDisc: React.FC<ScoreDiscProps> = ({
  score = 0,
  title,
  subtitle,
  size = 110,
}) => {
  const safeScore = Math.min(100, Math.max(0, Math.round(score)));
  const tone = getScoreTone(safeScore);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.disc,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: tone.borderColor,
            backgroundColor: tone.bgColor,
          },
        ]}
      >
        <Text style={[styles.scoreText, { color: tone.textColor }]}>
          {safeScore}
        </Text>
        <Text style={styles.maxLabel}>/ 100</Text>
      </View>

      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

      {subtitle ? (
        <View
          style={[styles.badge, { backgroundColor: tone.badgeBg }]}
        >
          <Text style={[styles.badgeText, { color: tone.badgeText }]}>
            {subtitle}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 8,
    flex: 1,
  },
  disc: {
    borderWidth: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  scoreText: {
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  maxLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#8E8799",
    marginTop: -2,
  },
  title: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
    color: "#1A1A2E",
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 4,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default ScoreDisc;
