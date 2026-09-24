/**
 * FOREWORK ATS — Recommendations View
 *
 * Displays prioritized optimization recommendations with
 * severity-coded accent borders and actionable tips.
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { getPriorityStyle } from "../engine/scoring";
import { Icon } from "./Icon";
import type { Recommendation } from "../types";

interface RecommendationsViewProps {
  recommendations?: Recommendation[];
}

export const RecommendationsView: React.FC<RecommendationsViewProps> = ({
  recommendations = [],
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Icon name="lightbulb" size={16} color="#6B3AC2" />
          <Text style={styles.headerTitle}>Optimization Recommendations</Text>
        </View>
        <Text style={styles.headerSubtitle}>
          Prioritized suggestions to improve parseability, alignment, and ATS score.
        </Text>
      </View>

      <View style={styles.recList}>
        {recommendations.map((rec, index) => {
          const style = getPriorityStyle(rec.priority);

          return (
            <View
              key={index}
              style={[
                styles.recCard,
                { borderLeftColor: style.accentColor, borderLeftWidth: 4 },
              ]}
            >
              <View style={styles.recHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.recCategory}>
                    {rec.category || "Optimization"}
                  </Text>
                  <Text style={styles.recTitle}>
                    {index + 1}. {rec.title}
                  </Text>
                </View>

                <View
                  style={[
                    styles.priorityBadge,
                    {
                      backgroundColor: style.badgeBg,
                      borderColor: style.badgeBorder,
                    },
                  ]}
                >
                  <Text style={[styles.priorityText, { color: style.badgeText }]}>
                    {style.badge}
                  </Text>
                </View>
              </View>

              <Text style={styles.recDescription}>{rec.description}</Text>

              {rec.actionable_tip ? (
                <View style={styles.tipBox}>
                  <View style={styles.tipRow}>
                    <Text style={styles.tipArrow}>↗</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.tipLabel}>Recommended Action:</Text>
                      <Text style={styles.tipContent}>
                        {rec.actionable_tip}
                      </Text>
                    </View>
                  </View>
                </View>
              ) : null}
            </View>
          );
        })}
      </View>

      {/* Authenticity note */}
      <View style={styles.disclaimer}>
        <Icon name="shield" size={14} color="#D97706" />
        <Text style={styles.disclaimerText}>
          Never add unverified skills or inflate experience. Strong resumes reflect factual, measurable accomplishments.
        </Text>
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
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
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
  recList: {
    gap: 12,
  },
  recCard: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    backgroundColor: "#FAFAFA",
    gap: 8,
  },
  recHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
  },
  recCategory: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: "#6B3AC2",
  },
  recTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1A1A2E",
    marginTop: 2,
  },
  priorityBadge: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
    flexShrink: 0,
  },
  priorityText: {
    fontSize: 9,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  recDescription: {
    fontSize: 12,
    color: "#8E8799",
    lineHeight: 18,
  },
  tipBox: {
    padding: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(107, 58, 194, 0.2)",
  },
  tipRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
  },
  tipArrow: {
    fontSize: 12,
    color: "#6B3AC2",
    fontWeight: "700",
  },
  tipLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#1A1A2E",
  },
  tipContent: {
    fontSize: 11,
    color: "#8E8799",
    marginTop: 2,
  },
  disclaimer: {
    marginTop: 8,
    paddingTop: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  disclaimerText: {
    fontSize: 10,
    color: "#8E8799",
    flex: 1,
  },
});

export default RecommendationsView;
