import { Environment, Sphere } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

import { services } from "@/config/site";
import { useReducedMotion } from "@/lib/motion";

type CardPosition = {
  position: [number, number, number];
  rotationZ: number;
};

type DragState = {
  pointerId: number;
  x: number;
  y: number;
  yaw: number;
  pitch: number;
} | null;

function useCardPositions() {
  return useMemo<CardPosition[]>(() => {
    const mobile = typeof window !== "undefined" && window.innerWidth < 768;
    if (mobile) {
      return [
        { position: [-1.15, 1.8, -4.8], rotationZ: -0.045 },
        { position: [1.15, 0.9, -6.2], rotationZ: 0.04 },
        { position: [-1.2, -0.2, -7.3], rotationZ: 0.03 },
        { position: [1.15, -1.35, -5.5], rotationZ: -0.04 },
        { position: [0, -2.3, -8.2], rotationZ: 0.015 },
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
    const count = reduced ? 2400 : mobile ? 5000 : 9000;
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

function SceneController({
  reduced,
  positions,
  cardRefs,
  yawRef,
  pitchRef,
}: {
  reduced: boolean;
  positions: CardPosition[];
  cardRefs: React.MutableRefObject<Array<HTMLDivElement | null>>;
  yawRef: React.MutableRefObject<number>;
  pitchRef: React.MutableRefObject<number>;
}) {
  const projected = useMemo(() => new THREE.Vector3(), []);
  const world = useMemo(() => new THREE.Vector3(), []);
  const target = useMemo(() => new THREE.Vector3(0, 0, -5.8), []);

  useFrame(({ camera, clock, size }) => {
    const yaw = yawRef.current;
    const pitch = THREE.MathUtils.clamp(pitchRef.current, -0.34, 0.34);
    const radius = 7;

    camera.position.set(
      Math.sin(yaw) * radius,
      0.05 + Math.sin(pitch) * 4.1,
      target.z + Math.cos(yaw) * radius,
    );
    camera.lookAt(target);
    camera.updateMatrixWorld();

    positions.forEach((card, index) => {
      const element = cardRefs.current[index];
      if (!element) return;

      const floatY = reduced ? 0 : Math.sin(clock.elapsedTime * 0.55 + index * 1.13) * 0.12;
      const floatX = reduced ? 0 : Math.cos(clock.elapsedTime * 0.31 + index) * 0.05;
      world.set(card.position[0] + floatX, card.position[1] + floatY, card.position[2]);
      projected.copy(world).project(camera);

      const visible = projected.z > -1 && projected.z < 1 && Math.abs(projected.x) < 1.18 && Math.abs(projected.y) < 1.18;
      if (!visible) {
        element.style.opacity = "0";
        element.style.pointerEvents = "none";
        return;
      }

      const x = (projected.x * 0.5 + 0.5) * size.width;
      const y = (-projected.y * 0.5 + 0.5) * size.height;
      const distance = camera.position.distanceTo(world);
      const scale = THREE.MathUtils.clamp(1.17 - (distance - 6) * 0.045, 0.82, 1.08);
      const rotate = (card.rotationZ * 180) / Math.PI;

      element.style.opacity = "1";
      element.style.pointerEvents = "auto";
      element.style.zIndex = String(Math.max(1, Math.round(100 - distance * 5)));
      element.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) rotate(${rotate}deg) scale(${scale})`;
    });
  });

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
    </>
  );
}

export function ServiceConstellation() {
  const reduced = useReducedMotion();
  const positions = useCardPositions();
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const yawRef = useRef(0);
  const pitchRef = useRef(0);
  const dragRef = useRef<DragState>(null);
  const [coarsePointer, setCoarsePointer] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(pointer: coarse)");
    const update = () => setCoarsePointer(query.matches);
    update();
    query.addEventListener?.("change", update);
    return () => query.removeEventListener?.("change", update);
  }, []);

  return (
    <div
      className="relative isolate h-[680px] w-full select-none overflow-hidden sm:h-[760px] lg:h-[820px]"
      style={{ touchAction: coarsePointer ? "pan-y" : "none", WebkitUserSelect: "none" }}
      onPointerDown={(event) => {
        if (event.button !== 0) return;
        dragRef.current = {
          pointerId: event.pointerId,
          x: event.clientX,
          y: event.clientY,
          yaw: yawRef.current,
          pitch: pitchRef.current,
        };
        event.currentTarget.setPointerCapture?.(event.pointerId);
      }}
      onPointerMove={(event) => {
        const drag = dragRef.current;
        if (!drag || drag.pointerId !== event.pointerId) return;
        const dx = event.clientX - drag.x;
        const dy = event.clientY - drag.y;

        if (coarsePointer) {
          if (Math.abs(dx) <= Math.abs(dy) + 6) return;
          yawRef.current = drag.yaw - dx * 0.0065;
          return;
        }

        yawRef.current = drag.yaw - dx * 0.0048;
        pitchRef.current = THREE.MathUtils.clamp(drag.pitch - dy * 0.0032, -0.34, 0.34);
      }}
      onPointerUp={(event) => {
        if (dragRef.current?.pointerId === event.pointerId) dragRef.current = null;
        event.currentTarget.releasePointerCapture?.(event.pointerId);
      }}
      onPointerCancel={() => {
        dragRef.current = null;
      }}
    >
      <Canvas
        camera={{ position: [0, 0.05, 1.2], fov: 60, near: 0.08, far: 120 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        style={{ pointerEvents: "none" }}
      >
        <Suspense fallback={null}>
          <SceneController
            reduced={reduced}
            positions={positions}
            cardRefs={cardRefs}
            yawRef={yawRef}
            pitchRef={pitchRef}
          />
        </Suspense>
      </Canvas>

      <div className="pointer-events-none absolute inset-0 z-20">
        {services.map((service, index) => (
          <div
            key={service.key}
            ref={(element) => {
              cardRefs.current[index] = element;
            }}
            className="absolute left-0 top-0 opacity-0 will-change-transform"
          >
            <Link
              to={service.path}
              {...(service.hash ? { hash: service.hash } : {})}
              draggable={false}
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => event.stopPropagation()}
              onDragStart={(event) => event.preventDefault()}
              className="pointer-events-auto group block w-[176px] select-none overflow-hidden rounded-[17px] border bg-[#071018]/96 p-2.5 text-white shadow-2xl backdrop-blur-xl sm:w-[198px] sm:p-3 lg:w-[208px]"
              style={{
                borderColor: `${service.accent}66`,
                boxShadow: `0 20px 52px rgba(0,0,0,.52), 0 0 22px ${service.accent}12`,
                WebkitTapHighlightColor: "transparent",
              }}
            >
              <div
                className="relative h-[82px] overflow-hidden rounded-[11px] border border-white/8 bg-white/[.025] sm:h-[94px] lg:h-[100px]"
                style={{ background: `radial-gradient(circle at 50% 55%, ${service.accent}32, transparent 62%), #03080d` }}
              >
                <span className="absolute left-1/2 top-1/2 h-[56px] w-[56px] -translate-x-1/2 -translate-y-1/2 rounded-full border transition-transform duration-300 group-hover:scale-110" style={{ borderColor: `${service.accent}88` }} />
                <span className="absolute left-1/2 top-1/2 h-[36px] w-[78px] -translate-x-1/2 -translate-y-1/2 rotate-[-22deg] rounded-full border border-dashed" style={{ borderColor: `${service.accent}66` }} />
                <span className="absolute left-1/2 top-1/2 grid h-8 w-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full font-mono text-[9px] font-semibold sm:h-9 sm:w-9 sm:text-[10px]" style={{ background: service.accent, color: "#031018", boxShadow: `0 0 24px ${service.accent}82` }}>
                  0{index + 1}
                </span>
                <span className="absolute inset-x-0 top-1/2 h-px opacity-50" style={{ background: `linear-gradient(90deg, transparent, ${service.accent}, transparent)` }} />
              </div>
              <div className="px-1 pb-1 pt-2.5">
                <small className="block font-mono text-[7px] uppercase tracking-[.16em] sm:text-[8px]" style={{ color: service.accent }}>{service.label}</small>
                <strong className="mt-1.5 block text-[12px] font-medium leading-tight sm:text-[14px]">{service.title}</strong>
                <span className="mt-2 flex items-center gap-1 font-mono text-[7px] uppercase tracking-[.13em] text-white/50 sm:text-[8px]">
                  abrir área <ArrowUpRight size={10} />
                </span>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute left-5 top-5 z-30 sm:left-8 sm:top-8">
        <p className="font-mono text-[9px] tracking-[0.2em] text-white/55 uppercase">
          {coarsePointer ? "serviços · arraste na horizontal · toque para abrir" : "serviços · arraste para explorar"}
        </p>
      </div>
      <div className="pointer-events-none absolute inset-x-5 bottom-5 z-30 flex justify-center sm:justify-end sm:px-3">
        <span className="rounded-full border border-white/10 bg-black/35 px-3 py-1.5 font-mono text-[8px] tracking-[0.15em] text-white/45 uppercase backdrop-blur-md">
          {coarsePointer ? "scroll vertical livre · arraste lateralmente para olhar" : "arraste para olhar · clique no card · zoom bloqueado"}
        </span>
      </div>
    </div>
  );
}
