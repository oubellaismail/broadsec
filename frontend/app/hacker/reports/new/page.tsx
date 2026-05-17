"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { FileUp, Loader2, Sparkles, UploadCloud } from "lucide-react";
import { LightBadge } from "@/components/hacker/hacker-ui";
import { generateReport, triageReport } from "@/lib/api";
import {
  DEFAULT_AI_REPORT_SUGGESTION,
  FALLBACK_REPORT_RESULT,
  HACKER_PROGRAMS,
} from "@/lib/mock-data";
import type { AIReportSuggestion, SeverityLabel } from "@/types";

const severityOptions: Array<Exclude<SeverityLabel, "Informative">> = [
  "Critical", "High", "Medium", "Low",
];

const vulnerabilityTypes = [
  "Access Control",
  "Cross-Site Scripting",
  "SQL Injection",
  "Server-Side Request Forgery",
  "Security Misconfiguration",
  "Sensitive Data Exposure",
];

const inputCls =
  "h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white placeholder:text-white/25 outline-none focus:border-[#D4A017]/40 transition-colors";
const textareaCls =
  "min-h-28 w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white placeholder:text-white/25 outline-none focus:border-[#D4A017]/40 transition-colors";

export default function NewReportPage() {
  const [programId, setProgramId] = useState(HACKER_PROGRAMS[0]?.id ?? "");
  const [title, setTitle] = useState("");
  const [vulnerabilityType, setVulnerabilityType] = useState(vulnerabilityTypes[0]);
  const [severity, setSeverity] = useState<Exclude<SeverityLabel, "Informative">>("High");
  const [affectedAsset, setAffectedAsset] = useState("");
  const [summary, setSummary] = useState("");
  const [steps, setSteps] = useState("");
  const [impact, setImpact] = useState("");
  const [remediation, setRemediation] = useState("");
  const [aiSuggestion, setAiSuggestion] = useState<AIReportSuggestion>();
  const [notice, setNotice] = useState<string>();
  const [isMockFallback, setIsMockFallback] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const queryProgram = new URLSearchParams(window.location.search).get("program");
    if (queryProgram && HACKER_PROGRAMS.some((p) => p.id === queryProgram)) {
      setProgramId(queryProgram);
    }
  }, []);

  const selectedProgram = HACKER_PROGRAMS.find((p) => p.id === programId);

  const improveWithAi = async () => {
    setIsImproving(true);
    setNotice(undefined);
    setIsMockFallback(false);

    const rawNotes = [
      title && `Title: ${title}`,
      vulnerabilityType && `Type: ${vulnerabilityType}`,
      severity && `Severity: ${severity}`,
      affectedAsset && `Affected asset: ${affectedAsset}`,
      summary && `Summary: ${summary}`,
      steps && `Steps: ${steps}`,
      impact && `Impact: ${impact}`,
      remediation && `Remediation: ${remediation}`,
    ].filter(Boolean).join("\n\n");

    try {
      const [reportResult, triageResult] = await Promise.all([
        generateReport(rawNotes || "Researcher submitted an incomplete vulnerability report."),
        triageReport({
          report: rawNotes || "Researcher submitted an incomplete vulnerability report.",
          scope: selectedProgram?.scopes.map((s) => s.domain) ?? [],
        }),
      ]);

      const suggestion: AIReportSuggestion = {
        improvedSummary: reportResult.description,
        recommendedSeverity: reportResult.suggested_severity,
        suggestedFix: reportResult.mitigation || triageResult.fix_suggestion,
        duplicateSuspicion: triageResult.is_duplicate,
      };

      setAiSuggestion(suggestion);
      if (!summary.trim()) setSummary(reportResult.description);
      if (!impact.trim()) setImpact(reportResult.impact);
      if (!remediation.trim()) setRemediation(reportResult.mitigation);
      setSeverity(reportResult.suggested_severity);
    } catch (error) {
      setIsMockFallback(true);
      setAiSuggestion(DEFAULT_AI_REPORT_SUGGESTION);
      if (!summary.trim()) setSummary(FALLBACK_REPORT_RESULT.description);
      if (!impact.trim()) setImpact(FALLBACK_REPORT_RESULT.impact);
      if (!remediation.trim()) setRemediation(FALLBACK_REPORT_RESULT.mitigation);
      setSeverity(FALLBACK_REPORT_RESULT.suggested_severity);
      setNotice(
        error instanceof Error
          ? `Demo AI fallback active: ${error.message}`
          : "Demo AI fallback is active because the API is unavailable."
      );
    } finally {
      setIsImproving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Submit Vulnerability Report</h1>
        <p className="mt-1.5 text-sm text-white/45">
          Share a clear, reproducible report with scope, impact, and remediation details.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <form
          className="space-y-5 rounded-2xl border border-white/8 bg-white/3 p-5"
          onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
        >
          {submitted && (
            <div className="rounded-xl border border-[#1F6B35]/30 bg-[#1F6B35]/10 p-4 text-sm font-medium text-[#4ade80]">
              Demo report submitted. It is now ready for review in the Reports page.
            </div>
          )}

          <Field label="Program">
            <select
              value={programId}
              onChange={(e) => setProgramId(e.target.value)}
              className={inputCls + " appearance-none"}
            >
              {HACKER_PROGRAMS.map((p) => (
                <option key={p.id} value={p.id} className="bg-[#0e0b08]">{p.name}</option>
              ))}
            </select>
          </Field>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Vulnerability title">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={inputCls}
                placeholder="IDOR in statement endpoint"
              />
            </Field>
            <Field label="Vulnerability type">
              <select
                value={vulnerabilityType}
                onChange={(e) => setVulnerabilityType(e.target.value)}
                className={inputCls + " appearance-none"}
              >
                {vulnerabilityTypes.map((t) => (
                  <option key={t} value={t} className="bg-[#0e0b08]">{t}</option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Severity">
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as Exclude<SeverityLabel, "Informative">)}
                className={inputCls + " appearance-none"}
              >
                {severityOptions.map((s) => (
                  <option key={s} value={s} className="bg-[#0e0b08]">{s}</option>
                ))}
              </select>
            </Field>
            <Field label="Affected asset / URL">
              <input
                value={affectedAsset}
                onChange={(e) => setAffectedAsset(e.target.value)}
                className={inputCls}
                placeholder={selectedProgram?.scopes[0]?.domain ?? "example.ma"}
              />
            </Field>
          </div>

          <Field label="Summary">
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className={textareaCls}
              placeholder="Explain what is vulnerable and where it happens."
            />
          </Field>
          <Field label="Steps to reproduce">
            <textarea
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
              className={textareaCls + " min-h-32"}
              placeholder="1. Sign in with a demo account..."
            />
          </Field>
          <Field label="Impact">
            <textarea
              value={impact}
              onChange={(e) => setImpact(e.target.value)}
              className={textareaCls}
              placeholder="Describe what an attacker can access or change."
            />
          </Field>
          <Field label="Suggested remediation">
            <textarea
              value={remediation}
              onChange={(e) => setRemediation(e.target.value)}
              className={textareaCls}
              placeholder="Suggest a practical fix for the affected control."
            />
          </Field>

          <div className="rounded-xl border border-dashed border-white/12 bg-white/3 p-6 text-center">
            <UploadCloud className="mx-auto h-8 w-8 text-[#D4A017]/50" />
            <p className="mt-3 font-semibold text-white/70">Attachments placeholder</p>
            <p className="mt-1 text-sm text-white/35">
              Screenshots and proof-of-concept files can be attached in a full build.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={improveWithAi}
              disabled={isImproving}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-white/70 transition hover:border-[#D4A017]/30 hover:text-[#D4A017] disabled:opacity-50"
            >
              {isImproving
                ? <Loader2 className="h-4 w-4 animate-spin" />
                : <Sparkles className="h-4 w-4" />}
              Improve with AI
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D4A017] px-5 py-3 text-sm font-semibold text-[#080604] transition hover:bg-[#b8880f]"
            >
              <FileUp className="h-4 w-4" />
              Submit Report
            </button>
          </div>
        </form>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-white/8 bg-white/3 p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-white">AI Helper</h2>
              {isMockFallback && (
                <span className="rounded-full border border-[#D4A017]/30 bg-[#D4A017]/10 px-3 py-1 text-xs font-semibold text-[#D4A017]">
                  Mock fallback
                </span>
              )}
            </div>
            <p className="mt-2 text-sm leading-6 text-white/45">
              Reuses the BroadSec report writer and triage API. If the backend is
              offline, a demo suggestion is shown instead.
            </p>
            {notice && (
              <div className="mt-4 rounded-xl border border-[#D4A017]/20 bg-[#D4A017]/8 p-3 text-sm text-[#D4A017]/80">
                {notice}
              </div>
            )}
          </div>

          {aiSuggestion ? (
            <div className="rounded-2xl border border-white/8 bg-white/3 p-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-bold text-white">AI Result</h2>
                <LightBadge variant="severity" value={aiSuggestion.recommendedSeverity}>
                  {aiSuggestion.recommendedSeverity}
                </LightBadge>
              </div>
              <Result label="Improved summary" value={aiSuggestion.improvedSummary} />
              <Result label="Suggested fix" value={aiSuggestion.suggestedFix} />
              <Result
                label="Duplicate suspicion"
                value={aiSuggestion.duplicateSuspicion ? "Possible duplicate" : "No duplicate signal"}
              />
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/10 bg-white/2 p-6 text-center text-sm text-white/35">
              Run the AI helper to preview improved summary, recommended severity,
              suggested fix, and duplicate suspicion.
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-white/55">{label}</span>
      {children}
    </label>
  );
}

function Result({ label, value }: { label: string; value: string }) {
  return (
    <div className="mt-4 rounded-xl bg-white/5 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-white/35">{label}</p>
      <p className="mt-2 text-sm leading-6 text-white/70">{value}</p>
    </div>
  );
}
