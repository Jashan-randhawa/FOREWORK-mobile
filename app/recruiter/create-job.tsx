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
import API from "../../src/utils/axiosInstance";
import { JOB_API_ENDPOINT } from "../../src/utils/endpoints";
import useGetAllCompanies from "../../src/hooks/useGetAllCompanies";
import Icon from "../../src/components/common/Icon";
import RecruiterGuard from "../../src/components/recruiter/RecruiterGuard";

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship", "Remote"];

export default function CreateJobScreen() {
  const { loading: loadingCompanies } = useGetAllCompanies();
  const { companies = [] } = useSelector((store: any) => store.company);

  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    location: "",
    jobType: "Full-time",
    experience: "1",
    position: "1",
    companyId: "",
  });

  const [submitting, setSubmitting] = useState(false);

  // Auto-select first company if only one exists
  useEffect(() => {
    if (companies.length > 0 && !input.companyId) {
      setInput((prev) => ({ ...prev, companyId: companies[0]._id }));
    }
  }, [companies]);

  const handlePostJob = async () => {
    if (
      !input.title.trim() ||
      !input.description.trim() ||
      !input.requirements.trim() ||
      !input.salary.trim() ||
      !input.location.trim() ||
      !input.companyId
    ) {
      Alert.alert("Input Required", "Please fill in all required job posting fields.");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        title: input.title.trim(),
        description: input.description.trim(),
        requirements: input.requirements.trim(),
        salary: Number(input.salary) || 0,
        location: input.location.trim(),
        jobType: input.jobType,
        experience: Number(input.experience) || 0,
        position: Number(input.position) || 1,
        companyId: input.companyId,
      };

      const res = await API.post(`${JOB_API_ENDPOINT}/post`, payload);

      if (res.data?.success || res.data?.status) {
        Alert.alert("Success", "Job vacancy posted successfully and published to marketplace!");
        router.replace("/recruiter/jobs" as any);
      } else {
        Alert.alert("Notice", res.data?.message || "Failed to post job.");
      }
    } catch (err: any) {
      Alert.alert(
        "Posting Error",
        err.response?.data?.message || err.message || "An error occurred while deploying job vacancy."
      );
    } finally {
      setSubmitting(false);
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
          <Text className="text-sm font-black text-foreground">Post New Vacancy</Text>
          <View style={{ width: 40 }} />
        </View>

        {loadingCompanies ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator color="#6B3AC2" size="large" />
            <Text className="text-xs text-muted-foreground mt-2 font-medium">
              Loading verified companies...
            </Text>
          </View>
        ) : companies.length === 0 ? (
          <View className="flex-1 items-center justify-center p-6 space-y-4 text-center">
            <View className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-950/40 items-center justify-center border border-amber-300">
              <Icon name="building" size={24} color="#D97706" />
            </View>
            <Text className="text-lg font-black text-foreground text-center">
              Company Registration Required
            </Text>
            <Text className="text-xs text-muted-foreground text-center px-4">
              You must register at least one company profile before deploying job postings on FOREWORK.
            </Text>
            <Pressable
              onPress={() => router.push("/recruiter/create-company" as any)}
              className="rounded-xl bg-primary px-6 py-3"
            >
              <Text className="text-xs font-bold text-primary-foreground">
                + Register Company First
              </Text>
            </Pressable>
          </View>
        ) : (
          <ScrollView
            className="flex-1 px-5 py-5"
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 48 }}
          >
            <View className="space-y-4 mb-10">
              <View className="mb-2">
                <Text className="text-xl font-black text-foreground">
                  Create Job Posting
                </Text>
                <Text className="text-xs text-muted-foreground mt-0.5">
                  Deploy roles with customized requirements, salary ranges, and position parameters.
                </Text>
              </View>

              {/* Company Selection */}
              <View className="space-y-1.5">
                <Text className="text-xs font-bold text-foreground">
                  Hiring Organization *
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2 py-1">
                  {companies.map((c: any) => {
                    const isSelected = input.companyId === c._id;
                    return (
                      <Pressable
                        key={c._id}
                        onPress={() => setInput({ ...input, companyId: c._id })}
                        className={`rounded-xl border p-3 mr-2 ${
                          isSelected
                            ? "border-primary bg-primary/10"
                            : "border-border bg-card"
                        }`}
                      >
                        <Text
                          className={`text-xs font-bold ${
                            isSelected ? "text-primary" : "text-foreground"
                          }`}
                        >
                          {c.name}
                        </Text>
                        <Text className="text-[10px] text-muted-foreground">
                          {c.location || "Office"}
                        </Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>
              </View>

              {/* Role Title */}
              <View className="space-y-1.5">
                <Text className="text-xs font-bold text-foreground">
                  Job Title *
                </Text>
                <TextInput
                  value={input.title}
                  onChangeText={(val) => setInput({ ...input, title: val })}
                  placeholder="e.g. Senior Full Stack Engineer"
                  placeholderTextColor="#8E8799"
                  className="rounded-xl border border-border bg-card p-3.5 text-xs text-foreground"
                />
              </View>

              {/* Location & Salary */}
              <View className="grid grid-cols-2 flex-row gap-3">
                <View className="flex-1 space-y-1.5">
                  <Text className="text-xs font-bold text-foreground">
                    Location *
                  </Text>
                  <TextInput
                    value={input.location}
                    onChangeText={(val) => setInput({ ...input, location: val })}
                    placeholder="e.g. Bengaluru / Remote"
                    placeholderTextColor="#8E8799"
                    className="rounded-xl border border-border bg-card p-3.5 text-xs text-foreground"
                  />
                </View>

                <View className="flex-1 space-y-1.5">
                  <Text className="text-xs font-bold text-foreground">
                    Salary (LPA) *
                  </Text>
                  <TextInput
                    value={input.salary}
                    onChangeText={(val) => setInput({ ...input, salary: val })}
                    placeholder="e.g. 18"
                    placeholderTextColor="#8E8799"
                    keyboardType="numeric"
                    className="rounded-xl border border-border bg-card p-3.5 text-xs text-foreground"
                  />
                </View>
              </View>

              {/* Experience & Open Positions */}
              <View className="grid grid-cols-2 flex-row gap-3">
                <View className="flex-1 space-y-1.5">
                  <Text className="text-xs font-bold text-foreground">
                    Experience (Years) *
                  </Text>
                  <TextInput
                    value={input.experience}
                    onChangeText={(val) => setInput({ ...input, experience: val })}
                    placeholder="e.g. 3"
                    placeholderTextColor="#8E8799"
                    keyboardType="numeric"
                    className="rounded-xl border border-border bg-card p-3.5 text-xs text-foreground"
                  />
                </View>

                <View className="flex-1 space-y-1.5">
                  <Text className="text-xs font-bold text-foreground">
                    Open Positions *
                  </Text>
                  <TextInput
                    value={input.position}
                    onChangeText={(val) => setInput({ ...input, position: val })}
                    placeholder="e.g. 2"
                    placeholderTextColor="#8E8799"
                    keyboardType="numeric"
                    className="rounded-xl border border-border bg-card p-3.5 text-xs text-foreground"
                  />
                </View>
              </View>

              {/* Job Type Selector */}
              <View className="space-y-1.5">
                <Text className="text-xs font-bold text-foreground">
                  Employment Type *
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {JOB_TYPES.map((type) => {
                    const isSelected = input.jobType === type;
                    return (
                      <Pressable
                        key={type}
                        onPress={() => setInput({ ...input, jobType: type })}
                        className={`rounded-lg border px-3 py-1.5 ${
                          isSelected
                            ? "bg-primary border-primary"
                            : "bg-card border-border"
                        }`}
                      >
                        <Text
                          className={`text-xs font-bold ${
                            isSelected ? "text-primary-foreground" : "text-muted-foreground"
                          }`}
                        >
                          {type}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              {/* Requirements */}
              <View className="space-y-1.5">
                <Text className="text-xs font-bold text-foreground">
                  Key Requirements & Skills (comma-separated) *
                </Text>
                <TextInput
                  value={input.requirements}
                  onChangeText={(val) => setInput({ ...input, requirements: val })}
                  placeholder="React, TypeScript, Node.js, Next.js, Redux, PostgreSQL"
                  placeholderTextColor="#8E8799"
                  className="rounded-xl border border-border bg-card p-3.5 text-xs text-foreground"
                />
                <Text className="text-[10px] text-muted-foreground">
                  Used by the ATS algorithm for deterministic candidate match scoring.
                </Text>
              </View>

              {/* Job Description */}
              <View className="space-y-1.5">
                <Text className="text-xs font-bold text-foreground">
                  Job Description & Responsibilities *
                </Text>
                <TextInput
                  value={input.description}
                  onChangeText={(val) => setInput({ ...input, description: val })}
                  placeholder="Outline responsibilities, team structure, tech stack, and benefits..."
                  placeholderTextColor="#8E8799"
                  multiline
                  numberOfLines={5}
                  textAlignVertical="top"
                  className="rounded-xl border border-border bg-card p-3.5 text-xs text-foreground min-h-[110px]"
                />
              </View>

              {/* Submit Button */}
              <View className="pt-3 space-y-2.5">
                <Pressable
                  onPress={handlePostJob}
                  disabled={submitting}
                  className="rounded-xl bg-primary py-3.5 items-center justify-center shadow-md"
                >
                  {submitting ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <Text className="text-xs font-bold text-primary-foreground">
                      Deploy Job Vacancy ✨
                    </Text>
                  )}
                </Pressable>

                <Pressable
                  onPress={() => router.back()}
                  className="rounded-xl border border-border bg-card py-3.5 items-center justify-center"
                >
                  <Text className="text-xs font-bold text-foreground">Cancel</Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </RecruiterGuard>
  );
}
