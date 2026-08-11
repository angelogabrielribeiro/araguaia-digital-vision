import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * Campo de partículas com profundidade real: dá volume ao hero e reage
 * ao ponteiro com paralaxe de câmera lenta.
 */
export function DepthField({
  count = 1400,
  radius = 9,
  color = "#8ad4ff",
  reduced = false,
  parallax = true,
}: {
  count?: number;
  radius?: number;
  color?: string;
  reduced?: boolean;
  /** quando false, não mexe na câmera (outro componente cuida disso) */
  parallax?: boolean;
}) {
  const points = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // distribuição em casca elíptica, mais densa perto do horizonte
      const theta = Math.random() * Math.PI * 2;
      const r = radius * (0.35 + Math.pow(Math.random(), 0.6) * 0.65);
      positions[i * 3] = Math.cos(theta) * r * 1.4;
      positions[i * 3 + 1] = (Math.random() - 0.55) * radius * 0.8;
      positions[i * 3 + 2] = Math.sin(theta) * r - radius * 0.3;
      sizes[i] = Math.random() * 0.05 + 0.012;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    return g;
  }, [count, radius]);

  useFrame((state, delta) => {
    if (!points.current) return;
    points.current.rotation.y += delta * (reduced ? 0.004 : 0.014);
    if (!parallax) return;
    const { pointer, camera } = state;
    camera.position.x += (pointer.x * 0.7 - camera.position.x) * (reduced ? 0.01 : 0.03);
    camera.position.y += (pointer.y * 0.4 - camera.position.y) * (reduced ? 0.01 : 0.03);
    camera.lookAt(0, 0, 0);
  });


  return (
    <points ref={points} geometry={geometry}>
      <pointsMaterial
        size={0.035}
        sizeAttenuation
        color={color}
        transparent
        opacity={0.75}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
