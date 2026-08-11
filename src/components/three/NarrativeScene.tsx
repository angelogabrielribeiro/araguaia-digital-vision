import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import { DepthField } from "./DepthField";

export type NarrativeMode = "nodes" | "exploded" | "flow" | "ledger";

/**
 * Cena narrativa única, quatro comportamentos. Uma só geometria
 * instanciada por cena: o scroll interpola entre um estado "problema"
 * e um estado "resolvido", cada modo com sua leitura visual.
 */

const COUNT = 220;
const dummy = new THREE.Object3D();
const tmpColor = new THREE.Color();

type Layout = { chaos: THREE.Vector3; order: THREE.Vector3; spin: number; tint: number };

function buildLayout(mode: NarrativeMode): Layout[] {
  const out: Layout[] = [];
  const rnd = (n: number) => (Math.sin(n * 12.9898) * 43758.5453) % 1;

  for (let i = 0; i < COUNT; i++) {
    const r1 = Math.abs(rnd(i + 1));
    const r2 = Math.abs(rnd(i + 7.3));
    const r3 = Math.abs(rnd(i + 19.7));

    const chaos = new THREE.Vector3(
      (r1 - 0.5) * 9.5,
      (r2 - 0.5) * 6.5,
      (r3 - 0.5) * 6 - 1.0,
    );

    let order: THREE.Vector3;
    if (mode === "nodes") {
      // malha de infraestrutura: grade regular com leve relevo
      const cols = 20;
      const x = (i % cols) - cols / 2;
      const y = Math.floor(i / cols) - COUNT / cols / 2;
      order = new THREE.Vector3(x * 0.62, y * 0.62, Math.sin(x * 0.7 + y * 0.5) * 0.5);
    } else if (mode === "exploded") {
      // vista explodida: camadas de um equipamento se separando
      const layer = i % 5;
      const inLayer = Math.floor(i / 5);
      const ang = (inLayer / (COUNT / 5)) * Math.PI * 2;
      const rad = 1.4 + layer * 0.55;
      order = new THREE.Vector3(
        Math.cos(ang) * rad,
        (layer - 2) * 1.15,
        Math.sin(ang) * rad * 0.75,
      );
    } else if (mode === "flow") {
      // fluxo financeiro: colunas legíveis crescendo em ordem
      const cols = 22;
      const c = i % cols;
      const row = Math.floor(i / cols);
      const h = 0.4 + Math.abs(Math.sin(c * 0.8)) * 2.4;
      order = new THREE.Vector3(
        (c - cols / 2) * 0.56,
        -2.2 + (row * 0.5 + h * 0.35),
        row * -0.7,
      );
    } else {
      // razão contábil: linhas e colunas de um livro organizado
      const cols = 11;
      const c = i % cols;
      const row = Math.floor(i / cols);
      order = new THREE.Vector3((c - cols / 2) * 0.95, 2.6 - row * 0.55, (c % 2) * 0.18);
    }

    out.push({ chaos, order, spin: (r1 - 0.5) * 6, tint: r2 });
  }
  return out;
}

export function NarrativeScene({
  mode,
  hue,
  progressRef,
  reduced = false,
}: {
  mode: NarrativeMode;
  hue: number;
  /** 0 = caos, 1 = ordem */
  progressRef: React.MutableRefObject<number>;
  reduced?: boolean;
}) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const layout = useMemo(() => buildLayout(mode), [mode]);
  const eased = useRef(0);

  const geometry = useMemo(() => {
    switch (mode) {
      case "nodes":
        return new THREE.OctahedronGeometry(0.2, 0);
      case "exploded":
        return new THREE.BoxGeometry(0.58, 0.08, 0.4);
      case "flow":
        return new THREE.BoxGeometry(0.34, 0.34, 0.34);
      default:
        return new THREE.BoxGeometry(0.8, 0.11, 0.11);
    }
  }, [mode]);

  useFrame((state, delta) => {
    const m = mesh.current;
    if (!m) return;
    const target = THREE.MathUtils.clamp(progressRef.current, 0, 1);
    eased.current += (target - eased.current) * Math.min(1, delta * 3.2);
    const p = eased.current;
    const smooth = p * p * (3 - 2 * p);
    const t = state.clock.elapsedTime;

    for (let i = 0; i < COUNT; i++) {
      const l = layout[i]!;
      const wobble = reduced ? 0 : (1 - smooth) * Math.sin(t * 0.8 + i) * 0.35;
      dummy.position.lerpVectors(l.chaos, l.order, smooth);
      dummy.position.y += wobble;
      const spin = l.spin * (1 - smooth);
      dummy.rotation.set(spin + (reduced ? 0 : t * 0.05 * (1 - smooth)), spin * 0.7, spin * 0.4);
      const s = 0.7 + smooth * 0.5;
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);

      const light = 0.55 + smooth * 0.2 + l.tint * 0.15;
      tmpColor.setHSL(((hue + (1 - smooth) * 40) % 360) / 360, 0.45 + smooth * 0.35, light);
      m.setColorAt(i, tmpColor);
    }
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;

    m.rotation.y = THREE.MathUtils.lerp(m.rotation.y, state.pointer.x * 0.28, 0.05);
    m.rotation.x = THREE.MathUtils.lerp(m.rotation.x, -state.pointer.y * 0.16, 0.05);
  });

  const accent = new THREE.Color().setHSL(hue / 360, 0.6, 0.6);

  return (
    <>
      <ambientLight intensity={1.9} />
      <directionalLight position={[3, 5, 4]} intensity={3.4} color={accent} />
      <directionalLight position={[-4, -2, -3]} intensity={1.6} color="#ffffff" />
      <pointLight position={[0, 0, 6]} intensity={60} distance={26} color={accent} />
      <DepthField count={reduced ? 320 : 900} radius={14} color={`#${accent.getHexString()}`} reduced={reduced} />
      <instancedMesh ref={mesh} args={[geometry, undefined, COUNT]} frustumCulled={false}>
        <meshStandardMaterial
          roughness={0.3}
          metalness={0.15}
          emissive={accent}
          emissiveIntensity={0.75}
          toneMapped={false}
        />
      </instancedMesh>
    </>
  );
}
