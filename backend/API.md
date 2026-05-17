# BroadSec Backend API — UI Integration Reference

> Full request + response contract for every endpoint.  
> Read this before wiring any fetch/axios call in the frontend.

---

## Setup

| | Local dev | Production |
|--|-----------|------------|
| **Base URL** | `http://localhost:8000` | `https://<cloud-run-url>` |
| **Env var** | — | `NEXT_PUBLIC_API_URL` in `.env.local` |

All requests and responses are **JSON**.  
All POST requests require the header: `Content-Type: application/json`

### Recommended fetch wrapper (TypeScript)

```ts
const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function api<T>(path: string, body?: object): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    method: body ? "POST" : "GET",
    headers: body ? { "Content-Type": "application/json" } : {},
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail ?? "API error");
  }
  return res.json();
}
```

---

## Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/health` | Backend reachability check |
| POST | `/scan` | Security scan (headers + SSL) |
| POST | `/triage` | AI triage of a bug report |
| POST | `/report` | Convert rough notes to professional report |
| POST | `/translate` | Translate security content (FR / AR / Darija / EN) |

---

## GET `/health`

### Request

```
GET /health
```

No body, no headers needed.

### Response `200`

```json
{
  "status": "ok",
  "service": "broadsec-api",
  "version": "1.0.0"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `status` | `string` | Always `"ok"` when backend is up |
| `service` | `string` | Service identifier |
| `version` | `string` | API version |

### TypeScript usage

```ts
const health = await api<{ status: string }>("/health");
if (health.status !== "ok") showOfflineBanner();
```

---

## POST `/scan`

Scans a URL for security misconfigurations.  
Checks: **HTTP security headers** (HSTS, CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, Server version disclosure) and **SSL certificate validity/expiry**.  
Response time: typically **< 1 second**.

### Request

```
POST /scan
Content-Type: application/json
```

```json
{
  "url": "https://example.com"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `url` | `string` | Yes | Full URL or bare domain. Bare domains are auto-prefixed with `https://`. Both `http://` and `https://` are accepted. |

**Valid input examples:**
```
"example.com"
"https://example.com"
"http://example.com"
"api.example.com/v1"
```

### Response `200`

```json
{
  "url": "https://example.com",
  "scanned_at": "2025-05-17T14:30:00.000000+00:00",
  "overall_score": "C",
  "total": 4,
  "summary": "Found 4 issue(s) — 0 critical, 1 high.",
  "vulnerabilities": [
    {
      "id": "hdr-1",
      "name": "Missing HSTS Header",
      "severity": "high",
      "description": "The site does not enforce HTTPS. Attackers on the same network can intercept traffic.",
      "affected": "https://example.com",
      "cvss_score": 7.4
    },
    {
      "id": "hdr-2",
      "name": "Missing Content Security Policy",
      "severity": "medium",
      "description": "No CSP header found. Cross-Site Scripting (XSS) attacks are more likely to succeed.",
      "affected": "https://example.com",
      "cvss_score": 6.1
    },
    {
      "id": "hdr-3",
      "name": "Clickjacking Vulnerability",
      "severity": "medium",
      "description": "The page can be embedded inside an attacker's iframe to trick users into clicking hidden elements.",
      "affected": "https://example.com",
      "cvss_score": 5.4
    },
    {
      "id": "ssl-4",
      "name": "SSL Certificate Expiring Soon",
      "severity": "medium",
      "description": "SSL certificate expires in 18 day(s). Site will show security warnings to all visitors.",
      "affected": "example.com",
      "cvss_score": 5.3
    }
  ]
}
```

| Field | Type | Description |
|-------|------|-------------|
| `url` | `string` | Normalized URL that was scanned |
| `scanned_at` | `string` | ISO 8601 UTC timestamp |
| `overall_score` | `"A"` \| `"B"` \| `"C"` \| `"D"` \| `"F"` | Security grade — see table below |
| `total` | `number` | Total number of issues found |
| `summary` | `string` | Human-readable summary string |
| `vulnerabilities` | `Vulnerability[]` | List sorted by severity (critical first) |

#### `Vulnerability` object

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique ID for this run. Format: `hdr-N` (header check) or `ssl-N` (SSL check) |
| `name` | `string` | Short vulnerability name |
| `severity` | `"critical"` \| `"high"` \| `"medium"` \| `"low"` | Severity level |
| `description` | `string` | Plain-English explanation of the risk |
| `affected` | `string` | URL or hostname affected |
| `cvss_score` | `number` | CVSS v3.1 base score (0.0 – 10.0) |

#### `overall_score` values

| Score | Condition |
|-------|-----------|
| `A` | No issues found |
| `B` | Low or medium issues only |
| `C` | Exactly 1 high severity issue |
| `D` | 2 or more high severity issues |
| `F` | At least 1 critical severity issue |

#### All possible vulnerability names

| Name | Severity | CVSS |
|------|----------|------|
| Missing HSTS Header | high | 7.4 |
| Missing Content Security Policy | medium | 6.1 |
| Clickjacking Vulnerability | medium | 5.4 |
| MIME Sniffing Enabled | low | 3.7 |
| Missing Referrer Policy | low | 3.1 |
| Missing Permissions Policy | low | 2.8 |
| Server Version Disclosure | low | 3.5 |
| SSL Certificate Expiring Soon (< 30 days) | medium | 5.3 |
| SSL Certificate Expiring Soon (< 7 days) | high | 7.5 |
| SSL/TLS Configuration Error | critical | 9.1 |

### Error responses

| Status | Condition | Body |
|--------|-----------|------|
| `422` | Host is unreachable or connection refused | `{ "detail": "Cannot reach target: ..." }` |

### TypeScript types

```ts
type ScanSeverity = "critical" | "high" | "medium" | "low";
type ScanGrade = "A" | "B" | "C" | "D" | "F";

interface ScanVulnerability {
  id: string;
  name: string;
  severity: ScanSeverity;
  description: string;
  affected: string;
  cvss_score: number;
}

interface ScanResult {
  url: string;
  scanned_at: string;
  overall_score: ScanGrade;
  total: number;
  summary: string;
  vulnerabilities: ScanVulnerability[];
}
```

### TypeScript usage

```ts
const result = await api<ScanResult>("/scan", { url: "https://example.com" });

// Grade badge color
const gradeColor: Record<ScanGrade, string> = {
  A: "text-green-400",
  B: "text-cyan-400",
  C: "text-yellow-400",
  D: "text-orange-400",
  F: "text-red-500",
};

// Severity badge color
const severityColor: Record<ScanSeverity, string> = {
  critical: "bg-red-600",
  high:     "bg-orange-500",
  medium:   "bg-yellow-500",
  low:      "bg-slate-400",
};
```

---

## POST `/triage`

AI-powered vulnerability report triage using Gemini.  
Returns: validity verdict, confidence score, CVSS, severity label, fix suggestion, explanations for different audiences, and a ready-to-send response draft for the researcher.

**Scoring rules applied automatically:**
- No PoC in report → `confidence` capped at 70, `validity` = `needs_more_info`
- CVSS based on demonstrated evidence only (not worst-case theory)
- Generic textbook reports → `is_duplicate: true`

### Request

```
POST /triage
Content-Type: application/json
```

```json
{
  "report": "I found a SQL injection on /api/users?id=1' OR '1'='1. I was able to dump the entire users table. Attached screenshot shows 500 rows returned.",
  "scope": [
    "*.example.com",
    "api.example.com",
    "10.0.0.0/24"
  ]
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `report` | `string` | Yes | Raw text of the vulnerability report submitted by the researcher. Can be any length. |
| `scope` | `string[]` | No | List of in-scope domains, subdomains, IPs, or CIDR ranges for this bug bounty program. Defaults to `"No scope defined — check all targets"` when omitted or empty. |

### Response `200`

```json
{
  "validity": "valid",
  "confidence": 85,
  "vulnerability_type": "SQL Injection",
  "cvss_score": 9.8,
  "cvss_vector": "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H",
  "in_scope": true,
  "is_duplicate": false,
  "severity_label": "Critical",
  "fix_suggestion": "Use parameterized queries or a prepared statement. Never concatenate user input into SQL strings. Apply an ORM if the stack supports it.",
  "simple_explanation": "Imagine your database is a bank vault — this bug gives anyone on the internet a master key. All customer data is exposed.",
  "technical_explanation": "Unsanitized user input in the `id` query parameter is interpolated directly into a SQL query, allowing Boolean-based blind injection and UNION-based data exfiltration via /api/users.",
  "response_draft": "Thank you for this detailed report. We have confirmed the SQL injection vulnerability at /api/users and are working on a fix. We will update you within 72 hours. This report qualifies for a reward under our critical severity tier.",
  "processed_at": "2025-05-17T14:30:00.000000+00:00"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `validity` | `"valid"` \| `"needs_more_info"` \| `"invalid"` | Overall triage verdict |
| `confidence` | `number` | 0–100. Capped at 70 when no PoC is present. |
| `vulnerability_type` | `string` | e.g. `"SQL Injection"`, `"XSS"`, `"IDOR"`, `"SSRF"` |
| `cvss_score` | `number` | CVSS v3.1 base score (0.0 – 10.0) |
| `cvss_vector` | `string` | Full CVSS v3.1 vector string |
| `in_scope` | `boolean` | Whether the target is within the provided program scope |
| `is_duplicate` | `boolean` | `true` if the report appears generic or matches a common textbook pattern |
| `severity_label` | `"Critical"` \| `"High"` \| `"Medium"` \| `"Low"` \| `"Informative"` | Human-readable severity |
| `fix_suggestion` | `string` | Specific, actionable remediation in 1–2 sentences |
| `simple_explanation` | `string` | Risk explained with an analogy — for non-technical stakeholders |
| `technical_explanation` | `string` | Exact cause, attack vector, and affected component — for developers |
| `response_draft` | `string` | Ready-to-send message to the researcher |
| `processed_at` | `string` | ISO 8601 UTC timestamp of when Gemini processed the report |

#### `validity` values

| Value | Meaning |
|-------|---------|
| `valid` | Report has a clear PoC and the vulnerability is confirmed exploitable |
| `needs_more_info` | PoC is missing or incomplete — confidence is automatically capped at 70 |
| `invalid` | Out of scope, not a real vulnerability, or purely theoretical |

#### `severity_label` values

| Label | CVSS Range |
|-------|------------|
| `Critical` | 9.0 – 10.0 |
| `High` | 7.0 – 8.9 |
| `Medium` | 4.0 – 6.9 |
| `Low` | 0.1 – 3.9 |
| `Informative` | 0.0 |

### Error responses

| Status | Condition | Body |
|--------|-----------|------|
| `400` | `report` is empty or whitespace-only | `{ "detail": "Report text is required." }` |
| `500` | Gemini API failure or invalid JSON returned | `{ "detail": "Triage failed: ..." }` |

### TypeScript types

```ts
type TriageValidity = "valid" | "needs_more_info" | "invalid";
type SeverityLabel = "Critical" | "High" | "Medium" | "Low" | "Informative";

interface TriageResult {
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
```

### TypeScript usage

```ts
const result = await api<TriageResult>("/triage", {
  report: reportText,
  scope: program.scope,       // string[] from your program data
});

// Validity color
const validityColor: Record<TriageValidity, string> = {
  valid:           "text-green-400",
  needs_more_info: "text-yellow-400",
  invalid:         "text-red-500",
};

// Severity badge color
const severityColor: Record<SeverityLabel, string> = {
  Critical:    "bg-red-600",
  High:        "bg-orange-500",
  Medium:      "bg-yellow-500",
  Low:         "bg-slate-400",
  Informative: "bg-blue-400",
};
```

---

## POST `/report`

Converts a researcher's rough notes into a clean, structured, professional bug bounty report.  
Useful as a "polish my report" feature before submission.

### Request

```
POST /report
Content-Type: application/json
```

```json
{
  "raw_notes": "found sqli on login page, tried ' or 1=1 -- and got all users back, easy to exploit, no auth needed"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `raw_notes` | `string` | Yes | Free-form text from the researcher. No structure required — can be a single sentence or several paragraphs. |

### Response `200`

```json
{
  "title": "SQL Injection on Login Endpoint Allows Full User Database Exfiltration",
  "description": "The login endpoint at /api/auth/login fails to sanitize the username parameter before constructing a SQL query. An unauthenticated attacker can inject arbitrary SQL to bypass authentication or dump the entire users table.",
  "steps_to_reproduce": "1. Navigate to /api/auth/login\n2. Enter the following as the username: ' OR 1=1 --\n3. Enter any value as the password\n4. Observe that the response returns all user records from the database",
  "impact": "An unauthenticated attacker can bypass authentication to access any account, or exfiltrate the full users table including passwords, email addresses, and PII. This constitutes a full database compromise.",
  "mitigation": "Replace string concatenation with parameterized queries or a prepared statement. Validate and sanitize all user-supplied input before it reaches the database layer. Consider adding a WAF as an additional control.",
  "suggested_severity": "Critical"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `title` | `string` | Concise vulnerability title, max ~80 characters |
| `description` | `string` | 2–3 sentence technical description |
| `steps_to_reproduce` | `string` | Numbered steps separated by `\n`. Split on `\n` to render as a list. |
| `impact` | `string` | Business and technical impact — what an attacker can do |
| `mitigation` | `string` | Specific recommended fix |
| `suggested_severity` | `"Critical"` \| `"High"` \| `"Medium"` \| `"Low"` | Gemini's severity suggestion — researcher can override |

### Error responses

| Status | Condition | Body |
|--------|-----------|------|
| `400` | `raw_notes` is empty or whitespace-only | `{ "detail": "Raw notes are required." }` |
| `500` | Gemini API failure or invalid JSON returned | `{ "detail": "Report generation failed: ..." }` |

### TypeScript types

```ts
interface ReportResult {
  title: string;
  description: string;
  steps_to_reproduce: string;
  impact: string;
  mitigation: string;
  suggested_severity: "Critical" | "High" | "Medium" | "Low";
}
```

### TypeScript usage

```ts
const report = await api<ReportResult>("/report", { raw_notes: notes });

// Render steps_to_reproduce as a list
const steps = report.steps_to_reproduce.split("\n").filter(Boolean);
// → ["1. Navigate to /api/auth/login", "2. Enter ...", ...]
```

---

## POST `/translate`

Translates security content into French, Arabic, Moroccan Darija, or English.  
Technical terms (XSS, SQL injection, CVE IDs, CVSS scores, code snippets) are preserved in English regardless of target language.

### Request

```
POST /translate
Content-Type: application/json
```

```json
{
  "text": "A critical SQL injection vulnerability was found in the login endpoint. The CVSS score is 9.8.",
  "target": "darija"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `text` | `string` | Yes | The security content to translate. Can be a single sentence or multiple paragraphs. |
| `target` | `string` | Yes | Target language. Must be one of: `"french"`, `"arabic"`, `"darija"`, `"english"`. Case-insensitive. |

#### `target` language options

| Value | Language | Script | Direction |
|-------|----------|--------|-----------|
| `french` | Professional French | Latin | LTR |
| `arabic` | Modern Standard Arabic (فصحى) | Arabic | RTL |
| `darija` | Moroccan Darija (الدارجة) | Arabic | RTL |
| `english` | Professional English | Latin | LTR |

### Response `200`

```json
{
  "original": "A critical SQL injection vulnerability was found in the login endpoint. The CVSS score is 9.8.",
  "translated": "لقينا ثغرة SQL injection خطيرة في نقطة تسجيل الدخول. النقطة ديال CVSS هي 9.8.",
  "target": "darija"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `original` | `string` | The exact text that was sent for translation (echoed back) |
| `translated` | `string` | The translated output |
| `target` | `string` | The target language that was used |

### Error responses

| Status | Condition | Body |
|--------|-----------|------|
| `400` | `text` is empty or whitespace-only | `{ "detail": "Text is required." }` |
| `400` | `target` is not one of the 4 supported values | `{ "detail": "Unsupported target language 'spanish'. Use: french, arabic, darija, english." }` |
| `500` | Gemini API failure | `{ "detail": "Translation failed: ..." }` |

### TypeScript types

```ts
type TranslateTarget = "french" | "arabic" | "darija" | "english";

interface TranslateResult {
  original: string;
  translated: string;
  target: TranslateTarget;
}
```

### TypeScript usage

```ts
const result = await api<TranslateResult>("/translate", {
  text: content,
  target: selectedLanguage,   // "french" | "arabic" | "darija" | "english"
});

// RTL detection — apply to the translated text container
const isRTL = result.target === "arabic" || result.target === "darija";
// → <div dir={isRTL ? "rtl" : "ltr"}>{result.translated}</div>
```

---

## Error format

All errors use FastAPI's standard envelope:

```json
{ "detail": "<human-readable message>" }
```

#### HTTP status codes

| Code | Meaning |
|------|---------|
| `200` | Success |
| `400` | Bad request — missing or invalid input field |
| `422` | Unreachable target (scan endpoint only) |
| `500` | AI call failed — Gemini error or JSON parse failure |

#### Error handling pattern

```ts
try {
  const result = await api<ScanResult>("/scan", { url });
} catch (err) {
  // err.message contains the `detail` string from the API
  toast.error(err instanceof Error ? err.message : "Unexpected error");
}
```

---

## Local development

```bash
# 1. Copy env template
cp backend/.env.example backend/.env
# Edit backend/.env and add your GEMINI_API_KEY

# 2. Start with hot reload
cd backend
docker compose up

# Backend is live at:
#   http://localhost:8000        — API
#   http://localhost:8000/docs  — Interactive Swagger UI (test all endpoints here)
```

#### Quick smoke tests (copy-paste into terminal)

```bash
# Health
curl http://localhost:8000/health

# Scan
curl -X POST http://localhost:8000/scan \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'

# Triage (no PoC — should return confidence ≤ 70)
curl -X POST http://localhost:8000/triage \
  -H "Content-Type: application/json" \
  -d '{"report": "I think there is SQL injection on the login page.", "scope": ["example.com"]}'

# Report writer
curl -X POST http://localhost:8000/report \
  -H "Content-Type: application/json" \
  -d '{"raw_notes": "xss in search bar, injected <script>alert(1)</script>"}'

# Translate
curl -X POST http://localhost:8000/translate \
  -H "Content-Type: application/json" \
  -d '{"text": "Critical vulnerability found.", "target": "darija"}'
```
