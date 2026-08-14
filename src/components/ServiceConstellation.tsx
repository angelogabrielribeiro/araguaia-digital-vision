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
  pointerType: string;
  x: number;
  y: number;
  yaw: number;
  pitch: number;
} | null;

type ConstellationItem = {
  key: string;
  path: "/ti" | "/manutencao" | "/financas" | "/contabilidade" | "/sobre";
  hash?: string;
  label: string;
  title: string;
  accent: string;
};

const MAX_PITCH = 0.82;

const CONSTELLATION_ITEMS: ConstellationItem[] = [
  ...services.map(({ key, path, hash, label, title, accent }) => ({
    key,
    path,
    hash,
    label,
    title,
    accent,
  })),
  {
    key: "sobre",
    path: "/sobre",
    label: "Sobre",
    title: "Quem atende",
    accent: "#7dd3fc",
  },
];

function pointFromView(yaw: number, pitch: number, radius: number): [number, number, number] {
  const cosPitch = Math.cos(pitch);
  return [
    Math.sin(yaw) * cosPitch * radius,
    Math.sin(pitch) * radius,
    -Math.cos(yaw) * cosPitch * radius,
  ];
}

function useCardPositions() {
  return useMemo<CardPosition[]>(
    () => [
      { position: pointFromView(-0.36, 0.1, 5.7), rotationZ: -0.04 },
      { position: pointFromView(0.4, -0.08, 6.05), rotationZ: 0.035 },
      { position: pointFromView(1.34, 0.3, 5.85), rotationZ: 0.025 },
      { position: pointFromView(2.92, -0.18, 6.1), rotationZ: -0.035 },
      { position: pointFromView(-2.02, 0.24, 6.2), rotationZ: 0.02 },
      { position: pointFromView(-1.08, -0.3, 5.65), rotationZ: -0.02 },
    ],
    [],
  );
}

