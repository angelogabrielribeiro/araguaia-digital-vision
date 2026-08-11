import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import { DepthField } from "./DepthField";

/**
 * Cenário espacial estável para a seção de serviços: profundidade,
 * partículas, núcleo e conexões. SEM OrbitControls, SEM autoRotate,
 * SEM zoom de câmera — a seleção de serviços acontece em DOM por cima.
 */

const NODE_POSITIONS: [number, number, number][] = [
  [-3.4, 1.35, -0.6],
  [-1.4, -1.6, 1.4],
  [1.5, 1.75, -1.6],
  [3.4, -0.75, 0.4],
  [0.2, 0.1, -3.0],
];

function Connections() {
  const ref = useRef<THREE.LineSegments>(null);

  const geometry = useMemo(() => {
    const pts: number[] = [];
    NODE_POSITIONS.forEach((p) => pts.push(0, 0, 0, ...p));
    for (let i = 0; i < NODE_POSITIONS.length; i++) {
      pts.push(...NODE_POSITIONS[i]!, ...NODE_POSITIONS[(i + 1) % NODE_POSITIONS.length]!);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, []);

  useFrame((state) => {
    const m = ref.current?.material as THREE.LineBasicMaterial | undefined;
    if (m) m.opacity = 0.16 + Math.sin(state.clock.elapsedTime * 0.9) * 0.06;
  });

  return (
    <lineSegments ref={ref} geometry={geometry}>
      <lineBasicMaterial color="#5fc8ff" transparent opacity={0.18} depthWrite={false} />
    </lineSegments>
  );
}

function Nodes({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!group.current || reduced) return;
    const t = state.clock.elapsedTime;
    group.current.children.forEach((child, i) => {
      const base = NODE_POSITIONS[i];
      if (!base) return;
      child.position.y = base[1] + Math.sin(t * 0.6 + i) * 0.12;
    });
  });

  return (
    <group ref={group}>
      {NODE_POSITIONS.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.09, 16, 16]} />
          <meshBasicMaterial
            color={new THREE.Color().setHSL(0.55 - i * 0.03, 0.8, 0.68)}
            transparent
            opacity={0.85}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function Core({ reduced }: { reduced: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * (reduced ? 0.03 : 0.12);
    ref.current.rotation.x += delta * (reduced ? 0.01 : 0.05);
  });
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[0.7, 1]} />
      <meshStandardMaterial
        color="#0e2136"
        emissive="#2e8fd0"
        emissiveIntensity={0.5}
        roughness={0.25}
        metalness={0.6}
        wireframe
      />
    </mesh>
  );
}

/** Paralaxe MUITO leve de ponteiro, sem aproximar do core. */
function StableParallax({ reduced }: { reduced: boolean }) {
  const base = useRef<THREE.Vector3 | null>(null);
  useFrame((state) => {
    const cam = state.camera;
    if (!base.current) base.current = cam.position.clone();
    const b = base.current;
    const k = reduced ? 0.02 : 0.06;
    cam.position.x += (b.x + state.pointer.x * 0.45 - cam.position.x) * k;
    cam.position.y += (b.y + state.pointer.y * 0.25 - cam.position.y) * k;
    cam.position.z = b.z; // profundidade travada: nada de zoom
    cam.lookAt(0, 0, 0);
  });
  return null;
}

export function ServiceSpace({ reduced = false }: { reduced?: boolean }) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[4, 5, 5]} intensity={45} color="#7fd4ff" distance={30} />
      <pointLight position={[-5, -3, -4]} intensity={30} color="#5fe0a8" distance={30} />
      <DepthField count={reduced ? 450 : 1500} radius={14} reduced={reduced} parallax={false} />
      <Core reduced={reduced} />
      <Connections />
      <Nodes reduced={reduced} />
      <StableParallax reduced={reduced} />
    </>
  );
}
