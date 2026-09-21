/**
 * Replaces (for native only — the web files are untouched):
 *   - Frontend/src/utils/axiosInstance.js  (was: withCredentials + cookie auth)
 *   - Frontend/src/services/http.js's response interceptor (401 handling +
 *     window.location redirect, which has no native equivalent)
 *
 * Depends on the Phase 1 backend patch to Backend/middleware/isAuthenticated.js
 * and Backend/controllers/user.controller.js (Bearer-token fallback + 30-day
 * mobile token + X-Client header branch). Until that patch ships, requests
 * from this client will 401 on every call except where the cookie happens to
 * also be present.
 */
import axios from "axios";
import * as SecureStore from "./secureStorage";
import { router } from "expo-router";
import { store } from "../redux/store";
import { setUser } from "../redux/authSlice";
import { BASE_URL } from "./endpoints";
import { parseApiError } from "../lib/errors";

export const TOKEN_KEY = "forework_token";

const API = axios.create({
  baseURL: BASE_URL,
  headers: {
    // Tells Backend/controllers/user.controller.js's login handler to issue
    // a 30-day token instead of the web default of 1 day, and tells
    // Backend/middleware/isAuthenticated.js this request may carry a
    // Bearer token instead of (or in addition to) a cookie.
    "X-Client": "mobile",
  },
});

API.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Ported from Frontend/src/services/http.js: classify/sanitize every
    // error through the same lib/errors.js logic before it reaches a
    // screen's catch block, so components see a normalized ApiError
    // (status/code/message) instead of a raw Axios error either way.
    const normalized = parseApiError(error);

    if (normalized.status === 401) {
      // Mirrors http.js's isAuthRequest check: a 401 from the login/
      // register/forgot-password/reset-password endpoints themselves is an
      // expected auth-flow failure, not an expired session — don't clear
      // the (already-empty) session or bounce the user away from the
      // screen they're actively trying to authenticate on. There's no
      // native equivalent of http.js's window.pathname "already on an
      // auth screen" check, so this URL check is the sole loop guard here.
      const requestUrl = error?.config?.url || "";
      const isAuthRequest =
        requestUrl.includes("/login") ||
        requestUrl.includes("/register") ||
        requestUrl.includes("/forgot-password") ||
        requestUrl.includes("/reset-password");

      if (!isAuthRequest) {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        // Mirrors services/http.js dispatching setUser(null) on the web —
        // same action, same slice.
        store.dispatch(setUser(null));
        // Mirrors services/http.js's window.location.href redirect — the
        // native equivalent is an expo-router navigation, not a browser nav.
        router.replace("/(auth)/login");
      }
    }

    return Promise.reject(normalized);
  }
);

export default API;
