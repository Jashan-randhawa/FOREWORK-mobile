# FOREWORK Mobile — Comprehensive Quality Assurance & Test Plan

**Document Version**: 1.0.0  
**Target Applications**: FOREWORK React Native Mobile App (`forework-native`) & Dual-Auth Backend (`Backend/`)  
**Architecture**: Expo SDK 57 • Expo Router • NativeWind v4 • Redux Toolkit (AsyncStorage & SecureStore)  
**Applicable Operating Systems**: Android 8.0+ (API 26+) and iOS 15.0+  

---

## 1. Executive Summary & Test Objectives

The objective of this Test Plan is to provide rigorous verification for the complete Web-to-Mobile migration of FOREWORK. It establishes structured test procedures for both candidate and recruiter user flows, verifies deterministic ATS algorithms, validates dual-auth token persistence, ensures App Store regulatory compliance (Apple Guideline 5.1.1(v) account deletion), and confirms deep-linking stability across diverse device form factors.

---

## 2. Test Environment & Matrix

### 2.1 Hardware & Device Matrix
| Platform | Form Factor | OS Version | Display / Feature Focus |
|---|---|---|---|
| **Android** | Pixel 7 / Pixel 8 | Android 13, 14 | Gesture navigation, Adaptive Icons, App Links |
| **Android** | Samsung Galaxy S22/S23 | Android 12, 13 | One UI skin, variable refresh rates |
| **iOS** | iPhone 14 Pro / 15 Pro | iOS 16, 17 | Dynamic Island, Safe Area insets, Universal Links |
| **iOS** | iPhone SE (3rd Gen) | iOS 15, 16 | Compact 4.7" display layout responsiveness |
| **Tablet** | iPad Air / Galaxy Tab | iPadOS 17 / One UI | Tablet layout scaling & orientation lock |

### 2.2 Persona Test Matrix
| Persona | Default Role | Seeded Test Account | Expected Permissions |
|---|---|---|---|
| **Unauthenticated** | Guest | N/A | Browse jobs, read terms, cannot apply or view recruiter tools |
| **Candidate** | `Student` | `candidate.test@forework.dev` | One-click apply, ATS scanner, alerts, bookmarks, interview tracking |
| **Recruiter** | `Recruiter` | `recruiter.test@forework.dev` | Post jobs, company setup, screen applicants, schedule interviews, notes |
| **Suspended User** | Any | `suspended.test@forework.dev` | Blocked at `app/suspended.tsx`, cannot access marketplace |

---

## 3. Test Suites & Test Cases

---

### Suite 1: Authentication, Dual-Auth & Session Management (AUTH)

| Test ID | Test Case Description | Preconditions | Execution Steps | Expected Result | Priority |
|---|---|---|---|---|---|
| **TC-AUTH-001** | Candidate Registration with KYC | Unauthenticated | 1. Open `/(auth)/register`<br>2. Select "Candidate / Job Seeker"<br>3. Fill name, email, phone, password, PAN, Aadhaar<br>4. Tap "Create Free Account" | Account created in MongoDB. Encrypted PAN/Aadhaar with blindIndex hashes. Redirected to login with verification prompt. | P0 |
| **TC-AUTH-002** | Recruiter Registration with KYC | Unauthenticated | 1. Select "Employer / Recruiter"<br>2. Fill all details and submit | Account created with `role: "Recruiter"`. | P0 |
| **TC-AUTH-003** | Mobile Dual-Auth Login (`X-Client: mobile`) | Registered account | 1. Enter email & password on `/(auth)/login`<br>2. Inspect network request headers | Request includes `X-Client: mobile`. Backend issues 30-day JWT. Token stored securely in `expo-secure-store` under `forework_token`. Redux `auth.user` hydrated. | P0 |
| **TC-AUTH-004** | Session Persistence on App Restart | Logged in | 1. Force close the mobile app<br>2. Relaunch app | User remains logged in. Redux store rehydrated via Redux-Persist & SecureStore Bearer interceptor. No login screen shown. | P0 |
| **TC-AUTH-005** | Unauthorized Session Expiry (401 Interceptor) | Invalid/expired token | 1. Corrupt token in SecureStore<br>2. Trigger any authenticated API call | Axios interceptor catches 401, clears SecureStore `TOKEN_KEY`, dispatches `setUser(null)`, and redirects to `/(auth)/login`. | P0 |
| **TC-AUTH-006** | Logout & Token Purge | Logged in | 1. Navigate to Profile tab<br>2. Tap "Sign Out of Account" | `TOKEN_KEY` deleted from `expo-secure-store`. Redux auth reset. Cookies cleared. Redirected to login. | P1 |
| **TC-AUTH-007** | Forgot & Reset Password Flow | Known email | 1. Open `/(auth)/forgot-password`<br>2. Enter email and submit<br>3. Open reset link with token param | Reset token verified. User enters new password ($\ge 6$ chars). Hash updated in MongoDB. | P1 |
| **TC-AUTH-008** | Email Verification Flow | Unverified account | 1. Open `/(auth)/verify-email` with token query | Verification token validated against backend. `isEmailVerified` flag set to `true`. | P1 |

