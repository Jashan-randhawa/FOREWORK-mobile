import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Linking,
  Alert,
  SafeAreaView,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import API from "../../../../src/utils/axiosInstance";
import { APPLICATION_API_ENDPOINT } from "../../../../src/utils/endpoints";
import Icon from "../../../../src/components/common/Icon";
import RecruiterGuard from "../../../../src/components/recruiter/RecruiterGuard";
import ScheduleInterviewModal from "../../../../src/components/recruiter/ScheduleInterviewModal";
import RecruiterNotesModal from "../../../../src/components/recruiter/RecruiterNotesModal";
import ATSApplicantModal from "../../../../src/components/recruiter/ATSApplicantModal";

export default function JobApplicantsScreen() {
  const params = useLocalSearchParams();
  const jobId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [loading, setLoading] = useState(true);
  const [job, setJob] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [accessDenied, setAccessDenied] = useState(false);
  const [updatingAppId, setUpdatingAppId] = useState<string | null>(null);

  // Modals state
  const [scheduleApp, setScheduleApp] = useState<any>(null);
  const [notesApp, setNotesApp] = useState<any>(null);
  const [atsApp, setAtsApp] = useState<any>(null);

  useEffect(() => {
    if (jobId) {
      fetchApplicants();
    }
  }, [jobId]);

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      setAccessDenied(false);
      const res = await API.get(`${APPLICATION_API_ENDPOINT}/${jobId}/applicants`);
      if (res.data?.success && res.data.job) {
        setJob(res.data.job);
        setApplications(res.data.job.applications || []);
      } else {
        Alert.alert("Notice", res.data?.message || "Failed to load applicants.");
      }
    } catch (err: any) {
      if (err.response?.status === 403) {
        setAccessDenied(true);
      } else {
        Alert.alert(
          "Error",
          err.response?.data?.message || err.message || "Failed to fetch candidate applications."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appId: string, nextStatus: string) => {
    try {
      setUpdatingAppId(appId);
      const res = await API.post(
        `${APPLICATION_API_ENDPOINT}/status/${appId}/update`,
        { status: nextStatus }
      );

      if (res.data?.success) {
        // Update local application state
        setApplications((prev) =>
          prev.map((app) => (app._id === appId ? { ...app, status: nextStatus } : app))
        );
        Alert.alert("Status Updated", `Candidate marked as ${nextStatus}.`);
      } else {
        Alert.alert("Notice", res.data?.message || "Could not update status.");
      }
    } catch (err: any) {
      Alert.alert(
        "Update Failed",
        err.response?.data?.message || err.message || "Failed to update applicant status."
      );
    } finally {
      setUpdatingAppId(null);
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
          <Text className="text-sm font-black text-foreground">Candidate Pipeline</Text>
          <Pressable onPress={fetchApplicants} className="p-1 rounded-lg bg-muted/40">
            <Icon name="refresh" size={14} color="#6B3AC2" />
          </Pressable>
        </View>

        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator color="#6B3AC2" size="large" />
            <Text className="text-xs text-muted-foreground mt-2 font-medium">
              Retrieving applicant submissions...
            </Text>
          </View>
        ) : accessDenied ? (
          <View className="flex-1 items-center justify-center p-6 space-y-4 text-center">
            <View className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950/40 items-center justify-center border border-rose-300">
              <Icon name="shield" size={24} color="#DC2626" />
            </View>
            <Text className="text-lg font-black text-foreground text-center">
              Access Denied: Job Not Yours
            </Text>
            <Text className="text-xs text-muted-foreground text-center px-4">
              You do not have permission to view applicants for this vacancy. Only the recruiter who created this job posting can screen candidate submissions.
            </Text>
            <Pressable
              onPress={() => router.replace("/recruiter/jobs" as any)}
              className="rounded-xl bg-primary px-6 py-3"
            >
              <Text className="text-xs font-bold text-primary-foreground">
                Back to My Jobs →
              </Text>
            </Pressable>
          </View>
        ) : (
          <ScrollView
            className="flex-1 px-4 py-4"
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 48 }}
          >
            {/* Vacancy Summary Card */}
            <View className="rounded-2xl border border-border bg-card p-4 mb-4 space-y-1 shadow-2xs">
              <Text className="text-[11px] font-bold text-primary">
                Position Applications
              </Text>
              <Text className="text-lg font-black text-foreground" numberOfLines={1}>
                {job?.title || "Role"}
              </Text>
              <Text className="text-xs text-muted-foreground">
                {applications.length} Candidate(s) Applied
              </Text>
            </View>

            {/* Applications List */}
            {applications.length > 0 ? (
              <View className="space-y-4 mb-10">
                {applications.map((app: any) => {
                  const candidate = app.applicant || {};
                  const isUpdating = updatingAppId === app._id;
                  const status = (app.status || "pending").toLowerCase();
                  const atsScore = app.atsScore;

                  return (
                    <View
                      key={app._id}
                      className="rounded-2xl border border-border bg-card p-4 space-y-3 shadow-2xs"
                    >
                      {/* Candidate Header */}
                      <View className="flex-row items-start justify-between">
                        <View className="flex-1 pr-2">
                          <Text className="text-base font-black text-foreground">
                            {candidate.fullname || "Anonymous Candidate"}
                          </Text>
                          <Text className="text-xs text-muted-foreground mt-0.5">
                            ✉ {candidate.email || "No email"}
                          </Text>
                          {candidate.phoneNumber ? (
                            <Text className="text-xs text-muted-foreground mt-0.5">
                              📞 {candidate.phoneNumber}
                            </Text>
                          ) : null}
                        </View>

                        {/* Status Badge */}
                        <View
                          className={`rounded-full px-2.5 py-0.5 border ${
                            status === "accepted"
                              ? "bg-emerald-100 dark:bg-emerald-950/60 border-emerald-300"
                              : status === "rejected"
                              ? "bg-rose-100 dark:bg-rose-950/60 border-rose-300"
                              : "bg-amber-100 dark:bg-amber-950/60 border-amber-300"
                          }`}
                        >
                          <Text
                            className={`text-[10px] font-black uppercase tracking-wider ${
                              status === "accepted"
                                ? "text-emerald-800 dark:text-emerald-300"
                                : status === "rejected"
                                ? "text-rose-800 dark:text-rose-300"
                                : "text-amber-800 dark:text-amber-300"
                            }`}
                          >
                            ● {status}
                          </Text>
                        </View>
                      </View>

                      {/* Candidate Skills */}
                      {candidate.profile?.skills && candidate.profile.skills.length > 0 && (
                        <View className="flex-row flex-wrap gap-1 pt-1">
                          {candidate.profile.skills.slice(0, 5).map((sk: string, idx: number) => (
                            <View
                              key={idx}
                              className="rounded-md bg-muted/40 border border-border px-2 py-0.5"
                            >
                              <Text className="text-[10px] text-foreground">{sk}</Text>
                            </View>
                          ))}
                        </View>
                      )}

                      {/* Diagnostic & Resume Row */}
                      <View className="flex-row items-center justify-between pt-2 border-t border-border">
                        {/* ATS Score Preview */}
                        <Pressable
                          onPress={() => setAtsApp(app)}
                          className="flex-row items-center gap-1.5 rounded-lg bg-primary/10 px-2.5 py-1.5 border border-primary/20"
                        >
                          <Icon name="sparkles" size={12} color="#6B3AC2" />
                          <Text className="text-xs font-bold text-primary">
                            ATS: {atsScore !== null && atsScore !== undefined ? `${atsScore}%` : "Analyze"} ↗
                          </Text>
                        </Pressable>

                        {/* Resume Link */}
                        {candidate.profile?.resume ? (
                          <Pressable
                            onPress={() => Linking.openURL(candidate.profile.resume)}
                            className="flex-row items-center gap-1.5 rounded-lg bg-muted/30 px-2.5 py-1.5 border border-border"
                          >
                            <Icon name="file-text" size={12} color="#6B3AC2" />
                            <Text className="text-xs font-bold text-foreground">
                              View Resume ↗
                            </Text>
                          </Pressable>
                        ) : (
                          <Text className="text-[11px] text-muted-foreground italic">
                            No resume uploaded
                          </Text>
                        )}
                      </View>

                      {/* Interview Information (if scheduled) */}
                      {app.scheduledAt ? (
                        <View className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 space-y-1.5">
                          <View className="flex-row items-center justify-between">
                            <Text className="text-xs font-bold text-primary">
                              📅 Interview Scheduled:
                            </Text>
                            <Pressable
                              onPress={() => setScheduleApp(app)}
                              className="rounded-md bg-primary/10 px-2 py-0.5"
                            >
                              <Text className="text-[10px] font-bold text-primary">
                                Reschedule
                              </Text>
                            </Pressable>
                          </View>
                          <Text className="text-[11px] text-foreground">
                            {new Date(app.scheduledAt).toLocaleString()}
                          </Text>
                          {app.meetingLink ? (
                            <Pressable onPress={() => Linking.openURL(app.meetingLink)}>
                              <Text className="text-[11px] font-semibold text-primary" numberOfLines={1}>
                                🔗 {app.meetingLink}
                              </Text>
                            </Pressable>
                          ) : null}
                        </View>
                      ) : null}

                      {/* Recruiter Action Strip */}
                      <View className="pt-2 border-t border-border flex-row items-center justify-between gap-1.5">
                        <Pressable
                          onPress={() => setNotesApp(app)}
                          className="flex-1 py-2 rounded-xl border border-border bg-muted/20 items-center justify-center"
                        >
                          <Text className="text-xs font-bold text-foreground">
                            Notes ({app.recruiterNotes?.length || 0}) ✎
                          </Text>
                        </Pressable>

                        <Pressable
                          onPress={() => setScheduleApp(app)}
                          className="flex-1 py-2 rounded-xl border border-primary/30 bg-primary/10 items-center justify-center"
                        >
                          <Text className="text-xs font-bold text-primary">
                            {app.scheduledAt ? "Interview 📅" : "Schedule 📅"}
                          </Text>
                        </Pressable>
                      </View>

                      {/* Decision Bar */}
                      <View className="flex-row items-center gap-2 pt-1">
                        {status !== "accepted" && (
                          <Pressable
                            onPress={() => handleStatusUpdate(app._id, "accepted")}
                            disabled={isUpdating}
                            className="flex-1 py-2 rounded-xl bg-emerald-600 items-center justify-center shadow-2xs"
                          >
                            <Text className="text-xs font-bold text-white">
                              ✓ Accept
                            </Text>
                          </Pressable>
                        )}

                        {status !== "rejected" && (
                          <Pressable
                            onPress={() => handleStatusUpdate(app._id, "rejected")}
                            disabled={isUpdating}
                            className="flex-1 py-2 rounded-xl bg-rose-600 items-center justify-center shadow-2xs"
                          >
                            <Text className="text-xs font-bold text-white">
                              ✕ Reject
                            </Text>
                          </Pressable>
                        )}

                        {status !== "pending" && (
                          <Pressable
                            onPress={() => handleStatusUpdate(app._id, "pending")}
                            disabled={isUpdating}
                            className="py-2 px-3 rounded-xl border border-border bg-muted items-center justify-center"
                          >
                            <Text className="text-xs font-bold text-muted-foreground">
                              Reset
                            </Text>
                          </Pressable>
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
            ) : (
              <View className="py-16 items-center text-center space-y-2">
                <View className="w-16 h-16 rounded-full bg-muted/40 items-center justify-center">
                  <Icon name="user" size={24} color="#8E8799" />
                </View>
                <Text className="text-sm font-bold text-foreground">
                  No applicants yet
                </Text>
                <Text className="text-xs text-muted-foreground px-6 text-center">
                  Candidate submissions for this position will appear here as soon as job seekers apply.
                </Text>
              </View>
            )}
          </ScrollView>
        )}

        {/* Schedule Modal */}
        {scheduleApp && (
          <ScheduleInterviewModal
            visible={Boolean(scheduleApp)}
            onClose={() => setScheduleApp(null)}
            applicationId={scheduleApp._id}
            candidateName={scheduleApp.applicant?.fullname}
            currentScheduledAt={scheduleApp.scheduledAt}
            currentMeetingLink={scheduleApp.meetingLink}
            onSuccess={(updated) => {
              setApplications((prev) =>
                prev.map((a) => (a._id === updated._id ? { ...a, ...updated } : a))
              );
            }}
          />
        )}

        {/* Recruiter Notes Modal */}
        {notesApp && (
          <RecruiterNotesModal
            visible={Boolean(notesApp)}
            onClose={() => setNotesApp(null)}
            applicationId={notesApp._id}
            candidateName={notesApp.applicant?.fullname}
            existingNotes={notesApp.recruiterNotes || []}
            onSuccess={(updatedNotes) => {
              setApplications((prev) =>
                prev.map((a) =>
                  a._id === notesApp._id ? { ...a, recruiterNotes: updatedNotes } : a
                )
              );
            }}
          />
        )}

        {/* ATS Modal */}
        {atsApp && (
          <ATSApplicantModal
            visible={Boolean(atsApp)}
            onClose={() => setAtsApp(null)}
            applicationId={atsApp._id}
            candidateName={atsApp.applicant?.fullname}
            jobTitle={job?.title}
          />
        )}
      </SafeAreaView>
    </RecruiterGuard>
  );
}
