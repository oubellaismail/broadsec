import Link from "next/link";
import { Eye, Plus } from "lucide-react";
import { LightBadge, formatMad } from "@/components/hacker/hacker-ui";
import { HACKER_PROGRAMS, SUBMITTED_REPORTS } from "@/lib/mock-data";

export default function HackerReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-950">Reports</h1>
          <p className="mt-2 text-slate-600">
            Track submitted reports, triage status, rewards, and updates.
          </p>
        </div>
        <Link
          href="/hacker/reports/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          New Report
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[880px] text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-5 py-4 font-semibold">Report</th>
              <th className="px-5 py-4 font-semibold">Program</th>
              <th className="px-5 py-4 font-semibold">Severity</th>
              <th className="px-5 py-4 font-semibold">Status</th>
              <th className="px-5 py-4 font-semibold">Reward</th>
              <th className="px-5 py-4 font-semibold">Submitted</th>
              <th className="px-5 py-4 font-semibold">Last Update</th>
              <th className="px-5 py-4 text-right font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {SUBMITTED_REPORTS.map((report) => {
              const program = HACKER_PROGRAMS.find((item) => item.id === report.programId);

              return (
                <tr key={report.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-950">{report.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{report.id}</p>
                  </td>
                  <td className="px-5 py-4 text-slate-600">{program?.name}</td>
                  <td className="px-5 py-4">
                    <LightBadge variant="severity" value={report.severity}>
                      {report.severity}
                    </LightBadge>
                  </td>
                  <td className="px-5 py-4">
                    <LightBadge value={report.status}>{report.status}</LightBadge>
                  </td>
                  <td className="px-5 py-4 font-semibold text-slate-950">
                    {formatMad.format(report.rewardMad)}
                  </td>
                  <td className="px-5 py-4 text-slate-600">{formatDate(report.createdAt)}</td>
                  <td className="px-5 py-4 text-slate-600">{formatDate(report.updatedAt)}</td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/hacker/reports/${report.id}`}
                      className="inline-flex items-center gap-2 rounded-lg border border-blue-200 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
                    >
                      <Eye className="h-4 w-4" />
                      View Details
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
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
