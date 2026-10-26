
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BusFront,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  MapPin,
  Search,
  ShieldCheck,
  Smartphone,
  X,
} from "lucide-react";

type FaqCategory =
  | "All"
  | "Routes"
  | "Tracking"
  | "Account"
  | "General";

type FaqItem = {
  question: string;
  answer: string;
  category: Exclude<FaqCategory, "All">;
};

const faqs: FaqItem[] = [
  {
    question: "What is OGI RIDE?",
    answer:
      "OGI RIDE is a college-focused transport platform for Oriental College of Technology students. It helps students explore bus routes, understand pickup locations, access assigned bus information, and check available transport updates.",
    category: "General",
  },
  {
    question: "How can I find my college bus route?",
    answer:
      "Open the bus routes section and select a route to review its published stops and schedule. Sign in to view your assigned bus when your student account and allocation are available.",
    category: "Routes",
  },
  {
    question: "Can I check bus pickup points?",
    answer:
      "Yes. Pickup points can be displayed when they have been added to the relevant route. Check the published route details and confirm any uncertain pickup location with your college transport coordinator.",
    category: "Routes",
  },
  {
    question: "Does OGI RIDE support live bus tracking?",
    answer:
      "Live tracking depends on an authorized GPS device or location-sharing service connected to the platform and reporting current data. If live data is unavailable, do not treat a displayed route or sample location as the bus's current position.",
    category: "Tracking",
  },
  {
    question: "Are bus timings available?",
    answer:
      "Published departure and stop times can be shown when transport administration has configured the schedule. Timings may change, so follow the latest instructions from your college transport office.",
    category: "Routes",
  },
  {
    question: "What if my bus or route is missing?",
    answer:
      "First, check the available routes and sign in to your student account. If your route is still missing or your assigned bus looks incorrect, contact the college bus coordinator to verify your allocation.",
    category: "Routes",
  },
  {
    question: "How do I sign in to OGI RIDE?",
    answer:
      "Open the student sign-in page and use the credentials supported by your college account. If your account has not been created or activated, contact your administrator for assistance.",
    category: "Account",
  },
  {
    question: "What if I cannot access my account?",
    answer:
      "Double-check your credentials and make sure your internet connection is working. If the issue persists, contact your college administrator. Never share your password or verification codes with anyone.",
    category: "Account",
  },
  {
    question: "Can I use OGI RIDE on my phone?",
    answer:
      "Yes. The interface is designed to adapt to mobile phones, tablets, laptops, and desktop screens, so you can access transport information on different devices.",
    category: "General",
  },
  {
    question: "How can I report incorrect transport information?",
    answer:
      "Contact your college transport coordinator and provide the route name, bus number, or pickup point that needs checking. The displayed information should be corrected by an authorized administrator.",
    category: "General",
  },
];

const categories: FaqCategory[] = [
  "All",
  "Routes",
  "Tracking",
  "Account",
  "General",
];

const highlights = [
  {
    icon: BusFront,
    title: "Routes & stops",
    description: "Find published routes and pickup points.",
  },
  {
    icon: MapPin,
    title: "Tracking information",
    description: "Understand when live location is available.",
  },
  {
    icon: ShieldCheck,
    title: "Student access",
    description: "Get guidance on accounts and allocations.",
  },
];

