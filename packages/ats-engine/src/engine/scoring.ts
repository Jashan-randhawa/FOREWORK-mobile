/**
 * FOREWORK ATS Scoring Engine — Pure Logic Functions
 *
 * Framework-agnostic scoring utilities. No React, no React Native dependencies.
 * These functions implement the deterministic 100-point ATS scoring rubric.
 *
 * @package @jashan-randhawa/forework-ats-engine
 */

import type {
  ScoreTone,
  MetricConfig,
  SeverityStyle,
  PriorityStyle,
} from "../types";

// ─── Score Tone Classification ──────────────────────────────────────────

/**
 * Classify an ATS score into a visual/semantic tone.
 *
 * Thresholds:
 *  - >= 80 → Strong Compatibility (Emerald Green)
 *  - >= 60 → Moderate Compatibility (Amber Yellow)
 *  - <  60 → Needs Optimization (Crimson Red)
 *
 * Input is clamped to [0, 100] and rounded to nearest integer.
 */
export const getScoreTone = (score: number): ScoreTone => {
  const safeScore = Math.min(100, Math.max(0, Math.round(score)));
  if (safeScore >= 80) {
    return {
      label: "Strong Compatibility",
      badge: "Excellent",
      borderColor: "#10B981",
      bgColor: "#ECFDF5",
      textColor: "#047857",
      badgeBg: "#D1FAE5",
      badgeText: "#065F46",
    };
  }
  if (safeScore >= 60) {
    return {
      label: "Moderate Compatibility",
      badge: "Good",
      borderColor: "#F59E0B",
      bgColor: "#FFFBEB",
      textColor: "#B45309",
      badgeBg: "#FEF3C7",
      badgeText: "#92400E",
    };
  }
  return {
    label: "Needs Optimization",
    badge: "Action Needed",
    borderColor: "#EF4444",
    bgColor: "#FEF2F2",
    textColor: "#B91C1C",
    badgeBg: "#FEE2E2",
    badgeText: "#991B1B",
  };
};

/**
 * Clamp a score to the [0, max] range with one decimal place precision.
 */
export const clampScore = (score: number, max: number = 100): number => {
  return Math.min(max, Math.max(0, Math.round(score * 10) / 10));
};

/**
 * Calculate score percentage within a metric's range.
 */
export const scorePercentage = (score: number, max: number): number => {
  return Math.round((clampScore(score, max) / max) * 100);
};

/**
 * Determine progress bar color based on percentage threshold.
 */
export const getBarColor = (percentage: number): string => {
  if (percentage < 60) return "#F43F5E"; // rose-500
  if (percentage < 80) return "#F59E0B"; // amber-500
  return "#10B981"; // emerald-500
};

// ─── Metric Configuration (6-Category ATS Rubric) ──────────────────────

/**
 * FOREWORK's deterministic 6-category ATS rubric (100 pts total).
 *
 *  Parseability:          20 pts
 *  Job Alignment:         30 pts
 *  Experience Relevance:  20 pts
 *  Structure & Sections:  10 pts
 *  Qualifications:        10 pts
 *  Evidence & Quality:    10 pts
 */
export const METRIC_CONFIG: MetricConfig[] = [
  {
    key: "parsing",
    label: "Parseability",
    max: 20,
    icon: "file-text",
    description:
      "Text extraction readability, contact detection, machine-readable format, and layout safety.",
  },
  {
    key: "job_match",
    label: "Job Alignment",
    max: 30,
    icon: "target",
    description:
      "Required and preferred skill overlap, keyword presence, and technical coverage.",
  },
  {
    key: "experience",
    label: "Experience Relevance",
    max: 20,
    icon: "briefcase",
    description:
      "Role titles, relevant domain experience, career duration, and responsibility alignment.",
  },
  {
    key: "sections",
    label: "Structure & Sections",
    max: 10,
    icon: "layers",
    description:
      "Standard section headings, logical order, and resume completeness.",
  },
  {
    key: "qualifications",
    label: "Qualifications",
    max: 10,
    icon: "award",
    description:
      "Degree level, academic discipline, and certifications aligned with target role.",
  },
  {
    key: "quality",
    label: "Evidence & Quality",
    max: 10,
    icon: "sparkles",
    description:
      "Active action verbs, quantifiable metrics (% / numbers), and outcome-driven bullets.",
  },
];

// ─── Severity Classification ────────────────────────────────────────────

/**
 * Map formatting issue severity level to visual style tokens.
 */
export const getSeverityStyle = (severity: string): SeverityStyle => {
  switch (severity?.toUpperCase()) {
    case "CRITICAL":
      return {
        label: "Critical",
        badgeBg: "#FEE2E2",
        badgeBorder: "#FCA5A5",
        badgeText: "#991B1B",
        iconColor: "#DC2626",
      };
    case "HIGH":
      return {
        label: "High Risk",
        badgeBg: "#FFEDD5",
        badgeBorder: "#FDBA74",
        badgeText: "#9A3412",
        iconColor: "#EA580C",
      };
    case "MEDIUM":
      return {
        label: "Medium Risk",
        badgeBg: "#FEF3C7",
        badgeBorder: "#FCD34D",
        badgeText: "#92400E",
        iconColor: "#D97706",
      };
    default:
      return {
        label: "Notice",
        badgeBg: "#DBEAFE",
        badgeBorder: "#93C5FD",
        badgeText: "#1E40AF",
        iconColor: "#2563EB",
      };
  }
};

// ─── Priority Classification ────────────────────────────────────────────

/**
 * Map recommendation priority level to visual style tokens.
 */
export const getPriorityStyle = (priority: string): PriorityStyle => {
  switch (priority?.toUpperCase()) {
    case "CRITICAL":
      return {
        badge: "Critical Priority",
        badgeBg: "#FEE2E2",
        badgeBorder: "#FCA5A5",
        badgeText: "#991B1B",
        accentColor: "#EF4444",
      };
    case "HIGH":
      return {
        badge: "High Priority",
        badgeBg: "#FFEDD5",
        badgeBorder: "#FDBA74",
        badgeText: "#9A3412",
        accentColor: "#F97316",
      };
    case "MEDIUM":
      return {
        badge: "Medium Priority",
        badgeBg: "#FEF3C7",
        badgeBorder: "#FCD34D",
        badgeText: "#92400E",
        accentColor: "#F59E0B",
      };
    default:
      return {
        badge: "Improvement Tip",
        badgeBg: "#DBEAFE",
        badgeBorder: "#93C5FD",
        badgeText: "#1E40AF",
        accentColor: "#3B82F6",
      };
  }
};
