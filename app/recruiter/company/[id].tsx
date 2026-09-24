import React, { useEffect, useState } from "react";
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
import { useLocalSearchParams, router } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import API from "../../../src/utils/axiosInstance";
import { COMPANY_API_ENDPOINT } from "../../../src/utils/endpoints";
import { setSingleCompany } from "../../../src/redux/companySlice";
import { unwrapItem } from "../../../src/services/http";
import Icon from "../../../src/components/common/Icon";
import RecruiterGuard from "../../../src/components/recruiter/RecruiterGuard";

export default function CompanySetupScreen() {
  const params = useLocalSearchParams();
  const companyId = Array.isArray(params.id) ? params.id[0] : params.id;
  const dispatch = useDispatch();
  const { singleCompany } = useSelector((store: any) => store.company);

  const [input, setInput] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
  });

  const [initialLoading, setInitialLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    if (companyId) {
      fetchCompany();
    }
  }, [companyId]);

  const fetchCompany = async () => {
    try {
      setInitialLoading(true);
      setAccessDenied(false);
      const res = await API.get(`${COMPANY_API_ENDPOINT}/get/${companyId}`);
      if (res.data?.success || res.data?.status) {
        const comp = unwrapItem(res, "company");
        dispatch(setSingleCompany(comp));
        setInput({
          name: comp.name || "",
          description: comp.description || "",
          website: comp.website || "",
          location: comp.location || "",
        });
      } else {
        Alert.alert("Notice", res.data?.message || "Failed to load company details.");
      }
    } catch (err: any) {
      if (err.response?.status === 403) {
        setAccessDenied(true);
      } else {
        Alert.alert(
          "Error",
          err.response?.data?.message || err.message || "Failed to fetch company profile."
        );
      }
    } finally {
      setInitialLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!input.name.trim()) {
      Alert.alert("Input Required", "Company name cannot be blank.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await API.put(`${COMPANY_API_ENDPOINT}/update/${companyId}`, input);

      if (res.data?.success) {
        Alert.alert("Success", "Company profile updated successfully.");
        router.replace("/recruiter/companies" as any);
      } else {
        Alert.alert("Notice", res.data?.message || "Could not update company profile.");
      }
    } catch (err: any) {
      Alert.alert(
        "Update Failed",
        err.response?.data?.message || err.message || "An error occurred during update."
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
          <Text className="text-sm font-black text-foreground">Company Profile Setup</Text>
          <View style={{ width: 40 }} />
        </View>

        {initialLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator color="#6B3AC2" size="large" />
            <Text className="text-xs text-muted-foreground mt-2 font-medium">
              Loading company data...
            </Text>
          </View>
        ) : accessDenied ? (
          <View className="flex-1 items-center justify-center p-6 space-y-4 text-center">
            <View className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950/40 items-center justify-center border border-rose-300">
              <Icon name="shield" size={24} color="#DC2626" />
            </View>
            <Text className="text-lg font-black text-foreground text-center">
              Access Denied: Company Not Yours
            </Text>
            <Text className="text-xs text-muted-foreground text-center px-4">
              You do not have permission to view or edit this company profile. You may only manage companies registered by your own recruiter account.
            </Text>
            <Pressable
              onPress={() => router.replace("/recruiter/companies" as any)}
              className="rounded-xl bg-primary px-6 py-3"
            >
              <Text className="text-xs font-bold text-primary-foreground">
                Back to My Companies →
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
              {/* Branding Avatar */}
              <View className="items-center py-2">
                <View className="w-20 h-20 rounded-2xl bg-purple-100 dark:bg-purple-950/60 border-2 border-primary items-center justify-center shadow-xs">
                  <Text className="text-3xl font-black text-primary">
                    {(input.name || "C").charAt(0).toUpperCase()}
                  </Text>
                </View>
                <Text className="text-xs text-muted-foreground mt-2">
                  Company Identity Branding
                </Text>
              </View>

              {/* Form Fields */}
              <View className="space-y-1.5">
                <Text className="text-xs font-bold text-foreground">
                  Company Name *
                </Text>
                <TextInput
                  value={input.name}
                  onChangeText={(val) => setInput({ ...input, name: val })}
                  placeholder="Official Company Name"
                  placeholderTextColor="#8E8799"
                  className="rounded-xl border border-border bg-card p-3.5 text-xs text-foreground"
                />
              </View>

              <View className="space-y-1.5">
                <Text className="text-xs font-bold text-foreground">
                  Official Website URL
                </Text>
                <TextInput
                  value={input.website}
                  onChangeText={(val) => setInput({ ...input, website: val })}
                  placeholder="https://acme.com"
                  placeholderTextColor="#8E8799"
                  keyboardType="url"
                  autoCapitalize="none"
                  className="rounded-xl border border-border bg-card p-3.5 text-xs text-foreground"
                />
              </View>

              <View className="space-y-1.5">
                <Text className="text-xs font-bold text-foreground">
                  Headquarters / Office Location
                </Text>
                <TextInput
                  value={input.location}
                  onChangeText={(val) => setInput({ ...input, location: val })}
                  placeholder="e.g. San Francisco, CA / Bengaluru, India"
                  placeholderTextColor="#8E8799"
                  className="rounded-xl border border-border bg-card p-3.5 text-xs text-foreground"
                />
              </View>

              <View className="space-y-1.5">
                <Text className="text-xs font-bold text-foreground">
                  Organization Description & Mission
                </Text>
                <TextInput
                  value={input.description}
                  onChangeText={(val) => setInput({ ...input, description: val })}
                  placeholder="Describe your company culture, mission, and products..."
                  placeholderTextColor="#8E8799"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  className="rounded-xl border border-border bg-card p-3.5 text-xs text-foreground min-h-[90px]"
                />
              </View>

              {/* Submit CTA */}
              <View className="pt-4 space-y-3">
                <Pressable
                  onPress={handleUpdate}
                  disabled={submitting}
                  className="rounded-xl bg-primary py-3.5 items-center justify-center shadow-md"
                >
                  {submitting ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <Text className="text-xs font-bold text-primary-foreground">
                      Save Company Profile ✓
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
