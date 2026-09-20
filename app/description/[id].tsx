import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Share,
  Alert,
  SafeAreaView,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { setSingleJob } from "../../src/redux/jobSlice";
import API from "../../src/utils/axiosInstance";
import { JOB_API_ENDPOINT, APPLICATION_API_ENDPOINT } from "../../src/utils/endpoints";
import Icon from "../../src/components/common/Icon";
import JobCard from "../../src/components/jobs/JobCard";
import JobDetailATSCheck from "../../src/components/ats/JobDetailATSCheck";

export default function JobDescriptionScreen() {
  const params = useLocalSearchParams();
  const jobId = Array.isArray(params.id) ? params.id[0] : params.id;
  const dispatch = useDispatch();

  const { singleJob, allJobs = [], allAppliedJobs = [] } = useSelector(
    (store: any) => store.job
  );
  const { user } = useSelector((store: any) => store.auth);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchedJobIdRef = useRef<string | null>(null);

  const isRecruiter = user?.role === "Recruiter";

  const hasAlreadyApplied = useMemo(() => {
    if (!user?._id) return false;
    const inSingleJob = singleJob?.applications?.some(
      (app: any) =>
        app === user._id ||
        app?._id === user._id ||
        app?.applicant === user._id ||
        app?.applicant?._id === user._id
    );
    const inAppliedList = allAppliedJobs?.some(
      (applied: any) => (applied?.job?._id || applied?.job) === jobId
    );
    return Boolean(inSingleJob || inAppliedList);
  }, [singleJob, allAppliedJobs, user?._id, jobId]);

  const [isApplied, setIsApplied] = useState(hasAlreadyApplied);

  useEffect(() => {
    setIsApplied(hasAlreadyApplied);
  }, [hasAlreadyApplied]);

  // Fetch job details strictly once per jobId
  useEffect(() => {
    if (!jobId) return;
    if (singleJob?._id === jobId) return;
    if (fetchedJobIdRef.current === jobId) return;

    const fetchJob = async () => {
      setLoading(true);
      setError(null);
      try {
        fetchedJobIdRef.current = jobId;
        const res = await API.get(`${JOB_API_ENDPOINT}/get/${jobId}`);
        if (res.data?.success || res.data?.status) {
          dispatch(setSingleJob(res.data.job));
        } else {
          setError("Failed to fetch job details.");
          fetchedJobIdRef.current = null;
        }
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || "An error occurred.");
        fetchedJobIdRef.current = null;
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId, dispatch, singleJob?._id]);

  const applyJobHandler = async () => {
    if (!user) {
      Alert.alert("Authentication Required", "Please log in to apply for this job", [
        { text: "Cancel", style: "cancel" },
        { text: "Log In", onPress: () => router.push("/(auth)/login") },
      ]);
      return;
    }

    if (isRecruiter) {
      Alert.alert("Notice", "Recruiter accounts cannot apply to jobs.");
      return;
    }

    if (isApplied || hasAlreadyApplied) {
      setIsApplied(true);
      Alert.alert("Notice", "You have already applied for this job.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await API.post(`${APPLICATION_API_ENDPOINT}/apply/${jobId}`);
      if (res.data?.success) {
        setIsApplied(true);
        const updateSingleJob = {
          ...singleJob,
          applications: [...(singleJob.applications || []), { applicant: user?._id }],
        };
        dispatch(setSingleJob(updateSingleJob));
        Alert.alert("Success", res.data.message || "Application submitted successfully!");
      }
    } catch (err: any) {
      const isDuplicate =
        err.status === 409 ||
        err.response?.status === 409 ||
        err.message?.toLowerCase().includes("already applied");

      if (isDuplicate) {
        setIsApplied(true);
        Alert.alert("Notice", "You have already applied for this job.");
      } else {
        Alert.alert("Error", err.response?.data?.message || err.message || "Failed to submit application");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        title: singleJob?.title || "Job Opportunity on FOREWORK",
        message: `Check out this opening for ${singleJob?.title} at ${singleJob?.company?.name || "FOREWORK"}!`,
      });
    } catch {
      // User dismissed
    }
  };

  // Related jobs
  const relatedJobs = useMemo(() => {
    if (!singleJob?._id || !allJobs || allJobs.length === 0) return [];
    return allJobs.filter((j: any) => j._id !== singleJob._id).slice(0, 3);
  }, [singleJob, allJobs]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#6B3AC2" />
        <Text className="text-xs text-muted-foreground mt-2">Loading job details...</Text>
      </SafeAreaView>
    );
  }

  if (error || !singleJob) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center px-6">
        <Text className="text-center text-sm text-destructive">{error || "Job not found"}</Text>
        <Pressable onPress={() => router.back()} className="mt-4 rounded-xl bg-primary px-4 py-2">
          <Text className="text-xs font-bold text-primary-foreground">← Go Back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Top Header Bar */}
      <View className="flex-row items-center justify-between border-b border-border px-5 py-3 bg-card">
        <Pressable onPress={() => router.back()} className="flex-row items-center gap-1">
          <Text className="text-base font-bold text-primary">←</Text>
          <Text className="text-xs font-bold text-foreground">Back</Text>
        </Pressable>
        <Pressable onPress={handleShare} className="h-8 w-8 items-center justify-center rounded-full bg-secondary">
          <Icon name="share" size={14} color="#6B3AC2" />
        </Pressable>
      </View>

      <ScrollView className="flex-1 px-5 py-4" showsVerticalScrollIndicator={false}>
        {/* Company & Title Header Card */}
        <View className="rounded-2xl border border-border bg-card p-5 shadow-sm mb-4">
          <Text className="text-xs font-semibold text-primary">
            🏢 {singleJob?.company?.name || "Verified Organization"}
          </Text>
          <Text className="text-xl font-black text-foreground mt-1">
            {singleJob?.title}
          </Text>

          {/* Badges */}
          <View className="mt-3 flex-row flex-wrap gap-1.5">
            <View className="rounded-md bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900 px-2.5 py-1">
              <Text className="text-xs font-semibold text-primary">
                {singleJob?.jobType || "Full-time"}
              </Text>
            </View>
            <View className="rounded-md bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 px-2.5 py-1">
              <Text className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                ₹ {singleJob?.salary ? `${singleJob.salary} LPA` : "Competitive"}
              </Text>
            </View>
            <View className="rounded-md bg-secondary border border-border px-2.5 py-1">
              <Text className="text-xs font-medium text-foreground">
                📍 {singleJob?.location || "Remote / Hybrid"}
              </Text>
            </View>
          </View>
        </View>

        {/* Action Button & Match Check */}
        <View className="flex-row items-center gap-2 mb-4">
          <Pressable
            onPress={() => router.push("/ats" as any)}
            className="flex-row items-center justify-center gap-1.5 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3"
          >
            <Icon name="sparkles" size={14} color="#6B3AC2" />
            <Text className="text-xs font-bold text-primary">Check Match</Text>
          </Pressable>

          <Pressable
            onPress={isApplied || submitting || isRecruiter ? undefined : applyJobHandler}
            disabled={isApplied || submitting || isRecruiter}
            className={`flex-1 items-center justify-center rounded-xl py-3 shadow-md ${
              isApplied || isRecruiter ? "bg-muted" : "bg-primary"
            }`}
          >
            {submitting ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text
                className={`text-xs font-bold ${
                  isApplied || isRecruiter ? "text-muted-foreground" : "text-primary-foreground"
                }`}
              >
                {isRecruiter
                  ? "Recruiter Account"
                  : isApplied
                  ? "✓ Already Applied"
                  : "One-Click Apply Now"}
              </Text>
            )}
          </Pressable>
        </View>

        {/* Pre-Application ATS Diagnostic Widget */}
        {singleJob && (
          <JobDetailATSCheck
            job={singleJob}
            onApply={applyJobHandler}
            isApplied={isApplied}
            submitting={submitting}
          />
        )}

        {/* Detailed Metrics */}
        <View className="rounded-2xl border border-border bg-card p-4 shadow-sm mb-4">
          <View className="grid grid-cols-2 flex-row flex-wrap gap-4">
            <View className="flex-1 min-w-[120px]">
              <Text className="text-[11px] text-muted-foreground">Experience Required</Text>
              <Text className="text-sm font-bold text-foreground mt-0.5">
                {singleJob?.experienceLevel || 0}+ Year(s)
              </Text>
            </View>
            <View className="flex-1 min-w-[120px]">
              <Text className="text-[11px] text-muted-foreground">Total Applicants</Text>
              <Text className="text-sm font-bold text-foreground mt-0.5">
                {singleJob?.applications?.length || 0} Candidates
              </Text>
            </View>
          </View>
        </View>

        {/* Job Description Text */}
        <View className="rounded-2xl border border-border bg-card p-5 shadow-sm mb-6">
          <Text className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
            Job Description & Responsibilities
          </Text>
          <Text className="text-xs text-foreground leading-relaxed">
            {singleJob?.description}
          </Text>
        </View>

        {/* Related Opportunities */}
        {relatedJobs.length > 0 && (
          <View className="mb-8">
            <Text className="text-sm font-bold text-foreground mb-3">
              Similar Opportunities
            </Text>
            {relatedJobs.map((job: any) => (
              <JobCard key={job._id} job={job} />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
