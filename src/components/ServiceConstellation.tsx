import { Environment, Html, OrbitControls, Sphere } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

import { services, type ServiceDef } from "@/config/site";
import { useReducedMotion } from "@/lib/motion";

type CardPosition = {
  position: [number, number, number];
  rotationZ: number;
};

function useCardPositions() {
  return useMemo<CardPosition[]>(() => {
    const mobile = typeof window !== "undefined" && window.innerWidth < 768;
    if (mobile) {
      return [
        { position: [-1.05, 1.65, -4.8], rotationZ: -0.045 },
        { position: [1.05, 0.85, -6.2], rotationZ: 0.04 },
        { position: [-1.1, -0.15, -7.3], rotationZ: 0.03 },
        { position: [1.0, -1.2, -5.5], rotationZ: -0.04 },
        { position: [0, -2.05, -8.2], rotationZ: 0.015 },
      ];
    }

    return [
      { position: [-2.8, 1.75, -5.1], rotationZ: -0.055 },
      { position: [2.7, 1.65, -6.6], rotationZ: 0.045 },
      { position: [-3.15, -1.25, -7.4], rotationZ: 0.035 },
      { position: [3.0, -1.35, -5.7], rotationZ: -0.045 },
      { position: [0.15, 2.8, -8.7], rotationZ: 0.018 },
    ];
  }, []);
}

