<p align="center">
  <img src="./assets/banner.svg" alt="FOREWORK Mobile Banner" width="100%">
</p>

<p align="center">
  <a href="https://github.com/Jashan-randhawa/FOREWORK-mobile/releases/tag/v1.0.0"><img src="https://img.shields.io/badge/Release-v1.0.0-8B5CF6?style=for-the-badge&logo=github&logoColor=white" alt="Release v1.0.0"></a>
  <a href="https://expo.dev"><img src="https://img.shields.io/badge/Expo-SDK_57-000000?style=for-the-badge&logo=expo&logoColor=white" alt="Expo SDK 57"></a>
  <a href="https://reactnative.dev"><img src="https://img.shields.io/badge/React_Native-0.86-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React Native 0.86"></a>
  <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-6.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"></a>
  <a href="https://nativewind.dev"><img src="https://img.shields.io/badge/NativeWind-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="NativeWind v4"></a>
  <a href="#-quality-assurance--testing"><img src="https://img.shields.io/badge/Tests-39%2F39_Passing-10B981?style=for-the-badge&logo=jest&logoColor=white" alt="Tests"></a>
</p>

<p align="center">
  <b><a href="https://forework-mobile.vercel.app">🌐 Live Demo</a></b> •
  <b><a href="https://github.com/Jashan-randhawa/FOREWORK-mobile/releases/tag/v1.0.0">🚀 v1.0.0 Release</a></b> •
  <b><a href="#-core-features">✨ Features</a></b> •
  <b><a href="#-ats-resume-intelligence-engine">🧠 ATS Engine</a></b> •
  <b><a href="#-system-architecture">🏛️ Architecture</a></b> •
  <b><a href="#-quick-start">🚀 Quick Start</a></b> •
  <b><a href="#-eas-build--store-deployment">📦 Deployment</a></b>
</p>

---

## ⚡ What is FOREWORK Mobile?

**FOREWORK Mobile** is an enterprise-grade, cross-platform recruitment and career acceleration application for **iOS**, **Android**, and **Web**. Built on **Expo SDK 57** with **React Native 0.86** and full **TypeScript** coverage, it unites a feature-complete candidate job-hunting experience with a role-gated **Recruiter Management Cockpit** and a deterministic **100-Point ATS Resume Intelligence Engine** — all in a single codebase that runs natively on device and as a PWA on Vercel.

