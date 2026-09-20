global.__DEV__ = true;
global.nativeModuleProxy = {};

try {
  const TurboModuleRegistry = require("react-native/Libraries/TurboModule/TurboModuleRegistry");
  const origGetEnforcing = TurboModuleRegistry.getEnforcing;
  TurboModuleRegistry.getEnforcing = (name) => {
    if (name === "DeviceInfo") {
      return {
        getConstants: () => ({
          Dimensions: {
            window: { width: 375, height: 812, scale: 2, fontScale: 1 },
            screen: { width: 375, height: 812, scale: 2, fontScale: 1 },
          },
        }),
      };
    }
    try {
      return origGetEnforcing(name);
    } catch {
      return {
        getConstants: () => ({}),
      };
    }
  };
} catch {
  // TurboModuleRegistry not loaded
}

// Mock expo-secure-store
jest.mock("expo-secure-store", () => {
  let store = {};
  return {
    getItemAsync: jest.fn(async (key) => store[key] || null),
    setItemAsync: jest.fn(async (key, value) => {
      store[key] = String(value);
    }),
    deleteItemAsync: jest.fn(async (key) => {
      delete store[key];
    }),
    __resetMockStore: () => {
      store = {};
    },
    __getMockStore: () => store,
  };
});

// Mock expo-router
jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    canGoBack: jest.fn(() => true),
  },
  useLocalSearchParams: jest.fn(() => ({})),
  usePathname: jest.fn(() => "/"),
}));

// Mock @react-native-async-storage/async-storage
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

// Global console suppression for cleaner test output
global.console = {
  ...console,
  // Keep error & warn visible for debug if desired, or mock them
  log: jest.fn(),
  info: jest.fn(),
};
