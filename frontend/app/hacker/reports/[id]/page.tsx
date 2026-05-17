"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  FileText,
  Paperclip,
  Sparkles,
  Target,
  Wallet,
} from "lucide-react";
import { LightBadge, formatMad } from "@/components/hacker/hacker-ui";
import { HACKER_PROGRAMS, SUBMITTED_REPORTS } from "@/lib/mock-data";

export default function HackerReportDetailsPage() {
  const params = useParams<{ id: string }>();
  const report = SUBMITTED_REPORTS.find((item) => item.id === params.id);

  if (!report) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
          <FileText className="h-6 w-6" />
        </div>
        <h1 className="mt-5 text-2xl font-bold text-slate-950">Report not found</h1>
        <p className="mt-2 text-slate-600">
          The report ID does not match any submitted demo report.
        </p>
        <Link
          href="/hacker/reports"
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Reports
        </Link>
      </div>
    );
  }

  const program = HACKER_PROGRAMS.find((item) => item.id === report.programId);
  const timeline = getTimeline(report.status, report.createdAt, report.updatedAt);

  return (
    <div className="space-y-6">
      <Link
        href="/hacker/reports"
        className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Reports
      </Link>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <LightBadge variant="severity" value={report.severity}>
                {report.severity}
              </LightBadge>
              <LightBadge value={report.status}>{report.status}</LightBadge>
            </div>
            <h1 className="mt-4 text-3xl font-bold text-slate-950">{report.title}</h1>
            <p className="mt-2 text-sm font-semibold text-blue-700">{report.id}</p>
            <p className="mt-4 max-w-3xl leading-7 text-slate-600">
              {program?.name ?? "Unknown program"}
            </p>
          </div>
          <div className="rounded-2xl bg-blue-50 p-5 text-blue-950">
            <p className="text-sm text-blue-700">Reward amount</p>
            <p className="mt-2 text-3xl font-bold">{formatMad.format(report.rewardMad)}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <InfoCard icon={Target} label="Affected asset / URL" value={report.affectedAsset} />
        <InfoCard icon={CalendarDays} label="Submitted date" value={formatDate(report.createdAt)} />
        <InfoCard icon={CalendarDays} label="Last update" value={formatDate(report.updatedAt)} />
        <InfoCard icon={Wallet} label="Program" value={program?.companyName ?? "Unknown company"} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-5">
          <DetailBlock title="Summary" body={report.summary} />
          <DetailBlock title="Steps to reproduce" body={report.stepsToReproduce} preserve />
          <DetailBlock title="Impact" body={report.impact} />
          <DetailBlock title="Suggested remediation" body={report.remediation} />

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <Paperclip className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl font-bold text-slate-950">Attachments</h2>
            </div>
            {report.attachments.length ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {report.attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <p className="font-semibold text-slate-950">{attachment.name}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {attachment.type} - {attachment.sizeKb} KB
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500">
                No attachments were uploaded for this demo report.
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl font-bold text-slate-950">AI Suggestion</h2>
            </div>
            {report.aiSuggestion ? (
              <div className="mt-4 space-y-4">
                <LightBadge variant="severity" value={report.aiSuggestion.recommendedSeverity}>
                  {report.aiSuggestion.recommendedSeverity}
                </LightBadge>
                <MiniBlock label="Improved summary" value={report.aiSuggestion.improvedSummary} />
                <MiniBlock label="Suggested fix" value={report.aiSuggestion.suggestedFix} />
                <MiniBlock
                  label="Duplicate suspicion"
                  value={
                    report.aiSuggestion.duplicateSuspicion
                      ? "Possible duplicate"
                      : "No duplicate signal"
                  }
                />
              </div>
            ) : (
              <p className="mt-4 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                No AI suggestion is attached to this report yet.
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">Timeline</h2>
            <div className="mt-5 space-y-4">
              {timeline.map((item) => (
                <div key={`${item.label}-${item.date}`} className="flex gap-3">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-950">{item.label}</p>
                    <p className="mt-1 text-sm text-slate-500">{formatDate(item.date)}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{item.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Target;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <Icon className="h-5 w-5 text-blue-600" />
      <p className="mt-4 text-sm text-slate-500">{label}</p>
      <p className="mt-1 break-words font-bold text-slate-950">{value}</p>
    </div>
  );
}

function DetailBlock({
  title,
  body,
  preserve,
}: {
  title: string;
  body: string;
  preserve?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-bold text-slate-950">{title}</h2>
      <p className={`mt-3 leading-7 text-slate-600 ${preserve ? "whitespace-pre-line" : ""}`}>
        {body}
      </p>
    </div>
  );
}

function MiniBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-sm leading-6 text-slate-700">{value}</p>
    </div>
  );
}

function getTimeline(status: string, createdAt: string, updatedAt: string) {
  const timeline = [
    {
      label: "Report submitted",
      date: createdAt,
      note: "The researcher submitted the vulnerability report for program review.",
    },
    {
      label: "Triage started",
      date: createdAt,
      note: "BroadSec queued the report for validation and scope review.",
    },
  ];

  timeline.push({
    label: status,
    date: updatedAt,
    note:
      status === "Fixed"
        ? "The program marked the issue as fixed after remediation review."
        : status === "Accepted"
          ? "The program accepted the report and assigned a reward."
          : status === "Duplicate"
            ? "The report matches an existing accepted or tracked submission."
            : status === "Rejected"
              ? "The program rejected the report after review."
              : "The report is still being reviewed by the program team.",
  });

  return timeline;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
