import { useEffect, useRef } from "react";

import { Stage } from "@/components/three/Stage";
import { NarrativeScene, type NarrativeMode } from "@/components/three/NarrativeScene";
import { useReducedMotion } from "@/lib/motion";

export type NarrativeStep = { title: string; body: string };

/**
 * Seção de scroll storytelling: a cena 3D fica fixa enquanto os passos
 * de texto passam; o progresso do scroll dirige a transformação da cena.
 */
export function ScrollNarrative({
  mode,
  hue,
  steps,
  label,
}: {
  mode: NarrativeMode;
  hue: number;
  steps: NarrativeStep[];
  label: string;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) {
        progress.current = 1;
        return;
      }
      progress.current = Math.min(1, Math.max(0, -rect.top / total));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative" aria-label={label}>
      <div className="sticky top-0 h-screen w-full">
        <Stage
          className="absolute inset-0 h-full w-full"
          cameraPosition={[0, 0, 11]}
          fov={45}
          fallbackClassName="bg-background"
        >
          <NarrativeScene mode={mode} hue={hue} progressRef={progress} reduced={reduced} />
        </Stage>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/45 via-transparent to-background/90" />
      </div>

      <div className="relative z-10 -mt-[100vh]">
        {steps.map((step, i) => (
          <div
            key={step.title}
            className="flex min-h-screen items-center px-5 lg:px-8"
          >
            <div
              className={`mx-auto w-full max-w-7xl ${
                i % 2 === 1 ? "lg:flex lg:justify-end" : ""
              }`}
            >
              <div className="panel max-w-lg p-7 lg:p-9">
                <p className="eyebrow">
                  {label} — passo {i + 1} de {steps.length}
                </p>
                <h3 className="mt-3 font-display text-3xl leading-tight text-foreground lg:text-4xl">
                  {step.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground lg:text-base">
                  {step.body}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
