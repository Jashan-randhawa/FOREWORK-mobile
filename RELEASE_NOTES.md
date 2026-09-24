# 🚀 FOREWORK Mobile — Release Notes

---

## 🌟 Release `v1.1.0 — Modern Purple UI & Universal Cross-Platform Scroll Overhaul`

> **Release:** `v1.1.0`  
> **Date:** September 24, 2026  
> **Repository:** [Jashan-randhawa/FOREWORK-mobile](https://github.com/Jashan-randhawa/FOREWORK-mobile)  
> **Live Demo:** [forework-mobile.vercel.app](https://forework-mobile.vercel.app)  
> **Official Wiki:** [FOREWORK Mobile Wiki](https://github.com/Jashan-randhawa/FOREWORK-mobile/wiki)  
> **Author & Lead Engineer:** Jashanpreet Singh ([@Jashan-randhawa](https://github.com/Jashan-randhawa))  

---

### 🎨 1. Signature Purple Design System (`global.css`)
- **Brand Palette Modernization**: Transitioned from monochrome neutral darks to a vibrant, cohesive **Signature Purple** (`#6B3AC2` / `hsl(263, 60%, 48%)`).
- **Warm Lilac Backgrounds**: High-contrast, gentle surfaces (`#F9F7FF`) replacing sterile pure white backdrops for reduced eye strain and enhanced card depth.
- **Deep Obsidian Dark Mode**: Refined dark palette (`hsl(262, 30%, 6%)`) with tailored lilac accents and 0.75rem rounded corners.

### 🧭 2. Floating Pill Bottom Navigation (`TabBarIcon.tsx` & `(tabs)/_layout.tsx`)
- **Active Pill Expansion**: Selecting any bottom tab dynamically expands it into a rounded floating purple pill (`#EDE9FF`) displaying both the emoji glyph and bold label side-by-side.
- **Clean Inactive States**: Non-active tabs display a minimalist, muted emoji glyph, keeping navigation uncluttered and modern.
- **Ergonomic Elevation**: Increased tab bar height to 76px with a purple drop shadow (`shadowColor: #6B3AC2`, elevation: 16) for responsive, finger-friendly touch targets.

### 📋 3. High-Impact JobCard Redesign (`src/components/jobs/JobCard.tsx`)
- **Brand Accent Bar**: Added a vibrant 4px top purple accent gradient bar on every card.
- **46×46 Brand Avatar**: High-resolution company logo container with soft purple monogram fallback for unbranded listings.
- **Vivid Multi-Colored Badges**:
  - *Job Type*: Lilac badge (`#EDE9FF` with `#6B3AC2` text).
  - *Compensation*: Emerald badge (`#ECFDF5` with `#059669` text) showing `₹X LPA` or `Competitive`.
  - *Openings*: Sky blue badge (`#F0F9FF` with `#0284C7` text).
  - *Recency*: Orange badge (`#FFF7ED` with `#EA580C` text) displaying **🔥 New** for listings posted today.
- **Prominent Primary CTA**: Replaced subtle text link with a high-visibility solid purple **"Apply Now →"** button.

### 🏠 4. Home Feed Trust & Telemetry Overhaul (`app/(tabs)/index.tsx`)
- **Full-Width Hero Section**: Unified purple hero card with white typography, drop-shadowed search bar, and trending pill filters.
- **Platform Impact Strip**: Added three-stat trust banner:
  - **100% Verified Jobs** (zero spam or ghost vacancies)
  - **< 48h Response Time** (direct recruiter turnaround)
  - **0% Recruitment Ghosting** (transparent candidate telemetry)

### 📄 5. Reorganised About & Maintainer Hub (`app/about.tsx` & `app/creator.tsx`)
- Completely restructured into 6 cohesive sections:
  1. *Hero Header*: Value proposition and direct link to explore open vacancies.
  2. *Impact Stats Grid*: 4-quadrant verified metrics (`100% Verified`, `< 48h Turnaround`, `0% Ghosting`, `24/7 Reliability`).
  3. *Core Principles*: Detailed cards for Transparency, Intelligent Matchmaking, Vetted Employers, and Recruiter Cockpit.
  4. *Dual Journey Flow*: Interactive tab switching between **👤 For Job Seekers** and **🏢 For Recruiters** with step-by-step guidance.
  5. *Maintainer Spotlight*: Bio and credentials for lead engineer **Jashanpreet Singh**, active maintainer indicators, 10 technology stack tags, and repository links.
  6. *Account Creation CTA*: High-contrast conversion banner.

### 📱 6. Universal Cross-Platform Scroll & Viewport Engine
- **Zero-Collapse React Native Web Support**: Fixed the web viewport height collapse bug by enforcing `<SafeAreaView className="flex-1 bg-background" style={{ flex: 1 }}>` across all 26 screens.
- **Guaranteed Visible Content**: Configured `contentContainerStyle={{ paddingBottom: 48-60 }}` so bottom action buttons, modal drawers, and tab navigation never obstruct content.
- **Keyboard & Tap Responsiveness**: Configured `keyboardShouldPersistTaps="handled"` on all scroll containers and forms.
- **Full Route Coverage**:
  - Auth Group: `login`, `register`, `forgot-password`, `reset-password`, `verify-email`
  - Recruiter Suite: `dashboard`, `jobs`, `companies`, `create-job`, `create-company`, `company/[id]`, `job/[id]/applicants`
  - Candidate Suite: `index`, `jobs`, `browse`, `profile`, `description/[id]`, `applications`, `saved-jobs`, `job-alerts`, `notifications`, `ats`
  - Legal & Info: `about`, `creator`, `privacy-policy`, `terms-of-service`, `suspended`

### 📚 7. Official GitHub Wiki Integration
- Cloned, authored, and pushed 12 modular documentation guides directly to [FOREWORK-mobile.wiki.git](https://github.com/Jashan-randhawa/FOREWORK-mobile/wiki).

---

## 🚀 Release `v1.0.0 — Initial Public Release`

> **Release:** `v1.0.0 — Initial Public Release`  
> **Date:** September 22, 2026  
> **Repository:** [Jashan-randhawa/FOREWORK-mobile](https://github.com/Jashan-randhawa/FOREWORK-mobile)  
> **Live Demo:** [forework-mobile.vercel.app](https://forework-mobile.vercel.app)  

---

### 📋 Overview

**FOREWORK Mobile** is an enterprise-grade, cross-platform recruitment and career acceleration application for **iOS**, **Android**, and **Web**. Built on **Expo SDK 57** with **React Native 0.86** and **TypeScript**, it combines a feature-complete candidate job-hunting experience with a role-gated Recruiter Management Cockpit and a deterministic **100-Point ATS Resume Intelligence Engine**.

---

### 🛠️ Tech Stack

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

### ✨ Features Shipped in v1.0.0

#### 👤 Candidate Career Hub
- **Home Feed** (`app/(tabs)/index.tsx`): Curated job discovery with latest vacancies and verified company openings.
- **Browse** (`app/(tabs)/browse.tsx`): Parametric search with filter drawer (location, type, salary, experience).
- **Jobs** (`app/(tabs)/jobs.tsx`): Full job listing view with real-time data hydration.
- **Profile** (`app/(tabs)/profile.tsx`): Dynamic profile strength meter (0–100% progress bar), bio, contacts, skills editor.
- **Job Detail** (`app/description/[id].tsx`): Full vacancy card with embedded ATS pre-apply diagnostic.
- **Applications** (`app/applications.tsx`): Track review statuses: `In Review`, `Accepted`, `Rejected`.
- **Saved Jobs** (`app/saved-jobs.tsx`): 1-tap bookmark system.
- **Job Alerts** (`app/job-alerts.tsx`): Keyword/location-based push alert subscriptions.
- **Notifications** (`app/notifications.tsx`): Real-time application and system notifications.
- **ATS Resume Scanner** (`app/ats.tsx`): Standalone 100-point deterministic ATS resume analysis screen.

#### 🏢 Recruiter Management Cockpit
- **KPI Dashboard** (`app/recruiter/dashboard.tsx`): Active vacancies, applicant volumes, pending reviews metrics.
- **Job Management** (`app/recruiter/jobs.tsx`): Full job listing with lifecycle status toggling.
- **Create Job** (`app/recruiter/create-job.tsx`): Rich job posting form.
- **Company Management** (`app/recruiter/companies.tsx` & `create-company.tsx`): Register and manage company profiles.
- **Applicant Pipeline & Decision CRM** (`app/recruiter/job/[id]/applicants.tsx`): Accept/Reject pipeline with interview scheduler.

---

### 🧠 Deterministic ATS Resume Intelligence Engine

The ATS Engine scores resumes against a strict **100-Point Deterministic Rubric**:

1. **Parseability (20 pts)**: Layout simplicity, standard fonts, absence of parse-blocking graphical elements.
2. **Job Alignment (30 pts)**: Keyword frequency and density alignment with targeted job descriptions.
3. **Experience Relevance (20 pts)**: Chronological clarity, bulleted achievements, quantified metrics.
4. **Structure & Sections (10 pts)**: Standard section heading compliance (Experience, Education, Skills, Contact).
5. **Qualifications & Education (10 pts)**: Degree, certification, and accredited training detection.
6. **Evidence & Quality (10 pts)**: Impact metrics, action verbs, typo and grammar checks.

---

### 🧪 Automated Test Suite & Coverage

- **39 automated tests across 8 test suites** (`npm test`):
  - `authSlice.test.ts`: Login, logout, token persistence, role state transitions.
  - `jobSlice.test.ts`: Hydration, filtering, cache blacklisting.
  - `atsEngine.test.ts`: Deterministic rubric scoring and skill gap matching.
  - `axiosInstance.test.ts`: Request interceptors, Bearer token injection, 401 redirect handling.
  - `RecruiterGuard.test.tsx`: Route protection and role authorization barriers.
