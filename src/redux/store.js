import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import jobReducer from "./jobSlice";
import companyReducer from "./companyslice";
import applicationSlice from "./applicationSlice";

import {
  persistReducer,
  createTransform,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
// ONLY CHANGE vs. Frontend/src/redux/store.js: AsyncStorage replaces
// redux-persist/lib/storage (which is backed by window.localStorage and
// does not exist in React Native).
import AsyncStorage from "@react-native-async-storage/async-storage";

// Ported verbatim: strips PAN/Aadhaar before persisting auth state to device
// storage. Identical logic on web and native — only the storage engine differs.
const authTransform = createTransform(
  (inboundState) => {
    if (inboundState?.user) {
      const safeUser = { ...inboundState.user };
      delete safeUser.pancard;
      delete safeUser.adharcard;
      return {
        ...inboundState,
        user: safeUser,
      };
    }
    return inboundState;
  },
  (outboundState) => outboundState,
  { whitelist: ["auth"] }
);

const persistConfig = {
  key: "root",
  version: 1,
  storage: AsyncStorage,
  transforms: [authTransform],
  // NEW for native (see Phase 2 of the migration plan): the web store has no
  // blacklist today. On native, AsyncStorage rehydration is asynchronous and
  // happens after the JS bundle is already rendering, so a stale `job`
  // slice (search filters/results from a previous session) can flash on
  // cold start. Blacklisting it forces a fresh fetch every launch instead.
  blacklist: ["job"],
};

const rootReducer = combineReducers({
  auth: authReducer,
  job: jobReducer,
  jobs: jobReducer,
  company: companyReducer,
  application: applicationSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export default store;
