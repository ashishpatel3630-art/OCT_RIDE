"use client";

import React from "react";

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-12">

        {/* Logo */}
        <a
          href="#home"
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

        {/* Navigation */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-8">
            <li>
              <a
                href="#home"
                className="text-sm font-semibold text-slate-950 transition-colors hover:text-blue-600"
              >
                Home
              </a>
            </li>

            <li>
              <a
                href="#find-bus"
                className="text-sm font-semibold text-slate-500 transition-colors hover:text-blue-600"
              >
                Find Bus
              </a>
            </li>

            <li>
              <a
                href="#contact"
                className="text-sm font-semibold text-slate-500 transition-colors hover:text-blue-600"
              >
                Support
              </a>
            </li>
          </ul>
        </nav>

        {/* Action */}
        <div className="hidden sm:block">
          <a
            href="/login"
            className="inline-flex items-center bg-slate-950 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-blue-600"
          >
            Student Login
          </a>
        </div>

        {/* Mobile menu */}
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center border border-slate-200 text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 md:hidden"
          aria-label="Open menu"
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
            <path d="M4 6h16" />
            <path d="M4 12h16" />
            <path d="M4 18h16" />
          </svg>
        </button>

      </div>
    </header>
  );
}

export default Navbar;

