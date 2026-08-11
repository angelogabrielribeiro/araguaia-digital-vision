import { Billboard, Html, OrbitControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Link } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";

import { services } from "@/config/site";

import { DepthField } from "./DepthField";

/**
 * Espaço 3D explorável: cada serviço é um nó posicionado no volume,
 * ligado ao centro por linhas de energia. Arrastar gira o espaço,
 * passar o cursor destaca o nó, clicar abre a página do serviço.
 */

const NODE_POSITIONS: [number, number, number][] = [
  [-3.1, 1.15, 0.4],
  [-1.1, -1.35, 2.1],
  [1.3, 1.55, -1.2],
  [3.1, -0.55, 0.9],
  [0.2, 0.15, -2.6],
];

function Connections({ reduced }: { reduced: boolean }) {
  const ref = useRef<THREE.LineSegments>(null);

  const geometry = useMemo(() => {
    const pts: number[] = [];
    NODE_POSITIONS.forEach((p) => {
      pts.push(0, 0, 0, ...p);
    });
    for (let i = 0; i < NODE_POSITIONS.length; i++) {
      const a = NODE_POSITIONS[i]!;
      const b = NODE_POSITIONS[(i + 1) % NODE_POSITIONS.length]!;
      pts.push(...a, ...b);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, []);

  useFrame((state) => {
    const m = ref.current?.material as THREE.LineBasicMaterial | undefined;
    if (m) m.opacity = reduced ? 0.28 : 0.22 + Math.sin(state.clock.elapsedTime * 1.1) * 0.08;
  });

  return (
    <lineSegments ref={ref} geometry={geometry}>
      <lineBasicMaterial color="#5fc8ff" transparent opacity={0.25} depthWrite={false} />
    </lineSegments>
  );
}

function Core({ reduced }: { reduced: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * (reduced ? 0.05 : 0.22);
    ref.current.rotation.x += delta * (reduced ? 0.02 : 0.09);
  });
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[0.62, 1]} />
      <meshStandardMaterial
        color="#0e2136"
        emissive="#2e8fd0"
        emissiveIntensity={0.45}
        roughness={0.25}
        metalness={0.6}
        wireframe
      />
    </mesh>
  );
}

function ServiceNode({
  position,
  index,
  reduced,
}: {
  position: [number, number, number];
  index: number;
  reduced: boolean;
}) {
  const service = services[index]!;
  const [hovered, setHovered] = useState(false);
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    const float = reduced ? 0 : Math.sin(t * 0.7 + index) * 0.14;
    group.current.position.set(position[0], position[1] + float, position[2]);
    const target = hovered ? 1.14 : 1;
    group.current.scale.lerp(new THREE.Vector3(target, target, target), 0.12);
  });

  const color = new THREE.Color().setHSL(service.hue / 360, 0.6, 0.6);

  return (
    <group ref={group} position={position}>
      <Billboard>
        <mesh
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            setHovered(false);
            document.body.style.cursor = "auto";
          }}
        >
          <circleGeometry args={[0.42, 40]} />
          <meshBasicMaterial color={color} transparent opacity={hovered ? 0.35 : 0.16} />
        </mesh>
        <mesh>
          <ringGeometry args={[0.44, 0.47, 48]} />
          <meshBasicMaterial color={color} transparent opacity={hovered ? 0.95 : 0.5} />
        </mesh>
        <Html
          center
          distanceFactor={7}
          position={[0, -1.0, 0]}
          zIndexRange={[20, 0]}
          style={{ pointerEvents: "auto" }}
        >
          <Link
            to={service.path}
            {...(service.hash ? { hash: service.hash } : {})}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            className="block w-52 rounded-lg border border-border bg-background/85 px-3 py-2 text-center backdrop-blur transition-colors hover:border-primary/70"
          >
            <span className="block font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
              0{index + 1}
            </span>
            <span className="block text-sm font-medium text-foreground">{service.label}</span>
            <span className="mt-0.5 block text-[11px] leading-snug text-muted-foreground">
              {service.tagline}
            </span>
          </Link>
        </Html>
      </Billboard>
    </group>
  );
}

export function ServiceSpace({ reduced = false }: { reduced?: boolean }) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[4, 5, 5]} intensity={45} color="#7fd4ff" distance={30} />
      <pointLight position={[-5, -3, -4]} intensity={30} color="#5fe0a8" distance={30} />
      <DepthField count={reduced ? 500 : 1600} radius={13} reduced={reduced} />
      <Core reduced={reduced} />
      <Connections reduced={reduced} />
      {NODE_POSITIONS.map((p, i) => (
        <ServiceNode key={i} position={p} index={i} reduced={reduced} />
      ))}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={!reduced}
        autoRotateSpeed={0.45}
        rotateSpeed={0.5}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={(Math.PI * 2) / 3}
      />
    </>
  );
}
