// ── Gemini API Integration ─────────────────────────────────────────────────
// All 6 AI capabilities live here. This is the core of the "Best Gemini API" prize.

import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AiTriage, ScanVulnerability } from "@/types";

const genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genai.getGenerativeModel({ model: "gemini-2.0-flash" });

// ── 1. AI TRIAGE ────────────────────────────────────────────────────────────
// Classifies a vulnerability report: validity, type, CVSS, duplicate check, fix
export async function triageReport(
  reportText: string,
  programScope: string[]
): Promise<AiTriage> {
  const prompt = `
You are a senior cybersecurity analyst triaging a bug bounty vulnerability report.

PROGRAM SCOPE (only these targets are in scope):
${programScope.join("\n")}

SUBMITTED REPORT:
${reportText}

Analyze this report and return a JSON object with EXACTLY these fields:
{
  "validity": "valid" | "invalid" | "needs_more_info",
  "confidence": <number 0-100>,
  "vulnerability_type": "<e.g. SQL Injection, XSS, IDOR, SSRF...>",
  "cvss_score": <number 0-10>,
  "cvss_vector": "<CVSS:3.1/AV:.../...>",
  "is_duplicate": <boolean>,
  "fix_suggestion": "<specific actionable fix>",
  "fix_code": "<code snippet showing the fix, if applicable>",
  "simple_explanation": "<explain to a non-technical CEO in 2 sentences, use an analogy>",
  "technical_explanation": "<explain to a developer with exact file/function/line if possible>",
  "response_draft": "<professional response to the researcher>",
  "processed_at": "<ISO timestamp>"
}

Return ONLY the JSON. No markdown, no explanation.
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().replace(/```json|```/g, "").trim();
  return JSON.parse(text) as AiTriage;
}

// ── 2. AI VULNERABILITY EXPLAINER ───────────────────────────────────────────
// Explains scan results for 3 audiences: CEO, Developer, Compliance
export async function explainVulnerability(
  vuln: { name: string; description: string; affected: string },
  audience: "ceo" | "developer" | "compliance"
): Promise<string> {
  const audiencePrompts = {
    ceo: `Explain this to a non-technical Moroccan business owner in simple French.
          Use an everyday analogy. Max 3 sentences. Focus on business risk and urgency.`,
    developer: `Explain this to a senior developer. Be technical.
                Include the exact cause, attack vector, and precise code fix.`,
    compliance: `Explain this in the context of Moroccan Law 09-08 (data protection)
                 and Law 05-20 (cybersecurity). Which articles does this violate?
                 What are the legal consequences? Max 4 sentences.`,
  };

  const prompt = `
Vulnerability: ${vuln.name}
Description: ${vuln.description}
Affected: ${vuln.affected}

${audiencePrompts[audience]}
`;

  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}

// ── 3. AI FIX CODE GENERATOR ────────────────────────────────────────────────
// Generates actual code to fix a vulnerability
export async function generateFix(
  vulnName: string,
  vulnDescription: string,
  detectedStack?: string
): Promise<{ explanation: string; before: string; after: string }> {
  const prompt = `
You are a security engineer. Generate a concrete code fix for this vulnerability.

Vulnerability: ${vulnName}
Description: ${vulnDescription}
${detectedStack ? `Detected tech stack: ${detectedStack}` : ""}

Return a JSON object with EXACTLY these fields:
{
  "explanation": "<one sentence explaining the fix>",
  "before": "<vulnerable code snippet>",
  "after": "<fixed code snippet>"
}

Return ONLY the JSON. No markdown fences.
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().replace(/```json|```/g, "").trim();
  return JSON.parse(text);
}

// ── 4. AI REPORT WRITER ─────────────────────────────────────────────────────
// Transforms rough researcher notes into a professional report
export async function enhanceReport(rawNotes: string): Promise<{
  title: string;
  description: string;
  steps_to_reproduce: string;
  impact: string;
  mitigation: string;
}> {
  const prompt = `
You are a professional bug bounty report writer. Transform these raw security notes
into a clean, professional vulnerability report.

RAW NOTES:
${rawNotes}

Return a JSON object with EXACTLY these fields:
{
  "title": "<concise vulnerability title>",
  "description": "<clear technical description>",
  "steps_to_reproduce": "<numbered steps>",
  "impact": "<business and technical impact>",
  "mitigation": "<recommended fix>"
}

Return ONLY the JSON. No markdown fences.
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().replace(/```json|```/g, "").trim();
  return JSON.parse(text);
}

// ── 5. AI TRANSLATOR ────────────────────────────────────────────────────────
// Translates security content across FR / AR / Darija / EN
export async function translateSecurityContent(
  text: string,
  targetLanguage: "french" | "arabic" | "darija" | "english"
): Promise<string> {
  const langInstructions = {
    french: "Translate to professional French. Keep technical security terms in English.",
    arabic: "Translate to Modern Standard Arabic (فصحى). Keep CVE IDs and technical terms as-is.",
    darija: "Translate to Moroccan Darija (الدارجة المغربية) written in Arabic script. Be natural and conversational, not formal.",
    english: "Translate to professional English. Keep technical security terms precise.",
  };

  const prompt = `
${langInstructions[targetLanguage]}

Text to translate:
${text}

Return ONLY the translated text. No explanations.
`;

  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}

// ── 6. AI SCOPE ANALYZER ────────────────────────────────────────────────────
// Auto-discovers assets from a domain and suggests scope + reward tiers
export async function analyzeProgramScope(domain: string): Promise<{
  suggested_scope: string[];
  out_of_scope: string[];
  reward_tiers: { severity: string; min_mad: number; max_mad: number }[];
  notes: string;
}> {
  const prompt = `
You are a bug bounty program manager helping a Moroccan company set up their
vulnerability disclosure program.

Company domain: ${domain}

Based on typical web company architecture, suggest:
{
  "suggested_scope": ["<list of assets likely in scope, e.g. *.domain.ma, api.domain.ma>"],
  "out_of_scope": ["<list of things typically excluded, e.g. third-party services>"],
  "reward_tiers": [
    {"severity": "Critical", "min_mad": 2000, "max_mad": 10000},
    {"severity": "High",     "min_mad": 1000, "max_mad": 3000},
    {"severity": "Medium",   "min_mad": 300,  "max_mad": 800},
    {"severity": "Low",      "min_mad": 100,  "max_mad": 200}
  ],
  "notes": "<any special considerations for this company type>"
}

Return ONLY the JSON. No markdown fences.
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().replace(/```json|```/g, "").trim();
  return JSON.parse(text);
}
