"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { PLATFORM_STATS } from "@/lib/mock-data";

interface StatItem {
  value: number;
  suffix: string;
  label: string;
  prefix?: string;
}

const STATS: StatItem[] = [
  { value: PLATFORM_STATS.vulnerabilities_found, suffix: "+", label: "Vulnerabilities Found" },
  { value: PLATFORM_STATS.researchers_active,    suffix: "+", label: "Active Researchers"    },
  { value: PLATFORM_STATS.companies_protected,   suffix: "",  label: "Companies Protected"  },
  { value: PLATFORM_STATS.triage_seconds,        suffix: "s", label: "Avg AI Triage Time"   },
];

function useCountUp(target: number, duration = 1400, active: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    const raf = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [active, target, duration]);
  return count;
}

function Stat({ item, active, index }: { item: StatItem; active: boolean; index: number }) {
  const count = useCountUp(item.value, 1400, active);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={active ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" as const, delay: index * 0.1 }}
      className="flex flex-col items-center gap-1"
    >
      <div className="font-mono text-4xl md:text-5xl font-bold text-white tabular-nums">
        {item.prefix}{count}{item.suffix}
      </div>
      <div className="text-[11px] text-slate-500 font-mono uppercase tracking-wider mt-1">{item.label}</div>
    </motion.div>
  );
}

export default function Stats() {
  const ref    = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });

  return (
    <section ref={ref} className="py-16 px-6 relative overflow-hidden">
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-40 pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent, #C9A84C55, transparent)" }}
      />
      <p className="text-center text-[10px] font-mono text-slate-600 uppercase tracking-widest mb-10">
        By the numbers
      </p>
      <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10">
        {STATS.map((s, i) => (
          <Stat key={s.label} item={s} active={inView} index={i} />
        ))}
      </div>
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-40 pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent, #C9A84C55, transparent)" }}
      />
    </section>
  );
}
