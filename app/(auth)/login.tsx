import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { useDispatch } from "react-redux";
import * as SecureStore from "../../src/utils/secureStorage";
import API, { TOKEN_KEY } from "../../src/utils/axiosInstance";
import { USER_API_ENDPOINT } from "../../src/utils/endpoints";
import { setLoading, setUser } from "../../src/redux/authSlice";
import Icon from "../../src/components/common/Icon";

export default function LoginScreen() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"Student" | "Recruiter">("Student");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const destinationFor = (user: { role?: string } | null) => {
    if (user?.role === "Recruiter") return "/recruiter/jobs";
    return "/(tabs)";
  };

  const onSubmit = async () => {
    if (!email.trim() || !password) {
      setError("Please fill in email and password");
      return;
    }
    setError(null);
    try {
      setSubmitting(true);
      dispatch(setLoading(true));
      const res = await API.post(`${USER_API_ENDPOINT}/login`, {
        email: email.trim().toLowerCase(),
        password,
        role,
      });

      if (res.data?.success) {
        const loggedInUser = res.data.user;
        if (res.data.token) {
          await SecureStore.setItemAsync(TOKEN_KEY, res.data.token);
        }
        dispatch(setUser(loggedInUser));
        router.replace(destinationFor(loggedInUser) as any);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Login failed");
    } finally {
      setSubmitting(false);
      dispatch(setLoading(false));
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 px-6 justify-center" contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}>
        {/* Branding Header */}
        <View className="mb-6">
          <Text className="text-3xl font-black text-foreground tracking-tight">
            Welcome to FORE<Text className="text-primary">WORK</Text>
          </Text>
          <Text className="text-xs text-muted-foreground mt-1">
            Sign in to access verified job openings and manage your career pipeline.
          </Text>
        </View>

        {error ? (
          <View className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 p-3">
            <Text className="text-xs text-destructive">{error}</Text>
          </View>
        ) : null}

        {/* Role Selector Tabs */}
        <View className="mb-4 flex-row gap-2.5">
          <Pressable
            onPress={() => setRole("Student")}
            className={`flex-1 items-center rounded-xl border py-2.5 ${
              role === "Student"
                ? "border-primary bg-primary/10"
                : "border-border bg-card"
            }`}
          >
            <Text
              className={`text-xs font-bold ${
                role === "Student" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Candidate (Job Seeker)
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setRole("Recruiter")}
            className={`flex-1 items-center rounded-xl border py-2.5 ${
              role === "Recruiter"
                ? "border-primary bg-primary/10"
                : "border-border bg-card"
            }`}
          >
            <Text
              className={`text-xs font-bold ${
                role === "Recruiter" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Recruiter (Employer)
            </Text>
          </Pressable>
        </View>

        {/* Inputs */}
        <View className="gap-3">
          <View>
            <Text className="text-xs font-semibold text-foreground mb-1">Email Address</Text>
            <TextInput
              className="rounded-xl border border-border bg-card px-4 py-3 text-xs text-foreground"
              placeholder="you@example.com"
              placeholderTextColor="#8E8799"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View>
            <View className="flex-row items-center justify-between mb-1">
              <Text className="text-xs font-semibold text-foreground">Password</Text>
              <Pressable onPress={() => router.push("/(auth)/forgot-password" as any)}>
                <Text className="text-xs font-bold text-primary">Forgot Password?</Text>
              </Pressable>
            </View>
            <TextInput
              className="rounded-xl border border-border bg-card px-4 py-3 text-xs text-foreground"
              placeholder="••••••••"
              placeholderTextColor="#8E8799"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>
        </View>

        {/* Submit Button */}
        <Pressable
          onPress={onSubmit}
          disabled={submitting}
          className="mt-5 items-center justify-center rounded-xl bg-primary py-3.5 shadow-md"
        >
          {submitting ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text className="text-xs font-bold text-primary-foreground">
              Sign In to FOREWORK
            </Text>
          )}
        </Pressable>

        {/* Register Link */}
        <View className="mt-6 flex-row items-center justify-center gap-1">
          <Text className="text-xs text-muted-foreground">Don't have an account?</Text>
          <Pressable onPress={() => router.push("/(auth)/register" as any)}>
            <Text className="text-xs font-bold text-primary">Register Here</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
