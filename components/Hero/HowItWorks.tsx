
"use client";

import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Html,
  OrbitControls,
  RoundedBox,
} from "@react-three/drei";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BusFront,
  Check,
  Clock3,
  Eye,
  MapPin,
  Navigation,
  Rotate3D,
  Route,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import * as THREE from "three";

/* =========================================================
   OGI RIDE — INTERACTIVE 3D COLLEGE BUS
   Front: +X | Passenger side: +Z
========================================================= */

const C = {
  navy: "#10385F",
  deep: "#071D32",
  blue: "#1675C5",
  blueLight: "#65BDF0",
  yellow: "#FFD43B",
  white: "#F7F9FC",
  glass: "#142C40",
  rubber: "#171A1F",
  silver: "#C9D3DD",
  metal: "#647789",
};

type BusView = "front" | "side" | "rear";

function Panel({
  args,
  position,
  color,
  radius = 0.025,
  metalness = 0.08,
  roughness = 0.3,
  rotation,
}: {
  args: [number, number, number];
  position: [number, number, number];
  color: string;
  radius?: number;
  metalness?: number;
  roughness?: number;
  rotation?: [number, number, number];
}) {
  return (
    <RoundedBox
      args={args}
      position={position}
      rotation={rotation}
      radius={radius}
      smoothness={4}
      castShadow
      receiveShadow
    >
      <meshPhysicalMaterial
        color={color}
        metalness={metalness}
        roughness={roughness}
        clearcoat={0.65}
        clearcoatRoughness={0.22}
      />
    </RoundedBox>
  );
}

/* --------------------- WHEELS --------------------- */

function Wheel({
  position,
  wheelRef,
}: {
  position: [number, number, number];
  wheelRef: (element: THREE.Group | null) => void;
}) {
  const side = position[2] > 0 ? 1 : -1;

  return (
    <group position={position} ref={wheelRef}>
      {/* Main rubber tyre */}
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.255, 0.255, 0.19, 40]} />
        <meshStandardMaterial color={C.rubber} roughness={0.88} />
      </mesh>

      {/* Sidewall */}
      <mesh
        position={[0, 0, side * 0.098]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <cylinderGeometry args={[0.205, 0.205, 0.014, 36]} />
        <meshStandardMaterial color="#292E34" roughness={0.8} />
      </mesh>

      {/* Metallic wheel rim */}
      <mesh
        position={[0, 0, side * 0.11]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <cylinderGeometry args={[0.155, 0.155, 0.028, 40]} />
        <meshStandardMaterial
          color={C.silver}
          metalness={0.85}
          roughness={0.22}
        />
      </mesh>

      {/* Centre hub */}
      <mesh
        position={[0, 0, side * 0.13]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <cylinderGeometry args={[0.067, 0.067, 0.035, 32]} />
        <meshStandardMaterial
          color={C.metal}
          metalness={0.85}
          roughness={0.23}
        />
      </mesh>

      {/* Alloy spokes */}
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2;

        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * 0.105,
              Math.sin(angle) * 0.105,
              side * 0.132,
            ]}
            rotation={[0, 0, angle]}
          >
            <boxGeometry args={[0.022, 0.085, 0.016]} />
            <meshStandardMaterial
              color="#F1F5F9"
              metalness={0.8}
              roughness={0.25}
            />
          </mesh>
        );
      })}

      {/* Lug nuts */}
      {Array.from({ length: 6 }, (_, i) => {
        const angle = (i / 6) * Math.PI * 2;

        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * 0.078,
              Math.sin(angle) * 0.078,
              side * 0.151,
            ]}
          >
            <sphereGeometry args={[0.012, 8, 8]} />
            <meshStandardMaterial
              color="#FFFFFF"
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
        );
      })}

      {/* Tyre tread */}
      {Array.from({ length: 20 }, (_, i) => {
        const angle = (i / 20) * Math.PI * 2;

        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * 0.251,
              Math.sin(angle) * 0.251,
              0,
            ]}
            rotation={[0, 0, angle]}
          >
            <boxGeometry args={[0.037, 0.024, 0.17]} />
            <meshStandardMaterial color="#30343A" roughness={0.95} />
          </mesh>
        );
      })}
    </group>
  );
}

