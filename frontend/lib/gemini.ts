import {
  generateReport,
  translateContent,
  triageReport as apiTriageReport,
} from "@/lib/api";
import {
  FALLBACK_REPORT_RESULT,
  MOCK_TRIAGE_RESULT,
  fallbackTranslateResult,
} from "@/lib/mock-data";
import type { ReportResult, TriageResult } from "@/types";

// Compatibility wrappers for older local routes. The BroadSec frontend now
// delegates AI work to the documented FastAPI endpoints in backend/API.md.

export async function triageReportWithBackend(
  reportText: string,
  programScope: string[]
): Promise<TriageResult> {
  try {
    return await apiTriageReport({ report: reportText, scope: programScope });
  } catch {
    return MOCK_TRIAGE_RESULT;
  }
}

export { triageReportWithBackend as triageReport };

export async function enhanceReport(rawNotes: string): Promise<ReportResult> {
  try {
    return await generateReport(rawNotes);
  } catch {
    return FALLBACK_REPORT_RESULT;
  }
}

export async function translateSecurityContent(
  text: string,
  targetLanguage: "french" | "arabic" | "darija" | "english"
): Promise<string> {
  try {
    const result = await translateContent({ text, target: targetLanguage });
    return result.translated;
  } catch {
    return fallbackTranslateResult(text, targetLanguage).translated;
  }
}

export async function explainVulnerability(
  vuln: { name: string; description: string; affected: string },
  audience: "ceo" | "developer" | "compliance"
): Promise<string> {
  const audienceLabel = {
    ceo: "Business risk",
    developer: "Developer fix",
    compliance: "Compliance note",
  }[audience];

  return `${audienceLabel}: ${vuln.name} affects ${vuln.affected}. ${vuln.description}`;
}

export async function generateFix(
  vulnName: string,
  vulnDescription: string
): Promise<{ explanation: string; before: string; after: string }> {
  return {
    explanation: `Apply the documented remediation for ${vulnName}.`,
    before: vulnDescription,
    after: "Validate input, enforce authorization, and add regression coverage for this control.",
  };
}

export async function analyzeProgramScope(domain: string): Promise<{
  suggested_scope: string[];
  out_of_scope: string[];
  reward_tiers: { severity: string; min_mad: number; max_mad: number }[];
  notes: string;
}> {
  return {
    suggested_scope: [`*.${domain}`, `api.${domain}`, `app.${domain}`],
    out_of_scope: ["Social engineering", "Denial of service", "Third-party providers"],
    reward_tiers: [
      { severity: "Critical", min_mad: 5000, max_mad: 25000 },
      { severity: "High", min_mad: 1500, max_mad: 8000 },
      { severity: "Medium", min_mad: 500, max_mad: 2500 },
      { severity: "Low", min_mad: 100, max_mad: 500 },
    ],
    notes:
      "Demo scope suggestion only. Confirm asset ownership and legal authorization before launching a program.",
  };
}
