"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BusFront,
  ChevronDown,
  CircleHelp,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
} from "lucide-react";

const helpItems = [
  {
    question: "How do I find my assigned bus?",
    answer:
      "Sign in to your student account to view your assigned bus, pickup stop, route information, and available schedule details.",
  },
  {
    question: "Can I track my bus in real time?",
    answer:
      "Live location is available only when the bus tracking device or an authorized location-sharing service is connected and reporting data.",
  },
  {
    question: "What if my bus or pickup stop is incorrect?",
    answer:
      "Contact your college transport administrator or support team to verify your student details and correct your bus assignment.",
  },
  {
    question: "I cannot sign in. What should I do?",
    answer:
      "Check that you are using your registered credentials. If the issue continues, contact the support team or your college administrator.",
  },
];

const supportOptions = [
  {
    icon: BusFront,
    title: "Bus & route assistance",
    description: "Get help with bus assignments, stops, and schedules.",
    action: "Explore routes",
    href: "/#routes",
  },
  {
    icon: CircleHelp,
    title: "Account support",
    description: "Get help with student access and account issues.",
    action: "Sign in",
    href: "/login",
  },
  {
    icon: MessageCircle,
    title: "College transport help",
    description: "For route corrections and transport-related questions.",
    action: "View FAQs",
    href: "#contact-faq",
  },
];

function Reveal({ children, delay = 0, className = "" }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: reduceMotion ? 0 : 0.55,
        delay: reduceMotion ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

export default function ContactHelp() {
  const [activeFaq, setActiveFaq] = useState(0);

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative overflow-hidden bg-white px-5 py-20 text-neutral-950 sm:px-8 sm:py-28 lg:px-12"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section heading */}
        <Reveal>
          <div className="mb-12 flex flex-col gap-5 sm:mb-16 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-600">
                <span className="h-1.5 w-1.5 rounded-full bg-neutral-950" />
                Contact & support
              </span>

              <h2
                id="contact-heading"
                className="mt-6 text-4xl font-semibold leading-[1.08] tracking-[-0.055em] sm:text-5xl lg:text-6xl"
              >
                Need a hand?
                <br />
                <span className="text-neutral-400">
                  We’ll help you get there.
                </span>
              </h2>
            </div>

            <p className="max-w-md text-sm leading-7 text-neutral-600 sm:text-base">
              From finding your assigned bus to understanding your route,
              get clear answers and know where to go next.
            </p>
          </div>
        </Reveal>

        {/* Support cards */}
        <div className="grid gap-4 md:grid-cols-3">
          {supportOptions.map((item, index) => {
            const Icon = item.icon;

            return (
              <Reveal key={item.title} delay={index * 0.08}>
                <motion.article
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="group flex h-full flex-col rounded-3xl border border-neutral-200 bg-white p-6 transition-colors duration-300 hover:border-neutral-400 sm:p-7"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-100 transition-colors group-hover:bg-neutral-950 group-hover:text-white">
                    <Icon size={21} strokeWidth={1.8} />
                  </div>

                  <h3 className="mt-7 text-lg font-semibold tracking-tight">
                    {item.title}
                  </h3>

                  <p className="mt-3 flex-1 text-sm leading-6 text-neutral-600">
                    {item.description}
                  </p>

                  <a
                    href={item.href}
                    className="mt-7 inline-flex w-fit items-center gap-2 text-sm font-semibold transition-all hover:gap-3"
                  >
                    {item.action}
                    <ArrowUpRight size={16} />
                  </a>
                </motion.article>
              </Reveal>
            );
          })}
        </div>

        {/* Contact details and FAQs */}
        <div className="mt-16 grid gap-8 lg:mt-20 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl bg-neutral-950 p-7 text-white sm:p-9 lg:p-10">
              <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full border border-white/10" />
              <div className="absolute -right-7 -top-7 h-32 w-32 rounded-full border border-white/10" />

              <div className="relative">
                <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-neutral-400">
                  <ShieldCheck size={16} />
                  Here to help
                </span>

                <h3 className="mt-6 max-w-sm text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-4xl">
                  Every journey starts with clarity.
                </h3>

                <p className="mt-4 max-w-sm text-sm leading-7 text-neutral-400">
                  For transport-specific questions, your college transport
                  administrator is the best place to start.
                </p>

                <div className="mt-9 space-y-5 border-t border-white/15 pt-7">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">College transport</p>
                      <p className="mt-1 text-sm leading-6 text-neutral-400">
                        Oriental College of Technology, Bhopal
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                      <Clock3 size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Support availability</p>
                      <p className="mt-1 text-sm leading-6 text-neutral-400">
                        Contact your college transport office for current
                        support hours.
                      </p>
                    </div>
                  </div>
                </div>

                <a
                  href="/#routes"
                  className="mt-9 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-neutral-950 transition-colors hover:bg-neutral-200"
                >
                  Explore bus routes
                  <ArrowRight size={16} />
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div id="contact-faq" className="scroll-mt-24">
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                  Quick answers
                </p>
                <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">
                  Frequently asked questions
                </h3>
              </div>

              <div className="divide-y divide-neutral-200 border-y border-neutral-200">
                {helpItems.map((item, index) => {
                  const isOpen = activeFaq === index;
                  const answerId = `contact-answer-${index}`;

                  return (
                    <div key={item.question}>
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={answerId}
                        onClick={() =>
                          setActiveFaq(isOpen ? -1 : index)
                        }
                        className="flex w-full items-center justify-between gap-5 py-5 text-left"
                      >
                        <span className="text-sm font-semibold leading-6 sm:text-base">
                          {item.question}
                        </span>

                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-neutral-200 transition-all duration-200 ${
                            isOpen
                              ? "rotate-180 bg-neutral-950 text-white"
                              : "bg-white text-neutral-700"
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
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.24 }}
                            className="overflow-hidden"
                          >
                            <p className="max-w-xl pb-5 pr-8 text-sm leading-7 text-neutral-600">
                              {item.answer}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

              <div className="mt-7 flex items-start gap-3 rounded-2xl bg-neutral-50 p-4 sm:p-5">
                <Mail
                  size={19}
                  className="mt-0.5 shrink-0 text-neutral-500"
                />
                <div>
                  <p className="text-sm font-semibold">
                    Still need assistance?
                  </p>
                  <p className="mt-1 text-sm leading-6 text-neutral-600">
                    Contact your college transport office or administrator.
                    Add verified support contact details here when available.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal>
          <div className="mt-12 flex flex-col gap-3 border-t border-neutral-200 pt-6 text-xs leading-6 text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
            <p>OGI RIDE · College transport, made simpler.</p>
            <a
              href="/login"
              className="inline-flex w-fit items-center gap-2 font-semibold text-neutral-900 hover:underline"
            >
              Go to student sign in
              <ArrowDownRight size={15} />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
