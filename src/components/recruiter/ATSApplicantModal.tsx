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
import { ATS_API_ENDPOINT } from "../../utils/endpoints";
import Icon from "../common/Icon";
import ATSScoreGauge from "../ats/ATSScoreGauge";
import ScoreBreakdownView from "../ats/ScoreBreakdownView";
import SkillMatchView from "../ats/SkillMatchView";
import FormattingIssuesView from "../ats/FormattingIssuesView";
import RecommendationsView from "../ats/RecommendationsView";
import ATSExplanationModal from "../ats/ATSExplanationModal";

interface ATSApplicantModalProps {
  visible: boolean;
  onClose: () => void;
  applicationId: string;
  candidateName?: string;
  jobTitle?: string;
}

export const ATSApplicantModal: React.FC<ATSApplicantModalProps> = ({
  visible,
  onClose,
  applicationId,
  candidateName = "Candidate",
  jobTitle = "Position",
}) => {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [whyModalOpen, setWhyModalOpen] = useState(false);

  useEffect(() => {
    if (visible && applicationId) {
      fetchAnalysis();
    } else {
      setAnalysis(null);
      setError(null);
    }
  }, [visible, applicationId]);

  const fetchAnalysis = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await API.get(`${ATS_API_ENDPOINT}/application/${applicationId}`);
      if (res.data?.success && res.data.analysis) {
        setAnalysis(res.data.analysis);
      } else {
        setError(res.data?.message || "No ATS analysis available for this applicant.");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to load ATS analysis for this candidate."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
      >
        <View className="flex-1 bg-black/60 justify-end">
          <View className="bg-card rounded-t-3xl border-t border-border max-h-[90%] p-5 space-y-4">
            {/* Header */}
            <View className="flex-row items-center justify-between pb-3 border-b border-border">
              <View className="flex-row items-center gap-2 flex-1 pr-2">
                <View className="p-2 rounded-xl bg-primary/10">
                  <Icon name="sparkles" size={16} color="#6B3AC2" />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-black text-foreground" numberOfLines={1}>
                    ATS Evaluation: {candidateName}
                  </Text>
                  <Text className="text-[11px] text-muted-foreground" numberOfLines={1}>
                    Match for "{jobTitle}"
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
              <View className="py-20 items-center justify-center gap-2">
                <ActivityIndicator color="#6B3AC2" size="large" />
                <Text className="text-xs text-muted-foreground font-medium">
                  Extracting and evaluating candidate resume against job requirements...
                </Text>
              </View>
            ) : error ? (
              <View className="py-16 items-center text-center space-y-2">
                <Text className="text-xs font-bold text-destructive px-4 text-center">
                  {error}
                </Text>
                <Pressable
                  onPress={fetchAnalysis}
                  className="rounded-lg bg-primary/10 px-4 py-2 mt-2"
                >
                  <Text className="text-xs font-bold text-primary">Retry</Text>
                </Pressable>
              </View>
            ) : analysis ? (
              <ScrollView showsVerticalScrollIndicator={false} className="space-y-5">
                <ATSScoreGauge
                  atsCompatibilityScore={analysis.ats_compatibility_score}
                  jobMatchScore={analysis.job_match_score}
                  overallScore={analysis.overall_score}
                  confidence={analysis.confidence || { extraction: 0.95, matching: 0.9 }}
                  algorithmVersion={analysis.algorithm_version || "ats_v1.0"}
                  onOpenWhyModal={() => setWhyModalOpen(true)}
                />

                <ScoreBreakdownView
                  breakdown={analysis.breakdown || {}}
                  breakdownExplanations={analysis.analysis_json?.breakdown_reasons || {}}
                />

                <SkillMatchView
                  matchedSkills={analysis.skills?.matched || []}
                  missingRequired={analysis.skills?.missing_required || []}
                  missingPreferred={analysis.skills?.missing_preferred || []}
                  allMissing={analysis.skills?.all_missing || []}
                />

                <FormattingIssuesView issues={analysis.formatting_issues || []} />

                <RecommendationsView recommendations={analysis.recommendations || []} />

                <View style={{ height: 24 }} />
              </ScrollView>
            ) : null}
          </View>
        </View>
      </Modal>

      {analysis && (
        <ATSExplanationModal
          visible={whyModalOpen}
          onClose={() => setWhyModalOpen(false)}
          score={analysis.overall_score}
          explanation={analysis.explanation}
          breakdownReasons={analysis.analysis_json?.breakdown_reasons || {}}
        />
      )}
    </>
  );
};

export default ATSApplicantModal;
