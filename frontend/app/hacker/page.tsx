import Link from "next/link";
import { ArrowRight, Award, FileText, ShieldCheck, Target } from "lucide-react";
import { ProgramCard } from "@/components/hacker/program-card";
import { LightBadge, formatMad } from "@/components/hacker/hacker-ui";
import {
  DEMO_HACKER_USER,
  HACKER_PROGRAMS,
  HACKER_REWARDS,
  SUBMITTED_REPORTS,
} from "@/lib/mock-data";

export default function HackerDashboardPage() {
  const totalEarned = HACKER_REWARDS.reduce(
    (total, reward) => total + (reward.status === "Paid" ? reward.amountMad : 0),
    0
  );
  const pendingRewards = HACKER_REWARDS.reduce(
    (total, reward) => total + (reward.status === "Pending" ? reward.amountMad : 0),
    0
  );

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-blue-600 p-6 text-white shadow-xl shadow-blue-100 md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-100">Welcome back</p>
            <h1 className="mt-2 text-3xl font-bold">{DEMO_HACKER_USER.name}</h1>
            <p className="mt-3 max-w-2xl text-blue-50">
              Track your programs, submit vulnerability reports, and follow rewards
              from the BroadSec researcher portal.
            </p>
          </div>
          <Link
            href="/hacker/reports/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50"
          >
            Submit Report
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={Target} label="Open Programs" value={String(HACKER_PROGRAMS.length)} />
        <MetricCard icon={FileText} label="Submitted Reports" value={String(SUBMITTED_REPORTS.length)} />
        <MetricCard icon={Award} label="Earned Rewards" value={formatMad.format(totalEarned)} />
        <MetricCard icon={ShieldCheck} label="Pending Rewards" value={formatMad.format(pendingRewards)} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-950">Recommended Programs</h2>
              <p className="text-sm text-slate-500">Start with safe demo scopes and clear reward tables.</p>
            </div>
            <Link href="/hacker/programs" className="text-sm font-semibold text-blue-700 hover:text-blue-800">
              View all
            </Link>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {HACKER_PROGRAMS.slice(0, 2).map((program) => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-bold text-slate-950">Recent Reports</h2>
          <div className="mt-5 space-y-4">
            {SUBMITTED_REPORTS.slice(0, 4).map((report) => {
              const program = HACKER_PROGRAMS.find((item) => item.id === report.programId);

              return (
                <div key={report.id} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-950">{report.title}</p>
                      <p className="mt-1 text-xs text-slate-500">{program?.name}</p>
                    </div>
                    <LightBadge value={report.status}>{report.status}</LightBadge>
                  </div>
                  <p className="mt-3 text-sm text-slate-600">{report.affectedAsset}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

function MetricCard({
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
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-4 text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-950">{value}</p>
    </div>
  );
}
