"use client";

import Link from "next/link";
import { useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Building2, CheckCircle2, Globe2, ShieldCheck, UserRoundPlus } from "lucide-react";
import { setDemoUser, type DemoRole } from "@/lib/demo-auth";

type RegisterErrors = Partial<
  Record<
    | "fullName"
    | "email"
    | "password"
    | "confirmPassword"
    | "country"
    | "companyName"
    | "companyWebsite"
    | "terms",
    string
  >
>;

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<DemoRole>("researcher");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [country, setCountry] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errors, setErrors] = useState<RegisterErrors>({});

  const submitRegistration = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: RegisterErrors = {};

    if (!fullName.trim()) nextErrors.fullName = "Enter your full name.";
    if (!email.trim()) nextErrors.email = "Enter your email address.";
    if (!password) nextErrors.password = "Create a demo password.";
    if (!confirmPassword) nextErrors.confirmPassword = "Confirm your password.";
    if (password && confirmPassword && password !== confirmPassword) {
      nextErrors.confirmPassword = "Passwords must match.";
    }
    if (!country.trim()) nextErrors.country = "Enter your country.";
    if (role === "admin" && !companyName.trim()) {
      nextErrors.companyName = "Enter your company name.";
    }
    if (role === "admin" && !companyWebsite.trim()) {
      nextErrors.companyWebsite = "Enter your company website.";
    }
    if (!acceptedTerms) {
      nextErrors.terms = "You must agree to use the demo responsibly.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setDemoUser(role, {
      name: role === "admin" ? companyName.trim() || fullName.trim() : fullName.trim(),
      email: email.trim(),
    });
    router.push(role === "admin" ? "/admin" : "/hacker");
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-950">
      <div className="mx-auto max-w-5xl">
        <BrandLink />

        <section className="mt-10 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-blue-100/50">
          <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
            <div className="bg-blue-600 p-8 text-white lg:p-10">
              <h1 className="text-3xl font-bold">Create Demo Account</h1>
              <p className="mt-4 leading-7 text-blue-50">
                Register a local demo session for the hackathon presentation. No
                real authentication provider is connected yet.
              </p>
              <div className="mt-8 rounded-2xl bg-white/10 p-5">
                <Globe2 className="h-6 w-6 text-blue-100" />
                <p className="mt-4 text-sm leading-6 text-blue-50">
                  Researcher accounts open the vulnerability submission portal.
                  Company accounts open the admin console for program and report
                  management.
                </p>
              </div>
            </div>

            <form className="space-y-5 p-6 sm:p-8" onSubmit={submitRegistration} noValidate>
              <div>
                <h2 className="text-2xl font-bold text-slate-950">Registration details</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Fields marked by the form are required for this demo account.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <AccountTypeOption
                  active={role === "researcher"}
                  icon={<UserRoundPlus className="h-5 w-5" />}
                  label="Security Researcher"
                  description="Submit and track reports"
                  onClick={() => setRole("researcher")}
                />
                <AccountTypeOption
                  active={role === "admin"}
                  icon={<Building2 className="h-5 w-5" />}
                  label="Company / Admin"
                  description="Manage programs"
                  onClick={() => setRole("admin")}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Full name" error={errors.fullName}>
                  <input
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none focus:border-blue-500"
                    placeholder="A. Chaoui"
                    aria-invalid={Boolean(errors.fullName)}
                  />
                </Field>
                <Field label="Email" error={errors.email}>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none focus:border-blue-500"
                    placeholder={role === "admin" ? "admin@broadsec.demo" : "researcher@broadsec.demo"}
                    aria-invalid={Boolean(errors.email)}
                  />
                </Field>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Password" error={errors.password}>
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none focus:border-blue-500"
                    placeholder="Create a password"
                    aria-invalid={Boolean(errors.password)}
                  />
                </Field>
                <Field label="Confirm password" error={errors.confirmPassword}>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none focus:border-blue-500"
                    placeholder="Repeat your password"
                    aria-invalid={Boolean(errors.confirmPassword)}
                  />
                </Field>
              </div>

              <Field label="Country" error={errors.country}>
                <input
                  value={country}
                  onChange={(event) => setCountry(event.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none focus:border-blue-500"
                  placeholder="Morocco"
                  aria-invalid={Boolean(errors.country)}
                />
              </Field>

              {role === "admin" ? (
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Company name" error={errors.companyName}>
                    <input
                      value={companyName}
                      onChange={(event) => setCompanyName(event.target.value)}
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none focus:border-blue-500"
                      placeholder="BroadSec Demo Group"
                      aria-invalid={Boolean(errors.companyName)}
                    />
                  </Field>
                  <Field label="Company website" error={errors.companyWebsite}>
                    <input
                      value={companyWebsite}
                      onChange={(event) => setCompanyWebsite(event.target.value)}
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none focus:border-blue-500"
                      placeholder="https://company.example"
                      aria-invalid={Boolean(errors.companyWebsite)}
                    />
                  </Field>
                </div>
              ) : null}

              <div>
                <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(event) => setAcceptedTerms(event.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>I agree to use this demo platform responsibly.</span>
                </label>
                {errors.terms ? <p className="mt-2 text-sm text-red-600">{errors.terms}</p> : null}
              </div>

              <button
                type="submit"
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                {role === "admin" ? "Create Company Account" : "Create Researcher Account"}
                <CheckCircle2 className="h-4 w-4" />
              </button>

              <p className="text-center text-sm text-slate-500">
                Already have an account?{" "}
                <Link href="/login" className="font-semibold text-blue-700 hover:text-blue-800">
                  Login
                </Link>
              </p>
            </form>
          </div>
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

function AccountTypeOption({
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
