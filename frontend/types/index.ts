// ── BroadSec Type Definitions ──────────────────────────────────────────────

export type Severity = "critical" | "high" | "medium" | "low" | "informative";

export type ReportStatus =
  | "submitted"
  | "ai_triaged"
  | "under_review"
  | "valid"
  | "duplicate"
  | "out_of_scope"
  | "fixed"
  | "paid";

export interface Program {
  id: string;
  company: string;
  logo?: string;
  description: string;
  scope: string[];
  reward_min: number;   // MAD
  reward_max: number;   // MAD
  status: "active" | "paused" | "closed";
  reports_count: number;
  created_at: string;
}

export interface Report {
  id: string;
  program_id: string;
  researcher_id: string;
  researcher_handle: string;
  title: string;
  description: string;
  steps_to_reproduce: string;
  impact: string;
  severity: Severity;
  status: ReportStatus;
  cvss_score?: number;
  ai_triage?: AiTriage;
  bounty_amount?: number;
  created_at: string;
}

export interface AiTriage {
  validity: "valid" | "invalid" | "needs_more_info";
  confidence: number;           // 0-100
  vulnerability_type: string;   // e.g. "SQL Injection", "XSS"
  cvss_score: number;
  cvss_vector: string;
  is_duplicate: boolean;
  duplicate_of?: string;
  fix_suggestion: string;
  fix_code?: string;
  simple_explanation: string;   // for CEO
  technical_explanation: string; // for developer
  response_draft: string;       // to researcher
  processed_at: string;
}

export interface Researcher {
  id: string;
  handle: string;
  avatar?: string;
  reputation: number;
  reports_submitted: number;
  valid_reports: number;
  total_earned: number; // MAD
  rank: number;
  joined_at: string;
}

export interface ScanResult {
  url: string;
  scanned_at: string;
  overall_score: "A" | "B" | "C" | "D" | "F";
  vulnerabilities: ScanVulnerability[];
  ai_summary: string;
}

export interface ScanVulnerability {
  id: string;
  name: string;
  severity: Severity;
  description: string;
  ai_explanation: string;     // plain language
  ai_fix: string;             // how to fix
  affected: string;           // what's affected
  cvss_score: number;
}
