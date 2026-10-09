"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

const navLinks = [
  { label: "Home", href: "/#home" },
  { label: "About", href: "/about" },
  { label: "Find Bus", href: "/find" },
  { label: "Contact", href: "/contact" },
];

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      {/* Navbar */}
      <header
        className={`fixed inset-x-0 top-0 z-50 px-4 transition-all duration-300 sm:px-6 lg:px-10 ${
          isScrolled ? "pt-3" : "pt-5"
        }`}
      >
        <nav
          aria-label="Main navigation"
          className={`mx-auto flex max-w-7xl items-center justify-between rounded-2xl border px-4 py-3 transition-all duration-300 sm:px-6 ${
            isScrolled
              ? "border-neutral-200/80 bg-white/95 shadow-lg shadow-black/[0.04] backdrop-blur-xl"
              : "border-white/20 bg-black/25 backdrop-blur-md"
          }`}
        >
          {/* Brand */}
          <Link
            href="/#home"
            onClick={closeMenu}
            aria-label="OCT RIDE home"
            className="group relative z-10 flex shrink-0 items-center gap-3"
          >
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-black tracking-tighter transition-all duration-300 group-hover:-rotate-6 ${
                isScrolled
                  ? "bg-neutral-950 text-white"
                  : "bg-white text-neutral-950"
              }`}
            >
              OCT
            </span>

            <span className="leading-none">
              <span
                className={`block text-lg font-extrabold tracking-[-0.05em] transition-colors sm:text-xl ${
                  isScrolled ? "text-neutral-950" : "text-white"
                }`}
              >
                OCT RIDE
              </span>

              <span
                className={`mt-1 block text-[9px] font-semibold uppercase tracking-[0.18em] transition-colors ${
                  isScrolled ? "text-neutral-500" : "text-white/65"
                }`}
              >
                Campus Mobility
              </span>
            </span>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={closeMenu}
                className={`rounded-xl px-4 py-3 text-[13px] font-semibold transition-all duration-200 ${
                  isScrolled
                    ? "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950"
                    : "text-white/85 hover:bg-white/10 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <Link
            href="/find"
            onClick={closeMenu}
            className={`hidden items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 lg:inline-flex ${
              isScrolled
                ? "bg-neutral-950 text-white hover:bg-neutral-800"
                : "bg-white text-neutral-950 hover:bg-neutral-200"
            }`}
          >
            Find your bus
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <path
                d="M5 12h14m-6-6 6 6-6 6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>

          {/* Mobile menu button */}
          <button
            type="button"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            onClick={() =>
              setIsMenuOpen((previous) => !previous)
            }
            className={`relative z-10 flex h-11 w-11 items-center justify-center rounded-xl transition-colors lg:hidden ${
              isScrolled || isMenuOpen
                ? "text-neutral-950 hover:bg-neutral-100"
                : "text-white hover:bg-white/10"
            }`}
          >
            <span className="sr-only">
              {isMenuOpen ? "Close navigation" : "Open navigation"}
            </span>

            <span className="flex w-5 flex-col gap-[5px]">
              <span
                className={`h-0.5 w-full rounded-full transition-all duration-300 ${
                  isMenuOpen
                    ? "translate-y-[3.5px] rotate-45"
                    : ""
                } ${
                  isScrolled || isMenuOpen
                    ? "bg-neutral-950"
                    : "bg-white"
                }`}
              />

              <span
                className={`h-0.5 w-full rounded-full transition-all duration-300 ${
                  isMenuOpen
                    ? "-translate-y-[3.5px] -rotate-45"
                    : ""
                } ${
                  isScrolled || isMenuOpen
                    ? "bg-neutral-950"
                    : "bg-white"
                }`}
              />
            </span>
          </button>
        </nav>
      </header>

      {/* Mobile menu */}
      <div
        aria-hidden={!isMenuOpen}
        className={`fixed inset-0 z-[60] bg-white transition-all duration-300 lg:hidden ${
          isMenuOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-3 opacity-0"
        }`}
      >
        <div className="flex h-full flex-col overflow-y-auto px-6 pb-10 pt-28 sm:px-10">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-neutral-400">
              Navigate OCT RIDE
            </p>
            <button
              type="button"
              onClick={closeMenu}
              className="rounded-lg border border-neutral-200 px-3 py-2 text-xs font-semibold text-neutral-700"
            >
              Close menu
            </button>
          </div>

          <div className="border-t border-neutral-200">
            {navLinks.map((link, index) => (
              <Link
                key={link.label}
                href={link.href}
                tabIndex={isMenuOpen ? 0 : -1}
                onClick={closeMenu}
                className="group flex items-center gap-4 border-b border-neutral-200 py-5"
              >
                <span className="w-6 text-[11px] font-semibold text-neutral-400">
                  0{index + 1}
                </span>

                <span className="flex-1 text-2xl font-semibold tracking-tight text-neutral-950 transition-transform duration-200 group-hover:translate-x-1">
                  {link.label}
                </span>

                <svg
                  className="h-5 w-5 text-neutral-400 transition-all group-hover:translate-x-1 group-hover:text-neutral-950"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  aria-hidden="true"
                >
                  <path
                    d="M7 17 17 7M8 7h9v9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            ))}
          </div>

          <Link
            href="/find"
            tabIndex={isMenuOpen ? 0 : -1}
            onClick={closeMenu}
            className="mt-8 flex min-h-14 items-center justify-center gap-3 rounded-xl bg-neutral-950 px-6 py-4 text-sm font-bold text-white transition hover:bg-neutral-800"
          >
            Find your bus
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <path
                d="M5 12h14m-6-6 6 6-6 6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>

          <p className="mt-auto pt-10 text-xs text-neutral-400">
            Oriental College of Technology · Bhopal
          </p>
        </div>
      </div>
    </>
  );
}

export default Navbar;
