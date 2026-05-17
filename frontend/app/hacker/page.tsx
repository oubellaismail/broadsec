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
      {/* Hero banner */}
      <section className="rounded-2xl border border-[#D4A017]/15 bg-[#D4A017]/8 p-6 md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium text-[#D4A017]/70">Welcome back</p>
            <h1 className="mt-2 text-3xl font-bold text-white">{DEMO_HACKER_USER.name}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/50">
              Track your programs, submit vulnerability reports, and follow rewards
              from the BroadSec researcher portal.
            </p>
          </div>
          <Link
            href="/hacker/reports/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D4A017] px-5 py-3 text-sm font-semibold text-[#080604] transition hover:bg-[#b8880f]"
          >
            Submit Report
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Metrics */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={Target} label="Open Programs" value={String(HACKER_PROGRAMS.length)} />
        <MetricCard icon={FileText} label="Submitted Reports" value={String(SUBMITTED_REPORTS.length)} />
        <MetricCard icon={Award} label="Earned Rewards" value={formatMad.format(totalEarned)} />
        <MetricCard icon={ShieldCheck} label="Pending Rewards" value={formatMad.format(pendingRewards)} />
      </section>

      {/* Programs + Recent reports */}
      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Recommended Programs</h2>
              <p className="text-sm text-white/40">Safe demo scopes with clear reward tables.</p>
            </div>
            <Link href="/hacker/programs" className="text-sm font-semibold text-[#D4A017] hover:text-[#b8880f]">
              View all
            </Link>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {HACKER_PROGRAMS.slice(0, 2).map((program) => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/8 bg-white/3 p-5">
          <h2 className="text-lg font-bold text-white">Recent Reports</h2>
          <div className="mt-4 space-y-3">
            {SUBMITTED_REPORTS.slice(0, 4).map((report) => {
              const program = HACKER_PROGRAMS.find((item) => item.id === report.programId);
              return (
                <div key={report.id} className="rounded-xl border border-white/8 bg-white/3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">{report.title}</p>
                      <p className="mt-0.5 text-xs text-white/40">{program?.name}</p>
                    </div>
                    <LightBadge value={report.status}>{report.status}</LightBadge>
                  </div>
                  <p className="mt-2 text-xs text-white/40">{report.affectedAsset}</p>
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
    <div className="rounded-2xl border border-white/8 bg-white/3 p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4A017]/15 text-[#D4A017]">
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-4 text-sm text-white/45">{label}</p>
      <p className="mt-1 text-2xl font-bold text-white">{value}</p>
    </div>
  );
}
