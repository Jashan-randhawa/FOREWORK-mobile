import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { router } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { setSearchedQuery } from "../../src/redux/jobSlice";
import useGetAllJobs from "../../src/hooks/useGetAllJobs";
import JobCard from "../../src/components/jobs/JobCard";
import Icon from "../../src/components/common/Icon";

const TRENDING_SEARCHES = [
  "Full Stack",
  "Frontend",
  "Backend",
  "React",
  "Node.js",
  "Python",
  "Remote",
  "DevOps",
];

const FEATURED_CATEGORIES = [
  { title: "Frontend Developer", icon: "⚡", roles: "React, Next.js, TS" },
  { title: "Backend Developer", icon: "🏢", roles: "Node, Go, Python" },
  { title: "Full Stack Developer", icon: "💼", roles: "MERN, Full Lifecycle" },
  { title: "DevOps Engineer", icon: "🛡️", roles: "AWS, Docker, K8s" },
  { title: "AI / ML Engineer", icon: "✨", roles: "PyTorch, LLMs, NLP" },
  { title: "Mobile Developer", icon: "📱", roles: "React Native, Flutter" },
];

const PLATFORM_PILLARS = [
  {
    icon: "shield",
    title: "100% Verified Employers",
    desc: "Strict verification to protect job seekers from spam, scams, and ghost postings.",
  },
  {
    icon: "zap",
    title: "Transparent Telemetry",
    desc: "Know the exact second your resume is opened, shortlisted, or scheduled.",
  },
  {
    icon: "video",
    title: "Direct Video Interviews",
    desc: "Conference links and scheduled details right inside your candidate dashboard.",
  },
];

