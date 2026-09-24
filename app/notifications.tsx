import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from "react-native";
import { router } from "expo-router";
import { useSelector } from "react-redux";
import API from "../src/utils/axiosInstance";
import { NOTIFICATION_API_END_POINT } from "../src/utils/endpoints";
import { unwrapList, unwrapPagination } from "../src/services/http";
import Icon from "../src/components/common/Icon";

export default function NotificationsScreen() {
  const { user } = useSelector((store: any) => store.auth);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: String(page),
        limit: "15",
      });
      if (unreadOnly) params.append("unreadOnly", "true");

      const res = await API.get(`${NOTIFICATION_API_END_POINT}?${params.toString()}`);
      if (res.data?.success || res.data?.status) {
        const list = unwrapList(res, "notifications");
        setNotifications(list);
        setUnreadCount(res.data?.unreadCount || 0);
        const pag = unwrapPagination(res);
        if (pag) setTotalPages(pag.totalPages || 1);
      }
    } catch {
      // Handled
    } finally {
      setLoading(false);
    }
  }, [user, page, unreadOnly]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkOne = async (id: string) => {
    try {
      await API.patch(`${NOTIFICATION_API_END_POINT}/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      //
    }
  };

  const handleMarkAll = async () => {
    try {
      await API.patch(`${NOTIFICATION_API_END_POINT}/read-all`);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {
      //
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await API.delete(`${NOTIFICATION_API_END_POINT}/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch {
      //
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" style={{ flex: 1 }}>
      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-border px-5 py-3 bg-card">
        <Pressable onPress={() => router.back()} className="flex-row items-center gap-1">
          <Text className="text-base font-bold text-primary">←</Text>
          <Text className="text-xs font-bold text-foreground">Back</Text>
        </Pressable>
        <Text className="text-sm font-bold text-foreground">Notifications</Text>
        {unreadCount > 0 ? (
          <Pressable onPress={handleMarkAll}>
            <Text className="text-xs font-bold text-primary">Mark Read</Text>
          </Pressable>
        ) : (
          <View style={{ width: 40 }} />
        )}
      </View>

      {/* Filter Tabs */}
      <View className="flex-row items-center gap-2 border-b border-border bg-card px-5 py-2">
        <Pressable
          onPress={() => setUnreadOnly(false)}
          className={`rounded-full px-3 py-1 border ${
            !unreadOnly ? "bg-primary border-primary" : "bg-secondary border-border"
          }`}
        >
          <Text className={`text-xs font-medium ${!unreadOnly ? "text-primary-foreground font-bold" : "text-muted-foreground"}`}>
            All Notifications
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setUnreadOnly(true)}
          className={`rounded-full px-3 py-1 border ${
            unreadOnly ? "bg-primary border-primary" : "bg-secondary border-border"
          }`}
        >
          <Text className={`text-xs font-medium ${unreadOnly ? "text-primary-foreground font-bold" : "text-muted-foreground"}`}>
            Unread {unreadCount > 0 ? `(${unreadCount})` : ""}
          </Text>
        </Pressable>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
        refreshing={loading}
        onRefresh={fetchNotifications}
        renderItem={({ item }) => (
          <View
            className={`mb-3 rounded-2xl border p-4 shadow-sm ${
              !item.isRead
                ? "bg-purple-50/60 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800"
                : "bg-card border-border"
            }`}
          >
            <View className="flex-row items-start justify-between">
              <View className="flex-1 mr-2">
                <View className="flex-row items-center gap-1.5 mb-1">
                  {!item.isRead && (
                    <View className="h-2 w-2 rounded-full bg-primary" />
                  )}
                  <Text className="text-xs font-bold text-foreground" numberOfLines={1}>
                    {item.title}
                  </Text>
                </View>
                <Text className="text-xs text-muted-foreground leading-relaxed">
                  {item.message}
                </Text>
              </View>

              <View className="flex-row items-center gap-2">
                {!item.isRead && (
                  <Pressable
                    onPress={() => handleMarkOne(item._id)}
                    className="rounded-lg bg-primary/10 px-2 py-1"
                  >
                    <Text className="text-[10px] font-bold text-primary">Read</Text>
                  </Pressable>
                )}
                <Pressable
                  onPress={() => handleDelete(item._id)}
                  hitSlop={8}
                  className="p-1"
                >
                  <Icon name="trash" size={14} color="#DC2626" />
                </Pressable>
              </View>
            </View>

            {item.createdAt ? (
              <Text className="text-[10px] text-muted-foreground mt-2">
                {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            ) : null}
          </View>
        )}
        ListEmptyComponent={
          loading ? (
            <View className="py-20 items-center justify-center">
              <ActivityIndicator size="large" color="#6B3AC2" />
              <Text className="text-xs text-muted-foreground mt-2">Loading notifications...</Text>
            </View>
          ) : (
            <View className="py-20 items-center justify-center">
              <Icon name="bell" size={36} color="#8E8799" />
              <Text className="text-base font-bold text-foreground mt-2">
                {unreadOnly ? "No Unread Notifications" : "No Notifications Yet"}
              </Text>
              <Text className="text-xs text-muted-foreground text-center mt-1 max-w-xs">
                You'll receive updates here about application statuses, recruiter views, and interviews.
              </Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
}
