import Link from "next/link";
import { Eye, Plus } from "lucide-react";
import { LightBadge, formatMad } from "@/components/hacker/hacker-ui";
import { HACKER_PROGRAMS, SUBMITTED_REPORTS } from "@/lib/mock-data";

export default function HackerReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Reports</h1>
          <p className="mt-1.5 text-sm text-white/45">
            Track submitted reports, triage status, rewards, and updates.
          </p>
        </div>
        <Link
          href="/hacker/reports/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D4A017] px-5 py-2.5 text-sm font-semibold text-[#080604] transition hover:bg-[#b8880f]"
        >
          <Plus className="h-4 w-4" />
          New Report
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/8 bg-white/3">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px] text-left text-sm">
            <thead className="border-b border-white/8 text-white/40">
              <tr>
                <th className="px-5 py-3 font-semibold">Report</th>
                <th className="px-5 py-3 font-semibold">Program</th>
                <th className="px-5 py-3 font-semibold">Severity</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Reward</th>
                <th className="px-5 py-3 font-semibold">Submitted</th>
                <th className="px-5 py-3 font-semibold">Last Update</th>
                <th className="px-5 py-3 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {SUBMITTED_REPORTS.map((report) => {
                const program = HACKER_PROGRAMS.find((item) => item.id === report.programId);
                return (
                  <tr key={report.id} className="transition hover:bg-white/3">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-white">{report.title}</p>
                      <p className="mt-0.5 text-xs text-white/35">{report.id}</p>
                    </td>
                    <td className="px-5 py-4 text-white/55">{program?.name}</td>
                    <td className="px-5 py-4">
                      <LightBadge variant="severity" value={report.severity}>
                        {report.severity}
                      </LightBadge>
                    </td>
                    <td className="px-5 py-4">
                      <LightBadge value={report.status}>{report.status}</LightBadge>
                    </td>
                    <td className="px-5 py-4 font-semibold text-[#D4A017]">
                      {formatMad.format(report.rewardMad)}
                    </td>
                    <td className="px-5 py-4 text-white/55">{formatDate(report.createdAt)}</td>
                    <td className="px-5 py-4 text-white/55">{formatDate(report.updatedAt)}</td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/hacker/reports/${report.id}`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-sm font-semibold text-white/70 transition hover:border-[#D4A017]/30 hover:text-[#D4A017]"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
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
