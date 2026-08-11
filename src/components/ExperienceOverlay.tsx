import { motion, useMotionValue, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

import { useReducedMotion } from "@/lib/motion";

export function ExperienceOverlay() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.2 });
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const [pointerFine, setPointerFine] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setPointerFine(window.matchMedia("(pointer:fine)").matches);
    if (reduced) return;

    let raf = 0;
    let nextX = -200;
    let nextY = -200;
    const paint = () => {
      raf = 0;
      x.set(nextX - 150);
      y.set(nextY - 150);
    };
    const onMove = (event: PointerEvent) => {
      nextX = event.clientX;
      nextY = event.clientY;
      if (!raf) raf = requestAnimationFrame(paint);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced, x, y]);

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-[10050] h-[2px] origin-left bg-gradient-to-r from-tech via-signal to-clarity shadow-[0_0_18px_rgba(100,210,255,.45)]"
        style={{ scaleX }}
      />
      {pointerFine && !reduced ? (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none fixed left-0 top-0 z-[2] h-[300px] w-[300px] rounded-full opacity-[.12] mix-blend-screen"
          style={{
            x,
            y,
            background: "radial-gradient(circle, rgba(105,207,255,.48) 0%, rgba(101,212,159,.16) 38%, transparent 72%)",
            filter: "blur(18px)",
          }}
        />
      ) : null}
    </>
  );
}
