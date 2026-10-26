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

  // Navbar appearance changes when scrolling.
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

  // Prevent background scrolling while the mobile menu is open.
  useEffect(() => {
    if (!isMenuOpen) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  const navTextColor = isScrolled
    ? "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950"
    : "text-white/85 hover:bg-white/10 hover:text-white";

  const actionButtonColor = isScrolled
    ? "bg-neutral-950 text-white hover:bg-neutral-800"
    : "bg-white text-neutral-950 hover:bg-neutral-200";

  return (
    <>
      {/* Main navbar */}
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
            aria-label="OGI RIDE home"
            className="group relative z-10 flex shrink-0 items-center gap-3"
          >
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-black tracking-tighter transition-transform duration-300 group-hover:-rotate-6 ${
                isScrolled
                  ? "bg-neutral-950 text-white"
                  : "bg-white text-neutral-950"
              }`}
            >
              OGI
            </span>

            <span className="leading-none">
              <span
                className={`block text-lg font-extrabold tracking-[-0.05em] transition-colors sm:text-xl ${
                  isScrolled ? "text-neutral-950" : "text-white"
                }`}
              >
                OGI RIDE
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
                className={`rounded-xl px-4 py-3 text-[13px] font-semibold transition-all duration-200 ${navTextColor}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop actions */}
          <div className="hidden items-center gap-3 lg:flex">
            <Link
              href="/find"
              className={`group inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 ${actionButtonColor}`}
            >
              Find your bus

              <svg
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
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

            <Link
              href="/login"
              className={`inline-flex min-h-11 items-center justify-center rounded-xl border px-4 text-sm font-semibold transition-colors ${
                isScrolled
                  ? "border-neutral-200 text-neutral-800 hover:bg-neutral-100"
                  : "border-white/45 text-white hover:bg-white/10"
              }`}
            >
              Login
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="ogi-mobile-navigation"
            onClick={() => setIsMenuOpen((previous) => !previous)}
            className={`relative z-[70] flex h-11 w-11 items-center justify-center rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 lg:hidden ${
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
                  isMenuOpen ? "translate-y-[3.5px] rotate-45" : ""
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

      {/* Mobile navigation overlay */}
      <div
        id="ogi-mobile-navigation"
        aria-hidden={!isMenuOpen}
        className={`fixed inset-0 z-[60] bg-white transition-all duration-300 lg:hidden ${
          isMenuOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-3 opacity-0"
        }`}
      >
        <div className="flex h-full flex-col overflow-y-auto px-6 pb-10 pt-28 sm:px-10">
          {/* Mobile menu heading */}
          <div className="mb-6 flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-neutral-400">
              Navigate OGI RIDE
            </p>

            <button
              type="button"
              onClick={closeMenu}
              tabIndex={isMenuOpen ? 0 : -1}
              className="rounded-lg border border-neutral-200 px-3 py-2 text-xs font-semibold text-neutral-700 transition-colors hover:bg-neutral-100"
            >
              Close menu
            </button>
          </div>

          {/* Mobile links */}
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
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className="flex-1 text-2xl font-semibold tracking-tight text-neutral-950 transition-transform duration-200 group-hover:translate-x-1">
                  {link.label}
                </span>

                <svg
                  className="h-5 w-5 text-neutral-400 transition-all duration-200 group-hover:translate-x-1 group-hover:text-neutral-950"
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

          {/* Mobile actions */}
          <Link
            href="/login"
            tabIndex={isMenuOpen ? 0 : -1}
            onClick={closeMenu}
            className="mt-3 flex min-h-14 items-center justify-center rounded-xl border border-neutral-200 px-6 py-4 text-sm font-bold text-neutral-900 transition-colors hover:bg-neutral-50"
          >
            Login
          </Link>

          <Link
            href="/find"
            tabIndex={isMenuOpen ? 0 : -1}
            onClick={closeMenu}
            className="group mt-4 flex min-h-14 items-center justify-center gap-3 rounded-xl bg-neutral-950 px-6 py-4 text-sm font-bold text-white transition-colors hover:bg-neutral-800"
          >
            Find your bus

            <svg
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
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

          {/* Footer */}
          <p className="mt-auto pt-10 text-xs text-neutral-400">
            Oriental College of Technology · Bhopal
          </p>
        </div>
      </div>
    </>
  );
}

export default Navbar;