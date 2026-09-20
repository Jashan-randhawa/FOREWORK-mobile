import React from "react";
import { View, Text, Pressable, ActivityIndicator, SafeAreaView } from "react-native";
import { router } from "expo-router";
import { useSelector } from "react-redux";
import Icon from "../common/Icon";

interface RecruiterGuardProps {
  children: React.ReactNode;
}

export type RecruiterAccessStatus =
  | "LOADING"
  | "UNAUTHENTICATED"
  | "ACCESS_DENIED"
  | "AUTHORIZED";

export const getRecruiterAccessStatus = (
  user: any,
  loading: boolean
): RecruiterAccessStatus => {
  if (loading) return "LOADING";
  if (!user) return "UNAUTHENTICATED";
  if (user.role !== "Recruiter") return "ACCESS_DENIED";
  return "AUTHORIZED";
};

export const RecruiterGuard: React.FC<RecruiterGuardProps> = ({ children }) => {
  const { user, loading } = useSelector((store: any) => store.auth);
  const status = getRecruiterAccessStatus(user, loading);

  if (status === "LOADING") {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#6B3AC2" />
        <Text className="text-xs text-muted-foreground mt-3 font-medium">
          Verifying recruiter session...
        </Text>
      </SafeAreaView>
    );
  }

  if (status === "UNAUTHENTICATED") {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center p-6">
        <View className="w-16 h-16 rounded-full bg-primary/10 items-center justify-center mb-4">
          <Icon name="lock" size={24} color="#6B3AC2" />
        </View>
        <Text className="text-xl font-black text-foreground text-center">
          Authentication Required
        </Text>
        <Text className="text-xs text-muted-foreground text-center mt-1 mb-6 px-4">
          Please sign in to access the recruiter administration cockpit.
        </Text>
        <Pressable
          onPress={() => router.push("/(auth)/login")}
          className="rounded-xl bg-primary px-6 py-3 w-full max-w-xs items-center"
        >
          <Text className="text-xs font-bold text-primary-foreground">
            Sign In to Recruiter Account →
          </Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  if (status === "ACCESS_DENIED") {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center p-6">
        <View className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-950/40 items-center justify-center mb-4 border border-amber-300">
          <Icon name="shield" size={24} color="#D97706" />
        </View>
        <Text className="text-xl font-black text-foreground text-center">
          Recruiter Access Required
        </Text>
        <Text className="text-xs text-muted-foreground text-center mt-1 mb-6 px-4">
          Your current account is registered as a candidate ({user.role || "Student"}). Only verified recruiters have access to vacancy publishing, company management, and applicant screening.
        </Text>
        <View className="w-full max-w-xs space-y-3">
          <Pressable
            onPress={() => router.replace("/(tabs)/index")}
            className="rounded-xl bg-primary py-3 items-center"
          >
            <Text className="text-xs font-bold text-primary-foreground">
              Return to Candidate Jobs
            </Text>
          </Pressable>
          <Pressable
            onPress={() => router.back()}
            className="rounded-xl border border-border bg-card py-3 items-center"
          >
            <Text className="text-xs font-bold text-foreground">
              Go Back
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return <>{children}</>;
};

export default RecruiterGuard;
