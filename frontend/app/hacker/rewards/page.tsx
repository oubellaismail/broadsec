import { Award, Clock3, CreditCard, Star } from "lucide-react";
import { LightBadge, formatMad } from "@/components/hacker/hacker-ui";
import { DEMO_HACKER_USER, HACKER_PROGRAMS, HACKER_REWARDS, SUBMITTED_REPORTS } from "@/lib/mock-data";

export default function HackerRewardsPage() {
  const totalEarned = HACKER_REWARDS.reduce((total, r) => total + r.amountMad, 0);
  const pendingRewards = HACKER_REWARDS.reduce(
    (total, r) => total + (r.status === "Pending" ? r.amountMad : 0),
    0
  );
  const paidRewards = HACKER_REWARDS.reduce(
    (total, r) => total + (r.status === "Paid" ? r.amountMad : 0),
    0
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Rewards</h1>
        <p className="mt-1.5 text-sm text-white/45">
          Monitor paid rewards, pending payouts, and points from accepted reports.
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={Award}      label="Total earned"   value={formatMad.format(totalEarned)} />
        <MetricCard icon={Clock3}     label="Pending"        value={formatMad.format(pendingRewards)} />
        <MetricCard icon={CreditCard} label="Paid out"       value={formatMad.format(paidRewards)} />
        <MetricCard icon={Star}       label="Points"         value={String(DEMO_HACKER_USER.points)} />
      </section>

      <section className="overflow-hidden rounded-2xl border border-white/8 bg-white/3">
        <div className="border-b border-white/8 p-5">
          <h2 className="text-lg font-bold text-white">Reward History</h2>
          <p className="mt-1 text-sm text-white/40">
            Rewards are tied to accepted reports and program severity ranges.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-white/8 text-white/40">
              <tr>
                <th className="px-5 py-3 font-semibold">Report</th>
                <th className="px-5 py-3 font-semibold">Program</th>
                <th className="px-5 py-3 font-semibold">Amount</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Points</th>
                <th className="px-5 py-3 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {HACKER_REWARDS.map((reward) => {
                const report = SUBMITTED_REPORTS.find((r) => r.id === reward.reportId);
                const program = HACKER_PROGRAMS.find((p) => p.id === report?.programId);
                return (
                  <tr key={reward.id} className="transition hover:bg-white/3">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-white">{report?.title}</p>
                      <p className="mt-0.5 text-xs text-white/35">{reward.reportId}</p>
                    </td>
                    <td className="px-5 py-4 text-white/55">{program?.name}</td>
                    <td className="px-5 py-4 font-semibold text-[#D4A017]">
                      {formatMad.format(reward.amountMad)}
                    </td>
                    <td className="px-5 py-4">
                      <LightBadge value={reward.status}>{reward.status}</LightBadge>
                    </td>
                    <td className="px-5 py-4 text-white/55">{reward.points}</td>
                    <td className="px-5 py-4 text-white/55">{formatDate(reward.createdAt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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
  icon: typeof Award;
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

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