/* --------------------- MAIN BUS BODY --------------------- */

function MainBusShell() {
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();

    shape.moveTo(-1.47, -0.1);
    shape.lineTo(1.30, -0.1);
    shape.lineTo(1.43, 0.12);
    shape.lineTo(1.28, 0.72);
    shape.quadraticCurveTo(1.25, 0.84, 1.1, 0.84);
    shape.lineTo(-1.28, 0.84);
    shape.quadraticCurveTo(-1.47, 0.84, -1.47, 0.66);
    shape.closePath();

    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 1.08,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.025,
      bevelThickness: 0.025,
      curveSegments: 10,
    });

    geo.translate(0, 0, -0.54);
    return geo;
  }, []);

  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <mesh geometry={geometry} castShadow receiveShadow>
      <meshPhysicalMaterial
        color={C.white}
        roughness={0.29}
        metalness={0.06}
        clearcoat={0.8}
        clearcoatRoughness={0.18}
      />
    </mesh>
  );
}

/* --------------------- BUS INTERIOR --------------------- */

function InteriorSeat({
  position,
}: {
  position: [number, number, number];
}) {
  return (
    <group position={position}>
      {/* Seat back */}
      <Panel
        args={[0.095, 0.24, 0.16]}
        position={[-0.035, 0.13, 0]}
        color="#1764A0"
        radius={0.025}
      />

      {/* Seat cushion */}
      <Panel
        args={[0.17, 0.065, 0.16]}
        position={[0.035, 0.025, 0]}
        color="#245B8B"
        radius={0.025}
      />

      {/* Metal support */}
      <Panel
        args={[0.025, 0.12, 0.025]}
        position={[0.035, -0.045, 0]}
        color={C.silver}
        radius={0.005}
        metalness={0.7}
      />
    </group>
  );
}

