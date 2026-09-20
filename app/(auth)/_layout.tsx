import { Stack } from "expo-router";

// Mirrors the auth-related entries in Frontend/src/App.jsx's route table:
// /login, /register, /forgot-password, /reset-password, /verify-email.
// Screens themselves are ported in Phase 3 — this is Phase 0's routing
// skeleton plus a working login screen used to smoke-test Phase 1's auth patch.
export default function AuthLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
