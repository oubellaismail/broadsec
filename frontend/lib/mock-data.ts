import type {
  DashboardMetrics,
  AIReportSuggestion,
  HackerProgram,
  HackerReward,
  HealthResponse,
  PortFinding,
  Program,
  ReportResult,
  SubmittedReport,
  ScanResult,
  SecurityEvent,
  SeverityPoint,
  StatusPoint,
  TranslateResult,
  TranslateTarget,
  TrendPoint,
  TriageResult,
  UserProfile,
  VulnerabilityReport,
} from "@/types";

const processedAt = "2026-05-17T10:24:00.000000+00:00";

export const BROADSEC_PROGRAMS: Program[] = [
  {
    id: "prog-atlas-telecom",
    name: "Atlas Telecom VDP",
    company: "Atlas Telecom Demo",
    category: "Telecom",
    description:
      "Customer self-care, prepaid recharge, and partner API surfaces for a fictional Moroccan telecom operator.",
    scope: [
      "*.atlas-telecom.example.ma",
      "api.atlas-telecom.example.ma",
      "recharge.atlas-telecom.example.ma",
    ],
    out_of_scope: ["Physical stores", "Social engineering", "Third-party CDNs"],
    reward_min: 500,
    reward_max: 22000,
    status: "active",
    reports_count: 42,
    pending_reports: 9,
    critical_reports: 3,
    resolved_reports: 21,
    created_at: "2026-02-04",
  },
  {
    id: "prog-banque-atlas",
    name: "Banque Atlas Digital",
    company: "Banque Atlas Demo",
    category: "Banking",
    description:
      "Internet banking, merchant dashboard, and mobile API demo scope with stricter evidence requirements.",
    scope: [
      "banking.banque-atlas.example.ma",
      "api.banque-atlas.example.ma",
      "merchant.banque-atlas.example.ma",
    ],
    out_of_scope: ["Real payment networks", "Denial of service", "Employee accounts"],
    reward_min: 1000,
    reward_max: 35000,
    status: "active",
    reports_count: 31,
    pending_reports: 6,
    critical_reports: 2,
    resolved_reports: 18,
    created_at: "2026-02-18",
  },
  {
    id: "prog-souqna",
    name: "Souqna Commerce",
    company: "Souqna Demo Marketplace",
    category: "Ecommerce",
    description:
      "Marketplace web app, seller console, order APIs, and loyalty features for a fictional ecommerce platform.",
    scope: [
      "www.souqna.example.ma",
      "seller.souqna.example.ma",
      "api.souqna.example.ma",
    ],
    out_of_scope: ["Spam testing", "Coupon abuse without security impact", "Rate-limit stress tests"],
    reward_min: 300,
    reward_max: 16000,
    status: "active",
    reports_count: 25,
    pending_reports: 5,
    critical_reports: 1,
    resolved_reports: 13,
    created_at: "2026-03-09",
  },
  {
    id: "prog-rabat-university",
    name: "Rabat University Portal",
    company: "Rabat University Demo",
    category: "University",
    description:
      "Student portal, admissions workflow, and e-learning demo targets for academic security testing.",
    scope: [
      "portal.rabat-university.example.ma",
      "learn.rabat-university.example.ma",
      "admissions.rabat-university.example.ma",
    ],
    out_of_scope: ["Student devices", "Campus networks", "Phishing simulations"],
    reward_min: 200,
    reward_max: 8000,
    status: "active",
    reports_count: 18,
    pending_reports: 4,
    critical_reports: 0,
    resolved_reports: 10,
    created_at: "2026-03-27",
  },
];

export const MOCK_TRIAGE_RESULT: TriageResult = {
  validity: "valid",
  confidence: 88,
  vulnerability_type: "Insecure Direct Object Reference",
  cvss_score: 8.1,
  cvss_vector: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:N",
  in_scope: true,
  is_duplicate: false,
  severity_label: "High",
  fix_suggestion:
    "Enforce object-level authorization on every request and verify the authenticated user owns the requested resource before returning data.",
  simple_explanation:
    "The report shows that one user can access another user's private resource by changing an identifier. That creates direct customer privacy and trust risk.",
  technical_explanation:
    "The endpoint accepts a predictable account identifier and performs authentication without an ownership check before returning the object.",
  response_draft:
    "Thank you for the clear report. BroadSec triage reproduced the authorization issue on the demo target and classified it as High severity. We are moving it to engineering review and will update the researcher after remediation validation.",
  processed_at: processedAt,
};

