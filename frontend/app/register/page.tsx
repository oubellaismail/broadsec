"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, ShieldCheck, UserRoundPlus } from "lucide-react";
import { setDemoUser, type DemoRole } from "@/lib/demo-auth";

export default function RegisterPage() {
  const router = useRouter();

  const register = (role: DemoRole) => {
    setDemoUser(role);
    router.push(role === "admin" ? "/admin" : "/hacker");
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-950">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="inline-flex items-center gap-2 font-semibold text-blue-700">
          <ShieldCheck className="h-5 w-5" />
          BroadSec
        </Link>

        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-blue-100/50 sm:p-8">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold">Create Demo Account</h1>
            <p className="mt-3 leading-7 text-slate-600">
              Select the account type for this demo session. This uses localStorage only.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <AccountCard
              icon={UserRoundPlus}
              title="Security Researcher"
              description="Browse programs, submit vulnerability reports, track status, and view rewards."
              action="Create Researcher Account"
              onClick={() => register("researcher")}
            />
            <AccountCard
              icon={Building2}
              title="Company Account"
              description="Open the admin console for scanner, AI triage, reports, and program management."
              action="Create Company Account"
              onClick={() => register("admin")}
            />
          </div>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have a demo session?{" "}
            <Link href="/login" className="font-semibold text-blue-700 hover:text-blue-800">
              Login
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}

function AccountCard({
  icon: Icon,
  title,
  description,
  action,
  onClick,
}: {
  icon: typeof UserRoundPlus;
  title: string;
  description: string;
  action: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-left transition hover:border-blue-200 hover:bg-blue-50"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white">
        <Icon className="h-6 w-6" />
      </div>
      <h2 className="mt-5 text-xl font-bold text-slate-950">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
      <p className="mt-5 text-sm font-semibold text-blue-700">{action}</p>
    </button>
  );
}
