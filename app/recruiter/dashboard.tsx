import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Linking,
  SafeAreaView,
} from "react-native";
import { router } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import API from "../../src/utils/axiosInstance";
import { JOB_API_ENDPOINT, APPLICATION_API_ENDPOINT } from "../../src/utils/endpoints";
import { setAllAdminJobs } from "../../src/redux/jobSlice";
import { unwrapList } from "../../src/services/http";
import Icon from "../../src/components/common/Icon";
import RecruiterGuard from "../../src/components/recruiter/RecruiterGuard";
import JobLifecycleBadge from "../../src/components/recruiter/JobLifecycleBadge";

export default function RecruiterDashboardScreen() {
  const dispatch = useDispatch();
  const { user } = useSelector((store: any) => store.auth);
  const { allAdminJobs = [] } = useSelector((store: any) => store.job);

  const [loading, setLoading] = useState(true);
  const [applicantDetails, setApplicantDetails] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await API.get(`${JOB_API_ENDPOINT}/getadminjobs`);
      if (res.data?.success || res.data?.status) {
        const jobs = unwrapList(res, "jobs");
        dispatch(setAllAdminJobs(jobs));

        // Assemble applicant telemetry across active jobs
        const jobsWithApps = jobs.filter((j: any) => j.applications && j.applications.length > 0);
        const appPromises = jobsWithApps.map(async (job: any) => {
          try {
            const appRes = await API.get(`${APPLICATION_API_ENDPOINT}/${job._id}/applicants`);
            if (appRes.data?.success && appRes.data.job?.applications) {
              return appRes.data.job.applications.map((app: any) => ({
                ...app,
                jobTitle: job.title,
                jobId: job._id,
                companyName: job.company?.name || "Your Organization",
              }));
            }
          } catch {
            return [];
          }
          return [];
        });

        const results = await Promise.all(appPromises);
        const flattened = results.flat();
        setApplicantDetails(flattened);
      }
    } catch {
      // Handled
    } finally {
      setLoading(false);
    }
  };

  // KPI Calculations
  const activeJobsCount = allAdminJobs.filter(
    (j: any) => !j.status || j.status === "published"
  ).length;

  const totalApplications = allAdminJobs.reduce(
    (acc: number, j: any) => acc + (j.applications?.length || 0),
    0
  );

  const totalViews = allAdminJobs.reduce(
    (acc: number, j: any) => acc + (j.views || 0),
    0
  );

  const pendingCount = applicantDetails.filter(
    (app: any) => !app.status || app.status === "pending"
  ).length;

  const upcomingInterviews = applicantDetails
    .filter((app: any) => app.scheduledAt && new Date(app.scheduledAt).getTime() > Date.now())
    .sort((a: any, b: any) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());

  return (
    <RecruiterGuard>
      <SafeAreaView className="flex-1 bg-background">
        {/* Top Header */}
        <View className="flex-row items-center justify-between border-b border-border px-5 py-3.5 bg-card">
          <Pressable onPress={() => router.back()} className="flex-row items-center gap-1.5">
            <Text className="text-base font-bold text-primary">←</Text>
            <Text className="text-xs font-bold text-foreground">Back</Text>
          </Pressable>
          <Text className="text-sm font-black text-foreground">Recruiter Cockpit</Text>
          <Pressable
            onPress={fetchDashboardData}
            className="p-1 rounded-lg bg-muted/40"
          >
            <Icon name="refresh" size={14} color="#6B3AC2" />
          </Pressable>
        </View>

        <ScrollView className="flex-1 px-4 py-5" showsVerticalScrollIndicator={false}>
          {/* Welcome Greeting */}
          <View className="mb-6 space-y-1">
            <View className="flex-row items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 self-start">
              <Icon name="briefcase" size={12} color="#6B3AC2" />
              <Text className="text-[10px] font-bold text-primary">
                Verified Recruiter Suite
              </Text>
            </View>
            <Text className="text-2xl font-black text-foreground">
              Welcome, {user?.fullname || "Recruiter"}
            </Text>
            <Text className="text-xs text-muted-foreground">
              Monitor active vacancies, review applicant pipeline, and coordinate interviews.
            </Text>
          </View>

          {/* Quick Actions Grid */}
          <View className="grid grid-cols-2 flex-row flex-wrap gap-2.5 mb-6">
            <Pressable
              onPress={() => router.push("/recruiter/create-job" as any)}
              className="flex-1 min-w-[140px] rounded-2xl bg-primary p-4 shadow-sm"
            >
              <Icon name="plus" size={18} color="#FFFFFF" />
              <Text className="text-sm font-bold text-primary-foreground mt-2">
                Post New Job
              </Text>
              <Text className="text-[10px] text-purple-100 mt-0.5">
                Deploy open vacancy
              </Text>
            </Pressable>

            <Pressable
              onPress={() => router.push("/recruiter/create-company" as any)}
              className="flex-1 min-w-[140px] rounded-2xl border border-primary/30 bg-card p-4 shadow-2xs"
            >
              <Icon name="building" size={18} color="#6B3AC2" />
              <Text className="text-sm font-bold text-foreground mt-2">
                Add Company
              </Text>
              <Text className="text-[10px] text-muted-foreground mt-0.5">
                Register brand profile
              </Text>
            </Pressable>
          </View>

          {/* 4 KPI Cards */}
          <View className="grid grid-cols-2 flex-row flex-wrap gap-2.5 mb-6">
            <View className="flex-1 min-w-[140px] p-4 rounded-2xl border border-border bg-card shadow-2xs">
              <Text className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Active Vacancies
              </Text>
              <Text className="text-2xl font-black text-foreground mt-1">
                {activeJobsCount}
              </Text>
              <Text className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                ● Live on marketplace
              </Text>
            </View>

            <View className="flex-1 min-w-[140px] p-4 rounded-2xl border border-border bg-card shadow-2xs">
              <Text className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Total Applicants
              </Text>
              <Text className="text-2xl font-black text-primary mt-1">
                {totalApplications}
              </Text>
              <Text className="text-[10px] text-muted-foreground mt-0.5">
                Across all postings
              </Text>
            </View>

            <View className="flex-1 min-w-[140px] p-4 rounded-2xl border border-border bg-card shadow-2xs">
              <Text className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Candidate Views
              </Text>
              <Text className="text-2xl font-black text-foreground mt-1">
                {totalViews}
              </Text>
              <Text className="text-[10px] text-muted-foreground mt-0.5">
                Listing impressions
              </Text>
            </View>

            <View className="flex-1 min-w-[140px] p-4 rounded-2xl border border-border bg-card shadow-2xs">
              <Text className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Pending Review
              </Text>
              <Text className="text-2xl font-black text-amber-600 mt-1">
                {pendingCount}
              </Text>
              <Text className="text-[10px] text-muted-foreground mt-0.5">
                Awaiting evaluation
              </Text>
            </View>
          </View>

          {/* Quick Management Links */}
          <View className="flex-row items-center gap-2 mb-6">
            <Pressable
              onPress={() => router.push("/recruiter/jobs" as any)}
              className="flex-1 py-2.5 px-3 rounded-xl border border-border bg-muted/20 items-center"
            >
              <Text className="text-xs font-bold text-foreground">
                All Jobs ({allAdminJobs.length}) →
              </Text>
            </Pressable>

            <Pressable
              onPress={() => router.push("/recruiter/companies" as any)}
              className="flex-1 py-2.5 px-3 rounded-xl border border-border bg-muted/20 items-center"
            >
              <Text className="text-xs font-bold text-foreground">
                Companies →
              </Text>
            </Pressable>
          </View>

          {/* Upcoming Interviews */}
          {upcomingInterviews.length > 0 && (
            <View className="rounded-2xl border border-purple-300 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/20 p-4 mb-6 space-y-3">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <Icon name="calendar" size={16} color="#6B3AC2" />
                  <Text className="text-sm font-black text-foreground">
                    Upcoming Interviews ({upcomingInterviews.length})
                  </Text>
                </View>
              </View>

              <View className="space-y-2">
                {upcomingInterviews.slice(0, 3).map((app: any, idx: number) => {
                  const d = new Date(app.scheduledAt);
                  const formatted = `${d.toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })} at ${d.toLocaleTimeString(undefined, {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}`;

                  return (
                    <View
                      key={app._id || idx}
                      className="p-3 rounded-xl border border-border bg-card space-y-2 shadow-2xs"
                    >
                      <View className="flex-row items-center justify-between">
                        <Text className="text-xs font-bold text-foreground flex-1 pr-2" numberOfLines={1}>
                          {app.applicant?.fullname || "Candidate"} • {app.jobTitle}
                        </Text>
                        <Text className="text-[10px] text-primary font-semibold">
                          📅 {formatted}
                        </Text>
                      </View>

                      {app.meetingLink ? (
                        <Pressable
                          onPress={() => Linking.openURL(app.meetingLink)}
                          className="rounded-lg bg-primary py-1.5 items-center"
                        >
                          <Text className="text-xs font-bold text-primary-foreground">
                            Join Meeting Room ↗
                          </Text>
                        </Pressable>
                      ) : null}
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* Recent Jobs Section */}
          <View className="space-y-3 mb-8">
            <View className="flex-row items-center justify-between">
              <Text className="text-base font-black text-foreground">
                Recent Job Postings
              </Text>
              <Pressable onPress={() => router.push("/recruiter/jobs" as any)}>
                <Text className="text-xs font-bold text-primary">View All →</Text>
              </Pressable>
            </View>

            {loading ? (
              <View className="py-8 items-center">
                <ActivityIndicator color="#6B3AC2" />
              </View>
            ) : allAdminJobs.length > 0 ? (
              <View className="space-y-2.5">
                {allAdminJobs.slice(0, 4).map((job: any) => (
                  <View
                    key={job._id}
                    className="p-4 rounded-2xl border border-border bg-card space-y-2.5 shadow-2xs"
                  >
                    <View className="flex-row items-start justify-between">
                      <View className="flex-1 pr-2">
                        <Text className="text-[11px] font-semibold text-primary" numberOfLines={1}>
                          🏢 {job.company?.name || "Company"}
                        </Text>
                        <Text className="text-sm font-black text-foreground mt-0.5" numberOfLines={1}>
                          {job.title}
                        </Text>
                      </View>
                      <JobLifecycleBadge status={job.status} />
                    </View>

                    <View className="flex-row items-center justify-between pt-2 border-t border-border">
                      <View className="flex-row items-center gap-3">
                        <Text className="text-[11px] text-muted-foreground">
                          👥 {job.applications?.length || 0} applicants
                        </Text>
                        <Text className="text-[11px] text-muted-foreground">
                          👁 {job.views || 0} views
                        </Text>
                      </View>

                      <Pressable
                        onPress={() =>
                          router.push(`/recruiter/job/${job._id}/applicants` as any)
                        }
                        className="rounded-lg bg-primary/10 px-3 py-1.5"
                      >
                        <Text className="text-xs font-bold text-primary">
                          Review Applicants →
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View className="p-6 rounded-2xl border border-dashed border-border items-center text-center space-y-2">
                <Text className="text-xs font-bold text-foreground">
                  No active job postings found
                </Text>
                <Text className="text-[11px] text-muted-foreground">
                  Deploy your first open vacancy to begin sourcing top candidates.
                </Text>
                <Pressable
                  onPress={() => router.push("/recruiter/create-job" as any)}
                  className="rounded-xl bg-primary px-4 py-2 mt-1"
                >
                  <Text className="text-xs font-bold text-primary-foreground">
                    Post Vacancy
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </RecruiterGuard>
  );
}
