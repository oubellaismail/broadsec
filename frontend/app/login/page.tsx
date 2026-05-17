"use client";

import Link from "next/link";
import { Suspense, useState, type FormEvent, type ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Building2,
  CheckCircle2,
  LockKeyhole,
  Mail,
  Shield,
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
  const [errors, setErrors] = useState<LoginErrors>({});

  const submitLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: LoginErrors = {};
    const trimmedEmail = email.trim();

    if (!trimmedEmail) nextErrors.email = "Enter your email address.";
    if (!password) {
      nextErrors.password = "Enter your password.";
    } else if (password !== "demo123") {
      nextErrors.password = 'Incorrect password — use "demo123".';
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
    <main className="flex min-h-screen items-center justify-center bg-[#080604] px-4 py-12">
      {/* Subtle background pattern */}
      <div className="dot-grid pointer-events-none fixed inset-0 opacity-40" />

      <div className="relative w-full max-w-md">
        {/* Brand */}
        <Link
          href="/"
          className="mb-8 flex items-center justify-center gap-2 text-[#D4A017]"
        >
          <Shield className="h-6 w-6" />
          <span className="text-lg font-bold tracking-wide">BroadSec</span>
        </Link>

        {/* Card */}
        <div className="rounded-2xl border border-white/8 bg-white/3 p-8 shadow-2xl backdrop-blur-sm">
          <h1 className="text-2xl font-bold text-white">Sign in</h1>
          <p className="mt-1.5 text-sm text-white/50">
            Choose your role, then sign in with the demo credentials.
          </p>

          <form className="mt-6 space-y-5" onSubmit={submitLogin} noValidate>
            {/* Error banner */}
            {errors.form && (
              <div className="rounded-lg border border-[#C0533A]/30 bg-[#C0533A]/10 px-4 py-3 text-sm text-[#C0533A]">
                {errors.form}
              </div>
            )}

            {/* Role picker */}
            <div className="grid grid-cols-2 gap-3">
              <RoleOption
                active={role === "researcher"}
                icon={<UserRound className="h-4 w-4" />}
                label="Researcher"
                description="Researcher portal"
                onClick={() => quickFill("researcher")}
              />
              <RoleOption
                active={role === "admin"}
                icon={<Building2 className="h-4 w-4" />}
                label="Admin"
                description="Admin console"
                onClick={() => quickFill("admin")}
              />
            </div>

            {/* Email */}
            <Field label="Email" error={errors.email}>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-white/30" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    role === "admin"
                      ? "admin@broadsec.demo"
                      : "researcher@broadsec.demo"
                  }
                  className="h-11 w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 text-sm text-white placeholder:text-white/25 outline-none focus:border-[#D4A017]/50 focus:bg-white/8 transition-colors"
                  aria-invalid={Boolean(errors.email)}
                />
              </div>
            </Field>

            {/* Password */}
            <Field label="Password" error={errors.password}>
              <div className="relative">
                <LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-white/30" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-11 w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 text-sm text-white placeholder:text-white/25 outline-none focus:border-[#D4A017]/50 focus:bg-white/8 transition-colors"
                  aria-invalid={Boolean(errors.password)}
                />
              </div>
            </Field>

            {/* Submit */}
            <button
              type="submit"
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#D4A017] text-sm font-semibold text-[#080604] transition hover:bg-[#b8880f] active:scale-[0.98]"
            >
              Sign in
              <CheckCircle2 className="h-4 w-4" />
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-white/40">
            New to BroadSec?{" "}
            <Link
              href="/register"
              className="font-semibold text-[#D4A017] hover:text-[#b8880f]"
            >
              Create a demo account
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

function LoginFallback() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080604] px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/8 bg-white/3 p-8">
        <p className="text-sm text-white/40">Loading…</p>
      </div>
    </main>
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
      className={`rounded-xl border p-3.5 text-left transition ${
        active
          ? "border-[#D4A017]/40 bg-[#D4A017]/10 text-white"
          : "border-white/8 bg-white/3 text-white/50 hover:border-white/15 hover:text-white/80"
      }`}
    >
      <div className="flex items-center gap-2.5">
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${
            active ? "bg-[#D4A017]/20 text-[#D4A017]" : "bg-white/5 text-white/30"
          }`}
        >
          {icon}
        </span>
        <span>
          <span className="block text-sm font-semibold">{label}</span>
          <span className="block text-xs text-white/35">{description}</span>
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
      <span className="mb-1.5 block text-sm font-medium text-white/60">{label}</span>
      {children}
      {error && (
        <span className="mt-1.5 block text-xs text-[#C0533A]">{error}</span>
      )}
    </label>
  );
}
