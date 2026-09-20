import React from "react";
import { View, Text } from "react-native";
import Icon from "../common/Icon";

export interface Recommendation {
  priority: string;
  category?: string;
  title: string;
  description: string;
  actionable_tip?: string;
}

interface RecommendationsViewProps {
  recommendations?: Recommendation[];
}

const getPriorityStyle = (priority: string) => {
  switch (priority?.toUpperCase()) {
    case "CRITICAL":
      return {
        badge: "Critical Priority",
        badgeBg: "#FEE2E2",
        badgeBorder: "#FCA5A5",
        badgeText: "#991B1B",
        accentColor: "#EF4444",
      };
    case "HIGH":
      return {
        badge: "High Priority",
        badgeBg: "#FFEDD5",
        badgeBorder: "#FDBA74",
        badgeText: "#9A3412",
        accentColor: "#F97316",
      };
    case "MEDIUM":
      return {
        badge: "Medium Priority",
        badgeBg: "#FEF3C7",
        badgeBorder: "#FCD34D",
        badgeText: "#92400E",
        accentColor: "#F59E0B",
      };
    default:
      return {
        badge: "Improvement Tip",
        badgeBg: "#DBEAFE",
        badgeBorder: "#93C5FD",
        badgeText: "#1E40AF",
        accentColor: "#3B82F6",
      };
  }
};

export const RecommendationsView: React.FC<RecommendationsViewProps> = ({
  recommendations = [],
}) => {
  return (
    <View className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
      <View className="pb-3 border-b border-border">
        <View className="flex-row items-center gap-1.5">
          <Icon name="lightbulb" size={16} color="#6B3AC2" />
          <Text className="text-base font-black text-foreground">
            Optimization Recommendations
          </Text>
        </View>
        <Text className="text-[11px] text-muted-foreground mt-0.5">
          Prioritized suggestions to improve parseability, alignment, and ATS score.
        </Text>
      </View>

      <View className="space-y-3">
        {recommendations.map((rec, index) => {
          const style = getPriorityStyle(rec.priority);

          return (
            <View
              key={index}
              style={{ borderLeftColor: style.accentColor, borderLeftWidth: 4 }}
              className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-2"
            >
              <View className="flex-row items-start justify-between gap-2">
                <View className="flex-1">
                  <Text className="text-[10px] font-bold uppercase tracking-wider text-primary">
                    {rec.category || "Optimization"}
                  </Text>
                  <Text className="text-xs font-bold text-foreground mt-0.5">
                    {index + 1}. {rec.title}
                  </Text>
                </View>

                <View
                  style={{
                    backgroundColor: style.badgeBg,
                    borderColor: style.badgeBorder,
                  }}
                  className="rounded-full px-2 py-0.5 border shrink-0"
                >
                  <Text
                    style={{ color: style.badgeText }}
                    className="text-[9px] font-black uppercase tracking-wider"
                  >
                    {style.badge}
                  </Text>
                </View>
              </View>

              <Text className="text-xs text-muted-foreground leading-relaxed">
                {rec.description}
              </Text>

              {rec.actionable_tip ? (
                <View className="p-2.5 bg-card rounded-lg border border-purple-200 dark:border-purple-900/40">
                  <View className="flex-row items-start gap-1.5">
                    <Text className="text-xs text-primary font-bold">↗</Text>
                    <View className="flex-1">
                      <Text className="text-[11px] font-bold text-foreground">
                        Recommended Action:
                      </Text>
                      <Text className="text-[11px] text-muted-foreground mt-0.5">
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
      <View className="pt-2 flex-row items-center gap-2">
        <Icon name="shield" size={14} color="#D97706" />
        <Text className="text-[10px] text-muted-foreground flex-1">
          Never add unverified skills or inflate experience. Strong resumes reflect factual, measurable accomplishments.
        </Text>
      </View>
    </View>
  );
};

export default RecommendationsView;
