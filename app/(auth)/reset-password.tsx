import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import API from "../../src/utils/axiosInstance";
import { USER_API_ENDPOINT } from "../../src/utils/endpoints";
import Icon from "../../src/components/common/Icon";

export default function ResetPasswordScreen() {
  const params = useLocalSearchParams();
  const token = Array.isArray(params.token) ? params.token[0] : params.token || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!token) {
      setError("Reset token is missing or invalid.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError(null);
    try {
      setLoading(true);
      const res = await API.post(`${USER_API_ENDPOINT}/reset-password/${token}`, {
        password,
      });
      if (res.data?.success) {
        setSuccess(true);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-6 justify-center">
        <Pressable onPress={() => router.replace("/(auth)/login")} className="flex-row items-center gap-1 mb-8 self-start">
          <Text className="text-base font-bold text-primary">←</Text>
          <Text className="text-xs font-bold text-foreground">Login</Text>
        </Pressable>

        <View className="mb-6">
          <Text className="text-2xl font-black text-foreground">Set New Password</Text>
          <Text className="text-xs text-muted-foreground mt-1">
            Choose a strong new password for your account.
          </Text>
        </View>

        {error ? (
          <View className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 p-3">
            <Text className="text-xs text-destructive">{error}</Text>
          </View>
        ) : null}

        {success ? (
          <View className="rounded-2xl border border-border bg-card p-6 items-center text-center">
            <Icon name="check-circle" size={32} color="#059669" />
            <Text className="text-sm font-bold text-foreground mt-2">Password Reset Successful</Text>
            <Text className="text-xs text-muted-foreground text-center mt-1 mb-5">
              Your password has been changed. You can now log in with your new credentials.
            </Text>
            <Pressable
              onPress={() => router.replace("/(auth)/login")}
              className="w-full rounded-xl bg-primary py-3 items-center"
            >
              <Text className="text-xs font-bold text-primary-foreground">Proceed to Sign In</Text>
            </Pressable>
          </View>
        ) : (
          <View className="gap-3">
            <View>
              <Text className="text-xs font-semibold text-foreground mb-1">New Password</Text>
              <TextInput
                className="rounded-xl border border-border bg-card px-4 py-2.5 text-xs text-foreground"
                placeholder="At least 6 characters"
                placeholderTextColor="#8E8799"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <View>
              <Text className="text-xs font-semibold text-foreground mb-1">Confirm New Password</Text>
              <TextInput
                className="rounded-xl border border-border bg-card px-4 py-2.5 text-xs text-foreground"
                placeholder="Re-enter password"
                placeholderTextColor="#8E8799"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>

            <Pressable
              onPress={handleSubmit}
              disabled={loading}
              className="mt-4 items-center justify-center rounded-xl bg-primary py-3.5 shadow-md"
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text className="text-xs font-bold text-primary-foreground">
                  Reset Password
                </Text>
              )}
            </Pressable>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