export const BROADSEC_REPORTS: VulnerabilityReport[] = [
  {
    id: "BSR-1029",
    program_id: "prog-banque-atlas",
    program_name: "Banque Atlas Digital",
    reporter_id: "res-amine",
    reporter_handle: "amine0x",
    reporter_reputation: 9140,
    title: "IDOR exposes another customer's statement metadata",
    affected_target: "banking.banque-atlas.example.ma/statements",
    domain: "banking.banque-atlas.example.ma",
    description:
      "A demo account can request another statement metadata object by changing a numeric identifier in the request path.",
    reproduction_steps: [
      "Log in with the provided demo researcher account.",
      "Open the statement metadata request in the browser dev tools.",
      "Change the object id to another demo id from the same test tenant.",
      "Observe that metadata is returned without an ownership check.",
    ],
    impact:
      "A low-privileged authenticated user could enumerate statement metadata for other demo customers, exposing transaction dates and document references.",
    severity: "high",
    status: "under_review",
    cvss_score: 8.1,
    bounty_amount: 12000,
    submitted_at: "2026-05-15T09:34:00+01:00",
    updated_at: "2026-05-16T14:20:00+01:00",
    ai_triage: MOCK_TRIAGE_RESULT,
  },
  {
    id: "BSR-1028",
    program_id: "prog-atlas-telecom",
    program_name: "Atlas Telecom VDP",
    reporter_id: "res-salma",
    reporter_handle: "salma_sec",
    reporter_reputation: 7630,
    title: "Missing HSTS on recharge portal",
    affected_target: "recharge.atlas-telecom.example.ma",
    domain: "recharge.atlas-telecom.example.ma",
    description:
      "The recharge portal accepts HTTPS but does not return Strict-Transport-Security, leaving repeat visitors without browser-enforced HTTPS.",
    reproduction_steps: [
      "Send a safe HEAD request to the demo recharge host.",
      "Inspect response headers.",
      "Confirm Strict-Transport-Security is absent.",
    ],
    impact:
      "Users on hostile networks have weaker protection against protocol downgrade attempts and session exposure.",
    severity: "high",
    status: "pending_triage",
    cvss_score: 7.4,
    bounty_amount: 7000,
    submitted_at: "2026-05-15T16:02:00+01:00",
    updated_at: "2026-05-15T16:02:00+01:00",
  },
  {
    id: "BSR-1027",
    program_id: "prog-souqna",
    program_name: "Souqna Commerce",
    reporter_id: "res-youssef",
    reporter_handle: "youssef_appsec",
    reporter_reputation: 6815,
    title: "Stored XSS in seller profile display name",
    affected_target: "seller.souqna.example.ma/profile",
    domain: "seller.souqna.example.ma",
    description:
      "The seller profile preview renders a submitted display name without output encoding in a demo seller account.",
    reproduction_steps: [
      "Open the seller profile edit page with a demo seller account.",
      "Enter a benign script-marker payload in the display name field.",
      "Save and view the public seller preview.",
      "Confirm the value is rendered as HTML instead of text.",
    ],
    impact:
      "A malicious seller could run JavaScript in another user's browser inside the demo marketplace context.",
    severity: "critical",
    status: "ai_triaged",
    cvss_score: 9.0,
    bounty_amount: 15000,
    submitted_at: "2026-05-14T11:25:00+01:00",
    updated_at: "2026-05-16T10:10:00+01:00",
    ai_triage: {
      ...MOCK_TRIAGE_RESULT,
      vulnerability_type: "Stored Cross-Site Scripting",
      cvss_score: 9.0,
      cvss_vector: "CVSS:3.1/AV:N/AC:L/PR:L/UI:R/S:C/C:H/I:H/A:N",
      severity_label: "Critical",
      fix_suggestion:
        "Encode seller-controlled fields before rendering and apply a strict Content Security Policy to reduce script execution impact.",
    },
  },
  {
    id: "BSR-1026",
    program_id: "prog-rabat-university",
    program_name: "Rabat University Portal",
    reporter_id: "res-hajar",
    reporter_handle: "hajar_testlab",
    reporter_reputation: 4590,
    title: "Admissions upload accepts executable file extension",
    affected_target: "admissions.rabat-university.example.ma/upload",
    domain: "admissions.rabat-university.example.ma",
    description:
      "The admissions document upload validates only the MIME type sent by the browser and does not enforce an allowlist extension.",
    reproduction_steps: [
      "Open the admissions demo upload form.",
      "Upload a harmless text file renamed with an executable extension.",
      "Observe that the file is accepted and stored.",
    ],
    impact:
      "Unsafe files could be stored in the admissions workflow and later handled by staff systems.",
    severity: "medium",
    status: "resolved",
    cvss_score: 5.4,
    bounty_amount: 2400,
    submitted_at: "2026-05-11T13:18:00+01:00",
    updated_at: "2026-05-13T09:05:00+01:00",
  },
  {
    id: "BSR-1025",
    program_id: "prog-atlas-telecom",
    program_name: "Atlas Telecom VDP",
    reporter_id: "res-karim",
    reporter_handle: "karim_bh",
    reporter_reputation: 8175,
    title: "CSP missing on customer self-care portal",
    affected_target: "selfcare.atlas-telecom.example.ma",
    domain: "selfcare.atlas-telecom.example.ma",
    description:
      "The self-care portal does not define Content-Security-Policy, increasing the impact of future injection bugs.",
    reproduction_steps: [
      "Send a safe HEAD request to the customer self-care host.",
      "Review response headers.",
      "Confirm Content-Security-Policy is absent.",
    ],
    impact:
      "The missing defense-in-depth header makes browser-side injection issues easier to exploit.",
    severity: "medium",
    status: "duplicate",
    cvss_score: 6.1,
    bounty_amount: 0,
    submitted_at: "2026-05-08T18:30:00+01:00",
    updated_at: "2026-05-09T08:44:00+01:00",
  },
  {
    id: "BSR-1024",
    program_id: "prog-souqna",
    program_name: "Souqna Commerce",
    reporter_id: "res-nora",
    reporter_handle: "nora_web",
    reporter_reputation: 3920,
    title: "Verbose server header on API edge",
    affected_target: "api.souqna.example.ma",
    domain: "api.souqna.example.ma",
    description:
      "The demo API edge returns detailed server version information in the Server header.",
    reproduction_steps: [
      "Send a safe HEAD request to the demo API edge.",
      "Inspect the Server response header.",
      "Confirm the version string is exposed.",
    ],
    impact:
      "Detailed version disclosure can help attackers prioritize known issues against the exposed stack.",
    severity: "low",
    status: "paid",
    cvss_score: 3.5,
    bounty_amount: 500,
    submitted_at: "2026-04-29T10:40:00+01:00",
    updated_at: "2026-05-02T12:00:00+01:00",
  },
];

