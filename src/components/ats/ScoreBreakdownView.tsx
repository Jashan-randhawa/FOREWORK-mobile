import React from "react";
import { View, Text } from "react-native";
import Icon from "../common/Icon";

interface MetricConfig {
  key: string;
  label: string;
  max: number;
  icon: string;
  description: string;
}

const METRIC_CONFIG: MetricConfig[] = [
  {
    key: "parsing",
    label: "Parseability",
    max: 20,
    icon: "file-text",
    description: "Text extraction readability, contact detection, machine-readable format, and layout safety.",
  },
  {
    key: "job_match",
    label: "Job Alignment",
    max: 30,
    icon: "target",
    description: "Required and preferred skill overlap, keyword presence, and technical coverage.",
  },
  {
    key: "experience",
    label: "Experience Relevance",
    max: 20,
    icon: "briefcase",
    description: "Role titles, relevant domain experience, career duration, and responsibility alignment.",
  },
  {
    key: "sections",
    label: "Structure & Sections",
    max: 10,
    icon: "layers",
    description: "Standard section headings, logical order, and resume completeness.",
  },
  {
    key: "qualifications",
    label: "Qualifications",
    max: 10,
    icon: "award",
    description: "Degree level, academic discipline, and certifications aligned with target role.",
  },
  {
    key: "quality",
    label: "Evidence & Quality",
    max: 10,
    icon: "sparkles",
    description: "Active action verbs, quantifiable metrics (% / numbers), and outcome-driven bullets.",
  },
];

interface ScoreBreakdownViewProps {
  breakdown?: Record<string, number>;
  breakdownExplanations?: Record<string, string>;
}

export const ScoreBreakdownView: React.FC<ScoreBreakdownViewProps> = ({
  breakdown = {},
  breakdownExplanations = {},
}) => {
  return (
    <View className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
      <View className="pb-3 border-b border-border">
        <Text className="text-base font-black text-foreground">
          Score Breakdown
        </Text>
        <Text className="text-[11px] text-muted-foreground mt-0.5">
          Component score distribution across FOREWORK's 6 ATS criteria (100 pts total)
        </Text>
      </View>

      <View className="space-y-3">
        {METRIC_CONFIG.map((metric) => {
          const rawScore = breakdown[metric.key] !== undefined ? breakdown[metric.key] : 0;
          const score = Math.min(metric.max, Math.max(0, Math.round(rawScore * 10) / 10));
          const percentage = Math.round((score / metric.max) * 100);
          const explanation = breakdownExplanations[metric.key];

          let barColor = "bg-emerald-500";
          if (percentage < 60) barColor = "bg-rose-500";
          else if (percentage < 80) barColor = "bg-amber-500";

          return (
            <View
              key={metric.key}
              className="p-3 rounded-xl border border-border bg-muted/20 space-y-2"
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2 flex-1">
                  <View className="p-1.5 rounded-lg bg-primary/10">
                    <Icon name={metric.icon} size={14} color="#6B3AC2" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-xs font-bold text-foreground" numberOfLines={1}>
                      {metric.label}
                    </Text>
                    <Text className="text-[10px] text-muted-foreground">
                      Max: {metric.max} pts
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-baseline">
                  <Text className="text-sm font-black text-foreground">
                    {score}
                  </Text>
                  <Text className="text-[11px] text-muted-foreground font-medium">
                    {" "}/ {metric.max}
                  </Text>
                </View>
              </View>

              {/* Progress Bar Container */}
              <View className="w-full bg-border h-2 rounded-full overflow-hidden">
                <View
                  className={`h-full rounded-full ${barColor}`}
                  style={{ width: `${Math.min(100, Math.max(4, percentage))}%` }}
                />
              </View>

              <Text className="text-[10px] text-muted-foreground leading-tight">
                {explanation || metric.description}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default ScoreBreakdownView;