function Starfield({ reduced }: { reduced: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const geometry = useMemo(() => {
    const mobile = typeof window !== "undefined" && window.innerWidth < 768;
    const count = reduced ? 2600 : mobile ? 5200 : 9800;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const theta = i * 2.399963229728653;
      const radius = 7 + ((i * 37) % 1000) / 25;
      const spreadY = (((i * 91) % 1000) / 1000 - 0.5) * 32;
      positions[i * 3] = Math.cos(theta) * radius;
      positions[i * 3 + 1] = spreadY;
      positions[i * 3 + 2] = Math.sin(theta) * radius - 3;
    }

    const next = new THREE.BufferGeometry();
    next.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return next;
  }, [reduced]);

  useFrame((_, delta) => {
    if (!ref.current || reduced) return;
    ref.current.rotation.y += delta * 0.0035;
    ref.current.rotation.x += delta * 0.0008;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial color="#e9fbff" size={0.055} transparent opacity={0.74} sizeAttenuation />
    </points>
  );
}

function AmbientFragments({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const fragments = useMemo(
    () =>
      Array.from({ length: reduced ? 7 : 18 }, (_, i) => ({
        position: [
          Math.sin(i * 2.31) * (4.6 + (i % 3) * 1.65),
          Math.cos(i * 1.73) * (2.1 + (i % 4) * 0.72),
          -4.8 - (i % 7) * 1.45,
        ] as [number, number, number],
        scale: 0.12 + (i % 4) * 0.05,
      })),
    [reduced],
  );

  useFrame((_, delta) => {
    if (!group.current || reduced) return;
    group.current.rotation.z += delta * 0.003;
    group.current.rotation.y -= delta * 0.0015;
  });

  return (
    <group ref={group}>
      {fragments.map((fragment, index) => (
        <mesh key={index} position={fragment.position} rotation={[0.4, index * 0.7, index * 0.2]} scale={fragment.scale}>
          <octahedronGeometry args={[1, 0]} />
          <meshBasicMaterial color={index % 3 === 0 ? "#7ad9ff" : index % 3 === 1 ? "#89ffd0" : "#a8a0ff"} wireframe transparent opacity={0.25} />
        </mesh>
      ))}
    </group>
  );
}

function FloatingServiceCard({ service, index, cardPosition, reduced }: {
  service: ServiceDef;
  index: number;
  cardPosition: CardPosition;
  reduced: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const tilt = (cardPosition.rotationZ * 180) / Math.PI;

  useFrame(({ clock }) => {
    if (!groupRef.current || reduced) return;
    groupRef.current.position.y = cardPosition.position[1] + Math.sin(clock.elapsedTime * 0.55 + index * 1.13) * 0.13;
    groupRef.current.position.x = cardPosition.position[0] + Math.cos(clock.elapsedTime * 0.31 + index) * 0.055;
  });

  return (
    <group ref={groupRef} position={cardPosition.position}>
      <Html
        center
        position={[0, 0, 0]}
        zIndexRange={[18, 2]}
        style={{ pointerEvents: "auto", userSelect: "none", WebkitUserSelect: "none" }}
      >
        <Link
          to={service.path}
          {...(service.hash ? { hash: service.hash } : {})}
          draggable={false}
          onClick={(event) => event.stopPropagation()}
          onDragStart={(event) => event.preventDefault()}
          onPointerDown={(event) => event.stopPropagation()}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          className="block w-[164px] select-none overflow-hidden rounded-[16px] border bg-[#071018]/96 p-2.5 text-white shadow-2xl backdrop-blur-xl sm:w-[184px] sm:p-3"
          style={{
            borderColor: `${service.accent}${hovered ? "cc" : "55"}`,
            boxShadow: hovered ? `0 22px 55px ${service.accent}35, inset 0 0 26px ${service.accent}12` : "0 18px 45px rgba(0,0,0,.48)",
            transform: `rotate(${tilt}deg) scale(${hovered ? 1.045 : 1})`,
            transition: "transform .22s ease, border-color .22s ease, box-shadow .22s ease",
            touchAction: "pan-y",
            WebkitTapHighlightColor: "transparent",
          }}
        >
          <div
            className="relative h-[76px] overflow-hidden rounded-[11px] border border-white/8 bg-white/[.025] sm:h-[88px]"
            style={{ background: `radial-gradient(circle at 50% 55%, ${service.accent}32, transparent 62%), #03080d` }}
          >
            <span className="absolute left-1/2 top-1/2 h-[52px] w-[52px] -translate-x-1/2 -translate-y-1/2 rounded-full border sm:h-[58px] sm:w-[58px]" style={{ borderColor: `${service.accent}88` }} />
            <span className="absolute left-1/2 top-1/2 h-[34px] w-[72px] -translate-x-1/2 -translate-y-1/2 rotate-[-22deg] rounded-full border border-dashed sm:h-[38px] sm:w-[80px]" style={{ borderColor: `${service.accent}66` }} />
            <span className="absolute left-1/2 top-1/2 grid h-8 w-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full font-mono text-[9px] font-semibold sm:h-9 sm:w-9 sm:text-[10px]" style={{ background: service.accent, color: "#031018", boxShadow: `0 0 24px ${service.accent}88` }}>
              0{index + 1}
            </span>
            <span className="absolute inset-x-0 top-1/2 h-px opacity-50" style={{ background: `linear-gradient(90deg, transparent, ${service.accent}, transparent)` }} />
          </div>
          <div className="px-1 pb-1 pt-2.5">
            <small className="block font-mono text-[7px] uppercase tracking-[.16em]" style={{ color: service.accent }}>{service.label}</small>
            <strong className="mt-1.5 block text-[12px] font-medium leading-tight sm:text-[13px]">{service.title}</strong>
            <span className="mt-2 flex items-center gap-1 font-mono text-[7px] uppercase tracking-[.13em] text-white/50">
              abrir área <ArrowUpRight size={9} />
            </span>
          </div>
        </Link>
      </Html>
    </group>
  );
}

function GalaxyScene({ reduced, allowCameraDrag }: { reduced: boolean; allowCameraDrag: boolean }) {
  const positions = useCardPositions();

  return (
    <>
      <color attach="background" args={["#010306"]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[6, 7, 1]} intensity={28} color="#6fd8ff" distance={30} />
      <pointLight position={[-7, -5, -2]} intensity={20} color="#72ddb8" distance={30} />
      <Environment preset="night" />
      <Starfield reduced={reduced} />
      <AmbientFragments reduced={reduced} />

      <Sphere args={[5.3, 48, 48]} position={[0, 0, -5.5]}>
        <meshBasicMaterial color="#59c9df" transparent opacity={0.04} wireframe />
      </Sphere>
      <Sphere args={[8.6, 48, 48]} position={[0, 0, -5.9]}>
        <meshBasicMaterial color="#4da5c7" transparent opacity={0.018} wireframe />
      </Sphere>

      {services.map((service, index) => (
        <FloatingServiceCard key={service.key} service={service} index={index} cardPosition={positions[index]!} reduced={reduced} />
      ))}

      {allowCameraDrag ? (
        <OrbitControls
          enableRotate
          enablePan={false}
          enableZoom={false}
          autoRotate={false}
          rotateSpeed={0.42}
          target={[0, 0, -5.8]}
          minPolarAngle={0.62}
          maxPolarAngle={2.5}
        />
      ) : null}
    </>
  );
}

export function ServiceConstellation() {
  const reduced = useReducedMotion();
  const [coarsePointer, setCoarsePointer] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(pointer: coarse)");
    const update = () => setCoarsePointer(query.matches);
    update();
    query.addEventListener?.("change", update);
    return () => query.removeEventListener?.("change", update);
  }, []);

  return (
    <div className="relative isolate h-[650px] w-full select-none overflow-hidden sm:h-[730px] lg:h-[790px]">
      <Canvas
        camera={{ position: [0, 0.05, 1.2], fov: 60, near: 0.08, far: 120 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        style={{
          userSelect: "none",
          WebkitUserSelect: "none",
          touchAction: coarsePointer ? "pan-y" : "none",
          pointerEvents: coarsePointer ? "none" : "auto",
        }}
      >
        <Suspense fallback={null}>
          <GalaxyScene reduced={reduced} allowCameraDrag={!coarsePointer} />
        </Suspense>
      </Canvas>

      <div className="pointer-events-none absolute left-5 top-5 z-10 sm:left-8 sm:top-8">
        <p className="font-mono text-[9px] tracking-[0.2em] text-white/55 uppercase">
          {coarsePointer ? "serviços · toque no card para abrir" : "serviços · arraste para explorar"}
        </p>
      </div>
      <div className="pointer-events-none absolute inset-x-5 bottom-5 z-10 flex justify-center sm:justify-end sm:px-3">
        <span className="rounded-full border border-white/10 bg-black/35 px-3 py-1.5 font-mono text-[8px] tracking-[0.15em] text-white/45 uppercase backdrop-blur-md">
          {coarsePointer ? "role normalmente · toque no serviço" : "arraste para olhar · clique no card · zoom bloqueado"}
        </span>
      </div>
    </div>
  );
}