export const BROADSEC_EVENTS: SecurityEvent[] = [
  {
    id: "EVT-410",
    type: "triage",
    message: "AI triage classified BSR-1029 as High with 88% confidence",
    actor: "BroadSec AI",
    target: "Banque Atlas Digital",
    severity: "high",
    status: "investigating",
    created_at: "2026-05-16T14:20:00+01:00",
  },
  {
    id: "EVT-409",
    type: "report",
    message: "New vulnerability submitted for Atlas Telecom VDP",
    actor: "salma_sec",
    target: "recharge.atlas-telecom.example.ma",
    severity: "high",
    status: "open",
    created_at: "2026-05-15T16:02:00+01:00",
  },
  {
    id: "EVT-408",
    type: "bounty",
    message: "2,400 MAD bounty approved after remediation validation",
    actor: "Admin",
    target: "Rabat University Portal",
    severity: "medium",
    status: "resolved",
    created_at: "2026-05-13T09:05:00+01:00",
  },
  {
    id: "EVT-407",
    type: "scan",
    message: "Header scan found missing CSP on a marketplace demo asset",
    actor: "Scanner",
    target: "seller.souqna.example.ma",
    severity: "medium",
    status: "investigating",
    created_at: "2026-05-12T17:10:00+01:00",
  },
  {
    id: "EVT-406",
    type: "program",
    message: "University scope updated with admissions demo host",
    actor: "Program Manager",
    target: "Rabat University Portal",
    severity: "informative",
    status: "resolved",
    created_at: "2026-05-10T08:15:00+01:00",
  },
];

