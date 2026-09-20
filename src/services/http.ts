/**
 * Ported from Frontend/src/services/http.js.
 *
 * On web, this file does two things: (1) exports unwrapList/unwrapItem/
 * unwrapPagination response-shape normalizers, and (2) registers a response
 * interceptor on the shared `API` instance for error classification (via
 * lib/errors.js's parseApiError) and 401 handling.
 *
 * On native, (2) already lives on src/utils/axiosInstance.ts's own response
 * interceptor — that file owns the single Axios instance end-to-end (Bearer
 * attach + 401 handling), so registering a second interceptor here would
 * double-fire SecureStore.deleteItemAsync/setUser(null)/router.replace on
 * every 401. This file only re-exports (1), unchanged, plus a matching
 * `http` convenience wrapper so screens ported from web need no import-path
 * surprises beyond swapping "@/services/http" for "@/services/http" (same
 * path, just resolved from this project's src/).
 */
import API from "../utils/axiosInstance";

/**
 * Normalizes backend list responses that may be shaped as:
 * { success: true, data: { [key]: [...] } }
 * or { success: true, [key]: [...] }
 * or { data: [...] }
 * or direct array.
 */
export function unwrapList(res: any, key?: string): any[] {
  if (!res) return [];
  const payload = res?.data !== undefined ? res.data : res;
  if (!payload) return [];

  // 1. Direct data[key] or data.data[key]
  if (key && Array.isArray(payload?.[key])) {
    return payload[key];
  }
  if (key && Array.isArray(payload?.data?.[key])) {
    return payload.data[key];
  }

  // 2. Singular/plural tolerance if key provided
  if (key && typeof key === "string") {
    const alternateKey = key.endsWith("s") ? key.slice(0, -1) : `${key}s`;
    if (Array.isArray(payload?.[alternateKey])) {
      return payload[alternateKey];
    }
    if (Array.isArray(payload?.data?.[alternateKey])) {
      return payload.data[alternateKey];
    }
  }

  // 3. Fallback to direct array if payload or payload.data is an array
  if (Array.isArray(payload?.data)) {
    return payload.data;
  }
  if (Array.isArray(payload)) {
    return payload;
  }

  return [];
}

/**
 * Normalizes single item responses:
 * { success: true, data: { [key]: { ... } } }
 * or { success: true, [key]: { ... } }
 */
export function unwrapItem(res: any, key?: string): any {
  if (!res) return null;
  const payload = res?.data !== undefined ? res.data : res;
  if (!payload) return null;

  if (key && payload?.[key] !== undefined) {
    return payload[key];
  }
  if (key && payload?.data?.[key] !== undefined) {
    return payload.data[key];
  }
  if (payload?.data !== undefined) {
    return payload.data;
  }
  return payload;
}

/**
 * Extracts pagination object from API response.
 */
export function unwrapPagination(res: any): any {
  if (!res) return null;
  const payload = res?.data !== undefined ? res.data : res;
  return payload?.pagination || payload?.data?.pagination || null;
}

export const http = {
  get: (url: string, config?: any) => API.get(url, config),
  post: (url: string, data?: any, config?: any) => API.post(url, data, config),
  put: (url: string, data?: any, config?: any) => API.put(url, data, config),
  patch: (url: string, data?: any, config?: any) => API.patch(url, data, config),
  delete: (url: string, config?: any) => API.delete(url, config),
  unwrapList,
  unwrapItem,
  unwrapPagination,
};

export { API };
export default http;
