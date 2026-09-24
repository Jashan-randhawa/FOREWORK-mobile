import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { useDispatch } from "react-redux";
import API from "../../src/utils/axiosInstance";
import { COMPANY_API_ENDPOINT } from "../../src/utils/endpoints";
import { setSingleCompany } from "../../src/redux/companySlice";
import Icon from "../../src/components/common/Icon";
import RecruiterGuard from "../../src/components/recruiter/RecruiterGuard";

export default function CreateCompanyScreen() {
  const dispatch = useDispatch();
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!companyName.trim()) {
      Alert.alert("Input Required", "Please enter a valid company name.");
      return;
    }

    try {
      setLoading(true);
      const res = await API.post(`${COMPANY_API_ENDPOINT}/register`, {
        companyName: companyName.trim(),
      });

      if (res.data?.success) {
        const createdCompany = res.data.company;
        dispatch(setSingleCompany(createdCompany));
        Alert.alert(
          "Company Registered",
          `"${createdCompany.name}" has been registered. Now let's complete your organization's profile.`
        );
        router.replace(`/recruiter/company/${createdCompany._id}` as any);
      } else {
        Alert.alert("Notice", res.data?.message || "Failed to register company.");
      }
    } catch (err: any) {
      Alert.alert(
        "Registration Failed",
        err.response?.data?.message || err.message || "An error occurred while registering company."
      );
    } finally {
      setLoading(false);
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
          <Text className="text-sm font-black text-foreground">Register Company</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          style={{ flex: 1 }}
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1, justifyContent: "space-between", padding: 20 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="space-y-4">
            <View className="w-14 h-14 rounded-2xl bg-primary/10 items-center justify-center">
              <Icon name="building" size={24} color="#6B3AC2" />
            </View>

            <View className="space-y-1">
              <Text className="text-2xl font-black text-foreground">
                What is your company name?
              </Text>
              <Text className="text-xs text-muted-foreground leading-relaxed">
                Provide the official legal or commercial name of your company. You will be able to customize your description, website, and branding in the next step.
              </Text>
            </View>

            <View className="space-y-2 pt-2">
              <Text className="text-xs font-bold text-foreground">
                Company Name *
              </Text>
              <TextInput
                value={companyName}
                onChangeText={setCompanyName}
                placeholder="e.g. Acme Corporation, Stripe, Vercel"
                placeholderTextColor="#8E8799"
                className="rounded-xl border border-border bg-card p-3.5 text-xs text-foreground"
                autoFocus
              />
            </View>
          </View>

          <View className="space-y-3 pb-4">
            <Pressable
              onPress={handleRegister}
              disabled={loading}
              className="rounded-xl bg-primary py-3.5 items-center justify-center shadow-sm"
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text className="text-xs font-bold text-primary-foreground">
                  Continue to Profile Setup →
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
        </ScrollView>
      </SafeAreaView>
    </RecruiterGuard>
  );
}
