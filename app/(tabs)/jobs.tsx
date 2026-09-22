import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  setSearchedQuery,
  setPage,
  clearFilters,
  setSortBy,
} from "../../src/redux/jobSlice";
import useGetAllJobs from "../../src/hooks/useGetAllJobs";
import JobCard from "../../src/components/jobs/JobCard";
import FilterModal from "../../src/components/jobs/FilterModal";
import Icon from "../../src/components/common/Icon";

const QUICK_TRENDING_TAGS = [
  "Remote",
  "React",
  "Node.js",
  "Full-time",
  "Python",
  "Frontend",
  "Backend",
];

const SORT_OPTIONS = [
  { label: "Relevance", value: "relevance" },
  { label: "Newest", value: "newest" },
  { label: "Salary: High to Low", value: "salary_desc" },
  { label: "Salary: Low to High", value: "salary_asc" },
];

export default function JobsScreen() {
  const dispatch = useDispatch();
  const { allJobs, pagination, searchedQuery, filters, sortBy } = useSelector(
    (store: any) => store.job
  );
  const { loading, error, refetch } = useGetAllJobs();
  const [keyword, setKeyword] = useState(searchedQuery || "");
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  const activeFiltersCount = [
    Boolean(filters?.location),
    Boolean(filters?.technology),
    Boolean(filters?.jobType),
    filters?.experienceMin !== "" && filters?.experienceMin !== undefined,
    filters?.salaryMin !== "" && filters?.salaryMin !== undefined,
    Boolean(searchedQuery),
  ].filter(Boolean).length;

  const handleSearchSubmit = () => {
    dispatch(setSearchedQuery(keyword.trim()));
    dispatch(setPage(1));
  };

  const handleQuickTagClick = (tag: string) => {
    setKeyword(tag);
    dispatch(setSearchedQuery(tag));
    dispatch(setPage(1));
  };

  const handleClear = () => {
    dispatch(clearFilters());
    setKeyword("");
  };

  return (
    <SafeAreaView className="flex-1 bg-background" style={{ flex: 1 }}>
      {/* Top Header & Search Area */}
      <View className="px-5 pt-3 pb-3 border-b border-border bg-card">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-xl font-black text-foreground">Explore Positions</Text>
            <Text className="text-xs text-muted-foreground">
              {pagination?.total || allJobs.length} verified opportunities
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
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
        </View>

        {/* Search Bar */}
        <View className="mt-3 flex-row items-center rounded-xl bg-background border border-border px-3 py-1">
          <Icon name="search" size={16} color="#8E8799" />
          <TextInput
            placeholder="Search by title, stack, or company..."
            placeholderTextColor="#8E8799"
            value={keyword}
            onChangeText={setKeyword}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
            className="flex-1 px-3 py-2 text-xs text-foreground"
          />
          {keyword ? (
            <Pressable onPress={() => { setKeyword(""); dispatch(setSearchedQuery("")); }}>
              <Icon name="close" size={14} color="#8E8799" />
            </Pressable>
          ) : null}
        </View>

        {/* Trending Tags Row */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-2.5 flex-row gap-1.5"
        >
          {QUICK_TRENDING_TAGS.map((tag) => (
            <Pressable
              key={tag}
              onPress={() => handleQuickTagClick(tag)}
              className="rounded-full border border-border bg-background px-2.5 py-1 mr-1.5"
            >
              <Text className="text-[10px] text-muted-foreground">#{tag}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Sort & Clear active filters pill bar */}
        <View className="mt-3 flex-row items-center justify-between">
          <Pressable
            onPress={() => setSortDropdownOpen(!sortDropdownOpen)}
            className="flex-row items-center gap-1"
          >
            <Text className="text-xs text-muted-foreground">Sort:</Text>
            <Text className="text-xs font-bold text-primary capitalize">
              {SORT_OPTIONS.find((s) => s.value === sortBy)?.label || "Relevance"} ▼
            </Text>
          </Pressable>

          {activeFiltersCount > 0 && (
            <Pressable onPress={handleClear}>
              <Text className="text-xs font-semibold text-destructive">Clear All</Text>
            </Pressable>
          )}
        </View>

        {/* Sort Dropdown Selector */}
        {sortDropdownOpen && (
          <View className="mt-2 rounded-xl border border-border bg-background p-2">
            {SORT_OPTIONS.map((opt) => (
              <Pressable
                key={opt.value}
                onPress={() => {
                  dispatch(setSortBy(opt.value));
                  setSortDropdownOpen(false);
                }}
                className={`p-2 rounded-lg ${sortBy === opt.value ? "bg-primary/10" : ""}`}
              >
                <Text
                  className={`text-xs ${
                    sortBy === opt.value ? "font-bold text-primary" : "text-foreground"
                  }`}
                >
                  {opt.label}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>

      {/* Main Virtualized Job Listing */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#6B3AC2" />
          <Text className="text-xs text-muted-foreground mt-2">Loading jobs...</Text>
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
          contentContainerStyle={{ padding: 16 }}
          refreshing={loading}
          onRefresh={refetch}
          ListEmptyComponent={
            <View className="py-20 items-center justify-center">
              <Icon name="briefcase" size={36} color="#8E8799" />
              <Text className="text-base font-bold text-foreground mt-2">No Matching Jobs</Text>
              <Text className="text-xs text-muted-foreground mt-1 text-center max-w-xs">
                Try loosening your filters or search for another keyword.
              </Text>
              <Pressable onPress={handleClear} className="mt-4 rounded-xl bg-primary px-4 py-2">
                <Text className="text-xs font-bold text-primary-foreground">View All Jobs</Text>
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
