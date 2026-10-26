"use client";

import { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Float,
  Html,
  OrbitControls,
} from "@react-three/drei";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BusFront,
  Check,
  Clock3,
  MapPin,
  Navigation,
  Route,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import * as THREE from "three";

/* ---------------------------------------
   3D BUS MODEL
--------------------------------------- */

function BusModel() {
  const wheelRefs = useRef([]);

  useFrame((_, delta) => {
    wheelRefs.current.forEach((wheel) => {
      if (wheel) wheel.rotation.x += delta * 0.18;
    });
  });

  const wheels = [
    [-0.88, -0.38, 0.52],
    [0.92, -0.38, 0.52],
    [-0.88, -0.38, -0.52],
    [0.92, -0.38, -0.52],
  ];

  return (
    <group scale={1.05}>
      {/* Main chassis */}
      <mesh position={[0, -0.03, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.85, 0.72, 1.08]} />
        <meshPhysicalMaterial
          color="#f5f5f5"
          roughness={0.3}
          metalness={0.08}
          clearcoat={0.5}
        />
      </mesh>

      {/* Upper cabin */}
      <mesh position={[-0.1, 0.48, 0]} castShadow>
        <boxGeometry args={[2.45, 0.76, 0.99]} />
        <meshPhysicalMaterial
          color="#ffffff"
          roughness={0.24}
          metalness={0.04}
          clearcoat={0.7}
        />
      </mesh>

      {/* Front face */}
      <mesh position={[1.14, 0.43, 0]} castShadow>
        <boxGeometry args={[0.08, 0.65, 0.98]} />
        <meshStandardMaterial color="#f4f4f4" />
      </mesh>

      {/* Front windshield */}
      <mesh position={[1.188, 0.52, 0]}>
        <boxGeometry args={[0.018, 0.43, 0.79]} />
        <meshPhysicalMaterial
          color="#171a1e"
          roughness={0.12}
          metalness={0.3}
          clearcoat={0.8}
        />
      </mesh>

      {/* Windshield divider */}
      <mesh position={[1.202, 0.52, 0]}>
        <boxGeometry args={[0.025, 0.43, 0.018]} />
        <meshStandardMaterial color="#a9a9a9" />
      </mesh>

      {/* Side windows */}
      {[-0.78, -0.19, 0.4].map((x) => (
        <mesh key={x} position={[x, 0.53, 0.505]}>
          <boxGeometry args={[0.49, 0.4, 0.025]} />
          <meshPhysicalMaterial
            color="#171a1e"
            roughness={0.13}
            metalness={0.25}
            clearcoat={0.6}
          />
        </mesh>
      ))}

      {/* Opposite windows */}
      {[-0.78, -0.19, 0.4].map((x) => (
        <mesh key={`back-${x}`} position={[x, 0.53, -0.505]}>
          <boxGeometry args={[0.49, 0.4, 0.025]} />
          <meshPhysicalMaterial color="#171a1e" roughness={0.15} />
        </mesh>
      ))}

      {/* Passenger door on visible side */}
      <mesh position={[0.92, 0.1, 0.516]}>
        <boxGeometry args={[0.29, 0.61, 0.025]} />
        <meshStandardMaterial color="#d9d9d9" />
      </mesh>

      {/* Door glass */}
      <mesh position={[0.92, 0.29, 0.535]}>
        <boxGeometry args={[0.23, 0.23, 0.012]} />
        <meshStandardMaterial
          color="#202329"
          metalness={0.25}
          roughness={0.16}
        />
      </mesh>

      {/* Door handle */}
      <mesh position={[1.025, 0.04, 0.535]}>
        <boxGeometry args={[0.025, 0.09, 0.012]} />
        <meshStandardMaterial color="#737373" metalness={0.6} />
      </mesh>

      {/* Lower side accent */}
      <mesh position={[-0.02, -0.13, 0.548]}>
        <boxGeometry args={[1.55, 0.045, 0.012]} />
        <meshStandardMaterial color="#222222" />
      </mesh>

      {/* Front bumper */}
      <mesh position={[1.3, -0.29, 0]}>
        <boxGeometry args={[0.14, 0.13, 0.88]} />
        <meshStandardMaterial color="#202020" metalness={0.45} />
      </mesh>

      {/* Front grille */}
      <mesh position={[1.24, -0.15, 0]}>
        <boxGeometry args={[0.025, 0.09, 0.31]} />
        <meshStandardMaterial color="#292929" metalness={0.35} />
      </mesh>

      {/* Headlights */}
      {[-0.34, 0.34].map((z) => (
        <group key={z}>
          <mesh position={[1.25, -0.07, z]}>
            <boxGeometry args={[0.055, 0.13, 0.18]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#ffffff"
              emissiveIntensity={0.65}
            />
          </mesh>
          <mesh position={[1.28, -0.23, z]}>
            <boxGeometry args={[0.04, 0.035, 0.15]} />
            <meshStandardMaterial color="#a5a5a5" />
          </mesh>
        </group>
      ))}

      {/* Side mirrors */}
      {[-0.39, 0.39].map((z) => (
        <group key={z}>
          <mesh position={[1.13, 0.43, z * 1.45]}>
            <boxGeometry args={[0.18, 0.035, 0.04]} />
            <meshStandardMaterial color="#252525" />
          </mesh>
          <mesh position={[1.21, 0.43, z * 1.45]}>
            <boxGeometry args={[0.09, 0.13, 0.07]} />
            <meshStandardMaterial color="#171717" />
          </mesh>
        </group>
      ))}

      {/* Rear lights */}
      {[-0.36, 0.36].map((z) => (
        <mesh key={z} position={[-1.44, -0.16, z]}>
          <boxGeometry args={[0.035, 0.13, 0.13]} />
          <meshStandardMaterial color="#555555" />
        </mesh>
      ))}

      {/* Wheels and hubs */}
      {wheels.map((position, index) => (
        <group key={index} position={position}>
          <mesh
            ref={(element) => {
              wheelRefs.current[index] = element;
            }}
            rotation={[Math.PI / 2, 0, 0]}
            castShadow
          >
            <cylinderGeometry args={[0.245, 0.245, 0.18, 32]} />
            <meshStandardMaterial color="#151515" roughness={0.72} />
          </mesh>

          <mesh
            position={[0, 0.095, 0]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[0.125, 0.125, 0.19, 24]} />
            <meshStandardMaterial
              color="#c7c7c7"
              metalness={0.75}
              roughness={0.24}
            />
          </mesh>

          <mesh
            position={[0, 0.1, 0]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[0.045, 0.045, 0.2, 20]} />
            <meshStandardMaterial color="#686868" metalness={0.5} />
          </mesh>
        </group>
      ))}

      {/* Roof equipment */}
      <mesh position={[-0.12, 0.88, 0]}>
        <boxGeometry args={[0.65, 0.055, 0.36]} />
        <meshStandardMaterial color="#dedede" roughness={0.45} />
      </mesh>

      {/* Branding panel */}
      <mesh position={[-0.12, 0.05, 0.555]}>
        <boxGeometry args={[0.85, 0.18, 0.02]} />
        <meshStandardMaterial color="#171717" />
      </mesh>

      <Html
        position={[-0.12, 0.05, 0.572]}
        center
        transform
        distanceFactor={4.8}
        style={{
          color: "#ffffff",
          fontSize: "7px",
          fontWeight: 800,
          letterSpacing: "1px",
          whiteSpace: "nowrap",
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        OGI RIDE
      </Html>
    </group>
  );
}

/* ---------------------------------------
   3D SCENE
--------------------------------------- */

function BusScene({ reducedMotion }) {
  const controlsRef = useRef(null);

  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      camera={{ position: [4.2, 2.5, 5.8], fov: 34 }}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={1.25} />
      <hemisphereLight args={["#ffffff", "#bcbcbc", 1.5]} />

      <directionalLight
        position={[4, 7, 5]}
        intensity={2.3}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      <directionalLight position={[-4, 3, -4]} intensity={1.2} />

      <Suspense
        fallback={
          <Html center>
            <div className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-xs text-neutral-500 shadow-sm">
              Preparing your bus...
            </div>
          </Html>
        }
      >
        <Environment preset="city" />

        <Float
          speed={reducedMotion ? 0 : 1.2}
          rotationIntensity={reducedMotion ? 0 : 0.025}
          floatIntensity={reducedMotion ? 0 : 0.13}
        >
          <BusModel />
        </Float>

        {/* Ground platform */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.68, 0]}
          receiveShadow
        >
          <circleGeometry args={[2.35, 80]} />
          <meshStandardMaterial color="#e9e9e9" roughness={0.9} />
        </mesh>

        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.665, 0]}
        >
          <ringGeometry args={[1.94, 1.97, 80]} />
          <meshBasicMaterial color="#b2b2b2" />
        </mesh>

        <ContactShadows
          position={[0, -0.66, 0]}
          opacity={0.32}
          scale={5}
          blur={2.6}
          far={3}
        />
      </Suspense>

      <OrbitControls
        ref={controlsRef}
        makeDefault
        enablePan={false}
        enableZoom={false}
        enableDamping
        dampingFactor={0.08}
        minPolarAngle={Math.PI / 3.5}
        maxPolarAngle={Math.PI / 2.05}
        rotateSpeed={0.55}
        target={[0, 0.05, 0]}
      />
    </Canvas>
  );
}

