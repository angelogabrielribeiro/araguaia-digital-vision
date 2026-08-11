import { Environment, Html, OrbitControls, Sphere } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Suspense, type CSSProperties, useMemo, useRef } from "react";
import * as THREE from "three";

import { services, type ServiceDef } from "@/config/site";
import { useReducedMotion } from "@/lib/motion";

type CardPosition = {
  position: [number, number, number];
  rotationZ: number;
};

/*
 * Os cards ficam numa concha espacial ao redor da câmera. A câmera começa
 * perto do centro dessa concha, então a sensação é de olhar de dentro do
 * espaço, sem qualquer aproximação automática.
 */
const POSITIONS: CardPosition[] = [
  { position: [-3.25, 1.85, -6.9], rotationZ: -0.06 },
  { position: [2.95, 2.25, -8.5], rotationZ: 0.045 },
  { position: [-3.75, -1.75, -9.4], rotationZ: 0.035 },
  { position: [3.55, -1.55, -7.35], rotationZ: -0.045 },
  { position: [0.25, 3.45, -10.7], rotationZ: 0.018 },
];

function Starfield({ reduced }: { reduced: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const geometry = useMemo(() => {
    const mobile = typeof window !== "undefined" && window.innerWidth < 768;
    const count = reduced ? 2600 : mobile ? 5600 : 11000;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const theta = i * 2.399963229728653;
      const radius = 8 + ((i * 37) % 1000) / 24;
      const spreadY = (((i * 91) % 1000) / 1000 - 0.5) * 34;
      positions[i * 3] = Math.cos(theta) * radius;
      positions[i * 3 + 1] = spreadY;
      positions[i * 3 + 2] = Math.sin(theta) * radius - 2;
    }

    const next = new THREE.BufferGeometry();
    next.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return next;
  }, [reduced]);

  useFrame((_, delta) => {
    if (!ref.current || reduced) return;
    ref.current.rotation.y += delta * 0.0035;
    ref.current.rotation.x += delta * 0.0009;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial color="#dff7ff" size={0.055} transparent opacity={0.72} sizeAttenuation />
    </points>
  );
}

function AmbientFragments({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const fragments = useMemo(
    () =>
      Array.from({ length: reduced ? 6 : 14 }, (_, i) => ({
        position: [
          Math.sin(i * 2.31) * (5.4 + (i % 3) * 1.7),
          Math.cos(i * 1.73) * (2.4 + (i % 4) * 0.75),
          -6.5 - (i % 6) * 1.6,
        ] as [number, number, number],
        scale: 0.16 + (i % 4) * 0.055,
      })),
    [reduced],
  );

  useFrame((_, delta) => {
    if (!group.current || reduced) return;
    group.current.rotation.z += delta * 0.002;
  });

  return (
    <group ref={group}>
      {fragments.map((fragment, index) => (
        <mesh key={index} position={fragment.position} rotation={[0.4, index * 0.7, index * 0.2]} scale={fragment.scale}>
          <octahedronGeometry args={[1, 0]} />
          <meshBasicMaterial color={index % 3 === 0 ? "#7ad9ff" : "#89a7b4"} wireframe transparent opacity={0.22} />
        </mesh>
      ))}
    </group>
  );
}

function FloatingServiceCard({
  service,
  index,
  cardPosition,
  reduced,
}: {
  service: ServiceDef;
  index: number;
  cardPosition: CardPosition;
  reduced: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ camera, clock }) => {
    if (!groupRef.current) return;
    groupRef.current.lookAt(camera.position);
    if (!reduced) {
      groupRef.current.position.y =
        cardPosition.position[1] + Math.sin(clock.elapsedTime * 0.5 + index * 1.17) * 0.13;
    }
  });

  return (
    <group
      ref={groupRef}
      position={cardPosition.position}
      rotation={[0, 0, cardPosition.rotationZ]}
    >
      <Html
        transform
        distanceFactor={7.7}
        position={[0, 0, 0]}
        style={{ pointerEvents: "auto" }}
      >
        <Link
          to={service.path}
          {...(service.hash ? { hash: service.hash } : {})}
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) => event.stopPropagation()}
          className="stellar-service-link"
          aria-label={`Abrir ${service.title}`}
        >
          <article
            className="stellar-service-card"
            style={
              {
                "--service-hue": service.hue,
                "--service-accent": service.accent,
              } as CSSProperties
            }
          >
            <div className="stellar-service-visual" aria-hidden="true">
              <span className="stellar-orbit stellar-orbit-a" />
              <span className="stellar-orbit stellar-orbit-b" />
              <span className="stellar-core">0{index + 1}</span>
              <span className="stellar-scan" />
            </div>
            <div className="stellar-service-copy">
              <small>{service.label}</small>
              <strong>{service.title}</strong>
              <span>
                explorar <ArrowUpRight size={12} />
              </span>
            </div>
          </article>
        </Link>
      </Html>
    </group>
  );
}

function GalaxyScene({ reduced }: { reduced: boolean }) {
  return (
    <>
      <color attach="background" args={["#010306"]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[6, 7, 1]} intensity={28} color="#6fd8ff" distance={30} />
      <pointLight position={[-7, -5, -2]} intensity={20} color="#72ddb8" distance={30} />
      <Environment preset="night" />

      <Starfield reduced={reduced} />
      <AmbientFragments reduced={reduced} />

      <Sphere args={[6.1, 48, 48]} position={[0, 0, -5.8]}>
        <meshBasicMaterial color="#59c9df" transparent opacity={0.035} wireframe />
      </Sphere>
      <Sphere args={[9.4, 48, 48]} position={[0, 0, -6.1]}>
        <meshBasicMaterial color="#4da5c7" transparent opacity={0.018} wireframe />
      </Sphere>

      {services.map((service, index) => (
        <FloatingServiceCard
          key={service.key}
          service={service}
          index={index}
          cardPosition={POSITIONS[index]!}
          reduced={reduced}
        />
      ))}

      <OrbitControls
        enableRotate
        enablePan={false}
        enableZoom={false}
        autoRotate={false}
        rotateSpeed={0.42}
        target={[0, 0, 0]}
        minPolarAngle={0.45}
        maxPolarAngle={2.7}
      />
    </>
  );
}

export function ServiceConstellation() {
  const reduced = useReducedMotion();

  return (
    <div className="relative h-[660px] w-full overflow-hidden sm:h-[760px] lg:h-[820px]">
      <Canvas
        camera={{ position: [0, 0.08, 1.45], fov: 64, near: 0.08, far: 120 }}
        dpr={[1, 1.45]}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          <GalaxyScene reduced={reduced} />
        </Suspense>
      </Canvas>

      <div className="pointer-events-none absolute left-5 top-5 z-10 sm:left-8 sm:top-8">
        <p className="font-mono text-[9px] tracking-[0.2em] text-white/55 uppercase">
          serviços · arraste para explorar
        </p>
      </div>

      <div className="pointer-events-none absolute inset-x-5 bottom-5 z-10 flex justify-center sm:justify-end sm:px-3">
        <span className="rounded-full border border-white/10 bg-black/35 px-3 py-1.5 font-mono text-[8px] tracking-[0.15em] text-white/45 uppercase backdrop-blur-md">
          arraste para olhar · toque no card · sem zoom automático
        </span>
      </div>
    </div>
  );
}
