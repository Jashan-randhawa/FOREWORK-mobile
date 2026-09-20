import React, { useState, useEffect } from "react";
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
import { useSelector } from "react-redux";
import API from "../src/utils/axiosInstance";
import { ATS_API_ENDPOINT, JOB_API_ENDPOINT } from "../src/utils/endpoints";
import Icon from "../src/components/common/Icon";

import ATSScoreGauge from "../src/components/ats/ATSScoreGauge";
import ScoreBreakdownView from "../src/components/ats/ScoreBreakdownView";
import SkillMatchView from "../src/components/ats/SkillMatchView";
import FormattingIssuesView from "../src/components/ats/FormattingIssuesView";
import RecommendationsView from "../src/components/ats/RecommendationsView";
import ATSExplanationModal from "../src/components/ats/ATSExplanationModal";

export default function ATSAnalysisScreen() {
  const { user } = useSelector((store: any) => store.auth);

  // Resume source state
  const [sourceMode, setSourceMode] = useState<"profile" | "paste">(
    user?.profile?.resume ? "profile" : "paste"
  );
  const [pastedText, setPastedText] = useState("");

  // Job description comparison state
  const [jobDescription, setJobDescription] = useState("");
  const [selectedJobId, setSelectedJobId] = useState("");
  const [availableJobs, setAvailableJobs] = useState<any[]>([]);

  // Execution state
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [whyModalOpen, setWhyModalOpen] = useState(false);

  useEffect(() => {
    fetchAvailableJobs();
    if (user) {
      fetchUserHistory();
      if (user.profile?.resume && sourceMode !== "profile") {
        setSourceMode("profile");
      }
    }
  }, [user]);

  const fetchAvailableJobs = async () => {
    try {
      const res = await API.get(`${JOB_API_ENDPOINT}/get`);
      if (res.data?.success) {
        setAvailableJobs(res.data.jobs || []);
      }
    } catch {
      // Silently handle
    }
  };

  const fetchUserHistory = async () => {
    try {
      setLoadingHistory(true);
      const res = await API.get(`${ATS_API_ENDPOINT}/history`);
      if (res.data?.success) {
        setHistory(res.data.history || []);
      }
    } catch {
      // Handled
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleRunAnalysis = async () => {
    if (sourceMode === "paste" && !pastedText.trim()) {
      Alert.alert("Input Required", "Please paste your resume text to analyze.");
      return;
    }

    if (sourceMode === "profile" && !user?.profile?.resume) {
      Alert.alert(
        "No Profile Resume",
        "Your profile does not currently have a stored resume. Please paste plain text or upload one in your profile."
      );
      setSourceMode("paste");
      return;
    }

    try {
      setAnalyzing(true);
      const payload: any = {};

      if (sourceMode === "profile") {
        payload.use_profile_resume = true;
      } else {
        payload.resume_text = pastedText.trim();
      }

      if (selectedJobId) {
        payload.job_id = selectedJobId;
      } else if (jobDescription.trim()) {
        payload.job_description = jobDescription.trim();
      }

      const res = await API.post(`${ATS_API_ENDPOINT}/analyze`, payload);

      if (res.data?.success) {
        setAnalysisResult(res.data);
        fetchUserHistory();
      } else {
        Alert.alert(
          "Notice",
          res.data?.message || "Analysis could not be completed."
        );
      }
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to analyze resume. Please verify document contents.";
      Alert.alert("Analysis Error", errorMsg);

      if (
        sourceMode === "profile" &&
        (errorMsg.toLowerCase().includes("storage") ||
          errorMsg.toLowerCase().includes("unauthorized") ||
          errorMsg.toLowerCase().includes("401"))
      ) {
        setSourceMode("paste");
      }
    } finally {
      setAnalyzing(false);
    }
  };

  const loadFromHistory = (item: any) => {
    setAnalysisResult({
      overall_score: item.overall_score,
      ats_compatibility_score: item.ats_compatibility_score,
      job_match_score: item.job_match_score,
      breakdown: item.breakdown,
      skills: item.skills,
      confidence: item.confidence,
      formatting_issues: item.formatting_issues,
      recommendations: item.recommendations,
      explanation: item.explanation,
      breakdown_explanations: item.analysis_json?.breakdown_reasons || {},
      algorithm_version: item.algorithm_version,
      created_at: item.createdAt,
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Top Navigation Header */}
      <View className="flex-row items-center justify-between border-b border-border px-5 py-3.5 bg-card">
        <Pressable onPress={() => router.back()} className="flex-row items-center gap-1.5">
          <Text className="text-base font-bold text-primary">←</Text>
          <Text className="text-xs font-bold text-foreground">Back</Text>
        </Pressable>
        <Text className="text-sm font-black text-foreground">ATS Intelligence Studio</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView className="flex-1 px-4 py-5" showsVerticalScrollIndicator={false}>
        {/* Banner Section */}
        <View className="items-center text-center space-y-2 mb-6">
          <View className="flex-row items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800">
            <Icon name="sparkles" size={12} color="#6B3AC2" />
            <Text className="text-[10px] font-bold text-primary">
              FOREWORK ATS Resume Intelligence
            </Text>
          </View>
          <Text className="text-2xl font-black text-foreground text-center">
            ATS Resume & Match Predictor
          </Text>
          <Text className="text-xs text-muted-foreground text-center px-2 leading-relaxed">
            Evaluate your resume parseability, identify layout risks, detect missing skills, and calculate alignment against target job descriptions with full transparency.
          </Text>
        </View>

        {/* Input Configuration Card */}
        <View className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-5 mb-6">
          {/* Step 1: Resume Source */}
          <View className="space-y-3">
            <View className="flex-row items-center gap-2">
              <Icon name="file-text" size={16} color="#6B3AC2" />
              <Text className="text-sm font-black text-foreground">
                Step 1: Select Resume Source
              </Text>
            </View>

            {/* Source Mode Switcher */}
            <View className="flex-row rounded-xl bg-muted/40 p-1">
              {user?.profile?.resume ? (
                <Pressable
                  onPress={() => setSourceMode("profile")}
                  className={`flex-1 py-2 rounded-lg items-center justify-center ${
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
                className={`flex-1 py-2 rounded-lg items-center justify-center ${
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

            {sourceMode === "profile" ? (
              <View className="p-3.5 rounded-xl border border-purple-200 dark:border-purple-900/50 bg-purple-50/40 dark:bg-purple-950/20 flex-row items-center justify-between">
                <View className="flex-row items-center gap-2.5 flex-1 pr-2">
                  <View className="p-2 rounded-lg bg-card text-primary shadow-2xs">
                    <Icon name="file-text" size={16} color="#6B3AC2" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-xs font-bold text-foreground" numberOfLines={1}>
                      {user?.profile?.resumeOriginalname || user?.profile?.resumeOriginalName || "Profile Resume"}
                    </Text>
                    <Text className="text-[10px] text-muted-foreground">
                      Attached to account ({user?.email})
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
                  Resume Content:
                </Text>
                <TextInput
                  value={pastedText}
                  onChangeText={setPastedText}
                  placeholder="Paste complete resume text here including summary, work experience, education, and technical skills..."
                  placeholderTextColor="#8E8799"
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                  className="rounded-xl border border-border bg-card p-3.5 text-xs text-foreground min-h-[120px]"
                />
              </View>
            )}
          </View>

          {/* Step 2: Target Job Description */}
          <View className="pt-4 border-t border-border space-y-3">
            <View className="flex-row items-center gap-2">
              <Icon name="briefcase" size={16} color="#6B3AC2" />
              <Text className="text-sm font-black text-foreground">
                Step 2: Compare Against Target Job (Optional)
              </Text>
            </View>
            <Text className="text-[11px] text-muted-foreground">
              Pick an active role or paste job requirements to calculate Job Match Fit (0–100) and identify missing required skills.
            </Text>

            {/* Quick Pick Active Jobs */}
            {availableJobs.length > 0 && (
              <View className="space-y-1.5">
                <Text className="text-[11px] font-bold text-foreground">
                  Pick Active Role on FOREWORK:
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2 py-1">
                  <Pressable
                    onPress={() => {
                      setSelectedJobId("");
                    }}
                    className={`rounded-xl border p-2.5 mr-2 ${
                      !selectedJobId ? "border-primary bg-primary/10" : "border-border bg-card"
                    }`}
                  >
                    <Text className={`text-xs font-bold ${!selectedJobId ? "text-primary" : "text-foreground"}`}>
                      Custom Text
                    </Text>
                    <Text className="text-[10px] text-muted-foreground">Paste below</Text>
                  </Pressable>

                  {availableJobs.map((j) => (
                    <Pressable
                      key={j._id}
                      onPress={() => {
                        setSelectedJobId(j._id);
                        setJobDescription("");
                      }}
                      className={`rounded-xl border p-2.5 mr-2 max-w-[170px] ${
                        selectedJobId === j._id ? "border-primary bg-primary/10" : "border-border bg-card"
                      }`}
                    >
                      <Text className={`text-xs font-bold ${selectedJobId === j._id ? "text-primary" : "text-foreground"}`} numberOfLines={1}>
                        {j.title}
                      </Text>
                      <Text className="text-[10px] text-primary" numberOfLines={1}>
                        {j.company?.name || "Company"}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            )}

            {!selectedJobId && (
              <View className="space-y-1.5">
                <Text className="text-[11px] font-bold text-foreground">
                  Target Job Description Text:
                </Text>
                <TextInput
                  value={jobDescription}
                  onChangeText={setJobDescription}
                  placeholder="Paste job posting text (including Requirements, Qualifications, Responsibilities)..."
                  placeholderTextColor="#8E8799"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  className="rounded-xl border border-border bg-card p-3 text-xs text-foreground min-h-[90px]"
                />
              </View>
            )}
          </View>

          {/* Action Button */}
          <Pressable
            onPress={handleRunAnalysis}
            disabled={analyzing}
            className="rounded-xl bg-primary py-3.5 items-center justify-center shadow-md"
          >
            {analyzing ? (
              <View className="flex-row items-center gap-2">
                <ActivityIndicator color="#FFFFFF" size="small" />
                <Text className="text-xs font-bold text-primary-foreground">
                  Evaluating Resume Content...
                </Text>
              </View>
            ) : (
              <View className="flex-row items-center gap-2">
                <Icon name="sparkles" size={14} color="#FFFFFF" />
                <Text className="text-xs font-bold text-primary-foreground">
                  Run ATS Compatibility Analysis
                </Text>
              </View>
            )}
          </Pressable>
        </View>

        {/* Results Section */}
        {analysisResult && (
          <View className="space-y-6 mb-8">
            <ATSScoreGauge
              atsCompatibilityScore={analysisResult.ats_compatibility_score}
              jobMatchScore={analysisResult.job_match_score}
              overallScore={analysisResult.overall_score}
              confidence={analysisResult.confidence || { extraction: 0.95, matching: 0.9 }}
              algorithmVersion={analysisResult.algorithm_version || "ats_v1.0"}
              onOpenWhyModal={() => setWhyModalOpen(true)}
            />

            <ScoreBreakdownView
              breakdown={analysisResult.breakdown || {}}
              breakdownExplanations={analysisResult.breakdown_explanations || analysisResult.analysis_json?.breakdown_reasons || {}}
            />

            <SkillMatchView
              matchedSkills={analysisResult.skills?.matched || []}
              missingRequired={analysisResult.skills?.missing_required || []}
              missingPreferred={analysisResult.skills?.missing_preferred || []}
              allMissing={analysisResult.skills?.missing || analysisResult.skills?.all_missing || []}
            />

            <FormattingIssuesView issues={analysisResult.formatting_issues || []} />

            <RecommendationsView recommendations={analysisResult.recommendations || []} />
          </View>
        )}

        {/* Historical Scans */}
        {history.length > 0 && (
          <View className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4 mb-10">
            <View className="flex-row items-center justify-between pb-3 border-b border-border">
              <View className="flex-row items-center gap-2">
                <Icon name="clock" size={16} color="#6B3AC2" />
                <Text className="text-sm font-black text-foreground">
                  Recent ATS Scans
                </Text>
              </View>
              <Text className="text-[11px] text-muted-foreground">
                {history.length} recorded
              </Text>
            </View>

            <View className="space-y-2.5">
              {history.slice(0, 10).map((item) => (
                <Pressable
                  key={item._id}
                  onPress={() => loadFromHistory(item)}
                  className="p-3 rounded-xl border border-border bg-muted/20 space-y-1.5"
                >
                  <View className="flex-row items-center justify-between">
                    <Text className="text-xs font-bold text-primary flex-1 mr-2" numberOfLines={1}>
                      {item.job?.title || "General Resume Scan"}
                    </Text>
                    <Text className="text-xs font-black text-foreground">
                      {item.overall_score}/100
                    </Text>
                  </View>

                  <View className="flex-row items-center justify-between">
                    <Text className="text-[10px] text-muted-foreground">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </Text>
                    <Text className="text-[10px] font-bold text-primary">
                      View Report →
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {analysisResult && (
        <ATSExplanationModal
          visible={whyModalOpen}
          onClose={() => setWhyModalOpen(false)}
          score={analysisResult.overall_score}
          explanation={analysisResult.explanation}
          breakdownReasons={analysisResult.breakdown_explanations || analysisResult.analysis_json?.breakdown_reasons}
        />
      )}
    </SafeAreaView>
  );
}
