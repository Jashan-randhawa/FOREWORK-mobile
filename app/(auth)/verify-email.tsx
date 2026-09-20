import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import API from "../../src/utils/axiosInstance";
import { USER_API_ENDPOINT } from "../../src/utils/endpoints";
import Icon from "../../src/components/common/Icon";

export default function VerifyEmailScreen() {
  const params = useLocalSearchParams();
  const token = Array.isArray(params.token) ? params.token[0] : params.token || "";

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus("error");
        setMessage("No email verification token provided in link.");
        return;
      }

      try {
        const res = await API.get(`${USER_API_ENDPOINT}/verify-email/${token}`);
        if (res.data?.success) {
          setStatus("success");
          setMessage(res.data.message || "Your email address has been verified!");
        } else {
          setStatus("error");
          setMessage(res.data?.message || "Verification failed.");
        }
      } catch (err: any) {
        setStatus("error");
        setMessage(err.response?.data?.message || "Invalid or expired verification link.");
      }
    };

    verify();
  }, [token]);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-6 justify-center">
        <View className="rounded-2xl border border-border bg-card p-6 items-center text-center">
          {status === "loading" && (
            <View className="py-6 items-center">
              <ActivityIndicator size="large" color="#6B3AC2" />
              <Text className="text-base font-bold text-foreground mt-3">Verifying Email...</Text>
              <Text className="text-xs text-muted-foreground mt-1">
                Please wait while we confirm your credentials.
              </Text>
            </View>
          )}

          {status === "success" && (
            <View className="py-4 items-center">
              <Icon name="check-circle" size={40} color="#059669" />
              <Text className="text-base font-bold text-foreground mt-3">Email Verified!</Text>
              <Text className="text-xs text-muted-foreground text-center mt-1 mb-5">
                {message}
              </Text>
              <Pressable
                onPress={() => router.replace("/(auth)/login")}
                className="w-full rounded-xl bg-primary py-3 items-center"
              >
                <Text className="text-xs font-bold text-primary-foreground">Proceed to Sign In</Text>
              </Pressable>
            </View>
          )}

          {status === "error" && (
            <View className="py-4 items-center">
              <Icon name="close" size={40} color="#DC2626" />
              <Text className="text-base font-bold text-foreground mt-3">Verification Failed</Text>
              <Text className="text-xs text-destructive text-center mt-1 mb-5">
                {message}
              </Text>
              <Pressable
                onPress={() => router.replace("/(auth)/login")}
                className="w-full rounded-xl border border-border bg-secondary py-3 items-center"
              >
                <Text className="text-xs font-bold text-foreground">Back to Sign In</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
