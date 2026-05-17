import Link from "next/link";
import {
  ArrowRight,
  Award,
  Building2,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import { DashboardLink } from "@/components/public/dashboard-link";

const navItems = ["About", "Features", "Leaderboard", "FAQ", "Contact"];

const researcherBenefits = [
  {
    title: "Build Reputation",
    description:
      "Grow a verified security profile with points, accepted reports, and public program history.",
    icon: Trophy,
  },
  {
    title: "Earn Rewards",
    description:
      "Submit high-quality vulnerability reports and receive clear MAD reward ranges.",
    icon: Award,
  },
];

const companyBenefits = [
  {
    title: "Reduce Triage Effort",
    description:
      "Use structured submissions and AI-assisted report improvement to shorten analyst review.",
    icon: Sparkles,
  },
  {
    title: "Stay Secure",
    description:
      "Invite ethical researchers to find weaknesses before attackers can exploit them.",
    icon: ShieldCheck,
  },
];

export function LandingPage() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <header className="sticky top-0 z-40 border-b border-blue-100 bg-white/90 backdrop-blur">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 font-semibold text-blue-700">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
              <ShieldCheck className="h-5 w-5" />
            </span>
            BroadSec
          </Link>
          <div className="hidden items-center gap-6 text-sm font-medium text-slate-600 lg:flex">
            {navItems.map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-blue-700">
                {item}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden rounded-full border border-blue-100 px-3 py-1 text-sm text-slate-600 sm:inline-flex">
              English
            </span>
            <Link href="/login" className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-700 sm:inline-flex">
              Login
            </Link>
            <DashboardLink />
          </div>
        </nav>
      </header>

      <section className="relative overflow-hidden border-b border-blue-100 bg-[linear-gradient(180deg,#eff6ff_0%,#ffffff_78%)]">
        <div className="absolute inset-x-0 top-28 mx-auto h-[360px] max-w-5xl rounded-[32px] border border-blue-100 bg-white/70 shadow-2xl shadow-blue-100/70" />
        <div className="relative mx-auto flex min-h-[720px] max-w-7xl flex-col items-center px-4 pb-16 pt-20 text-center sm:px-6 lg:px-8">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-medium text-blue-700 shadow-sm">
            <Users className="h-4 w-4" />
            Moroccan demo platform for ethical security collaboration
          </div>
          <h1 className="max-w-5xl text-4xl font-bold tracking-tight text-slate-950 sm:text-6xl">
            The First Bug Bounty Platform in the Middle East
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
            Together, we help organizations eliminate security threats before attackers
            exploit them.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
            >
              Join as Researcher
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/register"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-blue-200 bg-white px-5 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
            >
              Join as Company
              <Building2 className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-16 grid w-full max-w-5xl gap-4 rounded-2xl border border-blue-100 bg-white p-4 text-left shadow-xl shadow-blue-100/60 md:grid-cols-3">
            <div className="rounded-xl bg-slate-950 p-5 text-white md:col-span-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-blue-100">Live triage queue</p>
                <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs text-blue-100">
                  Demo
                </span>
              </div>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {["Reports", "Accepted", "Rewards"].map((label, index) => (
                  <div key={label} className="rounded-lg bg-white/10 p-4">
                    <p className="text-xs text-blue-100">{label}</p>
                    <p className="mt-2 text-2xl font-semibold">
                      {["124", "67", "86K"][index]}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-6 space-y-3">
                {["IDOR in banking demo asset", "Stored XSS in marketplace profile", "Missing HSTS on telecom portal"].map(
                  (item) => (
                    <div key={item} className="flex items-center gap-3 rounded-lg bg-white/10 p-3">
                      <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                      <span className="text-sm">{item}</span>
                    </div>
                  )
                )}
              </div>
            </div>
            <div className="rounded-xl border border-blue-100 bg-blue-50 p-5">
              <p className="text-sm font-semibold text-blue-700">Researcher rank</p>
              <p className="mt-4 text-4xl font-bold text-slate-950">#12</p>
              <p className="mt-2 text-sm text-slate-600">
                Points, reputation, rewards, and report history in one dashboard.
              </p>
              <div className="mt-6 h-2 rounded-full bg-blue-100">
                <div className="h-2 w-3/4 rounded-full bg-blue-600" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">About</p>
          <h2 className="mt-3 max-w-3xl text-3xl font-bold text-slate-950">
            BroadSec connects organizations with skilled researchers through safe,
            structured vulnerability disclosure.
          </h2>
        </div>
      </section>

      <section id="features" className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:px-8">
        <BenefitGroup title="For researchers" items={researcherBenefits} />
        <BenefitGroup title="For companies" items={companyBenefits} />
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-16 sm:px-6 lg:grid-cols-3 lg:px-8">
        <InfoPanel id="leaderboard" title="Leaderboard" body="Researchers earn points for accepted reports, high-impact findings, and consistent communication." />
        <InfoPanel id="faq" title="FAQ" body="Programs use safe demo scopes, clear reward ranges, and structured status tracking for every report." />
        <InfoPanel id="contact" title="Contact" body="Teams can start with a private program, then expand into public disclosure as their process matures." />
      </section>
    </main>
  );
}

function BenefitGroup({
  title,
  items,
}: {
  title: string;
  items: typeof researcherBenefits;
}) {
  return (
    <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-950">{title}</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.title} className="rounded-xl border border-slate-100 bg-slate-50 p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-600 text-white">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold text-slate-950">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function InfoPanel({ id, title, body }: { id: string; title: string; body: string }) {
  return (
    <div id={id} className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-950">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-slate-600">{body}</p>
    </div>
  );
}
