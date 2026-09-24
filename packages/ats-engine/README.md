# @jashan-randhawa/forework-ats-engine

> **FOREWORK ATS Resume Intelligence Engine** — Deterministic 100-point scoring rubric with React Native UI components for resume parseability, job match analysis, and optimization recommendations.

[![GitHub Package](https://img.shields.io/badge/GitHub%20Packages-npm-purple)](https://github.com/Jashan-randhawa/FOREWORK-mobile/packages)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

## Installation

```bash
# Configure npm to use GitHub Packages for the @jashan-randhawa scope
echo "@jashan-randhawa:registry=https://npm.pkg.github.com" >> .npmrc

# Install the package
npm install @jashan-randhawa/forework-ats-engine
```

## Features

### 🧮 Pure Scoring Engine (Framework-Agnostic)

Zero-dependency scoring utilities that work in **any** JavaScript/TypeScript environment:

```ts
import { getScoreTone, METRIC_CONFIG, getSeverityStyle, getPriorityStyle } from '@jashan-randhawa/forework-ats-engine';

// Classify a score into visual/semantic tone
const tone = getScoreTone(85);
console.log(tone.label);       // "Strong Compatibility"
console.log(tone.badge);       // "Excellent"
console.log(tone.borderColor); // "#10B981" (Emerald Green)

// Access the 6-category rubric configuration (100 pts total)
METRIC_CONFIG.forEach(metric => {
  console.log(`${metric.label}: ${metric.max} pts — ${metric.description}`);
});
```

### 📊 ATS Scoring Rubric (100 Points)

| Category | Max Points | Description |
|----------|-----------|-------------|
| Parseability | 20 | Text extraction, contact detection, machine-readable format |
| Job Alignment | 30 | Skill overlap, keyword presence, technical coverage |
| Experience Relevance | 20 | Role titles, domain experience, responsibility alignment |
| Structure & Sections | 10 | Standard headings, logical order, completeness |
| Qualifications | 10 | Degree level, certifications, academic alignment |
| Evidence & Quality | 10 | Action verbs, quantifiable metrics, outcome-driven bullets |

### 🎨 React Native UI Components

Pre-built, styled components for displaying ATS analysis results:

```tsx
import {
  ScoreDisc,
  ScoreBreakdownView,
  FormattingIssuesView,
  RecommendationsView,
} from '@jashan-randhawa/forework-ats-engine';

// Score gauge disc
<ScoreDisc score={85} title="ATS Parseability" subtitle="Strong Compatibility" />

// Full breakdown with progress bars
<ScoreBreakdownView
  breakdown={{ parsing: 18, job_match: 22, experience: 15, sections: 8, qualifications: 7, quality: 8 }}
  breakdownExplanations={{ parsing: "Clean PDF structure with proper encoding." }}
/>

// Formatting risk alerts
<FormattingIssuesView
  issues={[{ severity: "HIGH", message: "Multi-column layout detected", recommendation: "Use single-column format" }]}
/>

// Optimization recommendations
<RecommendationsView
  recommendations={[{
    priority: "CRITICAL",
    category: "Keywords",
    title: "Add missing required skills",
    description: "3 required skills not detected in resume",
    actionable_tip: "Include React, TypeScript, and Node.js in your skills section"
  }]}
/>
```

## Score Thresholds

| Score Range | Classification | Color | Badge |
|-------------|---------------|-------|-------|
| 80–100 | Strong Compatibility | 🟢 Emerald | Excellent |
| 60–79 | Moderate Compatibility | 🟡 Amber | Good |
| 0–59 | Needs Optimization | 🔴 Crimson | Action Needed |

## API Reference

### Engine Functions

| Function | Description |
|----------|-------------|
| `getScoreTone(score)` | Classify score → tone (label, badge, colors) |
| `clampScore(score, max?)` | Clamp to [0, max] with 1 decimal |
| `scorePercentage(score, max)` | Calculate % within metric range |
| `getBarColor(percentage)` | Get progress bar hex color |
| `getSeverityStyle(severity)` | Map severity → visual tokens |
| `getPriorityStyle(priority)` | Map priority → visual tokens |

### Constants

| Constant | Description |
|----------|-------------|
| `METRIC_CONFIG` | 6-category rubric array with keys, labels, max scores, icons |

### React Native Components

| Component | Props |
|-----------|-------|
| `ScoreDisc` | `score`, `title`, `subtitle?`, `size?` |
| `ScoreBreakdownView` | `breakdown?`, `breakdownExplanations?` |
| `FormattingIssuesView` | `issues?` |
| `RecommendationsView` | `recommendations?` |
| `Icon` | `name`, `size?`, `color?` |

## Peer Dependencies

- `react` >= 18.0.0
- `react-native` >= 0.72.0

## License

MIT © [Jashanpreet Singh](https://github.com/Jashan-randhawa)

---

Part of the [FOREWORK](https://forework-mobile.vercel.app) platform.
