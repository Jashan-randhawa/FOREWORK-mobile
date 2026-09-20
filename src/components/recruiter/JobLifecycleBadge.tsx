import React from "react";
import { View, Text } from "react-native";

interface JobLifecycleBadgeProps {
  status?: string;
}

export const JobLifecycleBadge: React.FC<JobLifecycleBadgeProps> = ({
  status = "published",
}) => {
  const normalized = (status || "published").toLowerCase();

  switch (normalized) {
    case "published":
      return (
        <View className="rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 px-2.5 py-0.5 self-start">
          <Text className="text-[10px] font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
            ● Active
          </Text>
        </View>
      );
    case "paused":
      return (
        <View className="rounded-full bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 px-2.5 py-0.5 self-start">
          <Text className="text-[10px] font-black uppercase tracking-wider text-amber-800 dark:text-amber-300">
            ❚❚ Paused
          </Text>
        </View>
      );
    case "closed":
      return (
        <View className="rounded-full bg-muted border border-border px-2.5 py-0.5 self-start">
          <Text className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
            ✕ Closed
          </Text>
        </View>
      );
    case "draft":
      return (
        <View className="rounded-full bg-blue-100 dark:bg-blue-950/60 border border-blue-300 dark:border-blue-800 px-2.5 py-0.5 self-start">
          <Text className="text-[10px] font-black uppercase tracking-wider text-blue-800 dark:text-blue-300">
            ✎ Draft
          </Text>
        </View>
      );
    case "expired":
      return (
        <View className="rounded-full bg-rose-100 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 px-2.5 py-0.5 self-start">
          <Text className="text-[10px] font-black uppercase tracking-wider text-rose-800 dark:text-rose-300">
            ⏱ Expired
          </Text>
        </View>
      );
    default:
      return (
        <View className="rounded-full bg-muted border border-border px-2.5 py-0.5 self-start">
          <Text className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
            {status}
          </Text>
        </View>
      );
  }
};

export default JobLifecycleBadge;
