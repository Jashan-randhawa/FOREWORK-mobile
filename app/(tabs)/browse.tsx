import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { clearFilters, setPage } from "../../src/redux/jobSlice";
import useGetAllJobs from "../../src/hooks/useGetAllJobs";
import JobCard from "../../src/components/jobs/JobCard";
import FilterModal from "../../src/components/jobs/FilterModal";
import Icon from "../../src/components/common/Icon";

export default function BrowseScreen() {
  const dispatch = useDispatch();
  const { allJobs, pagination, searchedQuery, filters } = useSelector(
    (store: any) => store.job
  );
  const { loading, error, refetch } = useGetAllJobs();
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  useEffect(() => {
    return () => {
      // Clean up search on unmount
    };
  }, []);

  const activeFiltersCount = [
    Boolean(filters?.location),
    Boolean(filters?.technology),
    Boolean(filters?.jobType),
    filters?.experienceMin !== "" && filters?.experienceMin !== undefined,
    filters?.salaryMin !== "" && filters?.salaryMin !== undefined,
    Boolean(searchedQuery),
  ].filter(Boolean).length;

  return (
    <SafeAreaView className="flex-1 bg-background" style={{ flex: 1 }}>
      {/* Top Header */}
      <View className="px-5 pt-3 pb-3 border-b border-border bg-card">
        <View className="flex-row items-center justify-between">
          <View className="flex-1 mr-2">
            <Text className="text-xl font-black text-foreground" numberOfLines={1}>
              {searchedQuery ? `Results: "${searchedQuery}"` : "Browse Categories"}
            </Text>
            <Text className="text-xs text-muted-foreground">
              {pagination?.total || allJobs.length} opportunities matched
            </Text>
          </View>
          <Pressable
            onPress={() => setFilterModalOpen(true)}
            className="flex-row items-center gap-1.5 rounded-xl border border-border bg-secondary px-3 py-2"
          >
            <Icon name="filter" size={14} color="#6B3AC2" />
            <Text className="text-xs font-bold text-foreground">Filter</Text>
            {activeFiltersCount > 0 && (
              <View className="h-4 w-4 items-center justify-center rounded-full bg-primary">
                <Text className="text-[10px] font-bold text-primary-foreground">
                  {activeFiltersCount}
                </Text>
              </View>
            )}
          </Pressable>
        </View>

        {searchedQuery ? (
          <View className="mt-2.5 flex-row items-center justify-between rounded-xl bg-primary/10 px-3 py-2">
            <Text className="text-xs font-semibold text-primary">Filtered by: {searchedQuery}</Text>
            <Pressable onPress={() => dispatch(clearFilters())}>
              <Text className="text-xs font-bold text-destructive">Clear</Text>
            </Pressable>
          </View>
        ) : null}
      </View>

      {/* Main List */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#6B3AC2" />
          <Text className="text-xs text-muted-foreground mt-2">Loading opportunities...</Text>
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-sm text-destructive">{error}</Text>
          <Pressable onPress={refetch} className="mt-4 rounded-xl bg-primary px-4 py-2">
            <Text className="text-xs font-bold text-primary-foreground">Retry</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          style={{ flex: 1 }}
          data={allJobs}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <JobCard job={item} />}
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          refreshing={loading}
          onRefresh={refetch}
          ListEmptyComponent={
            <View className="py-20 items-center justify-center">
              <Icon name="search" size={36} color="#8E8799" />
              <Text className="text-base font-bold text-foreground mt-2">No Matching Results</Text>
              <Text className="text-xs text-muted-foreground mt-1 text-center max-w-xs">
                Try searching with different keywords or clearing active filters.
              </Text>
              <Pressable
                onPress={() => dispatch(clearFilters())}
                className="mt-4 rounded-xl bg-primary px-4 py-2"
              >
                <Text className="text-xs font-bold text-primary-foreground">Clear All Filters</Text>
              </Pressable>
            </View>
          }
          ListFooterComponent={
            pagination?.totalPages > 1 ? (
              <View className="flex-row items-center justify-between py-4 border-t border-border mt-2">
                <Pressable
                  disabled={pagination.page <= 1}
                  onPress={() => dispatch(setPage(pagination.page - 1))}
                  className={`rounded-xl border border-border px-4 py-2 ${
                    pagination.page <= 1 ? "opacity-30" : "bg-card"
                  }`}
                >
                  <Text className="text-xs font-bold text-foreground">← Prev</Text>
                </Pressable>
                <Text className="text-xs font-medium text-muted-foreground">
                  Page {pagination.page} of {pagination.totalPages}
                </Text>
                <Pressable
                  disabled={pagination.page >= pagination.totalPages}
                  onPress={() => dispatch(setPage(pagination.page + 1))}
                  className={`rounded-xl border border-border px-4 py-2 ${
                    pagination.page >= pagination.totalPages ? "opacity-30" : "bg-card"
                  }`}
                >
                  <Text className="text-xs font-bold text-foreground">Next →</Text>
                </Pressable>
              </View>
            ) : null
          }
        />
      )}

      {/* Filter Modal */}
      <FilterModal visible={filterModalOpen} onClose={() => setFilterModalOpen(false)} />
    </SafeAreaView>
  );
}
