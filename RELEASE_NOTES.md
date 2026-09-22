# 🚀 FOREWORK Mobile — Release Notes

> **Release:** `v1.0.0 — Initial Public Release`
> **Date:** September 22, 2026
> **Repository:** [Jashan-randhawa/FOREWORK-mobile](https://github.com/Jashan-randhawa/FOREWORK-mobile)
> **Live Demo:** [forework-mobile.vercel.app](https://forework-mobile.vercel.app)
> **HEAD Commit:** [`142b515`](https://github.com/Jashan-randhawa/FOREWORK-mobile/commit/142b5150c42b1ba4e0abe43d6229cc7ad30e71df)
> **Author:** Jashan Randhawa

---

## 📋 Overview

**FOREWORK Mobile** is an enterprise-grade, cross-platform recruitment and career acceleration application for **iOS**, **Android**, and **Web**. Built on **Expo SDK 57** with **React Native 0.86** and **TypeScript**, it combines a feature-complete candidate job-hunting experience with a role-gated Recruiter Management Cockpit and a deterministic **100-Point ATS Resume Intelligence Engine**.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Expo SDK 57 / React Native 0.86 |
| **Language** | TypeScript 6.0 |
| **Navigation** | Expo Router (file-based, deep-link ready) |
| **State Management** | Redux Toolkit + Async Storage persistence |
| **Styling** | NativeWind v4 (Tailwind CSS for React Native) |
| **HTTP** | Axios with auto token injection & 401 intercept |
| **Secure Storage** | expo-secure-store (native) / localStorage fallback (web) |
| **Animation** | React Native Reanimated 4.7.0 + Worklets 0.13.0 |
| **Testing** | Jest 29 — 39/39 tests passing |
| **CI/CD** | GitHub Actions (Android APK build workflow) |
| **Deployment** | Vercel (web), EAS Build (iOS/Android) |
| **New Architecture** | Enabled (`newArchEnabled: true`) |

---

## ✨ Features Shipped in v1.0.0

### 👤 Candidate Career Hub

| Screen | Description |
|---|---|
| `app/(tabs)/index.tsx` | **Home Feed** — Curated job discovery with latest vacancies and verified company openings |
| `app/(tabs)/browse.tsx` | **Browse** — Parametric search with filter drawer (location, type, salary, experience) |
| `app/(tabs)/jobs.tsx` | **Jobs** — Full job listing view with real-time data hydration |
| `app/(tabs)/profile.tsx` | **Profile** — Dynamic profile strength meter (0–100% progress bar), bio, contacts, skills editor |
| `app/description/[id].tsx` | **Job Detail** — Full vacancy card with embedded ATS pre-apply diagnostic |
| `app/applications.tsx` | **Applications** — Track review statuses: `In Review`, `Accepted`, `Rejected` |
| `app/saved-jobs.tsx` | **Saved Jobs** — 1-tap bookmark system |
| `app/job-alerts.tsx` | **Job Alerts** — Keyword/location-based push alert subscriptions |
| `app/notifications.tsx` | **Notifications** — Real-time application and system notifications |
| `app/ats.tsx` | **ATS Resume Scanner** — Standalone 100-point deterministic ATS resume analysis screen |

### 🏢 Recruiter Management Cockpit

| Screen | Description |
|---|---|
| `app/recruiter/dashboard.tsx` | **KPI Dashboard** — Active vacancies, applicant volumes, pending reviews metrics |
| `app/recruiter/jobs.tsx` | **Job Management** — Full job listing with lifecycle status toggling |
| `app/recruiter/create-job.tsx` | **Create Job** — Rich job posting form |
| `app/recruiter/job/[id]/applicants.tsx` | **Applicant CRM** — Full applicant pipeline with 1-tap Accept/Reject |
| `app/recruiter/companies.tsx` | **Company Directory** — Company branding and management |
| `app/recruiter/company/[id].tsx` | **Company Detail** — Logo, website, location metadata management |
| `app/recruiter/create-company.tsx` | **Create Company** — Register new organizations |

### 🔐 Authentication System

| Screen | Description |
|---|---|
| `app/(auth)/login.tsx` | JWT-based login with secure token storage |
| `app/(auth)/register.tsx` | Full registration with role selection (Candidate / Recruiter) |
| `app/(auth)/forgot-password.tsx` | Password reset flow with email dispatch |
| `app/(auth)/reset-password.tsx` | Token-based secure password reset |
| `app/(auth)/verify-email.tsx` | Email OTP verification screen |

### 📄 Informational Pages

- `app/about.tsx` — About FOREWORK with team and mission details
- `app/privacy-policy.tsx` — Full privacy policy
- `app/terms-of-service.tsx` — Terms of service
- `app/suspended.tsx` — Account suspension notice screen

---

## 🧠 ATS Resume Intelligence Engine

The flagship feature — a **deterministic 100-point scoring algorithm** that simulates enterprise ATS parsers (Workday, Greenhouse, Lever):

### Scoring Dimensions (100 pts total)

| Dimension | Weight | Component |
|---|---|---|
| **Keyword Match Score** | 40 pts | `src/components/ats/SkillMatchView.tsx` |
| **Formatting Parseability** | 30 pts | `src/components/ats/FormattingIssuesView.tsx` |
| **Section Completeness** | 20 pts | `src/components/ats/ScoreBreakdownView.tsx` |
| **File Compatibility** | 10 pts | `src/components/ats/ATSExplanationModal.tsx` |

### ATS Components

- **`ATSScoreGauge`** — Animated circular score gauge with color-coded tiers
- **`SkillMatchView`** — Matched vs. missing keyword visualization
- **`ScoreBreakdownView`** — Category-by-category point breakdown
- **`FormattingIssuesView`** — Detected formatting problems list
- **`RecommendationsView`** — Actionable improvement recommendations
- **`ATSExplanationModal`** — Educational modal explaining scoring methodology
- **`JobDetailATSCheck`** — Inline pre-apply ATS check embedded in job detail
- **`ATSApplicantModal`** — Recruiter-side view of applicant ATS scores

---

## 🏛️ Architecture

```
FOREWORK Mobile
├── app/                    # Expo Router — all screens & routes
│   ├── (auth)/            # Auth group: login, register, verify, reset
│   ├── (tabs)/            # Main tab navigation: Home, Browse, Jobs, Profile
│   ├── recruiter/         # Role-gated recruiter cockpit
│   ├── description/[id]   # Dynamic job detail route
│   └── [static screens]   # ats, applications, saved-jobs, notifications...
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── ats/           # ATS engine UI widgets
│   │   ├── jobs/          # JobCard, FilterModal
│   │   ├── profile/       # EditProfileModal, DeleteAccountModal
│   │   ├── recruiter/     # RecruiterGuard, CRM modals, Analytics
│   │   ├── navigation/    # TabBarIcon
│   │   └── common/        # Icon
│   ├── redux/             # State slices: auth, job, company, application
│   ├── hooks/             # Data-fetching hooks
│   ├── services/          # Axios HTTP service layer
│   ├── utils/             # axiosInstance, endpoints, secureStorage, filters
│   ├── lib/               # Error handling utilities
│   └── types/             # TypeScript declarations
├── __tests__/             # Jest test suites
│   ├── ats/               # ATS engine logic tests
│   ├── components/        # Component tests
│   ├── redux/             # Slice tests
│   └── utils/             # Axios instance tests
└── .github/workflows/     # CI/CD: Android APK build
```

---

## 🔧 Component Highlights

### `RecruiterGuard`
Role-gated security barrier (`src/components/recruiter/RecruiterGuard.tsx`). All recruiter screens are wrapped in this guard, which verifies the JWT-stored role and blocks non-recruiter accounts from accessing employer tooling.

### `JobLifecycleBadge`
Visual indicator (`src/components/recruiter/JobLifecycleBadge.tsx`) for vacancy states: `published` → `paused` → `closed` with color-coded chips.

### `JobAnalyticsModal`
Rich analytics overlay (`src/components/recruiter/JobAnalyticsModal.tsx`) with applicant funnel metrics, time-to-fill tracking, and per-stage conversion rates.

### `ScheduleInterviewModal`
Full interview scheduling UI (`src/components/recruiter/ScheduleInterviewModal.tsx`) with date/time picker, Google Meet/Zoom URL attachment, and candidate notification dispatch.

### `secureStorage`
Cross-platform abstraction (`src/utils/secureStorage.ts`) using `expo-secure-store` on native and `localStorage` fallback on web to ensure token persistence works across all targets.

---

## 🐛 Bug Fixes Included

| Fix | Commit |
|---|---|
| `react-native-worklets` upgraded to `0.13.0` for Reanimated 4.7.0 compatibility | `0888842` |
| Profile screen no longer calls `/api/application/get` when user is logged out | `f756e27` |
| Cross-platform `secureStorage` fallback added for web browsers | `d201c36` |
| Web: smooth touch drag and mouse wheel scrolling on web and mobile emulation | `44f29f2` |
| Vercel: `legacy-peer-deps` configured in `.npmrc` and `vercel.json` installCommand | `50e954c` |
| Web: support dependencies, single output config, and Vercel rewrites added | `397602993` |

---

## 🤖 CI/CD Pipeline

### GitHub Actions — Android APK Build (`.github/workflows/build-apk.yml`)

**Triggered by:**
- Push to `main` (when JS/TS, Android, or config files change)
- Pull requests to `main`
- Manual dispatch with configurable build variant and ABI

**Pipeline steps:**
1. Checkout (`actions/checkout@v4`)
2. Node.js 20 setup with npm cache (`actions/setup-node@v4`)
3. JDK 17 (Temurin) via `actions/setup-java@v5`
4. Android SDK setup with explicit package list
5. `npm ci --legacy-peer-deps` dependency install
6. Expo prebuild to generate native Android project
7. Gradle `assembleDebug` (default) or `assembleRelease` (manual)
8. APK artifact upload (retained for 7 days)

**Optimizations applied:**
- Concurrency control: cancels in-progress builds when new commit lands on same branch
- 30-minute job timeout
- NDK/CMake caching removed to streamline pipeline (latest commit)
- Explicit Android SDK packages to avoid `obsolete tools` failure

---

## 🧪 Test Coverage

**39 / 39 tests passing**

| Test Suite | File | Tests |
|---|---|---|
| ATS Engine Logic | `__tests__/ats/atsEngine.test.js` | Score calculation, keyword matching |
| DeleteAccountModal | `__tests__/components/DeleteAccountModal.test.js` | Render, confirm flow |
| RecruiterGuard | `__tests__/components/RecruiterGuard.test.js` | Role blocking, passthrough |
| applicationSlice | `__tests__/redux/applicationSlice.test.js` | State mutations |
| authSlice | `__tests__/redux/authSlice.test.js` | Login, logout, token storage |
| companySlice | `__tests__/redux/companySlice.test.js` | Company CRUD state |
| jobSlice | `__tests__/redux/jobSlice.test.js` | Job listing, filtering |
| axiosInstance | `__tests__/utils/axiosInstance.test.js` | Token injection, 401 redirect |

---

## 📦 Key Dependencies

| Package | Version | Purpose |
|---|---|---|
| `expo` | ~57.0.24 | Base SDK |
| `react-native` | 0.86.x | Native runtime |
| `expo-router` | latest | File-based routing |
| `@reduxjs/toolkit` | ^2.12.0 | State management |
| `axios` | ^1.20.0 | HTTP client |
| `react-native-reanimated` | ^4.7.0 | Animations |
| `nativewind` | ^4.x | Tailwind CSS for RN |
| `expo-secure-store` | latest | Secure token storage |
| `@react-native-async-storage/async-storage` | ^3.1.1 | Persistent storage |
| `expo-document-picker` | latest | Resume file upload |
| `expo-notifications` | latest | Push notifications |
| `expo-linking` | ^57.0.10 | Deep links |

---

## 📱 Platform Support

| Platform | Status |
|---|---|
| **Android** | ✅ Supported (debug + release APK via CI) |
| **iOS** | ✅ Supported (Tablet + Phone, bundle ID: `com.forework.app`) |
| **Web** | ✅ Supported (deployed on Vercel at `forework-mobile.vercel.app`) |

---

## 🔗 Deep Link Scheme

- **Scheme:** `forework://`
- **Associated Domains (iOS):** `applinks:forework.vercel.app`
- **Android Intent Filters:** Configured via Expo Router

---

## 📌 Known Limitations / Notes

> [!NOTE]
> This is the **v1.0.0 initial release** — the project was created on September 20, 2026 and reached this state within 2 days of active development.

> [!IMPORTANT]
> The ATS scoring engine is **client-side/deterministic** — no backend ML inference is required. Score calculation happens locally using keyword matching against the job description.

> [!TIP]
> For local development, copy `.env.example` to `.env` and fill in API base URL and keys before running `expo start`.

---

## 🚀 How to Install

### Run locally
```bash
git clone https://github.com/Jashan-randhawa/FOREWORK-mobile.git
cd FOREWORK-mobile
cp .env.example .env   # fill in your API keys
npm install --legacy-peer-deps
npx expo start
```

### Build Android APK
Trigger the **Build APK** workflow from GitHub Actions → Run Workflow, or push to `main`.

### Web Deploy
Live at: **https://forework-mobile.vercel.app**

---

*Release notes generated on September 22, 2026 · Commit `142b515` · FOREWORK Mobile v1.0.0*