export const DASHBOARD_TRENDS: TrendPoint[] = [
  { month: "Jan", reports: 18, resolved: 10, bounty: 32000 },
  { month: "Feb", reports: 24, resolved: 13, bounty: 41000 },
  { month: "Mar", reports: 29, resolved: 16, bounty: 53000 },
  { month: "Apr", reports: 33, resolved: 21, bounty: 65000 },
  { month: "May", reports: 38, resolved: 24, bounty: 71400 },
];

export const SEVERITY_DISTRIBUTION: SeverityPoint[] = [
  { severity: "Critical", reports: 4 },
  { severity: "High", reports: 13 },
  { severity: "Medium", reports: 19 },
  { severity: "Low", reports: 9 },
];

export const STATUS_DISTRIBUTION: StatusPoint[] = [
  { status: "Pending", value: 15 },
  { status: "Review", value: 18 },
  { status: "Resolved", value: 24 },
  { status: "Duplicate", value: 6 },
  { status: "Paid", value: 11 },
];

export const FALLBACK_HEALTH: HealthResponse = {
  status: "offline",
  service: "broadsec-api",
  version: "mock",
};

export const fallbackScanResult = (url: string): ScanResult => ({
  url: url || "https://demo.broadsec.local",
  scanned_at: processedAt,
  overall_score: "C",
  total: 4,
  summary: "Found 4 demo issue(s) - 0 critical, 1 high.",
  vulnerabilities: [
    {
      id: "hdr-1",
      name: "Missing HSTS Header",
      severity: "high",
      description:
        "The site does not enforce HTTPS with Strict-Transport-Security.",
      affected: url || "https://demo.broadsec.local",
      cvss_score: 7.4,
    },
    {
      id: "hdr-2",
      name: "Missing Content Security Policy",
      severity: "medium",
      description:
        "No CSP header was found, reducing browser-side protection against script injection.",
      affected: url || "https://demo.broadsec.local",
      cvss_score: 6.1,
    },
    {
      id: "hdr-3",
      name: "Clickjacking Vulnerability",
      severity: "medium",
      description:
        "The page can be embedded in a frame because clickjacking protections are missing.",
      affected: url || "https://demo.broadsec.local",
      cvss_score: 5.4,
    },
    {
      id: "ssl-4",
      name: "SSL Certificate Expiring Soon",
      severity: "medium",
      description:
        "The certificate is within the renewal window and should be rotated before expiry.",
      affected: url || "demo.broadsec.local",
      cvss_score: 5.3,
    },
  ],
});

export const FALLBACK_REPORT_RESULT: ReportResult = {
  title: "IDOR Allows Access to Another Demo Account Resource",
  description:
    "A request parameter controls which account resource is returned, but the backend does not verify object ownership before responding.",
  steps_to_reproduce:
    "1. Log in with a demo researcher account\n2. Open the account resource request\n3. Replace the resource id with another demo id\n4. Observe that another account resource is returned",
  impact:
    "A low-privileged user could access private metadata belonging to another demo user.",
  mitigation:
    "Add server-side object-level authorization and return 403 when the authenticated user does not own the requested resource.",
  suggested_severity: "High",
};

export const fallbackTranslateResult = (
  text: string,
  target: TranslateTarget
): TranslateResult => ({
  original: text,
  translated:
    target === "english"
      ? "Demo translation of the security content, preserving technical terms in English."
      : "Demo translation fallback. The backend translation endpoint is unavailable, so this English placeholder is shown.",
  target,
});

