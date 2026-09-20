import React from "react";
import { View, Text } from "react-native";
import Icon from "../common/Icon";

export interface FormattingIssue {
  severity: string;
  message: string;
  recommendation?: string;
}

interface FormattingIssuesViewProps {
  issues?: FormattingIssue[];
}

const getSeverityStyle = (severity: string) => {
  switch (severity?.toUpperCase()) {
    case "CRITICAL":
      return {
        label: "Critical",
        badgeBg: "#FEE2E2",
        badgeBorder: "#FCA5A5",
        badgeText: "#991B1B",
        iconColor: "#DC2626",
      };
    case "HIGH":
      return {
        label: "High Risk",
        badgeBg: "#FFEDD5",
        badgeBorder: "#FDBA74",
        badgeText: "#9A3412",
        iconColor: "#EA580C",
      };
    case "MEDIUM":
      return {
        label: "Medium Risk",
        badgeBg: "#FEF3C7",
        badgeBorder: "#FCD34D",
        badgeText: "#92400E",
        iconColor: "#D97706",
      };
    default:
      return {
        label: "Notice",
        badgeBg: "#DBEAFE",
        badgeBorder: "#93C5FD",
        badgeText: "#1E40AF",
        iconColor: "#2563EB",
      };
  }
};

export const FormattingIssuesView: React.FC<FormattingIssuesViewProps> = ({
  issues = [],
}) => {
  return (
    <View className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
      <View className="pb-3 border-b border-border">
        <View className="flex-row items-center gap-1.5">
          <Icon name="alert-triangle" size={16} color="#D97706" />
          <Text className="text-base font-black text-foreground">
            Formatting & Parseability
          </Text>
        </View>
        <Text className="text-[11px] text-muted-foreground mt-0.5">
          Detection of layout elements that may present reading risks to automated ATS parsers.
        </Text>
      </View>

      {issues.length === 0 ? (
        <View className="flex-row items-center gap-3 p-4 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/70 dark:bg-emerald-950/30">
          <View className="p-1 rounded-full bg-emerald-100 dark:bg-emerald-900/60">
            <Icon name="check" size={14} color="#059669" />
          </View>
          <View className="flex-1">
            <Text className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
              No significant formatting risks detected!
            </Text>
            <Text className="text-[11px] text-emerald-700 dark:text-emerald-300 mt-0.5">
              Your document follows clean structure, standard fonts, and machine-readable text.
            </Text>
          </View>
        </View>
      ) : (
        <View className="space-y-3">
          {issues.map((issue, idx) => {
            const style = getSeverityStyle(issue.severity);

            return (
              <View
                key={idx}
                className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-2"
              >
                <View className="flex-row items-start justify-between gap-2">
                  <View className="flex-row items-start gap-2 flex-1">
                    <View className="mt-0.5">
                      <Icon name="alert" size={13} color={style.iconColor} />
                    </View>
                    <Text className="text-xs font-bold text-foreground flex-1">
                      {issue.message}
                    </Text>
                  </View>

                  <View
                    style={{
                      backgroundColor: style.badgeBg,
                      borderColor: style.badgeBorder,
                    }}
                    className="rounded-full px-2 py-0.5 border"
                  >
                    <Text
                      style={{ color: style.badgeText }}
                      className="text-[9px] font-black uppercase tracking-wider"
                    >
                      {style.label}
                    </Text>
                  </View>
                </View>

                {issue.recommendation ? (
                  <View className="ml-5 p-2.5 rounded-lg border border-border bg-card">
                    <Text className="text-[11px] text-foreground font-semibold">
                      How to fix:{" "}
                      <Text className="text-[11px] text-muted-foreground font-normal">
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

export default FormattingIssuesView;
