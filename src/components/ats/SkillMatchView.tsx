import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import Icon from "../common/Icon";

interface SkillMatchViewProps {
  matchedSkills?: string[];
  missingRequired?: string[];
  missingPreferred?: string[];
  allMissing?: string[];
}

export const SkillMatchView: React.FC<SkillMatchViewProps> = ({
  matchedSkills = [],
  missingRequired = [],
  missingPreferred = [],
  allMissing = [],
}) => {
  const [filter, setFilter] = useState<"all" | "matched" | "missing">("all");

  const missingReq = missingRequired.length > 0 ? missingRequired : allMissing;
  const missingPref = missingPreferred || [];

  const totalCount = matchedSkills.length + missingReq.length + missingPref.length;
  const missingCount = missingReq.length + missingPref.length;

  return (
    <View className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
      {/* Header with Title & Filter Pills */}
      <View className="space-y-2 pb-3 border-b border-border">
        <View className="flex-row items-center gap-1.5">
          <Icon name="layers" size={16} color="#6B3AC2" />
          <Text className="text-base font-black text-foreground">
            Skills & Keyword Alignment
          </Text>
        </View>
        <Text className="text-[11px] text-muted-foreground">
          Canonical skills detected in your resume compared against target requirements.
        </Text>

        {/* Filter Pills */}
        <View className="flex-row items-center gap-1.5 pt-1.5">
          <Pressable
            onPress={() => setFilter("all")}
            className={`px-3 py-1 rounded-lg border ${
              filter === "all"
                ? "bg-primary border-primary"
                : "bg-muted/30 border-border"
            }`}
          >
            <Text
              className={`text-[11px] font-bold ${
                filter === "all" ? "text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              All ({totalCount})
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setFilter("matched")}
            className={`px-3 py-1 rounded-lg border ${
              filter === "matched"
                ? "bg-emerald-600 border-emerald-600"
                : "bg-muted/30 border-border"
            }`}
          >
            <Text
              className={`text-[11px] font-bold ${
                filter === "matched" ? "text-white" : "text-emerald-600"
              }`}
            >
              Matched ({matchedSkills.length})
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setFilter("missing")}
            className={`px-3 py-1 rounded-lg border ${
              filter === "missing"
                ? "bg-rose-600 border-rose-600"
                : "bg-muted/30 border-border"
            }`}
          >
            <Text
              className={`text-[11px] font-bold ${
                filter === "missing" ? "text-white" : "text-rose-600"
              }`}
            >
              Missing ({missingCount})
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Skills Content */}
      <View className="space-y-4">
        {/* Matched Skills */}
        {(filter === "all" || filter === "matched") && (
          <View className="space-y-2">
            <View className="flex-row items-center gap-1.5">
              <Icon name="check" size={12} color="#059669" />
              <Text className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Matched Skills ({matchedSkills.length})
              </Text>
            </View>

            {matchedSkills.length > 0 ? (
              <View className="flex-row flex-wrap gap-1.5">
                {matchedSkills.map((skill, idx) => (
                  <View
                    key={idx}
                    className="flex-row items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 px-2.5 py-1"
                  >
                    <Icon name="check" size={10} color="#059669" />
                    <Text className="text-[11px] font-medium text-emerald-800 dark:text-emerald-300">
                      {skill}
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text className="text-xs text-muted-foreground italic">
                No direct matching skills detected yet.
              </Text>
            )}
          </View>
        )}

        {/* Missing Required Skills */}
        {(filter === "all" || filter === "missing") && missingReq.length > 0 && (
          <View className="space-y-2 pt-2 border-t border-border">
            <View className="flex-row items-center gap-1.5">
              <Icon name="x" size={12} color="#DC2626" />
              <Text className="text-[11px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">
                Required Skills Not Detected ({missingReq.length})
              </Text>
            </View>

            <View className="flex-row flex-wrap gap-1.5">
              {missingReq.map((skill, idx) => (
                <View
                  key={idx}
                  className="flex-row items-center gap-1 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 px-2.5 py-1"
                >
                  <Icon name="x" size={10} color="#DC2626" />
                  <Text className="text-[11px] font-medium text-rose-800 dark:text-rose-300">
                    {skill}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Missing Preferred Skills */}
        {(filter === "all" || filter === "missing") && missingPref.length > 0 && (
          <View className="space-y-2 pt-2 border-t border-border">
            <View className="flex-row items-center gap-1.5">
              <Icon name="alert" size={12} color="#D97706" />
              <Text className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                Preferred (Bonus) Skills Not Detected ({missingPref.length})
              </Text>
            </View>

            <View className="flex-row flex-wrap gap-1.5">
              {missingPref.map((skill, idx) => (
                <View
                  key={idx}
                  className="flex-row items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 px-2.5 py-1"
                >
                  <Icon name="alert" size={10} color="#D97706" />
                  <Text className="text-[11px] font-medium text-amber-800 dark:text-amber-300">
                    {skill}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default SkillMatchView;
