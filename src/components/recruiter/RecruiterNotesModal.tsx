import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import API from "../../utils/axiosInstance";
import { APPLICATION_API_ENDPOINT } from "../../utils/endpoints";
import Icon from "../common/Icon";

export interface RecruiterNote {
  _id?: string;
  author?: { fullname?: string; email?: string };
  text: string;
  createdAt: string;
}

interface RecruiterNotesModalProps {
  visible: boolean;
  onClose: () => void;
  applicationId: string;
  candidateName?: string;
  existingNotes?: RecruiterNote[];
  onSuccess?: (updatedNotes: RecruiterNote[]) => void;
}

export const RecruiterNotesModal: React.FC<RecruiterNotesModalProps> = ({
  visible,
  onClose,
  applicationId,
  candidateName = "Candidate",
  existingNotes = [],
  onSuccess,
}) => {
  const [noteText, setNoteText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [notes, setNotes] = useState<RecruiterNote[]>(existingNotes);

  React.useEffect(() => {
    setNotes(existingNotes);
  }, [existingNotes]);

  const handleAddNote = async () => {
    if (!noteText.trim()) {
      Alert.alert("Input Required", "Please enter your evaluation note before submitting.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await API.post(`${APPLICATION_API_ENDPOINT}/${applicationId}/notes`, {
        text: noteText.trim(),
      });

      if (res.data?.success) {
        const updated = res.data.data?.recruiterNotes || res.data.recruiterNotes || [];
        setNotes(updated);
        onSuccess?.(updated);
        setNoteText("");
      } else {
        Alert.alert("Notice", res.data?.message || "Failed to add evaluation note.");
      }
    } catch (err: any) {
      Alert.alert(
        "Error",
        err.response?.data?.message || err.message || "Failed to add evaluation note."
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
        <View className="bg-card rounded-t-3xl border-t border-border max-h-[85%] p-5 space-y-4">
          {/* Header */}
          <View className="flex-row items-center justify-between pb-3 border-b border-border">
            <View className="flex-row items-center gap-2 flex-1 pr-2">
              <View className="p-2 rounded-xl bg-primary/10">
                <Icon name="edit" size={16} color="#6B3AC2" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-black text-foreground">
                  Recruiter Notes
                </Text>
                <Text className="text-[11px] text-muted-foreground" numberOfLines={1}>
                  Internal feedback for {candidateName}
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

          {/* Existing Notes List */}
          <ScrollView className="max-h-64 space-y-2.5" showsVerticalScrollIndicator={false}>
            {notes.length > 0 ? (
              notes.map((item, idx) => (
                <View
                  key={item._id || idx}
                  className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-1"
                >
                  <View className="flex-row items-center justify-between">
                    <Text className="text-[11px] font-bold text-primary">
                      {item.author?.fullname || "Recruiter"}
                    </Text>
                    <Text className="text-[10px] text-muted-foreground">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                  <Text className="text-xs text-foreground leading-relaxed">
                    {item.text}
                  </Text>
                </View>
              ))
            ) : (
              <View className="py-6 items-center text-center">
                <Text className="text-xs text-muted-foreground">
                  No evaluation notes recorded yet. Add the first internal feedback below.
                </Text>
              </View>
            )}
          </ScrollView>

          {/* Add Note Input Area */}
          <View className="pt-2 border-t border-border space-y-2.5">
            <Text className="text-xs font-bold text-foreground">
              Add New Note:
            </Text>
            <TextInput
              value={noteText}
              onChangeText={setNoteText}
              placeholder="Record candidate strengths, technical assessment notes, or compensation requirements..."
              placeholderTextColor="#8E8799"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              className="rounded-xl border border-border bg-card p-3 text-xs text-foreground min-h-[70px]"
            />

            <Pressable
              onPress={handleAddNote}
              disabled={submitting}
              className="rounded-xl bg-primary py-3 items-center justify-center shadow-xs"
            >
              {submitting ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text className="text-xs font-bold text-primary-foreground">
                  Save Recruiter Note ✎
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default RecruiterNotesModal;
