import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  Linking,
  SafeAreaView,
} from "react-native";
import { router } from "expo-router";
import Icon from "../src/components/common/Icon";

export default function AboutScreen() {
  const [activePersona, setActivePersona] = useState<"candidate" | "recruiter">(
    "candidate"
  );

  const corePillars = [
    {
      icon: "shield",
      title: "Transparent & Accountable",
      description:
        "Zero recruitment ghosting. Candidates track applications across transparent states, with scheduled interview timestamps and verified employer feedback.",
      color: "#059669",
      bgColor: "#ECFDF5",
      borderColor: "#A7F3D0",
    },
    {
      icon: "sparkles",
      title: "Intelligent Matchmaking",
      description:
        "Contextual search filters, automated job alerts, and structured role classification that connects candidates to matching career trajectories faster.",
      color: "#6B3AC2",
      bgColor: "#F3E8FF",
      borderColor: "#DDD6FE",
    },
    {
      icon: "building",
      title: "Vetted Employers Only",
      description:
        "Administrative moderation and company verification prevent deceptive postings and spam, ensuring every opportunity is legitimate and actionable.",
      color: "#2563EB",
      bgColor: "#EFF6FF",
      borderColor: "#BFDBFE",
    },
    {
      icon: "zap",
      title: "Modern Recruiter Cockpit",
      description:
        "Recruiters manage candidate pipelines, add internal candidate evaluation notes, coordinate video interview meetings, and inspect conversion metrics.",
      color: "#D97706",
      bgColor: "#FFFBEB",
      borderColor: "#FDE68A",
    },
  ];

  const candidateSteps = [
    {
      number: "01",
      title: "Discover & Filter",
      desc: "Explore verified listings filtered by location, job type, seniority, and technology stack.",
    },
    {
      number: "02",
      title: "One-Click Apply",
      desc: "Apply seamlessly using your standardized digital profile, uploaded resume, and contact information.",
    },
    {
      number: "03",
      title: "Track & Interview",
      desc: "Get live status updates, video meeting links, and scheduled interview notifications in one centralized hub.",
    },
  ];

  const recruiterSteps = [
    {
      number: "01",
      title: "Verify & Profile",
      desc: "Register your organization profile with official branding, location, and recruitment credentials.",
    },
    {
      number: "02",
      title: "Publish Positions",
      desc: "Deploy roles with customized requirements, salary ranges, and position lifecycle controls.",
    },
    {
      number: "03",
      title: "Screen & Schedule",
      desc: "Review submitted resumes, attach recruiter feedback notes, and schedule video interviews directly.",
    },
  ];

  const techStack = [
    "React Native",
    "Expo SDK 57",
    "NativeWind v4",
    "Redux Toolkit",
    "TypeScript",
    "Node.js",
    "Express.js",
    "MongoDB",
    "Tailwind CSS",
    "JWT Auth",
  ];

  const openUrl = (url: string) => {
    Linking.openURL(url).catch(() => {});
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Top Header */}
      <View className="flex-row items-center justify-between border-b border-border px-5 py-3.5 bg-card">
        <Pressable onPress={() => router.back()} className="flex-row items-center gap-1.5">
          <Text className="text-base font-bold text-primary">←</Text>
          <Text className="text-xs font-bold text-foreground">Back</Text>
        </Pressable>
        <Text className="text-sm font-black text-foreground">About FOREWORK</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        className="flex-1 px-5 py-5"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* 1. Hero Section */}
        <View className="items-center text-center space-y-3 mb-8">
          <View className="flex-row items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800">
            <Icon name="sparkles" size={12} color="#6B3AC2" />
            <Text className="text-[10px] font-bold text-primary">
              Next-Generation Career Marketplace
            </Text>
          </View>
          <Text className="text-2xl font-black text-foreground text-center">
            Bridging Ambition with{"\n"}
            <Text className="text-primary">Exceptional Opportunity</Text>
          </Text>
          <Text className="text-xs text-muted-foreground text-center px-2 leading-relaxed">
            FOREWORK is built for modern talent acquisition. We eliminate hiring friction, ghosting, and opaque processes with structured interview telemetry, verified employer credentials, and lightning-fast job discovery.
          </Text>

          <View className="flex-row items-center gap-3 pt-2">
            <Pressable
              onPress={() => router.push("/(tabs)/jobs")}
              className="rounded-xl bg-primary px-5 py-3 shadow-sm"
            >
              <Text className="text-xs font-bold text-primary-foreground">
                Explore Open Roles →
              </Text>
            </Pressable>
          </View>
        </View>

        {/* 2. Platform Impact Stats */}
        <View className="rounded-2xl border border-border bg-card p-4 mb-8 shadow-xs">
          <View className="grid grid-cols-2 flex-row flex-wrap">
            <View className="w-1/2 p-3 items-center text-center border-r border-b border-border">
              <Text className="text-2xl font-black text-primary">100%</Text>
              <Text className="text-xs font-bold text-foreground mt-0.5">Verified</Text>
              <Text className="text-[10px] text-muted-foreground">Zero spam postings</Text>
            </View>
            <View className="w-1/2 p-3 items-center text-center border-b border-border">
              <Text className="text-2xl font-black text-primary">&lt; 48h</Text>
              <Text className="text-xs font-bold text-foreground mt-0.5">Turnaround</Text>
              <Text className="text-[10px] text-muted-foreground">Live status telemetry</Text>
            </View>
            <View className="w-1/2 p-3 items-center text-center border-r border-border">
              <Text className="text-2xl font-black text-primary">0%</Text>
              <Text className="text-xs font-bold text-foreground mt-0.5">Ghosting</Text>
              <Text className="text-[10px] text-muted-foreground">Feedback for all</Text>
            </View>
            <View className="w-1/2 p-3 items-center text-center">
              <Text className="text-2xl font-black text-primary">24 / 7</Text>
              <Text className="text-xs font-bold text-foreground mt-0.5">Reliability</Text>
              <Text className="text-[10px] text-muted-foreground">Continuous matching</Text>
            </View>
          </View>
        </View>

        {/* 3. Core Pillars */}
        <View className="space-y-3 mb-8">
          <Text className="text-base font-black text-foreground">
            Why ForeWork is Different
          </Text>
          <Text className="text-xs text-muted-foreground">
            Engineered with deliberate principles to empower candidates and streamline recruiters.
          </Text>

          <View className="space-y-3 pt-2">
            {corePillars.map((pillar, idx) => (
              <View
                key={idx}
                className="rounded-2xl border border-border bg-card p-4 space-y-2 shadow-2xs"
              >
                <View className="flex-row items-center gap-2.5">
                  <View
                    style={{ backgroundColor: pillar.bgColor, borderColor: pillar.borderColor }}
                    className="p-2 rounded-xl border"
                  >
                    <Icon name={pillar.icon} size={16} color={pillar.color} />
                  </View>
                  <Text className="text-xs font-black text-foreground flex-1">
                    {pillar.title}
                  </Text>
                </View>
                <Text className="text-xs text-muted-foreground leading-relaxed pl-1">
                  {pillar.description}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* 4. Dual Journey Flow */}
        <View className="space-y-3 mb-8">
          <Text className="text-base font-black text-foreground">
            Designed for Both Sides of Hiring
          </Text>
          <Text className="text-xs text-muted-foreground">
            Whether searching for your dream role or scaling an engineering team.
          </Text>

          {/* Persona Switcher */}
          <View className="flex-row rounded-xl bg-muted/40 p-1 mt-1">
            <Pressable
              onPress={() => setActivePersona("candidate")}
              className={`flex-1 py-2 rounded-lg items-center justify-center ${
                activePersona === "candidate" ? "bg-card shadow-xs" : ""
              }`}
            >
              <Text
                className={`text-xs font-bold ${
                  activePersona === "candidate" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                For Job Seekers
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setActivePersona("recruiter")}
              className={`flex-1 py-2 rounded-lg items-center justify-center ${
                activePersona === "recruiter" ? "bg-card shadow-xs" : ""
              }`}
            >
              <Text
                className={`text-xs font-bold ${
                  activePersona === "recruiter" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                For Recruiters
              </Text>
            </Pressable>
          </View>

          {/* Steps */}
          <View className="space-y-3 pt-2">
            {(activePersona === "candidate" ? candidateSteps : recruiterSteps).map(
              (step, idx) => (
                <View
                  key={idx}
                  className="rounded-2xl border border-border bg-card p-4 space-y-1.5"
                >
                  <View className="flex-row items-center justify-between">
                    <Text className="text-xs font-black text-primary">
                      {step.number} • {step.title}
                    </Text>
                    <Text className="text-[10px] font-bold text-muted-foreground">
                      Step {idx + 1}
                    </Text>
                  </View>
                  <Text className="text-xs text-muted-foreground leading-relaxed">
                    {step.desc}
                  </Text>
                </View>
              )
            )}
          </View>
        </View>

        {/* 5. Developer & Maintainer Spotlight */}
        <View className="rounded-3xl border border-purple-300 dark:border-purple-900 bg-purple-50/50 dark:bg-purple-950/30 p-5 mb-8 space-y-4 shadow-sm">
          <View className="flex-row items-center gap-3">
            <View className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-primary bg-card">
              <Image
                source={{ uri: "https://avatars.githubusercontent.com/u/157904720?v=4" }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
            <View className="flex-1">
              <Text className="text-base font-black text-foreground">
                Jashanpreet Singh
              </Text>
              <Text className="text-xs font-bold text-primary">
                Full Stack Software Engineer & Maintainer
              </Text>
              <View className="flex-row items-center gap-1 mt-1">
                <View className="w-2 h-2 rounded-full bg-emerald-500" />
                <Text className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
                  Active Maintainer
                </Text>
              </View>
            </View>
          </View>

          <Text className="text-xs text-muted-foreground leading-relaxed">
            Passionate about architecting responsive, scalable web and mobile applications with intuitive ergonomics. ForeWork was designed and built to address the friction in modern recruitment — providing candidates with dignity and transparency while empowering hiring teams with real-time operational tools.
          </Text>

          {/* Tech stack */}
          <View className="space-y-1.5 pt-1">
            <Text className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Core Technology Stack:
            </Text>
            <View className="flex-row flex-wrap gap-1.5">
              {techStack.map((tech, idx) => (
                <View
                  key={idx}
                  className="rounded-md bg-card border border-border px-2 py-0.5"
                >
                  <Text className="text-[10px] font-semibold text-foreground">
                    {tech}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* External Profile Links */}
          <View className="flex-row items-center gap-2 pt-2">
            <Pressable
              onPress={() => openUrl("https://github.com/Jashan-randhawa")}
              className="flex-1 rounded-xl bg-gray-900 dark:bg-black py-2.5 px-3 flex-row items-center justify-center gap-1.5"
            >
              <Icon name="github" size={14} color="#FFFFFF" />
              <Text className="text-[11px] font-bold text-white">GitHub Profile</Text>
            </Pressable>

            <Pressable
              onPress={() => openUrl("https://github.com/Jashan-randhawa/FOREWORK")}
              className="flex-1 rounded-xl border border-primary/40 bg-card py-2.5 px-3 flex-row items-center justify-center gap-1.5"
            >
              <Text className="text-[11px] font-bold text-primary">Repository ↗</Text>
            </Pressable>
          </View>
        </View>

        {/* 6. Call to Action Banner */}
        <View className="rounded-3xl bg-primary p-6 mb-12 items-center text-center space-y-3 shadow-md">
          <Text className="text-lg font-black text-primary-foreground text-center">
            Ready to Accelerate Your Career?
          </Text>
          <Text className="text-xs text-purple-100 text-center leading-relaxed">
            Join thousands of candidates discovering verified roles and verified employers hiring top tier talent on ForeWork.
          </Text>
          <Pressable
            onPress={() => router.push("/(auth)/register")}
            className="rounded-xl bg-white px-6 py-3 mt-1 shadow-xs"
          >
            <Text className="text-xs font-black text-primary">
              Create Free Account ✨
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