function OpenBusDoor() {
  const [isDoorOpen, setIsDoorOpen] = useState(false);
  const doorRef = useRef<THREE.Group>(null);

  // Smoothly rotate the door instead of snapping between positions.
  useFrame((_, delta) => {
    if (!doorRef.current) return;

    const targetAngle = isDoorOpen ? -0.85 : 0;
    doorRef.current.rotation.y = THREE.MathUtils.damp(
      doorRef.current.rotation.y,
      targetAngle,
      7,
      delta,
    );
  });

  return (
    <>
      {/* Yellow entrance surround */}
      <Panel
        args={[0.43, 0.72, 0.055]}
        position={[0.99, 0.255, 0.555]}
        color={C.yellow}
        radius={0.025}
      />

      {/* Dark recessed doorway */}
      <Panel
        args={[0.345, 0.625, 0.025]}
        position={[0.99, 0.285, 0.588]}
        color="#07131F"
        radius={0.012}
      />

      {/* Interior floor visible through the entrance */}
      <Panel
        args={[0.36, 0.035, 0.42]}
        position={[0.99, -0.025, 0.35]}
        color="#9CAAB7"
        radius={0.01}
      />

      {/* Interior aisle */}
      <Panel
        args={[0.25, 0.018, 0.48]}
        position={[0.91, 0.0, 0.17]}
        color="#D4DCE4"
        radius={0.008}
      />

      {/* Passenger seats visible through the entrance */}
      <group>
        <InteriorSeat position={[0.78, 0.08, 0.30]} />
        <InteriorSeat position={[0.62, 0.08, 0.08]} />
        <InteriorSeat position={[0.42, 0.08, 0.30]} />
      </group>

      {/* Animated door leaf: closed at first, swings outward when opened */}
      <group ref={doorRef} position={[1.18, 0.30, 0.64]}>
        <Panel
          args={[0.17, 0.57, 0.045]}
          position={[0, 0, 0]}
          color={C.deep}
          radius={0.018}
        />

        {/* Door glass */}
        <Panel
          args={[0.115, 0.45, 0.018]}
          position={[0, 0.015, 0.028]}
          color={C.glass}
          radius={0.012}
          roughness={0.14}
          metalness={0.25}
        />

        {/* Yellow safety edge */}
        <Panel
          args={[0.018, 0.55, 0.02]}
          position={[0.07, 0, 0.04]}
          color={C.yellow}
          radius={0.005}
        />

        {/* Door handle */}
        <Panel
          args={[0.012, 0.10, 0.012]}
          position={[-0.045, -0.02, 0.044]}
          color="#F8FAFC"
          radius={0.004}
          metalness={0.8}
        />
      </group>

      {/* Entrance grab rail */}
      <Panel
        args={[0.018, 0.44, 0.018]}
        position={[1.18, 0.31, 0.62]}
        color="#E9EEF4"
        radius={0.006}
        metalness={0.8}
      />

      {/* Boarding steps */}
      <Panel
        args={[0.48, 0.06, 0.25]}
        position={[0.98, -0.15, 0.66]}
        color="#5D6C7A"
        radius={0.012}
        metalness={0.45}
      />
      <Panel
        args={[0.43, 0.055, 0.20]}
        position={[0.98, -0.205, 0.61]}
        color="#8C9AA7"
        radius={0.012}
        metalness={0.35}
      />

      {/* Safety-yellow step edges */}
      <Panel
        args={[0.44, 0.018, 0.20]}
        position={[0.98, -0.115, 0.67]}
        color={C.yellow}
        radius={0.006}
      />
      <Panel
        args={[0.40, 0.014, 0.17]}
        position={[0.98, -0.175, 0.625]}
        color={C.yellow}
        radius={0.005}
      />

      {/* Interactive control inside the 3D scene */}
      <Html
        position={[1.45, 0.78, 0.72]}
        center
        occlude={false}
        style={{ pointerEvents: "auto", whiteSpace: "nowrap" }}
      >
        <button
          type="button"
          onClick={() => setIsDoorOpen((open) => !open)}
          aria-label={isDoorOpen ? "Close bus gate" : "Open bus gate"}
          className="rounded-full border border-white/70 bg-white px-4 py-2 text-xs font-bold text-[#10385F] shadow-xl transition hover:-translate-y-0.5 hover:bg-[#FFD43B] focus:outline-none focus:ring-2 focus:ring-[#1675C5]"
        >
          {isDoorOpen ? "Close gate" : "Open gate"}
        </button>
      </Html>
    </>
  );
}

/* --------------------- COMPLETE BUS MODEL --------------------- */

