"use client";

import { Upload, Brain, Wrench } from "lucide-react";
import { motion } from "framer-motion";

const STEPS = [
  {
    icon: Upload,
    number: "01",
    title: "Researcher Submits",
    description:
      "A security researcher finds a vulnerability and submits a detailed report through the platform, in any language.",
    accent: "#2E5FE8",
  },
  {
    icon: Brain,
    number: "02",
    title: "Gemini AI Triages",
    description:
      "Our AI instantly validates the report, scores it with CVSS, checks if it's in scope, and drafts a response to the researcher.",
    accent: "#1B3A8C",
  },
  {
    icon: Wrench,
    number: "03",
    title: "Company Fixes & Pays",
    description:
      "The security team reviews the AI analysis, confirms the fix, and releases the bounty. All tracked transparently.",
    accent: "#1A7A6E",
  },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18 } },
};

const item = {
  hidden:   { opacity: 0, y: 30 },
  visible:  { opacity: 1, y: 0 },
};

export default function HowItWorks() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="font-mono text-xs uppercase tracking-widest mb-3" style={{ color: "var(--zellige-gold)" }}>How it works</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white font-mono">
            From Discovery to Fix in{" "}
            <span style={{ color: "var(--zellige-gold)" }}>Minutes</span>
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line — desktop */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" as const, delay: 0.2 }}
            style={{
              originX: 0,
              background: "linear-gradient(90deg, #C9A84C33, #1B3A8C33, #1A7A6E33)",
            }}
            className="hidden md:block absolute top-10 left-[16.6%] right-[16.6%] h-px"
          />

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
          >
            {STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  variants={item}
                  className="flex flex-col items-center text-center relative"
                >
                  {/* Icon circle */}
                  <div className="flex flex-col items-center mb-6 relative z-10">
                    <span
                      className="font-mono text-[11px] font-bold mb-2 tracking-widest"
                      style={{ color: step.accent }}
                    >
                      {step.number}
                    </span>
                    <motion.div
                      whileHover={{ scale: 1.08, boxShadow: `0 0 40px ${step.accent}40` }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="w-20 h-20 rounded-full glass flex items-center justify-center border cursor-default"
                      style={{ borderColor: `${step.accent}40`, boxShadow: `0 0 30px ${step.accent}20` }}
                    >
                      <Icon size={28} style={{ color: step.accent }} />
                    </motion.div>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed max-w-xs">{step.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