export const MOCK_PORT_FINDINGS: PortFinding[] = [
  {
    port: 443,
    service: "HTTPS",
    state: "open",
    note: "Demo service inventory. The documented /scan endpoint does not return port data.",
  },
  {
    port: 80,
    service: "HTTP",
    state: "filtered",
    note: "Redirect behavior should be verified from the backend scanner if port data is added later.",
  },
];

export const getDashboardMetrics = (
  reports: VulnerabilityReport[] = BROADSEC_REPORTS
): DashboardMetrics => ({
  total_reports: reports.length,
  pending_triage: reports.filter((report) =>
    ["submitted", "pending_triage"].includes(report.status)
  ).length,
  critical_high: reports.filter((report) =>
    ["critical", "high"].includes(report.severity)
  ).length,
  resolved_reports: reports.filter((report) =>
    ["resolved", "paid"].includes(report.status)
  ).length,
  bounty_total_mad: reports.reduce(
    (total, report) => total + (report.bounty_amount ?? 0),
    0
  ),
});

export const DEMO_HACKER_USER: UserProfile = {
  id: "user-a-chaoui",
  name: "A. Chaoui",
  role: "Security Researcher",
  country: "Morocco",
  reputation: 4280,
  points: 185,
};

export const HACKER_REWARD_RANGES = [
  {
    severity: "Critical",
    minMad: 3780,
    maxMad: 5000,
    minPoints: 20,
    maxPoints: 100,
  },
  {
    severity: "High",
    minMad: 2043,
    maxMad: 3672,
    minPoints: 15,
    maxPoints: 50,
  },
  {
    severity: "Medium",
    minMad: 788,
    maxMad: 1978,
    minPoints: 10,
    maxPoints: 30,
  },
  {
    severity: "Low",
    minMad: 0,
    maxMad: 500,
    minPoints: 5,
    maxPoints: 20,
  },
] satisfies HackerProgram["rewardRanges"];

