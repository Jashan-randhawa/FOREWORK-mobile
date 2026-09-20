import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { store } from "../../src/redux/store";
import { setUser } from "../../src/redux/authSlice";
import API, { TOKEN_KEY } from "../../src/utils/axiosInstance";

jest.mock("../../src/redux/store", () => ({
  store: {
    dispatch: jest.fn(),
    getState: jest.fn(() => ({ auth: { user: null } })),
  },
}));

describe("Axios Networking & Dual-Auth Interceptors (TC-AUTH-003, TC-AUTH-005)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    SecureStore.__resetMockStore();
  });

  it("should have TOKEN_KEY defined as 'forework_token'", () => {
    expect(TOKEN_KEY).toBe("forework_token");
  });

  it("should include X-Client: mobile default header in Axios instance", () => {
    expect(API.defaults.headers["X-Client"]).toBe("mobile");
  });

  describe("Request Interceptor (Bearer Token Injection)", () => {
    it("should inject Bearer token into headers when token exists in SecureStore", async () => {
      await SecureStore.setItemAsync(TOKEN_KEY, "jwt_token_abc_123");

      // Extract the request interceptor handler from the Axios instance
      const requestInterceptor = API.interceptors.request.handlers[0];
      const config = { headers: {} };

      const modifiedConfig = await requestInterceptor.fulfilled(config);

      expect(modifiedConfig.headers.Authorization).toBe("Bearer jwt_token_abc_123");
    });

    it("should not set Authorization header when SecureStore has no token", async () => {
      const requestInterceptor = API.interceptors.request.handlers[0];
      const config = { headers: {} };

      const modifiedConfig = await requestInterceptor.fulfilled(config);

      expect(modifiedConfig.headers.Authorization).toBeUndefined();
    });
  });

  describe("Response Interceptor (401 Expiry & Loop Guard)", () => {
    it("should purge SecureStore, reset Redux auth, and redirect on 401 from protected endpoint", async () => {
      await SecureStore.setItemAsync(TOKEN_KEY, "expired_jwt_token");

      const responseInterceptor = API.interceptors.response.handlers[0];
      const error401 = {
        config: { url: "/api/v1/application/get" },
        response: {
          status: 401,
          data: { message: "Session expired", success: false },
        },
      };

      await expect(responseInterceptor.rejected(error401)).rejects.toMatchObject({
        status: 401,
      });

      // Token must be purged from SecureStore
      const remainingToken = await SecureStore.getItemAsync(TOKEN_KEY);
      expect(remainingToken).toBeNull();

      // Redux user must be set to null
      expect(store.dispatch).toHaveBeenCalledWith(setUser(null));

      // Router must redirect to login
      expect(router.replace).toHaveBeenCalledWith("/(auth)/login");
    });

    it("should NOT purge token or redirect when 401 occurs during an auth request (/login)", async () => {
      await SecureStore.setItemAsync(TOKEN_KEY, "some_token");

      const responseInterceptor = API.interceptors.response.handlers[0];
      const authError401 = {
        config: { url: "/api/v1/user/login" },
        response: {
          status: 401,
          data: { message: "Invalid credentials", success: false },
        },
      };

      await expect(responseInterceptor.rejected(authError401)).rejects.toMatchObject({
        status: 401,
      });

      // Token should NOT be deleted
      const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
      expect(storedToken).toBe("some_token");

      // Should NOT dispatch setUser(null) or route away
      expect(store.dispatch).not.toHaveBeenCalled();
      expect(router.replace).not.toHaveBeenCalled();
    });
  });
});
