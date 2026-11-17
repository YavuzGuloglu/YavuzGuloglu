import { Html, Stars } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing';
import { memo, useEffect, useMemo, useRef, type MutableRefObject, type RefObject } from 'react';
import * as THREE from 'three';
import { profile } from '../../data/profile';
import { Planet } from './Planet';
import { planets, SUN_RADIUS, type SectionId } from './sections';
import { coronaFragment, nebulaFragment, nebulaVertex, sunFragment, sunVertex } from './shaders';

type SceneProps = {
  selected: SectionId | null;
  hovered: SectionId | null;
  onHover: (id: SectionId | null) => void;
  onSelect: (id: SectionId | null) => void;
  compact: boolean;
  reducedMotion: boolean;
};

function Sun({ hovered, selected, onHover, onSelect }: Pick<SceneProps, 'hovered' | 'selected' | 'onHover' | 'onSelect'>) {
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uHover: { value: 0 } }), []);
  const corona = useMemo(() => ({ uTime: { value: 0 } }), []);
  const mesh = useRef<THREE.Mesh>(null);
  const active = hovered === 'about' || selected === 'about';

  useFrame((state, dt) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    corona.uTime.value = state.clock.elapsedTime;
    uniforms.uHover.value = THREE.MathUtils.damp(uniforms.uHover.value, active ? 1 : 0, 5, dt);
    if (mesh.current) mesh.current.rotation.y += dt * 0.03;
  });

  return (
    <group>
      <mesh
        ref={mesh}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover('about');
        }}
        onPointerOut={() => onHover(null)}
        onClick={(e) => {
          e.stopPropagation();
          onSelect('about');
        }}
      >
        <sphereGeometry args={[SUN_RADIUS, 96, 96]} />
        <shaderMaterial vertexShader={sunVertex} fragmentShader={sunFragment} uniforms={uniforms} toneMapped={false} />
      </mesh>
      <mesh scale={1.45} raycast={() => null}>
        <sphereGeometry args={[SUN_RADIUS, 64, 64]} />
        <shaderMaterial
          vertexShader={sunVertex}
          fragmentShader={coronaFragment}
          uniforms={corona}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          transparent
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      <pointLight intensity={2.6} decay={0} color="#ffd9a8" />
    </group>
  );
}

const SunLabel = memo(function SunLabel({ dimmed, portal }: { dimmed: boolean; portal: RefObject<HTMLElement> }) {
  return (
    <group position={[0, -(SUN_RADIUS + 1.15), 0]}>
      <Html center zIndexRange={[10, 0]} style={LABEL_STYLE} portal={portal}>
        <div className={`planet-label planet-label--sun ${dimmed ? 'is-dimmed' : ''}`}>
          <span className="planet-label__name">{profile.name}</span>
          <span className="planet-label__caption">{profile.title}</span>
        </div>
      </Html>
    </group>
  );
});

const LABEL_STYLE = { pointerEvents: 'none' } as const;

function AsteroidBelt({ inner, outer, count, timeScale }: { inner: number; outer: number; count: number; timeScale: MutableRefObject<number> }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const group = useRef<THREE.Group>(null);

  useEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const e = new THREE.Euler();
    const s = new THREE.Vector3();
    const p = new THREE.Vector3();
    // deterministic pseudo-random so the belt looks the same on every load
    let seed = 7;
    const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
    for (let i = 0; i < count; i++) {
      const a = rand() * Math.PI * 2;
      const r = inner + (outer - inner) * Math.pow(rand(), 0.8);
      p.set(Math.cos(a) * r, (rand() - 0.5) * 0.35, Math.sin(a) * r);
      e.set(rand() * 6, rand() * 6, rand() * 6);
      q.setFromEuler(e);
      const k = 0.02 + rand() * 0.06;
      s.set(k, k * (0.6 + rand() * 0.6), k);
      mesh.setMatrixAt(i, m.compose(p, q, s));
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, [inner, outer, count]);

  useFrame((_, dt) => {
    if (group.current) group.current.rotation.y += Math.min(dt, 0.05) * 0.02 * timeScale.current;
  });

  return (
    <group ref={group}>
      <instancedMesh ref={ref} args={[undefined, undefined, count]} raycast={() => null}>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#9a8f86" roughness={1} flatShading />
      </instancedMesh>
    </group>
  );
}

function Nebula() {
  return (
    <mesh raycast={() => null}>
      <sphereGeometry args={[180, 32, 32]} />
      <shaderMaterial vertexShader={nebulaVertex} fragmentShader={nebulaFragment} side={THREE.BackSide} depthWrite={false} />
    </mesh>
  );
}

const UP = new THREE.Vector3(0, 1, 0);

