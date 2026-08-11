import { clsx, type ClassValue } from "clsx";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * BorderBeamPanel
 * Painel com 1 ou 2 "cometas" percorrendo a borda via conic-gradient,
 * recortado por máscara CSS para mostrar apenas o anel. A mola (spring)
 * manual é aplicada à VELOCIDADE angular, não ao ângulo: o cometa
 * acelera e desacelera com inércia em vez de dar salto.
 */

const IDLE_SPEED = 42; // deg/s
const HOVER_SPEED = 240; // deg/s
const PARKED_ANGLE = 40; // usado com prefers-reduced-motion

export type BorderBeamPanelProps = {
  children?: ReactNode;
  className?: string;
  /** classe do conteúdo interno (dentro do anel) */
  innerClassName?: string;
  /** 1 ou 2 cometas */
  beams?: 1 | 2;
  /** cor de cada cometa (índice 0 e 1) */
  colors?: [string, string?];
  /** espessura do anel em px */
  thickness?: number;
  /** glow difuso atrás do painel */
  glow?: boolean;
  /** raio do painel em px */
  radius?: number;
  /** parâmetros da mola aplicada à velocidade */
  spring?: { stiffness?: number; damping?: number };
  /** semente determinística para as fases iniciais */
  seed?: number;
  /** pausa quando fora da viewport ou aba oculta */
  pauseWhenHidden?: boolean;
  /** força o modo reduzido (por padrão segue o sistema) */
  reducedMotion?: boolean;
  as?: "div" | "article" | "section";
};

function seededPhase(seed: number, index: number) {
  const x = Math.sin(seed * 127.1 + index * 311.7) * 43758.5453;
  return ((x - Math.floor(x)) * 360) % 360;
}

export function BorderBeamPanel({
  children,
  className,
  innerClassName,
  beams = 1,
  colors = ["var(--tech, #56c8ff)", "var(--signal, #4fd6a0)"],
  thickness = 1.5,
  glow = true,
  radius = 16,
  spring,
  seed = 1,
  pauseWhenHidden = true,
  reducedMotion,
  as: Tag = "div",
}: BorderBeamPanelProps) {
  const stiffness = spring?.stiffness ?? 30;
  const damping = spring?.damping ?? 11;

  const hostRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hoverRef = useRef(false);
  const visibleRef = useRef(true);
  const [systemReduced, setSystemReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setSystemReduced(mq.matches);
    const on = (e: MediaQueryListEvent) => setSystemReduced(e.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  const reduced = reducedMotion ?? systemReduced;

  useEffect(() => {
    if (reduced) return;
    const host = hostRef.current;
    if (!host) return;

    let raf = 0;
    let last = performance.now();
    const angles = Array.from({ length: beams }, (_, i) => seededPhase(seed, i));
    const speeds = Array.from({ length: beams }, () => IDLE_SPEED);

    const io = pauseWhenHidden
      ? new IntersectionObserver((es) => {
          visibleRef.current = !!es[0]?.isIntersecting;
        })
      : null;
    io?.observe(host);

    const onVis = () => {
      if (document.hidden) visibleRef.current = false;
      else if (!pauseWhenHidden) visibleRef.current = true;
    };
    document.addEventListener("visibilitychange", onVis);

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      if (visibleRef.current && !document.hidden) {
        const target = hoverRef.current ? HOVER_SPEED : IDLE_SPEED;
        for (let i = 0; i < beams; i++) {
          // mola crítica na VELOCIDADE: aceleração proporcional ao erro
          const v = speeds[i]!;
          const accel = (target - v) * stiffness - v * 0 - (v - target) * 0;
          const next = v + (accel - damping * (v - target) * 0) * dt;
          // integração simples e estável (stiffness/damping normalizados)
          const smoothed = v + (next - v) * Math.min(1, (stiffness / damping) * dt);
          speeds[i] = smoothed;
          angles[i] = (angles[i]! + smoothed * dt * (i % 2 === 0 ? 1 : -1)) % 360;
          const el = layerRefs.current[i];
          if (el) el.style.setProperty("--beam-angle", `${angles[i]!.toFixed(2)}deg`);
        }
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io?.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [beams, damping, pauseWhenHidden, reduced, seed, stiffness]);

  const maskStyle: CSSProperties = {
    padding: thickness,
    borderRadius: radius,
    WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
    WebkitMaskComposite: "xor",
    mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
    maskComposite: "exclude",
  };

  return (
    <Tag
      ref={hostRef as never}
      onPointerEnter={() => (hoverRef.current = true)}
      onPointerLeave={() => (hoverRef.current = false)}
      className={cn("relative isolate", className)}
      style={{ borderRadius: radius }}
    >
      {glow && (
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-6 -z-10 opacity-40 blur-3xl"
          style={{
            background: `radial-gradient(60% 60% at 50% 50%, ${colors[0]} 0%, transparent 70%)`,
          }}
        />
      )}

      {Array.from({ length: beams }).map((_, i) => (
        <span
          key={i}
          aria-hidden
          ref={(el) => {
            layerRefs.current[i] = el as HTMLDivElement | null;
          }}
          className="pointer-events-none absolute inset-0"
          style={
            {
              ...maskStyle,
              "--beam-angle": `${reduced ? PARKED_ANGLE + i * 150 : seededPhase(seed, i)}deg`,
              background: `conic-gradient(from var(--beam-angle) at 50% 50%, transparent 0deg, transparent 300deg, ${
                (i === 0 ? colors[0] : (colors[1] ?? colors[0])) as string
              } 348deg, #fff 358deg, transparent 360deg)`,
              opacity: reduced ? 0.5 : 0.9,
            } as CSSProperties
          }
        />
      ))}

      {/* anel base discreto para o painel existir mesmo com beam apagado */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 border border-border"
        style={{ borderRadius: radius }}
      />

      <div className={cn("relative", innerClassName)} style={{ borderRadius: radius - thickness }}>
        {children}
      </div>
    </Tag>
  );
}
