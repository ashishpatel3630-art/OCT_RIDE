"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BusFront,
  Check,
  ChevronDown,
  Clock3,
  MapPin,
  Radio,
  Route,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const BUS_IMAGE =
  "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1600&q=90";

const features = [
  {
    icon: BusFront,
    number: "01",
    title: "Assigned bus",
    description: "Your transport, made easy to understand.",
    detail:
      "Sign in to view the bus and transport information assigned to your student account.",
  },
  {
    icon: Route,
    number: "02",
    title: "Pickup & route",
    description: "Know where your journey begins.",
    detail:
      "Review your assigned pickup point and route details. Available information depends on your college allocation.",
  },
  {
    icon: Radio,
    number: "03",
    title: "Location updates",
    description: "Understand the latest reported status.",
    detail:
      "When an authorised device sends GPS data, the system can show its reported position and timestamp.",
  },
];

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: reduceMotion ? 0 : 0.55,
        delay: reduceMotion ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function BusImageCard() {
  const [imageFailed, setImageFailed] = useState(false);
  const [selectedStop, setSelectedStop] = useState<"pickup" | "campus">(
    "pickup"
  );
  const reduceMotion = useReducedMotion();

  const stopInfo =
    selectedStop === "pickup"
      ? {
          title: "Pickup point",
          description: "Your assigned bus stop",
          icon: MapPin,
        }
      : {
          title: "College campus",
          description: "Your destination",
          icon: BusFront,
        };

  const StopIcon = stopInfo.icon;

  return (
    <div className="group relative isolate min-h-[540px] overflow-hidden rounded-[28px] bg-neutral-950 sm:min-h-[610px] lg:min-h-[680px]">
      {!imageFailed ? (
        <Image
          src={BUS_IMAGE}
          alt="Bus travelling along a road"
          fill
          sizes="(max-width: 1023px) 100vw, 52vw"
          className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.025]"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-neutral-800"
        />
      )}

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/15 to-black/85"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent"
      />

      {/* Brand */}
      <div className="absolute inset-x-5 top-5 z-10 flex items-center justify-between sm:inset-x-7 sm:top-7">
        <Link
          href="/"
          className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-black/25 px-4 py-3 text-white backdrop-blur-xl transition-colors hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <BusFront size={17} strokeWidth={1.7} />
          <span className="text-[11px] font-semibold tracking-[0.16em]">
            OGI RIDE
          </span>
        </Link>

        <Link
          href="/login"
          aria-label="Sign in to OGI RIDE"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-black/25 text-white backdrop-blur-xl transition-all hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <ArrowUpRight size={19} />
        </Link>
      </div>

      {/* Main copy */}
      <div className="absolute left-5 right-5 top-28 z-10 text-white sm:left-8 sm:right-8 sm:top-36 lg:left-10 lg:right-10">
        <p className="flex items-center gap-2.5 text-[10px] font-medium uppercase tracking-[0.2em] text-white/75">
          <span className="h-px w-7 bg-white/70" />
          Campus mobility
        </p>

        <h3 className="mt-6 max-w-lg text-[43px] font-medium leading-[0.98] tracking-[-0.065em] sm:text-6xl lg:text-[70px]">
          The journey
          <br />
          <span className="text-white/60">made simpler.</span>
        </h3>

        <p className="mt-5 max-w-[310px] text-sm leading-7 text-white/80 sm:text-base">
          Your everyday college commute, thoughtfully connected.
        </p>

        <a
          href="#tracking-information"
          className="mt-7 inline-flex items-center gap-3 border-b border-white/40 pb-2 text-xs font-medium text-white transition-colors hover:border-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          Explore the experience
          <ArrowDownRight size={15} />
        </a>
      </div>

      {/* Decorative route graphic — not a live GPS map */}
      <svg
        viewBox="0 0 400 150"
        fill="none"
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[155px] left-0 z-[1] h-28 w-full opacity-65 sm:bottom-[160px] sm:h-36"
      >
        <motion.path
          d="M 15 125 C 75 125, 65 45, 145 65 S 225 125, 275 62 S 340 25, 385 30"
          stroke="white"
          strokeWidth="1.2"
          strokeDasharray="3 7"
          strokeLinecap="round"
          initial={reduceMotion ? false : { pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{
            duration: reduceMotion ? 0 : 1.6,
            ease: "easeInOut",
          }}
        />
        <circle cx="15" cy="125" r="4" fill="white" />
        <circle cx="385" cy="30" r="4" fill="white" />
      </svg>

      {/* Interactive route preview */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{
          duration: reduceMotion ? 0 : 0.5,
          delay: reduceMotion ? 0 : 0.15,
        }}
        className="absolute bottom-[145px] left-4 z-10 w-[min(260px,calc(100%-2rem))] rounded-[20px] border border-neutral-200 bg-white p-4 shadow-[0_20px_60px_rgba(0,0,0,0.22)] sm:bottom-[155px] sm:left-8 sm:p-5"
      >
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
            Route preview
          </span>
          <Route size={15} className="text-neutral-500" />
        </div>

        <p className="mt-3 text-sm font-semibold tracking-tight text-neutral-950">
          Your daily journey
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setSelectedStop("pickup")}
            aria-pressed={selectedStop === "pickup"}
            className={`rounded-xl border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 ${
              selectedStop === "pickup"
                ? "border-neutral-950 bg-neutral-950 text-white"
                : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50"
            }`}
          >
            <MapPin size={15} />
            <span className="mt-2 block text-[11px] font-medium">
              Pickup point
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedStop("campus")}
            aria-pressed={selectedStop === "campus"}
            className={`rounded-xl border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 ${
              selectedStop === "campus"
                ? "border-neutral-950 bg-neutral-950 text-white"
                : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50"
            }`}
          >
            <BusFront size={15} />
            <span className="mt-2 block text-[11px] font-medium">
              College
            </span>
          </button>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={selectedStop}
            initial={reduceMotion ? false : { opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
            className="mt-4 flex items-center gap-3 border-t border-neutral-100 pt-4"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-800">
              <StopIcon size={17} />
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-900">
                {stopInfo.title}
              </p>
              <p className="mt-1 text-[10px] text-neutral-500">
                {stopInfo.description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Bottom trust panel */}
      <div className="absolute inset-x-4 bottom-4 z-10 rounded-[20px] border border-white/20 bg-black/50 p-4 text-white backdrop-blur-xl sm:inset-x-7 sm:bottom-7 sm:p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/10">
            <ShieldCheck size={20} strokeWidth={1.6} />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-medium tracking-tight">
              Clear information. No guesswork.
            </p>
            <p className="mt-1 text-xs leading-5 text-white/70">
              Location updates depend on actual device reports.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  number,
  title,
  description,
  detail,
  expanded,
  onToggle,
  index,
}: {
  icon: (typeof features)[number]["icon"];
  number: string;
  title: string;
  description: string;
  detail: string;
  expanded: boolean;
  onToggle: () => void;
  index: number;
}) {
  const reduceMotion = useReducedMotion();
  const detailId = `tracking-feature-detail-${number}`;

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: reduceMotion ? 0 : 0.45,
        delay: reduceMotion ? 0 : index * 0.07,
      }}
      whileHover={reduceMotion ? undefined : { y: -3 }}
      className={`rounded-[22px] border bg-white p-5 transition-colors duration-300 sm:p-6 ${
        expanded
          ? "border-neutral-500 shadow-[0_12px_35px_rgba(0,0,0,0.055)]"
          : "border-neutral-200 hover:border-neutral-400"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-neutral-950 text-white">
          <Icon size={19} strokeWidth={1.7} />
        </div>
        <span className="text-[10px] font-medium tracking-[0.15em] text-neutral-400">
          {number}
        </span>
      </div>

      <h4 className="mt-5 text-sm font-semibold tracking-tight text-neutral-950">
        {title}
      </h4>

      <p className="mt-2 text-xs leading-6 text-neutral-500">
        {description}
      </p>

      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        aria-controls={detailId}
        className="mt-4 inline-flex min-h-9 items-center gap-2 text-xs font-semibold text-neutral-900 transition-colors hover:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2"
      >
        {expanded ? "Show less" : "Learn more"}
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${
            expanded ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            id={detailId}
            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.22 }}
            className="overflow-hidden"
          >
            <p className="border-t border-neutral-100 pt-3 text-xs leading-6 text-neutral-600">
              {detail}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

export default function TrackingIntro() {
  const [showDetails, setShowDetails] = useState(false);
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="live-tracking"
      aria-labelledby="tracking-intro-title"
      className="relative isolate overflow-hidden bg-white px-5 py-20 text-neutral-950 sm:px-8 sm:py-24 lg:px-14 lg:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.035]"
        style={{
          backgroundImage:
            "radial-gradient(#000 0.7px, transparent 0.7px)",
          backgroundSize: "18px 18px",
        }}
      />

      <div className="mx-auto max-w-7xl">
        {/* Section introduction */}
        <Reveal className="mb-10 flex flex-col justify-between gap-6 md:mb-14 md:flex-row md:items-end">
          <div>
            <div className="mb-5 inline-flex items-center gap-2.5 rounded-full border border-neutral-200 bg-white px-3.5 py-2.5">
              <Sparkles size={13} className="text-neutral-700" />
              <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-neutral-600">
                A better campus commute
              </span>
            </div>

            <h2
              id="tracking-intro-title"
              className="max-w-3xl text-[42px] font-medium leading-[1.02] tracking-[-0.065em] sm:text-6xl lg:text-[68px]"
            >
              Your journey,
              <span className="block text-neutral-400">
                thoughtfully connected.
              </span>
            </h2>
          </div>

          <div className="max-w-md md:pb-1">
            <p className="text-sm leading-7 text-neutral-500 sm:text-base">
              Your assigned bus, pickup point and available tracking
              information, brought together in one considered experience.
            </p>

            <button
              type="button"
              onClick={() => setShowDetails((current) => !current)}
              aria-expanded={showDetails}
              aria-controls="tracking-details"
              className="mt-4 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-neutral-900 transition-colors hover:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-4"
            >
              {showDetails ? "Hide details" : "How tracking works"}
              <ArrowRight
                size={15}
                className={`transition-transform duration-300 ${
                  showDetails ? "rotate-90" : ""
                }`}
              />
            </button>
          </div>
        </Reveal>

        {/* Animated explainer */}
        <motion.div
          id="tracking-details"
          initial={false}
          animate={{
            height: showDetails ? "auto" : 0,
            opacity: showDetails ? 1 : 0,
            marginBottom: showDetails ? 24 : 0,
          }}
          transition={{
            duration: reduceMotion ? 0 : 0.28,
            ease: "easeInOut",
          }}
          className="overflow-hidden"
          aria-hidden={!showDetails}
          inert={!showDetails}
        >
          <div className="rounded-[24px] border border-neutral-200 bg-neutral-50 p-5 sm:p-7">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-neutral-950 text-white">
                <Radio size={19} />
              </div>

              <div className="max-w-3xl">
                <h3 className="text-base font-semibold tracking-tight">
                  How location reporting works
                </h3>
                <p className="mt-2 text-sm leading-7 text-neutral-600">
                  An authorised device or driver application must send
                  location information to the system. The app can then show
                  the latest received position and timestamp. When reports
                  are delayed or unavailable, the status should clearly
                  reflect that instead of implying the bus is live.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main layout */}
        <div className="grid items-stretch gap-5 lg:grid-cols-[1.08fr_0.92fr] lg:gap-6">
          <Reveal className="min-w-0">
            <BusImageCard />
          </Reveal>

          <Reveal delay={0.1} className="flex min-w-0 flex-col">
            <div
              id="tracking-information"
              className="flex flex-1 flex-col rounded-[28px] border border-neutral-200 bg-[#f8f8f8] p-5 sm:p-7 lg:p-8"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
                  <Radio size={14} />
                  The essentials
                </div>

                <span className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-[9px] font-medium text-neutral-500">
                  Data dependent
                </span>
              </div>

              <h3 className="mt-6 text-[31px] font-medium leading-[1.08] tracking-[-0.055em] sm:text-[38px]">
                Know what&apos;s available.
                <span className="mt-1 block text-neutral-400">
                  Travel with confidence.
                </span>
              </h3>

              <p className="mt-4 text-sm leading-7 text-neutral-500">
                Understand your transport details, with a clear distinction
                between information received and updates still awaited.
              </p>

              {/* Location status information */}
              <div className="mt-7 rounded-[22px] border border-neutral-200 bg-white p-4 sm:p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px] bg-neutral-950 text-white">
                    <Radio size={20} strokeWidth={1.7} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold tracking-tight">
                      Location report
                    </p>
                    <p className="mt-1 text-xs text-neutral-500">
                      Based on received device data
                    </p>
                  </div>
                </div>

                <div className="my-5 h-px bg-neutral-100" />

                <div className="flex items-start gap-3">
                  <Clock3
                    size={17}
                    className="mt-0.5 shrink-0 text-neutral-500"
                  />
                  <div>
                    <p className="text-xs font-semibold text-neutral-900">
                      Last update
                    </p>
                    <p className="mt-1 text-xs leading-5 text-neutral-500">
                      The actual timestamp appears when a report is available.
                    </p>
                  </div>
                </div>

                <div className="my-4 h-px bg-neutral-100" />

                <div className="flex items-start gap-3">
                  <ShieldCheck
                    size={17}
                    className="mt-0.5 shrink-0 text-neutral-500"
                  />
                  <div>
                    <p className="text-xs font-semibold text-neutral-900">
                      Transparent status
                    </p>
                    <p className="mt-1 text-xs leading-5 text-neutral-500">
                      The displayed status should match actual system data.
                    </p>
                  </div>
                </div>
              </div>

              {/* Sign-in CTA */}
              <div className="mt-auto pt-6">
                <Link
                  href="/login"
                  className="group inline-flex min-h-[54px] w-full items-center justify-between gap-3 rounded-full bg-neutral-950 px-5 text-sm font-medium text-white transition-colors duration-300 hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2 sm:px-6"
                >
                  <span>Sign in to your account</span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:bg-white/15">
                    <ArrowRight size={16} />
                  </span>
                </Link>

                <p className="mt-3 text-center text-[10px] leading-5 text-neutral-400">
                  Your assigned transport information, in one place.
                </p>
              </div>
            </div>

            {/* Interactive feature cards */}
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {features.map((feature, index) => (
                <FeatureCard
                  key={feature.number}
                  {...feature}
                  index={index}
                  expanded={expandedFeature === feature.number}
                  onToggle={() =>
                    setExpandedFeature((current) =>
                      current === feature.number ? null : feature.number
                    )
                  }
                />
              ))}
            </div>
          </Reveal>
        </div>

        {/* Bottom note */}
        <Reveal delay={0.15} className="mt-8">
          <div className="flex flex-col gap-3 border-t border-neutral-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-2.5">
              <Check
                size={15}
                className="mt-0.5 shrink-0 text-neutral-600"
              />
              <p className="max-w-xl text-xs leading-6 text-neutral-500">
                Thoughtfully designed for a simpler, more informed college
                commute.
              </p>
            </div>

            <Link
              href="/login"
              className="inline-flex shrink-0 items-center gap-2 text-xs font-semibold text-neutral-900 transition-colors hover:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
            >
              Explore your dashboard
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}