function BusModel({
  reducedMotion,
}: {
  reducedMotion: boolean;
}) {
  const wheelRefs = useRef<(THREE.Group | null)[]>([]);

  useFrame((_, delta) => {
    if (reducedMotion) return;

    const step = Math.min(delta, 0.035) * 0.16;

    wheelRefs.current.forEach((wheel) => {
      if (wheel) wheel.rotation.z -= step;
    });
  });

  const wheels: [number, number, number][] = [
    [-0.94, -0.34, 0.555],
    [0.88, -0.34, 0.555],
    [-0.94, -0.34, -0.555],
    [0.88, -0.34, -0.555],
  ];

  const windowXs = [-0.98, -0.43, 0.12, 0.62];

  return (
    <group position={[0, 0.02, 0]} scale={1.03}>
      {/* Chassis */}
      <Panel
        args={[2.9, 0.23, 1.03]}
        position={[-0.02, -0.16, 0]}
        color={C.deep}
        radius={0.055}
      />

      <Panel
        args={[2.65, 0.13, 0.96]}
        position={[-0.05, -0.285, 0]}
        color="#293A4A"
        radius={0.025}
      />

      <MainBusShell />

      {/* Blue body panels and yellow racing stripe */}
      {[-1, 1].map((side) => (
        <group key={`body-stripe-${side}`}>
          <Panel
            args={[2.79, 0.25, 0.035]}
            position={[-0.01, -0.035, side * 0.553]}
            color={C.navy}
            radius={0.02}
          />

          <Panel
            args={[2.72, 0.055, 0.045]}
            position={[-0.015, 0.12, side * 0.56]}
            color={C.yellow}
            radius={0.018}
          />

          <Panel
            args={[2.68, 0.045, 0.035]}
            position={[-0.04, -0.18, side * 0.555]}
            color={C.blue}
            radius={0.015}
          />
        </group>
      ))}

      {/* Front fascia */}
      <Panel
        args={[0.085, 0.33, 0.91]}
        position={[1.43, 0.015, 0]}
        color={C.blue}
        radius={0.035}
      />

      {/* Front bumper */}
      <Panel
        args={[0.17, 0.105, 1.01]}
        position={[1.49, -0.19, 0]}
        color={C.deep}
        radius={0.035}
      />

      <Panel
        args={[0.18, 0.035, 0.88]}
        position={[1.575, -0.16, 0]}
        color={C.yellow}
        radius={0.012}
      />

      {/* Panoramic front windshield */}
      <Panel
        args={[0.045, 0.56, 0.83]}
        position={[1.365, 0.46, 0]}
        rotation={[0, 0, 0.29]}
        color={C.glass}
        radius={0.035}
        metalness={0.32}
        roughness={0.12}
      />

      {/* Windshield centre divider */}
      <Panel
        args={[0.025, 0.55, 0.025]}
        position={[1.443, 0.46, 0]}
        rotation={[0, 0, 0.29]}
        color="#B9C7D5"
        radius={0.008}
      />

      {/* Windshield reflection */}
      <Panel
        args={[0.012, 0.34, 0.035]}
        position={[1.405, 0.49, 0.24]}
        rotation={[0, 0, 0.29]}
        color={C.blueLight}
        radius={0.008}
        roughness={0.16}
        metalness={0.1}
      />

      {/* Front route display */}
      <Panel
        args={[0.04, 0.095, 0.62]}
        position={[1.395, 0.775, 0]}
        rotation={[0, 0, 0.29]}
        color={C.deep}
        radius={0.015}
      />

      <Html
        position={[1.435, 0.78, 0]}
        rotation={[0, 0, 0.29]}
        center
        transform
        distanceFactor={5.3}
        style={{
          color: C.yellow,
          fontSize: "7px",
          fontWeight: 900,
          letterSpacing: "1px",
          whiteSpace: "nowrap",
          pointerEvents: "none",
        }}
      >
        OGI • CAMPUS
      </Html>

      {/* Front grille */}
      <Panel
        args={[0.025, 0.095, 0.32]}
        position={[1.49, -0.095, 0]}
        color="#081A2A"
        radius={0.012}
      />

      {[-0.11, -0.055, 0, 0.055, 0.11].map((z) => (
        <mesh key={z} position={[1.507, -0.095, z]}>
          <boxGeometry args={[0.012, 0.065, 0.012]} />
          <meshStandardMaterial color="#8CA0B3" metalness={0.65} />
        </mesh>
      ))}

      {/* Headlights and indicators */}
      {[-0.385, 0.385].map((z) => (
        <group key={`headlight-${z}`}>
          <Panel
            args={[0.045, 0.12, 0.19]}
            position={[1.49, 0.025, z]}
            color="#E7EDF4"
            radius={0.025}
          />

          <mesh position={[1.518, 0.025, z]}>
            <boxGeometry args={[0.014, 0.075, 0.13]} />
            <meshStandardMaterial
              color="#FFFFFF"
              emissive="#FFF0C4"
              emissiveIntensity={0.85}
              roughness={0.18}
            />
          </mesh>

          <Panel
            args={[0.035, 0.035, 0.14]}
            position={[1.49, -0.065, z]}
            color={C.yellow}
            radius={0.012}
          />
        </group>
      ))}

      {/* Registration plate */}
      <Panel
        args={[0.025, 0.055, 0.26]}
        position={[1.515, -0.17, 0]}
        color="#FFFFFF"
        radius={0.008}
      />

      <Html
        position={[1.533, -0.17, 0]}
        center
        transform
        distanceFactor={5}
        style={{
          color: C.deep,
          fontSize: "5px",
          fontWeight: 900,
          whiteSpace: "nowrap",
          pointerEvents: "none",
        }}
      >
        OGI 01
      </Html>

      {/* Side windows */}
      {[-1, 1].map((side) => (
        <group key={`windows-${side}`}>
          {windowXs.map((x, index) => (
            <group key={x}>
              <Panel
                args={[0.47, 0.39, 0.025]}
                position={[x, 0.48, side * 0.548]}
                color={C.glass}
                radius={0.025}
                roughness={0.13}
                metalness={0.22}
              />

              <mesh
                position={[x - 0.11, 0.49, side * 0.565]}
                rotation={[0, 0, -0.17]}
              >
                <planeGeometry args={[0.025, 0.27]} />
                <meshBasicMaterial
                  color="#A5E2FF"
                  transparent
                  opacity={0.45}
                  side={THREE.DoubleSide}
                />
              </mesh>

              {index < windowXs.length - 1 && (
                <Panel
                  args={[0.035, 0.43, 0.035]}
                  position={[x + 0.255, 0.48, side * 0.552]}
                  color={C.white}
                  radius={0.008}
                />
              )}
            </group>
          ))}
        </group>
      ))}

      {/* OPEN PASSENGER DOOR + INTERIOR */}
      <OpenBusDoor />

      {/* Wheel arches */}
      {[-1, 1].map((side) => (
        <group key={`arches-${side}`}>
          {[-0.94, 0.88].map((x) => (
            <group key={x}>
              <mesh position={[x, -0.34, side * 0.559]}>
                <torusGeometry args={[0.273, 0.035, 10, 48, Math.PI]} />
                <meshStandardMaterial color={C.deep} roughness={0.7} />
              </mesh>

              <mesh position={[x, -0.34, side * 0.562]}>
                <torusGeometry args={[0.288, 0.012, 8, 48, Math.PI]} />
                <meshStandardMaterial
                  color={C.yellow}
                  metalness={0.15}
                  roughness={0.35}
                />
              </mesh>
            </group>
          ))}
        </group>
      ))}

      {/* Wheels */}
      {wheels.map((position, index) => (
        <Wheel
          key={index}
          position={position}
          wheelRef={(element) => {
            wheelRefs.current[index] = element;
          }}
        />
      ))}

      {/* Side mirrors */}
      {[-1, 1].map((side) => (
        <group key={`mirrors-${side}`}>
          <Panel
            args={[0.19, 0.035, 0.035]}
            position={[1.28, 0.53, side * 0.59]}
            color={C.deep}
            radius={0.012}
          />

          <Panel
            args={[0.14, 0.15, 0.075]}
            position={[1.33, 0.51, side * 0.67]}
            color={C.deep}
            radius={0.025}
          />

          <Panel
            args={[0.014, 0.09, 0.008]}
            position={[1.36, 0.52, side * 0.711]}
            color={C.blueLight}
            radius={0.004}
          />
        </group>
      ))}

      {/* Rear panel */}
      <Panel
        args={[0.065, 0.68, 0.91]}
        position={[-1.465, 0.16, 0]}
        color={C.navy}
        radius={0.025}
      />

      <Panel
        args={[0.07, 0.12, 0.58]}
        position={[-1.505, 0.48, 0]}
        color={C.deep}
        radius={0.018}
      />

      <Html
        position={[-1.548, 0.48, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        center
        transform
        distanceFactor={5}
        style={{
          color: C.yellow,
          fontSize: "6px",
          fontWeight: 900,
          letterSpacing: "0.8px",
          whiteSpace: "nowrap",
          pointerEvents: "none",
        }}
      >
        OGI RIDE
      </Html>

      {/* Rear tail lights */}
      {[-0.37, 0.37].map((z) => (
        <group key={`tail-${z}`}>
          <Panel
            args={[0.035, 0.18, 0.13]}
            position={[-1.51, 0.08, z]}
            color="#9D202A"
            radius={0.018}
          />

          <Panel
            args={[0.045, 0.05, 0.1]}
            position={[-1.53, 0.12, z]}
            color="#FF514D"
            radius={0.01}
          />

          <Panel
            args={[0.045, 0.035, 0.1]}
            position={[-1.53, 0.025, z]}
            color={C.yellow}
            radius={0.008}
          />
        </group>
      ))}

      {/* Rear bumper */}
      <Panel
        args={[0.12, 0.09, 1.0]}
        position={[-1.51, -0.19, 0]}
        color="#263746"
        radius={0.025}
      />

      {/* Roof-mounted air conditioning unit */}
      <Panel
        args={[0.7, 0.11, 0.45]}
        position={[-0.18, 0.89, 0]}
        color="#D9E1E9"
        radius={0.04}
      />

      <Panel
        args={[0.53, 0.035, 0.3]}
        position={[-0.18, 0.96, 0]}
        color="#AAB8C6"
        radius={0.018}
      />

      {/* Roof marker lights */}
      {[-0.36, 0, 0.36].map((z) => (
        <mesh key={z} position={[1.36, 0.77, z]}>
          <boxGeometry args={[0.04, 0.04, 0.08]} />
          <meshStandardMaterial
            color={C.yellow}
            emissive={C.yellow}
            emissiveIntensity={0.35}
          />
        </mesh>
      ))}

      {/* OGI RIDE side branding */}
      <Panel
        args={[0.78, 0.16, 0.035]}
        position={[-0.12, 0.13, 0.566]}
        color={C.deep}
        radius={0.018}
      />

      <Html
        position={[-0.12, 0.13, 0.589]}
        center
        transform
        distanceFactor={4.5}
        style={{
          color: "#FFFFFF",
          fontSize: "8px",
          fontWeight: 900,
          letterSpacing: "1.4px",
          whiteSpace: "nowrap",
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        OGI RIDE
      </Html>

      <Panel
        args={[0.32, 0.075, 0.035]}
        position={[-1.05, 0.13, 0.566]}
        color={C.yellow}
        radius={0.012}
      />

      <Html
        position={[-1.05, 0.13, 0.589]}
        center
        transform
        distanceFactor={4.5}
        style={{
          color: C.deep,
          fontSize: "5px",
          fontWeight: 900,
          letterSpacing: "0.5px",
          whiteSpace: "nowrap",
          pointerEvents: "none",
        }}
      >
        CAMPUS BUS
      </Html>
    </group>
  );
}

/* --------------------- CAMERA CONTROLS --------------------- */

function CameraDirector({ view }: { view: BusView }) {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    const positions: Record<BusView, [number, number, number]> = {
      front: [4.8, 2.45, 5.7],
      side: [0.05, 2.3, 7.5],
      rear: [-5.0, 2.45, 5.3],
    };

    camera.position.set(...positions[view]);
    camera.lookAt(0, 0.15, 0);

    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0.15, 0);
      controlsRef.current.update();
    }
  }, [camera, view]);

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enablePan={false}
      enableZoom
      minDistance={4.5}
      maxDistance={9}
      enableDamping
      dampingFactor={0.075}
      rotateSpeed={0.65}
      zoomSpeed={0.7}
      minPolarAngle={Math.PI / 3.4}
      maxPolarAngle={Math.PI / 1.95}
      target={[0, 0.15, 0]}
    />
  );
}

