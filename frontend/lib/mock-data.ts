// ── Placeholder data for demo ──────────────────────────────────────────────
// Realistic Moroccan researchers, companies, and reports for the leaderboard
// and programs page. Replace with real Firestore data post-hackathon.

import type { Researcher, Program, Report } from "@/types";

export const MOCK_RESEARCHERS: Researcher[] = [
  { id: "1", handle: "r4bb1t_ma",    reputation: 9840, reports_submitted: 47, valid_reports: 38, total_earned: 28500, rank: 1, joined_at: "2024-11-01" },
  { id: "2", handle: "0xKarim",       reputation: 7210, reports_submitted: 31, valid_reports: 25, total_earned: 18200, rank: 2, joined_at: "2024-12-15" },
  { id: "3", handle: "nadir_sec",     reputation: 6540, reports_submitted: 28, valid_reports: 22, total_earned: 14700, rank: 3, joined_at: "2025-01-08" },
  { id: "4", handle: "atlas_h4ck",   reputation: 5890, reports_submitted: 24, valid_reports: 19, total_earned: 11300, rank: 4, joined_at: "2025-01-20" },
  { id: "5", handle: "f4tiha_bug",    reputation: 4320, reports_submitted: 19, valid_reports: 15, total_earned: 8900,  rank: 5, joined_at: "2025-02-03" },
  { id: "6", handle: "casabl4nco",    reputation: 3780, reports_submitted: 17, valid_reports: 13, total_earned: 7200,  rank: 6, joined_at: "2025-02-17" },
  { id: "7", handle: "m3dina_ghost",  reputation: 2940, reports_submitted: 14, valid_reports: 10, total_earned: 5600,  rank: 7, joined_at: "2025-03-01" },
  { id: "8", handle: "r1f_pwner",     reputation: 2110, reports_submitted: 11, valid_reports: 8,  total_earned: 4100,  rank: 8, joined_at: "2025-03-15" },
];

export const MOCK_PROGRAMS: Program[] = [
  {
    id: "p1",
    company: "Maroc Telecom",
    logo: "/images/mt.png",
    description: "Protect Morocco's largest telecom operator. Focus on customer portal, API endpoints, and internal tools.",
    scope: ["*.iam.ma", "api.iam.ma", "portail.iam.ma"],
    reward_min: 500,
    reward_max: 15000,
    status: "active",
    reports_count: 23,
    created_at: "2025-03-01",
  },
  {
    id: "p2",
    company: "Attijariwafa Bank",
    logo: "/images/awb.png",
    description: "Secure Morocco's leading bank. High rewards for authentication bypass, IDOR, and financial logic flaws.",
    scope: ["*.attijariwafabank.com", "app.wafacash.com"],
    reward_min: 1000,
    reward_max: 25000,
    status: "active",
    reports_count: 15,
    created_at: "2025-03-10",
  },
  {
    id: "p3",
    company: "Universiapolis Agadir",
    logo: "/images/uni.png",
    description: "Help secure Morocco's international university. Student portals, e-learning platforms, admin systems.",
    scope: ["*.universiapolis.ma", "elearning.universiapolis.ma"],
    reward_min: 200,
    reward_max: 5000,
    status: "active",
    reports_count: 8,
    created_at: "2025-04-01",
  },
];

export const MOCK_REPORTS: Report[] = [
  {
    id: "r1",
    program_id: "p1",
    researcher_id: "1",
    researcher_handle: "r4bb1t_ma",
    title: "SQL Injection in IAM Customer Portal Login",
    description: "The login endpoint at portail.iam.ma/auth accepts unsanitized user input.",
    steps_to_reproduce: "1. Navigate to portail.iam.ma/login\n2. Enter: ' OR 1=1 --\n3. Observe full database access",
    impact: "Complete authentication bypass. Access to 3M+ customer records.",
    severity: "critical",
    status: "fixed",
    cvss_score: 9.8,
    bounty_amount: 12000,
    created_at: "2025-04-10",
    ai_triage: {
      validity: "valid",
      confidence: 98,
      vulnerability_type: "SQL Injection",
      cvss_score: 9.8,
      cvss_vector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H",
      is_duplicate: false,
      fix_suggestion: "Use parameterized queries / prepared statements",
      fix_code: "// Before:\nconst q = `SELECT * FROM users WHERE email='${email}'`\n// After:\nconst q = db.prepare('SELECT * FROM users WHERE email=?').get(email)",
      simple_explanation: "C'est comme laisser la porte de votre coffre-fort ouverte — n'importe qui peut entrer et tout prendre. Un hacker peut accéder aux données de tous vos clients.",
      technical_explanation: "Unsanitized string interpolation in SQL query at /auth/login line 47. Allows UNION-based injection and auth bypass.",
      response_draft: "Thank you for this critical report. We have confirmed the SQL injection vulnerability and have assigned it a CVSS score of 9.8. Our team is working on a fix. You will receive a bounty of 12,000 MAD upon resolution.",
      processed_at: "2025-04-10T08:32:11Z",
    },
  },
];

export const PLATFORM_STATS = {
  vulnerabilities_found: 124,
  companies_protected:    12,
  researchers_active:     847,
  triage_seconds:          3,
  total_paid_mad:        187400,
};
