import Link from "next/link";
import { Shield } from "lucide-react";

const LINKS = [
  { label: "Scanner",     href: "/scanner"     },
  { label: "Programs",    href: "/programs"     },
  { label: "Leaderboard", href: "/leaderboard"  },
  { label: "Submit",      href: "/submit"       },
];

export default function Footer() {
  return (
    <>
      <div className="zellige-footer-band" aria-hidden="true" />
      <footer className="border-t border-white/5 py-12 px-6">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <Shield size={18} className="text-[#2E5FE8]" />
          <span className="font-mono font-bold text-base">
            <span className="text-white">Broad</span>
            <span className="text-[#2E5FE8]">Sec</span>
          </span>
          <span className="text-slate-600 text-xs font-mono ml-2">
            Morocco&apos;s AI Bug Bounty Platform
          </span>
        </div>

        {/* Links */}
        <nav className="flex items-center gap-6">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors font-mono"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Built with */}
        <p className="text-xs text-slate-600 font-mono text-center">
          Built with Gemini AI · Google Cloud · GDG Agadir 2025
        </p>
      </div>
    </footer>
    </>
  );
}