> 🔗 **Live on the web:** [forework-mobile.vercel.app](https://forework-mobile.vercel.app)
> 📦 **Latest release:** [v1.0.0 — Initial Public Release](https://github.com/Jashan-randhawa/FOREWORK-mobile/releases/tag/v1.0.0)

---

## 🎯 Core Features

| 👤 Candidate Career Hub | 🏢 Recruiter Management Cockpit |
|---|---|
| **Curated Discovery Feed** — Latest vacancies, verified company openings, trending tech specializations | **Role-Gated Security** — Strict `RecruiterGuard` barrier isolating employer tooling from candidate accounts |
| **Parametric Search & Filter Drawer** — Filter by location, job type (Full-time, Contract, Remote), salary range, and experience | **Real-Time KPI Dashboard** — Active vacancies, applicant volumes, and pending reviews |
| **Embedded Pre-Apply ATS Diagnostic** — Test resume compatibility on the job detail screen before submitting | **Company Branding** — Register organizations, configure logos, website links, and location metadata |
| **1-Click Application Flow** — Instant dispatch using stored profile resume with live status reflection | **Vacancy Lifecycle Controls** — 1-tap toggling between `published`, `paused`, and `closed` |
| **Status Telemetry** — Track review states: `In Review`, `Accepted`, `Rejected` with colour-coded badges | **Applicant CRM** — 1-tap Accept/Reject pipeline with automated candidate notification alerts |
| **Saved Jobs & Job Alerts** — Bookmark jobs; subscribe to keyword/location push alert notifications | **Virtual Interview Scheduler** — Set times, attach Google Meet/Zoom URLs, notify candidates |
| **Dynamic Profile Strength Meter** — Interactive 0–100% progress bar with in-app bio, contact, and skills editor | **Internal Notes** — Private recruiter collaboration log with author attribution and timestamping |
| **Standalone ATS Scanner** — Upload any resume against any JD for a full 100-point diagnostic | **Job Analytics Modal** — Applicant funnel, time-to-fill, and per-stage conversion rates |

---

## 🧠 ATS Resume Intelligence Engine

FOREWORK Mobile integrates a **deterministic 100-point scoring algorithm** that simulates enterprise ATS parsers (Workday, Greenhouse, Lever) — runs entirely client-side, no backend ML required.

### Scoring Breakdown

| Dimension | Points | What it measures |
|---|---|---|
| **Keyword Match** | 40 pts | Resume vs. JD keyword overlap (matched / missing skills) |
| **Formatting Parseability** | 30 pts | Tables, columns, images, special characters that trip parsers |
| **Section Completeness** | 20 pts | Presence of Experience, Education, Skills, Contact sections |
| **File Compatibility** | 10 pts | File format, encoding, and ATS ingestion risk |
| **Total** | **100 pts** | |

### ATS Component Map

| Component | File | Role |
|---|---|---|
| `ATSScoreGauge` | `src/components/ats/ATSScoreGauge.tsx` | Animated arc gauge — colour tiers: 🔴 < 50 · 🟡 50–74 · 🟢 ≥ 75 |
| `SkillMatchView` | `src/components/ats/SkillMatchView.tsx` | Matched ✅ vs. missing ❌ keyword visualisation |
| `ScoreBreakdownView` | `src/components/ats/ScoreBreakdownView.tsx` | Category-by-category point breakdown with progress bars |
| `FormattingIssuesView` | `src/components/ats/FormattingIssuesView.tsx` | List of detected formatting problems with severity |
| `RecommendationsView` | `src/components/ats/RecommendationsView.tsx` | Actionable improvement tips ordered by impact |
| `ATSExplanationModal` | `src/components/ats/ATSExplanationModal.tsx` | Educational modal explaining the scoring methodology |
| `JobDetailATSCheck` | `src/components/ats/JobDetailATSCheck.tsx` | Inline pre-apply ATS check embedded in job description screen |
| `ATSApplicantModal` | `src/components/recruiter/ATSApplicantModal.tsx` | Recruiter-side view of each applicant's ATS score |

> **API Endpoint:** `EXPO_PUBLIC_API_URL/api/ats`

---

## 🏛️ System Architecture

```
FOREWORK Mobile
├── app/                          # Expo Router — all screens (file = route)
│   ├── _layout.tsx               # Root layout: Redux Provider + PersistGate
│   ├── (auth)/                   # Auth group (unauthenticated)
│   │   ├── login.tsx             # JWT login with secure token storage
│   │   ├── register.tsx          # Registration with Candidate / Recruiter role
│   │   ├── forgot-password.tsx   # Password reset email dispatch
│   │   ├── reset-password.tsx    # Token-based password reset
│   │   └── verify-email.tsx      # OTP email verification
│   ├── (tabs)/                   # Main bottom-tab navigation
│   │   ├── index.tsx             # Home feed — curated job discovery
│   │   ├── browse.tsx            # Parametric search + filter drawer
│   │   ├── jobs.tsx              # Full job listing with pagination
│   │   └── profile.tsx           # Profile strength meter + editor
│   ├── recruiter/                # Role-gated recruiter cockpit
│   │   ├── dashboard.tsx         # KPI cockpit
│   │   ├── jobs.tsx              # Job listing + lifecycle toggle
│   │   ├── create-job.tsx        # Rich job posting form
│   │   ├── create-company.tsx    # Company registration
│   │   ├── companies.tsx         # Company directory
│   │   ├── company/[id].tsx      # Company detail & editor
│   │   └── job/[id]/
│   │       └── applicants.tsx    # Applicant CRM + Accept/Reject
│   ├── description/[id].tsx      # Job detail + embedded ATS check
│   ├── ats.tsx                   # Standalone 100-pt ATS scanner
│   ├── applications.tsx          # Application status tracker
│   ├── saved-jobs.tsx            # Bookmarked jobs
│   ├── job-alerts.tsx            # Push alert subscriptions
│   ├── notifications.tsx         # Notification centre
│   ├── about.tsx                 # About FOREWORK
│   ├── privacy-policy.tsx        # Privacy policy
│   ├── terms-of-service.tsx      # Terms of service
│   └── suspended.tsx             # Account suspension notice
│
├── src/
│   ├── components/
│   │   ├── ats/                  # 6 ATS UI widgets
│   │   ├── jobs/                 # JobCard · FilterModal
│   │   ├── profile/              # EditProfileModal · DeleteAccountModal
│   │   ├── recruiter/            # RecruiterGuard · JobLifecycleBadge
│   │   │                         # JobAnalyticsModal · ScheduleInterviewModal
│   │   │                         # RecruiterNotesModal · ATSApplicantModal
│   │   ├── navigation/           # TabBarIcon
│   │   └── common/               # Icon
│   ├── redux/
│   │   ├── store.js              # Redux-Persist + AsyncStorage + authTransform
│   │   ├── authSlice.js          # { user, loading } — PAN/Aadhaar stripped on persist
│   │   ├── jobSlice.js           # Jobs, filters, pagination, sort
│   │   ├── companySlice.js       # Companies + single company
│   │   └── applicationSlice.js   # Applied jobs list
│   ├── hooks/
│   │   ├── useGetAllJobs.ts      # Paginated job fetch with filter/sort params
│   │   ├── useGetAllAdminJobs.ts # Recruiter-scoped job fetch
│   │   ├── useGetAllAppliedJobs.ts
│   │   ├── useGetAllCompanies.ts
│   │   └── useGetCompanyById.ts
│   ├── services/
│   │   └── http.ts               # Thin wrapper around axiosInstance for typed requests
│   ├── utils/
│   │   ├── axiosInstance.ts      # Axios + Bearer token injector + 401 → login redirect
│   │   ├── endpoints.ts          # Centralised API URL constants
│   │   ├── secureStorage.ts      # expo-secure-store (native) / localStorage (web)
│   │   └── filterConstants.js    # Job type / location / experience filter options
│   ├── lib/
│   │   └── errors.js             # parseApiError() — normalises AxiosError → ApiError
│   └── types/
│       └── css.d.ts              # CSS module declarations
│
├── __tests__/                    # Jest 29 — 39/39 passing
│   ├── ats/atsEngine.test.js
│   ├── components/DeleteAccountModal.test.js
│   ├── components/RecruiterGuard.test.js
│   ├── redux/applicationSlice.test.js
│   ├── redux/authSlice.test.js
│   ├── redux/companySlice.test.js
│   ├── redux/jobSlice.test.js
│   └── utils/axiosInstance.test.js
│
└── .github/workflows/
    └── build-apk.yml             # CI: GitHub Actions Android APK builder
```

---

## 🔧 Key Technical Details

### Authentication & Token Flow
- Login issues a **JWT Bearer token** stored in `expo-secure-store` (native) or `localStorage` (web) under key `forework_token`
- Every outbound request gets the token injected via an **Axios request interceptor** (`X-Client: mobile` header triggers a 30-day token lifetime on the backend vs. the web default of 1 day)
- A **response interceptor** catches `401` errors, clears the token, resets Redux auth state, and redirects to `/(auth)/login` — mirroring the web `http.js` session handling

### Redux State & Persistence
- **`redux-persist`** backed by `@react-native-async-storage/async-storage`
- **`authTransform`** strips PAN/Aadhaar card numbers before writing auth state to device storage
- **`job` slice is blacklisted** from persistence — forces a fresh server fetch on every cold start to avoid stale filter flash

### API Endpoints (all relative to `EXPO_PUBLIC_API_URL`)
| Slice | Endpoint |
|---|---|
| Users / Auth | `/api/user` |
| Jobs | `/api/job` |
| Applications | `/api/application` |
| Companies | `/api/company` |
| Notifications | `/api/notification` |
| ATS Engine | `/api/ats` |

### Cross-Platform Storage (`secureStorage.ts`)
Wraps `expo-secure-store` on native and falls back to `localStorage` on web so token storage works identically across all three platforms.

### RecruiterGuard
All recruiter-scoped screens are wrapped in `RecruiterGuard` (`src/components/recruiter/RecruiterGuard.tsx`). It reads the Redux `auth.user.role` and hard-blocks any non-recruiter account from rendering the employer UI — redirecting back to the candidate home.

### Error Normalisation (`lib/errors.js`)
`parseApiError()` converts raw Axios errors into a typed `ApiError` `{ status, code, message }` object consumed by every screen's `catch` block, ensuring consistent error UX across the app.

---

## 🗺️ Screen & Route Reference

| Route | Screen | Auth | Role |
|---|---|---|---|
| `/(auth)/login` | Login | Public | Any |
| `/(auth)/register` | Register (Candidate / Recruiter) | Public | Any |
| `/(auth)/forgot-password` | Forgot Password | Public | Any |
| `/(auth)/reset-password` | Reset Password | Public | Any |
| `/(auth)/verify-email` | Email OTP Verification | Public | Any |
| `/(tabs)/` | Home Feed | 🔒 Auth | Candidate |
| `/(tabs)/browse` | Search & Browse | 🔒 Auth | Candidate |
| `/(tabs)/jobs` | Job Listing | 🔒 Auth | Candidate |
| `/(tabs)/profile` | Profile | 🔒 Auth | Candidate |
| `/description/[id]` | Job Detail + ATS Check | 🔒 Auth | Candidate |
| `/ats` | ATS Scanner | 🔒 Auth | Candidate |
| `/applications` | My Applications | 🔒 Auth | Candidate |
| `/saved-jobs` | Saved Jobs | 🔒 Auth | Candidate |
| `/job-alerts` | Job Alerts | 🔒 Auth | Candidate |
| `/notifications` | Notifications | 🔒 Auth | Any |
| `/recruiter/dashboard` | KPI Dashboard | 🔒 Auth | 🛡️ Recruiter |
| `/recruiter/jobs` | Job Management | 🔒 Auth | 🛡️ Recruiter |
| `/recruiter/create-job` | Post a Job | 🔒 Auth | 🛡️ Recruiter |
| `/recruiter/companies` | Company Directory | 🔒 Auth | 🛡️ Recruiter |
| `/recruiter/create-company` | Register Company | 🔒 Auth | 🛡️ Recruiter |
| `/recruiter/company/[id]` | Company Editor | 🔒 Auth | 🛡️ Recruiter |
| `/recruiter/job/[id]/applicants` | Applicant CRM | 🔒 Auth | 🛡️ Recruiter |
| `/about` | About | Public | Any |
| `/privacy-policy` | Privacy Policy | Public | Any |
| `/terms-of-service` | Terms of Service | Public | Any |
| `/suspended` | Account Suspended | Public | Any |

---

## 🚀 Quick Start

### Prerequisites

| Tool | Version |
|---|---|
| Node.js | 20+ |
| npm | 10+ |
| Expo CLI | latest |
| iOS Simulator or Android Emulator | (optional) |

### 1. Clone & Install

```bash
git clone https://github.com/Jashan-randhawa/FOREWORK-mobile.git
cd FOREWORK-mobile
npm install --legacy-peer-deps
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
EXPO_PUBLIC_API_URL=https://your-backend-api.com
```

### 3. Run

```bash
# Expo Dev Server (scan QR with Expo Go)
npx expo start

# Android emulator
npx expo start --android

# iOS simulator
npx expo start --ios

# Web (localhost:8081)
npx expo start --web
```

### 4. Run Tests

```bash
npm test
# 39/39 tests passing
```

---

## 📦 EAS Build & Store Deployment

Three build profiles are configured in `eas.json`:

| Profile | Distribution | Android | iOS | Use Case |
|---|---|---|---|---|
| `development` | Internal | `.apk` via Expo Dev Client | Simulator | Local development |
| `preview` | Internal | `.apk` | Simulator | QA / stakeholder review |
| `production` | Store | `.aab` (App Bundle) | Device | Play Store / App Store |

### Build Commands

```bash
# Install EAS CLI
npm install -g eas-cli

# Authenticate
eas login

# Development build
eas build --profile development --platform android

# Preview APK
eas build --profile preview --platform android

# Production (store-ready)
eas build --profile production --platform all

# Submit to stores
eas submit --platform android  # Google Play internal track
eas submit --platform ios      # App Store Connect
```

### App Identifiers

| Platform | Identifier |
|---|---|
| iOS Bundle ID | `com.forework.app` |
| iOS Associated Domain | `applinks:forework.vercel.app` |
| Android Package | `com.forework.app` |
| Deep Link Scheme | `forework://` |

---

## 🤖 CI/CD — GitHub Actions

File: `.github/workflows/build-apk.yml`

**Triggers:**
- Push to `main` (JS/TS, Android, config file changes)
- Pull requests to `main`
- Manual dispatch (choose `assembleDebug` or `assembleRelease`, optionally restrict to `arm64-v8a`)

**Pipeline:**

```
Checkout → Node 20 + npm cache → JDK 17 (Temurin) →
Android SDK setup → npm ci → expo prebuild → Gradle build → Upload APK artifact
```

**Optimisations:**
- Concurrency group cancels stale builds on the same branch
- 30-minute timeout cap
- `actions/setup-java@v5` with Temurin distribution
- Explicit Android SDK package list to avoid obsolete tools failure

---

## 🧪 Quality Assurance & Testing

**39 / 39 tests passing** across 8 suites:

| Suite | Coverage |
|---|---|
| `ats/atsEngine.test.js` | Score calculation, keyword matching algorithm |
| `components/DeleteAccountModal.test.js` | Render, confirmation flow |
| `components/RecruiterGuard.test.js` | Role blocking, passthrough for recruiters |
| `redux/applicationSlice.test.js` | State mutations, applied jobs list |
| `redux/authSlice.test.js` | Login, logout, token, PAN/Aadhaar strip |
| `redux/companySlice.test.js` | Company CRUD state |
| `redux/jobSlice.test.js` | Job listing, filter, pagination, sort |
| `utils/axiosInstance.test.js` | Token injection, 401 redirect, error normalisation |

---

## 📦 Dependency Reference

| Package | Version | Purpose |
|---|---|---|
| `expo` | ~57.0.24 | Core SDK |
| `react-native` | 0.86.x | Native runtime |
| `expo-router` | latest | File-based navigation |
| `@reduxjs/toolkit` | ^2.12.0 | State management |
| `redux-persist` | latest | State persistence |
| `@react-native-async-storage/async-storage` | ^3.1.1 | Persist storage engine |
| `axios` | ^1.20.0 | HTTP client |
| `react-native-reanimated` | ^4.7.0 | Animations |
| `react-native-worklets` | ^0.13.0 | Reanimated worklets runtime |
| `nativewind` | ^4.x | Tailwind CSS for React Native |
| `expo-secure-store` | latest | Secure token storage (native) |
| `expo-document-picker` | latest | Resume file upload |
| `expo-notifications` | latest | Push notifications |
| `expo-linking` | ^57.0.10 | Deep links |
| `expo-constants` | ^57.0.19 | App/build constants |
| `jest` | ^29.x | Test runner |

---

## 📱 Platform Support

| Platform | Status | Notes |
|---|---|---|
| **Android** | ✅ Full support | Debug + release APK via GitHub Actions CI; `.aab` via EAS production |
| **iOS** | ✅ Full support | Tablet + Phone; bundle ID `com.forework.app`; Associated Domains configured |
| **Web** | ✅ Full support | Deployed to Vercel at [forework-mobile.vercel.app](https://forework-mobile.vercel.app); single-page output with rewrites |

---

## 🔐 Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `EXPO_PUBLIC_API_URL` | ✅ Yes | `http://localhost:5011` | Backend API base URL |

All environment variables prefixed with `EXPO_PUBLIC_` are inlined into the client bundle at build time by Expo.

---

## 📁 Project Configuration Files

| File | Purpose |
|---|---|
| `app.json` | Expo app config (name, version, icons, splash, plugins) |
| `eas.json` | EAS Build profiles (development / preview / production) |
| `tailwind.config.js` | NativeWind / Tailwind theme extension |
| `metro.config.js` | Metro bundler config (NativeWind CSS transformer) |
| `babel.config.js` | Babel preset (`babel-preset-expo` + NativeWind) |
| `tsconfig.json` | TypeScript config (extends expo/tsconfig.base) |
| `jest.config.js` | Jest config (jest-expo preset, module aliases) |
| `jest.setup.js` | Jest setup (mocks for Expo modules, AsyncStorage, SecureStore) |
| `global.css` | Global Tailwind CSS entry (NativeWind) |
| `nativewind-env.d.ts` | NativeWind TypeScript type reference |
| `.npmrc` | `legacy-peer-deps=true` (required for dependency tree) |
| `vercel.json` | Vercel build + rewrite config for SPA routing |
| `.env.example` | Environment variable template |

---

## 🤝 Contributing

```bash
# Fork → clone → branch
git checkout -b feat/your-feature

# Make changes
# ...

# Test
npm test

# Commit (Conventional Commits)
git commit -m "feat(ats): add missing skills export"

# Push & open PR against main
git push origin feat/your-feature
```

---

## 📄 License

This project is **not yet licensed**. All rights reserved by the author.

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/Jashan-randhawa">Jashan Randhawa</a>
  <br>
  <a href="https://forework-mobile.vercel.app">forework-mobile.vercel.app</a>
</p>
