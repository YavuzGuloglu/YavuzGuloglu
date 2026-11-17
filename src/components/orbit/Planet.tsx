import { Html, Line } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef, type MutableRefObject, type RefObject } from 'react';
import * as THREE from 'three';
import type { PlanetConfig, SectionId } from './sections';
import {
  atmosphereFragment,
  atmosphereVertex,
  planetFragment,
  planetVertex,
  ringFragment,
  ringVertex,
} from './shaders';

type Props = {
  config: PlanetConfig;
  scale: number;
  selected: SectionId | null;
  hovered: SectionId | null;
  onHover: (id: SectionId | null) => void;
  onSelect: (id: SectionId) => void;
  timeScale: MutableRefObject<number>;
  positions: MutableRefObject<Record<string, THREE.Vector3>>;
  portal: RefObject<HTMLElement>;
};

const SURFACE_TYPE = { rocky: 0, gas: 1, ice: 2 } as const;

export function OrbitPath({ distance, active, faded }: { distance: number; active: boolean; faded?: boolean }) {
  const points = useMemo(() => {
    const pts: [number, number, number][] = [];
    for (let i = 0; i <= 160; i++) {
      const a = (i / 160) * Math.PI * 2;
      pts.push([Math.cos(a) * distance, 0, Math.sin(a) * distance]);
    }
    return pts;
  }, [distance]);
  return (
    <Line
      points={points}
      color={active ? '#c9d4ff' : '#8090c0'}
      transparent
      opacity={faded ? 0.04 : active ? 0.55 : 0.16}
      lineWidth={active ? 1.4 : 1}
      depthWrite={false}
    />
  );
}

export function Planet({ config, scale, selected, hovered, onHover, onSelect, timeScale, positions, portal }: Props) {
  const orbitRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Mesh>(null);
  const moonsRef = useRef<THREE.Group>(null);
  const angle = useRef(config.phase);
  const hover = useRef(0);

  const distance = config.distance * scale;
  const isHovered = hovered === config.id;
  const isSelected = selected === config.id;
  const dimmed = selected !== null && !isSelected;

  const uniforms = useMemo(
    () => ({
      uColorA: { value: new THREE.Color(config.colors[0]) },
      uColorB: { value: new THREE.Color(config.colors[1]) },
      uColorC: { value: new THREE.Color(config.colors[2]) },
      uAtmo: { value: new THREE.Color(config.atmosphere) },
      uType: { value: SURFACE_TYPE[config.surface] },
      uTime: { value: 0 },
      uSeed: { value: config.distance * 3.7 },
      uHover: { value: 0 },
    }),
    [config],
  );
  const atmoUniforms = useMemo(
    () => ({ uColor: { value: new THREE.Color(config.atmosphere) }, uIntensity: { value: 1.4 } }),
    [config],
  );
  const ringUniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color(config.colors[2]) },
      uInner: { value: config.radius * 1.35 },
      uOuter: { value: config.radius * 1.9 },
    }),
    [config],
  );

  const moons = useMemo(
    () =>
      Array.from({ length: config.moons }, (_, i) => ({
        r: config.radius * (1.7 + i * Math.min(0.28, 1.2 / Math.max(config.moons - 1, 1))),
        size: 0.07 + ((i * 37) % 5) * 0.012,
        speed: 0.9 - i * 0.12,
        phase: i * 2.1,
        incline: ((i % 3) - 1) * 0.35,
      })),
    [config],
  );

  useFrame((state, dt) => {
    const d = Math.min(dt, 0.05);
    angle.current += d * config.speed * timeScale.current;
    const a = angle.current;
    const x = Math.cos(a) * distance;
    const z = Math.sin(a) * distance;
    orbitRef.current?.position.set(x, 0, z);
    (positions.current[config.id] ??= new THREE.Vector3()).set(x, 0, z);

    if (bodyRef.current) bodyRef.current.rotation.y += d * 0.25;
    hover.current = THREE.MathUtils.damp(hover.current, isHovered || isSelected ? 1 : 0, 6, d);
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uHover.value = hover.current;
    orbitRef.current?.scale.setScalar(1 + hover.current * 0.08);

    if (moonsRef.current) {
      moonsRef.current.children.forEach((m, i) => {
        const moon = moons[i];
        const ma = state.clock.elapsedTime * moon.speed * (0.25 + timeScale.current * 0.75) + moon.phase;
        m.position.set(Math.cos(ma) * moon.r, Math.sin(ma) * moon.r * moon.incline, Math.sin(ma) * moon.r);
      });
    }
  });

  return (
    <>
      <OrbitPath distance={distance} active={isHovered && !isSelected} faded={isSelected} />
      <group ref={orbitRef}>
        <group rotation={[0, 0, config.tilt]}>
          <mesh
            ref={bodyRef}
            onPointerOver={(e) => {
              e.stopPropagation();
              onHover(config.id);
            }}
            onPointerOut={() => onHover(null)}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(config.id);
            }}
          >
            <sphereGeometry args={[config.radius, 64, 64]} />
            <shaderMaterial vertexShader={planetVertex} fragmentShader={planetFragment} uniforms={uniforms} />
          </mesh>
          <mesh scale={1.18} raycast={() => null}>
            <sphereGeometry args={[config.radius, 48, 48]} />
            <shaderMaterial
              vertexShader={atmosphereVertex}
              fragmentShader={atmosphereFragment}
              uniforms={atmoUniforms}
              side={THREE.BackSide}
              blending={THREE.AdditiveBlending}
              transparent
              depthWrite={false}
            />
          </mesh>
          {config.ring && (
            <mesh rotation={[-Math.PI / 2 + 0.25, 0, 0]} raycast={() => null}>
              <ringGeometry args={[config.radius * 1.35, config.radius * 1.9, 128, 1]} />
              <shaderMaterial
                vertexShader={ringVertex}
                fragmentShader={ringFragment}
                uniforms={ringUniforms}
                side={THREE.DoubleSide}
                transparent
                depthWrite={false}
              />
            </mesh>
          )}
        </group>

        <group ref={moonsRef}>
          {moons.map((m, i) => (
            <mesh key={i} raycast={() => null}>
              <sphereGeometry args={[m.size, 16, 16]} />
              <meshStandardMaterial color={config.colors[2]} roughness={1} emissive={config.atmosphere} emissiveIntensity={0.15} />
            </mesh>
          ))}
        </group>

        <Html
          position={[0, -(config.radius + 0.55), 0]}
          center
          zIndexRange={[10, 0]}
          portal={portal}
          style={{ pointerEvents: 'none' }}
        >
          <div className={`planet-label ${dimmed ? 'is-dimmed' : ''} ${isHovered ? 'is-hovered' : ''} ${isSelected ? 'is-selected' : ''}`}>
            <span className="planet-label__name">{config.label}</span>
            <span className="planet-label__caption">{config.caption}</span>
          </div>
        </Html>
      </group>
    </>
  );
}
