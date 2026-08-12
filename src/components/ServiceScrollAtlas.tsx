import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { useMemo, useRef, useState } from "react";

import { MeteorStreaks } from "@/components/MeteorStreaks";
import { services } from "@/config/site";

export function ServiceScrollAtlas() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [active, setActive] = useState(0);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 280]);
  const reverseRotate = useTransform(scrollYProgress, [0, 1], [0, -196]);
  const drift = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const next = Math.min(services.length - 1, Math.floor(value * services.length));
    setActive(next);
  });

  const current = services[active] ?? services[0]!;
  const orbital = useMemo(
    () => services.map((_, index) => ((index / services.length) * Math.PI * 2) - Math.PI / 2),
    [],
  );

  return (
    <section ref={ref} className="relative h-[500svh] border-t border-border bg-[#020609]">
      <div className="sticky top-16 h-[calc(100svh-4rem)] overflow-hidden">
        <MeteorStreaks />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(40,118,145,.19),transparent_42%),linear-gradient(180deg,#020609,#071017)]" />
        <motion.div className="absolute inset-0 opacity-60" style={{ y: drift }}>
          {Array.from({ length: 56 }).map((_, index) => (
            <span
              key={index}
              className="absolute h-[2px] w-[2px] rounded-full bg-white/60"
              style={{ left: `${(index * 37) % 100}%`, top: `${(index * 61) % 100}%`, opacity: 0.18 + (index % 5) * 0.12 }}
            />
          ))}
        </motion.div>

        <div className="relative mx-auto flex h-full max-w-7xl items-center px-5 py-4 lg:px-8 lg:py-6">
          <div className="grid h-full w-full min-h-0 content-center items-center gap-3 lg:grid-cols-[0.9fr_1.1fr] lg:gap-8">
            <div className="relative z-20 mx-auto w-full max-w-xl lg:mx-0">
              <p className="eyebrow">Mapa guiado pelo scroll</p>
              <div className="mt-3 flex items-center gap-3 font-mono text-[8px] uppercase tracking-[.18em] text-white/38 lg:mt-5 lg:text-[9px]">
                <span>0{active + 1}</span><span className="h-px w-10 bg-white/15 lg:w-12" /><span>0{services.length}</span>
              </div>

              <motion.div key={current.key} initial={{ opacity: 0, y: 22, filter: "blur(7px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}>
                <h2 className="mt-3 font-display text-[clamp(2rem,9.5vw,3.1rem)] leading-[.92] text-foreground lg:mt-5 lg:text-[clamp(2.7rem,6vw,5.3rem)]">{current.title}</h2>
                <p className="mt-3 max-w-lg text-[12px] leading-relaxed text-muted-foreground sm:text-sm lg:mt-5 lg:text-base">{current.summary}</p>
                <Link
                  to={current.path}
                  {...(current.hash ? { hash: current.hash } : {})}
                  className="mt-4 inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-xs font-medium transition-transform hover:-translate-y-1 lg:mt-7 lg:px-5 lg:py-3 lg:text-sm"
                  style={{ borderColor: `${current.accent}70`, color: current.accent, boxShadow: `0 0 32px ${current.accent}12` }}
                >
                  Entrar nesta área <ArrowUpRight className="h-4 w-4" />
                </Link>
              </motion.div>

              <div className="mt-4 flex gap-2 lg:mt-8">
                {services.map((service, index) => (
                  <span key={service.key} className="h-1 rounded-full transition-all duration-500" style={{ width: index === active ? 40 : 13, background: index === active ? service.accent : "rgba(255,255,255,.12)" }} />
                ))}
              </div>
            </div>

            <div className="relative mx-auto aspect-square w-[min(76vw,35svh)] shrink-0 perspective-[1200px] sm:w-[min(70vw,39svh)] lg:w-[min(620px,70svh)]">
              <motion.div className="absolute inset-[10%] rounded-full border border-white/8" style={{ rotate }} />
              <motion.div className="absolute inset-[22%] rounded-full border border-dashed border-white/10" style={{ rotate: reverseRotate }} />
              <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 sm:h-24 sm:w-24 lg:h-28 lg:w-28" style={{ background: `radial-gradient(circle, ${current.accent}55 0%, ${current.accent}15 38%, transparent 72%)`, boxShadow: `0 0 80px ${current.accent}35` }} />

              {services.map((service, index) => {
                const angle = orbital[index]!;
                const left = 50 + Math.cos(angle) * 29;
                const top = 50 + Math.sin(angle) * 29;
                const isActive = index === active;
                return (
                  <motion.div
                    key={service.key}
                    animate={{ left: `${left}%`, top: `${top}%`, scale: isActive ? 1.05 : 0.82, opacity: isActive ? 1 : 0.48, z: isActive ? 64 : -24 }}
                    transition={{ type: "spring", stiffness: 110, damping: 19 }}
                    className="absolute w-[108px] -translate-x-1/2 -translate-y-1/2 sm:w-[124px] lg:w-[150px]"
                  >
                    <Link
                      to={service.path}
                      {...(service.hash ? { hash: service.hash } : {})}
                      className="group block overflow-hidden rounded-xl border bg-black/50 p-2 backdrop-blur-xl transition-transform hover:-translate-y-1.5 lg:rounded-2xl lg:p-2.5"
                      style={{ borderColor: isActive ? `${service.accent}aa` : "rgba(255,255,255,.12)", boxShadow: isActive ? `0 16px 42px ${service.accent}24` : "0 12px 26px rgba(0,0,0,.35)" }}
                    >
                      <div className="relative h-12 overflow-hidden rounded-lg border border-white/8 bg-white/[.025] sm:h-14 lg:h-[68px] lg:rounded-xl">
                        <span className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border sm:h-9 sm:w-9 lg:h-11 lg:w-11" style={{ borderColor: `${service.accent}80`, boxShadow: `0 0 24px ${service.accent}45` }} />
                        <span className="absolute left-1/2 top-1/2 h-px w-full -translate-x-1/2 -translate-y-1/2" style={{ background: `linear-gradient(90deg,transparent,${service.accent},transparent)` }} />
                      </div>
                      <small className="mt-2 block font-mono text-[5px] uppercase tracking-[.12em] sm:text-[6px] lg:text-[7px]" style={{ color: service.accent }}>0{index + 1} · {service.label}</small>
                      <strong className="mt-1 block text-[9px] leading-tight text-white sm:text-[10px] lg:text-[12px]">{service.title}</strong>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-3 left-1/2 hidden -translate-x-1/2 rounded-full border border-white/10 bg-black/35 px-4 py-2 font-mono text-[8px] uppercase tracking-[.16em] text-white/45 backdrop-blur-md lg:block">continue rolando · o mapa responde ao scroll</div>
      </div>
    </section>
  );
}