---

### Suite 2: Candidate Experience, Job Search & Telemetry (CAND)

| Test ID | Test Case Description | Preconditions | Execution Steps | Expected Result | Priority |
|---|---|---|---|---|---|
| **TC-CAND-001** | Home Feed & Latest Vacancies | Logged in (Candidate) | 1. Launch app to `/(tabs)/index`<br>2. Scroll feed | Hero search bar renders. Platform pillars display. Latest job cards render with title, company, salary, and location. | P1 |
| **TC-CAND-002** | Job Search with Keywords & Filters | Any | 1. Open `/(tabs)/jobs`<br>2. Type keyword "React"<br>3. Open Filter Modal<br>4. Select "Full-time" and salary range | List updates dynamically. Filter chips display active parameters. Pagination loads subsequent pages. | P0 |
| **TC-CAND-003** | Category Discovery Browse | Any | 1. Open `/(tabs)/browse`<br>2. Tap "Frontend Developer" category | Category search dispatched with technology filter set. Results load with matching listings. | P1 |
| **TC-CAND-004** | Job Description & One-Click Apply | Candidate with profile resume | 1. Tap a job card<br>2. Review job details<br>3. Tap "One-Click Apply Now" | Application submitted to `POST /api/application/apply/:id`. Button changes to "✓ Already Applied". Status reflected in Redux. | P0 |
| **TC-CAND-005** | Job Description Pre-Apply Check | Candidate logged in | 1. In Job Description screen, inspect `JobDetailATSCheck`<br>2. Tap "Check Match Compatibility" | Job Match Fit & ATS Parseability discs display with match score, matched skills badges, and missing required skills. | P0 |
| **TC-CAND-006** | Saved Jobs Bookmarking & Unsaving | Candidate logged in | 1. Tap bookmark icon on JobCard<br>2. Open `app/saved-jobs.tsx`<br>3. Tap "Remove" | Job appears in saved jobs list. Unsave immediately updates list and synchronizes state. | P1 |
| **TC-CAND-007** | Custom Job Alerts CRUD | Candidate logged in | 1. Open `app/job-alerts.tsx`<br>2. Tap "+ Create Alert"<br>3. Enter title, keyword, location, daily frequency<br>4. Delete an alert | Alert subscription created via `POST /api/job/alert`. Active toggle updates frequency. Delete removes subscription. | P1 |
| **TC-CAND-008** | In-App Notifications Center | Candidate with notifications | 1. Open `app/notifications.tsx`<br>2. Toggle "Unread Only"<br>3. Tap "Mark All Read" | Notifications filter correctly. Status changes to read. Unread badge counter updates in header. | P2 |
| **TC-CAND-009** | Application Tracking & Interview Room Link | Applied candidate | 1. Open `app/applications.tsx`<br>2. Find scheduled interview<br>3. Tap "Join Video Room ↗" | Application status badges render (Pending: Amber, Accepted: Emerald, Rejected: Rose). Meeting URL opens device browser/app. | P0 |
| **TC-CAND-010** | Profile Strength Meter & Edit Profile | Candidate logged in | 1. Open `/(tabs)/profile`<br>2. Check strength progress bar<br>3. Tap "Edit Profile"<br>4. Update bio & skills | Strength score recalculates ($0-100\%$). Profile updates save via `POST /api/user/profile/update`. | P1 |

---

### Suite 3: ATS Resume Intelligence Studio (ATS)

