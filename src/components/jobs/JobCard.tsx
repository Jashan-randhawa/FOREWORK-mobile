import React, { useState } from "react";
import { View, Text, Pressable, Image, Share, Alert } from "react-native";
import { router } from "expo-router";
import { useSelector } from "react-redux";
import API from "../../utils/axiosInstance";
import { JOB_API_ENDPOINT } from "../../utils/endpoints";
import Icon from "../common/Icon";

export interface JobCardProps {
  job: any;
  isSavedInitial?: boolean;
  onUnsaved?: (jobId: string) => void;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  isSavedInitial = false,
  onUnsaved,
}) => {
  const { user } = useSelector((store: any) => store.auth);
  const [isSaved, setIsSaved] = useState(isSavedInitial);
  const [saving, setSaving] = useState(false);

  if (!job) return null;

  const daysAgoFunction = (mongodbTime?: string) => {
    if (!mongodbTime) return "Recently";
    const createdAt = new Date(mongodbTime);
    const currentTime = new Date();
    const timeDifference = currentTime.getTime() - createdAt.getTime();
    const days = Math.floor(timeDifference / (1000 * 24 * 60 * 60));
    return days <= 0 ? "Today" : `${days}d ago`;
  };

  const handleToggleSave = async () => {
    if (!user) {
      Alert.alert("Authentication Required", "Please log in to save jobs", [
        { text: "Cancel", style: "cancel" },
        { text: "Log In", onPress: () => router.push("/(auth)/login") },
      ]);
      return;
    }

    if (user.role === "Recruiter") {
      Alert.alert("Notice", "Only candidate accounts can save jobs.");
      return;
    }

    try {
      setSaving(true);
      if (isSaved) {
        const res = await API.post(`${JOB_API_ENDPOINT}/${job._id}/unsave`);
        if (res.data?.success) {
          setIsSaved(false);
          if (onUnsaved) onUnsaved(job._id);
        }
      } else {
        const res = await API.post(`${JOB_API_ENDPOINT}/${job._id}/save`);
        if (res.data?.success) {
          setIsSaved(true);
        }
      }
    } catch (err: any) {
      Alert.alert("Error", err.response?.data?.message || "Failed to update saved job");
    } finally {
      setSaving(false);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        title: job.title || "Job Opportunity at FOREWORK",
        message: `Check out this opening for ${job.title} at ${job.company?.name || "FOREWORK Partner"}!`,
      });
    } catch (error) {
      // User dismissed share sheet
    }
  };

  const companyName = job.company?.name || job.name || "ForeWork Partner";
  const initial = companyName.charAt(0).toUpperCase() || "C";

  return (
    <Pressable
      onPress={() => router.push(`/description/${job._id}` as any)}
      className="mb-4 rounded-2xl border border-border bg-card p-4 shadow-sm"
    >
      {/* Header: Date + Save/Share actions */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Text className="text-xs text-muted-foreground">{daysAgoFunction(job.createdAt)}</Text>
          {isSaved && (
            <View className="rounded bg-amber-100 dark:bg-amber-950/60 px-1.5 py-0.5 border border-amber-300">
              <Text className="text-[10px] font-bold text-amber-700 dark:text-amber-400">Saved</Text>
            </View>
          )}
        </View>

        <View className="flex-row items-center gap-2">
          <Pressable
            onPress={handleShare}
            hitSlop={8}
            className="h-8 w-8 items-center justify-center rounded-full bg-secondary"
          >
            <Icon name="share" size={14} color="#6B3AC2" />
          </Pressable>
          <Pressable
            onPress={handleToggleSave}
            disabled={saving}
            hitSlop={8}
            className="h-8 w-8 items-center justify-center rounded-full bg-secondary"
          >
            <Icon
              name={isSaved ? "bookmark-check" : "bookmark"}
              size={14}
              color={isSaved ? "#B8860B" : "#6B3AC2"}
            />
          </Pressable>
        </View>
      </View>

      {/* Company Info */}
      <View className="my-2.5 flex-row items-center gap-3">
        {job.company?.logo ? (
          <Image
            source={{ uri: job.company.logo }}
            className="h-10 w-10 rounded-xl bg-muted"
            resizeMode="cover"
          />
        ) : (
          <View className="h-10 w-10 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-950">
            <Text className="text-base font-bold text-primary">{initial}</Text>
          </View>
        )}
        <View className="flex-1">
          <Text className="text-sm font-semibold text-foreground" numberOfLines={1}>
            {companyName}
          </Text>
          <Text className="text-xs text-muted-foreground" numberOfLines={1}>
            {job.location || "Remote / Hybrid"}
          </Text>
        </View>
      </View>

      {/* Job Title & Snippet */}
      <Text className="text-base font-bold text-foreground" numberOfLines={1}>
        {job.title}
      </Text>
      <Text className="mt-1 text-xs text-muted-foreground leading-relaxed" numberOfLines={2}>
        {job.description || "Exciting career opportunity at a fast-growing team. Review details to apply."}
      </Text>

      {/* Badges */}
      <View className="mt-3 flex-row flex-wrap items-center gap-1.5">
        <View className="rounded-md border border-purple-200 dark:border-purple-900 bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5">
          <Text className="text-[11px] font-semibold text-primary">
            {job.jobType || "Full-time"}
          </Text>
        </View>
        <View className="rounded-md border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5">
          <Text className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
            {job.salary ? `${job.salary} LPA` : "Competitive"}
          </Text>
        </View>
        {job.position ? (
          <View className="rounded-md border border-border bg-secondary px-2 py-0.5">
            <Text className="text-[11px] text-muted-foreground font-medium">
              {job.position} {Number(job.position) === 1 ? "Position" : "Positions"}
            </Text>
          </View>
        ) : null}
      </View>

      {/* Action Footer */}
      <View className="mt-3 pt-2.5 border-t border-border flex-row items-center justify-between">
        <Text className="text-[11px] text-muted-foreground">Tap to view requirements</Text>
        <Text className="text-xs font-bold text-primary">View Details →</Text>
      </View>
    </Pressable>
  );
};

export default JobCard;
