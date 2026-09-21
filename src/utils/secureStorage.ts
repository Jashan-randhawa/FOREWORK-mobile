import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const isWeb = () => {
  try {
    if (typeof Platform !== "undefined" && Platform?.OS === "web") {
      return true;
    }
  } catch {
    // ignore
  }
  return false;
};

/**
 * Cross-platform storage wrapper:
 * - On Native (iOS/Android): uses hardware-backed encrypted expo-secure-store.
 * - On Web: expo-secure-store has no web implementation and throws
 *   `getValueWithKeyAsync is not a function`. We use window.localStorage on web.
 */
export const getItemAsync = async (key: string): Promise<string | null> => {
  if (isWeb()) {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch {
      // Ignore security errors in sandboxed iframes/browsers
    }
    return null;
  }
  return SecureStore.getItemAsync(key);
};

export const setItemAsync = async (key: string, value: string): Promise<void> => {
  if (isWeb()) {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch {
      // Ignore
    }
    return;
  }
  return SecureStore.setItemAsync(key, value);
};

export const deleteItemAsync = async (key: string): Promise<void> => {
  if (isWeb()) {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch {
      // Ignore
    }
    return;
  }
  return SecureStore.deleteItemAsync(key);
};

export const __resetMockStore = () => {
  if (typeof (SecureStore as any).__resetMockStore === "function") {
    (SecureStore as any).__resetMockStore();
  }
};

export default {
  getItemAsync,
  setItemAsync,
  deleteItemAsync,
};
