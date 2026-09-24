import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from "react-native";
import { router } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import API from "../../src/utils/axiosInstance";
import { JOB_API_ENDPOINT } from "../../src/utils/endpoints";
import { setAllAdminJobs } from "../../src/redux/jobSlice";
import useGetAllAdminJobs from "../../src/hooks/useGetAllAdminJobs";
import Icon from "../../src/components/common/Icon";
import RecruiterGuard from "../../src/components/recruiter/RecruiterGuard";
import JobLifecycleBadge from "../../src/components/recruiter/JobLifecycleBadge";
import JobAnalyticsModal from "../../src/components/recruiter/JobAnalyticsModal";

export default function RecruiterJobsScreen() {
  const dispatch = useDispatch();
  const { loading, refetch } = useGetAllAdminJobs();
  const { allAdminJobs = [] } = useSelector((store: any) => store.job);

  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Analytics modal state
  const [analyticsJob, setAnalyticsJob] = useState<any>(null);

  const filteredJobs = allAdminJobs.filter((job: any) => {
    const titleMatch = (job.title || "").toLowerCase().includes(search.toLowerCase());
    const compMatch = (job.company?.name || "").toLowerCase().includes(search.toLowerCase());
    return titleMatch || compMatch;
  });

  const handleStatusChange = async (jobId: string, nextStatus: string) => {
    try {
      setUpdatingId(jobId);
      const res = await API.put(`${JOB_API_ENDPOINT}/${jobId}/status`, {
        status: nextStatus,
      });

      if (res.data?.success || res.data?.status) {
        // Update job status in Redux
        const updated = allAdminJobs.map((j: any) =>
          j._id === jobId ? { ...j, status: nextStatus } : j
        );
        dispatch(setAllAdminJobs(updated));
        Alert.alert("Status Updated", `Job status updated to ${nextStatus}.`);
      } else {
        Alert.alert("Notice", res.data?.message || "Failed to update job status.");
      }
    } catch (err: any) {
      Alert.alert(
        "Update Error",
        err.response?.data?.message || err.message || "Failed to change job lifecycle status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <RecruiterGuard>
      <SafeAreaView className="flex-1 bg-background" style={{ flex: 1 }}>
        {/* Top Header */}
        <View className="flex-row items-center justify-between border-b border-border px-5 py-3.5 bg-card">
          <Pressable onPress={() => router.back()} className="flex-row items-center gap-1.5">
            <Text className="text-base font-bold text-primary">←</Text>
            <Text className="text-xs font-bold text-foreground">Back</Text>
          </Pressable>
          <Text className="text-sm font-black text-foreground">Job Openings</Text>
          <Pressable
            onPress={() => router.push("/recruiter/create-job" as any)}
            className="flex-row items-center gap-1 rounded-lg bg-primary px-2.5 py-1.5"
          >
            <Icon name="plus" size={12} color="#FFFFFF" />
            <Text className="text-[11px] font-bold text-primary-foreground">Post</Text>
          </Pressable>
        </View>

        <ScrollView
          className="flex-1 px-4 py-4"
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 48 }}
        >
          {/* Search Input */}
          <View className="rounded-xl border border-border bg-card px-3.5 py-2.5 flex-row items-center gap-2 mb-4">
            <Icon name="search" size={14} color="#8E8799" />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search by role title or company..."
              placeholderTextColor="#8E8799"
              className="flex-1 text-xs text-foreground p-0"
            />
            {search ? (
              <Pressable onPress={() => setSearch("")}>
                <Icon name="x" size={14} color="#8E8799" />
              </Pressable>
            ) : null}
          </View>

          {/* Job List */}
          {loading ? (
            <View className="py-20 items-center justify-center">
              <ActivityIndicator color="#6B3AC2" size="large" />
              <Text className="text-xs text-muted-foreground mt-2 font-medium">
                Loading posted positions...
              </Text>
            </View>
          ) : filteredJobs.length > 0 ? (
            <View className="space-y-3.5 mb-10">
              {filteredJobs.map((job: any) => {
                const isUpdating = updatingId === job._id;
                const status = (job.status || "published").toLowerCase();

                return (
                  <View
                    key={job._id}
                    className="rounded-2xl border border-border bg-card p-4 space-y-3 shadow-2xs"
                  >
                    {/* Header */}
                    <View className="flex-row items-start justify-between">
                      <View className="flex-1 pr-2">
                        <Text className="text-[11px] font-semibold text-primary" numberOfLines={1}>
                          🏢 {job.company?.name || "Company"}
                        </Text>
                        <Text className="text-base font-black text-foreground mt-0.5" numberOfLines={1}>
                          {job.title}
                        </Text>
                        <Text className="text-[11px] text-muted-foreground mt-0.5">
                          📍 {job.location || "Remote"} • ₹ {job.salary ? `${job.salary} LPA` : "Not disclosed"}
                        </Text>
                      </View>

                      <JobLifecycleBadge status={job.status} />
                    </View>

                    {/* Stats & Metadata */}
                    <View className="flex-row items-center gap-4 py-2 border-y border-border">
                      <View className="flex-row items-center gap-1.5">
                        <Icon name="briefcase" size={12} color="#6B3AC2" />
                        <Text className="text-xs font-bold text-foreground">
                          {job.applications?.length || 0} Applicants
                        </Text>
                      </View>

                      <View className="flex-row items-center gap-1.5">
                        <Icon name="eye" size={12} color="#8E8799" />
                        <Text className="text-xs text-muted-foreground">
                          {job.views || 0} Views
                        </Text>
                      </View>

                      <Text className="text-[10px] text-muted-foreground ml-auto">
                        {new Date(job.createdAt).toLocaleDateString()}
                      </Text>
                    </View>

                    {/* Status Switcher Bar */}
                    <View className="flex-row items-center justify-between gap-1.5 bg-muted/30 p-1.5 rounded-xl">
                      <Text className="text-[10px] font-bold text-muted-foreground pl-1">
                        Lifecycle:
                      </Text>

                      {status !== "published" && (
                        <Pressable
                          onPress={() => handleStatusChange(job._id, "published")}
                          disabled={isUpdating}
                          className="px-2 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300"
                        >
                          <Text className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300">
                            Publish
                          </Text>
                        </Pressable>
                      )}

                      {status !== "paused" && (
                        <Pressable
                          onPress={() => handleStatusChange(job._id, "paused")}
                          disabled={isUpdating}
                          className="px-2 py-1 rounded-lg bg-amber-100 dark:bg-amber-950/60 border border-amber-300"
                        >
                          <Text className="text-[10px] font-bold text-amber-800 dark:text-amber-300">
                            Pause
                          </Text>
                        </Pressable>
                      )}

                      {status !== "closed" && (
                        <Pressable
                          onPress={() => handleStatusChange(job._id, "closed")}
                          disabled={isUpdating}
                          className="px-2 py-1 rounded-lg bg-muted border border-border"
                        >
                          <Text className="text-[10px] font-bold text-muted-foreground">
                            Close
                          </Text>
                        </Pressable>
                      )}
                    </View>

                    {/* Action Buttons */}
                    <View className="flex-row items-center gap-2 pt-1">
                      <Pressable
                        onPress={() =>
                          router.push(`/recruiter/job/${job._id}/applicants` as any)
                        }
                        className="flex-1 rounded-xl bg-primary py-2.5 items-center justify-center shadow-2xs"
                      >
                        <Text className="text-xs font-bold text-primary-foreground">
                          Review Applicants ({job.applications?.length || 0}) →
                        </Text>
                      </Pressable>

                      <Pressable
                        onPress={() => setAnalyticsJob(job)}
                        className="rounded-xl border border-primary/30 bg-primary/10 px-3.5 py-2.5 items-center justify-center"
                      >
                        <Text className="text-xs font-bold text-primary">
                          Analytics ⚡
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                );
              })}
            </View>
          ) : (
            <View className="py-16 items-center text-center space-y-3">
              <View className="w-16 h-16 rounded-full bg-muted/40 items-center justify-center">
                <Icon name="briefcase" size={24} color="#8E8799" />
              </View>
              <Text className="text-sm font-bold text-foreground">
                No job postings found
              </Text>
              <Text className="text-xs text-muted-foreground max-w-xs text-center">
                {search
                  ? `No roles match "${search}".`
                  : "Deploy your first job vacancy to begin sourcing top candidates."}
              </Text>
              <Pressable
                onPress={() => router.push("/recruiter/create-job" as any)}
                className="rounded-xl bg-primary px-5 py-2.5 mt-2"
              >
                <Text className="text-xs font-bold text-primary-foreground">
                  + Post New Vacancy
                </Text>
              </Pressable>
            </View>
          )}
        </ScrollView>

        {/* Analytics Modal */}
        {analyticsJob && (
          <JobAnalyticsModal
            visible={Boolean(analyticsJob)}
            onClose={() => setAnalyticsJob(null)}
            jobId={analyticsJob._id}
            jobTitle={analyticsJob.title}
          />
        )}
      </SafeAreaView>
    </RecruiterGuard>
  );
}
