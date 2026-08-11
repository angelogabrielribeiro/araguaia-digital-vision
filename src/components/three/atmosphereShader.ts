import * as THREE from "three";

/**
 * Shader procedural compartilhado por todas as páginas: value noise + FBM
 * formando uma atmosfera digital viva. O uniform uHue troca a identidade
 * cromática por serviço sem recompilar a experiência inteira.
 */

export const atmosphereVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

export const atmosphereFragment = /* glsl */ `
  precision highp float;

  varying vec2 vUv;

  uniform vec2  uResolution;
  uniform float uTime;
  uniform vec2  uPointer;      // -1..1, suavizado
  uniform float uHue;          // graus
  uniform float uIntensity;    // 0..1
  uniform float uScroll;       // 0..1

  // --- value noise ---------------------------------------------------
  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float valueNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  float fbm(vec2 p) {
    float total = 0.0;
    float amp = 0.5;
    mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 5; i++) {
      total += valueNoise(p) * amp;
      p = rot * p * 2.02;
      amp *= 0.5;
    }
    return total;
  }

  vec3 hueToRgb(float h, float s, float l) {
    vec3 k = mod(vec3(0.0, 8.0, 4.0) + h / 30.0, 12.0);
    vec3 a = clamp(min(k - 3.0, 9.0 - k), -1.0, 1.0);
    return l - s * min(l, 1.0 - l) * a;
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / max(uResolution.y, 1.0);

    float t = uTime * 0.045;
    vec2 pointer = uPointer * 0.35;

    // deriva de camadas: profundidade sem geometria
    vec2 q = vec2(fbm(uv * 1.6 + vec2(t, -t * 0.7)), fbm(uv * 1.6 + vec2(4.3, 1.7) - t * 0.5));
    vec2 r = vec2(
      fbm(uv * 2.2 + 3.4 * q + vec2(1.7, 9.2) + t * 0.9 + pointer),
      fbm(uv * 2.2 + 3.4 * q + vec2(8.3, 2.8) - t * 0.6 - pointer)
    );
    float clouds = fbm(uv * 1.9 + 3.0 * r + uScroll * 0.6);

    // horizonte: densidade concentrada na faixa inferior
    float horizon = smoothstep(0.85, -0.35, uv.y + clouds * 0.25);

    // brilho seguindo o ponteiro, como uma fonte de luz suave
    float pl = length(uv - uPointer * vec2(0.75, 0.42));
    float pointerGlow = exp(-pl * 2.6) * 0.55;

    float density = clouds * horizon;

    vec3 deep    = hueToRgb(uHue + 20.0, 0.55, 0.10);
    vec3 mid     = hueToRgb(uHue,        0.62, 0.34);
    vec3 highlt  = hueToRgb(uHue - 26.0, 0.70, 0.66);

    vec3 col = mix(deep, mid, smoothstep(0.15, 0.75, density));
    col = mix(col, highlt, smoothstep(0.55, 1.05, density + pointerGlow * 0.9));
    col += highlt * pointerGlow * 0.5;

    // veios finos: leitura "de dado", não de nuvem genérica
    float veins = smoothstep(0.965, 1.0, sin((uv.y * 46.0) + clouds * 10.0 - uTime * 0.5) * 0.5 + 0.5);
    col += highlt * veins * 0.1;

    // vinheta e piso escuro para a tipografia respirar
    float vig = smoothstep(1.25, 0.25, length(uv * vec2(0.85, 1.25)));
    col *= mix(0.35, 1.0, vig);
    col *= uIntensity;

    // grão sutil evita banding em gradientes escuros
    col += (hash(gl_FragCoord.xy + uTime) - 0.5) * 0.016;

    gl_FragColor = vec4(col, 1.0);
  }
`;

export function createAtmosphereUniforms(hue: number, intensity = 1) {
  return {
    uResolution: { value: new THREE.Vector2(1, 1) },
    uTime: { value: 0 },
    uPointer: { value: new THREE.Vector2(0, 0) },
    uHue: { value: hue },
    uIntensity: { value: intensity },
    uScroll: { value: 0 },
  };
}
