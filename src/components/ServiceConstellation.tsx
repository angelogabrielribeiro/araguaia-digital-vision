import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { BorderBeamPanel } from "@/components/ui/border-beam-panel";
import { services } from "@/config/site";
import { useReducedMotion } from "@/lib/motion";

/**
 * Deck de cards de serviço em constelação, sobreposto ao cenário 3D.
 * O card em foco é um alvo DOM estável e grande: nada se afasta enquanto
 * o usuário tenta clicar. Setas no desktop, swipe/tap no mobile.
 */

const OFFSETS = [-2, -1, 0, 1, 2] as const;

export function ServiceConstellation() {
  const reduced = useReducedMotion();
  const total = services.length;
  const [active, setActive] = useState(0);
  const touchX = useRef<number | null>(null);

  const go = useCallback(
    (dir: 1 | -1) => setActive((i) => (i + dir + total) % total),
    [total],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  return (
    <div
      className="relative w-full overflow-hidden"
      onTouchStart={(e) => (touchX.current = e.touches[0]?.clientX ?? null)}
      onTouchEnd={(e) => {
        const start = touchX.current;
        const end = e.changedTouches[0]?.clientX;
        touchX.current = null;
        if (start == null || end == null) return;
        const d = end - start;
        if (Math.abs(d) > 45) go(d < 0 ? 1 : -1);
      }}
    >
      <div className="relative mx-auto flex h-[420px] max-w-6xl items-center justify-center px-4 sm:h-[440px]">
        {OFFSETS.map((offset) => {
          const index = (active + offset + total * 2) % total;
          const service = services[index]!;
          const abs = Math.abs(offset);
          const focused = offset === 0;

          return (
            <motion.div
              key={service.key}
              className="absolute w-[min(88vw,26rem)]"
              style={{ zIndex: 10 - abs, pointerEvents: focused ? "auto" : "auto" }}
              animate={{
                x: offset * (reduced ? 200 : 190),
                scale: focused ? 1 : abs === 1 ? 0.84 : 0.7,
                opacity: focused ? 1 : abs === 1 ? 0.5 : 0.18,
                rotateY: reduced ? 0 : offset * -14,
                filter: focused ? "blur(0px)" : "blur(2px)",
              }}
              transition={{ type: "spring", stiffness: 210, damping: 28 }}
              aria-hidden={!focused}
            >
              {focused ? (
                <BorderBeamPanel
                  beams={2}
                  seed={index + 3}
                  radius={18}
                  thickness={1.5}
                  colors={[
                    "var(--tech)",
                    service.hue > 100 && service.hue < 200 ? "var(--signal)" : "var(--clarity)",
                  ]}
                  innerClassName="rounded-[17px] bg-background/85 backdrop-blur-xl p-7"
                >
                  <span className="font-mono text-[11px] tracking-[0.22em] text-tech uppercase">
                    0{index + 1} / serviço
                  </span>
                  <h3 className="mt-3 font-display text-3xl leading-tight text-foreground">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {service.tagline}
                  </p>
                  <ul className="mt-4 space-y-1.5">
                    {service.items.slice(0, 3).map((it) => (
                      <li
                        key={it}
                        className="flex gap-2 text-[13px] leading-snug text-foreground/80 before:mt-2 before:h-px before:w-3 before:shrink-0 before:bg-tech"
                      >
                        {it}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={service.path}
                    {...(service.hash ? { hash: service.hash } : {})}
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-tech px-6 py-3.5 text-sm font-medium text-background transition-all hover:brightness-110"
                  >
                    Abrir serviço <ArrowRight className="h-4 w-4" />
                  </Link>
                </BorderBeamPanel>
              ) : (
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setActive(index)}
                  className="w-full rounded-[18px] border border-border bg-background/70 p-7 text-left backdrop-blur-md"
                >
                  <span className="font-mono text-[11px] tracking-[0.22em] text-muted-foreground uppercase">
                    0{index + 1}
                  </span>
                  <h3 className="mt-3 font-display text-2xl leading-tight text-foreground">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground">{service.tagline}</p>
                </button>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="mt-2 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Serviço anterior"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background/70 text-foreground backdrop-blur transition-colors hover:border-tech"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          {services.map((s, i) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Ver ${s.label}`}
              aria-current={i === active}
              className={`h-2.5 rounded-full transition-all ${
                i === active ? "w-8 bg-tech" : "w-2.5 bg-border hover:bg-muted-foreground"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Próximo serviço"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background/70 text-foreground backdrop-blur transition-colors hover:border-tech"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Faixa auxiliar discreta: acessibilidade e navegação direta */}
      <nav aria-label="Todos os serviços" className="mt-8">
        <ul className="mx-auto flex max-w-4xl flex-wrap justify-center gap-x-5 gap-y-2 px-5">
          {services.map((s) => (
            <li key={s.key}>
              <Link
                to={s.path}
                {...(s.hash ? { hash: s.hash } : {})}
                className="font-mono text-[11px] tracking-[0.14em] text-muted-foreground uppercase transition-colors hover:text-tech"
              >
                {s.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
