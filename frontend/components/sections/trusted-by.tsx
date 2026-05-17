"use client";

import { MOCK_PROGRAMS } from "@/lib/mock-data";
import Link from "next/link";
import { ArrowRight, Building2 } from "lucide-react";
import { motion } from "framer-motion";

export default function TrustedBy() {
  return (
    <section className="py-20 px-6 border-t border-white/5">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <p className="font-mono text-xs uppercase tracking-widest mb-3" style={{ color: "var(--zellige-gold)" }}>Companies</p>
          <h2 className="text-2xl md:text-3xl font-bold text-white font-mono">Protected by BroadSec.</h2>
        </motion.div>

        <motion.div
          className="grid sm:grid-cols-3 gap-4 mb-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
        >
          {MOCK_PROGRAMS.map((p) => (
            <motion.div
              key={p.id}
              variants={{
                hidden:  { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ y: -4, borderColor: "rgba(0,240,255,0.2)" }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className="glass rounded-xl border border-white/8 p-5 flex items-center gap-4 cursor-default group"
            >
              <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                <Building2 size={18} className="text-slate-400 group-hover:text-[#2E5FE8] transition-colors" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-white truncate">{p.company}</div>
                <div className="text-xs text-slate-500 font-mono">Up to {p.reward_max.toLocaleString()} MAD</div>
              </div>
              <div className="ml-auto shrink-0">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full" style={{ color: "var(--zellige-teal)", background: "rgba(26,122,110,0.12)", border: "1px solid rgba(26,122,110,0.3)" }}>
                  ACTIVE
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center"
        >
          <Link
            href="/programs"
            className="inline-flex items-center gap-2 text-sm text-[#2E5FE8] hover:text-white transition-colors font-mono"
          >
            View all programs <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
