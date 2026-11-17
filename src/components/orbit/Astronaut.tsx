import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef, type MutableRefObject, type RefObject } from 'react';
import * as THREE from 'three';
import { profile } from '../../data/profile';
import type { SectionId } from './sections';

type Props = {
  selected: SectionId | null;
  hovered: SectionId | null;
  onHover: (id: SectionId | null) => void;
  onSelect: (id: SectionId) => void;
  timeScale: MutableRefObject<number>;
  positions: MutableRefObject<Record<string, THREE.Vector3>>;
  portal: RefObject<HTMLElement>;
  orbitScale: number;
};

export const ASTRONAUT_RADIUS = 0.55;

const SUIT = '#eef0f5';
const ACCENT = '#ff8a3d';
const DARK = '#3a3f52';

// Visor window, in three.js sphere angles. phi = PI/2 is the +z (front) side;
// theta is measured from the top of the helmet.
const WIN_PHI_LEN = 1.9;
const WIN_PHI_START = Math.PI / 2 - WIN_PHI_LEN / 2;
const WIN_THETA_START = 0.9;
const WIN_THETA_END = 2.0;

function Limb({ length, radius, color }: { length: number; radius: number; color: string }) {
  return (
    <mesh position={[0, -length / 2 - radius * 0.4, 0]}>
      <capsuleGeometry args={[radius, length, 6, 12]} />
      <meshStandardMaterial color={color} roughness={0.65} />
    </mesh>
  );
}