| Test ID | Test Case Description | Preconditions | Execution Steps | Expected Result | Priority |
|---|---|---|---|---|---|
| **TC-ATS-001** | Full ATS Analysis using Stored Profile Resume | Candidate with profile resume | 1. Open `app/ats.tsx`<br>2. Select "Profile Resume"<br>3. Pick an active job opening<br>4. Tap "Run ATS Compatibility Analysis" | Analysis runs via `POST /api/ats/analyze` (`use_profile_resume: true`, `job_id`). Dual gauges render with tone colors ($\ge 80$: Emerald, $60-79$: Amber, $< 60$: Rose). | P0 |
| **TC-ATS-002** | ATS Analysis using Pasted Plain Text | Any user | 1. Select "Paste Plain Text"<br>2. Paste 200-word resume snippet<br>3. Paste custom JD text<br>4. Run analysis | Plain text analyzed (`resume_text`, `job_description`). Response populates score, breakdown, skills, and issues. | P0 |
| **TC-ATS-003** | 6-Metric Breakdown Points Verification | Scan completed | 1. Review Score Breakdown section | Displays 6 criteria: Parseability (20), Job Alignment (30), Experience (20), Structure (10), Qualifications (10), Quality (10). Point totals equal Overall Score. | P0 |
| **TC-ATS-004** | Categorized Skills Filtering | Scan with skills | 1. In Skills section, tap "Matched"<br>2. Tap "Missing"<br>3. Tap "All" | Filter pills toggle visible badges. Matched skills have checkmarks; missing required skills have X badges; preferred skills have amber alert icons. | P1 |
| **TC-ATS-005** | Formatting & Parseability Risk Detection | Scan with formatting risks | 1. Review Formatting Issues section | Severity tiers render (`CRITICAL`, `HIGH`, `MEDIUM`, `NOTICE`). "How to fix" recommendation callout displays actionable fix. | P1 |
| **TC-ATS-006** | "Why is my score X/100?" Derivation Modal | Scan completed | 1. Tap "Why?" button in Score section | Modal opens displaying executive evaluation summary, category mathematical derivations, and deterministic rubric disclaimer. | P1 |
| **TC-ATS-007** | Scan History Reload | User with $\ge 1$ past scans | 1. Scroll to Recent ATS Scans<br>2. Tap past report card | Analysis rehydrates from historical record without re-calling analyze endpoint. Report scrolls into view. | P2 |

---

### Suite 4: Recruiter Suite & Pipeline Management (REC)

| Test ID | Test Case Description | Preconditions | Execution Steps | Expected Result | Priority |
|---|---|---|---|---|---|
| **TC-REC-001** | Recruiter Role Guard Protection | Candidate account | 1. Attempt to navigate directly to `/recruiter/dashboard` | `RecruiterGuard` intercepts request. Displays "Recruiter Access Required" barrier. Blocks access to recruiter tools. | P0 |
| **TC-REC-002** | Recruiter Cockpit KPI Aggregation | Recruiter account | 1. Open `app/recruiter/dashboard.tsx` | Active Vacancies, Total Applicants, Candidate Views, and Pending Review KPIs display correct sums from API. | P0 |
| **TC-REC-003** | Company Registration Flow | Recruiter account | 1. Open `app/recruiter/create-company.tsx`<br>2. Enter company name<br>3. Tap Continue | Company registered via `POST /api/company/register`. Automatically routes to `app/recruiter/company/[id].tsx`. | P0 |
| **TC-REC-004** | Company Profile Setup & Ownership Guard | Company owner vs non-owner | 1. Edit description, website, location<br>2. Tap Save Profile<br>3. Attempt to edit another recruiter's company | Updates persist via `PUT /api/company/update/:id`. Non-owned company displays "Access Denied: Company Not Yours". | P0 |
| **TC-REC-005** | Vacancy Deployment Form | Recruiter with company | 1. Open `app/recruiter/create-job.tsx`<br>2. Fill title, salary, location, requirements, JD<br>3. Select company<br>4. Tap "Deploy Job Vacancy" | Job posted via `POST /api/job/post`. Job appears immediately in marketplace and recruiter's jobs list. | P0 |
| **TC-REC-006** | Job Lifecycle State Switching | Recruiter with active job | 1. Open `app/recruiter/jobs.tsx`<br>2. Switch status: Published $\to$ Paused $\to$ Closed | Status updates via `PUT /api/job/:id/status`. Badge color changes immediately. Candidates cannot apply to closed/paused jobs. | P0 |
| **TC-REC-007** | Job Performance Analytics Modal | Recruiter with job | 1. Tap "Analytics" on job card | `JobAnalyticsModal` opens. Views, applications, conversion %, and applicant funnel bars render with live data. | P1 |
| **TC-REC-008** | Candidate Decision Pipeline Actions | Recruiter with applicants | 1. Open `app/recruiter/job/[id]/applicants.tsx`<br>2. Tap "Accept" or "Reject" on candidate | Status updates via `POST /api/application/status/:id/update`. Candidate receives in-app telemetry notification. | P0 |
| **TC-REC-009** | Video Interview Scheduling Flow | Recruiter with applicant | 1. Tap "Schedule 📅"<br>2. Enter date/time and Google Meet URL<br>3. Tap "Send Invitation" | Backend schedules interview (`POST /api/application/:id/schedule`). Candidate email and calendar alert dispatched. | P0 |
| **TC-REC-010** | Recruiter Internal Evaluation Notes | Recruiter with applicant | 1. Tap "Notes ✎"<br>2. Type feedback and submit | Note appended via `POST /api/application/:id/notes`. Displays author name, timestamp, and evaluation text. | P1 |
| **TC-REC-011** | Candidate ATS Resume Evaluation Modal | Recruiter with applicant | 1. Tap "ATS: X% ↗" on candidate card | `ATSApplicantModal` opens. Displays candidate's automated parseability, skill match against job, and recommendations. | P0 |