export default function HomeScreen() {
  const dispatch = useDispatch();
  const { user } = useSelector((state: any) => state.auth);
  const allJobs = useSelector((state: any) => state.job?.allJobs || []);
  const { loading, error, refetch } = useGetAllJobs();
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    if (user?.role === "Recruiter") {
      router.replace("/recruiter/jobs" as any);
    }
  }, [user]);

  const handleSearch = () => {
    if (!keyword.trim()) return;
    dispatch(setSearchedQuery(keyword.trim()));
    router.push("/(tabs)/browse");
  };

  const handleQuickTagClick = (tag: string) => {
    dispatch(setSearchedQuery(tag));
    router.push("/(tabs)/browse");
  };

  return (
    <SafeAreaView className="flex-1 bg-background" style={{ flex: 1 }}>
      <ScrollView
        className="flex-1"
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Top App Header */}
        <View
          style={{ backgroundColor: "#6B3AC2" }}
          className="px-5 pt-5 pb-4 flex-row items-center justify-between"
        >
          <View>
            <Text style={{ fontSize: 22, fontWeight: "900", color: "#FFFFFF", letterSpacing: -0.5 }}>
              FORE<Text style={{ color: "#E9D8FD" }}>WORK</Text>
            </Text>
            <Text style={{ fontSize: 12, color: "#C4B5FD", fontWeight: "500" }}>
              {user ? `Welcome back, ${user.fullname?.split(" ")[0]} 👋` : "India's Verified Career Marketplace"}
            </Text>
          </View>
          <Pressable
            onPress={() => router.push("/notifications" as any)}
            style={{
              height: 42,
              width: 42,
              borderRadius: 21,
              backgroundColor: "rgba(255,255,255,0.2)",
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.3)",
            }}
          >
            <Icon name="bell" size={20} color="#FFFFFF" />
          </Pressable>
        </View>

        {/* Hero Search Section */}
        <View
          style={{ backgroundColor: "#6B3AC2" }}
          className="px-5 pb-6"
        >
          <Text
            style={{
              fontSize: 26,
              fontWeight: "900",
              color: "#FFFFFF",
              lineHeight: 32,
              marginBottom: 4,
              marginTop: 8,
            }}
          >
            Find Your{"\n"}
            <Text style={{ color: "#E9D8FD" }}>Dream Career</Text> ✨
          </Text>
          <Text style={{ fontSize: 13, color: "#C4B5FD", marginBottom: 16, lineHeight: 18 }}>
            Thousands of verified tech positions with real-time status tracking.
          </Text>

          {/* Search Bar */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#FFFFFF",
              borderRadius: 16,
              paddingHorizontal: 14,
              paddingVertical: 4,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 12,
              elevation: 8,
            }}
          >
            <Icon name="search" size={18} color="#6B3AC2" />
            <TextInput
              placeholder="Title, skill, or company..."
              placeholderTextColor="#A09BB8"
              value={keyword}
              onChangeText={setKeyword}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
              style={{
                flex: 1,
                paddingHorizontal: 12,
                paddingVertical: 12,
                fontSize: 14,
                color: "#1C1033",
                fontWeight: "500",
              }}
            />
            <Pressable
              onPress={handleSearch}
              style={{
                backgroundColor: "#6B3AC2",
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 9,
              }}
            >
              <Text style={{ fontSize: 13, fontWeight: "800", color: "#FFFFFF" }}>Search</Text>
            </Pressable>
          </View>

          {/* Trending Pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: 14 }}
          >
            {TRENDING_SEARCHES.map((tag) => (
              <Pressable
                key={tag}
                onPress={() => handleQuickTagClick(tag)}
                style={{
                  backgroundColor: "rgba(255,255,255,0.18)",
                  borderColor: "rgba(255,255,255,0.35)",
                  borderWidth: 1,
                  borderRadius: 20,
                  paddingHorizontal: 12,
                  paddingVertical: 5,
                  marginRight: 8,
                }}
              >
                <Text style={{ fontSize: 12, fontWeight: "600", color: "#FFFFFF" }}>#{tag}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Stats Strip */}
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "#F9F7FF",
            borderBottomWidth: 1,
            borderBottomColor: "#E4DFEF",
          }}
        >
          {[
            { value: "100%", label: "Verified Jobs" },
            { value: "< 48h", label: "Response Time" },
            { value: "0%", label: "Ghosting" },
          ].map((stat, i) => (
            <View
              key={i}
              style={{
                flex: 1,
                paddingVertical: 12,
                alignItems: "center",
                borderRightWidth: i < 2 ? 1 : 0,
                borderRightColor: "#E4DFEF",
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "900", color: "#6B3AC2" }}>{stat.value}</Text>
              <Text style={{ fontSize: 10, fontWeight: "600", color: "#8E7BA8", marginTop: 1 }}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Platform Advantages */}
        <View className="mt-6 px-5">
          <View className="flex-row items-center justify-between mb-3">
            <View>
              <Text style={{ fontSize: 11, fontWeight: "800", color: "#6B3AC2", textTransform: "uppercase", letterSpacing: 1 }}>
                Why FOREWORK
              </Text>
              <Text style={{ fontSize: 18, fontWeight: "900", color: "#1C1033", marginTop: 2 }}>
                Built for Modern Hiring
              </Text>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {PLATFORM_PILLARS.map((item, idx) => (
              <View
                key={idx}
                style={{
                  width: 220,
                  marginRight: 12,
                  borderRadius: 20,
                  borderWidth: 1.5,
                  borderColor: "#E4DFEF",
                  backgroundColor: "#FFFFFF",
                  padding: 16,
                  shadowColor: "#6B3AC2",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.06,
                  shadowRadius: 8,
                  elevation: 3,
                }}
              >
                <View
                  style={{
                    height: 44,
                    width: 44,
                    borderRadius: 14,
                    backgroundColor: "#EDE9FF",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 10,
                  }}
                >
                  <Icon name={item.icon} size={22} color="#6B3AC2" />
                </View>
                <Text style={{ fontSize: 13, fontWeight: "800", color: "#1C1033", marginBottom: 4 }}>{item.title}</Text>
                <Text style={{ fontSize: 11, color: "#7C6F9A", lineHeight: 16 }}>{item.desc}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* High-Demand Specializations */}
        <View className="mt-6 px-5">
          <View className="flex-row items-center justify-between mb-3">
            <View>
              <Text style={{ fontSize: 11, fontWeight: "800", color: "#6B3AC2", textTransform: "uppercase", letterSpacing: 1 }}>
                Explore Domains
              </Text>
              <Text style={{ fontSize: 18, fontWeight: "900", color: "#1C1033", marginTop: 2 }}>
                Popular Categories
              </Text>
            </View>
            <Pressable onPress={() => router.push("/(tabs)/browse")}>
              <Text style={{ fontSize: 13, fontWeight: "700", color: "#6B3AC2" }}>View All →</Text>
            </Pressable>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {FEATURED_CATEGORIES.map((cat, idx) => (
              <Pressable
                key={idx}
                onPress={() => handleQuickTagClick(cat.title)}
                style={{
                  width: 140,
                  marginRight: 12,
                  borderRadius: 20,
                  borderWidth: 1.5,
                  borderColor: "#E4DFEF",
                  backgroundColor: "#FFFFFF",
                  padding: 14,
                  shadowColor: "#6B3AC2",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 6,
                  elevation: 2,
                }}
              >
                <Text style={{ fontSize: 24, marginBottom: 8 }}>{cat.icon}</Text>
                <Text style={{ fontSize: 12, fontWeight: "800", color: "#1C1033" }} numberOfLines={1}>
                  {cat.title}
                </Text>
                <Text style={{ fontSize: 10, color: "#8E7BA8", marginTop: 3 }} numberOfLines={1}>
                  {cat.roles}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Latest Jobs Feed */}
        <View style={{ marginTop: 24, paddingHorizontal: 20, paddingBottom: 32 }}>
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text style={{ fontSize: 11, fontWeight: "800", color: "#6B3AC2", textTransform: "uppercase", letterSpacing: 1 }}>
                Active Openings
              </Text>
              <Text style={{ fontSize: 18, fontWeight: "900", color: "#1C1033", marginTop: 2 }}>
                Latest Job Listings
              </Text>
            </View>
            <Pressable
              onPress={() => router.push("/(tabs)/jobs")}
              style={{
                backgroundColor: "#EDE9FF",
                borderRadius: 12,
                paddingHorizontal: 12,
                paddingVertical: 6,
              }}
            >
              <Text style={{ fontSize: 12, fontWeight: "700", color: "#6B3AC2" }}>
                All ({allJobs.length}) →
              </Text>
            </Pressable>
          </View>

          {loading ? (
            <View style={{ paddingVertical: 48, alignItems: "center" }}>
              <ActivityIndicator size="large" color="#6B3AC2" />
              <Text style={{ fontSize: 12, color: "#8E7BA8", marginTop: 10 }}>Loading live positions...</Text>
            </View>
          ) : error ? (
            <View
              style={{
                borderRadius: 16,
                borderWidth: 1,
                borderColor: "#FCA5A5",
                backgroundColor: "#FEF2F2",
                padding: 16,
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 12, color: "#DC2626", textAlign: "center" }}>{error}</Text>
              <Pressable
                onPress={refetch}
                style={{ marginTop: 10, backgroundColor: "#DC2626", borderRadius: 10, paddingHorizontal: 16, paddingVertical: 8 }}
              >
                <Text style={{ fontSize: 12, color: "#FFFFFF", fontWeight: "700" }}>Retry</Text>
              </Pressable>
            </View>
          ) : allJobs.length === 0 ? (
            <View
              style={{
                borderRadius: 20,
                borderWidth: 1.5,
                borderStyle: "dashed" as any,
                borderColor: "#C4B5FD",
                backgroundColor: "#FAF8FF",
                padding: 36,
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 36, marginBottom: 8 }}>💼</Text>
              <Text style={{ fontSize: 15, fontWeight: "800", color: "#1C1033" }}>No Openings Yet</Text>
              <Text style={{ fontSize: 12, color: "#8E7BA8", textAlign: "center", marginTop: 4, lineHeight: 18 }}>
                New positions are added regularly by vetted hiring teams.
              </Text>
            </View>
          ) : (
            allJobs.slice(0, 5).map((job: any) => <JobCard key={job._id} job={job} />)
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