/** Me, drifting through my own little solar system. Built from primitives. */
export function Astronaut({ selected, hovered, onHover, onSelect, timeScale, positions, portal, orbitScale }: Props) {
  const root = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const armL = useRef<THREE.Group>(null);
  const armR = useRef<THREE.Group>(null);
  const legL = useRef<THREE.Group>(null);
  const legR = useRef<THREE.Group>(null);
  const beacon = useRef<THREE.MeshStandardMaterial>(null);
  const t = useRef(1.3);
  const hover = useRef(0);

  const active = hovered === 'about' || selected === 'about';
  const dimmed = selected !== null && selected !== 'about';

  useFrame((state, dt) => {
    const d = Math.min(dt, 0.05);
    const time = state.clock.elapsedTime;
    t.current += d * (0.1 + 0.9 * timeScale.current);
    const s = t.current;

    // a lazy, wobbly loop between the sun and the first planet
    const a = s * 0.11;
    const r = (3.3 + Math.sin(s * 0.23) * 0.45) * orbitScale;
    const x = Math.cos(a) * r;
    const z = Math.sin(a) * r;
    const y = 1.5 + Math.sin(s * 0.5) * 0.45;

    const g = root.current;
    if (!g) return;
    g.position.set(x, y, z);
    (positions.current.about ??= new THREE.Vector3()).set(x, y, z);
    // keep the visor turned roughly toward the viewer
    g.lookAt(state.camera.position);

    hover.current = THREE.MathUtils.damp(hover.current, active ? 1 : 0, 6, d);
    g.scale.setScalar((orbitScale < 1 ? 2.1 : 1.45) * (1 + hover.current * 0.12));

    if (body.current) {
      body.current.rotation.z = Math.sin(time * 0.3) * 0.3;
      body.current.rotation.x = Math.sin(time * 0.21) * 0.2;
      body.current.rotation.y = Math.sin(time * 0.17) * 0.35;
    }
    // waves harder when you hover
    const wave = 0.35 + hover.current * 0.35;
    if (armR.current) armR.current.rotation.z = 2.3 + Math.sin(time * (2 + hover.current * 3)) * wave;
    if (armL.current) armL.current.rotation.z = -0.45 + Math.sin(time * 0.9) * 0.12;
    if (legL.current) legL.current.rotation.x = Math.sin(time * 0.8) * 0.25;
    if (legR.current) legR.current.rotation.x = -Math.sin(time * 0.8) * 0.25 + 0.2;
    if (beacon.current) beacon.current.emissiveIntensity = Math.sin(time * 4) > 0.6 ? 4 : 0.4;
  });

  return (
    <group ref={root}>
      <group
        ref={body}
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
        {/* invisible, larger hit area so it's easy to click */}
        <mesh visible={false}>
          <sphereGeometry args={[0.6, 8, 8]} />
        </mesh>

        {/* torso */}
        <mesh>
          <capsuleGeometry args={[0.2, 0.26, 8, 16]} />
          <meshStandardMaterial color={SUIT} roughness={0.6} />
        </mesh>
        {/* chest panel */}
        <mesh position={[0, 0.03, 0.19]}>
          <boxGeometry args={[0.17, 0.11, 0.04]} />
          <meshStandardMaterial color={DARK} roughness={0.4} />
        </mesh>
        <mesh position={[-0.04, 0.04, 0.215]}>
          <boxGeometry args={[0.05, 0.03, 0.01]} />
          <meshStandardMaterial color="#5ef2df" emissive="#5ef2df" emissiveIntensity={2.5} toneMapped={false} />
        </mesh>
        <mesh position={[0.045, 0.04, 0.215]}>
          <sphereGeometry args={[0.014, 8, 8]} />
          <meshStandardMaterial ref={beacon} color="#ff3b3b" emissive="#ff3b3b" emissiveIntensity={2} toneMapped={false} />
        </mesh>
        {/* belt */}
        <mesh position={[0, -0.13, 0]}>
          <torusGeometry args={[0.2, 0.03, 8, 24]} />
          <meshStandardMaterial color={ACCENT} roughness={0.5} />
        </mesh>

        {/* helmet with a window cut out of the front, so the face shows */}
        <group position={[0, 0.4, 0]}>
          <mesh>
            <sphereGeometry args={[0.23, 32, 12, 0, Math.PI * 2, 0, WIN_THETA_START]} />
            <meshStandardMaterial color={SUIT} roughness={0.35} side={THREE.DoubleSide} />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.23, 32, 12, 0, Math.PI * 2, WIN_THETA_END, Math.PI - WIN_THETA_END]} />
            <meshStandardMaterial color={SUIT} roughness={0.35} side={THREE.DoubleSide} />
          </mesh>
          <mesh>
            <sphereGeometry
              args={[0.23, 32, 12, WIN_PHI_START + WIN_PHI_LEN, Math.PI * 2 - WIN_PHI_LEN, WIN_THETA_START, WIN_THETA_END - WIN_THETA_START]}
            />
            <meshStandardMaterial color={SUIT} roughness={0.35} side={THREE.DoubleSide} />
          </mesh>
          {/* dark helmet lining behind the face */}
          <mesh>
            <sphereGeometry args={[0.215, 24, 16]} />
            <meshStandardMaterial color="#141826" roughness={0.9} side={THREE.BackSide} />
          </mesh>

          {/* the face */}
          <mesh position={[0, -0.01, 0.02]}>
            <sphereGeometry args={[0.165, 32, 24]} />
            <meshStandardMaterial color="#f1c7a0" roughness={0.7} />
          </mesh>
          {/* hair */}
          <mesh position={[0, 0.035, 0.0]}>
            <sphereGeometry args={[0.172, 32, 16, 0, Math.PI * 2, 0, 1.05]} />
            <meshStandardMaterial color="#2b1d16" roughness={0.9} />
          </mesh>
          {/* eyes */}
          {[-0.055, 0.055].map((x) => (
            <mesh key={x} position={[x, 0.01, 0.17]} scale={[1, 1.35, 0.6]}>
              <sphereGeometry args={[0.019, 12, 12]} />
              <meshStandardMaterial color="#1a1410" roughness={0.3} />
            </mesh>
          ))}
          {/* eyebrows */}
          {[-0.055, 0.055].map((x) => (
            <mesh key={x} position={[x, 0.058, 0.162]} rotation={[0, 0, x > 0 ? -0.15 : 0.15]}>
              <boxGeometry args={[0.045, 0.01, 0.01]} />
              <meshStandardMaterial color="#2b1d16" />
            </mesh>
          ))}
          {/* smile */}
          <mesh position={[0, -0.04, 0.163]} rotation={[0, 0, Math.PI]}>
            <torusGeometry args={[0.035, 0.0075, 6, 16, Math.PI]} />
            <meshStandardMaterial color="#8a3b2a" roughness={0.6} />
          </mesh>
          {/* cheeks */}
          {[-0.09, 0.09].map((x) => (
            <mesh key={x} position={[x, -0.03, 0.14]} scale={[1, 0.7, 0.4]}>
              <sphereGeometry args={[0.024, 10, 10]} />
              <meshStandardMaterial color="#f29a86" roughness={0.8} transparent opacity={0.7} />
            </mesh>
          ))}

          {/* tinted glass visor over the window */}
          <mesh>
            <sphereGeometry
              args={[0.236, 32, 16, WIN_PHI_START, WIN_PHI_LEN, WIN_THETA_START, WIN_THETA_END - WIN_THETA_START]}
            />
            <meshStandardMaterial
              color="#ffcf7a"
              metalness={0.6}
              roughness={0.05}
              transparent
              opacity={0.28}
              depthWrite={false}
            />
          </mesh>
          {/* visor rim */}
          <mesh rotation={[0, 0, 0]}>
            <sphereGeometry
              args={[0.238, 32, 2, WIN_PHI_START - 0.06, WIN_PHI_LEN + 0.12, WIN_THETA_START - 0.06, 0.06]}
            />
            <meshStandardMaterial color={ACCENT} roughness={0.5} side={THREE.DoubleSide} />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.238, 32, 2, WIN_PHI_START - 0.06, WIN_PHI_LEN + 0.12, WIN_THETA_END, 0.06]} />
            <meshStandardMaterial color={ACCENT} roughness={0.5} side={THREE.DoubleSide} />
          </mesh>
        </group>
        {/* helmet lamp */}
        <mesh position={[0.2, 0.47, 0.06]}>
          <cylinderGeometry args={[0.035, 0.035, 0.05, 12]} />
          <meshStandardMaterial color="#fff6d8" emissive="#fff1c4" emissiveIntensity={3} toneMapped={false} />
        </mesh>
        {/* neck ring */}
        <mesh position={[0, 0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.16, 0.035, 8, 24]} />
          <meshStandardMaterial color={DARK} roughness={0.4} />
        </mesh>

        {/* backpack */}
        <mesh position={[0, 0.06, -0.24]}>
          <boxGeometry args={[0.32, 0.4, 0.16]} />
          <meshStandardMaterial color="#d9dce6" roughness={0.55} />
        </mesh>
        <mesh position={[0.1, 0.32, -0.27]}>
          <cylinderGeometry args={[0.008, 0.008, 0.22, 6]} />
          <meshStandardMaterial color={DARK} />
        </mesh>
        <mesh position={[0.1, 0.44, -0.27]}>
          <sphereGeometry args={[0.022, 8, 8]} />
          <meshStandardMaterial color={ACCENT} emissive={ACCENT} emissiveIntensity={2} toneMapped={false} />
        </mesh>

        {/* arms: pivot at the shoulders */}
        <group ref={armL} position={[-0.25, 0.14, 0]}>
          <Limb length={0.24} radius={0.075} color={SUIT} />
          <mesh position={[0, -0.36, 0]}>
            <sphereGeometry args={[0.075, 12, 12]} />
            <meshStandardMaterial color={ACCENT} roughness={0.6} />
          </mesh>
        </group>
        <group ref={armR} position={[0.25, 0.14, 0]}>
          <Limb length={0.24} radius={0.075} color={SUIT} />
          <mesh position={[0, -0.36, 0]}>
            <sphereGeometry args={[0.075, 12, 12]} />
            <meshStandardMaterial color={ACCENT} roughness={0.6} />
          </mesh>
        </group>

        {/* legs: pivot at the hips */}
        <group ref={legL} position={[-0.1, -0.24, 0]}>
          <Limb length={0.26} radius={0.085} color={SUIT} />
          <mesh position={[0, -0.4, 0.03]}>
            <boxGeometry args={[0.15, 0.1, 0.2]} />
            <meshStandardMaterial color={DARK} roughness={0.6} />
          </mesh>
        </group>
        <group ref={legR} position={[0.1, -0.24, 0]}>
          <Limb length={0.26} radius={0.085} color={SUIT} />
          <mesh position={[0, -0.4, 0.03]}>
            <boxGeometry args={[0.15, 0.1, 0.2]} />
            <meshStandardMaterial color={DARK} roughness={0.6} />
          </mesh>
        </group>
      </group>

      <Html position={[0, -0.8, 0]} center zIndexRange={[10, 0]} portal={portal} style={{ pointerEvents: 'none' }}>
        <div className={`planet-label planet-label--hero ${dimmed ? 'is-dimmed' : ''} ${active ? 'is-hovered' : ''} ${selected === 'about' ? 'is-selected' : ''}`}>
          <span className="planet-label__name">{profile.name}</span>
          <span className="planet-label__caption">{profile.title}</span>
        </div>
      </Html>
    </group>
  );
}
