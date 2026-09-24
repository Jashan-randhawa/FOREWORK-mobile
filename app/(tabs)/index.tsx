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
        <View className="px-5 pt-3 pb-2 flex-row items-center justify-between">
          <View>
            <Text className="text-xl font-extrabold text-foreground">
              FORE<Text className="text-primary">WORK</Text>
            </Text>
            <Text className="text-xs text-muted-foreground">
              {user ? `Hello, ${user.fullname}` : "Verified Career Marketplace"}
            </Text>
          </View>
          <Pressable
            onPress={() => router.push("/notifications" as any)}
            className="h-10 w-10 items-center justify-center rounded-full bg-secondary border border-border"
          >
            <Icon name="bell" size={18} color="#6B3AC2" />
          </Pressable>
        </View>

        {/* Hero Section */}
        <View className="mx-4 mt-3 rounded-3xl bg-primary/10 border border-primary/20 p-5">
          <View className="flex-row items-center gap-1.5 self-start rounded-full bg-primary/20 px-3 py-1 mb-2.5">
            <Icon name="sparkles" size={12} color="#6B3AC2" />
            <Text className="text-[11px] font-bold text-primary">India's Verified Marketplace</Text>
          </View>

          <Text className="text-2xl font-black text-foreground tracking-tight leading-tight">
            Find & Accelerate Your{"\n"}
            <Text className="text-primary">Dream Career</Text>
          </Text>

          <Text className="mt-2 text-xs text-muted-foreground leading-relaxed">
            Thousands of verified engineering and tech positions with transparent telemetry.
          </Text>

          {/* Search Input Box */}
          <View className="mt-4 flex-row items-center rounded-2xl bg-card border border-border px-3 py-1.5 shadow-sm">
            <Icon name="search" size={16} color="#8E8799" />
            <TextInput
              placeholder="Title, skill, or company..."
              placeholderTextColor="#8E8799"
              value={keyword}
              onChangeText={setKeyword}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
              className="flex-1 px-3 py-2 text-xs text-foreground"
            />
            <Pressable
              onPress={handleSearch}
              className="rounded-xl bg-primary px-3.5 py-2 shadow-xs"
            >
              <Text className="text-xs font-bold text-primary-foreground">Search</Text>
            </Pressable>
          </View>

          {/* Trending Pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mt-3.5 flex-row gap-1.5"
          >
            {TRENDING_SEARCHES.map((tag) => (
              <Pressable
                key={tag}
                onPress={() => handleQuickTagClick(tag)}
                className="rounded-full bg-card border border-border px-2.5 py-1 mr-1.5"
              >
                <Text className="text-[10px] font-medium text-foreground">#{tag}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Platform Advantages Carousel */}
        <View className="mt-6 px-5">
          <Text className="text-xs font-bold uppercase tracking-wider text-primary">
            Platform Benefits
          </Text>
          <Text className="text-lg font-extrabold text-foreground mt-0.5">
            Built for Modern Hiring
          </Text>

          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            className="mt-3 flex-row gap-3"
          >
            {PLATFORM_PILLARS.map((item, idx) => (
              <View
                key={idx}
                className="w-[280px] mr-3 rounded-2xl border border-border bg-card p-4 shadow-sm"
              >
                <View className="h-9 w-9 items-center justify-center rounded-xl bg-primary/15 mb-2.5">
                  <Icon name={item.icon} size={18} color="#6B3AC2" />
                </View>
                <Text className="text-sm font-bold text-foreground">{item.title}</Text>
                <Text className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  {item.desc}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* High-Demand Specializations */}
        <View className="mt-6 px-5">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-xs font-bold uppercase tracking-wider text-primary">
                Explore Domains
              </Text>
              <Text className="text-lg font-extrabold text-foreground mt-0.5">
                Popular Categories
              </Text>
            </View>
            <Pressable onPress={() => router.push("/(tabs)/browse")}>
              <Text className="text-xs font-bold text-primary">View All →</Text>
            </Pressable>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mt-3 flex-row gap-3"
          >
            {FEATURED_CATEGORIES.map((cat, idx) => (
              <Pressable
                key={idx}
                onPress={() => handleQuickTagClick(cat.title)}
                className="w-40 mr-3 rounded-2xl border border-border bg-card p-3.5 shadow-sm"
              >
                <Text className="text-xl mb-1.5">{cat.icon}</Text>
                <Text className="text-xs font-bold text-foreground" numberOfLines={1}>
                  {cat.title}
                </Text>
                <Text className="text-[10px] text-muted-foreground mt-0.5" numberOfLines={1}>
                  {cat.roles}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Latest Jobs Feed */}
        <View className="mt-6 px-5 pb-8">
          <View className="flex-row items-center justify-between mb-3">
            <View>
              <Text className="text-xs font-bold uppercase tracking-wider text-primary">
                Active Openings
              </Text>
              <Text className="text-lg font-extrabold text-foreground mt-0.5">
                Latest Job Listings
              </Text>
            </View>
            <Pressable onPress={() => router.push("/(tabs)/jobs")}>
              <Text className="text-xs font-bold text-primary">All Jobs ({allJobs.length}) →</Text>
            </Pressable>
          </View>

          {loading ? (
            <View className="py-12 items-center justify-center">
              <ActivityIndicator size="large" color="#6B3AC2" />
              <Text className="text-xs text-muted-foreground mt-2">Loading live positions...</Text>
            </View>
          ) : error ? (
            <View className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 items-center">
              <Text className="text-xs text-destructive text-center">{error}</Text>
              <Pressable onPress={refetch} className="mt-2 rounded-lg bg-primary px-3 py-1.5">
                <Text className="text-xs text-primary-foreground font-semibold">Retry</Text>
              </Pressable>
            </View>
          ) : allJobs.length === 0 ? (
            <View className="rounded-2xl border border-dashed border-border bg-card p-8 items-center text-center">
              <Icon name="briefcase" size={32} color="#8E8799" />
              <Text className="text-sm font-bold text-foreground mt-2">No Openings Listed Yet</Text>
              <Text className="text-xs text-muted-foreground text-center mt-1">
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
