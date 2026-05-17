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
  "Critical",
  "High",
  "Medium",
  "Low",
];

const vulnerabilityTypes = [
  "Access Control",
  "Cross-Site Scripting",
  "SQL Injection",
  "Server-Side Request Forgery",
  "Security Misconfiguration",
  "Sensitive Data Exposure",
];

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
    if (queryProgram && HACKER_PROGRAMS.some((program) => program.id === queryProgram)) {
      setProgramId(queryProgram);
    }
  }, []);

  const selectedProgram = HACKER_PROGRAMS.find((program) => program.id === programId);

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
    ]
      .filter(Boolean)
      .join("\n\n");

    try {
      const [reportResult, triageResult] = await Promise.all([
        generateReport(rawNotes || "Researcher submitted an incomplete vulnerability report."),
        triageReport({
          report: rawNotes || "Researcher submitted an incomplete vulnerability report.",
          scope: selectedProgram?.scopes.map((scope) => scope.domain) ?? [],
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
          ? `Demo AI fallback is active because the API is unavailable: ${error.message}`
          : "Demo AI fallback is active because the API is unavailable."
      );
    } finally {
      setIsImproving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-950">Submit Vulnerability Report</h1>
        <p className="mt-2 text-slate-600">
          Share a clear, reproducible report with scope, impact, and remediation details.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <form
          className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          onSubmit={(event) => {
            event.preventDefault();
            setSubmitted(true);
          }}
        >
          {submitted ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
              Demo report submitted. It is now ready for review in the Reports page.
            </div>
          ) : null}

          <Field label="Program">
            <select
              value={programId}
              onChange={(event) => setProgramId(event.target.value)}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none focus:border-blue-500"
            >
              {HACKER_PROGRAMS.map((program) => (
                <option key={program.id} value={program.id}>
                  {program.name}
                </option>
              ))}
            </select>
          </Field>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Vulnerability title">
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none focus:border-blue-500"
                placeholder="Example: IDOR in statement endpoint"
              />
            </Field>
            <Field label="Vulnerability type">
              <select
                value={vulnerabilityType}
                onChange={(event) => setVulnerabilityType(event.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none focus:border-blue-500"
              >
                {vulnerabilityTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Severity">
              <select
                value={severity}
                onChange={(event) =>
                  setSeverity(event.target.value as Exclude<SeverityLabel, "Informative">)
                }
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none focus:border-blue-500"
              >
                {severityOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Affected asset / URL">
              <input
                value={affectedAsset}
                onChange={(event) => setAffectedAsset(event.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none focus:border-blue-500"
                placeholder={selectedProgram?.scopes[0]?.domain ?? "example.ma"}
              />
            </Field>
          </div>

          <Field label="Summary">
            <textarea
              value={summary}
              onChange={(event) => setSummary(event.target.value)}
              className="min-h-28 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-950 outline-none focus:border-blue-500"
              placeholder="Explain what is vulnerable and where it happens."
            />
          </Field>
          <Field label="Steps to reproduce">
            <textarea
              value={steps}
              onChange={(event) => setSteps(event.target.value)}
              className="min-h-32 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-950 outline-none focus:border-blue-500"
              placeholder="1. Sign in with a demo account..."
            />
          </Field>
          <Field label="Impact">
            <textarea
              value={impact}
              onChange={(event) => setImpact(event.target.value)}
              className="min-h-28 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-950 outline-none focus:border-blue-500"
              placeholder="Describe what an attacker can access or change."
            />
          </Field>
          <Field label="Suggested remediation">
            <textarea
              value={remediation}
              onChange={(event) => setRemediation(event.target.value)}
              className="min-h-28 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-950 outline-none focus:border-blue-500"
              placeholder="Suggest a practical fix for the affected control."
            />
          </Field>

          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
            <UploadCloud className="mx-auto h-8 w-8 text-blue-600" />
            <p className="mt-3 font-semibold text-slate-950">Attachments placeholder</p>
            <p className="mt-1 text-sm text-slate-500">
              Screenshots, proof-of-concept files, and safe logs can be attached here in a full build.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={improveWithAi}
              disabled={isImproving}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 px-5 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50 disabled:opacity-60"
            >
              {isImproving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              Improve Report with AI
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <FileUp className="h-4 w-4" />
              Submit Report
            </button>
          </div>
        </form>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-bold text-slate-950">AI Helper</h2>
              {isMockFallback ? (
                <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">
                  Mock fallback
                </span>
              ) : null}
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              The helper reuses the BroadSec report writer and triage API endpoints. If
              the backend is offline, a demo suggestion is shown.
            </p>
            {notice ? (
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
                {notice}
              </div>
            ) : null}
          </div>

          {aiSuggestion ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-bold text-slate-950">AI Result</h2>
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
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
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
      <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>
      {children}
    </label>
  );
}

function Result({ label, value }: { label: string; value: string }) {
  return (
    <div className="mt-4 rounded-xl bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-sm leading-6 text-slate-700">{value}</p>
    </div>
  );
}
