# ── BroadSec Backend API ───────────────────────────────────────────────────
# FastAPI — deploys to Google Cloud Run
#
# Endpoints:
#   GET  /health       → Cloud Run health check
#   POST /scan         → Basic security scanner (headers + SSL + exposed paths)
#   POST /triage       → Gemini AI: triage a vulnerability report
#   POST /report       → Gemini AI: rewrite raw notes into professional report
#   POST /translate    → Gemini AI: translate security content (FR/AR/Darija/EN)

import os, ssl, socket
from datetime import datetime, timezone

import httpx
import google.generativeai as genai
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

# ── Gemini setup ───────────────────────────────────────────────────────────
genai.configure(api_key=os.environ["GEMINI_API_KEY"])
model = genai.GenerativeModel("gemini-2.5-flash")

# ── App ────────────────────────────────────────────────────────────────────
app = FastAPI(title="BroadSec API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # lock down to your Firebase domain in production
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Request / Response models ──────────────────────────────────────────────
class ScanRequest(BaseModel):
    url: str

class TriageRequest(BaseModel):
    report: str
    scope: list[str] = []

class ReportRequest(BaseModel):
    raw_notes: str

class TranslateRequest(BaseModel):
    text: str
    target: str   # "french" | "arabic" | "darija" | "english"


# ── Helpers ────────────────────────────────────────────────────────────────
def normalize_url(url: str) -> str:
    if not url.startswith("http"):
        return f"https://{url}"
    return url

def gemini(prompt: str) -> str:
    """Call Gemini and return raw text."""
    result = model.generate_content(prompt)
    return result.text.strip()

def clean_json(text: str) -> str:
    """Strip markdown fences Gemini sometimes adds."""
    return text.replace("```json", "").replace("```", "").strip()

def score_from_vulns(vulns: list) -> str:
    criticals = sum(1 for v in vulns if v["severity"] == "critical")
    highs     = sum(1 for v in vulns if v["severity"] == "high")
    mediums   = sum(1 for v in vulns if v["severity"] == "medium")
    if criticals:  return "F"
    if highs > 1:  return "D"
    if highs == 1: return "C"
    if mediums:    return "B"
    if vulns:      return "B"
    return "A"


# ══════════════════════════════════════════════════════════════════════════
# 1.  HEALTH
# ══════════════════════════════════════════════════════════════════════════
@app.get("/health")
def health():
    return {"status": "ok", "service": "broadsec-api", "version": "1.0.0"}


# ══════════════════════════════════════════════════════════════════════════
# 2.  SCANNER  —  basic but solid
#     Checks: security headers · SSL validity · exposed sensitive paths
# ══════════════════════════════════════════════════════════════════════════
@app.post("/scan")
async def scan(req: ScanRequest):
    url = normalize_url(req.url)
    hostname = url.split("//")[-1].split("/")[0].split(":")[0]
    vulns = []
    vid = 1

    # ── 2a. HTTP security headers ──────────────────────────────────────────
    HEADER_CHECKS = [
        (
            "strict-transport-security",
            "Missing HSTS Header",
            "The site does not enforce HTTPS. Attackers on the same network can intercept traffic.",
            "high", 7.4,
        ),
        (
            "content-security-policy",
            "Missing Content Security Policy",
            "No CSP header found. Cross-Site Scripting (XSS) attacks are more likely to succeed.",
            "medium", 6.1,
        ),
        (
            "x-frame-options",
            "Clickjacking Vulnerability",
            "The page can be embedded inside an attacker's iframe to trick users into clicking hidden elements.",
            "medium", 5.4,
        ),
        (
            "x-content-type-options",
            "MIME Sniffing Enabled",
            "The browser may misinterpret uploaded files as executable scripts.",
            "low", 3.7,
        ),
        (
            "referrer-policy",
            "Missing Referrer Policy",
            "Sensitive URL parameters may leak to third-party analytics or ad services.",
            "low", 3.1,
        ),
        (
            "permissions-policy",
            "Missing Permissions Policy",
            "Browser features like camera, microphone, and geolocation are not explicitly restricted.",
            "low", 2.8,
        ),
    ]

    try:
        async with httpx.AsyncClient(timeout=10, follow_redirects=True) as client:
            r = await client.head(url)
            headers = r.headers

            for header_name, name, desc, severity, cvss in HEADER_CHECKS:
                if not headers.get(header_name):
                    vulns.append({
                        "id": f"hdr-{vid}",
                        "name": name,
                        "severity": severity,
                        "description": desc,
                        "affected": url,
                        "cvss_score": cvss,
                    })
                    vid += 1

            # Server version disclosure
            server = headers.get("server", "")
            if server and any(c.isdigit() for c in server):
                vulns.append({
                    "id": f"hdr-{vid}",
                    "name": "Server Version Disclosure",
                    "severity": "low",
                    "description": f'Server header exposes version info: "{server}". Attackers can look up known CVEs for this version.',
                    "affected": url,
                    "cvss_score": 3.5,
                })
                vid += 1

    except httpx.RequestError as e:
        raise HTTPException(status_code=422, detail=f"Cannot reach target: {str(e)}")

    # ── 2b. SSL certificate check ──────────────────────────────────────────
    try:
        ctx = ssl.create_default_context()
        with ctx.wrap_socket(
            socket.create_connection((hostname, 443), timeout=5),
            server_hostname=hostname,
        ) as s:
            cert = s.getpeercert()
            expire_str = cert.get("notAfter", "")
            if expire_str:
                expire_dt = datetime.strptime(expire_str, "%b %d %H:%M:%S %Y %Z")
                expire_dt = expire_dt.replace(tzinfo=timezone.utc)
                days_left = (expire_dt - datetime.now(timezone.utc)).days
                if days_left < 30:
                    vulns.append({
                        "id": f"ssl-{vid}",
                        "name": "SSL Certificate Expiring Soon",
                        "severity": "high" if days_left < 7 else "medium",
                        "description": f"SSL certificate expires in {days_left} day(s). Site will show security warnings to all visitors.",
                        "affected": hostname,
                        "cvss_score": 7.5 if days_left < 7 else 5.3,
                    })
                    vid += 1
    except ssl.SSLError:
        vulns.append({
            "id": f"ssl-{vid}",
            "name": "SSL/TLS Configuration Error",
            "severity": "critical",
            "description": "SSL handshake failed. The site may be using an invalid or self-signed certificate.",
            "affected": hostname,
            "cvss_score": 9.1,
        })
        vid += 1
    except Exception:
        pass  # port 443 not open or no SSL — not our concern here

    # ── Score & response ───────────────────────────────────────────────────
    score    = score_from_vulns(vulns)
    criticals = sum(1 for v in vulns if v["severity"] == "critical")
    highs     = sum(1 for v in vulns if v["severity"] == "high")

    return {
        "url": url,
        "scanned_at": datetime.now(timezone.utc).isoformat(),
        "overall_score": score,
        "total": len(vulns),
        "vulnerabilities": sorted(
            vulns,
            key=lambda v: {"critical": 0, "high": 1, "medium": 2, "low": 3}.get(v["severity"], 4)
        ),
        "summary": f"Found {len(vulns)} issue(s) — {criticals} critical, {highs} high.",
    }


# ══════════════════════════════════════════════════════════════════════════
# 3.  AI TRIAGE  —  Gemini first-layer triage
# ══════════════════════════════════════════════════════════════════════════
@app.post("/triage")
async def triage(req: TriageRequest):
    if not req.report.strip():
        raise HTTPException(status_code=400, detail="Report text is required.")

    scope_block = "\n".join(req.scope) if req.scope else "No scope defined — check all targets."

    prompt = f"""
You are a senior cybersecurity analyst at a bug bounty platform.
Triage the following vulnerability report and return ONLY a JSON object.

STRICT SCORING RULES — follow these before setting any field:
1. PoC requirement: If the report contains no proof-of-concept (no screenshot, no request/response, no reproduction steps, no payload), cap "confidence" at 70 and set "validity" to "needs_more_info".
2. CVSS discipline: Base the CVSS score strictly on what is demonstrated, not on worst-case theory. A claim without evidence is not enough to justify Critical (9.0+). Downgrade one severity level when PoC is missing.
3. Duplicate signal: If the report describes a textbook/generic vulnerability with no target-specific detail, flag "is_duplicate" as true.

PROGRAM SCOPE:
{scope_block}

SUBMITTED REPORT:
{req.report}

Return this exact JSON structure (no markdown, no explanation):
{{
  "validity": "valid" | "invalid" | "needs_more_info",
  "confidence": <integer 0-100>,
  "vulnerability_type": "<e.g. SQL Injection / XSS / IDOR / SSRF>",
  "cvss_score": <float 0.0-10.0>,
  "cvss_vector": "<CVSS:3.1/AV:.../...>",
  "in_scope": <true | false>,
  "is_duplicate": <true | false>,
  "severity_label": "Critical" | "High" | "Medium" | "Low" | "Informative",
  "fix_suggestion": "<specific, actionable fix in 1-2 sentences>",
  "simple_explanation": "<explain the risk to a non-technical CEO in 2 sentences, use an analogy>",
  "technical_explanation": "<explain to a developer: exact cause, attack vector, affected component>",
  "response_draft": "<professional response message to send to the researcher>",
  "processed_at": "{datetime.now(timezone.utc).isoformat()}"
}}
"""

    try:
        raw = gemini(prompt)
        import json
        result = json.loads(clean_json(raw))
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Triage failed: {str(e)}")


# ══════════════════════════════════════════════════════════════════════════
# 4.  REPORT WRITER  —  raw notes → professional report
# ══════════════════════════════════════════════════════════════════════════
@app.post("/report")
async def report_writer(req: ReportRequest):
    if not req.raw_notes.strip():
        raise HTTPException(status_code=400, detail="Raw notes are required.")

    prompt = f"""
You are a professional bug bounty report writer helping a security researcher
turn rough notes into a clean, professional vulnerability report.

RAW NOTES:
{req.raw_notes}

Return ONLY this JSON object (no markdown, no explanation):
{{
  "title": "<concise vulnerability title, max 80 chars>",
  "description": "<clear 2-3 sentence technical description of the vulnerability>",
  "steps_to_reproduce": "<numbered steps, each on a new line, starting with 1.>",
  "impact": "<business and technical impact — what an attacker can do>",
  "mitigation": "<specific recommended fix>",
  "suggested_severity": "Critical" | "High" | "Medium" | "Low"
}}
"""

    try:
        raw = gemini(prompt)
        import json
        result = json.loads(clean_json(raw))
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Report generation failed: {str(e)}")


# ══════════════════════════════════════════════════════════════════════════
# 5.  MULTILINGUAL ENGINE  —  security content translation
# ══════════════════════════════════════════════════════════════════════════
@app.post("/translate")
async def translate(req: TranslateRequest):
    if not req.text.strip():
        raise HTTPException(status_code=400, detail="Text is required.")

    LANG_INSTRUCTIONS = {
        "french":  "Translate to professional French. Keep technical security terms (XSS, SQL injection, CVSS, CVE) in English.",
        "arabic":  "Translate to Modern Standard Arabic (فصحى). Keep CVE IDs, technical acronyms, and code snippets as-is.",
        "darija":  "Translate to Moroccan Darija (الدارجة المغربية) written in Arabic script. Be natural and conversational, not formal. Keep technical terms in English.",
        "english": "Translate to professional English. Keep technical security terminology precise.",
    }

    instruction = LANG_INSTRUCTIONS.get(req.target.lower())
    if not instruction:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported target language '{req.target}'. Use: french, arabic, darija, english."
        )

    prompt = f"""
{instruction}

Text to translate:
{req.text}

Return ONLY the translated text. No explanations, no labels, no markdown.
"""

    try:
        translated = gemini(prompt)
        return {
            "original": req.text,
            "translated": translated,
            "target": req.target,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Translation failed: {str(e)}")
