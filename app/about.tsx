import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  Linking,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { router } from "expo-router";
import Icon from "../src/components/common/Icon";

// ─── Data ────────────────────────────────────────────────────────────────────

const corePillars = [
  {
    icon: "shield",
    title: "Transparent & Accountable",
    description:
      "Zero recruitment ghosting. Candidates track applications across transparent states, with scheduled interview timestamps and verified employer feedback.",
    color: "#059669",
    bgColor: "#ECFDF5",
    borderColor: "#6EE7B7",
  },
  {
    icon: "sparkles",
    title: "Intelligent Matchmaking",
    description:
      "Contextual search filters, automated job alerts, and structured role classification that connects candidates to matching career trajectories faster.",
    color: "#6B3AC2",
    bgColor: "#EDE9FF",
    borderColor: "#C4B5FD",
  },
  {
    icon: "building",
    title: "Vetted Employers Only",
    description:
      "Administrative moderation and company verification prevent deceptive postings and spam, ensuring every opportunity is legitimate and actionable.",
    color: "#2563EB",
    bgColor: "#EFF6FF",
    borderColor: "#93C5FD",
  },
  {
    icon: "zap",
    title: "Modern Recruiter Cockpit",
    description:
      "Recruiters manage candidate pipelines, add internal evaluation notes, coordinate video interviews, and inspect conversion metrics in real time.",
    color: "#D97706",
    bgColor: "#FFFBEB",
    borderColor: "#FCD34D",
  },
];

const candidateSteps = [
  {
    number: "01",
    title: "Discover & Filter",
    desc: "Explore verified listings filtered by location, job type, seniority, and technology stack.",
    emoji: "🔍",
  },
  {
    number: "02",
    title: "One-Click Apply",
    desc: "Apply seamlessly using your standardised digital profile, uploaded resume, and contact information.",
    emoji: "📩",
  },
  {
    number: "03",
    title: "Track & Interview",
    desc: "Get live status updates, video meeting links, and scheduled interview notifications in one centralized hub.",
    emoji: "📅",
  },
];

