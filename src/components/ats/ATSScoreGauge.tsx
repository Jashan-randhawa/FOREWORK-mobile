import React from "react";
import { View, Text, Pressable } from "react-native";
import Icon from "../common/Icon";

export interface ScoreTone {
  label: string;
  badge: string;
  borderColor: string;
  bgColor: string;
  textColor: string;
  badgeBg: string;
  badgeText: string;
}

export const getScoreTone = (score: number): ScoreTone => {
  const safeScore = Math.min(100, Math.max(0, Math.round(score)));
  if (safeScore >= 80) {
    return {
      label: "Strong Compatibility",
      badge: "Excellent",
      borderColor: "#10B981",
      bgColor: "#ECFDF5",
      textColor: "#047857",
      badgeBg: "#D1FAE5",
      badgeText: "#065F46",
    };
  }
  if (safeScore >= 60) {
    return {
      label: "Moderate Compatibility",
      badge: "Good",
      borderColor: "#F59E0B",
      bgColor: "#FFFBEB",
      textColor: "#B45309",
      badgeBg: "#FEF3C7",
      badgeText: "#92400E",
    };
  }
  return {
    label: "Needs Optimization",
    badge: "Action Needed",
    borderColor: "#EF4444",
    bgColor: "#FEF2F2",
    textColor: "#B91C1C",
    badgeBg: "#FEE2E2",
    badgeText: "#991B1B",
  };
};

interface GaugeDiscProps {
  score: number;
  title: string;
  subtitle?: string;
  size?: number;
}

export const ScoreDisc: React.FC<GaugeDiscProps> = ({
  score = 0,
  title,
  subtitle,
  size = 110,
}) => {
  const safeScore = Math.min(100, Math.max(0, Math.round(score)));
  const tone = getScoreTone(safeScore);

  return (
    <View className="items-center p-2 flex-1">
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 6,
          borderColor: tone.borderColor,
          backgroundColor: tone.bgColor,
        }}
        className="items-center justify-center shadow-xs"
      >
        <Text
          style={{ color: tone.textColor }}
          className="text-2xl font-black tracking-tight"
        >
          {safeScore}
        </Text>
        <Text className="text-[10px] font-bold text-muted-foreground -mt-0.5">
          / 100
        </Text>
      </View>

      <Text className="mt-2.5 text-xs font-bold text-foreground text-center" numberOfLines={1}>
        {title}
      </Text>

      {subtitle ? (
        <View
          style={{ backgroundColor: tone.badgeBg }}
          className="rounded-full px-2 py-0.5 mt-1 border border-border"
        >
          <Text style={{ color: tone.badgeText }} className="text-[10px] font-semibold text-center">
            {subtitle}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

interface ATSScoreGaugeProps {
  atsCompatibilityScore?: number;
  jobMatchScore?: number | null;
  overallScore?: number;
  confidence?: { extraction: number; matching: number };
  algorithmVersion?: string;
  onOpenWhyModal?: () => void;
}

export const ATSScoreGauge: React.FC<ATSScoreGaugeProps> = ({
  atsCompatibilityScore = 0,
  jobMatchScore = null,
  overallScore = 0,
  confidence = { extraction: 0.95, matching: 0.9 },
  algorithmVersion = "ats_v1.0",
  onOpenWhyModal,
}) => {
  const hasJobMatch = jobMatchScore !== null && jobMatchScore !== undefined;

  return (
    <View className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
      {/* Header */}
      <View className="flex-row items-start justify-between pb-3 border-b border-border">
        <View className="flex-1 pr-2">
          <View className="flex-row items-center gap-2">
            <Text className="text-base font-black text-foreground">
              ATS Analysis Score
            </Text>
            <View className="rounded-md bg-purple-100 dark:bg-purple-950/60 px-2 py-0.5 border border-purple-200 dark:border-purple-800">
              <Text className="text-[10px] font-mono font-bold text-primary">
                {algorithmVersion}
              </Text>
            </View>
          </View>
          <Text className="text-[11px] text-muted-foreground mt-0.5">
            Optimization indicator evaluating machine-readability, structure, and job alignment.
          </Text>
        </View>

        {onOpenWhyModal && (
          <Pressable
            onPress={onOpenWhyModal}
            className="flex-row items-center gap-1 rounded-lg bg-primary/10 px-2.5 py-1.5"
          >
            <Icon name="help" size={12} color="#6B3AC2" />
            <Text className="text-[11px] font-bold text-primary">Why?</Text>
          </Pressable>
        )}
      </View>

      {/* Dual Gauges Layout */}
      <View className="flex-row items-center justify-around py-2">
        <ScoreDisc
          score={atsCompatibilityScore}
          title="ATS Parseability"
          subtitle={getScoreTone(atsCompatibilityScore).label}
        />

        {hasJobMatch ? (
          <ScoreDisc
            score={jobMatchScore}
            title="Job Match Fit"
            subtitle={getScoreTone(jobMatchScore).label}
          />
        ) : (
          <View className="flex-1 items-center justify-center p-3 rounded-xl border border-dashed border-border bg-muted/20">
            <Icon name="shield" size={24} color="#8E8799" />
            <Text className="text-xs font-bold text-foreground mt-1 text-center">
              No Job Provided
            </Text>
            <Text className="text-[10px] text-muted-foreground text-center mt-0.5">
              Select an active job to calculate targeted keyword alignment
            </Text>
          </View>
        )}
      </View>

      {/* Confidence Footer */}
      <View className="pt-3 border-t border-border flex-row items-center justify-between">
        <View className="flex-row items-center gap-1.5">
          <Text className="text-[10px] text-muted-foreground">Extraction Confidence:</Text>
          <Text
            className={`text-[10px] font-bold ${
              confidence.extraction < 0.6 ? "text-rose-600" : "text-emerald-600"
            }`}
          >
            {confidence.extraction < 0.6
              ? "Low"
              : `High (${Math.round(confidence.extraction * 100)}%)`}
          </Text>
        </View>
        <Text className="text-[10px] text-muted-foreground">
          Deterministic rubric
        </Text>
      </View>
    </View>
  );
};

export default ATSScoreGauge;
