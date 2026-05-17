"use client";

import { useState, useRef } from "react";
import { Search, Loader2, ShieldCheck, ShieldAlert, AlertTriangle, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Severity = "critical" | "high" | "medium" | "low";

interface Vuln {
  id: string;
  name: string;
  severity: Severity;
  description: string;
  affected: string;
  cvss_score: number;
}

interface ScanResult {
  url: string;
  overall_score: "A" | "B" | "C" | "D" | "F";
  total: number;
  summary: string;
  vulnerabilities: Vuln[];
}

const GRADE_CONFIG = {
  A: { color: "#1A7A6E", label: "Secure",       glow: "0 0 40px rgba(57,255,20,0.4)"  },
  B: { color: "#2E5FE8", label: "Good",          glow: "0 0 40px rgba(0,240,255,0.4)" },
  C: { color: "#fbbf24", label: "Fair",          glow: "0 0 40px rgba(251,191,36,0.4)"},
  D: { color: "#f97316", label: "Poor",          glow: "0 0 40px rgba(249,115,22,0.4)"},
  F: { color: "#C0533A", label: "Critical Risk", glow: "0 0 40px rgba(255,45,85,0.5)" },
};

const SEV_COLOR: Record<Severity, string> = {
  critical: "#C0533A",
  high:     "#f97316",
  medium:   "#fbbf24",
  low:      "#94a3b8",
};

const SEV_CLASS: Record<Severity, string> = {
  critical: "severity-critical",
  high:     "severity-high",
  medium:   "severity-medium",
  low:      "severity-low",
};

const fadeUp = (delay = 0) => ({
  initial:   { opacity: 0, y: 24 },
  animate:   { opacity: 1, y: 0  },
  transition:{ duration: 0.6, ease: "easeOut" as const, delay },
});

export default function Hero() {
  const [url, setUrl]           = useState("");
  const [scanning, setScanning] = useState(false);
  const [result, setResult]     = useState<ScanResult | null>(null);
  const [error, setError]       = useState("");
  const [wave, setWave]         = useState(false);
  const inputRef                = useRef<HTMLInputElement>(null);

  async function handleScan(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim() || scanning) return;

    setScanning(true);
    setResult(null);
    setError("");
    setWave(true);
    setTimeout(() => setWave(false), 500);

    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail ?? data.error ?? "Scan failed");
      setResult(data);
      setTimeout(() => {
        document.getElementById("scan-result")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Scan failed");
    } finally {
      setScanning(false);
    }
  }

  const grade = result ? GRADE_CONFIG[result.overall_score] : null;

  return (
    <>
      {wave && <div className="scan-wave" />}

      <section className="relative min-h-screen flex flex-col items-center justify-center pt-16 px-6 dot-grid overflow-hidden">
        {/* Radial colour glow behind medallion */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(27,58,140,0.12) 0%, rgba(212,160,23,0.06) 40%, transparent 70%)" }}
        />

        {/* Animated zellige medallion — multi-colour rings, slow rotation */}
        <div
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 pointer-events-none select-none zellige-rotate"
          style={{ width: 640, height: 640, marginLeft: -320, marginTop: -320, opacity: 0.18 }}
        >
          <svg viewBox="0 0 640 640" xmlns="http://www.w3.org/2000/svg" width="640" height="640">
            {/* Outer ring — cobalt blue 16-petal */}
            {Array.from({length: 16}).map((_, i) => {
              const a = (i * 360 / 16) * Math.PI / 180;
              const cx = 320 + Math.cos(a) * 280;
              const cy = 320 + Math.sin(a) * 280;
              return <path key={`ob${i}`} transform={`translate(${cx},${cy})`}
                d="M0,-18 L3.4,-7 L14,-11 L7.8,-2 L18,0 L7.8,2 L14,11 L3.4,7 L0,18 L-3.4,7 L-14,11 L-7.8,2 L-18,0 L-7.8,-2 L-14,-11 L-3.4,-7 Z"
                fill="#1B3A8C" />;
            })}
            {/* Ring 1 — terracotta 12-petal */}
            {Array.from({length: 12}).map((_, i) => {
              const a = (i * 360 / 12 + 15) * Math.PI / 180;
              const cx = 320 + Math.cos(a) * 220;
              const cy = 320 + Math.sin(a) * 220;
              return <path key={`r1${i}`} transform={`translate(${cx},${cy})`}
                d="M0,-22 L4.1,-8.5 L17,-13.5 L9.5,-2.5 L22,0 L9.5,2.5 L17,13.5 L4.1,8.5 L0,22 L-4.1,8.5 L-17,13.5 L-9.5,2.5 L-22,0 L-9.5,-2.5 L-17,-13.5 L-4.1,-8.5 Z"
                fill="#C0533A" />;
            })}
            {/* Ring 2 — gold 8-petal */}
            {Array.from({length: 8}).map((_, i) => {
              const a = (i * 360 / 8) * Math.PI / 180;
              const cx = 320 + Math.cos(a) * 160;
              const cy = 320 + Math.sin(a) * 160;
              return <path key={`r2${i}`} transform={`translate(${cx},${cy})`}
                d="M0,-28 L5.2,-10.8 L21.4,-17 L12,-3.2 L28,0 L12,3.2 L21.4,17 L5.2,10.8 L0,28 L-5.2,10.8 L-21.4,17 L-12,3.2 L-28,0 L-12,-3.2 L-21.4,-17 L-5.2,-10.8 Z"
                fill="#D4A017" />;
            })}
            {/* Ring 3 — emerald green 12-point */}
            {Array.from({length: 12}).map((_, i) => {
              const a = (i * 360 / 12) * Math.PI / 180;
              const cx = 320 + Math.cos(a) * 105;
              const cy = 320 + Math.sin(a) * 105;
              return <path key={`r3${i}`} transform={`translate(${cx},${cy})`}
                d="M0,-14 L2.6,-5.4 L10.7,-8.5 L6,-1.6 L14,0 L6,1.6 L10.7,8.5 L2.6,5.4 L0,14 L-2.6,5.4 L-10.7,8.5 L-6,1.6 L-14,0 L-6,-1.6 L-10.7,-8.5 L-2.6,-5.4 Z"
                fill="#1F6B35" />;
            })}
            {/* Centre — royal blue 8-star */}
            <path transform="translate(320,320)"
              d="M0,-40 L7.4,-15.6 L31.4,-22.4 L16.2,-4.2 L40,0 L16.2,4.2 L31.4,22.4 L7.4,15.6 L0,40 L-7.4,15.6 L-31.4,22.4 L-16.2,4.2 L-40,0 L-16.2,-4.2 L-31.4,-22.4 L-7.4,-15.6 Z"
              fill="#2E5FE8" />
            {/* Structural rings */}
            <circle cx="320" cy="320" r="280" fill="none" stroke="#1B3A8C" strokeWidth="1.5" opacity="0.6" />
            <circle cx="320" cy="320" r="220" fill="none" stroke="#C0533A" strokeWidth="1" opacity="0.5" />
            <circle cx="320" cy="320" r="160" fill="none" stroke="#D4A017" strokeWidth="1" opacity="0.6" />
            <circle cx="320" cy="320" r="105" fill="none" stroke="#1F6B35" strokeWidth="1" opacity="0.5" />
            <circle cx="320" cy="320" r="55"  fill="none" stroke="#2E5FE8" strokeWidth="1" opacity="0.6" />
          </svg>
        </div>

        {/* Badge — gold */}
        <motion.div
          {...fadeUp(0)}
          className="mb-6 flex items-center gap-2 glass px-4 py-1.5 rounded-full text-xs font-mono"
          style={{ border: "1px solid rgba(201,168,76,0.3)", color: "var(--zellige-gold)" }}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "var(--zellige-gold)" }} />
          Powered by Gemini AI · Built in Morocco
        </motion.div>

        {/* Headline */}
        <motion.h1
          {...fadeUp(0.1)}
          className="text-center font-mono font-bold leading-tight mb-4 max-w-4xl"
        >
          <span
            className="block text-xl md:text-2xl font-normal tracking-widest uppercase mb-2"
            style={{ color: "var(--zellige-gold)", opacity: 0.7 }}
          >
            Morocco&apos;s First
          </span>
          <span
            className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl whitespace-nowrap"
            style={{ color: "#2E5FE8", textShadow: "0 0 60px rgba(0,240,255,0.4)" }}
          >
            AI-Native Bug Bounty
          </span>
          <span
            className="block text-xl md:text-2xl font-normal tracking-widest uppercase mt-2"
            style={{ color: "var(--zellige-gold)", opacity: 0.7 }}
          >
            Platform
          </span>
        </motion.h1>

        <motion.p {...fadeUp(0.2)} className="text-center text-slate-400 max-w-xl mb-10 text-base md:text-lg leading-relaxed">
          Connect Moroccan companies with elite security researchers.
          AI triage in seconds. Structured reports. Real rewards.
        </motion.p>

        {/* Scanner input */}
        <motion.form
          {...fadeUp(0.3)}
          onSubmit={handleScan}
          className="w-full max-w-xl glass rounded-xl border border-white/10 p-1.5 flex gap-2 focus-within:border-[#2E5FE8]/40 transition-colors duration-300"
        >
          <div className="flex items-center gap-2 flex-1 px-3">
            <Search size={16} className="text-slate-500 shrink-0" />
            <input
              ref={inputRef}
              id="scan-url"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter any URL, e.g. example.com"
              aria-label="Target URL to scan"
              className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-500 outline-none font-mono"
              disabled={scanning}
            />
          </div>
          <motion.button
            type="submit"
            disabled={scanning || !url.trim()}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="btn-cyan font-mono text-sm px-5 py-2.5 rounded-lg flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            {scanning ? (
              <><Loader2 size={14} className="animate-spin" />Scanning...</>
            ) : (
              <><Shield size={14} />Scan</>
            )}
          </motion.button>
        </motion.form>

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-3 text-sm text-[#C0533A] font-mono flex items-center gap-1.5"
            >
              <AlertTriangle size={14} />
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <motion.p {...fadeUp(0.4)} className="mt-3 text-xs text-slate-500 font-mono">
          Checks security headers · SSL certificate · No login required
        </motion.p>

        {!result && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
            className="absolute bottom-8 flex flex-col items-center gap-1 text-slate-400 text-xs font-mono animate-float-gentle"
          >
            <span>scroll</span><span>↓</span>
          </motion.div>
        )}
      </section>

      {/* Scan result */}
      <AnimatePresence>
        {result && (
          <motion.section
            id="scan-result"
            aria-live="polite"
            aria-atomic="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-6 pb-20 max-w-4xl mx-auto w-full"
          >
            {/* Grade card */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" as const }}
              className="glass rounded-2xl border border-white/10 p-6 mb-6 flex flex-col sm:flex-row items-center gap-6"
            >
              {/* Grade circle */}
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.15 }}
                className="shrink-0 w-24 h-24 rounded-full flex flex-col items-center justify-center border-2 font-mono"
                style={{ borderColor: grade!.color, boxShadow: grade!.glow, color: grade!.color }}
              >
                <span className="text-4xl font-bold leading-none">{result.overall_score}</span>
                <span className="text-[10px] mt-0.5 opacity-80">{grade!.label}</span>
              </motion.div>

              <div className="flex-1 text-center sm:text-left">
                <div className="font-mono text-sm text-slate-400 mb-1 truncate">{result.url}</div>
                <div className="text-white text-lg font-semibold mb-1">{result.summary}</div>
                <div className="flex flex-wrap gap-3 justify-center sm:justify-start text-xs font-mono mt-2">
                  {(["critical","high","medium","low"] as Severity[]).map((s) => {
                    const count = result.vulnerabilities.filter((v) => v.severity === s).length;
                    if (!count) return null;
                    return <span key={s} style={{ color: SEV_COLOR[s] }}>{count} {s}</span>;
                  })}
                  {result.total === 0 && (
                    <span className="text-[#1A7A6E] flex items-center gap-1">
                      <ShieldCheck size={12} /> No issues found
                    </span>
                  )}
                </div>
              </div>

              <div className="shrink-0 flex flex-col gap-2">
                <motion.a
                  href="/programs"
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  className="btn-cyan text-xs font-mono px-4 py-2 rounded-lg text-center"
                >
                  Full Audit →
                </motion.a>
                <button
                  onClick={() => { setResult(null); setUrl(""); inputRef.current?.focus(); }}
                  className="text-xs text-slate-500 hover:text-slate-300 transition-colors font-mono"
                >
                  Scan another
                </button>
              </div>
            </motion.div>

            {/* Vuln list */}
            {result.vulnerabilities.length > 0 && (
              <motion.div
                className="space-y-3"
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
              >
                {result.vulnerabilities.map((v) => (
                  <motion.div
                    key={v.id}
                    variants={{
                      hidden:   { opacity: 0, x: -16 },
                      visible:  { opacity: 1, x: 0    },
                    }}
                    transition={{ duration: 0.4, ease: "easeOut" as const }}
                    className={`glass rounded-xl border border-white/10 p-4 ${SEV_CLASS[v.severity]}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <ShieldAlert size={14} style={{ color: SEV_COLOR[v.severity] }} />
                          <span className="text-sm font-semibold text-white">{v.name}</span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">{v.description}</p>
                      </div>
                      <div className="shrink-0 text-right">
                        <div
                          className="text-xs font-mono font-bold px-2 py-0.5 rounded"
                          style={{ color: SEV_COLOR[v.severity], background: `${SEV_COLOR[v.severity]}18` }}
                        >
                          {v.severity.toUpperCase()}
                        </div>
                        <div className="text-xs text-slate-500 mt-1 font-mono">CVSS {v.cvss_score}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}
