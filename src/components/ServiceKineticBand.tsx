import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

import type { ServiceDef } from "@/config/site";

export function ServiceKineticBand({ service }: { service: ServiceDef }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const xA = useTransform(scrollYProgress, [0, 1], ["8%", "-28%"]);
  const xB = useTransform(scrollYProgress, [0, 1], ["-22%", "10%"]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-8, 8]);
  const words = [service.label, ...service.items.slice(0, 4)];

  return (
    <section ref={ref} className="relative overflow-hidden border-y border-border bg-black py-12 lg:py-16">
      <div className="pointer-events-none absolute inset-0 opacity-60" style={{ background: `radial-gradient(circle at 50% 50%, ${service.accent}18, transparent 55%)` }} />
      <motion.div className="pointer-events-none absolute left-1/2 top-1/2 h-[440px] w-[440px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/8" style={{ rotate }} />

      <motion.div style={{ x: xA }} className="relative flex w-max items-center gap-7 whitespace-nowrap">
        {[...words, ...words].map((word, index) => (
          <span key={`a-${index}`} className="font-display text-[clamp(2rem,5vw,4.6rem)] leading-none text-white/12">
            {word}
            <span className="ml-7 inline-block h-2 w-2 rounded-full align-middle" style={{ background: service.accent, boxShadow: `0 0 20px ${service.accent}` }} />
          </span>
        ))}
      </motion.div>

      <motion.div style={{ x: xB }} className="relative mt-5 flex w-max items-center gap-7 whitespace-nowrap">
        {[...words.slice().reverse(), ...words.slice().reverse()].map((word, index) => (
          <span key={`b-${index}`} className="font-mono text-[10px] uppercase tracking-[.24em]" style={{ color: index % 2 === 0 ? service.accent : "rgba(255,255,255,.38)" }}>
            {word}
            <span className="ml-7 text-white/15">//</span>
          </span>
        ))}
      </motion.div>
    </section>
  );
}
