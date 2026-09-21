import "../global.css";
import { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { ActivityIndicator, View } from "react-native";
import { store } from "../src/redux/store";
import * as SecureStore from "../src/utils/secureStorage";
import { setUser } from "../src/redux/authSlice";
import API from "../src/utils/axiosInstance";
import { USER_API_ENDPOINT } from "../src/utils/endpoints";
import { TOKEN_KEY } from "../src/utils/axiosInstance";

const persistor = persistStore(store);

/**
 * Session bootstrap, mirroring what PersistGate + the web app's initial
 * profile check do together on load. Runs once, before the router mounts
 * any protected route, so app/recruiter/_layout.tsx and app/(tabs) guards
 * can trust store.getState().auth.user immediately (Phase 2/5 of the plan).
 *
 * Confirmed against Backend/routes/user.route.js:
 *   router.route("/profile").get(authenticateToken, (req, res) => {...})
 * — returns { success, user: req.user }, guarded by the same
 * authenticateToken middleware patched in Phase 1. Once that middleware
 * accepts a Bearer token, this call works unmodified.
 */
function SessionBootstrap({ children }: { children: React.ReactNode }) {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const token = await SecureStore.getItemAsync(TOKEN_KEY);
        if (token) {
          const res = await API.get(`${USER_API_ENDPOINT}/profile`);
          store.dispatch(setUser(res.data?.user ?? null));
        }
      } catch {
        // No valid session — fine, user just sees the (auth) group.
      } finally {
        setChecked(true);
      }
    })();
  }, []);

  if (!checked) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator />
      </View>
    );
  }
  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView className="flex-1">
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <SessionBootstrap>
            <Stack screenOptions={{ headerShown: false }} />
          </SessionBootstrap>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
}
