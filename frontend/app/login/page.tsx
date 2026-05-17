"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Building2, ShieldCheck, UserRound } from "lucide-react";
import { setDemoUser, type DemoRole } from "@/lib/demo-auth";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const login = (role: DemoRole) => {
    setDemoUser(role);
    const next = searchParams.get("next");
    const fallback = role === "admin" ? "/admin" : "/hacker";
    router.push(next?.startsWith(role === "admin" ? "/admin" : "/hacker") ? next : fallback);
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-950">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="inline-flex items-center gap-2 font-semibold text-blue-700">
          <ShieldCheck className="h-5 w-5" />
          BroadSec
        </Link>

        <section className="mt-10 grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-blue-100/50 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="bg-blue-600 p-8 text-white lg:p-10">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="mt-4 leading-7 text-blue-50">
              Choose a demo role to enter the correct BroadSec area. Real account
              authentication will be added later.
            </p>
          </div>
          <div className="grid gap-4 p-6 sm:p-8">
            <RoleCard
              icon={UserRound}
              title="Researcher Login"
              description="Enter the researcher portal to browse programs and submit reports."
              action="Continue as Researcher"
              onClick={() => login("researcher")}
            />
            <RoleCard
              icon={Building2}
              title="Admin Login"
              description="Enter the company console for triage, scanner, programs, and reports."
              action="Continue as Admin"
              onClick={() => login("admin")}
            />
            <p className="text-center text-sm text-slate-500">
              New to BroadSec?{" "}
              <Link href="/register" className="font-semibold text-blue-700 hover:text-blue-800">
                Create a demo account
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

function RoleCard({
  icon: Icon,
  title,
  description,
  action,
  onClick,
}: {
  icon: typeof UserRound;
  title: string;
  description: string;
  action: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-2xl border border-slate-200 bg-white p-5 text-left transition hover:border-blue-200 hover:bg-blue-50"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-bold text-slate-950">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
          <p className="mt-3 text-sm font-semibold text-blue-700">{action}</p>
        </div>
      </div>
    </button>
  );
}
