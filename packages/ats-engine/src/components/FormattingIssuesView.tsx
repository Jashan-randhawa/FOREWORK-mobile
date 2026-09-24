/**
 * FOREWORK ATS — Formatting Issues View
 *
 * Displays detected formatting and parseability risks
 * with severity badges and remediation tips.
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { getSeverityStyle } from "../engine/scoring";
import { Icon } from "./Icon";
import type { FormattingIssue } from "../types";

interface FormattingIssuesViewProps {
  issues?: FormattingIssue[];
}

export const FormattingIssuesView: React.FC<FormattingIssuesViewProps> = ({
  issues = [],
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Icon name="alert-triangle" size={16} color="#D97706" />
          <Text style={styles.headerTitle}>Formatting & Parseability</Text>
        </View>
        <Text style={styles.headerSubtitle}>
          Detection of layout elements that may present reading risks to automated ATS parsers.
        </Text>
      </View>

      {issues.length === 0 ? (
        <View style={styles.successCard}>
          <View style={styles.successIcon}>
            <Icon name="check" size={14} color="#059669" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.successTitle}>
              No significant formatting risks detected!
            </Text>
            <Text style={styles.successSubtitle}>
              Your document follows clean structure, standard fonts, and machine-readable text.
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.issuesList}>
          {issues.map((issue, idx) => {
            const style = getSeverityStyle(issue.severity);

            return (
              <View key={idx} style={styles.issueCard}>
                <View style={styles.issueHeader}>
                  <View style={styles.issueMessage}>
                    <View style={{ marginTop: 2 }}>
                      <Icon name="alert" size={13} color={style.iconColor} />
                    </View>
                    <Text style={styles.issueText}>{issue.message}</Text>
                  </View>

                  <View
                    style={[
                      styles.severityBadge,
                      {
                        backgroundColor: style.badgeBg,
                        borderColor: style.badgeBorder,
                      },
                    ]}
                  >
                    <Text style={[styles.severityText, { color: style.badgeText }]}>
                      {style.label}
                    </Text>
                  </View>
                </View>

                {issue.recommendation ? (
                  <View style={styles.fixBox}>
                    <Text style={styles.fixLabel}>
                      How to fix:{" "}
                      <Text style={styles.fixContent}>
                        {issue.recommendation}
                      </Text>
                    </Text>
                  </View>
                ) : null}
              </View>
            );
          })}
        </View>
      )}
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
  successCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#6EE7B7",
    backgroundColor: "rgba(236, 253, 245, 0.7)",
  },
  successIcon: {
    padding: 4,
    borderRadius: 999,
    backgroundColor: "#D1FAE5",
  },
  successTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#064E3B",
  },
  successSubtitle: {
    fontSize: 11,
    color: "#047857",
    marginTop: 2,
  },
  issuesList: {
    gap: 12,
  },
  issueCard: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    backgroundColor: "#FAFAFA",
    gap: 8,
  },
  issueHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
  },
  issueMessage: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    flex: 1,
  },
  issueText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1A1A2E",
    flex: 1,
  },
  severityBadge: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
  },
  severityText: {
    fontSize: 9,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  fixBox: {
    marginLeft: 20,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    backgroundColor: "#FFFFFF",
  },
  fixLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#1A1A2E",
  },
  fixContent: {
    fontSize: 11,
    fontWeight: "400",
    color: "#8E8799",
  },
});

export default FormattingIssuesView;
