import React from "react";
import {
  Modal,
  View,
  Text,
  ScrollView,
  Pressable,
  SafeAreaView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  setFilter,
  clearFilters,
} from "../../redux/jobSlice";
import {
  LOCATIONS,
  TECHNOLOGIES,
  JOB_TYPES,
  EXPERIENCE_RANGES,
  SALARY_RANGES,
} from "../../utils/filterConstants";
import Icon from "../common/Icon";

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({ visible, onClose }) => {
  const dispatch = useDispatch();
  const filters = useSelector((state: any) => state.job.filters);

  const handleSelectLocation = (loc: string) => {
    dispatch(setFilter({ key: "location", value: filters.location === loc ? "" : loc }));
  };

  const handleSelectTech = (tech: string) => {
    dispatch(setFilter({ key: "technology", value: filters.technology === tech ? "" : tech }));
  };

  const handleSelectJobType = (type: string) => {
    dispatch(setFilter({ key: "jobType", value: filters.jobType === type ? "" : type }));
  };

  const handleSelectExp = (range: { min: any; max: any }) => {
    const isSame = filters.experienceMin === range.min && filters.experienceMax === range.max;
    dispatch(
      setFilter({
        experienceMin: isSame ? "" : range.min,
        experienceMax: isSame ? "" : range.max,
      })
    );
  };

  const handleSelectSalary = (range: { min: any; max: any }) => {
    const isSame = filters.salaryMin === range.min && filters.salaryMax === range.max;
    dispatch(
      setFilter({
        salaryMin: isSame ? "" : range.min,
        salaryMax: isSame ? "" : range.max,
      })
    );
  };

  const handleClearAll = () => {
    dispatch(clearFilters());
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView className="flex-1 bg-background">
        {/* Header */}
        <View className="flex-row items-center justify-between border-b border-border px-5 py-3">
          <Text className="text-lg font-bold text-foreground">Filter Jobs</Text>
          <Pressable onPress={onClose} className="p-2 rounded-full bg-secondary">
            <Icon name="close" size={16} color="#6B3AC2" />
          </Pressable>
        </View>

        <ScrollView className="flex-1 px-5 py-4">
          {/* Location */}
          <Text className="text-sm font-bold text-foreground mb-2">Location</Text>
          <View className="flex-row flex-wrap gap-2 mb-5">
            {LOCATIONS.map((loc) => {
              const active = filters.location === loc;
              return (
                <Pressable
                  key={loc}
                  onPress={() => handleSelectLocation(loc)}
                  className={`rounded-full px-3 py-1.5 border ${
                    active ? "bg-primary border-primary" : "bg-card border-border"
                  }`}
                >
                  <Text className={`text-xs font-medium ${active ? "text-primary-foreground" : "text-foreground"}`}>
                    {loc}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Job Type */}
          <Text className="text-sm font-bold text-foreground mb-2">Job Type</Text>
          <View className="flex-row flex-wrap gap-2 mb-5">
            {JOB_TYPES.map((type) => {
              const active = filters.jobType === type;
              return (
                <Pressable
                  key={type}
                  onPress={() => handleSelectJobType(type)}
                  className={`rounded-full px-3 py-1.5 border ${
                    active ? "bg-primary border-primary" : "bg-card border-border"
                  }`}
                >
                  <Text className={`text-xs font-medium ${active ? "text-primary-foreground" : "text-foreground"}`}>
                    {type}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Technology */}
          <Text className="text-sm font-bold text-foreground mb-2">Technology / Role</Text>
          <View className="flex-row flex-wrap gap-2 mb-5">
            {TECHNOLOGIES.map((tech) => {
              const active = filters.technology === tech;
              return (
                <Pressable
                  key={tech}
                  onPress={() => handleSelectTech(tech)}
                  className={`rounded-full px-3 py-1.5 border ${
                    active ? "bg-primary border-primary" : "bg-card border-border"
                  }`}
                >
                  <Text className={`text-xs font-medium ${active ? "text-primary-foreground" : "text-foreground"}`}>
                    {tech}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Experience Ranges */}
          <Text className="text-sm font-bold text-foreground mb-2">Experience</Text>
          <View className="flex-row flex-wrap gap-2 mb-5">
            {EXPERIENCE_RANGES.map((range) => {
              const active = filters.experienceMin === range.min && filters.experienceMax === range.max;
              return (
                <Pressable
                  key={range.label}
                  onPress={() => handleSelectExp(range)}
                  className={`rounded-full px-3 py-1.5 border ${
                    active ? "bg-primary border-primary" : "bg-card border-border"
                  }`}
                >
                  <Text className={`text-xs font-medium ${active ? "text-primary-foreground" : "text-foreground"}`}>
                    {range.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Salary Ranges */}
          <Text className="text-sm font-bold text-foreground mb-2">Salary Band</Text>
          <View className="flex-row flex-wrap gap-2 mb-8">
            {SALARY_RANGES.map((range) => {
              const active = filters.salaryMin === range.min && filters.salaryMax === range.max;
              return (
                <Pressable
                  key={range.label}
                  onPress={() => handleSelectSalary(range)}
                  className={`rounded-full px-3 py-1.5 border ${
                    active ? "bg-primary border-primary" : "bg-card border-border"
                  }`}
                >
                  <Text className={`text-xs font-medium ${active ? "text-primary-foreground" : "text-foreground"}`}>
                    {range.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        {/* Footer Actions */}
        <View className="flex-row items-center gap-3 border-t border-border px-5 py-4 bg-background">
          <Pressable
            onPress={handleClearAll}
            className="flex-1 items-center justify-center rounded-xl border border-border bg-card py-3"
          >
            <Text className="text-sm font-semibold text-foreground">Clear All</Text>
          </Pressable>
          <Pressable
            onPress={onClose}
            className="flex-1 items-center justify-center rounded-xl bg-primary py-3 shadow-md"
          >
            <Text className="text-sm font-bold text-primary-foreground">Apply Filters</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default FilterModal;
