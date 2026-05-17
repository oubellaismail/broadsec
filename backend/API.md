# BroadSec Backend API — Integration Guide for UI

Base URL (local dev): `http://localhost:8000`  
Base URL (production): `https://<cloud-run-url>` *(set in `.env.local` as `NEXT_PUBLIC_API_URL`)*

All endpoints accept and return **JSON**. All POST bodies use `Content-Type: application/json`.

---

## GET `/health`

Health check — call this to know if the backend is reachable.

**Response**
```json
{
  "status": "ok",
  "service": "broadsec-api",
  "version": "1.0.0"
}
```

---

## POST `/scan`

Scans a URL for security misconfigurations.  
Checks: HTTP security headers · SSL certificate validity.  
Typical response time: **< 1 second**.

**Request**
```json
{
  "url": "https://example.com"
}
```
> `url` — any valid URL or bare domain (`example.com`, `https://example.com`). HTTP is auto-upgraded to HTTPS for the header check.

**Response**
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
    }
  ]
}
```

**`overall_score` values**

| Score | Meaning |
|-------|---------|
| `A` | No issues found |
| `B` | Low/medium issues only |
| `C` | 1 high severity issue |
| `D` | 2+ high severity issues |
| `F` | 1+ critical severity issue |

**`severity` values:** `critical` · `high` · `medium` · `low`

**Error** (`422`) — unreachable host:
```json
{ "detail": "Cannot reach target: ..." }
```

**UI hints**
- Show a color-coded grade badge: A=green, B=cyan, C=yellow, D=orange, F=red
- Sort vulnerabilities by severity (already sorted in response)
- Use `cvss_score` to render a mini progress bar per issue (scale 0–10)

---

## POST `/triage`

AI-powered vulnerability report triage using Gemini.  
Returns structured analysis: validity, severity, CVSS, fix suggestion, and a draft response to the researcher.

**Request**
```json
{
  "report": "I found a SQL injection on /api/users?id=1' OR '1'='1. I can dump the database.",
  "scope": [
    "*.example.com",
    "api.example.com"
  ]
}
```
> `report` — the raw text submitted by the researcher (required).  
> `scope` — list of in-scope domains/IPs for the program (optional, defaults to "check all targets").

**Response**
```json
{
  "validity": "needs_more_info",
  "confidence": 65,
  "vulnerability_type": "SQL Injection",
  "cvss_score": 7.5,
  "cvss_vector": "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N",
  "in_scope": true,
  "is_duplicate": false,
  "severity_label": "High",
  "fix_suggestion": "Use parameterized queries or an ORM. Never concatenate user input into SQL strings.",
  "simple_explanation": "Imagine your database is a filing cabinet — this bug lets anyone walk in and read every file without a key.",
  "technical_explanation": "Unsanitized user input is interpolated directly into a SQL query, allowing an attacker to alter query logic via the `id` parameter.",
  "response_draft": "Thank you for your submission. We were able to reproduce partial evidence of a SQL injection vector at /api/users. Please provide a full PoC including request/response or a screenshot of data exfiltration to progress this report.",
  "processed_at": "2025-05-17T14:30:00.000000+00:00"
}
```

**`validity` values**

| Value | When |
|-------|------|
| `valid` | Report has a clear PoC and is confirmed exploitable |
| `needs_more_info` | Missing PoC, reproduction steps, or payload — confidence capped at 70 |
| `invalid` | Out of scope, not a real vulnerability, or theoretical only |

**`severity_label` values:** `Critical` · `High` · `Medium` · `Low` · `Informative`

**Error** (`400`) — empty report:
```json
{ "detail": "Report text is required." }
```

**UI hints**
- Use `validity` to color the triage card: `valid`=green, `needs_more_info`=yellow, `invalid`=red
- Show `confidence` as a percentage ring or bar
- Display `response_draft` in a copyable text area so admins can send it to the researcher in one click
- Show `simple_explanation` in the "CEO view" panel and `technical_explanation` in the "Dev view" tab

---

## POST `/report`

Turns rough researcher notes into a clean, professional bug bounty report.

**Request**
```json
{
  "raw_notes": "found sqli on login page, tried ' or 1=1 -- and got all users back, easy to exploit"
}
```
> `raw_notes` — free-form text from the researcher (required).

**Response**
```json
{
  "title": "SQL Injection on Login Endpoint Allows Full User Database Exfiltration",
  "description": "The login endpoint at /api/auth/login fails to sanitize the username parameter before constructing a SQL query. An unauthenticated attacker can inject arbitrary SQL to bypass authentication or dump the entire users table.",
  "steps_to_reproduce": "1. Navigate to /api/auth/login\n2. Enter the following as the username: ' OR 1=1 --\n3. Enter any value as the password\n4. Observe that the response returns all user records",
  "impact": "An attacker can bypass authentication to access any account, or exfiltrate the full users table including passwords and PII. This constitutes a full database compromise.",
  "mitigation": "Replace string concatenation with parameterized queries or a prepared statement. Validate and sanitize all user-supplied input before it reaches the database layer.",
  "suggested_severity": "Critical"
}
```

**`suggested_severity` values:** `Critical` · `High` · `Medium` · `Low`

**Error** (`400`) — empty notes:
```json
{ "detail": "Raw notes are required." }
```

**UI hints**
- Render `steps_to_reproduce` as a numbered list (split on `\n`)
- Let the researcher copy the full report to clipboard or pre-fill a submission form
- Show `suggested_severity` as a badge that the researcher can override before submitting

---

## POST `/translate`

Translates security content into French, Arabic, Moroccan Darija, or English.  
Technical terms (XSS, CVE IDs, CVSS, code snippets) are preserved as-is.

**Request**
```json
{
  "text": "A critical SQL injection vulnerability was found in the login endpoint.",
  "target": "darija"
}
```
> `text` — the content to translate (required).  
> `target` — one of `french` · `arabic` · `darija` · `english` (case-insensitive, required).

**Response**
```json
{
  "original": "A critical SQL injection vulnerability was found in the login endpoint.",
  "translated": "لقينا ثغرة SQL injection خطيرة في نقطة تسجيل الدخول.",
  "target": "darija"
}
```

**Error** (`400`) — unsupported language:
```json
{ "detail": "Unsupported target language 'spanish'. Use: french, arabic, darija, english." }
```

**Error** (`400`) — empty text:
```json
{ "detail": "Text is required." }
```

**UI hints**
- Offer a language selector with 4 options: 🇫🇷 French · 🇲🇦 Arabic · 🇲🇦 Darija · 🇬🇧 English
- Display original and translated side-by-side
- RTL: apply `dir="rtl"` and `text-align: right` when `target` is `arabic` or `darija`

---

## Error format

All errors follow FastAPI's standard format:
```json
{ "detail": "<human-readable message>" }
```

HTTP status codes used:
- `400` — bad request (missing or invalid input)
- `422` — target unreachable (scan only)
- `500` — AI call failed (Gemini error or JSON parse failure)

---

## Local development

```bash
# Start backend with hot reload
cd backend
docker compose up

# API is available at http://localhost:8000
# Interactive docs: http://localhost:8000/docs
```

Environment variable required: `GEMINI_API_KEY` in `backend/.env` (copy from `.env.example`).