export const HACKER_PROGRAMS: HackerProgram[] = [
  {
    id: "maroc-telecom-security",
    code: "BRDSEC-3418",
    name: "Maroc Telecom Security Program",
    companyName: "Maroc Telecom Demo Group",
    description:
      "A fictional telecom security program for customer portals, recharge flows, and public APIs.",
    status: "Open",
    riskLevel: "High",
    scopes: [
      { id: "scope-tel-web", domain: "telecom.example.ma", type: "Web", status: "In Scope" },
      { id: "scope-tel-api", domain: "api.telecom.example.ma", type: "API", status: "In Scope" },
    ],
    rewardRanges: HACKER_REWARD_RANGES,
    startDate: "2026-04-01",
    endDate: "2026-12-31",
    submittedReports: 48,
    logoTone: "blue",
  },
  {
    id: "atlasshop-bug-bounty",
    code: "BRDSEC-2844",
    name: "AtlasShop Bug Bounty",
    companyName: "AtlasShop Demo Marketplace",
    description:
      "A safe ecommerce demo scope covering storefront, seller dashboard, checkout, and order APIs.",
    status: "Open",
    riskLevel: "Critical",
    scopes: [
      { id: "scope-shop-web", domain: "shop.example.ma", type: "Web", status: "In Scope" },
      { id: "scope-shop-api", domain: "api.shop.example.ma", type: "API", status: "In Scope" },
    ],
    rewardRanges: HACKER_REWARD_RANGES,
    startDate: "2026-03-15",
    endDate: "2026-12-15",
    submittedReports: 36,
    logoTone: "cyan",
  },
  {
    id: "agadir-university-disclosure",
    code: "BRDSEC-1197",
    name: "Agadir University Responsible Disclosure",
    companyName: "Agadir University Demo",
    description:
      "A responsible disclosure program for student portal, admissions, and learning platform demo assets.",
    status: "Open",
    riskLevel: "Medium",
    scopes: [
      { id: "scope-uni-web", domain: "university.example.ma", type: "Web", status: "In Scope" },
      { id: "scope-uni-api", domain: "learn.university.example.ma", type: "Web", status: "In Scope" },
    ],
    rewardRanges: HACKER_REWARD_RANGES,
    startDate: "2026-02-20",
    endDate: "2026-10-31",
    submittedReports: 19,
    logoTone: "violet",
  },
  {
    id: "atlas-bank-digital-security",
    code: "BRDSEC-6052",
    name: "Atlas Bank Digital Security",
    companyName: "Atlas Bank Demo",
    description:
      "A fictional banking program focused on digital banking, merchant flows, and authorization controls.",
    status: "Open",
    riskLevel: "Critical",
    scopes: [
      { id: "scope-bank-web", domain: "bank.example.ma", type: "Web", status: "In Scope" },
      { id: "scope-bank-api", domain: "api.bank.example.ma", type: "API", status: "In Scope" },
    ],
    rewardRanges: HACKER_REWARD_RANGES,
    startDate: "2026-01-12",
    endDate: "2026-12-31",
    submittedReports: 57,
    logoTone: "emerald",
  },
  {
    id: "casapay-fintech-program",
    code: "BRDSEC-7721",
    name: "CasaPay Fintech Program",
    companyName: "CasaPay Demo",
    description:
      "A fintech demo program for wallet workflows, merchant onboarding, and public payment APIs.",
    status: "Open",
    riskLevel: "High",
    scopes: [
      { id: "scope-pay-web", domain: "casapay.example.ma", type: "Web", status: "In Scope" },
      { id: "scope-pay-api", domain: "api.casapay.example.ma", type: "API", status: "In Scope" },
    ],
    rewardRanges: HACKER_REWARD_RANGES,
    startDate: "2026-04-10",
    endDate: "2026-11-30",
    submittedReports: 28,
    logoTone: "amber",
  },
  {
    id: "maghrebcloud-security",
    code: "BRDSEC-9304",
    name: "MaghrebCloud Security Program",
    companyName: "MaghrebCloud Demo",
    description:
      "A cloud SaaS demo scope for tenant isolation, console access control, and API hardening.",
    status: "Open",
    riskLevel: "High",
    scopes: [
      { id: "scope-cloud-web", domain: "cloud.example.ma", type: "Cloud", status: "In Scope" },
      { id: "scope-cloud-api", domain: "api.cloud.example.ma", type: "API", status: "In Scope" },
    ],
    rewardRanges: HACKER_REWARD_RANGES,
    startDate: "2026-05-01",
    endDate: "2027-01-31",
    submittedReports: 14,
    logoTone: "slate",
  },
];

export const DEFAULT_AI_REPORT_SUGGESTION: AIReportSuggestion = {
  improvedSummary:
    "The report describes a reproducible authorization weakness on an in-scope demo asset. The affected endpoint should validate object ownership before returning sensitive data.",
  recommendedSeverity: "High",
  suggestedFix:
    "Add server-side authorization checks for every object access and include regression tests for cross-account access attempts.",
  duplicateSuspicion: false,
};

