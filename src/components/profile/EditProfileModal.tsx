import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../redux/authSlice";
import API from "../../utils/axiosInstance";
import { USER_API_ENDPOINT } from "../../utils/endpoints";
import Icon from "../common/Icon";

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ visible, onClose }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((store: any) => store.auth);

  const [fullname, setFullname] = useState(user?.fullname || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [bio, setBio] = useState(user?.profile?.bio || "");
  const [skills, setSkills] = useState(user?.profile?.skills?.join(", ") || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("fullname", fullname.trim());
      formData.append("phoneNumber", phoneNumber.trim());
      formData.append("bio", bio.trim());
      formData.append("skills", skills.trim());

      const res = await API.post(`${USER_API_ENDPOINT}/profile/update`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.success) {
        dispatch(setUser(res.data.user));
        Alert.alert("Success", "Profile updated successfully!");
        onClose();
      }
    } catch (err: any) {
      Alert.alert("Error", err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-row items-center justify-between border-b border-border px-5 py-3">
          <Text className="text-lg font-bold text-foreground">Edit Profile</Text>
          <Pressable onPress={onClose} className="p-2 rounded-full bg-secondary">
            <Icon name="close" size={16} color="#6B3AC2" />
          </Pressable>
        </View>

        <ScrollView className="flex-1 px-5 py-4">
          <View className="mb-4">
            <Text className="text-xs font-bold text-foreground mb-1.5">Full Name</Text>
            <TextInput
              value={fullname}
              onChangeText={setFullname}
              placeholder="Your name"
              placeholderTextColor="#8E8799"
              className="rounded-xl border border-border bg-card px-3.5 py-2.5 text-xs text-foreground"
            />
          </View>

          <View className="mb-4">
            <Text className="text-xs font-bold text-foreground mb-1.5">Phone Number</Text>
            <TextInput
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="+91 9876543210"
              placeholderTextColor="#8E8799"
              keyboardType="phone-pad"
              className="rounded-xl border border-border bg-card px-3.5 py-2.5 text-xs text-foreground"
            />
          </View>

          <View className="mb-4">
            <Text className="text-xs font-bold text-foreground mb-1.5">Bio</Text>
            <TextInput
              value={bio}
              onChangeText={setBio}
              placeholder="Tell recruiters about yourself..."
              placeholderTextColor="#8E8799"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              className="rounded-xl border border-border bg-card px-3.5 py-2.5 text-xs text-foreground min-h-[70px]"
            />
          </View>

          <View className="mb-4">
            <Text className="text-xs font-bold text-foreground mb-1.5">Skills (comma separated)</Text>
            <TextInput
              value={skills}
              onChangeText={setSkills}
              placeholder="React, TypeScript, Node.js, Python"
              placeholderTextColor="#8E8799"
              className="rounded-xl border border-border bg-card px-3.5 py-2.5 text-xs text-foreground"
            />
            <Text className="text-[10px] text-muted-foreground mt-1">
              Separate each technical skill with a comma
            </Text>
          </View>
        </ScrollView>

        <View className="flex-row items-center gap-3 border-t border-border px-5 py-4 bg-background">
          <Pressable
            onPress={onClose}
            className="flex-1 items-center justify-center rounded-xl border border-border bg-card py-3"
          >
            <Text className="text-xs font-semibold text-foreground">Cancel</Text>
          </Pressable>
          <Pressable
            onPress={handleSave}
            disabled={loading}
            className="flex-1 items-center justify-center rounded-xl bg-primary py-3 shadow-md"
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text className="text-xs font-bold text-primary-foreground">Save Changes</Text>
            )}
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default EditProfileModal;
