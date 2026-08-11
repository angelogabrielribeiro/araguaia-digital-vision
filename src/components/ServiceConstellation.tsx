import { Environment, Html, OrbitControls, Plane, Sphere } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Link } from "@tanstack/react-router";
import { ArrowRight, X } from "lucide-react";
import { Suspense, type CSSProperties, useMemo, useRef, useState } from "react";
import * as THREE from "three";

import { services, type ServiceDef } from "@/config/site";
import { useReducedMotion } from "@/lib/motion";

type CardPosition = {
  position: [number, number, number];
  rotationZ: number;
};

const POSITIONS: CardPosition[] = [
  { position: [-4.6, 2.2, 1.5], rotationZ: -0.07 },
  { position: [4.5, 1.7, -2.8], rotationZ: 0.05 },
  { position: [-4.0, -2.3, -3.4], rotationZ: 0.04 },
  { position: [4.1, -2.0, 1.3], rotationZ: -0.05 },
  { position: [0.2, 3.6, -5.2], rotationZ: 0.02 },
];

function Starfield({ reduced }: { reduced: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const geometry = useMemo(() => {
    const mobile = typeof window !== "undefined" && window.innerWidth < 768;
    const count = reduced ? 2400 : mobile ? 5200 : 10000;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const theta = i * 2.399963229728653;
      const radius = 12 + ((i * 37) % 1000) / 22;
      const spreadY = (((i * 91) % 1000) / 1000 - 0.5) * 38;
      positions[i * 3] = Math.cos(theta) * radius;
      positions[i * 3 + 1] = spreadY;
      positions[i * 3 + 2] = Math.sin(theta) * radius;
    }

    const next = new THREE.BufferGeometry();
    next.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return next;
  }, [reduced]);

  useFrame((_, delta) => {
    if (!ref.current || reduced) return;
    ref.current.rotation.y += delta * 0.008;
    ref.current.rotation.x += delta * 0.0018;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial color="#dff7ff" size={0.06} transparent opacity={0.72} sizeAttenuation />
    </points>
  );
}

function ServiceCard3D({
  service,
  index,
  cardPosition,
  onOpen,
}: {
  service: ServiceDef;
  index: number;
  cardPosition: CardPosition;
  onOpen: (service: ServiceDef) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(({ camera, clock }) => {
    if (!groupRef.current) return;
    groupRef.current.lookAt(camera.position);
    groupRef.current.position.y =
      cardPosition.position[1] + Math.sin(clock.elapsedTime * 0.58 + index * 1.2) * 0.16;
  });

  return (
    <group
      ref={groupRef}
      position={cardPosition.position}
      rotation={[0, 0, cardPosition.rotationZ]}
    >
      <Plane
        args={[4.8, 5.9]}
        onClick={(event) => {
          event.stopPropagation();
          onOpen(service);
        }}
        onPointerOver={(event) => {
          event.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={(event) => {
          event.stopPropagation();
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
      >
        <meshBasicMaterial transparent opacity={0} />
      </Plane>

      <Html
        transform
        distanceFactor={10}
        position={[0, 0, 0.01]}
        style={{
          pointerEvents: "none",
          transition: "transform .28s ease, filter .28s ease",
          transform: hovered ? "scale(1.13)" : "scale(1)",
          filter: hovered ? "drop-shadow(0 24px 40px rgba(91,199,255,.3))" : "none",
        }}
      >
        <article
          className="stellar-service-card"
          style={{ "--service-hue": service.hue } as CSSProperties}
        >
          <div className="stellar-service-visual" aria-hidden="true">
            <span className="stellar-orbit stellar-orbit-a" />
            <span className="stellar-orbit stellar-orbit-b" />
            <span className="stellar-core">0{index + 1}</span>
          </div>
          <div className="stellar-service-copy">
            <span>{service.label}</span>
            <strong>{service.title}</strong>
            <small>{service.tagline}</small>
          </div>
        </article>
      </Html>
    </group>
  );
}

function GalaxyScene({ reduced, onOpen }: { reduced: boolean; onOpen: (service: ServiceDef) => void }) {
  return (
    <>
      <color attach="background" args={["#010407"]} />
      <ambientLight intensity={0.55} />
      <pointLight position={[8, 8, 7]} intensity={38} color="#74d2ff" distance={35} />
      <pointLight position={[-9, -6, -5]} intensity={26} color="#6be6be" distance={35} />
      <Environment preset="night" />

      <Starfield reduced={reduced} />

      <Sphere args={[2.1, 32, 32]}>
        <meshStandardMaterial color="#10233b" transparent opacity={0.16} wireframe />
      </Sphere>
      <Sphere args={[7.2, 32, 32]}>
        <meshStandardMaterial color="#4bc7e3" transparent opacity={0.045} wireframe />
      </Sphere>
      <Sphere args={[10.5, 32, 32]}>
        <meshStandardMaterial color="#4bc7e3" transparent opacity={0.025} wireframe />
      </Sphere>

      {services.map((service, index) => (
        <ServiceCard3D
          key={service.key}
          service={service}
          index={index}
          cardPosition={POSITIONS[index]!}
          onOpen={onOpen}
        />
      ))}

      <OrbitControls
        enableRotate
        enablePan
        enableZoom={false}
        autoRotate={false}
        rotateSpeed={0.52}
        panSpeed={0.68}
        target={[0, 0, 0]}
      />
    </>
  );
}

function ServiceModal({ service, onClose }: { service: ServiceDef | null; onClose: () => void }) {
  if (!service) return null;

  return (
    <div
      className="stellar-service-modal-backdrop"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="stellar-service-modal" style={{ "--service-hue": service.hue } as CSSProperties}>
        <button type="button" onClick={onClose} aria-label="Fechar serviço" className="stellar-service-close">
          <X className="h-4 w-4" />
        </button>
        <span className="font-mono text-[10px] tracking-[0.2em] text-tech uppercase">Área de atendimento</span>
        <h3>{service.title}</h3>
        <p>{service.summary}</p>
        <ul>
          {service.items.slice(0, 4).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <Link
          to={service.path}
          {...(service.hash ? { hash: service.hash } : {})}
          onClick={onClose}
          className="stellar-service-open"
        >
          Abrir serviço <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

export function ServiceConstellation() {
  const reduced = useReducedMotion();
  const [selected, setSelected] = useState<ServiceDef | null>(null);

  return (
    <div className="relative h-[760px] w-full overflow-hidden sm:h-[820px] lg:h-[900px]">
      <Canvas
        camera={{ position: [0, 0.1, 15], fov: 58, near: 0.1, far: 120 }}
        dpr={[1, 1.55]}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          <GalaxyScene reduced={reduced} onOpen={setSelected} />
        </Suspense>
      </Canvas>

      <div className="pointer-events-none absolute inset-x-5 top-5 z-10 sm:top-8 lg:left-8 lg:right-auto lg:w-[430px]">
        <p className="eyebrow">Mapa espacial de serviços</p>
        <h3 className="mt-2 font-display text-3xl leading-tight text-foreground sm:text-4xl">
          Arraste o espaço. Explore a profundidade. Escolha o card.
        </h3>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
          A câmera gira e desloca livremente, mas não aproxima nem afasta. O zoom foi desligado de propósito para não puxar você para o centro da cena.
        </p>
      </div>

      <div className="pointer-events-none absolute inset-x-5 bottom-5 z-10 flex justify-center lg:justify-end">
        <span className="rounded-full border border-white/10 bg-black/45 px-4 py-2 font-mono text-[9px] tracking-[0.16em] text-white/55 uppercase backdrop-blur-md">
          arraste para olhar · clique nos cards · zoom bloqueado
        </span>
      </div>

      <ServiceModal service={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