function CameraRig({
  selected,
  positions,
  compact,
}: {
  selected: SectionId | null;
  positions: MutableRefObject<Record<string, THREE.Vector3>>;
  compact: boolean;
}) {
  const { camera, pointer, size } = useThree();
  const target = useRef(new THREE.Vector3());
  const desiredPos = useRef(new THREE.Vector3());
  const desiredTarget = useRef(new THREE.Vector3());
  const outward = useRef(new THREE.Vector3());
  const right = useRef(new THREE.Vector3());
  const shift = useRef(new THREE.Vector3());
  const viewDir = useRef(new THREE.Vector3());
  const camRight = useRef(new THREE.Vector3());

  useEffect(() => {
    camera.position.set(0, 46, 90); // intro: start far away and glide in
  }, [camera]);

  useFrame((_, dt) => {
    const d = Math.min(dt, 0.05);
    if (!selected) {
      // pull back far enough that the outermost orbit fits the screen width
      const cam = camera as THREE.PerspectiveCamera;
      const tanHalf = Math.tan(THREE.MathUtils.degToRad(cam.fov / 2));
      const outer = planets[planets.length - 1].distance * (compact ? 0.72 : 1) + 1;
      const fitW = outer / (tanHalf * (size.width / size.height));
      const fitH = (outer * 0.55) / tanHalf;
      const homeDist = Math.max(fitW * 0.92, fitH, 22);
      desiredPos.current
        .set(0, compact ? 0.75 : 0.42, 1)
        .normalize()
        .multiplyScalar(homeDist)
        .add(new THREE.Vector3(pointer.x * 2, pointer.y * 1.2, 0));
      desiredTarget.current.set(0, compact ? -1.5 : -0.8, 0);
    } else {
      const isSun = selected === 'about';
      const p = isSun ? new THREE.Vector3() : positions.current[selected];
      if (!p) return;
      const r = isSun ? SUN_RADIUS : planets.find((x) => x.id === selected)!.radius;
      // viewDir: where the camera sits relative to the body
      if (isSun) {
        viewDir.current.set(0, 0, 1);
      } else {
        // look from the side, slightly sunward, so we see the lit half
        // and the sun ends up off to the left (the panel is on the right)
        outward.current.set(p.x, 0, p.z).normalize();
        right.current.crossVectors(outward.current.clone().negate(), UP).normalize();
        const theta = THREE.MathUtils.degToRad(100);
        viewDir.current
          .copy(outward.current)
          .multiplyScalar(Math.cos(theta))
          .addScaledVector(right.current, -Math.sin(theta))
          .normalize();
      }
      const dist = isSun ? 12 : r * 6.5 + 2.5;
      camRight.current.crossVectors(viewDir.current.clone().negate(), UP).normalize();
      if (compact) shift.current.copy(UP).multiplyScalar(-dist * 0.28);
      else shift.current.copy(camRight.current).multiplyScalar(dist * 0.24);
      desiredTarget.current.copy(p).add(shift.current);
      desiredPos.current
        .copy(p)
        .addScaledVector(viewDir.current, dist)
        .addScaledVector(UP, dist * 0.28)
        .add(shift.current);
    }
    const k = 1 - Math.exp(-d * (selected ? 2.4 : 1.6));
    camera.position.lerp(desiredPos.current, k);
    target.current.lerp(desiredTarget.current, k);
    camera.lookAt(target.current);
  });

  return null;
}

function SimClock({ selected, reducedMotion, timeScale }: { selected: SectionId | null; reducedMotion: boolean; timeScale: MutableRefObject<number> }) {
  useFrame((_, dt) => {
    const goal = selected ? 0.04 : reducedMotion ? 0.2 : 1;
    timeScale.current = THREE.MathUtils.damp(timeScale.current, goal, 2.5, Math.min(dt, 0.05));
  });
  return null;
}

export default function OrbitScene({ selected, hovered, onHover, onSelect, compact, reducedMotion }: SceneProps) {
  const timeScale = useRef(1);
  const positions = useRef<Record<string, THREE.Vector3>>({});
  // Labels render into this fixed layer. Letting drei pick its own target
  // remounts them when the canvas connects and can leave a label empty.
  const labelLayer = useRef<HTMLDivElement>(null);
  const scale = compact ? 0.72 : 1;

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : '';
    return () => {
      document.body.style.cursor = '';
    };
  }, [hovered]);

  return (
    <>
    <Canvas
      camera={{ fov: compact ? 52 : 42, near: 0.1, far: 500, position: [0, 46, 90] }}
      dpr={[1, compact ? 1.5 : 2]}
      gl={{ antialias: false, powerPreference: 'high-performance' }}
      onPointerMissed={() => onSelect(null)}
    >
      <color attach="background" args={['#04050b']} />
      <ambientLight intensity={0.06} />
      <SimClock selected={selected} reducedMotion={reducedMotion} timeScale={timeScale} />
      <Nebula />
      <Stars radius={120} depth={60} count={compact ? 2500 : 5000} factor={4} saturation={0.2} fade speed={reducedMotion ? 0 : 0.6} />
      <Sun hovered={hovered} selected={selected} onHover={onHover} onSelect={onSelect} />
      {planets.map((p) => (
        <Planet
          key={p.id}
          config={p}
          scale={scale}
          selected={selected}
          hovered={hovered}
          onHover={onHover}
          onSelect={onSelect}
          timeScale={timeScale}
          positions={positions}
          portal={labelLayer as RefObject<HTMLElement>}
        />
      ))}
      <AsteroidBelt inner={9.0 * scale} outer={9.7 * scale} count={compact ? 450 : 900} timeScale={timeScale} />
      <SunLabel dimmed={!!selected} portal={labelLayer as RefObject<HTMLElement>} />
      <CameraRig selected={selected} positions={positions} compact={compact} />
      <EffectComposer multisampling={4}>
        <Bloom mipmapBlur luminanceThreshold={0.9} luminanceSmoothing={0.2} intensity={0.8} radius={0.7} />
        <Vignette eskil={false} offset={0.25} darkness={0.7} />
      </EffectComposer>
    </Canvas>
    <div ref={labelLayer} className="pointer-events-none absolute inset-0 overflow-hidden" />
    </>
  );
}
