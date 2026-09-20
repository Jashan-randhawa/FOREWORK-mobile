import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  Linking,
  Alert,
  SafeAreaView,
} from "react-native";
import { router } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import * as SecureStore from "expo-secure-store";
import { setUser } from "../../src/redux/authSlice";
import { TOKEN_KEY } from "../../src/utils/axiosInstance";
import useGetAllAppliedJobs from "../../src/hooks/useGetAllAppliedJobs";
import EditProfileModal from "../../src/components/profile/EditProfileModal";
import DeleteAccountModal from "../../src/components/profile/DeleteAccountModal";
import Icon from "../../src/components/common/Icon";

export default function ProfileScreen() {
  useGetAllAppliedJobs();
  const dispatch = useDispatch();
  const { user } = useSelector((store: any) => store.auth);
  const { allAppliedJobs = [] } = useSelector((store: any) => store.job);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Profile Strength Calculation
  const profileStats = useMemo(() => {
    const fields = [
      { id: "photo", label: "Profile Photo", isComplete: Boolean(user?.profile?.profilePhoto) },
      { id: "bio", label: "Bio", isComplete: Boolean(user?.profile?.bio && user.profile.bio.trim().length > 0) },
      { id: "skills", label: "Skills", isComplete: Boolean(user?.profile?.skills && user.profile.skills.length > 0) },
      { id: "resume", label: "Resume", isComplete: Boolean(user?.profile?.resume && user.profile.resume.trim().length > 0) },
      { id: "phone", label: "Phone Number", isComplete: Boolean(user?.phoneNumber && user.phoneNumber.trim().length > 0) },
    ];
    const completedCount = fields.filter((f) => f.isComplete).length;
    const percentage = Math.round((completedCount / fields.length) * 100);
    return { fields, percentage };
  }, [user]);

  // Upcoming Interviews
  const upcomingInterviews = useMemo(() => {
    const now = Date.now();
    return (allAppliedJobs || [])
      .filter((app: any) => {
        if (!app?.scheduledAt) return false;
        const interviewTime = new Date(app.scheduledAt).getTime();
        return !isNaN(interviewTime) && interviewTime > now;
      })
      .sort((a: any, b: any) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
  }, [allAppliedJobs]);

  const handleLogout = async () => {
    Alert.alert("Log Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: async () => {
          await SecureStore.deleteItemAsync(TOKEN_KEY);
          dispatch(setUser(null));
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  if (!user) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center px-6">
        <Icon name="user" size={48} color="#8E8799" />
        <Text className="text-lg font-bold text-foreground mt-3">Candidate Profile</Text>
        <Text className="text-xs text-muted-foreground text-center mt-1 mb-5">
          Sign in to manage your resume, track applications, and view upcoming interviews.
        </Text>
        <Pressable
          onPress={() => router.push("/(auth)/login")}
          className="rounded-xl bg-primary px-6 py-3"
        >
          <Text className="text-xs font-bold text-primary-foreground">Sign In / Register</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const initial = user.fullname?.charAt(0).toUpperCase() || "U";

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Top Header Card */}
        <View className="m-4 rounded-3xl border border-border bg-card p-5 shadow-sm">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3.5 flex-1 mr-2">
              {user.profile?.profilePhoto ? (
                <Image
                  source={{ uri: user.profile.profilePhoto }}
                  className="h-16 w-16 rounded-2xl bg-muted"
                  resizeMode="cover"
                />
              ) : (
                <View className="h-16 w-16 items-center justify-center rounded-2xl bg-primary/20">
                  <Text className="text-2xl font-black text-primary">{initial}</Text>
                </View>
              )}
              <View className="flex-1">
                <Text className="text-lg font-bold text-foreground" numberOfLines={1}>
                  {user.fullname}
                </Text>
                <Text className="text-xs text-muted-foreground mt-0.5" numberOfLines={2}>
                  {user.profile?.bio || "No bio added yet"}
                </Text>
              </View>
            </View>

            <Pressable
              onPress={() => setEditModalOpen(true)}
              className="h-9 w-9 items-center justify-center rounded-xl bg-secondary border border-border"
            >
              <Icon name="edit" size={15} color="#6B3AC2" />
            </Pressable>
          </View>

          {/* Contact Details */}
          <View className="mt-4 pt-3 border-t border-border flex-row flex-wrap gap-4">
            <View className="flex-row items-center gap-1.5">
              <Icon name="mail" size={13} color="#8E8799" />
              <Text className="text-xs text-muted-foreground">{user.email}</Text>
            </View>
            {user.phoneNumber ? (
              <View className="flex-row items-center gap-1.5">
                <Icon name="phone" size={13} color="#8E8799" />
                <Text className="text-xs text-muted-foreground">{user.phoneNumber}</Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* Profile Strength Card */}
        <View className="mx-4 mb-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center gap-1.5">
              <Icon name="sparkles" size={14} color="#6B3AC2" />
              <Text className="text-xs font-bold text-foreground">Profile Strength</Text>
            </View>
            <Text className="text-xs font-bold text-primary">{profileStats.percentage}%</Text>
          </View>

          {/* Progress Bar */}
          <View className="h-2 w-full rounded-full bg-secondary overflow-hidden">
            <View
              className="h-full bg-primary rounded-full"
              style={{ width: `${profileStats.percentage}%` }}
            />
          </View>

          {/* Checklist */}
          <View className="mt-3 flex-row flex-wrap gap-2">
            {profileStats.fields.map((f) => (
              <View
                key={f.id}
                className={`flex-row items-center gap-1 rounded-md px-2 py-0.5 border ${
                  f.isComplete
                    ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300"
                    : "bg-secondary border-border"
                }`}
              >
                <Text className="text-[10px]">{f.isComplete ? "✓" : "○"}</Text>
                <Text
                  className={`text-[10px] font-medium ${
                    f.isComplete ? "text-emerald-700 dark:text-emerald-400" : "text-muted-foreground"
                  }`}
                >
                  {f.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Skills & Technologies */}
        <View className="mx-4 mb-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
          <Text className="text-xs font-bold text-foreground mb-2">Skills & Technologies</Text>
          <View className="flex-row flex-wrap gap-1.5">
            {user.profile?.skills && user.profile.skills.length > 0 ? (
              user.profile.skills.map((skill: string, index: number) => (
                <View
                  key={index}
                  className="rounded-lg bg-primary/10 border border-primary/20 px-2.5 py-1"
                >
                  <Text className="text-xs font-semibold text-primary">{skill}</Text>
                </View>
              ))
            ) : (
              <Text className="text-xs text-muted-foreground">
                No skills added. Tap edit to showcase your tech stack.
              </Text>
            )}
          </View>
        </View>

        {/* Upcoming Interviews Section */}
        {upcomingInterviews.length > 0 && (
          <View className="mx-4 mb-4 rounded-2xl border border-purple-300 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/30 p-4">
            <View className="flex-row items-center gap-2 mb-3">
              <Icon name="calendar" size={16} color="#6B3AC2" />
              <Text className="text-sm font-bold text-foreground">Upcoming Interviews</Text>
            </View>

            {upcomingInterviews.map((app: any) => {
              const dateObj = new Date(app.scheduledAt);
              const formattedDate = dateObj.toLocaleDateString(undefined, {
                weekday: "short",
                month: "short",
                day: "numeric",
              });
              const formattedTime = dateObj.toLocaleTimeString(undefined, {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <View
                  key={app._id}
                  className="mb-2.5 rounded-xl border border-border bg-card p-3 shadow-xs"
                >
                  <Text className="text-xs font-bold text-foreground">
                    {app.job?.title || "Interview Session"}
                  </Text>
                  <Text className="text-[11px] text-primary font-medium">
                    {app.job?.company?.name || "ForeWork Partner"}
                  </Text>
                  <Text className="text-[11px] text-muted-foreground mt-1">
                    📅 {formattedDate} at {formattedTime}
                  </Text>
                  {app.meetingLink && (
                    <Pressable
                      onPress={() => Linking.openURL(app.meetingLink)}
                      className="mt-2.5 rounded-lg bg-primary py-2 items-center"
                    >
                      <Text className="text-xs font-bold text-primary-foreground">
                        Join Meeting Room ↗
                      </Text>
                    </Pressable>
                  )}
                </View>
              );
            })}
          </View>
        )}

        {/* Recruiter Management Cockpit (for Recruiters) */}
        {user.role === "Recruiter" && (
          <View className="mx-4 mb-4 rounded-2xl border border-purple-300 dark:border-purple-800 bg-purple-50/60 dark:bg-purple-950/30 p-4 shadow-sm">
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center gap-2">
                <Icon name="briefcase" size={16} color="#6B3AC2" />
                <Text className="text-xs font-black text-foreground">
                  Recruiter Cockpit
                </Text>
              </View>
              <View className="rounded-full bg-primary px-2 py-0.5">
                <Text className="text-[9px] font-bold text-primary-foreground">
                  Recruiter Role
                </Text>
              </View>
            </View>

            <Pressable
              onPress={() => router.push("/recruiter/dashboard" as any)}
              className="flex-row items-center justify-between py-2.5 border-b border-purple-200 dark:border-purple-900/60"
            >
              <View className="flex-row items-center gap-2.5">
                <Icon name="zap" size={16} color="#6B3AC2" />
                <Text className="text-xs font-semibold text-foreground">
                  Recruiter Dashboard (KPIs & Pipeline)
                </Text>
              </View>
              <Text className="text-xs font-bold text-primary">→</Text>
            </Pressable>

            <Pressable
              onPress={() => router.push("/recruiter/create-job" as any)}
              className="flex-row items-center justify-between py-2.5 border-b border-purple-200 dark:border-purple-900/60"
            >
              <View className="flex-row items-center gap-2.5">
                <Icon name="plus" size={16} color="#6B3AC2" />
                <Text className="text-xs font-semibold text-foreground">
                  Post New Vacancy
                </Text>
              </View>
              <Text className="text-xs font-bold text-primary">→</Text>
            </Pressable>

            <Pressable
              onPress={() => router.push("/recruiter/jobs" as any)}
              className="flex-row items-center justify-between py-2.5 border-b border-purple-200 dark:border-purple-900/60"
            >
              <View className="flex-row items-center gap-2.5">
                <Icon name="briefcase" size={16} color="#6B3AC2" />
                <Text className="text-xs font-semibold text-foreground">
                  Manage Open Positions & Applicants
                </Text>
              </View>
              <Text className="text-xs font-bold text-primary">→</Text>
            </Pressable>

            <Pressable
              onPress={() => router.push("/recruiter/companies" as any)}
              className="flex-row items-center justify-between py-2.5"
            >
              <View className="flex-row items-center gap-2.5">
                <Icon name="building" size={16} color="#6B3AC2" />
                <Text className="text-xs font-semibold text-foreground">
                  Manage Registered Companies
                </Text>
              </View>
              <Text className="text-xs font-bold text-primary">→</Text>
            </Pressable>
          </View>
        )}

        {/* Candidate Shortcuts */}
        <View className="mx-4 mb-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
          <Text className="text-xs font-bold text-foreground mb-3">Candidate Tools</Text>

          <Pressable
            onPress={() => router.push("/applications" as any)}
            className="flex-row items-center justify-between py-2.5 border-b border-border"
          >
            <View className="flex-row items-center gap-2.5">
              <Icon name="briefcase" size={16} color="#6B3AC2" />
              <Text className="text-xs font-semibold text-foreground">Applied Jobs Telemetry</Text>
            </View>
            <Text className="text-xs font-bold text-primary">→</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push("/saved-jobs" as any)}
            className="flex-row items-center justify-between py-2.5 border-b border-border"
          >
            <View className="flex-row items-center gap-2.5">
              <Icon name="bookmark" size={16} color="#6B3AC2" />
              <Text className="text-xs font-semibold text-foreground">Saved Positions</Text>
            </View>
            <Text className="text-xs font-bold text-primary">→</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push("/job-alerts" as any)}
            className="flex-row items-center justify-between py-2.5 border-b border-border"
          >
            <View className="flex-row items-center gap-2.5">
              <Icon name="bell" size={16} color="#6B3AC2" />
              <Text className="text-xs font-semibold text-foreground">Custom Job Alerts</Text>
            </View>
            <Text className="text-xs font-bold text-primary">→</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push("/ats" as any)}
            className="flex-row items-center justify-between py-2.5"
          >
            <View className="flex-row items-center gap-2.5">
              <Icon name="sparkles" size={16} color="#6B3AC2" />
              <Text className="text-xs font-semibold text-foreground">ATS Intelligence Studio</Text>
            </View>
            <Text className="text-xs font-bold text-primary">→</Text>
          </Pressable>
        </View>

        {/* Platform & Information */}
        <View className="mx-4 mb-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
          <Text className="text-xs font-bold text-foreground mb-3">Platform & Legal</Text>

          <Pressable
            onPress={() => router.push("/about" as any)}
            className="flex-row items-center justify-between py-2.5 border-b border-border"
          >
            <View className="flex-row items-center gap-2.5">
              <Icon name="info" size={16} color="#6B3AC2" />
              <Text className="text-xs font-semibold text-foreground">About FOREWORK & Creator</Text>
            </View>
            <Text className="text-xs font-bold text-primary">→</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push("/privacy-policy" as any)}
            className="flex-row items-center justify-between py-2.5 border-b border-border"
          >
            <View className="flex-row items-center gap-2.5">
              <Icon name="shield" size={16} color="#6B3AC2" />
              <Text className="text-xs font-semibold text-foreground">Privacy Policy</Text>
            </View>
            <Text className="text-xs font-bold text-primary">→</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push("/terms-of-service" as any)}
            className="flex-row items-center justify-between py-2.5"
          >
            <View className="flex-row items-center gap-2.5">
              <Icon name="file-text" size={16} color="#6B3AC2" />
              <Text className="text-xs font-semibold text-foreground">Terms of Service</Text>
            </View>
            <Text className="text-xs font-bold text-primary">→</Text>
          </Pressable>
        </View>

        {/* Account Actions & Danger Zone */}
        <View className="mx-4 mb-8 space-y-3">
          <Pressable
            onPress={handleLogout}
            className="rounded-xl border border-destructive/30 bg-destructive/10 py-3 items-center"
          >
            <Text className="text-xs font-bold text-destructive">Sign Out of Account</Text>
          </Pressable>

          <Pressable
            onPress={() => setDeleteModalOpen(true)}
            className="rounded-xl border border-rose-300 dark:border-rose-900 bg-rose-50/60 dark:bg-rose-950/30 py-3 items-center flex-row justify-center gap-1.5"
          >
            <Icon name="alert" size={14} color="#DC2626" />
            <Text className="text-xs font-bold text-rose-600 dark:text-rose-400">
              Delete Account & Personal Data (Irreversible)
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <EditProfileModal visible={editModalOpen} onClose={() => setEditModalOpen(false)} />

      {/* Compliance Account Deletion Modal */}
      <DeleteAccountModal visible={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} />
    </SafeAreaView>
  );
}
