import React from "react";
import { View, Text, ScrollView, Pressable, SafeAreaView } from "react-native";
import { router } from "expo-router";
import Icon from "../src/components/common/Icon";

export default function TermsOfServiceScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background" style={{ flex: 1 }}>
      {/* Top Header */}
      <View className="flex-row items-center justify-between border-b border-border px-5 py-3.5 bg-card">
        <Pressable onPress={() => router.back()} className="flex-row items-center gap-1.5">
          <Text className="text-base font-bold text-primary">←</Text>
          <Text className="text-xs font-bold text-foreground">Back</Text>
        </Pressable>
        <Text className="text-sm font-black text-foreground">Terms of Service</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        className="flex-1 px-5 py-5"
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 48 }}
      >
        {/* Banner */}
        <View className="mb-6">
          <View className="flex-row items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 self-start mb-2">
            <Icon name="shield" size={12} color="#6B3AC2" />
            <Text className="text-[10px] font-bold text-primary">
              FOREWORK User Agreement
            </Text>
          </View>
          <Text className="text-2xl font-black text-foreground">
            Terms of Service
          </Text>
          <Text className="text-xs text-muted-foreground mt-1">
            Last updated: September 2026 • Governing terms for candidate & recruiter platform access
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
              Welcome to FOREWORK. These Terms of Service govern your use of the FOREWORK mobile application, web portal, and recruitment marketplace. By accessing or using our platform, you agree to comply with and be bound by these terms.
            </Text>
          </View>

          {/* Section 2 */}
          <View className="rounded-2xl border border-border bg-card p-5 space-y-2">
            <Text className="text-sm font-black text-foreground">
              2. Acceptance of Terms
            </Text>
            <Text className="text-xs text-muted-foreground leading-relaxed">
              By creating an account, browsing job listings, or submitting applications, you confirm that you accept these Terms of Service in full. If you do not agree with any part of these terms, you must refrain from using the platform.
            </Text>
          </View>

          {/* Section 3 */}
          <View className="rounded-2xl border border-border bg-card p-5 space-y-2">
            <Text className="text-sm font-black text-foreground">
              3. Changes to Terms
            </Text>
            <Text className="text-xs text-muted-foreground leading-relaxed">
              We reserve the right to modify these Terms of Service at any time. Any changes will be posted within this section. Continued platform utilization following modifications represents your formal consent to the revised terms.
            </Text>
          </View>

          {/* Section 4 */}
          <View className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <Text className="text-sm font-black text-foreground">
              4. User Responsibilities & Conduct
            </Text>
            <Text className="text-xs text-muted-foreground leading-relaxed">
              You agree to use FOREWORK solely for legitimate, lawful recruitment purposes:
            </Text>
            <View className="space-y-2">
              {[
                "Provide accurate, factual personal and career information without fabrication",
                "Recruiters must post genuine, active employment vacancies with truthful compensation",
                "Do not post malicious content, unsolicited promotions, or unauthorized scrapers",
                "Maintain confidential credentials and immediately report compromised accounts",
              ].map((item, idx) => (
                <View key={idx} className="flex-row items-start gap-2 pl-2">
                  <Text className="text-xs text-primary font-bold mt-0.5">•</Text>
                  <Text className="text-xs text-foreground flex-1 leading-relaxed">{item}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Section 5 */}
          <View className="rounded-2xl border border-border bg-card p-5 space-y-2">
            <Text className="text-sm font-black text-foreground">
              5. Intellectual Property
            </Text>
            <Text className="text-xs text-muted-foreground leading-relaxed">
              All platform branding, algorithms, interface layouts, and source code are the proprietary intellectual property of FOREWORK and its maintainers. You may not reproduce, reverse-engineer, or distribute any platform components without explicit written authorization.
            </Text>
          </View>

          {/* Section 6 */}
          <View className="rounded-2xl border border-border bg-card p-5 space-y-2">
            <Text className="text-sm font-black text-foreground">
              6. Limitation of Liability
            </Text>
            <Text className="text-xs text-muted-foreground leading-relaxed">
              To the fullest extent permitted by law, FOREWORK and its creators shall not be liable for any direct, indirect, incidental, or consequential damages resulting from hiring decisions, third-party employer interactions, or service interruptions. ATS match scores are diagnostic indicators, not hiring guarantees.
            </Text>
          </View>

          {/* Section 7 */}
          <View className="rounded-2xl border border-border bg-card p-5 space-y-2">
            <Text className="text-sm font-black text-foreground">
              7. Governing Law & Dispute Resolution
            </Text>
            <Text className="text-xs text-muted-foreground leading-relaxed">
              These Terms and Conditions shall be governed by and construed in accordance with applicable laws. Any legal disputes arising in connection with the platform shall be submitted to the exclusive jurisdiction of the competent courts.
            </Text>
          </View>

          {/* Section 8 */}
          <View className="rounded-2xl border border-border bg-card p-5 space-y-2">
            <Text className="text-sm font-black text-foreground">
              8. Contact Information
            </Text>
            <Text className="text-xs text-muted-foreground leading-relaxed">
              For questions, terms clarifications, or compliance inquiries, reach out to our legal administration:
            </Text>
            <View className="p-3 rounded-xl bg-muted/30 border border-border">
              <Text className="text-xs font-bold text-primary">legal@forework.dev</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