const recruiterSteps = [
  {
    number: "01",
    title: "Verify & Profile",
    desc: "Register your organisation profile with official branding, location, and recruitment credentials.",
    emoji: "🏢",
  },
  {
    number: "02",
    title: "Publish Positions",
    desc: "Deploy roles with customised requirements, salary ranges, and position lifecycle controls.",
    emoji: "📝",
  },
  {
    number: "03",
    title: "Screen & Schedule",
    desc: "Review submitted resumes, attach recruiter feedback notes, and schedule video interviews directly.",
    emoji: "🎯",
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

const stats = [
  { value: "100%", label: "Verified", sub: "Zero spam postings", border: true, borderBottom: true },
  { value: "< 48h", label: "Turnaround", sub: "Live status telemetry", border: false, borderBottom: true },
  { value: "0%", label: "Ghosting", sub: "Feedback for all", border: true, borderBottom: false },
  { value: "24/7", label: "Reliability", sub: "Continuous matching", border: false, borderBottom: false },
];

// ─── Styles ───────────────────────────────────────────────────────────────────

const PURPLE = "#6B3AC2";
const PURPLE_LIGHT = "#EDE9FF";
const PURPLE_BORDER = "#C4B5FD";
const GRAY_BG = "#F9F7FF";
const CARD_BG = "#FFFFFF";
const DARK_TEXT = "#1C1033";
const MID_TEXT = "#5B4B8A";
const MUTED_TEXT = "#8E7BA8";
const BORDER = "#E4DFEF";

const s = StyleSheet.create({
  /* ── layout ── */
  safeArea: { flex: 1, backgroundColor: GRAY_BG },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: CARD_BG,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  backBtn: { flexDirection: "row", alignItems: "center", gap: 6 },
  headerTitle: { fontSize: 14, fontWeight: "800", color: DARK_TEXT },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 60,
  },

  /* ── hero ── */
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "center",
    backgroundColor: PURPLE_LIGHT,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: PURPLE_BORDER,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 14,
  },
  heroBadgeText: { fontSize: 11, fontWeight: "700", color: PURPLE },
  heroTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: DARK_TEXT,
    textAlign: "center",
    lineHeight: 32,
    marginBottom: 12,
  },
  heroPurple: { color: PURPLE },
  heroSub: {
    fontSize: 13,
    color: MID_TEXT,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  heroCta: {
    backgroundColor: PURPLE,
    borderRadius: 14,
    paddingHorizontal: 24,
    paddingVertical: 13,
    alignSelf: "center",
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  heroCtaText: { fontSize: 13, fontWeight: "800", color: "#FFFFFF" },

  /* ── section header ── */
  sectionLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: PURPLE,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  sectionTitle: { fontSize: 18, fontWeight: "900", color: DARK_TEXT, marginBottom: 4 },
  sectionSub: { fontSize: 13, color: MUTED_TEXT, lineHeight: 18, marginBottom: 16 },

  /* ── stats grid ── */
  statsCard: {
    backgroundColor: CARD_BG,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: BORDER,
    overflow: "hidden",
    marginBottom: 32,
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statsRow: { flexDirection: "row" },
  statCell: { flex: 1, padding: 16, alignItems: "center" },
  statValue: { fontSize: 22, fontWeight: "900", color: PURPLE, marginBottom: 2 },
  statLabel: { fontSize: 12, fontWeight: "700", color: DARK_TEXT },
  statSub: { fontSize: 10, color: MUTED_TEXT, marginTop: 2 },

  /* ── pillar cards ── */
  pillarCard: {
    backgroundColor: CARD_BG,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: BORDER,
    padding: 16,
    marginBottom: 12,
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  pillarHeader: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 10 },
  pillarIconWrap: { width: 42, height: 42, borderRadius: 12, alignItems: "center", justifyContent: "center", borderWidth: 1.5 },
  pillarTitle: { fontSize: 13, fontWeight: "800", color: DARK_TEXT, flex: 1, lineHeight: 18 },
  pillarDesc: { fontSize: 12, color: MUTED_TEXT, lineHeight: 18 },

  /* ── persona switcher ── */
  switcher: {
    flexDirection: "row",
    backgroundColor: "#F0ECF9",
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
  },
  switchBtn: { flex: 1, paddingVertical: 10, borderRadius: 11, alignItems: "center" },
  switchBtnActive: { backgroundColor: CARD_BG, shadowColor: PURPLE, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 6, elevation: 3 },
  switchLabel: { fontSize: 13, fontWeight: "600", color: MUTED_TEXT },
  switchLabelActive: { fontSize: 13, fontWeight: "800", color: PURPLE },

  /* ── step cards ── */
  stepCard: {
    flexDirection: "row",
    backgroundColor: CARD_BG,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: BORDER,
    padding: 14,
    marginBottom: 10,
    alignItems: "flex-start",
    gap: 14,
  },
  stepLeft: { alignItems: "center", gap: 4, minWidth: 44 },
  stepEmoji: { fontSize: 22, lineHeight: 28 },
  stepNum: { fontSize: 10, fontWeight: "800", color: PURPLE, backgroundColor: PURPLE_LIGHT, borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2 },
  stepTitle: { fontSize: 13, fontWeight: "800", color: DARK_TEXT, marginBottom: 4 },
  stepDesc: { fontSize: 12, color: MUTED_TEXT, lineHeight: 18 },

  /* ── developer card ── */
  devCard: {
    backgroundColor: PURPLE_LIGHT,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: PURPLE_BORDER,
    padding: 20,
    marginBottom: 28,
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  devRow: { flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 14 },
  devAvatar: { width: 64, height: 64, borderRadius: 18, borderWidth: 2, borderColor: PURPLE, backgroundColor: CARD_BG },
  devName: { fontSize: 16, fontWeight: "900", color: DARK_TEXT },
  devRole: { fontSize: 12, fontWeight: "700", color: PURPLE, marginTop: 2 },
  devStatusRow: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 5 },
  devStatusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#22C55E" },
  devStatusText: { fontSize: 11, fontWeight: "600", color: "#15803D" },
  devBio: { fontSize: 13, color: MID_TEXT, lineHeight: 19, marginBottom: 14 },
  stackLabel: { fontSize: 10, fontWeight: "800", color: MUTED_TEXT, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 },
  stackWrap: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 14 },
  stackChip: { backgroundColor: CARD_BG, borderRadius: 8, borderWidth: 1, borderColor: PURPLE_BORDER, paddingHorizontal: 10, paddingVertical: 4 },
  stackChipText: { fontSize: 11, fontWeight: "600", color: PURPLE },
  devLinks: { flexDirection: "row", gap: 10 },
  devLinkGh: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 6, backgroundColor: "#1A1033", borderRadius: 12, paddingVertical: 11,
  },
  devLinkRepo: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 6, backgroundColor: CARD_BG, borderRadius: 12, borderWidth: 1.5,
    borderColor: PURPLE_BORDER, paddingVertical: 11,
  },
  devLinkText: { fontSize: 12, fontWeight: "700", color: "#FFFFFF" },
  devLinkTextPurple: { fontSize: 12, fontWeight: "700", color: PURPLE },

  /* ── CTA banner ── */
  ctaBanner: {
    backgroundColor: PURPLE,
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  ctaTitle: { fontSize: 20, fontWeight: "900", color: "#FFFFFF", textAlign: "center", marginBottom: 10 },
  ctaSub: { fontSize: 13, color: "#DDD6FE", textAlign: "center", lineHeight: 20, marginBottom: 20 },
  ctaBtn: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 28,
    paddingVertical: 13,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  ctaBtnText: { fontSize: 14, fontWeight: "900", color: PURPLE },
});

