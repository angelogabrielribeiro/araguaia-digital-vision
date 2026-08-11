import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState, type ReactNode } from "react";

import { adaptiveDpr, useInViewport, useReducedMotion } from "@/lib/motion";

type StageProps = {
  children: ReactNode;
  className?: string;
  /** Posição inicial da câmera */
  cameraPosition?: [number, number, number];
  fov?: number;
  /** Fallback pintado enquanto o WebGL não montou (e em SSR) */
  fallbackClassName?: string;
};

/**
 * Palco WebGL único por seção: monta só no cliente, só quando perto da
 * viewport, e congela o frameloop quando a seção sai da tela.
 */
export function Stage({
  children,
  className,
  cameraPosition = [0, 0, 6],
  fov = 50,
  fallbackClassName = "bg-background",
}: StageProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const inView = useInViewport(hostRef, "300px");
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [dpr, setDpr] = useState<[number, number]>([1, 1.5]);

  useEffect(() => {
    setDpr(adaptiveDpr());
    setMounted(true);
  }, []);

  // Uma vez montado, mantemos o contexto vivo mas paramos de renderizar fora da tela.
  const [everInView, setEverInView] = useState(false);
  useEffect(() => {
    if (inView) setEverInView(true);
  }, [inView]);

  return (
    <div ref={hostRef} className={className}>
      {mounted && everInView ? (
        <Canvas
          dpr={dpr}
          frameloop={inView ? "always" : "never"}
          camera={{ position: cameraPosition, fov }}
          gl={{ antialias: !reduced, powerPreference: "high-performance", alpha: true }}
          className="h-full w-full"
        >
          <Suspense fallback={null}>{children}</Suspense>
        </Canvas>
      ) : (
        <div className={`h-full w-full ${fallbackClassName}`} aria-hidden />
      )}
    </div>
  );
}
