"use client";

import Link from "next/link";
import { Trophy, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { MOCK_RESEARCHERS } from "@/lib/mock-data";

function rankColor(i: number): string {
  if (i === 0) return "var(--zellige-gold)";
  if (i === 1) return "#9B8A5E";
  if (i === 2) return "#6B6B6B";
  return "#475569";
}

export default function LeaderboardPreview() {
  const top = MOCK_RESEARCHERS.slice(0, 5);

  return (
    <section className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-10"
        >
          <div>
            <p className="font-mono text-xs uppercase tracking-widest mb-2" style={{ color: "var(--zellige-gold)" }}>Hall of fame</p>
            <h2 className="text-2xl md:text-3xl font-bold text-white font-mono">Top Researchers</h2>
          </div>
          <Link
            href="/leaderboard"
            className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-[#2E5FE8] transition-colors font-mono"
          >
            View all <ArrowRight size={14} />
          </Link>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.6, ease: "easeOut" as const }}
          className="glass rounded-2xl border border-white/10 overflow-hidden"
        >
          <div className="grid grid-cols-[28px_1fr_auto] md:grid-cols-12 px-5 py-3 border-b border-white/5 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
            <div className="md:col-span-1">#</div>
            <div className="md:col-span-5">Researcher</div>
            <div className="hidden md:block md:col-span-2 text-right">Reports</div>
            <div className="hidden md:block md:col-span-2 text-right">Valid</div>
            <div className="md:col-span-2 text-right">Earned</div>
          </div>

          {top.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, ease: "easeOut" as const, delay: i * 0.07 }}
              whileHover={{ backgroundColor: "rgba(255,255,255,0.025)" }}
              className="grid grid-cols-[28px_1fr_auto] md:grid-cols-12 px-5 py-4 items-center border-b border-white/[0.04] last:border-0 transition-colors"
            >
              <div className="md:col-span-1">
                <span className="font-mono text-sm font-bold tabular-nums" style={{ color: rankColor(i) }}>
                  {String(r.rank).padStart(2, "0")}
                </span>
              </div>

              <div className="md:col-span-5 flex items-center gap-3 min-w-0">
                <div
                  className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-xs font-mono shrink-0"
                  style={{ background: "rgba(201,168,76,0.08)", color: "var(--zellige-gold)" }}
                >
                  {r.handle[0].toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-mono text-white truncate">{r.handle}</div>
                  <div className="text-[10px] text-slate-500">{r.reputation.toLocaleString()} rep</div>
                </div>
              </div>

              <div className="hidden md:block md:col-span-2 text-right font-mono text-sm text-slate-300">{r.reports_submitted}</div>
              <div className="hidden md:block md:col-span-2 text-right font-mono text-sm tabular-nums" style={{ color: "var(--zellige-teal)" }}>{r.valid_reports}</div>
              <div className="md:col-span-2 text-right font-mono text-sm tabular-nums" style={{ color: "var(--zellige-gold)" }}>
                {(r.total_earned / 1000).toFixed(1)}k
                <span className="text-[10px] text-slate-500 ml-0.5">MAD</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-8"
        >
          <motion.a
            href="/submit"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="btn-cyan inline-flex items-center gap-2 font-mono text-sm px-6 py-3 rounded-xl"
          >
            <Trophy size={16} />
            Join as a Researcher
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
