// ── Security Scanner ───────────────────────────────────────────────────────
// Client-side calls to the scanner API endpoint (FastAPI on Cloud Run)
// In dev: calls /api/scan (Next.js route that proxies to Python backend)

import type { ScanResult } from "@/types";

export async function scanWebsite(url: string): Promise<ScanResult> {
  const res = await fetch("/api/scan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Scan failed" }));
    throw new Error(err.error || "Scan failed");
  }

  return res.json() as Promise<ScanResult>;
}

// Score label helper
export function scoreLabel(score: string): { color: string; label: string } {
  const map: Record<string, { color: string; label: string }> = {
    A: { color: "#39ff14", label: "Excellent" },
    B: { color: "#00f0ff", label: "Good" },
    C: { color: "#ffd700", label: "Fair" },
    D: { color: "#ff8c00", label: "Poor" },
    F: { color: "#ff2d55", label: "Critical Risk" },
  };
  return map[score] ?? { color: "#888", label: "Unknown" };
}

// Severity helpers
export const SEVERITY_COLORS: Record<string, string> = {
  critical:    "#ff2d55",
  high:        "#ff8c00",
  medium:      "#ffd700",
  low:         "#39ff14",
  informative: "#888888",
};

export const SEVERITY_LABELS: Record<string, string> = {
  critical:    "CRITICAL",
  high:        "HIGH",
  medium:      "MEDIUM",
  low:         "LOW",
  informative: "INFO",
};
