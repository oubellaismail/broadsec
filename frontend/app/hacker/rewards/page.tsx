import { Award, Clock3, CreditCard, Star } from "lucide-react";
import { LightBadge, formatMad } from "@/components/hacker/hacker-ui";
import { DEMO_HACKER_USER, HACKER_PROGRAMS, HACKER_REWARDS, SUBMITTED_REPORTS } from "@/lib/mock-data";

export default function HackerRewardsPage() {
  const totalEarned = HACKER_REWARDS.reduce((total, reward) => total + reward.amountMad, 0);
  const pendingRewards = HACKER_REWARDS.reduce(
    (total, reward) => total + (reward.status === "Pending" ? reward.amountMad : 0),
    0
  );
  const paidRewards = HACKER_REWARDS.reduce(
    (total, reward) => total + (reward.status === "Paid" ? reward.amountMad : 0),
    0
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-950">Rewards</h1>
        <p className="mt-2 text-slate-600">
          Monitor paid rewards, pending payouts, and points from accepted reports.
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={Award} label="Total earned rewards" value={formatMad.format(totalEarned)} />
        <MetricCard icon={Clock3} label="Pending rewards" value={formatMad.format(pendingRewards)} />
        <MetricCard icon={CreditCard} label="Paid rewards" value={formatMad.format(paidRewards)} />
        <MetricCard icon={Star} label="Points" value={String(DEMO_HACKER_USER.points)} />
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5">
          <h2 className="text-xl font-bold text-slate-950">Reward History</h2>
          <p className="mt-1 text-sm text-slate-500">
            Rewards are tied to accepted reports and program severity ranges.
          </p>
        </div>
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-5 py-4 font-semibold">Report</th>
              <th className="px-5 py-4 font-semibold">Program</th>
              <th className="px-5 py-4 font-semibold">Amount</th>
              <th className="px-5 py-4 font-semibold">Status</th>
              <th className="px-5 py-4 font-semibold">Points</th>
              <th className="px-5 py-4 font-semibold">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {HACKER_REWARDS.map((reward) => {
              const report = SUBMITTED_REPORTS.find((item) => item.id === reward.reportId);
              const program = HACKER_PROGRAMS.find((item) => item.id === report?.programId);

              return (
                <tr key={reward.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-950">{report?.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{reward.reportId}</p>
                  </td>
                  <td className="px-5 py-4 text-slate-600">{program?.name}</td>
                  <td className="px-5 py-4 font-semibold text-slate-950">
                    {formatMad.format(reward.amountMad)}
                  </td>
                  <td className="px-5 py-4">
                    <LightBadge value={reward.status}>{reward.status}</LightBadge>
                  </td>
                  <td className="px-5 py-4 text-slate-600">{reward.points}</td>
                  <td className="px-5 py-4 text-slate-600">{formatDate(reward.createdAt)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
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
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-4 text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-950">{value}</p>
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
