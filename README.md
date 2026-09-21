# FOREWORK Mobile — React Native & Expo Application

[![GitHub Wiki](https://img.shields.io/badge/docs-GitHub_Wiki-blue.svg)](https://github.com/Jashan-randhawa/FOREWORK-mobile/wiki)
[![Expo SDK](https://img.shields.io/badge/Expo-SDK_57-black.svg)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React_Native-0.86-61DAFB.svg)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue.svg)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/NativeWind-v4-38B2AC.svg)](https://nativewind.dev)
[![Tests](https://img.shields.io/badge/Tests-39_Passed-success.svg)](#testing)

The complete cross-platform mobile application for the **FOREWORK Recruitment Ecosystem**, engineered with **Expo SDK 57**, **Expo Router**, **NativeWind v4**, **Redux Toolkit**, and **TypeScript**.

> 📖 **Full Documentation**: Explore the official [**FOREWORK Mobile GitHub Wiki**](https://github.com/Jashan-randhawa/FOREWORK-mobile/wiki) for deep-dive guides into architecture, candidate workflows, recruiter cockpits, ATS algorithms, and API specifications.

---

## 🌟 Key Features

### 👤 Candidate Experience & Discovery
- **Modern Job Discovery Feed**: Curated job feed, platform pillars, top specializations, and latest vacancies.
- **Parametric Search & Filter Sheet**: Real-time keyword filtering with modal drawer for location, employment type, salary bands, and experience brackets.
- **Interactive Job Details & Pre-Apply Check**: Embedded **JobDetailATSCheck** diagnostic widget allowing candidates to test ATS resume match before applying.
- **1-Click Application Flow**: Submit profile resumes instantly with real-time status reflection (`Pending`, `In Review`, `Accepted`, `Rejected`).
- **Telemetry & Video Conference Integration**: Live interview countdown badges and 1-tap **"Join Video Room ↗"** buttons.
- **Bookmarks & Job Alerts**: Save favorite listings and configure custom keyword/location alert subscriptions.
- **Profile Strength Meter**: Dynamic visual progress indicator ($0-100\%$) with in-app bio, contact, and skills editor.

### 🏢 Recruiter Management Suite (`/recruiter/*`)
- **Role Security Barrier**: Strictly guarded by `RecruiterGuard` to isolate recruiter tooling from candidate accounts.
- **Real-Time KPI Dashboard**: Metrics cockpit tracking Active Vacancies, Total Applicants, Candidate Views, and Pending Reviews.
- **Company Profile Management**: Register hiring organizations, brand profiles, logos, websites, and headquarters.
- **Vacancy Lifecycle Management**: Deploy postings and toggle states (`published`, `paused`, `closed`) with 1 tap.
- **Performance Funnel Analytics**: Visual charts tracking impression-to-hire conversion rates.
- **Applicant Pipeline CRM**: Screen applicants, view resumes, make 1-tap Accept/Reject decisions, and append private evaluation notes.
- **In-App Interview Scheduler**: Schedule virtual interviews with automated candidate notifications and video meeting links.

### 🧠 Deterministic ATS Resume Intelligence Studio
- **Dual Score Gauges**: Real-time calculation of **ATS Parseability** and **Job Match Fit** with color-coded tiers (Emerald $\ge 80$, Amber $60-79$, Rose $< 60$).
- **100-Point Deterministic Rubric**: Evaluates Parseability (20 pts), Job Alignment (30 pts), Experience Relevance (20 pts), Structure & Sections (10 pts), Qualifications (10 pts), and Evidence & Quality (10 pts).
- **Categorized Skill Gap Analysis**: Filterable badges for Matched Skills, Missing Required Skills, and Missing Preferred Skills.
- **Layout & Formatting Risk Audit**: Detects parseability anomalies categorized by severity (`CRITICAL`, `HIGH`, `MEDIUM`, `NOTICE`) with actionable fix advice.
- **"Why is my score X/100?" Modal**: Full mathematical score transparency.
- **Scan History Reload**: Quick retrieval and 1-tap reload of previous scans.

### 🔒 Enterprise Security & Privacy Compliance
- **Mobile Dual-Auth Protocol**: Issues 30-day mobile Bearer tokens (`X-Client: mobile`) with automated 401 interceptor logout.
- **Hardware Keystore Storage**: Auth tokens encrypted with `expo-secure-store` (Apple Keychain / Android Keystore).
- **Apple Guideline 5.1.1(v) Account Deletion**: Self-service deletion modal requiring explicit `"DELETE"` confirmation with cascading server cleanup.
- **Zero DOM Elements**: 100% native declarative primitives (`View`, `Text`, `Pressable`, `FlatList`).

---

## 🏗️ Architecture & Stack

```
forework-native/
├── app/                        # Expo Router file-based route tree
│   ├── (auth)/                 # Auth routes (login, register, reset, verify)
│   ├── (tabs)/                 # Candidate tabs (home, jobs, browse, profile)
│   ├── description/[id].tsx    # Dynamic job details with pre-apply ATS check
│   ├── ats.tsx                 # Standalone ATS Resume Intelligence Studio
│   ├── recruiter/              # Recruiter Suite (dashboard, jobs, applicants, companies)
│   └── _layout.tsx             # Root layout with Redux PersistGate & auth bootstrap
├── src/
│   ├── components/             # Reusable UI (ats, jobs, recruiter, profile)
│   ├── hooks/                  # Custom data querying hooks
│   ├── redux/                  # Redux Toolkit slices (auth, job, company, application)
│   ├── services/               # HTTP response unwrap helpers
│   └── utils/                  # Axios instance, endpoints, filter constants
└── __tests__/                  # Jest test suites
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or 20.x
- Expo CLI (`npm install -g expo-cli eas-cli`)

### Setup & Run
```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables
cp .env.example .env
# Edit EXPO_PUBLIC_API_URL to point to your backend API

# 3. Start Expo development server
npx expo start
```

### Run on Devices
- **Android**: Press `a` in the terminal or run `npm run android`.
- **iOS**: Press `i` in the terminal or run `npm run ios`.

---

## 🧪 Testing

The codebase includes an extensive Jest test suite covering Redux slices, Axios interceptors, ATS calculation engine, RecruiterGuard, and DeleteAccountModal:

```bash
npm test
```

```
Test Suites: 8 passed, 8 total
Tests:       39 passed, 39 total
```

---

## 📚 Documentation & Wiki

For complete architectural diagrams, API contracts, deep linking schemas, and store deployment checklists:

👉 **[Visit the FOREWORK Mobile GitHub Wiki](https://github.com/Jashan-randhawa/FOREWORK-mobile/wiki)**

- [Features Overview](https://github.com/Jashan-randhawa/FOREWORK-mobile/wiki/Features-Overview)
- [Candidate Experience Guide](https://github.com/Jashan-randhawa/FOREWORK-mobile/wiki/Candidate-Experience)
- [Recruiter Suite Guide](https://github.com/Jashan-randhawa/FOREWORK-mobile/wiki/Recruiter-Suite)
- [ATS Resume Intelligence Specification](https://github.com/Jashan-randhawa/FOREWORK-mobile/wiki/ATS-Resume-Intelligence)
- [Authentication & Security](https://github.com/Jashan-randhawa/FOREWORK-mobile/wiki/Authentication-and-Security)
- [Architecture & Tech Stack](https://github.com/Jashan-randhawa/FOREWORK-mobile/wiki/Architecture-and-Tech-Stack)
- [Deep Linking & Universal Links](https://github.com/Jashan-randhawa/FOREWORK-mobile/wiki/Deep-Linking-and-Universal-Links)
- [Build & Store Deployment Guide](https://github.com/Jashan-randhawa/FOREWORK-mobile/wiki/Build-and-Store-Deployment)
- [API Endpoints Reference](https://github.com/Jashan-randhawa/FOREWORK-mobile/wiki/API-Endpoints-Reference)

---

## 📄 License & Maintainer

Maintained by **[Jashanpreet Singh](https://github.com/Jashan-randhawa)**.
