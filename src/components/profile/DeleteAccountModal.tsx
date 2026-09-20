import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import * as SecureStore from "expo-secure-store";
import API from "../../utils/axiosInstance";
import { USER_API_ENDPOINT } from "../../utils/endpoints";
import { TOKEN_KEY } from "../../utils/axiosInstance";
import { setUser } from "../../redux/authSlice";
import Icon from "../common/Icon";

interface DeleteAccountModalProps {
  visible: boolean;
  onClose: () => void;
}

export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  visible,
  onClose,
}) => {
  const dispatch = useDispatch();
  const { user } = useSelector((store: any) => store.auth);

  const [confirmText, setConfirmText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isConfirmationMatched = confirmText.trim().toUpperCase() === "DELETE";

  const handleDeleteAccount = async () => {
    if (!isConfirmationMatched) {
      Alert.alert(
        "Confirmation Required",
        'Please type "DELETE" in the text field to confirm permanent account deletion.'
      );
      return;
    }

    Alert.alert(
      "Final Confirmation",
      "Are you absolutely certain? This will immediately wipe your account, resumes, and telemetry forever.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete Forever",
          style: "destructive",
          onPress: executeDeletion,
        },
      ]
    );
  };

  const executeDeletion = async () => {
    try {
      setSubmitting(true);
      const res = await API.delete(`${USER_API_ENDPOINT}/account`);

      if (res.data?.success) {
        // 1. Purge SecureStore persistent token
        await SecureStore.deleteItemAsync(TOKEN_KEY);

        // 2. Clear Redux auth state
        dispatch(setUser(null));

        Alert.alert(
          "Account Deleted",
          "Your account and all associated personal data have been completely removed from FOREWORK."
        );

        onClose();
        router.replace("/(auth)/login" as any);
      } else {
        Alert.alert("Notice", res.data?.message || "Could not complete account deletion.");
      }
    } catch (err: any) {
      Alert.alert(
        "Deletion Failed",
        err.response?.data?.message ||
          err.message ||
          "An error occurred while processing account deletion."
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
            <View className="flex-row items-center gap-2 flex-1 pr-2">
              <View className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950/60 border border-rose-300">
                <Icon name="alert" size={16} color="#DC2626" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-black text-rose-600 dark:text-rose-400">
                  Delete Account & Data
                </Text>
                <Text className="text-[11px] text-muted-foreground">
                  Permanent data erasure (Apple Guideline 5.1.1(v))
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

          {/* Warning Narrative */}
          <View className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 space-y-2">
            <Text className="text-xs font-bold text-rose-800 dark:text-rose-300">
              Warning: This action cannot be reversed!
            </Text>
            <Text className="text-[11px] text-rose-700 dark:text-rose-400 leading-relaxed">
              Deleting your account will immediately and permanently erase:
            </Text>
            <View className="space-y-1 pl-1">
              <Text className="text-[11px] text-rose-700 dark:text-rose-400">
                • Your profile, email ({user?.email}), and KYC records
              </Text>
              <Text className="text-[11px] text-rose-700 dark:text-rose-400">
                • Uploaded resume documents and ATS analysis scans
              </Text>
              <Text className="text-[11px] text-rose-700 dark:text-rose-400">
                • Active job applications and interview invitations
              </Text>
              {user?.role === "Recruiter" && (
                <Text className="text-[11px] text-rose-700 dark:text-rose-400">
                  • Registered companies and active job vacancy postings
                </Text>
              )}
            </View>
          </View>

          {/* Verification Input */}
          <View className="space-y-1.5 pt-1">
            <Text className="text-xs font-bold text-foreground">
              Type <Text className="font-black text-rose-600">DELETE</Text> to confirm:
            </Text>
            <TextInput
              value={confirmText}
              onChangeText={setConfirmText}
              placeholder="DELETE"
              placeholderTextColor="#8E8799"
              autoCapitalize="characters"
              className="rounded-xl border border-border bg-card p-3.5 text-xs text-foreground font-mono"
            />
          </View>

          {/* Action Buttons */}
          <View className="pt-2 flex-row gap-3">
            <Pressable
              onPress={onClose}
              className="flex-1 rounded-xl border border-border bg-card py-3.5 items-center justify-center"
            >
              <Text className="text-xs font-bold text-foreground">Cancel</Text>
            </Pressable>

            <Pressable
              onPress={handleDeleteAccount}
              disabled={!isConfirmationMatched || submitting}
              className={`flex-1 rounded-xl py-3.5 items-center justify-center shadow-xs ${
                isConfirmationMatched && !submitting
                  ? "bg-rose-600"
                  : "bg-muted"
              }`}
            >
              {submitting ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text
                  className={`text-xs font-bold ${
                    isConfirmationMatched ? "text-white" : "text-muted-foreground"
                  }`}
                >
                  Permanently Delete ✕
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DeleteAccountModal;
