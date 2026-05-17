"use client";

import { ScanSearch, Brain, Globe } from "lucide-react";
import { motion } from "framer-motion";

const SCANNER = {
  icon: ScanSearch,
  title: "Live Security Scanner",
  description:
    "Instantly audit any public URL. We check security headers, SSL certificates, and server configuration, scored A to F.",
  tag: "Free · No signup",
  accent: "#2E5FE8",
  items: ["HSTS · CSP · X-Frame-Options", "SSL expiry detection", "Server version disclosure", "Grade A–F in < 1s"],
};

const SECONDARY = [
  {
    icon: Brain,
    title: "Gemini AI Triage",
    description:
      "Stop spending hours reading low-quality reports. Our AI validates, scores, and drafts responses automatically, with strict PoC requirements.",
    tag: "Powered by Gemini 2.5",
    accent: "#1B3A8C",
    items: ["CVSS 3.1 scoring", "PoC validation gate", "Duplicate detection", "Auto response draft"],
  },
  {
    icon: Globe,
    title: "Multilingual Engine",
    description:
      "The first bug bounty platform built for Morocco. Security content in French, Modern Arabic, Moroccan Darija, and English.",
    tag: "FR · AR · Darija · EN",
    accent: "#1A7A6E",
    items: ["Darija (الدارجة) support", "RTL-aware rendering", "Technical terms preserved", "Professional register"],
  },
];

const card = {
  hidden:  { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};

export default function Features() {
  const ScannerIcon = SCANNER.icon;

  return (
    <section className="py-24 px-6 bg-white/[0.01]">
      <div className="max-w-5xl mx-auto">
        {/* Header — left-aligned */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="font-mono text-xs uppercase tracking-widest mb-3" style={{ color: "var(--zellige-gold)" }}>Platform features</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white font-mono">
            Everything Your Team Needs to{" "}
            <span style={{ color: "#2E5FE8" }}>Stay Secure</span>
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
          className="flex flex-col gap-6"
        >
          {/* Scanner — full width, zellige-card corner ornaments */}
          <motion.div
            variants={card}
            whileHover={{
              borderColor: `${SCANNER.accent}30`,
              boxShadow: `0 20px 60px ${SCANNER.accent}08`,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="zellige-card rounded-2xl border border-white/10 p-8 cursor-default"
          >
            <div className="flex flex-col md:flex-row md:items-start gap-8">
              {/* Left — identity */}
              <div className="flex-1 flex flex-col gap-5">
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `${SCANNER.accent}15`, border: `1px solid ${SCANNER.accent}30` }}
                  >
                    <ScannerIcon size={26} style={{ color: SCANNER.accent }} />
                  </div>
                  <span
                    className="text-[10px] font-mono px-2.5 py-1 rounded-full"
                    style={{ color: SCANNER.accent, background: `${SCANNER.accent}12`, border: `1px solid ${SCANNER.accent}25` }}
                  >
                    {SCANNER.tag}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 font-mono">{SCANNER.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed max-w-md">{SCANNER.description}</p>
                </div>
              </div>

              {/* Right — bullet list */}
              <ul className="md:w-56 space-y-3 shrink-0">
                {SCANNER.items.map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-xs text-slate-300 font-mono">
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: SCANNER.accent }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Secondary features — 2-col */}
          <div className="grid md:grid-cols-2 gap-6">
            {SECONDARY.map((f) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  variants={card}
                  whileHover={{
                    y: -4,
                    borderColor: `${f.accent}30`,
                    boxShadow: `0 20px 60px ${f.accent}10`,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 24 }}
                  className="glass rounded-2xl border border-white/10 p-6 flex flex-col gap-5 cursor-default"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: `${f.accent}15`, border: `1px solid ${f.accent}30` }}
                  >
                    <Icon size={22} style={{ color: f.accent }} />
                  </div>

                  <span
                    className="self-start text-[10px] font-mono px-2.5 py-1 rounded-full"
                    style={{ color: f.accent, background: `${f.accent}12`, border: `1px solid ${f.accent}25` }}
                  >
                    {f.tag}
                  </span>

                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{f.description}</p>
                  </div>

                  <ul className="mt-auto space-y-2">
                    {f.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                        <span className="w-1 h-1 rounded-full shrink-0" style={{ background: f.accent }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
