# ── BroadSec Scanner Backend ──────────────────────────────────────────────
# FastAPI app — runs on Cloud Run in production
# Provides /scan endpoint (full Nuclei + header checks)

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx, ssl, socket, json, subprocess, os
from datetime import datetime

app = FastAPI(title="BroadSec Scanner", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],      # tighten in production
    allow_methods=["*"],
    allow_headers=["*"],
)


class ScanRequest(BaseModel):
    url: str


@app.get("/health")
def health():
    return {"status": "ok", "service": "broadsec-scanner"}


@app.post("/scan")
async def scan(req: ScanRequest):
    url = req.url
    if not url.startswith("http"):
        url = f"https://{url}"

    vulns = []

    # ── HTTP Header Checks ─────────────────────────────────────────────────
    try:
        async with httpx.AsyncClient(timeout=10, follow_redirects=True) as client:
            r = await client.head(url)
            headers = r.headers

            checks = [
                ("strict-transport-security", "Missing HSTS Header",
                 "HTTPS enforcement not configured. Attackers can intercept connections.",
                 "high", 7.4),
                ("content-security-policy", "Missing Content Security Policy",
                 "No CSP header. XSS attacks are easier to execute.",
                 "medium", 6.1),
                ("x-frame-options", "Clickjacking Risk",
                 "Page can be embedded in attacker-controlled iframes.",
                 "medium", 5.4),
                ("x-content-type-options", "MIME Sniffing Enabled",
                 "Browser may misinterpret file types, enabling attacks.",
                 "low", 3.7),
                ("referrer-policy", "Missing Referrer Policy",
                 "Sensitive URLs may leak to third-party services.",
                 "low", 3.1),
                ("permissions-policy", "Missing Permissions Policy",
                 "Browser features (camera, mic, location) not restricted.",
                 "low", 2.8),
            ]

            vid = 1
            for header, name, desc, severity, cvss in checks:
                if not headers.get(header):
                    vulns.append({
                        "id": f"hdr-{vid}",
                        "name": name,
                        "severity": severity,
                        "description": desc,
                        "affected": url,
                        "cvss_score": cvss,
                        "ai_explanation": "",
                        "ai_fix": "",
                    })
                    vid += 1

            server = headers.get("server", "")
            if server:
                vulns.append({
                    "id": f"hdr-{vid}",
                    "name": "Server Version Disclosure",
                    "severity": "low",
                    "description": f'Server header reveals: "{server}".',
                    "affected": url,
                    "cvss_score": 3.5,
                    "ai_explanation": "",
                    "ai_fix": "",
                })

    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Could not reach target: {str(e)}")

    # ── Nuclei Scan (if installed) ─────────────────────────────────────────
    nuclei_path = os.environ.get("NUCLEI_PATH", "nuclei")
    try:
        result = subprocess.run(
            [nuclei_path, "-u", url, "-j", "-silent",
             "-tags", "misconfig,exposure,headers",
             "-timeout", "5"],
            capture_output=True, text=True, timeout=30
        )
        for line in result.stdout.strip().split("\n"):
            if not line:
                continue
            try:
                finding = json.loads(line)
                vulns.append({
                    "id": f"nuc-{finding.get('template-id', 'unknown')}",
                    "name": finding.get("info", {}).get("name", "Unknown"),
                    "severity": finding.get("info", {}).get("severity", "low"),
                    "description": finding.get("info", {}).get("description", ""),
                    "affected": finding.get("matched-at", url),
                    "cvss_score": float(finding.get("info", {}).get("cvss-score", 3.0)),
                    "ai_explanation": "",
                    "ai_fix": "",
                })
            except json.JSONDecodeError:
                continue
    except (FileNotFoundError, subprocess.TimeoutExpired):
        # Nuclei not installed — header checks only
        pass

    # Score calculation
    criticals = sum(1 for v in vulns if v["severity"] == "critical")
    highs     = sum(1 for v in vulns if v["severity"] == "high")
    score = "F" if criticals > 0 else "D" if highs > 1 else "C" if highs == 1 else "B" if vulns else "A"

    return {
        "url": url,
        "scanned_at": datetime.utcnow().isoformat() + "Z",
        "overall_score": score,
        "vulnerabilities": vulns,
        "ai_summary": f"Found {len(vulns)} issue(s). {criticals} critical, {highs} high severity.",
    }
