# FOREWORK Mobile — Production Store Submission & Compliance Guide

This guide documents the regulatory compliance, app configuration, and build submission procedures for deploying the **FOREWORK** React Native app to the **Apple App Store** and **Google Play Store**.

---

## 1. App Store Regulatory Compliance

### Apple App Store Guideline 5.1.1(v) — Account Deletion
- **Requirement**: If an app supports account creation, it must offer account deletion within the app, which must delete all personal data associated with the account.
- **Implementation in FOREWORK**:
  - Located at: `Profile Screen` → `Account Actions & Danger Zone` → `Delete Account & Personal Data (Irreversible)`.
  - Native Modal: `src/components/profile/DeleteAccountModal.tsx`.
  - Backend Endpoint: `DELETE /api/user/account` (and `/api/v1/user/account`).
  - Cascading Cleanup: Immediately erases candidate applications, uploaded resumes, ATS scans, KYC identifiers (Aadhaar & PAN), custom alerts, notifications, and user documents from MongoDB, and purges `expo-secure-store` authentication tokens.
- **Reviewer Note**: If asked by App Review, state: *"Account deletion is accessible directly in the mobile app by navigating to Profile tab → Account Actions → Delete Account. The user confirms deletion by typing DELETE, which immediately purges all user data and credentials on the server and client."*

### Google Play Data Safety
- **Data Types Collected**:
  - Personal Info: Name, Email Address, Phone Number, KYC ID (PAN/Aadhaar for recruiters).
  - Files: Resume documents (PDF, DOCX, TXT).
  - App Telemetry: Screen interactions, job alert subscriptions.
- **Data Sharing**: User data is strictly shared with prospective employers when the user explicitly applies for a position. Data is never sold or rented.
- **Account Deletion URL**: `https://forework.vercel.app/privacy-policy#section-8`

---

## 2. Deep Linking & Universal Links

### Custom Scheme
- Scheme: `forework://`
- Examples:
  - `forework://description/:id` (Direct job details navigation)
  - `forework://ats` (ATS Resume Studio)
  - `forework://applications` (Applied jobs telemetry)

### Android App Links & iOS Universal Links
- **Domain**: `forework.vercel.app`
- **Supported Paths**:
  - `https://forework.vercel.app/description/*` → navigates to `app/description/[id].tsx`
  - `https://forework.vercel.app/verify-email?token=*` → navigates to `app/(auth)/verify-email.tsx`
  - `https://forework.vercel.app/reset-password/:token` → navigates to `app/(auth)/reset-password.tsx`
  - `https://forework.vercel.app/jobs` → navigates to `app/(tabs)/jobs.tsx`
  - `https://forework.vercel.app/ats` → navigates to `app/ats.tsx`

---

## 3. App Reviewer Demo Credentials

When submitting to Apple and Google Play reviewers, provide these pre-configured test credentials in App Store Connect / Play Console:

| Persona | Role | Email | Password | Notes |
|---|---|---|---|---|
| Candidate Tester | `Student` | `candidate.review@forework.dev` | `ForeworkDemo@2026` | Has sample resume and applied jobs |
| Recruiter Tester | `Recruiter` | `recruiter.review@forework.dev` | `ForeworkDemo@2026` | Has registered company and active job postings |

---

## 4. EAS Build & Release Pipeline

### Prerequisites
Install EAS CLI globally:
```bash
npm install -g eas-cli
```
Authenticate with Expo:
```bash
eas login
```

### Build Commands

#### 1. Internal Preview Build (Stand-alone Android APK for testing)
```bash
eas build --profile preview --platform android
```

#### 2. Production Android App Bundle (.aab for Google Play)
```bash
eas build --profile production --platform android
```

#### 3. Production iOS Archive (.ipa for TestFlight / App Store)
```bash
eas build --profile production --platform ios
```

#### 4. Automated Dual-Platform Store Submission
```bash
eas submit --platform all
```

---

## 5. Verification Checklist

- [x] Dual-Auth Backend: Works with both mobile Bearer tokens and web HTTP-only cookies.
- [x] Zero HTML tags / DOM APIs in mobile source code.
- [x] In-app account deletion compliance implemented (Apple Guideline 5.1.1(v)).
- [x] Role-based routing: Candidate screens vs Recruiter suite guarded with `RecruiterGuard`.
- [x] Pre-application ATS diagnostic check embedded in Job Details screen.
- [x] Universal links and deep linking verified in `app.json`.
- [x] EAS Build configuration configured in `eas.json`.
