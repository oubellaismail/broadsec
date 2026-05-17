// ── /api/scan ──────────────────────────────────────────────────────────────
// Proxies to Python FastAPI scanner on Cloud Run (or runs inline in dev)
// POST { url: string } → ScanResult

import { NextRequest, NextResponse } from "next/server";
import { explainVulnerability } from "@/lib/gemini";

const SCANNER_URL = process.env.SCANNER_URL; // Cloud Run URL in production

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: "URL required" }, { status: 400 });

    // If Cloud Run scanner is configured, proxy to it
    if (SCANNER_URL) {
      const res = await fetch(`${SCANNER_URL}/scan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      return NextResponse.json(data);
    }

    // ── Inline scanner (dev / fallback) ────────────────────────────────────
    // Basic checks using fetch — no external tools needed
    const target = url.startsWith("http") ? url : `https://${url}`;
    const vulnerabilities = [];

    try {
      const res = await fetch(target, {
        method: "HEAD",
        redirect: "follow",
        signal: AbortSignal.timeout(8000),
      });

      const h = res.headers;

      if (!h.get("strict-transport-security")) {
        vulnerabilities.push({
          id: "v1",
          name: "Missing HSTS Header",
          severity: "high",
          description: "HTTP Strict Transport Security is not configured.",
          affected: url,
          cvss_score: 7.4,
          ai_explanation: "",
          ai_fix: "",
        });
      }
      if (!h.get("content-security-policy")) {
        vulnerabilities.push({
          id: "v2",
          name: "Missing Content Security Policy",
          severity: "medium",
          description: "No CSP header found. XSS attacks are more likely to succeed.",
          affected: url,
          cvss_score: 6.1,
          ai_explanation: "",
          ai_fix: "",
        });
      }
      if (!h.get("x-frame-options") && !h.get("content-security-policy")?.includes("frame-ancestors")) {
        vulnerabilities.push({
          id: "v3",
          name: "Clickjacking Vulnerability",
          severity: "medium",
          description: "X-Frame-Options header is missing. The page can be embedded in iframes.",
          affected: url,
          cvss_score: 5.4,
          ai_explanation: "",
          ai_fix: "",
        });
      }
      if (!h.get("x-content-type-options")) {
        vulnerabilities.push({
          id: "v4",
          name: "MIME Sniffing Enabled",
          severity: "low",
          description: "X-Content-Type-Options: nosniff header is missing.",
          affected: url,
          cvss_score: 3.7,
          ai_explanation: "",
          ai_fix: "",
        });
      }
      if (!h.get("referrer-policy")) {
        vulnerabilities.push({
          id: "v5",
          name: "Missing Referrer Policy",
          severity: "low",
          description: "Referrer-Policy header not set. Sensitive URLs may leak to third parties.",
          affected: url,
          cvss_score: 3.1,
          ai_explanation: "",
          ai_fix: "",
        });
      }

      const server = h.get("server");
      if (server) {
        vulnerabilities.push({
          id: "v6",
          name: "Server Version Disclosure",
          severity: "low",
          description: `Server header reveals: "${server}". Attackers can target known CVEs.`,
          affected: url,
          cvss_score: 3.5,
          ai_explanation: "",
          ai_fix: "",
        });
      }
    } catch {
      return NextResponse.json({ error: "Could not reach target URL" }, { status: 422 });
    }

    // Enrich top 2 vulns with Gemini explanations
    for (let i = 0; i < Math.min(2, vulnerabilities.length); i++) {
      const v = vulnerabilities[i];
      v.ai_explanation = await explainVulnerability(
        { name: v.name, description: v.description, affected: v.affected },
        "ceo"
      );
      v.ai_fix = await explainVulnerability(
        { name: v.name, description: v.description, affected: v.affected },
        "developer"
      );
    }

    const scores: Record<number, string> = { 0: "A", 1: "B", 2: "C", 3: "D" };
    const criticals = vulnerabilities.filter((v) => v.severity === "critical").length;
    const highs     = vulnerabilities.filter((v) => v.severity === "high").length;
    const score     = criticals > 0 ? "F" : highs > 1 ? "D" : (scores[highs] ?? "A");

    return NextResponse.json({
      url,
      scanned_at: new Date().toISOString(),
      overall_score: score,
      vulnerabilities,
      ai_summary: `Found ${vulnerabilities.length} issue(s). ${criticals} critical, ${highs} high severity.`,
    });
  } catch (err) {
    console.error("[/api/scan]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
