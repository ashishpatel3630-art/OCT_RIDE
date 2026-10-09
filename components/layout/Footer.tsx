
import Link from "next/link";

const quickLinks = [
  { label: "Home", href: "/#home" },
  { label: "About", href: "/about" },
  { label: "Bus Routes", href: "/find" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "FAQs", href: "/#faq" },
];

function Footer() {
  return (
    <footer className="relative overflow-hidden bg-neutral-950 text-white">
      {/* Top border */}
      <div className="h-px w-full bg-white/15" />

      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Main footer */}
        <div className="grid gap-12 py-16 md:grid-cols-2 md:py-20 lg:grid-cols-[1.4fr_0.7fr_0.9fr] lg:gap-20">
          {/* Brand */}
          <div>
            <Link
              href="/#home"
              aria-label="OCT RIDE home"
              className="group inline-flex items-center gap-3"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-lg font-black tracking-tighter text-neutral-950 transition duration-300 group-hover:rotate-[-6deg]">
                OCT
              </span>

              <span>
                <span className="block text-xl font-bold tracking-[-0.04em]">
                  OCT RIDE
                </span>
                <span className="mt-0.5 block text-[9px] font-medium uppercase tracking-[0.2em] text-white/45">
                  Campus Mobility
                </span>
              </span>
            </Link>

            <p className="mt-7 max-w-sm text-sm leading-7 text-white/55">
              Making everyday college travel simpler. Find your bus routes,
              explore pickup points, and get the information you need for your
              daily journey at Oriental College of Technology, Bhopal.
            </p>

            <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-white/10 px-3.5 py-2.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-xs font-medium text-white/70">
                Built for the OCT community
              </span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">
              Explore
            </h3>

            <ul className="mt-6 space-y-4">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-sm text-white/65 transition-colors duration-200 hover:text-white"
                  >
                    <span className="h-px w-0 bg-white transition-all duration-300 group-hover:w-4" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* College information */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">
              Our Campus
            </h3>

            <p className="mt-6 text-lg font-semibold tracking-tight">
              Oriental College of Technology
            </p>

            <p className="mt-3 max-w-xs text-sm leading-7 text-white/55">
              Bhopal, Madhya Pradesh, India
            </p>

            <a
              href="https://oriental.ac.in/"
              target="_blank"
              rel="noreferrer"
              className="group mt-5 inline-flex items-center gap-2 text-sm font-medium text-white transition-colors hover:text-white/65"
            >
              Visit college website
              <svg
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5"
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
            </a>
          </div>
        </div>

        {/* Large brand statement */}
        <div className="overflow-hidden border-t border-white/10 py-8 sm:py-10">
          <p className="select-none text-center text-[clamp(4.3rem,12vw,10rem)] font-black leading-none tracking-[-0.03em] text-white/[0.045]">
            OCT RIDE
          </p>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-4 border-t border-white/10 py-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © 2026 OCT RIDE. All rights reserved.
          </p>

          <p className="order-first font-medium tracking-wide text-white/65 sm:order-none">
            Your college. Your journey.
          </p>

          <Link
            href="/#home"
            className="inline-flex items-center gap-2 transition-colors hover:text-white"
          >
            Back to top
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <path
                d="M12 19V5m-6 6 6-6 6 6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
