import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import API from "../../utils/axiosInstance";
import { APPLICATION_API_ENDPOINT } from "../../utils/endpoints";
import Icon from "../common/Icon";

interface ScheduleInterviewModalProps {
  visible: boolean;
  onClose: () => void;
  applicationId: string;
  candidateName?: string;
  currentScheduledAt?: string;
  currentMeetingLink?: string;
  onSuccess?: (updatedApp: any) => void;
}

export const ScheduleInterviewModal: React.FC<ScheduleInterviewModalProps> = ({
  visible,
  onClose,
  applicationId,
  candidateName = "Candidate",
  currentScheduledAt = "",
  currentMeetingLink = "",
  onSuccess,
}) => {
  const [scheduledDate, setScheduledDate] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (visible) {
      if (currentScheduledAt) {
        // Format ISO date to YYYY-MM-DD HH:MM
        try {
          const d = new Date(currentScheduledAt);
          setScheduledDate(d.toISOString().slice(0, 16).replace("T", " "));
        } catch {
          setScheduledDate("");
        }
      } else {
        // Default to tomorrow 10:00 AM
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(10, 0, 0, 0);
        setScheduledDate(tomorrow.toISOString().slice(0, 16).replace("T", " "));
      }
      setMeetingLink(currentMeetingLink || "https://meet.google.com/");
    }
  }, [visible, currentScheduledAt, currentMeetingLink]);

  const handleSchedule = async () => {
    if (!scheduledDate.trim()) {
      Alert.alert("Input Required", "Please enter the interview date and time (YYYY-MM-DD HH:MM).");
      return;
    }

    if (!meetingLink.trim() || !meetingLink.startsWith("http")) {
      Alert.alert("Input Required", "Please provide a valid meeting link (e.g. Google Meet, Zoom).");
      return;
    }

    const parsedDate = new Date(scheduledDate.replace(" ", "T"));
    if (isNaN(parsedDate.getTime())) {
      Alert.alert("Invalid Date", "Please format date as YYYY-MM-DD HH:MM (e.g. 2026-09-25 14:00).");
      return;
    }

    try {
      setSubmitting(true);
      const res = await API.post(
        `${APPLICATION_API_ENDPOINT}/${applicationId}/schedule`,
        {
          scheduledAt: parsedDate.toISOString(),
          meetingLink: meetingLink.trim(),
        }
      );

      if (res.data?.success) {
        Alert.alert(
          "Interview Scheduled",
          `Invitation dispatched to ${candidateName}. The candidate will receive email and in-app conference notifications.`
        );
        onSuccess?.(res.data.data?.application || res.data.application);
        onClose();
      } else {
        Alert.alert("Notice", res.data?.message || "Failed to schedule interview.");
      }
    } catch (err: any) {
      Alert.alert(
        "Error",
        err.response?.data?.message || err.message || "Failed to schedule interview."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/60 justify-end">
        <View className="bg-card rounded-t-3xl border-t border-border p-5 space-y-4">
          {/* Header */}
          <View className="flex-row items-center justify-between pb-3 border-b border-border">
            <View className="flex-row items-center gap-2 flex-1">
              <View className="p-2 rounded-xl bg-primary/10">
                <Icon name="calendar" size={16} color="#6B3AC2" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-black text-foreground">
                  Schedule Interview
                </Text>
                <Text className="text-[11px] text-muted-foreground" numberOfLines={1}>
                  Candidate: {candidateName}
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

          {/* Form */}
          <View className="space-y-3">
            <View className="space-y-1">
              <Text className="text-xs font-bold text-foreground">
                Date & Time (YYYY-MM-DD HH:MM) *
              </Text>
              <TextInput
                value={scheduledDate}
                onChangeText={setScheduledDate}
                placeholder="2026-09-25 14:00"
                placeholderTextColor="#8E8799"
                className="rounded-xl border border-border bg-card p-3 text-xs text-foreground"
              />
              <Text className="text-[10px] text-muted-foreground">
                Enter target session timestamp in 24-hour format
              </Text>
            </View>

            <View className="space-y-1">
              <Text className="text-xs font-bold text-foreground">
                Video Meeting Link *
              </Text>
              <TextInput
                value={meetingLink}
                onChangeText={setMeetingLink}
                placeholder="https://meet.google.com/abc-defg-hij"
                placeholderTextColor="#8E8799"
                autoCapitalize="none"
                keyboardType="url"
                className="rounded-xl border border-border bg-card p-3 text-xs text-foreground"
              />
              <Text className="text-[10px] text-muted-foreground">
                Google Meet, Zoom, Microsoft Teams, or custom URL
              </Text>
            </View>

            <View className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 flex-row items-center gap-2">
              <Icon name="info" size={14} color="#6B3AC2" />
              <Text className="text-[10px] text-primary flex-1 leading-normal">
                Scheduling triggers an automated calendar invitation email and live in-app telemetry notice for the applicant.
              </Text>
            </View>
          </View>

          {/* Actions */}
          <View className="pt-2 flex-row gap-3">
            <Pressable
              onPress={onClose}
              className="flex-1 rounded-xl border border-border bg-card py-3 items-center justify-center"
            >
              <Text className="text-xs font-bold text-foreground">Cancel</Text>
            </Pressable>

            <Pressable
              onPress={handleSchedule}
              disabled={submitting}
              className="flex-1 rounded-xl bg-primary py-3 items-center justify-center shadow-xs"
            >
              {submitting ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text className="text-xs font-bold text-primary-foreground">
                  Send Invitation ✉
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ScheduleInterviewModal;
