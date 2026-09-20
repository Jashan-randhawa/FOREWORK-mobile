/**
 * Ported from Frontend/src/utils/data.js.
 *
 * On web, this file and axiosInstance.js each independently derive their own
 * base URL (Frontend/src/utils/data.js's `BASE` vs. axiosInstance.js's
 * `baseURL` option) — that duplication is exactly what Phase 2 of the
 * migration plan calls out to fix. Here there is exactly ONE base URL
 * constant, consumed by both this file and src/utils/axiosInstance.ts.
 *
 * import.meta.env.VITE_API_URL (Vite/web) becomes
 * process.env.EXPO_PUBLIC_API_URL (Expo) — EXPO_PUBLIC_ is the required
 * prefix for any env var Expo should inline into the client bundle.
 */
export const BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:5011";

export const USER_API_ENDPOINT = `${BASE_URL}/api/user`;
export const JOB_API_ENDPOINT = `${BASE_URL}/api/job`;
export const APPLICATION_API_ENDPOINT = `${BASE_URL}/api/application`;
export const COMPANY_API_ENDPOINT = `${BASE_URL}/api/company`;
export const NOTIFICATION_API_END_POINT = `${BASE_URL}/api/notification`;
export const ATS_API_ENDPOINT = `${BASE_URL}/api/ats`;

// ADMIN_API_ENDPOINT (platform /admin/* tree) intentionally NOT exported here —
// the platform admin surface is explicitly out of scope for the mobile app
// (see Phase 0 scope lock / Phase 5 of the migration plan).
