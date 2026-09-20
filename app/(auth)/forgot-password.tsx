import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { router } from "expo-router";
import API from "../../src/utils/axiosInstance";
import { USER_API_ENDPOINT } from "../../src/utils/endpoints";
import Icon from "../../src/components/common/Icon";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!email.trim()) {
      setError("Please enter your registered email address.");
      return;
    }
    setError(null);
    try {
      setLoading(true);
      const res = await API.post(`${USER_API_ENDPOINT}/forgot-password`, {
        email: email.trim().toLowerCase(),
      });
      if (res.data?.success) {
        setSubmitted(true);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-6 justify-center">
        <Pressable onPress={() => router.back()} className="flex-row items-center gap-1 mb-8 self-start">
          <Text className="text-base font-bold text-primary">←</Text>
          <Text className="text-xs font-bold text-foreground">Back</Text>
        </Pressable>

        <View className="mb-6">
          <Text className="text-2xl font-black text-foreground">Forgot Password</Text>
          <Text className="text-xs text-muted-foreground mt-1">
            Enter your registered email address and we'll dispatch a secure password reset link.
          </Text>
        </View>

        {error ? (
          <View className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 p-3">
            <Text className="text-xs text-destructive">{error}</Text>
          </View>
        ) : null}

        {submitted ? (
          <View className="rounded-2xl border border-border bg-card p-6 items-center text-center">
            <Icon name="check-circle" size={32} color="#059669" />
            <Text className="text-sm font-bold text-foreground mt-2">Reset Link Dispatched</Text>
            <Text className="text-xs text-muted-foreground text-center mt-1 mb-5">
              If an account with {email} exists, you will receive an email with instructions to reset your password.
            </Text>
            <Pressable
              onPress={() => router.replace("/(auth)/login")}
              className="w-full rounded-xl bg-primary py-3 items-center"
            >
              <Text className="text-xs font-bold text-primary-foreground">Back to Sign In</Text>
            </Pressable>
          </View>
        ) : (
          <View className="gap-4">
            <View>
              <Text className="text-xs font-semibold text-foreground mb-1">Email Address</Text>
              <TextInput
                className="rounded-xl border border-border bg-card px-4 py-3 text-xs text-foreground"
                placeholder="name@example.com"
                placeholderTextColor="#8E8799"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <Pressable
              onPress={handleSubmit}
              disabled={loading}
              className="items-center justify-center rounded-xl bg-primary py-3.5 shadow-md"
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text className="text-xs font-bold text-primary-foreground">
                  Send Password Reset Link
                </Text>
              )}
            </Pressable>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
