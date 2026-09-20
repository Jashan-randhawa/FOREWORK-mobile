import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
  Modal,
  ScrollView,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from "react-native";
import { router } from "expo-router";
import { useSelector } from "react-redux";
import API from "../src/utils/axiosInstance";
import { JOB_API_ENDPOINT } from "../src/utils/endpoints";
import { unwrapList } from "../src/services/http";
import { LOCATIONS, JOB_TYPES } from "../src/utils/filterConstants";
import Icon from "../src/components/common/Icon";

export default function JobAlertsScreen() {
  const { user } = useSelector((store: any) => store.auth);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [minSalary, setMinSalary] = useState("");

  const fetchAlerts = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError(null);
      const res = await API.get(`${JOB_API_ENDPOINT}/alerts`);
      const list = unwrapList(res, "alerts");
      setAlerts(list);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to load alerts");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const handleCreate = async () => {
    if (!title.trim() || !keyword.trim()) {
      Alert.alert("Error", "Please provide at least an alert title and keyword.");
      return;
    }

    try {
      setCreating(true);
      const payload = {
        title: title.trim(),
        keyword: keyword.trim(),
        location: location || undefined,
        jobType: jobType || undefined,
        minSalary: minSalary ? Number(minSalary) : undefined,
        frequency: "daily",
      };

      const res = await API.post(`${JOB_API_ENDPOINT}/alerts`, payload);
      if (res.data?.success) {
        Alert.alert("Success", "Job alert created successfully!");
        setCreateModalOpen(false);
        setTitle("");
        setKeyword("");
        setLocation("");
        setJobType("");
        setMinSalary("");
        fetchAlerts();
      }
    } catch (err: any) {
      Alert.alert("Error", err.response?.data?.message || err.message || "Failed to create alert");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert("Delete Alert", "Are you sure you want to remove this job alert?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await API.delete(`${JOB_API_ENDPOINT}/alerts/${id}`);
            setAlerts((prev) => prev.filter((a) => a._id !== id));
          } catch (err: any) {
            Alert.alert("Error", err.response?.data?.message || "Failed to delete alert");
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-border px-5 py-3 bg-card">
        <Pressable onPress={() => router.back()} className="flex-row items-center gap-1">
          <Text className="text-base font-bold text-primary">←</Text>
          <Text className="text-xs font-bold text-foreground">Back</Text>
        </Pressable>
        <Text className="text-sm font-bold text-foreground">Custom Job Alerts</Text>
        <Pressable
          onPress={() => setCreateModalOpen(true)}
          className="h-8 w-8 items-center justify-center rounded-full bg-primary/10"
        >
          <Icon name="plus" size={16} color="#6B3AC2" />
        </Pressable>
      </View>

      <FlatList
        data={alerts}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 16 }}
        refreshing={loading}
        onRefresh={fetchAlerts}
        ListHeaderComponent={
          <View className="mb-4">
            <Text className="text-xl font-black text-foreground">Alert Subscriptions</Text>
            <Text className="text-xs text-muted-foreground mt-0.5">
              Receive timely notifications whenever positions matching your preferences are posted.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View className="mb-3.5 rounded-2xl border border-border bg-card p-4 shadow-sm">
            <View className="flex-row items-start justify-between">
              <View className="flex-1 mr-2">
                <Text className="text-sm font-bold text-foreground">{item.title}</Text>
                <Text className="text-xs text-primary font-medium mt-0.5">
                  Keyword: {item.keyword}
                </Text>
              </View>
              <Pressable
                onPress={() => handleDelete(item._id)}
                className="h-8 w-8 items-center justify-center rounded-full bg-destructive/10"
              >
                <Icon name="trash" size={14} color="#DC2626" />
              </Pressable>
            </View>

            <View className="mt-3 flex-row flex-wrap gap-1.5">
              {item.location ? (
                <View className="rounded-md bg-secondary border border-border px-2 py-0.5">
                  <Text className="text-[10px] text-muted-foreground">📍 {item.location}</Text>
                </View>
              ) : null}
              {item.jobType ? (
                <View className="rounded-md bg-secondary border border-border px-2 py-0.5">
                  <Text className="text-[10px] text-muted-foreground">💼 {item.jobType}</Text>
                </View>
              ) : null}
              {item.minSalary ? (
                <View className="rounded-md bg-secondary border border-border px-2 py-0.5">
                  <Text className="text-[10px] text-muted-foreground">₹ {item.minSalary} LPA+</Text>
                </View>
              ) : null}
            </View>
          </View>
        )}
        ListEmptyComponent={
          loading ? (
            <View className="py-20 items-center justify-center">
              <ActivityIndicator size="large" color="#6B3AC2" />
              <Text className="text-xs text-muted-foreground mt-2">Loading alerts...</Text>
            </View>
          ) : (
            <View className="py-20 items-center justify-center">
              <Icon name="bell" size={36} color="#8E8799" />
              <Text className="text-base font-bold text-foreground mt-2">No Alerts Configured</Text>
              <Text className="text-xs text-muted-foreground text-center mt-1 max-w-xs">
                Create search alerts to stay ahead when new tech jobs matching your criteria are published.
              </Text>
              <Pressable
                onPress={() => setCreateModalOpen(true)}
                className="mt-4 rounded-xl bg-primary px-4 py-2"
              >
                <Text className="text-xs font-bold text-primary-foreground">+ Create First Alert</Text>
              </Pressable>
            </View>
          )
        }
      />

      {/* Create Alert Modal */}
      <Modal visible={createModalOpen} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setCreateModalOpen(false)}>
        <SafeAreaView className="flex-1 bg-background">
          <View className="flex-row items-center justify-between border-b border-border px-5 py-3">
            <Text className="text-lg font-bold text-foreground">New Job Alert</Text>
            <Pressable onPress={() => setCreateModalOpen(false)} className="p-2 rounded-full bg-secondary">
              <Icon name="close" size={16} color="#6B3AC2" />
            </Pressable>
          </View>

          <ScrollView className="flex-1 px-5 py-4">
            <View className="mb-4">
              <Text className="text-xs font-bold text-foreground mb-1.5">Alert Name *</Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="e.g. Remote React Roles"
                placeholderTextColor="#8E8799"
                className="rounded-xl border border-border bg-card px-3.5 py-2.5 text-xs text-foreground"
              />
            </View>

            <View className="mb-4">
              <Text className="text-xs font-bold text-foreground mb-1.5">Search Keyword *</Text>
              <TextInput
                value={keyword}
                onChangeText={setKeyword}
                placeholder="e.g. React, Next.js, Fullstack"
                placeholderTextColor="#8E8799"
                className="rounded-xl border border-border bg-card px-3.5 py-2.5 text-xs text-foreground"
              />
            </View>

            <View className="mb-4">
              <Text className="text-xs font-bold text-foreground mb-1.5">Preferred Location</Text>
              <View className="flex-row flex-wrap gap-1.5">
                {LOCATIONS.map((loc) => (
                  <Pressable
                    key={loc}
                    onPress={() => setLocation(location === loc ? "" : loc)}
                    className={`rounded-full px-3 py-1 border ${
                      location === loc ? "bg-primary border-primary" : "bg-card border-border"
                    }`}
                  >
                    <Text className={`text-xs ${location === loc ? "text-primary-foreground font-bold" : "text-foreground"}`}>
                      {loc}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-xs font-bold text-foreground mb-1.5">Job Type</Text>
              <View className="flex-row flex-wrap gap-1.5">
                {JOB_TYPES.map((type) => (
                  <Pressable
                    key={type}
                    onPress={() => setJobType(jobType === type ? "" : type)}
                    className={`rounded-full px-3 py-1 border ${
                      jobType === type ? "bg-primary border-primary" : "bg-card border-border"
                    }`}
                  >
                    <Text className={`text-xs ${jobType === type ? "text-primary-foreground font-bold" : "text-foreground"}`}>
                      {type}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-xs font-bold text-foreground mb-1.5">Minimum Salary (LPA)</Text>
              <TextInput
                value={minSalary}
                onChangeText={setMinSalary}
                placeholder="e.g. 12"
                placeholderTextColor="#8E8799"
                keyboardType="numeric"
                className="rounded-xl border border-border bg-card px-3.5 py-2.5 text-xs text-foreground"
              />
            </View>
          </ScrollView>

          <View className="flex-row items-center gap-3 border-t border-border px-5 py-4 bg-background">
            <Pressable
              onPress={() => setCreateModalOpen(false)}
              className="flex-1 items-center justify-center rounded-xl border border-border bg-card py-3"
            >
              <Text className="text-xs font-semibold text-foreground">Cancel</Text>
            </Pressable>
            <Pressable
              onPress={handleCreate}
              disabled={creating}
              className="flex-1 items-center justify-center rounded-xl bg-primary py-3 shadow-md"
            >
              {creating ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text className="text-xs font-bold text-primary-foreground">Save Alert</Text>
              )}
            </Pressable>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
