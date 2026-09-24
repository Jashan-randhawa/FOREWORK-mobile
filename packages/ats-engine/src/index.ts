/**
 * @jashan-randhawa/forework-ats-engine
 *
 * FOREWORK ATS Resume Intelligence Engine
 * Deterministic 100-point scoring rubric with React Native UI components.
 *
 * @example
 * ```ts
 * // Pure scoring logic (no React dependency)
 * import { getScoreTone, METRIC_CONFIG } from '@jashan-randhawa/forework-ats-engine';
 *
 * const tone = getScoreTone(85);
 * console.log(tone.label); // "Strong Compatibility"
 * console.log(tone.badge); // "Excellent"
 * ```
 *
 * @example
 * ```tsx
 * // React Native UI components
 * import { ScoreDisc, ScoreBreakdownView } from '@jashan-randhawa/forework-ats-engine';
 *
 * <ScoreDisc score={85} title="ATS Parseability" subtitle="Strong Compatibility" />
 * ```
 */

// ─── Engine (framework-agnostic scoring logic) ──────────────────────────
export {
  getScoreTone,
  clampScore,
  scorePercentage,
  getBarColor,
  METRIC_CONFIG,
  getSeverityStyle,
  getPriorityStyle,
} from "./engine";

// ─── React Native UI Components ─────────────────────────────────────────
export {
  Icon,
  ScoreDisc,
  ScoreBreakdownView,
  FormattingIssuesView,
  RecommendationsView,
} from "./components";

// ─── Type Definitions ───────────────────────────────────────────────────
export type {
  ScoreTone,
  MetricConfig,
  FormattingIssue,
  SeverityStyle,
  Recommendation,
  PriorityStyle,
  ATSAnalysisResult,
} from "./types";
