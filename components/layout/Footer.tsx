"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BusFront,
  MapPin,
} from "lucide-react";

const quickLinks = [
  { label: "Home", href: "/#home" },
  { label: "About", href: "/about" },
  { label: "Bus Routes", href: "/find" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "FAQs", href: "/#faq" },
];

const accountLinks = [
  { label: "Student Login", href: "/login" },
  { label: "Create Account", href: "/register" },
  { label: "Admin Portal", href: "/admin" },
];

function Footer() {
  const shouldReduceMotion = useReducedMotion();
  const [currentYear, setCurrentYear] = useState(2026);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="relative overflow-hidden bg-neutral-950 text-white">
      {/* Top divider */}
      <div className="h-px w-full bg-white/15" />

      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Main footer content */}
        <div className="grid gap-12 py-14 sm:py-16 md:grid-cols-2 lg:grid-cols-[1.35fr_0.8fr_0.8fr_1fr] lg:gap-10 lg:py-20">
          {/* Brand and description */}
          <div className="lg:pr-5">
            <Link
              href="/#home"
              aria-label="OGI RIDE home"
              className="group inline-flex items-center gap-3"
            >
              <motion.span
                whileHover={shouldReduceMotion ? undefined : { rotate: -5 }}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-sm font-black tracking-tight text-neutral-950 transition-colors duration-300 group-hover:bg-neutral-200"
              >
                OGI
              </motion.span>

              <span>
                <span className="block text-xl font-bold tracking-[-0.05em]">
                  OGI RIDE
                </span>
                <span className="mt-1 block text-[9px] font-semibold uppercase tracking-[0.22em] text-white/40">
                  Campus Mobility
                </span>
              </span>
            </Link>

            <p className="mt-6 max-w-sm text-sm leading-7 text-white/55">
              A simpler way to navigate your college commute. Explore bus
              routes, check pickup information, and access your campus
              transport details in one place.
            </p>

            <div className="mt-6 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.035] px-3.5 py-2.5">
              <BusFront className="h-4 w-4 text-white/75" />
              <span className="text-xs font-medium text-white/65">
                Built for the OCT community
              </span>
            </div>
          </div>

          {/* Explore links */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">
              Explore
            </h3>

            <ul className="mt-6 space-y-4">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-sm text-white/60 transition-colors duration-200 hover:text-white"
                  >
                    <span className="h-px w-0 bg-white transition-all duration-300 group-hover:w-4" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account links */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">
              Your Account
            </h3>

            <ul className="mt-6 space-y-4">
              {accountLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-sm text-white/60 transition-colors duration-200 hover:text-white"
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Campus information */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">
              Our Campus
            </h3>

            <p className="mt-6 text-base font-semibold leading-6 tracking-tight">
              Oriental College of Technology
            </p>

            <div className="mt-3 flex items-start gap-2.5 text-sm leading-6 text-white/50">
              <MapPin className="mt-1 h-4 w-4 shrink-0" />
              <span>Bhopal, Madhya Pradesh, India</span>
            </div>

            <a
              href="https://oriental.ac.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-5 inline-flex items-center gap-2 text-sm font-medium text-white/80 transition-colors hover:text-white"
            >
              Visit college website
              <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>

        {/* Oversized brand wordmark */}
        <div className="relative overflow-hidden border-t border-white/10 py-8 sm:py-10">
          <motion.p
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="select-none text-center text-[clamp(3.4rem,12vw,10rem)] font-black leading-none tracking-[-0.075em] text-white/[0.055]"
            aria-hidden="true"
          >
            OGI RIDE
          </motion.p>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-5 border-t border-white/10 py-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {currentYear} OGI RIDE. All rights reserved.</p>

          <p className="order-first font-medium tracking-wide text-white/70 sm:order-none">
            Your college. Your journey.
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <Link
              href="/#home"
              className="group inline-flex items-center gap-2 transition-colors hover:text-white"
            >
              Back to top
              <ArrowDownRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:rotate-45" />
            </Link>

            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-white"
            >
              Admin
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;