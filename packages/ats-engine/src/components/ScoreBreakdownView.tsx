/**
 * FOREWORK ATS — Score Breakdown View
 *
 * Renders the 6-category ATS rubric breakdown with progress bars,
 * scores, and explanations.
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { METRIC_CONFIG, clampScore, scorePercentage, getBarColor } from "../engine/scoring";
import { Icon } from "./Icon";

interface ScoreBreakdownViewProps {
  /** Score breakdown by metric key (e.g. { parsing: 18, job_match: 22 }) */
  breakdown?: Record<string, number>;
  /** Optional explanations for each metric key */
  breakdownExplanations?: Record<string, string>;
}

export const ScoreBreakdownView: React.FC<ScoreBreakdownViewProps> = ({
  breakdown = {},
  breakdownExplanations = {},
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Score Breakdown</Text>
        <Text style={styles.headerSubtitle}>
          Component score distribution across FOREWORK's 6 ATS criteria (100 pts total)
        </Text>
      </View>

      <View style={styles.metricsContainer}>
        {METRIC_CONFIG.map((metric) => {
          const rawScore = breakdown[metric.key] !== undefined ? breakdown[metric.key] : 0;
          const score = clampScore(rawScore, metric.max);
          const pct = scorePercentage(rawScore, metric.max);
          const barColor = getBarColor(pct);

          const explanation = breakdownExplanations[metric.key];

          return (
            <View key={metric.key} style={styles.metricRow}>
              <View style={styles.metricHeader}>
                <View style={styles.metricLabelRow}>
                  <View style={styles.iconBox}>
                    <Icon name={metric.icon} size={14} color="#6B3AC2" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.metricLabel} numberOfLines={1}>
                      {metric.label}
                    </Text>
                    <Text style={styles.metricMax}>Max: {metric.max} pts</Text>
                  </View>
                </View>

                <View style={styles.metricScore}>
                  <Text style={styles.scoreValue}>{score}</Text>
                  <Text style={styles.scoreMax}> / {metric.max}</Text>
                </View>
              </View>

              {/* Progress Bar */}
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    {
                      width: `${Math.min(100, Math.max(4, pct))}%` as any,
                      backgroundColor: barColor,
                    },
                  ]}
                />
              </View>

              <Text style={styles.metricDescription}>
                {explanation || metric.description}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    backgroundColor: "#FFFFFF",
    padding: 20,
  },
  header: {
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#1A1A2E",
  },
  headerSubtitle: {
    fontSize: 11,
    color: "#8E8799",
    marginTop: 2,
  },
  metricsContainer: {
    gap: 12,
  },
  metricRow: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    backgroundColor: "#FAFAFA",
    gap: 8,
  },
  metricHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  metricLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  iconBox: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: "rgba(107, 58, 194, 0.1)",
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1A1A2E",
  },
  metricMax: {
    fontSize: 10,
    color: "#8E8799",
  },
  metricScore: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  scoreValue: {
    fontSize: 14,
    fontWeight: "900",
    color: "#1A1A2E",
  },
  scoreMax: {
    fontSize: 11,
    color: "#8E8799",
    fontWeight: "500",
  },
  barTrack: {
    width: "100%",
    height: 8,
    borderRadius: 999,
    backgroundColor: "#E5E5EA",
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 999,
  },
  metricDescription: {
    fontSize: 10,
    color: "#8E8799",
    lineHeight: 14,
  },
});

export default ScoreBreakdownView;
