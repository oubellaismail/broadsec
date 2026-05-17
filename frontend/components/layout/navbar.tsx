"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Shield, Menu, X } from "lucide-react";

const links: { href: string; label: string }[] = [];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass navbar-scrolled" : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative">
            <Shield
              size={22}
              className="text-[#2E5FE8] transition-all duration-300 group-hover:drop-shadow-[0_0_8px_#2E5FE8]"
            />
          </div>
          <span className="font-mono font-bold text-lg tracking-tight">
            <span className="text-white">Broad</span>
            <span className="text-[#2E5FE8]">Sec</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-slate-400 hover:text-white transition-colors duration-200"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="btn-cyan text-sm font-mono px-4 py-2 rounded-lg"
          >
            Login
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-slate-400 hover:text-white p-1"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden glass border-t border-white/10 px-6 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-sm text-slate-300 hover:text-white"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className="btn-cyan text-sm font-mono px-4 py-2 rounded-lg text-center"
          >
            Login
          </Link>
        </div>
      )}
    </header>
  );
}
