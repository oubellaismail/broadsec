// BroadSec admin dashboard and API contract types.

export type Severity = "critical" | "high" | "medium" | "low" | "informative";

export type ReportStatus =
  | "submitted"
  | "pending_triage"
  | "ai_triaged"
  | "under_review"
  | "valid"
  | "duplicate"
  | "out_of_scope"
  | "resolved"
  | "paid";

export type TriageValidity = "valid" | "needs_more_info" | "invalid";

export type SeverityLabel =
  | "Critical"
  | "High"
  | "Medium"
  | "Low"
  | "Informative";

export type ScanSeverity = "critical" | "high" | "medium" | "low";

export type ScanGrade = "A" | "B" | "C" | "D" | "F";

export type TranslateTarget = "french" | "arabic" | "darija" | "english";

export interface HealthResponse {
  status: string;
  service: string;
  version: string;
}

export interface Program {
  id: string;
  name: string;
  company: string;
  category: "Telecom" | "Banking" | "Ecommerce" | "University" | "SaaS";
  description: string;
  scope: string[];
  out_of_scope: string[];
  reward_min: number;
  reward_max: number;
  status: "active" | "paused" | "closed";
  reports_count: number;
  pending_reports: number;
  critical_reports: number;
  resolved_reports: number;
  created_at: string;
}

export interface TriageResult {
  validity: TriageValidity;
  confidence: number;
  vulnerability_type: string;
  cvss_score: number;
  cvss_vector: string;
  in_scope: boolean;
  is_duplicate: boolean;
  severity_label: SeverityLabel;
  fix_suggestion: string;
  simple_explanation: string;
  technical_explanation: string;
  response_draft: string;
  processed_at: string;
}

export interface VulnerabilityReport {
  id: string;
  program_id: string;
  program_name: string;
  reporter_id: string;
  reporter_handle: string;
  reporter_reputation: number;
  title: string;
  affected_target: string;
  domain: string;
  description: string;
  reproduction_steps: string[];
  impact: string;
  severity: Severity;
  status: ReportStatus;
  cvss_score?: number;
  bounty_amount?: number;
  submitted_at: string;
  updated_at: string;
  ai_triage?: TriageResult;
}

export interface SecurityEvent {
  id: string;
  type: "report" | "triage" | "bounty" | "program" | "scan";
  message: string;
  actor: string;
  target: string;
  severity: Severity;
  status: "open" | "investigating" | "resolved";
  created_at: string;
}

export interface Researcher {
  id: string;
  handle: string;
  avatar?: string;
  reputation: number;
  reports_submitted: number;
  valid_reports: number;
  total_earned: number;
  rank: number;
  joined_at: string;
}

export interface ScanVulnerability {
  id: string;
  name: string;
  severity: ScanSeverity;
  description: string;
  affected: string;
  cvss_score: number;
}

export interface ScanResult {
  url: string;
  scanned_at: string;
  overall_score: ScanGrade;
  total: number;
  summary: string;
  vulnerabilities: ScanVulnerability[];
}

export interface ReportResult {
  title: string;
  description: string;
  steps_to_reproduce: string;
  impact: string;
  mitigation: string;
  suggested_severity: Exclude<SeverityLabel, "Informative">;
}

export interface TranslateResult {
  original: string;
  translated: string;
  target: TranslateTarget;
}

export interface DashboardMetrics {
  total_reports: number;
  pending_triage: number;
  critical_high: number;
  resolved_reports: number;
  bounty_total_mad: number;
}

export interface TrendPoint {
  month: string;
  reports: number;
  resolved: number;
  bounty: number;
}

export interface SeverityPoint {
  severity: string;
  reports: number;
}

export interface StatusPoint {
  status: string;
  value: number;
}

export interface PortFinding {
  port: number;
  service: string;
  state: "open" | "filtered" | "closed";
  note: string;
}

export interface UserProfile {
  id: string;
  name: string;
  role: "Security Researcher" | "Company Admin" | "Platform Admin";
  country: string;
  avatar?: string;
  reputation: number;
  points: number;
}

export interface ProgramScope {
  id: string;
  domain: string;
  type: "Web" | "API" | "Mobile" | "Cloud";
  status: "In Scope" | "Out of Scope";
}

export interface RewardRange {
  severity: Exclude<SeverityLabel, "Informative">;
  minMad: number;
  maxMad: number;
  minPoints: number;
  maxPoints: number;
}

export interface HackerProgram {
  id: string;
  code: string;
  name: string;
  companyName: string;
  description: string;
  status: "Open" | "Paused" | "Private";
  riskLevel: "Critical" | "High" | "Medium" | "Low";
  scopes: ProgramScope[];
  rewardRanges: RewardRange[];
  startDate: string;
  endDate: string;
  submittedReports: number;
  logoTone: "blue" | "cyan" | "violet" | "emerald" | "amber" | "slate";
}

export interface ReportAttachment {
  id: string;
  name: string;
  type: "screenshot" | "poc" | "log" | "other";
  sizeKb: number;
}

export interface AIReportSuggestion {
  improvedSummary: string;
  recommendedSeverity: Exclude<SeverityLabel, "Informative">;
  suggestedFix: string;
  duplicateSuspicion: boolean;
}

export type SubmittedReportStatus =
  | "Under Review"
  | "Accepted"
  | "Duplicate"
  | "Rejected"
  | "Fixed";

export interface SubmittedReport {
  id: string;
  programId: string;
  hackerId: string;
  title: string;
  severity: Exclude<SeverityLabel, "Informative">;
  status: SubmittedReportStatus;
  affectedAsset: string;
  summary: string;
  stepsToReproduce: string;
  impact: string;
  remediation: string;
  attachments: ReportAttachment[];
  aiSuggestion?: AIReportSuggestion;
  rewardMad: number;
  createdAt: string;
  updatedAt: string;
}

export interface HackerReward {
  id: string;
  reportId: string;
  hackerId: string;
  amountMad: number;
  status: "Pending" | "Paid";
  points: number;
  createdAt: string;
}

// Backwards-compatible aliases for older local modules.
export type Report = VulnerabilityReport;
export type AiTriage = TriageResult;
export type ScannerResult = ScanResult;
