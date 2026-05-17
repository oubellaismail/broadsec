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
      <div className="rounded-2xl border border-white/8 bg-white/3 p-8 text-center">
        <h1 className="text-2xl font-bold text-white">Program not found</h1>
        <p className="mt-2 text-sm text-white/45">This demo program is not available.</p>
        <Link
          href="/hacker/programs"
          className="mt-5 inline-flex rounded-xl bg-[#D4A017] px-5 py-3 text-sm font-semibold text-[#080604] hover:bg-[#b8880f]"
        >
          Back to programs
        </Link>
      </div>
    );
  }

  const reports = SUBMITTED_REPORTS.filter((report) => report.programId === program.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="rounded-2xl border border-white/8 bg-white/3 p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex gap-4">
            <ProgramIcon tone={program.logoTone} />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold text-white">{program.name}</h1>
                <LightBadge value={program.status}>{program.status}</LightBadge>
              </div>
              <p className="mt-1.5 text-sm font-semibold text-[#D4A017]/70">{program.code}</p>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-white/50">{program.description}</p>
            </div>
          </div>
          <Link
            href={`/hacker/reports/new?program=${program.id}`}
            className="inline-flex items-center justify-center rounded-xl bg-[#D4A017] px-5 py-3 text-sm font-semibold text-[#080604] transition hover:bg-[#b8880f]"
          >
            Submit Report
          </Link>
        </div>
      </section>

      {/* Info cards */}
      <section className="grid gap-4 md:grid-cols-4">
        <InfoCard icon={CalendarDays} label="Start Date"         value={formatDate(program.startDate)} />
        <InfoCard icon={CalendarDays} label="End Date"           value={formatDate(program.endDate)} />
        <InfoCard icon={FileText}     label="Submitted Reports"  value={String(program.submittedReports)} />
        <InfoCard icon={ShieldCheck}  label="Risk Level"         value={program.riskLevel} />
      </section>

      {/* Reward table */}
      <section className="rounded-2xl border border-white/8 bg-white/3 p-5">
        <h2 className="text-lg font-bold text-white">Reward Table</h2>
        <div className="mt-4 overflow-hidden rounded-xl border border-white/8">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/8 text-white/40">
              <tr>
                <th className="px-4 py-3 font-semibold">Severity</th>
                <th className="px-4 py-3 font-semibold">Reward</th>
                <th className="px-4 py-3 font-semibold">Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {program.rewardRanges.map((range) => (
                <tr key={range.severity}>
                  <td className="px-4 py-3">
                    <LightBadge variant="severity" value={range.severity}>
                      {range.severity}
                    </LightBadge>
                  </td>
                  <td className="px-4 py-3 font-medium text-[#D4A017]">
                    {formatMad.format(range.minMad)} – {formatMad.format(range.maxMad)}
                  </td>
                  <td className="px-4 py-3 text-white/50">
                    {range.minPoints} – {range.maxPoints} pts
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Tabs */}
      <section className="rounded-2xl border border-white/8 bg-white/3">
        <div className="flex flex-wrap gap-2 border-b border-white/8 p-3">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                activeTab === tab
                  ? "bg-[#D4A017]/15 text-[#D4A017]"
                  : "text-white/50 hover:bg-white/5 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="p-5">
          {activeTab === "Program Information" && (
            <div className="space-y-5">
              <div>
                <h3 className="font-semibold text-white">Company Description</h3>
                <p className="mt-2 text-sm leading-7 text-white/50">{program.description}</p>
              </div>
              <div>
                <h3 className="font-semibold text-white">Scope Domains</h3>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  {program.scopes.map((scope) => (
                    <div key={scope.id} className="rounded-xl border border-white/8 bg-white/3 p-4">
                      <p className="font-semibold text-white">{scope.domain}</p>
                      <p className="mt-1 text-sm text-white/40">
                        {scope.type} · {scope.status}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "Reports" && (
            <div className="space-y-3">
              {reports.length ? (
                reports.map((report) => (
                  <div key={report.id} className="rounded-xl border border-white/8 bg-white/3 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-white">{report.title}</p>
                        <p className="mt-0.5 text-sm text-white/40">{report.affectedAsset}</p>
                      </div>
                      <LightBadge value={report.status}>{report.status}</LightBadge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="rounded-xl bg-white/3 p-5 text-sm text-white/40">
                  You have not submitted a report for this program yet.
                </p>
              )}
            </div>
          )}

          {activeTab === "Updates" && (
            <div className="space-y-3 text-sm text-white/50">
              <p className="rounded-xl bg-white/3 p-4">
                Reward table confirmed for the current demo cycle.
              </p>
              <p className="rounded-xl bg-white/3 p-4">
                Scope remains limited to fictional .example.ma assets listed above.
              </p>
            </div>
          )}
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
    <div className="rounded-2xl border border-white/8 bg-white/3 p-5">
      <Icon className="h-5 w-5 text-[#D4A017]/70" />
      <p className="mt-4 text-sm text-white/40">{label}</p>
      <p className="mt-1 font-bold text-white">{value}</p>
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
