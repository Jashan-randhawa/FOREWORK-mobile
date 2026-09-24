import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from "react-native";
import { router } from "expo-router";
import API from "../../src/utils/axiosInstance";
import { USER_API_ENDPOINT } from "../../src/utils/endpoints";
import Icon from "../../src/components/common/Icon";

export default function RegisterScreen() {
  const [role, setRole] = useState<"Student" | "Recruiter">("Student");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [pancard, setPancard] = useState("");
  const [adharcard, setAdharcard] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Password strength computation
  const passwordStrength = useMemo(() => {
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score === 0) return { label: "Too Short", color: "#8E8799" };
    if (score <= 2) return { label: "Fair", color: "#D97706" };
    if (score === 3) return { label: "Good", color: "#2563EB" };
    return { label: "Strong", color: "#059669" };
  }, [password]);

  const onSubmit = async () => {
    if (
      !fullname.trim() ||
      !email.trim() ||
      !password ||
      !phoneNumber.trim() ||
      !pancard.trim() ||
      !adharcard.trim()
    ) {
      setError("Please fill in all required fields including KYC details.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError(null);
    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("fullname", fullname.trim());
      formData.append("email", email.trim().toLowerCase());
      formData.append("password", password);
      formData.append("pancard", pancard.trim().toUpperCase());
      formData.append("adharcard", adharcard.trim());
      formData.append("role", role);
      formData.append("phoneNumber", phoneNumber.trim());

      const res = await API.post(`${USER_API_ENDPOINT}/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.success) {
        Alert.alert(
          "Account Created",
          "Your FOREWORK profile has been created! Please sign in with your credentials.",
          [{ text: "OK", onPress: () => router.replace("/(auth)/login") }]
        );
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" style={{ flex: 1 }}>
      <ScrollView
        className="flex-1 px-6 py-6"
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 48 }}
      >
        {/* Title */}
        <View className="mb-5">
          <Text className="text-2xl font-black text-foreground tracking-tight">
            Create Your Account
          </Text>
          <Text className="text-xs text-muted-foreground mt-1">
            Join verified talent on FOREWORK with zero recruiter ghosting.
          </Text>
        </View>

        {error ? (
          <View className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 p-3">
            <Text className="text-xs text-destructive">{error}</Text>
          </View>
        ) : null}

        {/* Role Switcher */}
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
              Candidate (Seeker)
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
              Recruiter (Hiring)
            </Text>
          </Pressable>
        </View>

        {/* Form Fields */}
        <View className="gap-3">
          <View>
            <Text className="text-xs font-semibold text-foreground mb-1">Full Name *</Text>
            <TextInput
              className="rounded-xl border border-border bg-card px-4 py-2.5 text-xs text-foreground"
              placeholder="e.g. Rahul Sharma"
              placeholderTextColor="#8E8799"
              value={fullname}
              onChangeText={setFullname}
            />
          </View>

          <View>
            <Text className="text-xs font-semibold text-foreground mb-1">Email Address *</Text>
            <TextInput
              className="rounded-xl border border-border bg-card px-4 py-2.5 text-xs text-foreground"
              placeholder="you@domain.com"
              placeholderTextColor="#8E8799"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View>
            <View className="flex-row items-center justify-between mb-1">
              <Text className="text-xs font-semibold text-foreground">Password *</Text>
              {password ? (
                <Text className="text-[10px] font-bold" style={{ color: passwordStrength.color }}>
                  Strength: {passwordStrength.label}
                </Text>
              ) : null}
            </View>
            <TextInput
              className="rounded-xl border border-border bg-card px-4 py-2.5 text-xs text-foreground"
              placeholder="Min 8 chars, 1 uppercase, 1 number"
              placeholderTextColor="#8E8799"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <View>
            <Text className="text-xs font-semibold text-foreground mb-1">Confirm Password *</Text>
            <TextInput
              className="rounded-xl border border-border bg-card px-4 py-2.5 text-xs text-foreground"
              placeholder="Repeat password"
              placeholderTextColor="#8E8799"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>

          <View>
            <Text className="text-xs font-semibold text-foreground mb-1">Phone Number *</Text>
            <TextInput
              className="rounded-xl border border-border bg-card px-4 py-2.5 text-xs text-foreground"
              placeholder="+91 9876543210"
              placeholderTextColor="#8E8799"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
          </View>

          <View>
            <Text className="text-xs font-semibold text-foreground mb-1">PAN Card Number *</Text>
            <TextInput
              className="rounded-xl border border-border bg-card px-4 py-2.5 text-xs text-foreground uppercase font-mono"
              placeholder="ABCDE1234F"
              placeholderTextColor="#8E8799"
              autoCapitalize="characters"
              maxLength={10}
              value={pancard}
              onChangeText={(val) => setPancard(val.toUpperCase())}
            />
          </View>

          <View>
            <Text className="text-xs font-semibold text-foreground mb-1">Aadhaar Card Number *</Text>
            <TextInput
              className="rounded-xl border border-border bg-card px-4 py-2.5 text-xs text-foreground font-mono"
              placeholder="12-digit UIDAI number"
              placeholderTextColor="#8E8799"
              keyboardType="numeric"
              maxLength={12}
              value={adharcard}
              onChangeText={setAdharcard}
            />
          </View>
        </View>

        {/* Security Notice */}
        <View className="mt-4 flex-row items-center gap-1.5 rounded-lg bg-secondary p-2.5">
          <Icon name="shield" size={14} color="#059669" />
          <Text className="text-[10px] text-muted-foreground flex-1">
            256-bit encrypted KYC credentials. Never shared or cached publicly.
          </Text>
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
              Complete Registration
            </Text>
          )}
        </Pressable>

        {/* Login Link */}
        <View className="mt-5 mb-8 flex-row items-center justify-center gap-1">
          <Text className="text-xs text-muted-foreground">Already have an account?</Text>
          <Pressable onPress={() => router.push("/(auth)/login" as any)}>
            <Text className="text-xs font-bold text-primary">Sign In</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