/* --------------------- THREE.JS SCENE --------------------- */

function BusScene({
  reducedMotion,
  view,
}: {
  reducedMotion: boolean;
  view: BusView;
}) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      camera={{
        position: [4.8, 2.45, 5.7],
        fov: 34,
        near: 0.1,
        far: 100,
      }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.12;
      }}
      style={{ width: "100%", height: "100%", touchAction: "pan-y" }}
    >
      <color attach="background" args={["#EDF2F7"]} />

      <ambientLight intensity={1.0} />

      <hemisphereLight
        args={["#FFFFFF", "#A9B8C9", 1.5]}
        position={[0, 6, 0]}
      />

      <directionalLight
        position={[4, 7, 5]}
        intensity={2.4}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
        shadow-bias={-0.00015}
      />

      <directionalLight
        position={[-4, 3, -4]}
        intensity={1.4}
        color="#D9E9FF"
      />

      <pointLight
        position={[3, 2.5, 4]}
        intensity={20}
        distance={11}
        decay={2}
        color="#FFFFFF"
      />

      <Suspense
        fallback={
          <Html center>
            <div className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-xs text-neutral-500 shadow">
              Preparing the bus…
            </div>
          </Html>
        }
      >
        <Environment preset="city" />

        <BusModel reducedMotion={reducedMotion} />

        {/* Showroom floor */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.63, 0]}
          receiveShadow
        >
          <circleGeometry args={[3.5, 96]} />
          <meshStandardMaterial color="#E3E9EF" roughness={0.92} />
        </mesh>

        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.615, 0]}
        >
          <ringGeometry args={[2.3, 2.32, 96]} />
          <meshBasicMaterial color="#C2CED9" />
        </mesh>

        <ContactShadows
          position={[0, -0.61, 0]}
          opacity={0.42}
          scale={5.5}
          blur={2.6}
          far={3.5}
          resolution={512}
          color="#20364C"
        />
      </Suspense>

      <CameraDirector view={view} />
    </Canvas>
  );
}

