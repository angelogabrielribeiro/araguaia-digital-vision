import { useEffect, useState } from "react";

/** true quando o usuário pediu menos movimento no sistema operacional. */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

/** true depois da hidratação — evita divergência SSR/cliente. */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}

/** Observa se um elemento está próximo/dentro da viewport. */
export function useInViewport<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  rootMargin = "200px",
) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin,
    });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin]);

  return inView;
}

/** DPR adaptativo:限 limita custo em telas densas e aparelhos modestos. */
export function adaptiveDpr(max = 1.7): [number, number] {
  if (typeof window === "undefined") return [1, 1.5];
  const mobile = window.matchMedia("(max-width: 768px)").matches;
  const cores = navigator.hardwareConcurrency ?? 4;
  const ceiling = mobile || cores <= 4 ? 1.35 : max;
  return [1, Math.min(window.devicePixelRatio || 1, ceiling)];
}
