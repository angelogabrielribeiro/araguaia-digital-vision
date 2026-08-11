import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import {
  atmosphereFragment,
  atmosphereVertex,
  createAtmosphereUniforms,
} from "./atmosphereShader";

type Props = {
  hue: number;
  intensity?: number;
  /** 0..1 — progresso de scroll da seção que hospeda a cena */
  scrollRef?: React.MutableRefObject<number>;
  reduced?: boolean;
};

/**
 * Plano em espaço de tela com o shader procedural. Sem geometria pesada:
 * um único triângulo/plano cobrindo o frame.
 */
export function AtmospherePlane({ hue, intensity = 1, scrollRef, reduced }: Props) {
  const uniforms = useMemo(() => createAtmosphereUniforms(hue, intensity), [hue, intensity]);
  const pointerTarget = useRef(new THREE.Vector2(0, 0));
  const size = useThree((s) => s.size);

  useFrame((state, delta) => {
    uniforms.uResolution.value.set(size.width, size.height);
    uniforms.uTime.value += reduced ? delta * 0.15 : delta;
    pointerTarget.current.set(state.pointer.x, state.pointer.y);
    uniforms.uPointer.value.lerp(pointerTarget.current, reduced ? 0.02 : 0.045);
    if (scrollRef) uniforms.uScroll.value += (scrollRef.current - uniforms.uScroll.value) * 0.08;
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={atmosphereVertex}
        fragmentShader={atmosphereFragment}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}
