import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { router } from "expo-router";
import API from "../src/utils/axiosInstance";
import { JOB_API_ENDPOINT } from "../src/utils/endpoints";
import JobCard from "../src/components/jobs/JobCard";
import Icon from "../src/components/common/Icon";

export default function SavedJobsScreen() {
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await API.get(`${JOB_API_ENDPOINT}/saved`);
      if (res.data?.success) {
        setSavedJobs(res.data.data?.savedJobs || res.data.savedJobs || []);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to load saved jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const handleUnsaved = (jobId: string) => {
    setSavedJobs((prev) => prev.filter((item) => (item.job?._id || item.job) !== jobId));
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-border px-5 py-3 bg-card">
        <Pressable onPress={() => router.back()} className="flex-row items-center gap-1">
          <Text className="text-base font-bold text-primary">←</Text>
          <Text className="text-xs font-bold text-foreground">Back</Text>
        </Pressable>
        <Text className="text-sm font-bold text-foreground">Saved Positions</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#6B3AC2" />
          <Text className="text-xs text-muted-foreground mt-2">Loading saved jobs...</Text>
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-sm text-destructive">{error}</Text>
          <Pressable onPress={fetchSavedJobs} className="mt-4 rounded-xl bg-primary px-4 py-2">
            <Text className="text-xs font-bold text-primary-foreground">Retry</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={savedJobs}
          keyExtractor={(item) => item._id || item.job?._id}
          contentContainerStyle={{ padding: 16 }}
          refreshing={loading}
          onRefresh={fetchSavedJobs}
          ListHeaderComponent={
            <View className="mb-4">
              <Text className="text-xl font-black text-foreground">Bookmarks</Text>
              <Text className="text-xs text-muted-foreground mt-0.5">
                {savedJobs.length} {savedJobs.length === 1 ? "position" : "positions"} saved for later review
              </Text>
            </View>
          }
          renderItem={({ item }) => {
            const jobDoc = item.job || item;
            if (!jobDoc) return null;
            return (
              <JobCard
                job={jobDoc}
                isSavedInitial={true}
                onUnsaved={handleUnsaved}
              />
            );
          }}
          ListEmptyComponent={
            <View className="py-20 items-center justify-center">
              <Icon name="bookmark" size={36} color="#8E8799" />
              <Text className="text-base font-bold text-foreground mt-2">No Saved Jobs</Text>
              <Text className="text-xs text-muted-foreground text-center mt-1 max-w-xs">
                Tap the bookmark icon on any job card to save interesting opportunities for later.
              </Text>
              <Pressable
                onPress={() => router.push("/(tabs)/jobs")}
                className="mt-4 rounded-xl bg-primary px-4 py-2"
              >
                <Text className="text-xs font-bold text-primary-foreground">Explore Jobs</Text>
              </Pressable>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
