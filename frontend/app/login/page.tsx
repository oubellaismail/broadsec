"use client";

import Link from "next/link";
import { Suspense, useState, type FormEvent, type ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Building2,
  CheckCircle2,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { demoUsers, setDemoUser, type DemoRole } from "@/lib/demo-auth";

type LoginErrors = Partial<Record<"email" | "password" | "form", string>>;

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [role, setRole] = useState<DemoRole>("researcher");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState<LoginErrors>({});

  const submitLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: LoginErrors = {};
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      nextErrors.email = "Enter your email address.";
    }

    if (!password) {
      nextErrors.password = "Enter your password.";
    } else if (password !== "demo123") {
      nextErrors.password = "This demo accepts the password demo123.";
      nextErrors.form = "Use demo123 or choose one of the quick-fill demo buttons.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const fallback = role === "admin" ? "/admin" : "/hacker";
    const allowedPrefix = role === "admin" ? "/admin" : "/hacker";
    const next = searchParams.get("next");

    setDemoUser(role, {
      name: demoUsers[role].name,
      email: trimmedEmail || demoUsers[role].email,
    });
    router.push(next?.startsWith(allowedPrefix) ? next : fallback);
  };

  const quickFill = (nextRole: DemoRole) => {
    setRole(nextRole);
    setEmail(demoUsers[nextRole].email);
    setPassword("demo123");
    setErrors({});
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-950">
      <div className="mx-auto max-w-5xl">
        <BrandLink />

        <section className="mt-10 grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-blue-100/50 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="bg-blue-600 p-8 text-white lg:p-10">
            <h1 className="text-3xl font-bold">Sign in to BroadSec</h1>
            <p className="mt-4 leading-7 text-blue-50">
              Use the demo credentials or enter your own email with the demo password
              to access the correct BroadSec workspace.
            </p>
            <div id="demo-credentials" className="mt-8 space-y-4 rounded-2xl bg-white/10 p-5">
              <p className="text-sm font-semibold text-blue-50">Demo credentials</p>
              <CredentialLine label="Researcher" email="researcher@broadsec.demo" />
              <CredentialLine label="Admin" email="admin@broadsec.demo" />
            </div>
          </div>

          <form className="space-y-5 p-6 sm:p-8" onSubmit={submitLogin} noValidate>
            <div>
              <h2 className="text-2xl font-bold text-slate-950">Login</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Demo authentication is stored only in your browser for this session.
              </p>
            </div>

            {errors.form ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
                {errors.form}
              </div>
            ) : null}

            <div className="grid gap-3 sm:grid-cols-2">
              <RoleOption
                active={role === "researcher"}
                icon={<UserRound className="h-5 w-5" />}
                label="Researcher"
                description="Researcher portal"
                onClick={() => setRole("researcher")}
              />
              <RoleOption
                active={role === "admin"}
                icon={<Building2 className="h-5 w-5" />}
                label="Admin / Company"
                description="Company console"
                onClick={() => setRole("admin")}
              />
            </div>

            <Field label="Email" error={errors.email}>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-950 outline-none focus:border-blue-500"
                  placeholder={role === "admin" ? "admin@broadsec.demo" : "researcher@broadsec.demo"}
                  aria-invalid={Boolean(errors.email)}
                />
              </div>
            </Field>

            <Field label="Password" error={errors.password}>
              <div className="relative">
                <LockKeyhole className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-950 outline-none focus:border-blue-500"
                  placeholder="demo123"
                  aria-invalid={Boolean(errors.password)}
                />
              </div>
            </Field>

            <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
              <label className="inline-flex items-center gap-2 text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                Remember me
              </label>
              <a href="#demo-credentials" className="font-semibold text-blue-700 hover:text-blue-800">
                Forgot password?
              </a>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => quickFill("researcher")}
                className="rounded-xl border border-blue-200 px-4 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50"
              >
                Use Researcher Demo
              </button>
              <button
                type="button"
                onClick={() => quickFill("admin")}
                className="rounded-xl border border-blue-200 px-4 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50"
              >
                Use Admin Demo
              </button>
            </div>

            <button
              type="submit"
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Sign in
              <CheckCircle2 className="h-4 w-4" />
            </button>

            <p className="text-center text-sm text-slate-500">
              New to BroadSec?{" "}
              <Link href="/register" className="font-semibold text-blue-700 hover:text-blue-800">
                Create a demo account
              </Link>
            </p>
          </form>
        </section>
      </div>
    </main>
  );
}

function LoginFallback() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-950">
      <div className="mx-auto max-w-5xl">
        <BrandLink />
        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-blue-100/50">
          <p className="text-sm font-semibold text-slate-600">Loading login form...</p>
        </section>
      </div>
    </main>
  );
}

function BrandLink() {
  return (
    <Link href="/" className="inline-flex items-center gap-2 font-semibold text-blue-700">
      <ShieldCheck className="h-5 w-5" />
      BroadSec
    </Link>
  );
}

function CredentialLine({ label, email }: { label: string; email: string }) {
  return (
    <div className="rounded-xl bg-white/10 p-3 text-sm text-blue-50">
      <p className="font-semibold">{label}</p>
      <p className="mt-1 break-words">{email} / demo123</p>
    </div>
  );
}

function RoleOption({
  active,
  icon,
  label,
  description,
  onClick,
}: {
  active: boolean;
  icon: ReactNode;
  label: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border p-4 text-left transition ${
        active
          ? "border-blue-300 bg-blue-50 text-blue-950"
          : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50"
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
          {icon}
        </span>
        <span>
          <span className="block font-bold">{label}</span>
          <span className="block text-xs text-slate-500">{description}</span>
        </span>
      </div>
    </button>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>
      {children}
      {error ? <span className="mt-2 block text-sm text-red-600">{error}</span> : null}
    </label>
  );
}
