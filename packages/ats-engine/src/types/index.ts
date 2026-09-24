/**
 * FOREWORK ATS Engine — Core Type Definitions
 * @package @jashan-randhawa/forework-ats-engine
 */

// ─── Score Tone Classification ──────────────────────────────────────────

export interface ScoreTone {
  /** Human-readable compatibility label */
  label: string;
  /** Short badge text (e.g., "Excellent", "Good", "Action Needed") */
  badge: string;
  /** Border color hex for gauge ring */
  borderColor: string;
  /** Background fill color hex */
  bgColor: string;
  /** Primary text color hex */
  textColor: string;
  /** Badge background color hex */
  badgeBg: string;
  /** Badge text color hex */
  badgeText: string;
}

// ─── Score Breakdown ────────────────────────────────────────────────────

export interface MetricConfig {
  /** Unique key identifier for this metric (e.g., "parsing", "job_match") */
  key: string;
  /** Display label */
  label: string;
  /** Maximum score for this metric */
  max: number;
  /** Icon name for UI rendering */
  icon: string;
  /** Explanation of what this metric measures */
  description: string;
}

// ─── Formatting Issues ──────────────────────────────────────────────────

export interface FormattingIssue {
  /** Severity level: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" */
  severity: string;
  /** Issue description message */
  message: string;
  /** Optional remediation recommendation */
  recommendation?: string;
}

export interface SeverityStyle {
  label: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  iconColor: string;
}

// ─── Recommendations ────────────────────────────────────────────────────

export interface Recommendation {
  /** Priority level: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" */
  priority: string;
  /** Optimization category */
  category?: string;
  /** Recommendation title */
  title: string;
  /** Detailed description */
  description: string;
  /** Actionable remediation tip */
  actionable_tip?: string;
}

export interface PriorityStyle {
  badge: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  accentColor: string;
}

// ─── Analysis Results ───────────────────────────────────────────────────

export interface ATSAnalysisResult {
  success: boolean;
  overall_score: number;
  ats_compatibility_score?: number;
  job_match_score?: number | null;
  confidence?: {
    extraction: number;
    matching: number;
  };
  breakdown?: Record<string, number>;
  breakdown_explanations?: Record<string, string>;
  explanation?: string;
  skills?: {
    matched: string[];
    missing_required: string[];
    missing_preferred: string[];
  };
  formatting_issues?: FormattingIssue[];
  recommendations?: Recommendation[];
  analysis_json?: {
    breakdown_reasons?: Record<string, string>;
  };
}
