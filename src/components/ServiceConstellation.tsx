import { Environment, Html, OrbitControls, Plane, Sphere } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useNavigate } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Suspense, useMemo, useRef, useState } from "react";
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
        { position: [-1.05, 1.85, -4.8], rotationZ: -0.045 },
        { position: [1.05, 0.95, -6.2], rotationZ: 0.04 },
        { position: [-1.15, -0.15, -7.3], rotationZ: 0.03 },
        { position: [1.05, -1.35, -5.5], rotationZ: -0.04 },
        { position: [0, -2.35, -8.2], rotationZ: 0.015 },
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
  const navigate = useNavigate();

  useFrame(({ camera, clock }) => {
    if (!groupRef.current) return;
    groupRef.current.lookAt(camera.position);
    if (!reduced) {
      groupRef.current.position.y = cardPosition.position[1] + Math.sin(clock.elapsedTime * 0.55 + index * 1.13) * 0.13;
      groupRef.current.position.x = cardPosition.position[0] + Math.cos(clock.elapsedTime * 0.31 + index) * 0.055;
    }
  });

  const openService = () => {
    navigate({ to: service.path, ...(service.hash ? { hash: service.hash } : {}) });
  };

  return (
    <group ref={groupRef} position={cardPosition.position} rotation={[0, 0, cardPosition.rotationZ]}>
      <Plane
        args={[2.55, 1.7]}
        position={[0, 0, -0.015]}
        onClick={(event) => {
          event.stopPropagation();
          openService();
        }}
        onPointerOver={(event) => {
          event.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={(event) => {
          event.stopPropagation();
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
      >
        <meshBasicMaterial transparent opacity={0.001} depthWrite={false} />
      </Plane>

      <Html transform distanceFactor={6.4} position={[0, 0, 0]} style={{ pointerEvents: "none" }}>
        <article
          className="w-[180px] overflow-hidden rounded-[16px] border bg-[#071018]/94 p-2.5 text-white shadow-2xl backdrop-blur-xl sm:w-[210px] sm:p-3"
          style={{
            borderColor: `${service.accent}${hovered ? "cc" : "55"}`,
            boxShadow: hovered ? `0 22px 55px ${service.accent}35, inset 0 0 26px ${service.accent}12` : "0 18px 45px rgba(0,0,0,.48)",
            transform: hovered ? "scale(1.08)" : "scale(1)",
            transition: "transform .26s ease, border-color .26s ease, box-shadow .26s ease",
          }}
        >
          <div
            className="relative h-[82px] overflow-hidden rounded-[11px] border border-white/8 sm:h-[96px]"
            style={{ background: `radial-gradient(circle at 50% 55%, ${service.accent}32, transparent 62%), #03080d` }}
          >
            <span className="absolute left-1/2 top-1/2 h-[56px] w-[56px] -translate-x-1/2 -translate-y-1/2 rounded-full border" style={{ borderColor: `${service.accent}88` }} />
            <span className="absolute left-1/2 top-1/2 h-[36px] w-[78px] -translate-x-1/2 -translate-y-1/2 rotate-[-22deg] rounded-full border border-dashed" style={{ borderColor: `${service.accent}66` }} />
            <span className="absolute left-1/2 top-1/2 grid h-8 w-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full font-mono text-[9px] font-semibold" style={{ background: service.accent, color: "#031018", boxShadow: `0 0 24px ${service.accent}88` }}>
              0{index + 1}
            </span>
            <span className="absolute inset-x-0 top-1/2 h-px opacity-50" style={{ background: `linear-gradient(90deg, transparent, ${service.accent}, transparent)` }} />
          </div>
          <div className="px-1 pb-1 pt-2.5">
            <small className="block font-mono text-[7px] uppercase tracking-[.18em]" style={{ color: service.accent }}>{service.label}</small>
            <strong className="mt-1.5 block text-[13px] font-medium leading-tight sm:text-[14px]">{service.title}</strong>
            <span className="mt-2 flex items-center gap-1 font-mono text-[7px] uppercase tracking-[.15em] text-white/45">
              abrir área <ArrowUpRight size={9} />
            </span>
          </div>
        </article>
      </Html>
    </group>
  );
}

function GalaxyScene({ reduced }: { reduced: boolean }) {
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
    </>
  );
}

export function ServiceConstellation() {
  const reduced = useReducedMotion();

  return (
    <div className="relative h-[680px] w-full overflow-hidden sm:h-[760px] lg:h-[820px]">
      <Canvas
        camera={{ position: [0, 0.05, 1.2], fov: 60, near: 0.08, far: 120 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          <GalaxyScene reduced={reduced} />
        </Suspense>
      </Canvas>

      <div className="pointer-events-none absolute left-5 top-5 z-10 sm:left-8 sm:top-8">
        <p className="font-mono text-[9px] tracking-[0.2em] text-white/55 uppercase">serviços · arraste para explorar</p>
      </div>
      <div className="pointer-events-none absolute inset-x-5 bottom-5 z-10 flex justify-center sm:justify-end sm:px-3">
        <span className="rounded-full border border-white/10 bg-black/35 px-3 py-1.5 font-mono text-[8px] tracking-[0.15em] text-white/45 uppercase backdrop-blur-md">
          arraste para olhar · clique no card · zoom bloqueado
        </span>
      </div>
    </div>
  );
}