export const SUBMITTED_REPORTS: SubmittedReport[] = [
  {
    id: "HREP-2041",
    programId: "atlas-bank-digital-security",
    hackerId: DEMO_HACKER_USER.id,
    title: "IDOR in statement metadata endpoint",
    severity: "High",
    status: "Under Review",
    affectedAsset: "bank.example.ma",
    summary:
      "A demo banking user can request statement metadata belonging to another demo account by changing an object identifier.",
    stepsToReproduce:
      "1. Sign in with the provided demo account\n2. Open the statement metadata request\n3. Replace the object id with another demo id\n4. Observe metadata returned for the other account",
    impact:
      "An authenticated user could access private document metadata for another account in the demo environment.",
    remediation:
      "Enforce object-level authorization before returning statement metadata.",
    attachments: [
      { id: "att-1", name: "request-response.png", type: "screenshot", sizeKb: 420 },
    ],
    aiSuggestion: DEFAULT_AI_REPORT_SUGGESTION,
    rewardMad: 3200,
    createdAt: "2026-05-12",
    updatedAt: "2026-05-16",
  },
  {
    id: "HREP-2032",
    programId: "atlasshop-bug-bounty",
    hackerId: DEMO_HACKER_USER.id,
    title: "Stored XSS in seller display name",
    severity: "Critical",
    status: "Accepted",
    affectedAsset: "shop.example.ma",
    summary:
      "Seller-controlled profile text is rendered as HTML in a marketplace preview page.",
    stepsToReproduce:
      "1. Sign in to a demo seller account\n2. Update the display name with a harmless script marker\n3. Save and open the seller preview\n4. Confirm the value is rendered as markup",
    impact:
      "A malicious seller could execute JavaScript in another user's browser in the demo marketplace context.",
    remediation:
      "Encode seller-controlled output and enforce a stricter Content Security Policy.",
    attachments: [
      { id: "att-2", name: "seller-preview.png", type: "screenshot", sizeKb: 610 },
    ],
    rewardMad: 5000,
    createdAt: "2026-04-27",
    updatedAt: "2026-05-08",
  },
  {
    id: "HREP-2019",
    programId: "maroc-telecom-security",
    hackerId: DEMO_HACKER_USER.id,
    title: "Missing HSTS on recharge portal",
    severity: "High",
    status: "Fixed",
    affectedAsset: "telecom.example.ma",
    summary:
      "The demo telecom recharge portal does not return Strict-Transport-Security.",
    stepsToReproduce:
      "1. Send a safe HEAD request to telecom.example.ma\n2. Inspect the response headers\n3. Confirm Strict-Transport-Security is missing",
    impact:
      "Users receive weaker browser protection against protocol downgrade attempts.",
    remediation:
      "Return a Strict-Transport-Security header with an appropriate max-age after HTTPS validation.",
    attachments: [],
    rewardMad: 2600,
    createdAt: "2026-04-18",
    updatedAt: "2026-05-01",
  },
  {
    id: "HREP-1987",
    programId: "casapay-fintech-program",
    hackerId: DEMO_HACKER_USER.id,
    title: "Duplicate CSP report on wallet dashboard",
    severity: "Medium",
    status: "Duplicate",
    affectedAsset: "casapay.example.ma",
    summary:
      "The wallet dashboard was missing a Content Security Policy, matching an existing accepted report.",
    stepsToReproduce:
      "1. Open the demo wallet dashboard\n2. Inspect response headers\n3. Confirm Content-Security-Policy is absent",
    impact:
      "The issue reduces browser defense-in-depth but was already tracked by the program.",
    remediation:
      "Deploy the existing CSP remediation tracked by the program team.",
    attachments: [],
    rewardMad: 0,
    createdAt: "2026-03-29",
    updatedAt: "2026-04-02",
  },
];

export const HACKER_REWARDS: HackerReward[] = [
  {
    id: "reward-1001",
    reportId: "HREP-2032",
    hackerId: DEMO_HACKER_USER.id,
    amountMad: 5000,
    status: "Paid",
    points: 100,
    createdAt: "2026-05-08",
  },
  {
    id: "reward-1002",
    reportId: "HREP-2019",
    hackerId: DEMO_HACKER_USER.id,
    amountMad: 2600,
    status: "Paid",
    points: 40,
    createdAt: "2026-05-01",
  },
  {
    id: "reward-1003",
    reportId: "HREP-2041",
    hackerId: DEMO_HACKER_USER.id,
    amountMad: 3200,
    status: "Pending",
    points: 45,
    createdAt: "2026-05-16",
  },
];

// Legacy export names kept so older hackathon components continue to compile.
export const MOCK_PROGRAMS = BROADSEC_PROGRAMS;
export const MOCK_REPORTS = BROADSEC_REPORTS;
export const PLATFORM_STATS = {
  vulnerabilities_found: 124,
  companies_protected: BROADSEC_PROGRAMS.length,
  researchers_active: 847,
  triage_seconds: 3,
  total_paid_mad: getDashboardMetrics().bounty_total_mad,
};
