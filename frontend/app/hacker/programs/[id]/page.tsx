"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { CalendarDays, FileText, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { LightBadge, ProgramIcon, formatMad } from "@/components/hacker/hacker-ui";
import { HACKER_PROGRAMS, SUBMITTED_REPORTS } from "@/lib/mock-data";

const tabs = ["Program Information", "Reports", "Updates"] as const;

export default function HackerProgramDetailsPage() {
  const params = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Program Information");
  const program = HACKER_PROGRAMS.find((item) => item.id === params.id);

  if (!program) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-slate-950">Program not found</h1>
        <p className="mt-2 text-slate-600">This demo program is not available.</p>
        <Link
          href="/hacker/programs"
          className="mt-5 inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Back to programs
        </Link>
      </div>
    );
  }

  const reports = SUBMITTED_REPORTS.filter((report) => report.programId === program.id);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex gap-4">
            <ProgramIcon tone={program.logoTone} />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-3xl font-bold text-slate-950">{program.name}</h1>
                <LightBadge value={program.status}>{program.status}</LightBadge>
              </div>
              <p className="mt-2 text-sm font-semibold text-blue-700">{program.code}</p>
              <p className="mt-4 max-w-3xl leading-7 text-slate-600">{program.description}</p>
            </div>
          </div>
          <Link
            href={`/hacker/reports/new?program=${program.id}`}
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Submit Report
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <InfoCard icon={CalendarDays} label="Start Date" value={formatDate(program.startDate)} />
        <InfoCard icon={CalendarDays} label="End Date" value={formatDate(program.endDate)} />
        <InfoCard icon={FileText} label="Submitted Reports" value={String(program.submittedReports)} />
        <InfoCard icon={ShieldCheck} label="Risk Level" value={program.riskLevel} />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-bold text-slate-950">Reward Table</h2>
        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Severity</th>
                <th className="px-4 py-3 font-semibold">Reward</th>
                <th className="px-4 py-3 font-semibold">Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {program.rewardRanges.map((range) => (
                <tr key={range.severity}>
                  <td className="px-4 py-3">
                    <LightBadge variant="severity" value={range.severity}>
                      {range.severity}
                    </LightBadge>
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {formatMad.format(range.minMad)} - {formatMad.format(range.maxMad)}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {range.minPoints} - {range.maxPoints} points
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap gap-2 border-b border-slate-200 p-3">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                activeTab === tab
                  ? "bg-blue-600 text-white"
                  : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="p-5">
          {activeTab === "Program Information" ? (
            <div className="space-y-5">
              <div>
                <h3 className="font-semibold text-slate-950">Company Description</h3>
                <p className="mt-2 leading-7 text-slate-600">{program.description}</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-950">Scope Domains</h3>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  {program.scopes.map((scope) => (
                    <div key={scope.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <p className="font-semibold text-slate-950">{scope.domain}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {scope.type} - {scope.status}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {activeTab === "Reports" ? (
            <div className="space-y-3">
              {reports.length ? (
                reports.map((report) => (
                  <div key={report.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-950">{report.title}</p>
                        <p className="mt-1 text-sm text-slate-500">{report.affectedAsset}</p>
                      </div>
                      <LightBadge value={report.status}>{report.status}</LightBadge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="rounded-xl bg-slate-50 p-5 text-sm text-slate-600">
                  You have not submitted a report for this program yet.
                </p>
              )}
            </div>
          ) : null}

          {activeTab === "Updates" ? (
            <div className="space-y-3 text-sm text-slate-600">
              <p className="rounded-xl bg-slate-50 p-4">
                Reward table confirmed for the current demo cycle.
              </p>
              <p className="rounded-xl bg-slate-50 p-4">
                Scope remains limited to fictional .example.ma assets listed above.
              </p>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CalendarDays;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <Icon className="h-5 w-5 text-blue-600" />
      <p className="mt-4 text-sm text-slate-500">{label}</p>
      <p className="mt-1 font-bold text-slate-950">{value}</p>
    </div>
  );
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