// ─── Component ────────────────────────────────────────────────────────────────

export default function AboutScreen() {
  const [activePersona, setActivePersona] = useState<"candidate" | "recruiter">("candidate");

  const openUrl = (url: string) => Linking.openURL(url).catch(() => {});

  const steps = activePersona === "candidate" ? candidateSteps : recruiterSteps;

  return (
    <SafeAreaView style={s.safeArea}>

      {/* ── Header ── */}
      <View style={s.header}>
        <Pressable onPress={() => router.back()} style={s.backBtn}>
          <Text style={{ fontSize: 18, fontWeight: "700", color: PURPLE }}>←</Text>
          <Text style={{ fontSize: 13, fontWeight: "700", color: DARK_TEXT }}>Back</Text>
        </Pressable>
        <Text style={s.headerTitle}>About FOREWORK</Text>
        <View style={{ width: 56 }} />
      </View>

      {/* ── Scrollable body ── */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >

        {/* ─ 1. Hero ─ */}
        <View style={{ alignItems: "center", marginBottom: 32 }}>
          <View style={s.heroBadge}>
            <Icon name="sparkles" size={13} color={PURPLE} />
            <Text style={s.heroBadgeText}>Next-Generation Career Marketplace</Text>
          </View>

          <Text style={s.heroTitle}>
            Bridging Ambition with{"\n"}
            <Text style={s.heroPurple}>Exceptional Opportunity</Text>
          </Text>

          <Text style={s.heroSub}>
            FOREWORK is built for modern talent acquisition. We eliminate hiring friction,
            ghosting, and opaque processes with structured interview telemetry, verified employer
            credentials, and lightning-fast job discovery.
          </Text>

          <Pressable style={s.heroCta} onPress={() => router.push("/(tabs)/jobs")}>
            <Text style={s.heroCtaText}>Explore Open Roles →</Text>
          </Pressable>
        </View>

        {/* ─ 2. Stats grid ─ */}
        <View style={s.statsCard}>
          <View style={s.statsRow}>
            {stats.slice(0, 2).map((stat, i) => (
              <View
                key={i}
                style={[
                  s.statCell,
                  stat.border && { borderRightWidth: 1, borderRightColor: BORDER },
                  { borderBottomWidth: 1, borderBottomColor: BORDER },
                ]}
              >
                <Text style={s.statValue}>{stat.value}</Text>
                <Text style={s.statLabel}>{stat.label}</Text>
                <Text style={s.statSub}>{stat.sub}</Text>
              </View>
            ))}
          </View>
          <View style={s.statsRow}>
            {stats.slice(2).map((stat, i) => (
              <View
                key={i}
                style={[
                  s.statCell,
                  stat.border && { borderRightWidth: 1, borderRightColor: BORDER },
                ]}
              >
                <Text style={s.statValue}>{stat.value}</Text>
                <Text style={s.statLabel}>{stat.label}</Text>
                <Text style={s.statSub}>{stat.sub}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ─ 3. Core Pillars ─ */}
        <View style={{ marginBottom: 32 }}>
          <Text style={s.sectionLabel}>Principles</Text>
          <Text style={s.sectionTitle}>Why FOREWORK is Different</Text>
          <Text style={s.sectionSub}>
            Engineered with deliberate principles to empower candidates and streamline recruiters.
          </Text>

          {corePillars.map((pillar, idx) => (
            <View key={idx} style={s.pillarCard}>
              <View style={s.pillarHeader}>
                <View
                  style={[
                    s.pillarIconWrap,
                    { backgroundColor: pillar.bgColor, borderColor: pillar.borderColor },
                  ]}
                >
                  <Icon name={pillar.icon} size={18} color={pillar.color} />
                </View>
                <Text style={s.pillarTitle}>{pillar.title}</Text>
              </View>
              <Text style={s.pillarDesc}>{pillar.description}</Text>
            </View>
          ))}
        </View>

        {/* ─ 4. Dual Journey ─ */}
        <View style={{ marginBottom: 32 }}>
          <Text style={s.sectionLabel}>How It Works</Text>
          <Text style={s.sectionTitle}>Designed for Both Sides of Hiring</Text>
          <Text style={s.sectionSub}>
            Whether searching for your dream role or scaling an engineering team.
          </Text>

          {/* Persona switcher */}
          <View style={s.switcher}>
            <Pressable
              style={[s.switchBtn, activePersona === "candidate" && s.switchBtnActive]}
              onPress={() => setActivePersona("candidate")}
            >
              <Text style={activePersona === "candidate" ? s.switchLabelActive : s.switchLabel}>
                👤 For Job Seekers
              </Text>
            </Pressable>
            <Pressable
              style={[s.switchBtn, activePersona === "recruiter" && s.switchBtnActive]}
              onPress={() => setActivePersona("recruiter")}
            >
              <Text style={activePersona === "recruiter" ? s.switchLabelActive : s.switchLabel}>
                🏢 For Recruiters
              </Text>
            </Pressable>
          </View>

          {/* Steps */}
          {steps.map((step, idx) => (
            <View key={idx} style={s.stepCard}>
              <View style={s.stepLeft}>
                <Text style={s.stepEmoji}>{step.emoji}</Text>
                <Text style={s.stepNum}>{step.number}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.stepTitle}>{step.title}</Text>
                <Text style={s.stepDesc}>{step.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* ─ 5. Developer Spotlight ─ */}
        <View style={s.devCard}>
          {/* Avatar + name */}
          <View style={s.devRow}>
            <Image
              source={{ uri: "https://avatars.githubusercontent.com/u/157904720?v=4" }}
              style={s.devAvatar}
              resizeMode="cover"
            />
            <View style={{ flex: 1 }}>
              <Text style={s.devName}>Jashanpreet Singh</Text>
              <Text style={s.devRole}>Full Stack Engineer & Maintainer</Text>
              <View style={s.devStatusRow}>
                <View style={s.devStatusDot} />
                <Text style={s.devStatusText}>Active Maintainer</Text>
              </View>
            </View>
          </View>

          {/* Bio */}
          <Text style={s.devBio}>
            Passionate about architecting responsive, scalable web and mobile applications with
            intuitive ergonomics. ForeWork was designed and built to address the friction in modern
            recruitment — providing candidates with dignity and transparency while empowering hiring
            teams with real-time operational tools.
          </Text>

          {/* Tech stack chips */}
          <Text style={s.stackLabel}>Core Technology Stack</Text>
          <View style={s.stackWrap}>
            {techStack.map((tech, idx) => (
              <View key={idx} style={s.stackChip}>
                <Text style={s.stackChipText}>{tech}</Text>
              </View>
            ))}
          </View>

          {/* Links */}
          <View style={s.devLinks}>
            <Pressable
              style={s.devLinkGh}
              onPress={() => openUrl("https://github.com/Jashan-randhawa")}
            >
              <Icon name="github" size={14} color="#FFFFFF" />
              <Text style={s.devLinkText}>GitHub Profile</Text>
            </Pressable>
            <Pressable
              style={s.devLinkRepo}
              onPress={() => openUrl("https://github.com/Jashan-randhawa/FOREWORK")}
            >
              <Text style={s.devLinkTextPurple}>Repository ↗</Text>
            </Pressable>
          </View>
        </View>

        {/* ─ 6. CTA Banner ─ */}
        <View style={s.ctaBanner}>
          <Text style={s.ctaTitle}>Ready to Accelerate{"\n"}Your Career?</Text>
          <Text style={s.ctaSub}>
            Join thousands of candidates discovering verified roles and top-tier employers hiring on ForeWork.
          </Text>
          <Pressable style={s.ctaBtn} onPress={() => router.push("/(auth)/register")}>
            <Text style={s.ctaBtnText}>Create Free Account ✨</Text>
          </Pressable>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
