import { useMemo } from "react";

import { useHydrated, useReducedMotion } from "@/lib/motion";
import { useIsMobile } from "@/hooks/use-mobile";

/**
 * Camada de feixes de luz atravessando a cena (sobre o Canvas, atrás do
 * conteúdo). Head pequeno e brilhante + cauda longa e suave, trajetórias
 * quase horizontais, velocidades e atrasos determinísticos.
 */

type Streak = {
  top: number;
  width: number;
  height: number;
  duration: number;
  delay: number;
  tilt: number;
  opacity: number;
  hue: "cyan" | "white" | "amber";
};

function rand(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function buildStreaks(count: number): Streak[] {
  return Array.from({ length: count }, (_, i) => {
    const a = rand(i + 1);
    const b = rand(i + 17);
    const c = rand(i + 43);
    return {
      top: 6 + a * 84,
      width: 26 + b * 40,
      height: c > 0.75 ? 2 : 1,
      duration: 7 + b * 9,
      delay: -(a * 14 + i * 1.7),
      tilt: (b - 0.5) * 7,
      opacity: 0.18 + c * 0.3,
      hue: i % 7 === 3 ? "amber" : c > 0.6 ? "white" : "cyan",
    };
  });
}

const TAIL: Record<Streak["hue"], string> = {
  cyan: "#7fd6ff",
  white: "#ffffff",
  amber: "#e8c07a",
};


export function MeteorStreaks({ className = "" }: { className?: string }) {
  const reduced = useReducedMotion();
  const hydrated = useHydrated();
  const isMobile = useIsMobile();

  const streaks = useMemo(() => buildStreaks(isMobile ? 4 : 7), [isMobile]);

  if (!hydrated) return null;

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {(reduced ? streaks.slice(0, 2) : streaks).map((s, i) => (
        <span
          key={i}
          className={reduced ? "absolute" : "absolute animate-meteor-streak"}
          style={
            {
              top: `${s.top}%`,
              left: reduced ? `${8 + i * 34}%` : 0,
              width: `${s.width}vw`,
              height: `${s.height}px`,
              opacity: reduced ? s.opacity * 0.5 : undefined,
              transform: reduced ? `rotate(${s.tilt}deg)` : undefined,
              animationDuration: `${s.duration}s`,
              animationDelay: `${s.delay}s`,
              "--streak-tilt": `${s.tilt}deg`,
              "--streak-opacity": s.opacity,
              background: `linear-gradient(90deg, transparent 0%, ${TAIL[s.hue]}00 10%, ${TAIL[s.hue]}55 60%, ${TAIL[s.hue]} 96%, #ffffff 100%)`,
              filter: "blur(0.3px)",
              boxShadow: `0 0 10px 0 ${TAIL[s.hue]}55`,
            } as React.CSSProperties
          }
        />
      ))}

    </div>
  );
}