export default function Faq() {
  const reduceMotion = useReducedMotion();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] =
    useState<FaqCategory>("All");
  const [openItems, setOpenItems] = useState<number[]>([0]);

  const filteredFaqs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return faqs
      .map((faq, originalIndex) => ({
        ...faq,
        originalIndex,
      }))
      .filter((faq) => {
        const matchesCategory =
          activeCategory === "All" ||
          faq.category === activeCategory;

        const matchesSearch =
          !query ||
          faq.question.toLowerCase().includes(query) ||
          faq.answer.toLowerCase().includes(query);

        return matchesCategory && matchesSearch;
      });
  }, [searchQuery, activeCategory]);

  const allVisibleOpen =
    filteredFaqs.length > 0 &&
    filteredFaqs.every((faq) =>
      openItems.includes(faq.originalIndex)
    );

  function toggleItem(index: number) {
    setOpenItems((current) =>
      current.includes(index)
        ? current.filter((item) => item !== index)
        : [...current, index]
    );
  }

  function toggleAll() {
    if (allVisibleOpen) {
      const visibleIndexes = new Set(
        filteredFaqs.map((faq) => faq.originalIndex)
      );

      setOpenItems((current) =>
        current.filter((index) => !visibleIndexes.has(index))
      );
    } else {
      setOpenItems((current) => [
        ...new Set([
          ...current,
          ...filteredFaqs.map((faq) => faq.originalIndex),
        ]),
      ]);
    }
  }

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="relative overflow-hidden bg-white px-5 py-20 text-neutral-950 sm:px-8 sm:py-28 lg:px-12"
    >
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55 }}
          className="grid gap-8 border-b border-neutral-200 pb-10 md:grid-cols-[1.2fr_0.8fr] md:items-end md:pb-14"
        >
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-600">
              <CircleHelp size={15} />
              Help centre
            </span>

            <h2
              id="faq-heading"
              className="mt-6 text-4xl font-semibold leading-[1.06] tracking-[-0.055em] sm:text-5xl lg:text-7xl"
            >
              Good questions.
              <br />
              <span className="text-neutral-400">
                Clear answers.
              </span>
            </h2>
          </div>

          <div className="md:ml-auto md:max-w-md">
            <p className="text-sm leading-7 text-neutral-600 sm:text-base">
              Everything you need to know about bus routes, pickup
              points, tracking, and your OGI RIDE student account.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3.5 py-2 text-xs font-medium text-neutral-700">
                <Check size={14} />
                Simple guidance
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3.5 py-2 text-xs font-medium text-neutral-700">
                <Smartphone size={14} />
                Mobile friendly
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main layout */}
        <div className="grid gap-10 py-10 sm:py-14 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
          {/* Left column */}
          <motion.aside
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-8"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                Need a quick answer?
              </p>

              <h3 className="mt-4 max-w-sm text-3xl font-semibold leading-tight tracking-[-0.045em] sm:text-4xl">
                Your journey,
                <br />
                without the confusion.
              </h3>

              <p className="mt-4 max-w-sm text-sm leading-7 text-neutral-600">
                Find guidance for your everyday college commute.
                For official bus assignments, always follow
                information confirmed by your transport office.
              </p>
            </div>

            <div className="space-y-5">
              {highlights.map((item, index) => {
                const Icon = item.icon;

                return (
                  <motion.div
                    key={item.title}
                    initial={
                      reduceMotion ? false : { opacity: 0, x: -10 }
                    }
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.35,
                      delay: reduceMotion ? 0 : index * 0.08,
                    }}
                    className="flex gap-4"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-50">
                      <Icon size={19} strokeWidth={1.7} />
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold">
                        {item.title}
                      </h4>
                      <p className="mt-1 text-sm leading-6 text-neutral-600">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="rounded-3xl bg-neutral-950 p-6 text-white sm:p-7">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                <BusFront size={21} />
              </div>

              <h3 className="mt-5 text-xl font-semibold tracking-tight">
                Ready to find your route?
              </h3>

              <p className="mt-2 text-sm leading-6 text-neutral-400">
                Explore the available bus routes and review their
                published stops.
              </p>

              <Link
                href="/find"
                className="group mt-6 inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-white px-5 py-3 text-sm font-semibold text-neutral-950 transition-colors hover:bg-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
              >
                Explore bus routes
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>
          </motion.aside>

          {/* Right column */}
          <div className="min-w-0">
            {/* Search */}
            <div className="relative">
              <Search
                size={19}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
              />

              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search questions or keywords..."
                aria-label="Search frequently asked questions"
                className="h-14 w-full rounded-2xl border border-neutral-200 bg-neutral-50 pl-12 pr-12 text-sm outline-none transition focus:border-neutral-500 focus:bg-white focus:ring-4 focus:ring-neutral-100"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-200 hover:text-neutral-950"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Category filters */}
            <div className="mt-5 flex gap-2 overflow-x-auto pb-3 [scrollbar-width:thin]">
              {categories.map((category) => {
                const active = activeCategory === category;

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    aria-pressed={active}
                    className={`shrink-0 rounded-full border px-4 py-2.5 text-xs font-semibold transition-colors ${
                      active
                        ? "border-neutral-950 bg-neutral-950 text-white"
                        : "border-neutral-200 text-neutral-600 hover:border-neutral-400 hover:text-neutral-950"
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>

            {/* Accordion controls */}
            <div className="mt-5 flex items-center justify-between gap-3 border-b border-neutral-200 pb-4">
              <p className="text-xs font-medium text-neutral-500">
                {filteredFaqs.length}{" "}
                {filteredFaqs.length === 1 ? "question" : "questions"}
                {searchQuery.trim() ? " found" : " available"}
              </p>

              {filteredFaqs.length > 0 && (
                <button
                  type="button"
                  onClick={toggleAll}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-700 transition hover:text-neutral-950"
                >
                  {allVisibleOpen ? "Collapse all" : "Expand all"}
                  <ArrowDown
                    size={14}
                    className={`transition-transform ${
                      allVisibleOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
              )}
            </div>

            {/* Questions */}
            <div className="border-b border-neutral-200">
              <AnimatePresence mode="wait">
                {filteredFaqs.length > 0 ? (
                  <motion.div
                    key={`${activeCategory}-${searchQuery}`}
                    initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {filteredFaqs.map((faq, index) => {
                      const originalIndex = faq.originalIndex;
                      const isOpen = openItems.includes(originalIndex);
                      const answerId = `faq-answer-${originalIndex}`;

                      return (
                        <div
                          key={faq.question}
                          className="border-t border-neutral-200 first:border-t-0"
                        >
                          <button
                            type="button"
                            aria-expanded={isOpen}
                            aria-controls={answerId}
                            onClick={() => toggleItem(originalIndex)}
                            className="group flex w-full items-center gap-4 py-5 text-left sm:py-6"
                          >
                            <span className="w-7 shrink-0 text-xs font-semibold tabular-nums text-neutral-400">
                              {String(index + 1).padStart(2, "0")}
                            </span>

                            <span
                              className={`flex-1 text-sm font-semibold leading-6 tracking-tight transition-colors sm:text-base ${
                                isOpen
                                  ? "text-neutral-950"
                                  : "text-neutral-700 group-hover:text-neutral-950"
                              }`}
                            >
                              {faq.question}
                            </span>

                            <span
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-200 ${
                                isOpen
                                  ? "rotate-180 border-neutral-950 bg-neutral-950 text-white"
                                  : "border-neutral-200 text-neutral-600 group-hover:border-neutral-950"
                              }`}
                            >
                              <ChevronDown size={16} />
                            </span>
                          </button>

                          <AnimatePresence initial={false}>
                            {isOpen && (
                              <motion.div
                                id={answerId}
                                key="answer"
                                initial={{
                                  height: 0,
                                  opacity: 0,
                                }}
                                animate={{
                                  height: "auto",
                                  opacity: 1,
                                }}
                                exit={{
                                  height: 0,
                                  opacity: 0,
                                }}
                                transition={{
                                  duration: reduceMotion ? 0 : 0.24,
                                  ease: "easeInOut",
                                }}
                                className="overflow-hidden"
                              >
                                <div className="pb-6 pl-11 pr-3 sm:pl-11 sm:pr-12">
                                  <p className="max-w-2xl text-sm leading-7 text-neutral-600">
                                    {faq.answer}
                                  </p>

                                  <span className="mt-3 inline-flex rounded-full bg-neutral-100 px-3 py-1.5 text-[11px] font-semibold text-neutral-600">
                                    {faq.category}
                                  </span>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center px-5 py-14 text-center"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-100">
                      <Search size={21} className="text-neutral-500" />
                    </div>

                    <h3 className="mt-4 text-base font-semibold">
                      No matching questions
                    </h3>

                    <p className="mt-2 max-w-xs text-sm leading-6 text-neutral-600">
                      Try another keyword or choose a different category.
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        setActiveCategory("All");
                      }}
                      className="mt-5 rounded-full border border-neutral-200 px-4 py-2 text-sm font-semibold transition hover:border-neutral-950"
                    >
                      Clear filters
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Support note */}
            <div className="mt-7 flex items-start gap-3 rounded-2xl bg-neutral-50 p-4 sm:p-5">
              <Clock3
                size={18}
                className="mt-0.5 shrink-0 text-neutral-500"
              />
              <div>
                <p className="text-sm font-semibold">
                  Need help with a specific bus?
                </p>
                <p className="mt-1 text-sm leading-6 text-neutral-600">
                  Confirm bus allocations, changed timings, and pickup
                  details with your college transport coordinator.
                </p>
                <Link
                  href="/#contact"
                  className="mt-3 inline-flex items-center gap-2 text-sm font-semibold hover:underline"
                >
                  Contact & help
                  <ArrowUpRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Footer strip */}
        <div className="flex flex-col gap-3 border-t border-neutral-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-medium tracking-wide text-neutral-500">
            OGI RIDE · ORIENTAL COLLEGE OF TECHNOLOGY
          </p>

          <Link
            href="/#home"
            className="inline-flex w-fit items-center gap-2 text-xs font-semibold text-neutral-700 transition hover:text-neutral-950"
          >
            Back to top
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
