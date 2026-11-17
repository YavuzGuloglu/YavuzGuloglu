// Procedural shaders: no textures to download, every planet is generated
// from 3D noise on the GPU.

const noise = /* glsl */ `
  #ifndef FBM_OCTAVES
  #define FBM_OCTAVES 5
  #endif
  float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }
  float noise(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash(i + vec3(0, 0, 0)), hash(i + vec3(1, 0, 0)), f.x),
          mix(hash(i + vec3(0, 1, 0)), hash(i + vec3(1, 1, 0)), f.x), f.y),
      mix(mix(hash(i + vec3(0, 0, 1)), hash(i + vec3(1, 0, 1)), f.x),
          mix(hash(i + vec3(0, 1, 1)), hash(i + vec3(1, 1, 1)), f.x), f.y),
      f.z);
  }
  float fbm(vec3 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < FBM_OCTAVES; i++) {
      v += a * noise(p);
      p = p * 2.03 + vec3(1.7, 9.2, 3.1);
      a *= 0.5;
    }
    return v;
  }
`;

export const planetVertex = /* glsl */ `
  varying vec3 vObjPos;
  varying vec3 vWorldPos;
  varying vec3 vWorldNormal;
  void main() {
    vObjPos = position;
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

export const planetFragment = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;
  uniform vec3 uAtmo;
  uniform float uType;   // 0 rocky, 1 gas, 2 ice
  uniform float uTime;
  uniform float uSeed;
  uniform float uHover;
  varying vec3 vObjPos;
  varying vec3 vWorldPos;
  varying vec3 vWorldNormal;
  ${noise}
  void main() {
    vec3 p = normalize(vObjPos);
    vec3 s = vec3(uSeed);
    float n;
    if (uType > 0.5 && uType < 1.5) {
      float warp = fbm(p * 3.0 + s + vec3(uTime * 0.03, 0.0, 0.0));
      float bands = sin((p.y * 5.0 + warp * 2.2) * 3.14159);
      n = bands * 0.5 + 0.5;
      n = mix(n, fbm(p * 8.0 + s), 0.25);
    } else {
      n = fbm(p * 2.2 + s + fbm(p * 4.0 + s) * 0.9);
    }
    vec3 col = mix(uColorA, uColorB, smoothstep(0.32, 0.62, n));
    col = mix(col, uColorC, smoothstep(0.62, 0.86, n));
    if (uType > 1.5) {
      // ice caps
      col = mix(col, uColorC, smoothstep(0.7, 0.95, abs(p.y) + n * 0.15));
    }

    vec3 N = normalize(vWorldNormal);
    vec3 L = normalize(-vWorldPos);            // the sun sits at the origin
    vec3 V = normalize(cameraPosition - vWorldPos);
    float ndl = dot(N, L);
    float day = smoothstep(-0.25, 0.9, ndl);
    float rim = pow(1.0 - max(dot(N, V), 0.0), 2.5);

    vec3 lit = col * (0.05 + day * 1.15);
    lit += uAtmo * rim * (0.2 + 0.8 * day);
    lit += uAtmo * uHover * 0.18;
    gl_FragColor = vec4(lit, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

export const atmosphereVertex = /* glsl */ `
  varying vec3 vViewNormal;
  varying vec3 vWorldPos;
  varying vec3 vWorldNormal;
  void main() {
    vViewNormal = normalize(normalMatrix * normal);
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

export const atmosphereFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uIntensity;
  varying vec3 vViewNormal;
  varying vec3 vWorldPos;
  varying vec3 vWorldNormal;
  void main() {
    float glow = pow(max(0.72 - dot(vViewNormal, vec3(0.0, 0.0, 1.0)), 0.0), 2.2);
    float day = smoothstep(-0.4, 0.6, dot(normalize(vWorldNormal), normalize(-vWorldPos)));
    gl_FragColor = vec4(uColor * glow * uIntensity * (0.35 + 0.65 * day), glow);
    #include <colorspace_fragment>
  }
`;

export const sunVertex = /* glsl */ `
  varying vec3 vObjPos;
  varying vec3 vViewNormal;
  void main() {
    vObjPos = position;
    vViewNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const sunFragment = /* glsl */ `
  uniform float uTime;
  uniform float uHover;
  varying vec3 vObjPos;
  varying vec3 vViewNormal;
  ${noise}
  void main() {
    vec3 p = normalize(vObjPos);
    float t = uTime * 0.08;
    float n = fbm(p * 3.0 + vec3(t, -t * 0.7, t * 0.4) + fbm(p * 6.0 - vec3(t)) * 1.2);
    vec3 deep = vec3(0.9, 0.22, 0.03);
    vec3 mid = vec3(1.0, 0.55, 0.12);
    vec3 hot = vec3(1.0, 0.92, 0.65);
    vec3 col = mix(deep, mid, smoothstep(0.3, 0.55, n));
    col = mix(col, hot, smoothstep(0.55, 0.8, n));
    float edge = 1.0 - max(dot(vViewNormal, vec3(0.0, 0.0, 1.0)), 0.0);
    col += vec3(1.0, 0.45, 0.1) * pow(edge, 2.0) * 0.8;
    gl_FragColor = vec4(col * (1.5 + uHover * 0.5), 1.0);
  }
`;

export const coronaFragment = /* glsl */ `
  uniform float uTime;
  varying vec3 vViewNormal;
  void main() {
    float glow = pow(max(0.78 - dot(vViewNormal, vec3(0.0, 0.0, 1.0)), 0.0), 2.6);
    vec3 col = vec3(1.0, 0.5, 0.15) * glow * (1.1 + sin(uTime * 0.8) * 0.1);
    gl_FragColor = vec4(col, glow);
  }
`;

export const ringVertex = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorldPos;
  varying vec3 vLocal;
  void main() {
    vUv = uv;
    vLocal = position;
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

export const ringFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uInner;
  uniform float uOuter;
  varying vec3 vLocal;
  varying vec3 vWorldPos;
  ${noise}
  void main() {
    float r = (length(vLocal.xy) - uInner) / (uOuter - uInner);
    float bands = noise(vec3(r * 40.0, 0.0, 0.0)) * 0.6 + noise(vec3(r * 120.0, 3.0, 0.0)) * 0.4;
    float fade = smoothstep(0.0, 0.08, r) * smoothstep(1.0, 0.75, r);
    float a = bands * fade * 0.7;
    float light = 0.45 + 0.55 * smoothstep(-0.5, 0.5, dot(normalize(-vWorldPos), vec3(0.0, 1.0, 0.0)) + 0.5);
    gl_FragColor = vec4(uColor * (0.6 + bands * 0.6) * light, a);
    #include <colorspace_fragment>
  }
`;

export const nebulaVertex = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = normalize(position);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const nebulaFragment = /* glsl */ `
  varying vec3 vDir;
  ${noise}
  void main() {
    vec3 d = normalize(vDir);
    float n = fbm(d * 2.5 + fbm(d * 4.0) * 1.5);
    float band = exp(-pow(d.y * 2.2 + 0.3, 2.0));
    vec3 a = vec3(0.10, 0.04, 0.22);
    vec3 b = vec3(0.02, 0.10, 0.20);
    vec3 col = mix(a, b, smoothstep(0.3, 0.7, n)) * smoothstep(0.35, 0.8, n) * (0.75 + band * 0.8);
    gl_FragColor = vec4(col * 0.2, 1.0);
    #include <colorspace_fragment>
  }
`;

/** Cheaper noise for phones and other low-power GPUs. */
export const LOW_POWER_DEFINES = { FBM_OCTAVES: 3 };
