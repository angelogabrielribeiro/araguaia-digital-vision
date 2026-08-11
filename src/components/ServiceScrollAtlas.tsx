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
  const drift = useTransform(scrollYProgress, [0, 1], ["0%", "-14%"]);

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
    <section ref={ref} className="relative h-[520svh] border-t border-border bg-[#020609]">
      <div className="sticky top-0 h-svh overflow-hidden">
        <MeteorStreaks />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(40,118,145,.19),transparent_42%),linear-gradient(180deg,#020609,#071017)]" />
        <motion.div className="absolute inset-0 opacity-60" style={{ y: drift }}>
          {Array.from({ length: 56 }).map((_, index) => (
            <span
              key={index}
              className="absolute h-[2px] w-[2px] rounded-full bg-white/60"
              style={{
                left: `${(index * 37) % 100}%`,
                top: `${(index * 61) % 100}%`,
                opacity: 0.18 + (index % 5) * 0.12,
              }}
            />
          ))}
        </motion.div>

        <div className="relative mx-auto flex h-full max-w-7xl items-center px-5 lg:px-8">
          <div className="grid w-full items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="relative z-20 max-w-xl">
              <p className="eyebrow">Mapa guiado pelo scroll</p>
              <div className="mt-5 flex items-center gap-3 font-mono text-[9px] uppercase tracking-[.18em] text-white/38">
                <span>0{active + 1}</span>
                <span className="h-px w-12 bg-white/15" />
                <span>0{services.length}</span>
              </div>

              <motion.div
                key={current.key}
                initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
              >
                <h2 className="mt-5 font-display text-[clamp(2.7rem,6vw,5.3rem)] leading-[.92] text-foreground">
                  {current.title}
                </h2>
                <p className="mt-5 max-w-lg text-sm leading-relaxed text-muted-foreground lg:text-base">{current.summary}</p>
                <Link
                  to={current.path}
                  {...(current.hash ? { hash: current.hash } : {})}
                  className="mt-7 inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-medium transition-transform hover:-translate-y-1"
                  style={{ borderColor: `${current.accent}70`, color: current.accent, boxShadow: `0 0 32px ${current.accent}12` }}
                >
                  Entrar nesta área <ArrowUpRight className="h-4 w-4" />
                </Link>
              </motion.div>

              <div className="mt-10 flex gap-2">
                {services.map((service, index) => (
                  <span
                    key={service.key}
                    className="h-1 rounded-full transition-all duration-500"
                    style={{ width: index === active ? 48 : 16, background: index === active ? service.accent : "rgba(255,255,255,.12)" }}
                  />
                ))}
              </div>
            </div>

            <div className="relative mx-auto aspect-square w-full max-w-[620px] perspective-[1200px]">
              <motion.div className="absolute inset-[10%] rounded-full border border-white/8" style={{ rotate }} />
              <motion.div className="absolute inset-[22%] rounded-full border border-dashed border-white/10" style={{ rotate: useTransform(rotate, (v) => -v * 0.7) }} />
              <div
                className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10"
                style={{ background: `radial-gradient(circle, ${current.accent}55 0%, ${current.accent}15 38%, transparent 72%)`, boxShadow: `0 0 80px ${current.accent}35` }}
              />

              {services.map((service, index) => {
                const angle = orbital[index]!;
                const left = 50 + Math.cos(angle) * 38;
                const top = 50 + Math.sin(angle) * 38;
                const isActive = index === active;
                return (
                  <motion.div
                    key={service.key}
                    animate={{
                      left: `${left}%`,
                      top: `${top}%`,
                      scale: isActive ? 1.12 : 0.82,
                      opacity: isActive ? 1 : 0.42,
                      z: isActive ? 80 : -40,
                    }}
                    transition={{ type: "spring", stiffness: 110, damping: 19 }}
                    className="absolute w-[138px] -translate-x-1/2 -translate-y-1/2 sm:w-[168px]"
                  >
                    <Link
                      to={service.path}
                      {...(service.hash ? { hash: service.hash } : {})}
                      className="group block overflow-hidden rounded-2xl border bg-black/45 p-3 backdrop-blur-xl transition-transform hover:-translate-y-2"
                      style={{ borderColor: isActive ? `${service.accent}aa` : "rgba(255,255,255,.12)", boxShadow: isActive ? `0 20px 55px ${service.accent}24` : "0 14px 30px rgba(0,0,0,.35)" }}
                    >
                      <div className="relative h-20 overflow-hidden rounded-xl border border-white/8 bg-white/[.025]">
                        <span className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border" style={{ borderColor: `${service.accent}80`, boxShadow: `0 0 28px ${service.accent}45` }} />
                        <span className="absolute left-1/2 top-1/2 h-px w-full -translate-x-1/2 -translate-y-1/2" style={{ background: `linear-gradient(90deg,transparent,${service.accent},transparent)` }} />
                      </div>
                      <small className="mt-3 block font-mono text-[7px] uppercase tracking-[.16em]" style={{ color: service.accent }}>0{index + 1} · {service.label}</small>
                      <strong className="mt-1.5 block text-[12px] leading-tight text-white sm:text-[13px]">{service.title}</strong>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-black/35 px-4 py-2 font-mono text-[8px] uppercase tracking-[.16em] text-white/45 backdrop-blur-md">
          continue rolando · o mapa responde ao scroll
        </div>
      </div>
    </section>
  );
}