/* ---------------------------------------
   SECTION CONTENT
--------------------------------------- */

const steps = [
  {
    number: "01",
    title: "Find your route",
    description:
      "Explore available college bus routes and find the one that suits your daily journey.",
    short: "Explore available routes",
    icon: Route,
    label: "ROUTE DISCOVERY",
    cardTitle: "Your route, at a glance",
    cardDescription: "Explore routes and choose the journey that works for you.",
    stat: "Route discovery",
  },
  {
    number: "02",
    title: "Choose your pickup",
    description:
      "Review pickup locations and departure timings before planning your commute.",
    short: "Review pickup points",
    icon: MapPin,
    label: "PICKUP PLANNING",
    cardTitle: "Know where to board",
    cardDescription: "Review your pickup point and understand the planned journey.",
    stat: "Pickup planning",
  },
  {
    number: "03",
    title: "Get ready to ride",
    description:
      "Keep your commute information together so your college journey feels simpler.",
    short: "Prepare for your journey",
    icon: BusFront,
    label: "YOUR DAILY COMMUTE",
    cardTitle: "Start your day prepared",
    cardDescription: "Keep essential bus journey details close at hand.",
    stat: "Journey overview",
  },
];

function Reveal({ children, delay = 0, className = "" }) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);
  const reducedMotion = useReducedMotion();
  const active = steps[activeStep];

  return (
    <section
      id="how-it-works"
      className="relative isolate overflow-hidden bg-white px-5 py-20 text-neutral-950 sm:px-8 sm:py-24 lg:px-14 lg:py-28"
    >
      {/* Background detailing */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.035]"
        style={{
          backgroundImage:
            "radial-gradient(#000 0.7px, transparent 0.7px)",
          backgroundSize: "19px 19px",
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-20 -z-10 h-96 w-96 rounded-full bg-neutral-100 blur-3xl"
      />

      <div className="mx-auto max-w-7xl">
        {/* Section heading */}
        <Reveal className="mb-12 flex flex-col justify-between gap-5 md:mb-16 md:flex-row md:items-end">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-600">
              <Sparkles size={13} />
              Designed around your day
            </div>

            <h2 className="max-w-3xl text-4xl font-semibold leading-[1.06] tracking-[-0.055em] sm:text-5xl lg:text-6xl">
              Your daily commute,
              <span className="block text-neutral-400">
                without the guesswork.
              </span>
            </h2>
          </div>

          <p className="max-w-sm text-sm leading-6 text-neutral-500 sm:text-base">
            A clearer way to understand college bus routes, pickup points and
            journey details — all in one place.
          </p>
        </Reveal>

        <div className="grid items-start gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:gap-12">
          {/* LEFT: STEPS */}
          <div className="relative">
            <Reveal>
              <div className="mb-6 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                  How it works
                </p>
                <span className="text-xs tabular-nums text-neutral-400">
                  0{activeStep + 1} / 03
                </span>
              </div>
            </Reveal>

            <div className="relative space-y-3">
              {/* Vertical timeline */}
              <div
                aria-hidden="true"
                className="absolute bottom-8 left-[25px] top-8 w-px bg-neutral-200"
              />

              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = activeStep === index;

                return (
                  <motion.button
                    key={step.number}
                    type="button"
                    onClick={() => setActiveStep(index)}
                    onMouseEnter={() => setActiveStep(index)}
                    aria-pressed={isActive}
                    whileHover={reducedMotion ? undefined : { x: 3 }}
                    className={`group relative flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition-colors duration-300 sm:gap-5 sm:p-5 ${
                      isActive
                        ? "border-neutral-900 bg-neutral-50 shadow-[0_14px_40px_rgba(0,0,0,0.055)]"
                        : "border-neutral-200 bg-white/80 hover:border-neutral-400"
                    }`}
                  >
                    <span
                      className={`relative z-[1] flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-xl transition-colors duration-300 ${
                        isActive
                          ? "bg-neutral-950 text-white"
                          : "border border-neutral-200 bg-white text-neutral-700 group-hover:border-neutral-400"
                      }`}
                    >
                      <Icon size={21} strokeWidth={1.7} />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="mb-1.5 flex items-center gap-2">
                        <span className="text-[10px] font-bold tracking-[0.16em] text-neutral-400">
                          STEP {step.number}
                        </span>
                        {isActive && (
                          <span className="rounded-full bg-neutral-200 px-2 py-0.5 text-[9px] font-semibold text-neutral-700">
                            ACTIVE
                          </span>
                        )}
                      </span>

                      <span className="block text-base font-semibold tracking-tight sm:text-lg">
                        {step.title}
                      </span>

                      <span className="mt-1.5 block text-sm leading-6 text-neutral-500">
                        {step.description}
                      </span>

                      <span
                        className={`mt-3 inline-flex items-center gap-1.5 text-xs font-semibold transition-colors ${
                          isActive
                            ? "text-neutral-950"
                            : "text-neutral-400 group-hover:text-neutral-700"
                        }`}
                      >
                        {step.short}
                        <ArrowUpRight size={13} />
                      </span>
                    </span>
                  </motion.button>
                );
              })}
            </div>

            <Reveal delay={0.15} className="mt-7">
              <a
                href="/find"
                className="group inline-flex items-center justify-center gap-3 rounded-full bg-neutral-950 px-6 py-4 text-sm font-semibold text-white transition hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2"
              >
                Explore bus routes
                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </a>

              <p className="mt-4 flex items-center gap-2 text-xs leading-5 text-neutral-400">
                <ShieldCheck size={15} />
                Clear information for a more prepared commute.
              </p>
            </Reveal>
          </div>

          {/* RIGHT: 3D BUS EXPERIENCE */}
          <Reveal delay={0.1} className="min-w-0">
            <div className="relative overflow-hidden rounded-[28px] border border-neutral-200 bg-[#f6f6f6] sm:rounded-[34px]">
              {/* Top panel */}
              <div className="relative z-10 flex items-center justify-between gap-3 px-5 pt-5 sm:px-7 sm:pt-7">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-neutral-950" />
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-500">
                      OGI RIDE / EXPERIENCE
                    </span>
                  </div>

                  <h3 className="mt-2 text-lg font-semibold tracking-tight sm:text-xl">
                    Meet your daily ride.
                  </h3>
                </div>

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-white">
                  <BusFront size={18} />
                </div>
              </div>

              {/* 3D viewport */}
              <div className="relative h-[330px] sm:h-[430px]">
                <div className="absolute inset-0">
                  <BusScene reducedMotion={reducedMotion} />
                </div>

                {/* Decorative route line */}
                <svg
                  viewBox="0 0 600 420"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 z-[1] h-full w-full"
                >
                  <motion.path
                    d="M 20 315 C 85 285, 95 230, 175 245 S 255 310, 320 250 S 420 180, 485 220 S 540 260, 585 205"
                    fill="none"
                    stroke="#929292"
                    strokeWidth="1.5"
                    strokeDasharray="4 8"
                    initial={reducedMotion ? false : { pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 0.7 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.8 }}
                  />

                  <circle cx="20" cy="315" r="5" fill="#fff" stroke="#222" strokeWidth="2" />
                  <circle cx="585" cy="205" r="5" fill="#222" stroke="#fff" strokeWidth="2" />
                </svg>

                {/* Route info card */}
                <motion.div
                  key={activeStep}
                  initial={reducedMotion ? false : { opacity: 0, x: -10, y: 6 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute left-4 top-[18%] z-10 w-[150px] rounded-2xl border border-neutral-200 bg-white/95 p-3.5 shadow-[0_12px_32px_rgba(0,0,0,0.07)] backdrop-blur-md sm:left-6 sm:w-[190px] sm:p-4"
                >
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-950 text-white">
                      <active.icon size={14} />
                    </span>
                    <span className="text-[8px] font-bold uppercase tracking-[0.12em] text-neutral-400">
                      {active.label}
                    </span>
                  </div>

                  <p className="mt-3 text-xs font-semibold sm:text-sm">
                    {active.cardTitle}
                  </p>
                  <p className="mt-1.5 text-[10px] leading-4 text-neutral-500 sm:text-xs sm:leading-5">
                    {active.cardDescription}
                  </p>

                  <div className="mt-3 flex items-center gap-1.5 border-t border-neutral-100 pt-3 text-[9px] font-semibold text-neutral-600">
                    <Check size={12} />
                    {active.stat}
                  </div>
                </motion.div>

                {/* Floating destination marker */}
                <motion.div
                  animate={
                    reducedMotion ? undefined : { y: [0, -7, 0] }
                  }
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute right-[8%] top-[17%] z-10 flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-950 text-white shadow-lg sm:right-[14%] sm:h-12 sm:w-12"
                >
                  <MapPin size={19} />
                </motion.div>

                {/* Bottom status card */}
                <motion.div
                  animate={
                    reducedMotion ? undefined : { y: [0, 4, 0] }
                  }
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute bottom-4 right-4 z-10 w-[158px] rounded-2xl border border-neutral-200 bg-white/95 p-3.5 shadow-[0_12px_32px_rgba(0,0,0,0.08)] backdrop-blur-md sm:bottom-6 sm:right-6 sm:w-[200px] sm:p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-950 text-white">
                      <Navigation size={17} />
                    </div>
                    <span className="rounded-full border border-neutral-200 px-2 py-1 text-[8px] font-bold tracking-wider text-neutral-500">
                      YOUR JOURNEY
                    </span>
                  </div>

                  <p className="mt-3 text-xs font-semibold sm:text-sm">
                    A clearer way to travel.
                  </p>
                  <p className="mt-1 text-[10px] leading-4 text-neutral-500 sm:text-xs sm:leading-5">
                    Your route details, made easier to understand.
                  </p>
                </motion.div>

                {/* Interaction hint */}
                <div className="absolute bottom-4 left-4 z-10 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/90 px-3 py-2 text-[8px] font-semibold uppercase tracking-[0.12em] text-neutral-500 backdrop-blur sm:bottom-6 sm:left-6 sm:text-[9px]">
                  <ArrowDownRight size={12} />
                  Drag to explore
                </div>
              </div>

              {/* Scene footer */}
              <div className="relative z-10 flex items-center justify-between gap-3 border-t border-neutral-200 bg-white/80 px-5 py-4 sm:px-7">
                <div>
                  <p className="text-xs font-semibold">Designed for students</p>
                  <p className="mt-1 text-[10px] text-neutral-400">
                    Routes. Stops. Timings.
                  </p>
                </div>

                <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-3 py-2 text-[9px] font-semibold text-neutral-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-neutral-900" />
                  OGI RIDE
                </span>
              </div>
            </div>

            {/* Feature cards */}
            <div className="mt-3 grid grid-cols-3 gap-2 sm:mt-4 sm:gap-3">
              {[
                {
                  icon: Clock3,
                  title: "Timings",
                  description: "Plan ahead",
                },
                {
                  icon: Route,
                  title: "Bus routes",
                  description: "Find your way",
                },
                {
                  icon: Users,
                  title: "Students",
                  description: "Made for campus",
                },
              ].map((feature, index) => {
                const Icon = feature.icon;

                return (
                  <motion.div
                    key={feature.title}
                    whileHover={reducedMotion ? undefined : { y: -3 }}
                    className="rounded-2xl border border-neutral-200 bg-white p-3 transition-colors hover:border-neutral-400 sm:p-4"
                  >
                    <Icon
                      size={18}
                      strokeWidth={1.7}
                      className="text-neutral-700"
                    />
                    <p className="mt-3 text-[11px] font-semibold sm:text-xs">
                      {feature.title}
                    </p>
                    <p className="mt-1 text-[9px] leading-4 text-neutral-400 sm:text-[10px]">
                      {feature.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            <p className="mt-3 text-center text-[10px] text-neutral-400">
              Select a step to explore the experience, or drag the bus to rotate the view.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}