function Starfield({ reduced }: { reduced: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const geometry = useMemo(() => {
    const mobile = typeof window !== "undefined" && window.innerWidth < 768;
    const count = reduced ? 2200 : mobile ? 5200 : 9000;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const theta = i * 2.399963229728653;
      const radius = 5.2 + ((i * 37) % 1000) / 28;
      const spreadY = (((i * 91) % 1000) / 1000 - 0.5) * 28;
      positions[i * 3] = Math.cos(theta) * radius;
      positions[i * 3 + 1] = spreadY;
      positions[i * 3 + 2] = Math.sin(theta) * radius;
    }

    const next = new THREE.BufferGeometry();
    next.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return next;
  }, [reduced]);

  useFrame((_, delta) => {
    if (!ref.current || reduced) return;
    ref.current.rotation.y += delta * 0.0014;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial color="#eefcff" size={0.05} transparent opacity={0.8} sizeAttenuation />
    </points>
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
  const lookTarget = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ camera, clock, size }) => {
    const yaw = yawRef.current;
    const pitch = THREE.MathUtils.clamp(pitchRef.current, -MAX_PITCH, MAX_PITCH);
    const cosPitch = Math.cos(pitch);

    camera.position.set(0, 0, 0.35);
    lookTarget.set(
      Math.sin(yaw) * cosPitch,
      Math.sin(pitch),
      0.35 - Math.cos(yaw) * cosPitch,
    );
    camera.lookAt(lookTarget);
    camera.updateMatrixWorld();

    const mobile = size.width < 768;

    positions.forEach((card, index) => {
      const element = cardRefs.current[index];
      if (!element) return;

      const floatY = reduced ? 0 : Math.sin(clock.elapsedTime * 0.48 + index * 1.13) * 0.06;
      const floatX = reduced ? 0 : Math.cos(clock.elapsedTime * 0.29 + index) * 0.028;
      world.set(card.position[0] + floatX, card.position[1] + floatY, card.position[2]);
      projected.copy(world).project(camera);

      const visible =
        projected.z > -1 &&
        projected.z < 1 &&
        Math.abs(projected.x) < 1.22 &&
        Math.abs(projected.y) < 1.18;

      if (!visible) {
        element.style.opacity = "0";
        element.style.pointerEvents = "none";
        return;
      }

      const x = (projected.x * 0.5 + 0.5) * size.width;
      const y = (-projected.y * 0.5 + 0.5) * size.height;
      const distance = camera.position.distanceTo(world);
      const depthScale = THREE.MathUtils.clamp(1.06 - (distance - 5.4) * 0.045, 0.82, 1.02);
      const scale = mobile ? depthScale * 0.84 : depthScale;
      const rotate = (card.rotationZ * 180) / Math.PI;

      element.style.opacity = "1";
      element.style.pointerEvents = "auto";
      element.style.zIndex = String(Math.max(1, Math.round(100 - distance * 5)));
      element.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) rotate(${rotate}deg) scale(${scale})`;
    });
  });

  return (
    <>
      <color attach="background" args={["#010205"]} />
      <Starfield reduced={reduced} />
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
      style={{
        touchAction: coarsePointer ? "pan-y" : "none",
        WebkitUserSelect: "none",
        userSelect: "none",
      }}
      onDragStart={(event) => event.preventDefault()}
      onPointerDown={(event) => {
        if (event.pointerType === "mouse" && event.button !== 0) return;

        dragRef.current = {
          pointerId: event.pointerId,
          pointerType: event.pointerType,
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
        const touch = drag.pointerType !== "mouse";
        const yawSensitivity = touch ? 0.009 : 0.0052;
        const pitchSensitivity = touch ? 0.0064 : 0.0044;

        yawRef.current = drag.yaw - dx * yawSensitivity;
        pitchRef.current = THREE.MathUtils.clamp(
          drag.pitch - dy * pitchSensitivity,
          -MAX_PITCH,
          MAX_PITCH,
        );
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
        camera={{ position: [0, 0, 0.35], fov: 60, near: 0.08, far: 100 }}
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
        {CONSTELLATION_ITEMS.map((item, index) => (
          <div
            key={item.key}
            ref={(element) => {
              cardRefs.current[index] = element;
            }}
            className="absolute left-0 top-0 opacity-0 will-change-transform"
          >
            <Link
              to={item.path}
              {...(item.hash ? { hash: item.hash } : {})}
              draggable={false}
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => event.stopPropagation()}
              onDragStart={(event) => event.preventDefault()}
              className="pointer-events-auto group block w-[138px] select-none overflow-hidden rounded-[15px] border bg-[#071018]/96 p-2 text-white shadow-2xl backdrop-blur-xl sm:w-[170px] sm:p-2.5 lg:w-[202px] lg:rounded-[17px] lg:p-3"
              style={{
                borderColor: `${item.accent}66`,
                boxShadow: `0 20px 52px rgba(0,0,0,.52), 0 0 22px ${item.accent}12`,
                WebkitTapHighlightColor: "transparent",
                touchAction: "manipulation",
              }}
            >
              <div
                className="relative h-[62px] overflow-hidden rounded-[10px] border border-white/8 bg-white/[.025] sm:h-[78px] lg:h-[96px] lg:rounded-[11px]"
                style={{
                  background: `radial-gradient(circle at 50% 55%, ${item.accent}32, transparent 62%), #03080d`,
                }}
              >
                <span
                  className="absolute left-1/2 top-1/2 h-[42px] w-[42px] -translate-x-1/2 -translate-y-1/2 rounded-full border transition-transform duration-300 group-hover:scale-110 sm:h-[48px] sm:w-[48px] lg:h-[52px] lg:w-[52px]"
                  style={{ borderColor: `${item.accent}88` }}
                />
                <span
                  className="absolute left-1/2 top-1/2 h-[28px] w-[58px] -translate-x-1/2 -translate-y-1/2 rotate-[-22deg] rounded-full border border-dashed sm:h-[31px] sm:w-[65px] lg:h-[34px] lg:w-[72px]"
                  style={{ borderColor: `${item.accent}66` }}
                />
                <span
                  className="absolute left-1/2 top-1/2 grid h-7 w-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full font-mono text-[8px] font-semibold sm:h-8 sm:w-8 sm:text-[9px] lg:h-9 lg:w-9 lg:text-[10px]"
                  style={{
                    background: item.accent,
                    color: "#031018",
                    boxShadow: `0 0 24px ${item.accent}82`,
                  }}
                >
                  0{index + 1}
                </span>
                <span
                  className="absolute inset-x-0 top-1/2 h-px opacity-50"
                  style={{ background: `linear-gradient(90deg, transparent, ${item.accent}, transparent)` }}
                />
              </div>

              <div className="px-0.5 pb-0.5 pt-2 sm:px-1 sm:pb-1 sm:pt-2.5">
                <small
                  className="block font-mono text-[6px] uppercase tracking-[.14em] sm:text-[7px] lg:text-[8px]"
                  style={{ color: item.accent }}
                >
                  {item.label}
                </small>
                <strong className="mt-1 block text-[10px] font-medium leading-tight sm:mt-1.5 sm:text-[12px] lg:text-[14px]">
                  {item.title}
                </strong>
                <span className="mt-1.5 flex items-center gap-1 font-mono text-[6px] uppercase tracking-[.11em] text-white/50 sm:mt-2 sm:text-[7px] lg:text-[8px]">
                  abrir área <ArrowUpRight size={9} className="lg:h-[10px] lg:w-[10px]" />
                </span>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute left-5 top-5 z-30 sm:left-8 sm:top-8">
        <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/55">
          {coarsePointer
            ? "serviços · arraste para olhar em qualquer direção"
            : "serviços · arraste para explorar"}
        </p>
      </div>

      <div className="pointer-events-none absolute inset-x-5 bottom-5 z-30 flex justify-center sm:justify-end sm:px-3">
        <span className="rounded-full border border-white/10 bg-black/35 px-3 py-1.5 font-mono text-[8px] uppercase tracking-[0.15em] text-white/45 backdrop-blur-md">
          {coarsePointer
            ? "arraste o espaço · role a página normalmente · toque no card"
            : "arraste para olhar · clique no card · zoom bloqueado"}
        </span>
      </div>
    </div>
  );
}
