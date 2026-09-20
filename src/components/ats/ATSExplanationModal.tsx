import React from "react";
import { View, Text, Modal, Pressable, ScrollView } from "react-native";
import Icon from "../common/Icon";

interface ATSExplanationModalProps {
  visible: boolean;
  onClose: () => void;
  score?: number;
  explanation?: string;
  breakdownReasons?: Record<string, string>;
}

export const ATSExplanationModal: React.FC<ATSExplanationModalProps> = ({
  visible,
  onClose,
  score = 0,
  explanation = "",
  breakdownReasons = {},
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/60 justify-end">
        <View className="bg-card rounded-t-3xl border-t border-border max-h-[85%] p-5 space-y-4">
          {/* Header */}
          <View className="flex-row items-center justify-between pb-3 border-b border-border">
            <View className="flex-row items-center gap-2 flex-1">
              <View className="p-2 rounded-xl bg-primary/10">
                <Icon name="help" size={16} color="#6B3AC2" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-black text-foreground">
                  Why is my score {score}/100?
                </Text>
                <Text className="text-[11px] text-muted-foreground">
                  Deterministic mathematical derivation
                </Text>
              </View>
            </View>

            <Pressable
              onPress={onClose}
              className="w-8 h-8 rounded-full bg-muted/40 items-center justify-center"
            >
              <Icon name="x" size={14} color="#8E8799" />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} className="space-y-4">
            {/* Executive Statement */}
            <View className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 space-y-1">
              <Text className="text-xs font-bold text-primary">
                Executive Evaluation Summary:
              </Text>
              <Text className="text-xs text-foreground leading-relaxed">
                {explanation ||
                  `Your resume was evaluated against FOREWORK's deterministic 6-category ATS rubric resulting in an overall score of ${score}/100.`}
              </Text>
            </View>

            {/* Metric Explanations */}
            <View className="space-y-2.5">
              <Text className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Category Derivations
              </Text>

              {Object.keys(breakdownReasons).length > 0 ? (
                Object.entries(breakdownReasons).map(([category, reason]) => (
                  <View
                    key={category}
                    className="p-3 rounded-xl border border-border bg-muted/20 space-y-1"
                  >
                    <Text className="text-xs font-bold capitalize text-foreground">
                      {category.replace("_", " ")}
                    </Text>
                    <Text className="text-[11px] text-muted-foreground leading-snug">
                      {reason}
                    </Text>
                  </View>
                ))
              ) : (
                <View className="p-3 rounded-xl border border-border bg-muted/20">
                  <Text className="text-xs text-muted-foreground">
                    Detailed category breakdowns are calculated during full analysis.
                  </Text>
                </View>
              )}
            </View>

            {/* Disclaimer */}
            <View className="p-3 rounded-xl bg-muted/30 border border-border flex-row items-start gap-2 mb-6">
              <Icon name="info" size={14} color="#8E8799" />
              <Text className="text-[10px] text-muted-foreground flex-1 leading-normal">
                FOREWORK scores are deterministic optimization indicators designed to help candidates format and tailor applications. Different employer ATS software may employ varied parsing heuristics.
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default ATSExplanationModal;
