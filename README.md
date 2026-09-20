# FOREWORK Native — Phase 0 Scaffold

This is the Expo/React Native counterpart to `FOREWORK-main/Frontend`, generated
per Phase 0 ("Scope Lock & Environment Setup") of the Web→React Native
migration plan. It is **not runnable end-to-end yet** — it depends on the
Phase 1 backend patch (see below) to authenticate successfully.

## Stack

- Expo SDK 57 (managed workflow), TypeScript
- Expo Router (file-based routing)
- NativeWind v4 (Tailwind classes on native views)
- Redux Toolkit + redux-persist (AsyncStorage) + react-redux
- axios + expo-secure-store

> The original draft plans referenced Expo SDK 51. SDK 51 is no longer the
> current stable release; this scaffold was generated against the latest
> stable SDK (57) available from npm at the time. If your team has a reason
> to pin to SDK 51 (e.g. matching an existing EAS build profile), swap the
> `expo` version and re-run `npx expo install --fix`.

## What's already done (Phase 0)

- Expo Router entry point (`app/`), NativeWind wired through `babel.config.js` /
  `metro.config.js`, Tailwind config and `global.css` **ported with the exact
  HSL token values** from `Frontend/src/index.css` (light + dark themes).
- `@/*` → `./src/*` path alias mirrors `Frontend/vite.config.js`'s alias,
  wired for both TypeScript (`tsconfig.json`) and Metro at runtime
  (`babel-plugin-module-resolver`).
- Copied **verbatim, unchanged**, because they have zero DOM dependency:
  - `src/redux/authSlice.js`, `jobSlice.js`, `companyslice.js`, `applicationSlice.js`
  - `src/utils/filterConstants.js`
  - `src/lib/errors.js`
- `src/redux/store.js` — identical to the web store (same reducers, same
  `authTransform` stripping `pancard`/`adharcard`), with only two changes:
  storage engine is `AsyncStorage` instead of `redux-persist/lib/storage`,
  and a `blacklist: ["job"]` was added (the web store currently has none —
  see the migration plan's Phase 2 rationale).
- `src/utils/endpoints.ts` — consolidates the `BASE_URL` constant that lives
  in two places on web (`utils/data.js` and `utils/axiosInstance.js`) into one.
- `src/utils/axiosInstance.ts` — Bearer token + `X-Client: mobile` header +
  SecureStore + 401 handling via `router.replace()` (replaces
  `services/http.js`'s `window.location` redirect, which has no native
  equivalent).
- `app/_layout.tsx` — Redux `Provider`/`PersistGate`, gesture-handler root,
  and a session-bootstrap call to the **confirmed real** `GET /profile`
  route (`Backend/routes/user.route.js`).
- `app/(auth)/login.tsx` — ported from the real `Login.jsx` request shape
  (`{ email, password, role }`) and role redirect logic.
- `app/(tabs)/` — minimal placeholder proving routing + NativeWind + Redux +
  SecureStore work together (Phase 3 replaces this with the real ported UI).

## What is intentionally NOT done yet (later phases)

- **Phase 1 (backend):** `Backend/middleware/isAuthenticated.js` and
  `Backend/controllers/user.controller.js` still only support cookie auth.
  Until that patch ships, every request from this app will 401. This
  scaffold's `login.tsx` is written to work the moment that patch lands.
- **Phase 3:** the rest of the candidate-facing screens (Jobs, Browse,
  Description/:id, Profile, ApplicationsPage, SavedJobs, JobAlerts,
  Notifications) are not ported yet — only enough exists to smoke-test
  Phases 0–2.
- **Phase 4:** ATS analyzer screens.
- **Phase 5:** `/recruiter/*` tree.
- **Phase 6:** account deletion flow, deep-link verification beyond the
  `app.json` intent filters already scaffolded, and EAS build/store
  submission.
- `/admin/*` (platform admin — Users/Jobs/Companies/Audit Logs) is
  **out of scope** for this app per the Phase 0 scope lock.

## Setup

```bash
cp .env.example .env
npm install
npx expo start
```

Note: `EXPO_PUBLIC_API_URL` must point at a backend that already has the
Phase 1 dual-auth patch applied, or login will fail with 401 even with
valid credentials, because the current `isAuthenticated.js` doesn't yet
accept a Bearer token.
