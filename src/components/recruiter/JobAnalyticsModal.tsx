import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import API from "../../utils/axiosInstance";
import { JOB_API_ENDPOINT } from "../../utils/endpoints";
import Icon from "../common/Icon";

interface JobAnalyticsModalProps {
  visible: boolean;
  onClose: () => void;
  jobId: string;
  jobTitle?: string;
}

export const JobAnalyticsModal: React.FC<JobAnalyticsModalProps> = ({
  visible,
  onClose,
  jobId,
  jobTitle = "Position Analytics",
}) => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible && jobId) {
      fetchStats();
    } else {
      setStats(null);
      setError(null);
    }
  }, [visible, jobId]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await API.get(`${JOB_API_ENDPOINT}/${jobId}/stats`);
      if (res.data?.success || res.data?.status) {
        setStats(res.data.data?.stats || res.data.stats);
      } else {
        setError(res.data?.message || "Failed to load telemetry stats.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to retrieve job analytics.");
    } finally {
      setLoading(false);
    }
  };

  const totalApps = stats?.totalApplications || 0;
  const pendingApps = stats?.statusBreakdown?.pending || 0;
  const acceptedApps = stats?.statusBreakdown?.accepted || 0;
  const rejectedApps = stats?.statusBreakdown?.rejected || 0;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/60 justify-end">
        <View className="bg-card rounded-t-3xl border-t border-border max-h-[85%] p-5 space-y-4">
          {/* Header */}
          <View className="flex-row items-center justify-between pb-3 border-b border-border">
            <View className="flex-row items-center gap-2 flex-1 pr-2">
              <View className="p-2 rounded-xl bg-primary/10">
                <Icon name="zap" size={16} color="#6B3AC2" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-black text-foreground" numberOfLines={1}>
                  {jobTitle}
                </Text>
                <Text className="text-[11px] text-muted-foreground">
                  Performance & Conversion Telemetry
                </Text>
              </View>
            </View>

            <Pressable
              onPress={onClose}
              className="w-8 h-8 rounded-full bg-muted/40 items-center justify-center"
            >
              <Icon name="x" size={14} color="#8E8799" />
            </Pressable>
          </View>

          {loading ? (
            <View className="py-16 items-center justify-center gap-2">
              <ActivityIndicator color="#6B3AC2" size="large" />
              <Text className="text-xs text-muted-foreground font-medium">
                Fetching conversion metrics...
              </Text>
            </View>
          ) : error ? (
            <View className="py-12 items-center text-center space-y-2">
              <Text className="text-xs font-bold text-destructive">{error}</Text>
              <Pressable
                onPress={fetchStats}
                className="rounded-lg bg-primary/10 px-4 py-2 mt-2"
              >
                <Text className="text-xs font-bold text-primary">Retry</Text>
              </Pressable>
            </View>
          ) : stats ? (
            <ScrollView showsVerticalScrollIndicator={false} className="space-y-4">
              {/* 4 KPI Cards */}
              <View className="grid grid-cols-2 flex-row flex-wrap gap-2.5">
                <View className="flex-1 min-w-[130px] p-3.5 rounded-xl border border-border bg-muted/20">
                  <Text className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Candidate Views
                  </Text>
                  <Text className="text-2xl font-black text-foreground mt-0.5">
                    {stats.views || 0}
                  </Text>
                  <Text className="text-[10px] text-muted-foreground">Listing impressions</Text>
                </View>

                <View className="flex-1 min-w-[130px] p-3.5 rounded-xl border border-border bg-muted/20">
                  <Text className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Applications
                  </Text>
                  <Text className="text-2xl font-black text-primary mt-0.5">
                    {totalApps}
                  </Text>
                  <Text className="text-[10px] text-muted-foreground">Submitted resumes</Text>
                </View>

                <View className="flex-1 min-w-[130px] p-3.5 rounded-xl border border-border bg-muted/20">
                  <Text className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Conversion Rate
                  </Text>
                  <Text className="text-2xl font-black text-emerald-600 mt-0.5">
                    {stats.conversionRate || (stats.views ? ((totalApps / stats.views) * 100).toFixed(1) : 0)}%
                  </Text>
                  <Text className="text-[10px] text-muted-foreground">View to apply ratio</Text>
                </View>

                <View className="flex-1 min-w-[130px] p-3.5 rounded-xl border border-border bg-muted/20">
                  <Text className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Hired / Accepted
                  </Text>
                  <Text className="text-2xl font-black text-purple-600 mt-0.5">
                    {acceptedApps}
                  </Text>
                  <Text className="text-[10px] text-muted-foreground">Shortlisted candidates</Text>
                </View>
              </View>

              {/* Status Distribution Funnel */}
              <View className="rounded-2xl border border-border bg-card p-4 space-y-3">
                <Text className="text-xs font-bold text-foreground">
                  Applicant Pipeline Funnel
                </Text>

                <View className="space-y-2">
                  <View className="space-y-1">
                    <View className="flex-row justify-between text-xs">
                      <Text className="text-[11px] font-semibold text-amber-700 dark:text-amber-400">
                        Pending Screening: {pendingApps}
                      </Text>
                      <Text className="text-[11px] font-bold text-muted-foreground">
                        {totalApps > 0 ? Math.round((pendingApps / totalApps) * 100) : 0}%
                      </Text>
                    </View>
                    <View className="w-full bg-border h-2 rounded-full overflow-hidden">
                      <View
                        className="bg-amber-500 h-full rounded-full"
                        style={{ width: `${totalApps > 0 ? (pendingApps / totalApps) * 100 : 0}%` }}
                      />
                    </View>
                  </View>

                  <View className="space-y-1">
                    <View className="flex-row justify-between text-xs">
                      <Text className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                        Accepted / Interviewing: {acceptedApps}
                      </Text>
                      <Text className="text-[11px] font-bold text-muted-foreground">
                        {totalApps > 0 ? Math.round((acceptedApps / totalApps) * 100) : 0}%
                      </Text>
                    </View>
                    <View className="w-full bg-border h-2 rounded-full overflow-hidden">
                      <View
                        className="bg-emerald-500 h-full rounded-full"
                        style={{ width: `${totalApps > 0 ? (acceptedApps / totalApps) * 100 : 0}%` }}
                      />
                    </View>
                  </View>

                  <View className="space-y-1">
                    <View className="flex-row justify-between text-xs">
                      <Text className="text-[11px] font-semibold text-rose-700 dark:text-rose-400">
                        Rejected / Passed: {rejectedApps}
                      </Text>
                      <Text className="text-[11px] font-bold text-muted-foreground">
                        {totalApps > 0 ? Math.round((rejectedApps / totalApps) * 100) : 0}%
                      </Text>
                    </View>
                    <View className="w-full bg-border h-2 rounded-full overflow-hidden">
                      <View
                        className="bg-rose-500 h-full rounded-full"
                        style={{ width: `${totalApps > 0 ? (rejectedApps / totalApps) * 100 : 0}%` }}
                      />
                    </View>
                  </View>
                </View>
              </View>

              {/* Timeline (if any) */}
              {stats.applicationsTimeline && stats.applicationsTimeline.length > 0 && (
                <View className="rounded-2xl border border-border bg-card p-4 space-y-2 mb-6">
                  <Text className="text-xs font-bold text-foreground">
                    Recent Applications Volume
                  </Text>
                  <View className="space-y-1.5">
                    {stats.applicationsTimeline.slice(-5).map((tl: any, idx: number) => (
                      <View
                        key={idx}
                        className="flex-row items-center justify-between py-1 border-b border-border/50"
                      >
                        <Text className="text-[11px] text-muted-foreground">{tl.date}</Text>
                        <Text className="text-[11px] font-bold text-primary">
                          +{tl.applications} applied
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </ScrollView>
          ) : null}
        </View>
      </View>
    </Modal>
  );
};

export default JobAnalyticsModal;
