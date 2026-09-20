import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { useSelector } from "react-redux";
import API from "../../utils/axiosInstance";
import { ATS_API_ENDPOINT } from "../../utils/endpoints";
import Icon from "../common/Icon";
import { ScoreDisc, getScoreTone } from "./ATSScoreGauge";
import ATSExplanationModal from "./ATSExplanationModal";

interface JobDetailATSCheckProps {
  job: any;
  onApply?: () => void;
  isApplied?: boolean;
  submitting?: boolean;
}

export const JobDetailATSCheck: React.FC<JobDetailATSCheckProps> = ({
  job,
  onApply,
  isApplied = false,
  submitting = false,
}) => {
  const { user } = useSelector((store: any) => store.auth);

  const [sourceMode, setSourceMode] = useState<"profile" | "paste">(
    user?.profile?.resume ? "profile" : "paste"
  );
  const [pastedText, setPastedText] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [whyModalOpen, setWhyModalOpen] = useState(false);

  const isRecruiter = user?.role === "Recruiter";

  if (isRecruiter) {
    return (
      <View className="rounded-2xl border border-purple-200 dark:border-purple-900/50 bg-purple-50/50 dark:bg-purple-950/20 p-4 mb-5">
        <View className="flex-row items-center gap-2.5">
          <View className="p-2 rounded-xl bg-primary/10">
            <Icon name="sparkles" size={16} color="#6B3AC2" />
          </View>
          <View className="flex-1">
            <Text className="text-xs font-bold text-foreground">
              Recruiter ATS Diagnostic Mode
            </Text>
            <Text className="text-[11px] text-muted-foreground mt-0.5">
              Candidate parseability scores and job match evaluations are calculated and visible in your applicant pipeline.
            </Text>
          </View>
        </View>
      </View>
    );
  }

  const handleRunCheck = async () => {
    if (!user) {
      Alert.alert("Sign In Required", "Please sign in to check your resume compatibility.", [
        { text: "Cancel", style: "cancel" },
        { text: "Sign In", onPress: () => router.push("/(auth)/login") },
      ]);
      return;
    }

    if (sourceMode === "paste" && !pastedText.trim()) {
      Alert.alert("Input Required", "Please paste your resume text to analyze match compatibility.");
      return;
    }

    try {
      setAnalyzing(true);
      const payload: any = {
        job_id: job._id,
      };

      if (sourceMode === "profile") {
        payload.use_profile_resume = true;
      } else {
        payload.resume_text = pastedText.trim();
      }

      const res = await API.post(`${ATS_API_ENDPOINT}/analyze`, payload);

      if (res.data?.success) {
        setAnalysisResult(res.data);
      } else {
        Alert.alert("Notice", res.data?.message || "Could not analyze resume against this position.");
      }
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to calculate match compatibility.";
      Alert.alert("Analysis Error", errorMsg);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <View className="rounded-2xl border border-purple-300/70 dark:border-purple-900/60 bg-card p-5 mb-6 shadow-xs">
      {/* Header Accent Pill */}
      <View className="flex-row items-center justify-between pb-3 border-b border-border">
        <View className="flex-1 pr-2">
          <View className="flex-row items-center gap-1.5 mb-1">
            <View className="rounded-full bg-primary/10 px-2 py-0.5 border border-primary/20">
              <Text className="text-[10px] font-bold text-primary">
                Pre-Application Diagnostic
              </Text>
            </View>
          </View>
          <Text className="text-base font-black text-foreground">
            Resume Match & ATS Check
          </Text>
          <Text className="text-[11px] text-muted-foreground mt-0.5">
            Check how well your resume matches "{job?.title}" before applying.
          </Text>
        </View>

        {analysisResult && (
          <Pressable
            onPress={() => setAnalysisResult(null)}
            className="flex-row items-center gap-1 rounded-lg bg-muted/30 px-2 py-1"
          >
            <Icon name="refresh" size={10} color="#8E8799" />
            <Text className="text-[10px] font-semibold text-muted-foreground">Reset</Text>
          </Pressable>
        )}
      </View>

      {/* Unauthenticated Prompt */}
      {!user && (
        <View className="py-5 items-center space-y-2.5">
          <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center">
            <Icon name="sparkles" size={20} color="#6B3AC2" />
          </View>
          <Text className="text-sm font-bold text-foreground text-center">
            Sign In to Check Compatibility
          </Text>
          <Text className="text-xs text-muted-foreground text-center px-4">
            Verify resume parseability, detect missing required skills, and maximize your shortlisting chances.
          </Text>
          <Pressable
            onPress={() => router.push("/(auth)/login")}
            className="rounded-xl bg-primary px-5 py-2.5 mt-1"
          >
            <Text className="text-xs font-bold text-primary-foreground">
              Sign In to Check Match →
            </Text>
          </Pressable>
        </View>
      )}

      {/* Authenticated Configuration View (Before analysis) */}
      {user && !analysisResult && (
        <View className="pt-4 space-y-3.5">
          {/* Source Selector */}
          <View className="flex-row rounded-xl bg-muted/40 p-1">
            {user?.profile?.resume ? (
              <Pressable
                onPress={() => setSourceMode("profile")}
                className={`flex-1 py-1.5 rounded-lg items-center justify-center ${
                  sourceMode === "profile" ? "bg-card shadow-xs" : ""
                }`}
              >
                <Text
                  className={`text-xs font-bold ${
                    sourceMode === "profile" ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  Profile Resume
                </Text>
              </Pressable>
            ) : null}

            <Pressable
              onPress={() => setSourceMode("paste")}
              className={`flex-1 py-1.5 rounded-lg items-center justify-center ${
                sourceMode === "paste" ? "bg-card shadow-xs" : ""
              }`}
            >
              <Text
                className={`text-xs font-bold ${
                  sourceMode === "paste" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                Paste Plain Text
              </Text>
            </Pressable>
          </View>

          {/* Mode Details */}
          {sourceMode === "profile" ? (
            <View className="p-3 rounded-xl border border-purple-200 dark:border-purple-900/50 bg-purple-50/40 dark:bg-purple-950/20 flex-row items-center justify-between">
              <View className="flex-row items-center gap-2.5 flex-1 pr-2">
                <Icon name="file-text" size={18} color="#6B3AC2" />
                <View className="flex-1">
                  <Text className="text-xs font-bold text-foreground" numberOfLines={1}>
                    {user?.profile?.resumeOriginalname || user?.profile?.resumeOriginalName || "Profile Resume"}
                  </Text>
                  <Text className="text-[10px] text-muted-foreground">
                    Attached to your account
                  </Text>
                </View>
              </View>
              <View className="flex-row items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 border border-emerald-300">
                <Icon name="check" size={10} color="#059669" />
                <Text className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400">Ready</Text>
              </View>
            </View>
          ) : (
            <View className="space-y-1.5">
              <Text className="text-[11px] font-bold text-foreground">
                Paste Resume Text / Highlights:
              </Text>
              <TextInput
                value={pastedText}
                onChangeText={setPastedText}
                placeholder="Paste your technical summary, core skills, and past experience..."
                placeholderTextColor="#8E8799"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                className="rounded-xl border border-border bg-card p-3 text-xs text-foreground min-h-[80px]"
              />
            </View>
          )}

          {/* Trigger Button */}
          <Pressable
            onPress={handleRunCheck}
            disabled={analyzing}
            className="rounded-xl bg-primary py-3 items-center justify-center shadow-xs"
          >
            {analyzing ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text className="text-xs font-bold text-primary-foreground">
                Check Match Compatibility ✨
              </Text>
            )}
          </Pressable>
        </View>
      )}

      {/* Analysis Results View */}
      {user && analysisResult && (
        <View className="pt-4 space-y-4">
          {/* Dual Discs */}
          <View className="flex-row items-center justify-around py-1">
            <ScoreDisc
              score={analysisResult.job_match_score ?? analysisResult.overall_score}
              title="Job Match Fit"
              subtitle={getScoreTone(analysisResult.job_match_score ?? analysisResult.overall_score).label}
              size={90}
            />

            <ScoreDisc
              score={analysisResult.ats_compatibility_score ?? 85}
              title="ATS Parseability"
              subtitle="Valid Structure"
              size={90}
            />
          </View>

          {/* Skills Breakdown Badges */}
          <View className="space-y-2 pt-2 border-t border-border">
            {analysisResult.skills?.matched && analysisResult.skills.matched.length > 0 && (
              <View className="space-y-1.5">
                <Text className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                  ✓ Matched Skills ({analysisResult.skills.matched.length}):
                </Text>
                <View className="flex-row flex-wrap gap-1.5">
                  {analysisResult.skills.matched.slice(0, 6).map((skill: string, idx: number) => (
                    <View
                      key={idx}
                      className="rounded-md bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 px-2 py-0.5"
                    >
                      <Text className="text-[10px] font-semibold text-emerald-800 dark:text-emerald-300">
                        {skill}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {analysisResult.skills?.missing_required && analysisResult.skills.missing_required.length > 0 && (
              <View className="space-y-1.5 pt-1">
                <Text className="text-[11px] font-bold text-rose-700 dark:text-rose-400">
                  ✗ Missing Required Skills ({analysisResult.skills.missing_required.length}):
                </Text>
                <View className="flex-row flex-wrap gap-1.5">
                  {analysisResult.skills.missing_required.slice(0, 6).map((skill: string, idx: number) => (
                    <View
                      key={idx}
                      className="rounded-md bg-rose-50 dark:bg-rose-950/40 border border-rose-300 px-2 py-0.5"
                    >
                      <Text className="text-[10px] font-semibold text-rose-800 dark:text-rose-300">
                        {skill}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* Action CTA & Navigation */}
          <View className="pt-3 border-t border-border flex-row items-center justify-between gap-2">
            {!isApplied && onApply ? (
              <Pressable
                onPress={onApply}
                disabled={submitting}
                className="rounded-xl bg-primary px-4 py-2.5 flex-row items-center gap-1.5 shadow-xs flex-1 justify-center"
              >
                {submitting ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <>
                    <Icon name="send" size={12} color="#FFFFFF" />
                    <Text className="text-xs font-bold text-primary-foreground">
                      Proceed to Apply
                    </Text>
                  </>
                )}
              </Pressable>
            ) : null}

            <Pressable
              onPress={() => router.push("/ats")}
              className="rounded-xl border border-primary/40 bg-primary/10 px-3 py-2.5 items-center justify-center"
            >
              <Text className="text-xs font-bold text-primary">
                Full Studio →
              </Text>
            </Pressable>
          </View>
        </View>
      )}

      {analysisResult && (
        <ATSExplanationModal
          visible={whyModalOpen}
          onClose={() => setWhyModalOpen(false)}
          score={analysisResult.overall_score}
          explanation={analysisResult.explanation}
          breakdownReasons={analysisResult.breakdown_explanations || analysisResult.analysis_json?.breakdown_reasons}
        />
      )}
    </View>
  );
};

export default JobDetailATSCheck;
