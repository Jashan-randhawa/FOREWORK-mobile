import React from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  Linking,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { router } from "expo-router";
import { useSelector } from "react-redux";
import useGetAllAppliedJobs from "../src/hooks/useGetAllAppliedJobs";
import Icon from "../src/components/common/Icon";

export default function ApplicationsScreen() {
  const { loading, error, refetch } = useGetAllAppliedJobs();
  const { allAppliedJobs = [] } = useSelector((store: any) => store.job);

  const stats = {
    total: allAppliedJobs.length,
    pending: allAppliedJobs.filter((a: any) => (a?.status || "pending").toLowerCase() === "pending").length,
    accepted: allAppliedJobs.filter((a: any) => (a?.status || "").toLowerCase() === "accepted").length,
    interviews: allAppliedJobs.filter((a: any) => Boolean(a?.scheduledAt)).length,
  };

  const getStatusBadge = (status: string) => {
    const s = (status || "pending").toLowerCase();
    if (s === "accepted") {
      return { label: "Accepted", bg: "bg-emerald-50 dark:bg-emerald-950/40", border: "border-emerald-300", text: "text-emerald-700 dark:text-emerald-400" };
    }
    if (s === "rejected") {
      return { label: "Rejected", bg: "bg-rose-50 dark:bg-rose-950/40", border: "border-rose-300", text: "text-rose-700 dark:text-rose-400" };
    }
    return { label: "In Review", bg: "bg-amber-50 dark:bg-amber-950/40", border: "border-amber-300", text: "text-amber-700 dark:text-amber-400" };
  };

  return (
    <SafeAreaView className="flex-1 bg-background" style={{ flex: 1 }}>
      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-border px-5 py-3 bg-card">
        <Pressable onPress={() => router.back()} className="flex-row items-center gap-1">
          <Text className="text-base font-bold text-primary">←</Text>
          <Text className="text-xs font-bold text-foreground">Back</Text>
        </Pressable>
        <Text className="text-sm font-bold text-foreground">Application Telemetry</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={allAppliedJobs}
        keyExtractor={(item) => item._id}
        refreshing={loading}
        onRefresh={refetch}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        ListHeaderComponent={
          <View className="mb-4">
            <Text className="text-xl font-black text-foreground">My Applications</Text>
            <Text className="text-xs text-muted-foreground mt-0.5 mb-4">
              Real-time review updates and interview invitations from employers.
            </Text>

            {/* Stats Grid */}
            <View className="flex-row gap-2.5">
              <View className="flex-1 rounded-2xl border border-border bg-card p-3 shadow-xs">
                <Text className="text-[10px] uppercase font-bold text-muted-foreground">Total</Text>
                <Text className="text-lg font-black text-foreground mt-0.5">{stats.total}</Text>
              </View>

              <View className="flex-1 rounded-2xl border border-border bg-card p-3 shadow-xs">
                <Text className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400">Review</Text>
                <Text className="text-lg font-black text-foreground mt-0.5">{stats.pending}</Text>
              </View>

              <View className="flex-1 rounded-2xl border border-border bg-card p-3 shadow-xs">
                <Text className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">Accepted</Text>
                <Text className="text-lg font-black text-foreground mt-0.5">{stats.accepted}</Text>
              </View>

              <View className="flex-1 rounded-2xl border border-border bg-card p-3 shadow-xs">
                <Text className="text-[10px] uppercase font-bold text-primary">Interviews</Text>
                <Text className="text-lg font-black text-foreground mt-0.5">{stats.interviews}</Text>
              </View>
            </View>
          </View>
        }
        renderItem={({ item }) => {
          const badge = getStatusBadge(item.status);
          const appliedDate = item.createdAt
            ? new Date(item.createdAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "Recently";

          return (
            <Pressable
              onPress={() => item.job?._id && router.push(`/description/${item.job._id}` as any)}
              className="mb-3.5 rounded-2xl border border-border bg-card p-4 shadow-sm"
            >
              <View className="flex-row items-start justify-between gap-2">
                <View className="flex-1">
                  <Text className="text-sm font-bold text-foreground" numberOfLines={1}>
                    {item.job?.title || "Application"}
                  </Text>
                  <Text className="text-xs text-primary font-semibold mt-0.5">
                    {item.job?.company?.name || "ForeWork Partner"}
                  </Text>
                </View>

                <View className={`rounded-md border px-2 py-0.5 ${badge.bg} ${badge.border}`}>
                  <Text className={`text-[10px] font-bold ${badge.text}`}>
                    {badge.label}
                  </Text>
                </View>
              </View>

              <View className="mt-3 flex-row items-center justify-between text-xs text-muted-foreground border-t border-border pt-2.5">
                <Text className="text-[11px] text-muted-foreground">Applied on {appliedDate}</Text>
                <Text className="text-[11px] font-bold text-primary">View Job →</Text>
              </View>

              {/* Scheduled Interview Card */}
              {item.scheduledAt ? (
                <View className="mt-3 rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50/70 dark:bg-purple-950/40 p-3">
                  <View className="flex-row items-center gap-1.5 mb-1">
                    <Icon name="calendar" size={13} color="#6B3AC2" />
                    <Text className="text-xs font-bold text-foreground">Interview Scheduled</Text>
                  </View>
                  <Text className="text-[11px] text-muted-foreground">
                    📅 {new Date(item.scheduledAt).toLocaleString()}
                  </Text>
                  {item.meetingLink ? (
                    <Pressable
                      onPress={() => Linking.openURL(item.meetingLink)}
                      className="mt-2 rounded-lg bg-primary py-1.5 items-center"
                    >
                      <Text className="text-xs font-bold text-primary-foreground">
                        Join Video Meeting ↗
                      </Text>
                    </Pressable>
                  ) : null}
                </View>
              ) : null}
            </Pressable>
          );
        }}
        ListEmptyComponent={
          loading ? (
            <View className="py-20 items-center justify-center">
              <ActivityIndicator size="large" color="#6B3AC2" />
              <Text className="text-xs text-muted-foreground mt-2">Loading applications...</Text>
            </View>
          ) : (
            <View className="py-20 items-center justify-center">
              <Icon name="briefcase" size={36} color="#8E8799" />
              <Text className="text-base font-bold text-foreground mt-2">No Applications Yet</Text>
              <Text className="text-xs text-muted-foreground text-center mt-1 max-w-xs">
                When you apply to positions, live tracking telemetry and interview invitations will appear here.
              </Text>
              <Pressable
                onPress={() => router.push("/(tabs)/jobs")}
                className="mt-4 rounded-xl bg-primary px-4 py-2"
              >
                <Text className="text-xs font-bold text-primary-foreground">Browse Positions</Text>
              </Pressable>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
}
