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
        if (res.data?.success) setIsSaved(true);
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
    } catch {
      // User dismissed
    }
  };

  const companyName = job.company?.name || job.name || "ForeWork Partner";
  const initial = companyName.charAt(0).toUpperCase() || "C";
  const postedLabel = daysAgoFunction(job.createdAt);
  const isNew = postedLabel === "Today";

  return (
    <Pressable
      onPress={() => router.push(`/description/${job._id}` as any)}
      style={({ pressed }) => ({ opacity: pressed ? 0.95 : 1 })}
      className="mb-4 rounded-3xl border border-border bg-card shadow-sm overflow-hidden"
    >
      {/* Top accent bar — purple gradient effect */}
      <View
        style={{ height: 4, backgroundColor: "#6B3AC2" }}
      />

      <View className="p-4">
        {/* Row 1: Company + Save/Share */}
        <View className="flex-row items-center justify-between mb-3">
          {/* Company logo + name + location */}
          <View className="flex-row items-center gap-3 flex-1 mr-2">
            {job.company?.logo ? (
              <Image
                source={{ uri: job.company.logo }}
                style={{ width: 46, height: 46, borderRadius: 12 }}
                resizeMode="cover"
              />
            ) : (
              <View
                style={{ width: 46, height: 46, borderRadius: 12, backgroundColor: "#EDE9FF" }}
                className="items-center justify-center border border-purple-200"
              >
                <Text style={{ fontSize: 18, fontWeight: "800", color: "#6B3AC2" }}>
                  {initial}
                </Text>
              </View>
            )}
            <View className="flex-1">
              <Text
                className="text-sm font-bold text-foreground"
                numberOfLines={1}
              >
                {companyName}
              </Text>
              <View className="flex-row items-center gap-1 mt-0.5">
                <Text style={{ fontSize: 10 }}>📍</Text>
                <Text className="text-xs text-muted-foreground" numberOfLines={1}>
                  {job.location || "Remote / Hybrid"}
                </Text>
              </View>
            </View>
          </View>

          {/* Actions */}
          <View className="flex-row items-center gap-1.5">
            <Pressable
              onPress={handleShare}
              hitSlop={8}
              className="h-9 w-9 items-center justify-center rounded-2xl bg-secondary"
            >
              <Icon name="share" size={15} color="#6B3AC2" />
            </Pressable>
            <Pressable
              onPress={handleToggleSave}
              disabled={saving}
              hitSlop={8}
              className={`h-9 w-9 items-center justify-center rounded-2xl ${
                isSaved ? "bg-amber-100" : "bg-secondary"
              }`}
            >
              <Icon
                name={isSaved ? "bookmark-check" : "bookmark"}
                size={15}
                color={isSaved ? "#D97706" : "#6B3AC2"}
              />
            </Pressable>
          </View>
        </View>

        {/* Row 2: Job Title */}
        <Text
          className="text-lg font-black text-foreground leading-snug mb-1"
          numberOfLines={2}
        >
          {job.title}
        </Text>

        {/* Row 3: Description snippet */}
        <Text
          className="text-xs text-muted-foreground leading-relaxed mb-3"
          numberOfLines={2}
        >
          {job.description ||
            "Exciting career opportunity at a fast-growing team. Tap to review requirements and apply."}
        </Text>

        {/* Row 4: Badges */}
        <View className="flex-row flex-wrap gap-2 mb-4">
          {/* Job Type */}
          <View
            style={{
              backgroundColor: "#EDE9FF",
              borderColor: "#C4B5FD",
              borderWidth: 1,
              borderRadius: 8,
              paddingHorizontal: 10,
              paddingVertical: 4,
            }}
          >
            <Text style={{ fontSize: 11, fontWeight: "700", color: "#6B3AC2" }}>
              {job.jobType || "Full-time"}
            </Text>
          </View>

          {/* Salary */}
          <View
            style={{
              backgroundColor: "#ECFDF5",
              borderColor: "#6EE7B7",
              borderWidth: 1,
              borderRadius: 8,
              paddingHorizontal: 10,
              paddingVertical: 4,
            }}
          >
            <Text style={{ fontSize: 11, fontWeight: "700", color: "#059669" }}>
              {job.salary ? `₹${job.salary} LPA` : "Competitive"}
            </Text>
          </View>

          {/* Positions */}
          {job.position ? (
            <View
              style={{
                backgroundColor: "#F0F9FF",
                borderColor: "#BAE6FD",
                borderWidth: 1,
                borderRadius: 8,
                paddingHorizontal: 10,
                paddingVertical: 4,
              }}
            >
              <Text style={{ fontSize: 11, fontWeight: "600", color: "#0284C7" }}>
                {job.position} {Number(job.position) === 1 ? "Opening" : "Openings"}
              </Text>
            </View>
          ) : null}

          {/* New badge */}
          {isNew && (
            <View
              style={{
                backgroundColor: "#FFF7ED",
                borderColor: "#FED7AA",
                borderWidth: 1,
                borderRadius: 8,
                paddingHorizontal: 10,
                paddingVertical: 4,
              }}
            >
              <Text style={{ fontSize: 11, fontWeight: "700", color: "#EA580C" }}>
                🔥 New
              </Text>
            </View>
          )}
        </View>

        {/* Row 5: Footer — posted date + CTA */}
        <View className="flex-row items-center justify-between pt-3 border-t border-border">
          <View className="flex-row items-center gap-1.5">
            <Icon name="clock" size={13} color="#8E8799" />
            <Text className="text-xs text-muted-foreground">{postedLabel}</Text>
            {isSaved && (
              <View
                style={{
                  backgroundColor: "#FFFBEB",
                  borderColor: "#FDE68A",
                  borderWidth: 1,
                  borderRadius: 6,
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  marginLeft: 4,
                }}
              >
                <Text style={{ fontSize: 10, fontWeight: "700", color: "#D97706" }}>
                  Saved
                </Text>
              </View>
            )}
          </View>

          {/* CTA Button */}
          <Pressable
            onPress={() => router.push(`/description/${job._id}` as any)}
            style={{
              backgroundColor: "#6B3AC2",
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 8,
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: "800", color: "#FFFFFF" }}>
              Apply Now →
            </Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
};

export default JobCard;