---

### Suite 5: Regulatory Compliance & Deep-Linking (COMP)

| Test ID | Test Case Description | Preconditions | Execution Steps | Expected Result | Priority |
|---|---|---|---|---|---|
| **TC-COMP-001** | Apple Guideline 5.1.1(v) Account Deletion Flow | Logged-in user | 1. Profile $\to$ Danger Zone $\to$ Delete Account<br>2. Type "DELETE" and confirm | `DELETE /api/user/account` executed. Applications, resumes, alerts, and user document deleted from MongoDB. Tokens purged. Redirected to login. | P0 |
| **TC-COMP-002** | Account Deletion Input Validation | Logged-in user | 1. Open Delete Modal<br>2. Type random text or leave empty | "Permanently Delete" button remains disabled. Deletion cannot proceed without typing exact keyword "DELETE". | P0 |
| **TC-COMP-003** | Deep Link: Shared Job Opening | App installed | 1. Open link `forework://description/60d0fe...`<br>2. Open web link `https://forework.vercel.app/description/60d0fe...` | App launches directly into `app/description/[id].tsx` with matching jobId loaded. | P1 |
| **TC-COMP-004** | Deep Link: Email & Password Tokens | App installed | 1. Open link `forework://verify-email?token=xyz`<br>2. Open link `forework://reset-password/xyz` | App routes directly to email verification or password reset screens with token pre-filled. | P1 |
| **TC-COMP-005** | EAS Build Profile Verification | Development workstation | 1. Validate `eas.json` syntax<br>2. Run `eas build --profile preview --platform android --dry-run` | Build profile parses cleanly without configuration schema errors. | P1 |

---

### Suite 6: Performance, UI & Code Integrity (PERF)

| Test ID | Test Case Description | Preconditions | Execution Steps | Expected Result | Priority |
|---|---|---|---|---|---|
| **TC-PERF-001** | Zero DOM & HTML API Verification | Mobile codebase | 1. Run grep search for HTML tags (`div`, `span`, `p`, etc.)<br>2. Run grep search for DOM APIs (`document.`, `window.`, etc.) | **0 HTML tags** and **0 DOM APIs** found across all mobile source files in `app/` and `src/`. | P0 |
| **TC-PERF-002** | Safe Area Inset Handling | iOS notch / Dynamic Island | 1. Inspect headers across all screens on iPhone 15 | Headers render below notch and status bar. Bottom tabs clear home indicator bar. | P1 |
| **TC-PERF-003** | Virtualized List Scrolling Performance | $\ge 20$ jobs / applicants | 1. Rapidly fling scroll on Jobs and Applicants screens | FlatList / ScrollView maintains 60 FPS without memory spikes or dropped frames. | P2 |
| **TC-PERF-004** | Dark Mode Theme Consistency | System dark mode enabled | 1. Toggle device between Light and Dark mode | NativeWind dark theme classes (`dark:bg-card`, `dark:text-foreground`) adapt contrast and border colors cleanly. | P2 |

---

## 4. Defect Severity & Priority Definitions

- **Blocker (P0)**: Application crash, authentication failure, broken core candidate apply flow, recruiter cannot post or screen, or failure of Apple Guideline 5.1.1(v) account deletion. Blocks release.
- **Critical (P1)**: Feature malfunction without workaround (e.g. ATS score derivation failure, deep links failing to resolve, interview scheduling not persisting).
- **Major (P2)**: Non-critical feature degradation with workaround (e.g. filter chip visual glitch, minor layout wrapping on small screens).
- **Minor (P3)**: Cosmetic issues, subtle typographic misalignments, or non-blocking animations.

---

## 5. Pass / Fail Criteria for Store Submission

An EAS release candidate build is approved for App Store and Google Play submission if and only if:
1. **100% of P0 Test Cases** pass with zero open blockers.
2. **$\ge 95\%$ of P1 Test Cases** pass with verified workarounds for any non-blocking defect.
3. **Zero HTML tags or DOM APIs** exist in the native source tree.
4. **Account deletion** purges all user data and credentials on server and client within 3 seconds.
5. **App Store Reviewer demo accounts** (Candidate & Recruiter) function flawlessly.
