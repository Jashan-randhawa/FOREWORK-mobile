import React from "react";
import { View, Text, Pressable, Linking, SafeAreaView } from "react-native";
import { router } from "expo-router";
import { useDispatch } from "react-redux";
import * as SecureStore from "expo-secure-store";
import { setUser } from "../src/redux/authSlice";
import { TOKEN_KEY } from "../src/utils/axiosInstance";
import API from "../src/utils/axiosInstance";
import { USER_API_ENDPOINT } from "../src/utils/endpoints";
import Icon from "../src/components/common/Icon";

export default function SuspendedAccountScreen() {
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await API.post(`${USER_API_ENDPOINT}/logout`);
    } catch {
      //
    } finally {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      dispatch(setUser(null));
      router.replace("/(auth)/login");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center px-6">
        <View className="w-full max-w-sm rounded-3xl border border-destructive/30 bg-card p-6 items-center text-center shadow-md">
          <View className="h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 mb-4">
            <Icon name="shield" size={32} color="#DC2626" />
          </View>

          <Text className="text-xl font-bold text-foreground">Account Suspended</Text>
          <Text className="text-xs text-muted-foreground text-center mt-2 leading-relaxed">
            Your FOREWORK account has been suspended by a platform administrator. Access to submitting applications, posting jobs, and platform tools is restricted.
          </Text>

          <View className="mt-4 w-full rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-3">
            <Text className="text-[11px] text-amber-800 dark:text-amber-300 text-center">
              If you believe this suspension is in error, contact our support team at{" "}
              <Text
                className="font-bold underline"
                onPress={() => Linking.openURL("mailto:support@forework.com")}
              >
                support@forework.com
              </Text>
            </Text>
          </View>

          <View className="mt-6 w-full gap-2.5">
            <Pressable
              onPress={() => router.replace("/(tabs)")}
              className="w-full rounded-xl border border-border bg-secondary py-3 items-center"
            >
              <Text className="text-xs font-bold text-foreground">Public Home</Text>
            </Pressable>

            <Pressable
              onPress={handleLogout}
              className="w-full rounded-xl bg-destructive py-3 items-center"
            >
              <Text className="text-xs font-bold text-destructive-foreground">Sign Out</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