/* =========================================================
   HOW IT WORKS — SECTION CONTENT
========================================================= */

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
    cardDescription:
      "Explore routes and choose the journey that works for you.",
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
    cardDescription:
      "Review your pickup point and understand the planned journey.",
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
    cardDescription:
      "Keep essential bus journey details close at hand.",
    stat: "Journey overview",
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
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.55, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);
  const [busView, setBusView] = useState<BusView>("front");

  const reducedMotion = useReducedMotion();
  const active = steps[activeStep];
  const ActiveIcon = active.icon;

  const views: { id: BusView; label: string }[] = [
    { id: "front", label: "Front" },
    { id: "side", label: "Side" },
    { id: "rear", label: "Rear" },
  ];

  const features = [
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
  ];

  return (
    <section
      id="how-it-works"
      className="relative isolate overflow-hidden bg-white px-5 py-20 text-neutral-950 sm:px-8 sm:py-24 lg:px-14 lg:py-28"
    >
      {/* Subtle background texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.035]"
        style={{
          backgroundImage: "radial-gradient(#000 0.7px, transparent 0.7px)",
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
          {/* LEFT COLUMN */}
          <div>
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
                          ? "bg-[#10385F] text-white"
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
                          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[9px] font-semibold text-blue-900">
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
                        className={`mt-3 inline-flex items-center gap-1.5 text-xs font-semibold ${
                          isActive
                            ? "text-[#10385F]"
                            : "text-neutral-400 group-hover:text-neutral-700"
                        }`}
                      >
                        {step.short}
                        <ArrowRight size={13} />
                      </span>
                    </span>
                  </motion.button>
                );
              })}
            </div>

            <Reveal delay={0.15} className="mt-7">
              <a
                href="/find"
                className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#10385F] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#0A2947] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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

          {/* RIGHT COLUMN — INTERACTIVE 3D BUS */}
          <Reveal delay={0.1} className="min-w-0">
            <div className="relative overflow-hidden rounded-[28px] border border-neutral-200 bg-[#EDF2F7] sm:rounded-[34px]">
              {/* Model header */}
              <div className="relative z-10 flex items-center justify-between gap-3 px-5 pt-5 sm:px-7 sm:pt-7">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-700" />
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-500">
                      OGI RIDE / INTERACTIVE 3D
                    </span>
                  </div>

                  <h3 className="mt-2 text-lg font-semibold tracking-tight sm:text-xl">
                    Meet your daily ride.
                  </h3>

                  <p className="mt-1 text-xs text-neutral-500">
                    Open entrance. Explore the bus from every angle.
                  </p>
                </div>

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-white text-[#10385F]">
                  <BusFront size={18} />
                </div>
              </div>

              {/* Camera view selector */}
              <div className="relative z-20 mx-5 mt-5 flex flex-wrap items-center justify-between gap-3 sm:mx-7">
                <div className="inline-flex rounded-full border border-neutral-200 bg-white/90 p-1 shadow-sm">
                  {views.map((view) => (
                    <button
                      key={view.id}
                      type="button"
                      onClick={() => setBusView(view.id)}
                      aria-pressed={busView === view.id}
                      className={`rounded-full px-3.5 py-2 text-xs font-semibold transition sm:px-4 ${
                        busView === view.id
                          ? "bg-[#10385F] text-white shadow-sm"
                          : "text-neutral-600 hover:bg-neutral-100"
                      }`}
                    >
                      {view.label}
                    </button>
                  ))}
                </div>

                <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-neutral-500">
                  <Rotate3D size={13} />
                  Drag to rotate
                </span>
              </div>

              {/* Three.js viewport */}
              <div className="relative h-[330px] sm:h-[430px]">
                <div className="absolute inset-0">
                  <BusScene
                    reducedMotion={Boolean(reducedMotion)}
                    view={busView}
                  />
                </div>

                {/* Active step information */}
                <motion.div
                  key={activeStep}
                  initial={reducedMotion ? false : { opacity: 0, x: -8, y: 5 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="absolute left-3 top-4 z-10 w-[142px] rounded-2xl border border-white/80 bg-white/95 p-3 shadow-lg backdrop-blur sm:left-5 sm:top-6 sm:w-[185px] sm:p-4"
                >
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#10385F] text-white">
                      <ActiveIcon size={14} />
                    </span>

                    <span className="text-[8px] font-bold uppercase tracking-[0.1em] text-neutral-400">
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

                {/* Floating map marker */}
                <motion.div
                  animate={reducedMotion ? undefined : { y: [0, -6, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute right-[7%] top-[13%] z-10 flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFD43B] text-[#10385F] shadow-lg sm:right-[12%] sm:top-[15%] sm:h-12 sm:w-12"
                >
                  <MapPin size={19} />
                </motion.div>

                {/* Journey information */}
                <motion.div
                  animate={reducedMotion ? undefined : { y: [0, 4, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute bottom-4 right-3 z-10 w-[145px] rounded-2xl border border-white/80 bg-white/95 p-3 shadow-lg backdrop-blur sm:bottom-6 sm:right-5 sm:w-[190px] sm:p-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#10385F] text-white sm:h-9 sm:w-9">
                      <Navigation size={16} />
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

                {/* Current camera view */}
                <div className="absolute bottom-4 left-3 z-10 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/90 px-3 py-2 text-[9px] font-semibold text-neutral-600 shadow-sm backdrop-blur sm:bottom-6 sm:left-5">
                  <Eye size={13} />
                  {busView === "front"
                    ? "FRONT VIEW"
                    : busView === "side"
                      ? "SIDE VIEW"
                      : "REAR VIEW"}
                </div>
              </div>

              {/* Viewport footer */}
              <div className="relative z-10 flex items-center justify-between gap-3 border-t border-neutral-200 bg-white/90 px-5 py-4 sm:px-7">
                <div>
                  <p className="text-xs font-semibold">Designed for students</p>
                  <p className="mt-1 text-[10px] text-neutral-400">
                    Routes. Stops. Timings.
                  </p>
                </div>

                <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-3 py-2 text-[9px] font-semibold text-neutral-600">
                  <span className="h-2 w-2 rounded-full bg-[#FFD43B]" />
                  OGI RIDE
                </span>
              </div>
            </div>

            {/* Feature cards */}
            <div className="mt-3 grid grid-cols-3 gap-2 sm:mt-4 sm:gap-3">
              {features.map((feature) => {
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
                      className="text-[#10385F]"
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
              Switch views or drag the bus to inspect the model.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
