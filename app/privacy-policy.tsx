import React from "react";
import { View, Text, ScrollView, Pressable, SafeAreaView } from "react-native";
import { router } from "expo-router";
import Icon from "../src/components/common/Icon";

export default function PrivacyPolicyScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Top Header */}
      <View className="flex-row items-center justify-between border-b border-border px-5 py-3.5 bg-card">
        <Pressable onPress={() => router.back()} className="flex-row items-center gap-1.5">
          <Text className="text-base font-bold text-primary">←</Text>
          <Text className="text-xs font-bold text-foreground">Back</Text>
        </Pressable>
        <Text className="text-sm font-black text-foreground">Privacy Policy</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView className="flex-1 px-5 py-5" showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View className="mb-6">
          <View className="flex-row items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 self-start mb-2">
            <Icon name="shield" size={12} color="#6B3AC2" />
            <Text className="text-[10px] font-bold text-primary">
              FOREWORK Trust & Privacy
            </Text>
          </View>
          <Text className="text-2xl font-black text-foreground">
            Privacy Policy
          </Text>
          <Text className="text-xs text-muted-foreground mt-1">
            Last updated: September 2026 • Governing user data protection on FOREWORK
          </Text>
        </View>

        {/* Sections */}
        <View className="space-y-4 mb-10">
          {/* Section 1 */}
          <View className="rounded-2xl border border-border bg-card p-5 space-y-2">
            <Text className="text-sm font-black text-foreground">
              1. Introduction
            </Text>
            <Text className="text-xs text-muted-foreground leading-relaxed">
              This Privacy Policy outlines how FOREWORK collects, uses, and protects your information when you visit or use our mobile application and job marketplace platform.
            </Text>
          </View>

          {/* Section 2 */}
          <View className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <Text className="text-sm font-black text-foreground">
              2. Information We Collect
            </Text>
            <View className="space-y-2">
              <Text className="text-xs font-bold text-primary">
                Personal Information:
              </Text>
              {["Full Legal Name", "Email Address & Phone Number", "Resume / Curriculum Vitae", "KYC Identification (PAN / Aadhaar for verified recruiters)"].map((item, idx) => (
                <View key={idx} className="flex-row items-center gap-2 pl-2">
                  <Text className="text-xs text-primary font-bold">•</Text>
                  <Text className="text-xs text-foreground">{item}</Text>
                </View>
              ))}
            </View>

            <View className="space-y-2 pt-2 border-t border-border">
              <Text className="text-xs font-bold text-primary">
                Usage & Device Telemetry:
              </Text>
              {["IP address & network telemetry", "Device type and operating system", "In-app interactions and screens visited", "Session duration and interaction frequency"].map((item, idx) => (
                <View key={idx} className="flex-row items-center gap-2 pl-2">
                  <Text className="text-xs text-primary font-bold">•</Text>
                  <Text className="text-xs text-foreground">{item}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Section 3 */}
          <View className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <Text className="text-sm font-black text-foreground">
              3. How We Use Your Information
            </Text>
            <View className="space-y-2">
              {[
                "To provide, maintain, and secure candidate job applications and matching services",
                "To notify you about status changes to your active applications and upcoming interviews",
                "To calculate deterministic ATS resume compatibility and missing skills analysis",
                "To facilitate recruiter screening and direct candidate communications",
                "To detect, prevent, and address technical issues or malicious activity",
                "To analyze anonymized aggregate metrics improving platform performance",
              ].map((item, idx) => (
                <View key={idx} className="flex-row items-start gap-2 pl-2">
                  <Text className="text-xs text-primary font-bold mt-0.5">•</Text>
                  <Text className="text-xs text-foreground flex-1 leading-relaxed">{item}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Section 4 */}
          <View className="rounded-2xl border border-border bg-card p-5 space-y-2">
            <Text className="text-sm font-black text-foreground">
              4. Data Security
            </Text>
            <Text className="text-xs text-muted-foreground leading-relaxed">
              We take the security of your personal information seriously and implement appropriate technical and organizational measures to safeguard it against unauthorized access, destruction, or disclosure. Auth credentials use salted hashing and SecureStore token persistence.
            </Text>
          </View>

          {/* Section 5 */}
          <View className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <Text className="text-sm font-black text-foreground">
              5. Sharing Your Information
            </Text>
            <Text className="text-xs text-muted-foreground leading-relaxed">
              We do not sell or rent your personal information to third parties. We only share information with:
            </Text>
            <View className="space-y-2">
              {[
                "Verified employers whose job postings you actively apply for",
                "Trusted service providers assisting in infrastructure hosting and notification delivery",
                "Law enforcement or regulatory authorities if strictly required by valid legal process",
              ].map((item, idx) => (
                <View key={idx} className="flex-row items-start gap-2 pl-2">
                  <Text className="text-xs text-primary font-bold mt-0.5">•</Text>
                  <Text className="text-xs text-foreground flex-1 leading-relaxed">{item}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Section 6 */}
          <View className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <Text className="text-sm font-black text-foreground">
              6. Your Rights
            </Text>
            <Text className="text-xs text-muted-foreground leading-relaxed">
              You retain full ownership and control over your data:
            </Text>
            <View className="space-y-2">
              {[
                "Access and review your stored personal information and resume files at any time",
                "Update or rectify inaccurate profile, educational, or work experience details",
                "Request irreversible account and data deletion pursuant to applicable data rights",
              ].map((item, idx) => (
                <View key={idx} className="flex-row items-start gap-2 pl-2">
                  <Text className="text-xs text-emerald-600 font-bold mt-0.5">✓</Text>
                  <Text className="text-xs text-foreground flex-1 leading-relaxed">{item}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Section 7 */}
          <View className="rounded-2xl border border-border bg-card p-5 space-y-2">
            <Text className="text-sm font-black text-foreground">
              7. Changes to This Privacy Policy
            </Text>
            <Text className="text-xs text-muted-foreground leading-relaxed">
              We may update our Privacy Policy periodically. Any revisions will be reflected on this page with an updated timestamp. We encourage users to review this document regularly.
            </Text>
          </View>

          {/* Section 8 */}
          <View className="rounded-2xl border border-border bg-card p-5 space-y-2">
            <Text className="text-sm font-black text-foreground">
              8. Contact Information
            </Text>
            <Text className="text-xs text-muted-foreground leading-relaxed">
              If you have any questions or concerns regarding this Privacy Policy, please contact our data privacy team at:
            </Text>
            <View className="p-3 rounded-xl bg-muted/30 border border-border">
              <Text className="text-xs font-bold text-primary">support@forework.dev</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
