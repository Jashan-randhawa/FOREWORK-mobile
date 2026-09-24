import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Linking,
  SafeAreaView,
} from "react-native";
import { router } from "expo-router";
import { useSelector } from "react-redux";
import useGetAllCompanies from "../../src/hooks/useGetAllCompanies";
import Icon from "../../src/components/common/Icon";
import RecruiterGuard from "../../src/components/recruiter/RecruiterGuard";

export default function RecruiterCompaniesScreen() {
  const { loading, refetch } = useGetAllCompanies();
  const { companies = [] } = useSelector((store: any) => store.company);

  const [search, setSearch] = useState("");

  const filteredCompanies = companies.filter((c: any) =>
    (c.name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <RecruiterGuard>
      <SafeAreaView className="flex-1 bg-background" style={{ flex: 1 }}>
        {/* Top Header */}
        <View className="flex-row items-center justify-between border-b border-border px-5 py-3.5 bg-card">
          <Pressable onPress={() => router.back()} className="flex-row items-center gap-1.5">
            <Text className="text-base font-bold text-primary">←</Text>
            <Text className="text-xs font-bold text-foreground">Back</Text>
          </Pressable>
          <Text className="text-sm font-black text-foreground">Registered Companies</Text>
          <Pressable
            onPress={() => router.push("/recruiter/create-company" as any)}
            className="flex-row items-center gap-1 rounded-lg bg-primary px-2.5 py-1.5"
          >
            <Icon name="plus" size={12} color="#FFFFFF" />
            <Text className="text-[11px] font-bold text-primary-foreground">Add</Text>
          </Pressable>
        </View>

        <ScrollView
          className="flex-1 px-4 py-4"
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 48 }}
        >
          {/* Search Bar */}
          <View className="rounded-xl border border-border bg-card px-3.5 py-2.5 flex-row items-center gap-2 mb-4">
            <Icon name="search" size={14} color="#8E8799" />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search companies by name..."
              placeholderTextColor="#8E8799"
              className="flex-1 text-xs text-foreground p-0"
            />
            {search ? (
              <Pressable onPress={() => setSearch("")}>
                <Icon name="x" size={14} color="#8E8799" />
              </Pressable>
            ) : null}
          </View>

          {/* Companies List */}
          {loading ? (
            <View className="py-20 items-center justify-center">
              <ActivityIndicator color="#6B3AC2" size="large" />
              <Text className="text-xs text-muted-foreground mt-2 font-medium">
                Loading company profiles...
              </Text>
            </View>
          ) : filteredCompanies.length > 0 ? (
            <View className="space-y-3 mb-10">
              {filteredCompanies.map((comp: any) => (
                <View
                  key={comp._id}
                  className="rounded-2xl border border-border bg-card p-4 space-y-3 shadow-2xs"
                >
                  <View className="flex-row items-start justify-between">
                    <View className="flex-row items-center gap-3 flex-1 pr-2">
                      <View className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 items-center justify-center">
                        <Text className="text-lg font-black text-primary">
                          {(comp.name || "C").charAt(0).toUpperCase()}
                        </Text>
                      </View>
                      <View className="flex-1">
                        <Text className="text-base font-black text-foreground" numberOfLines={1}>
                          {comp.name}
                        </Text>
                        <View className="flex-row items-center gap-1 mt-0.5">
                          {comp.isVerified ? (
                            <View className="rounded-full bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 border border-emerald-300">
                              <Text className="text-[9px] font-bold text-emerald-800 dark:text-emerald-300">
                                ✓ Verified Employer
                              </Text>
                            </View>
                          ) : (
                            <View className="rounded-full bg-muted px-2 py-0.5 border border-border">
                              <Text className="text-[9px] font-semibold text-muted-foreground">
                                Pending Verification
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>
                    </View>

                    <Pressable
                      onPress={() => router.push(`/recruiter/company/${comp._id}` as any)}
                      className="rounded-lg bg-primary/10 px-3 py-1.5 flex-row items-center gap-1"
                    >
                      <Icon name="edit" size={12} color="#6B3AC2" />
                      <Text className="text-xs font-bold text-primary">Edit</Text>
                    </Pressable>
                  </View>

                  {/* Details */}
                  <View className="space-y-1 pt-1 border-t border-border">
                    {comp.location ? (
                      <Text className="text-xs text-muted-foreground">
                        📍 {comp.location}
                      </Text>
                    ) : null}
                    {comp.website ? (
                      <Pressable onPress={() => Linking.openURL(comp.website)}>
                        <Text className="text-xs text-primary font-medium" numberOfLines={1}>
                          🌐 {comp.website} ↗
                        </Text>
                      </Pressable>
                    ) : null}
                    {comp.description ? (
                      <Text className="text-xs text-foreground mt-1 leading-relaxed" numberOfLines={2}>
                        {comp.description}
                      </Text>
                    ) : null}
                  </View>

                  <Text className="text-[10px] text-muted-foreground">
                    Registered: {new Date(comp.createdAt).toLocaleDateString()}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <View className="py-16 items-center text-center space-y-3">
              <View className="w-16 h-16 rounded-full bg-muted/40 items-center justify-center">
                <Icon name="building" size={24} color="#8E8799" />
              </View>
              <Text className="text-sm font-bold text-foreground">
                No registered companies found
              </Text>
              <Text className="text-xs text-muted-foreground max-w-xs text-center">
                {search
                  ? `No companies matching "${search}".`
                  : "Register your company profile to publish vacancies and build organizational branding."}
              </Text>
              <Pressable
                onPress={() => router.push("/recruiter/create-company" as any)}
                className="rounded-xl bg-primary px-5 py-2.5 mt-2"
              >
                <Text className="text-xs font-bold text-primary-foreground">
                  + Register First Company
                </Text>
              </Pressable>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </RecruiterGuard>
  );
}
