"use client";

import React, { useEffect, useState } from "react";

const navigationLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Routes", href: "#find-bus" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Support", href: "#contact" },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    if (!menuOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-12">
        <a
          href="#home"
          onClick={closeMenu}
          className="flex items-center gap-3"
          aria-label="OCT RIDE Home"
        >
          <div className="flex h-10 w-10 items-center justify-center bg-slate-950 text-sm font-black tracking-tight text-white">
            OC<span className="text-blue-500">T</span>
          </div>

          <div className="leading-none">
            <p className="text-base font-black tracking-tight text-slate-950">
              OCT RIDE
            </p>

            <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              Campus Transport
            </p>
          </div>
        </a>
        <nav aria-label="Main navigation" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {navigationLinks.map((link, index) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={closeMenu}
                  aria-current={index === 0 ? "page" : undefined}
                  className={`text-sm font-semibold transition-colors hover:text-blue-600 ${
                    index === 0 ? "text-slate-950" : "text-slate-500"
                  }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="hidden sm:block">
          <a
            href="#find-bus"
            onClick={closeMenu}
            className="inline-flex items-center bg-slate-950 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-blue-600"
          >
            Browse Routes
          </a>
        </div>
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center border border-slate-200 text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 md:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {menuOpen ? (
              <path d="m6 6 12 12M18 6 6 18" />
            ) : (
              <>
                <path d="M4 6h16" />
                <path d="M4 12h16" />
                <path d="M4 18h16" />
              </>
            )}
          </svg>
        </button>
      </div>
      <nav
        id="mobile-navigation"
        aria-label="Mobile navigation"
        hidden={!menuOpen}
        className="border-t border-slate-100 bg-white px-6 py-3 md:hidden"
      >
        {navigationLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={closeMenu}
            className="block py-3 text-sm font-semibold text-slate-700"
          >
            {link.label}
          </a>
        ))}
        <a
          href="#find-bus"
          onClick={closeMenu}
          className="mt-2 block bg-slate-950 px-4 py-3 text-center text-sm font-bold text-white"
        >
          Browse Routes
        </a>
      </nav>
    </header>
  );
}

export default Navbar;
