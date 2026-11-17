import { Html } from '@react-three/drei';
import { createPortal, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef, type ReactNode, type RefObject } from 'react';
import * as THREE from 'three';
import type { SectionId } from './sections';

type Props = {
  selected: SectionId | null;
  hovered: SectionId | null;
  onHover: (id: SectionId | null) => void;
  onSelect: (id: SectionId) => void;
  compact: boolean;
  portal: RefObject<HTMLElement>;
};

/** Renders children in camera space, so they stay put on screen. */
export function CameraSpace({ children }: { children: ReactNode }) {
  const { camera, scene } = useThree();
  useEffect(() => {
    scene.add(camera);
    return () => {
      scene.remove(camera);
    };
  }, [camera, scene]);
  return createPortal(children, camera);
}

const HULL = '#c9ccd8';
const NEON_PURPLE = '#a86bff';
const NEON_GREEN = '#3dffb0';
const ENGINE = '#ff9a3d';

function Porthole({ x }: { x: number }) {
  return (
    <mesh position={[x, 0.06, 0.6]} rotation={[0, 0, 0]}>
      <circleGeometry args={[0.075, 20]} />
      <meshStandardMaterial color="#9ffcff" emissive="#5ef2df" emissiveIntensity={2.2} toneMapped={false} />
    </mesh>
  );
}

function Engine({ y, z, flame }: { y: number; z: number; flame: RefObject<THREE.Mesh | null> }) {
  return (
    <group position={[1.3, y, z]}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.17, 0.21, 0.42, 20]} />
        <meshStandardMaterial color="#8a8fa3" metalness={0.5} roughness={0.35} />
      </mesh>
      <mesh position={[0.22, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.16, 0.03, 8, 20]} />
        <meshStandardMaterial color={NEON_PURPLE} emissive={NEON_PURPLE} emissiveIntensity={2} toneMapped={false} />
      </mesh>
      <mesh ref={flame} position={[0.5, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.13, 0.6, 16, 1, true]} />
        <meshBasicMaterial color={ENGINE} transparent opacity={0.85} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  );
}

/**
 * A chunky retro sci-fi cruiser parked at the edge of the screen.
 * Click it to "board": it flies in and the contact panel opens.
 */
export function Ship({ selected, hovered, onHover, onSelect, compact, portal }: Props) {
  const { camera, size } = useThree();
  const root = useRef<THREE.Group>(null);
  const hull = useRef<THREE.Group>(null);
  const flameA = useRef<THREE.Mesh>(null);
  const flameB = useRef<THREE.Mesh>(null);
  const antenna = useRef<THREE.MeshStandardMaterial>(null);
  const hover = useRef(0);
  const goal = useRef(new THREE.Vector3());
  const placed = useRef(false);

  const boarding = selected === 'contact';
  const active = hovered === 'contact' || boarding;
  const away = selected !== null && !boarding;

  useFrame((state, dt) => {
    const d = Math.min(dt, 0.05);
    const time = state.clock.elapsedTime;
    const cam = camera as THREE.PerspectiveCamera;
    const tanHalf = Math.tan(THREE.MathUtils.degToRad(cam.fov / 2));
    const aspect = size.width / size.height;

    // where the ship should sit, in camera space
    let depth: number;
    let x: number;
    let y: number;
    if (boarding) {
      depth = compact ? 9 : 7.5;
      const halfH = depth * tanHalf;
      x = compact ? 0 : -depth * tanHalf * aspect * 0.4;
      y = compact ? halfH * 0.42 : 0.15;
    } else {
      depth = compact ? 13 : 10;
      const halfW = depth * tanHalf * aspect;
      const halfH = depth * tanHalf;
      x = away ? halfW + 5 : halfW - (compact ? 0.55 : 0.75);
      y = compact ? halfH * 0.52 : halfH * 0.42;
    }
    goal.current.set(x, y, -depth);

    const g = root.current;
    if (!g) return;
    if (!placed.current) {
      // enter from off-screen right on load
      g.position.set(goal.current.x + 8, goal.current.y, goal.current.z);
      placed.current = true;
    }
    g.position.lerp(goal.current, 1 - Math.exp(-d * (boarding ? 2.2 : 1.4)));

    hover.current = THREE.MathUtils.damp(hover.current, active ? 1 : 0, 5, d);
    const scale = (boarding ? (compact ? 0.7 : 0.78) : compact ? 0.55 : 0.68) * (1 + hover.current * 0.06);
    g.scale.setScalar(scale);

    if (hull.current) {
      hull.current.position.y = Math.sin(time * 1.1) * 0.08;
      hull.current.rotation.x = Math.sin(time * 0.7) * 0.05;
      hull.current.rotation.z = Math.sin(time * 0.9) * 0.03;
    }
    const thrust = 0.75 + hover.current * 0.6 + Math.sin(time * 30) * 0.08;
    flameA.current?.scale.set(1, thrust, 1);
    flameB.current?.scale.set(1, thrust * 0.95, 1);
    if (antenna.current) antenna.current.emissiveIntensity = Math.sin(time * 3) > 0.3 ? 4 : 0.3;
  });

  return (
    <group ref={root} position={[20, 0, -10]}>
      {/* nose points left and a little toward the viewer */}
      <group rotation={[0.12, 0.5, 0.04]}>
        <group
          ref={hull}
          onPointerOver={(e) => {
            e.stopPropagation();
            onHover('contact');
          }}
          onPointerOut={() => onHover(null)}
          onClick={(e) => {
            e.stopPropagation();
            onSelect('contact');
          }}
        >
          {/* main hull */}
          <mesh scale={[1.55, 0.55, 0.68]}>
            <sphereGeometry args={[1, 48, 32]} />
            <meshStandardMaterial color={HULL} metalness={0.45} roughness={0.3} emissive="#231b3d" emissiveIntensity={0.6} />
          </mesh>
          {/* nose cap */}
          <mesh position={[-1.5, 0, 0]} scale={[0.45, 0.3, 0.3]}>
            <sphereGeometry args={[1, 24, 16]} />
            <meshStandardMaterial color="#e9ebf2" metalness={0.6} roughness={0.2} />
          </mesh>
          {/* neon belly stripe */}
          <mesh rotation={[Math.PI / 2, 0, 0]} scale={[1.56, 0.69, 1]} position={[0, -0.12, 0]}>
            <torusGeometry args={[1, 0.035, 8, 64]} />
            <meshStandardMaterial color={NEON_GREEN} emissive={NEON_GREEN} emissiveIntensity={2.4} toneMapped={false} />
          </mesh>
          {/* glass cockpit dome */}
          <mesh position={[-0.45, 0.36, 0]} scale={[1.2, 0.85, 0.95]}>
            <sphereGeometry args={[0.42, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial
              color="#6a2cff"
              emissive={NEON_PURPLE}
              emissiveIntensity={0.9}
              metalness={0.2}
              roughness={0.05}
              transparent
              opacity={0.88}
            />
          </mesh>
          <mesh position={[-0.45, 0.36, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1.2, 0.95, 1]}>
            <torusGeometry args={[0.42, 0.04, 8, 32]} />
            <meshStandardMaterial color="#e9ebf2" metalness={0.6} roughness={0.2} />
          </mesh>
          {/* portholes */}
          {[0.15, 0.45, 0.75].map((x) => (
            <Porthole key={x} x={x} />
          ))}
          {/* tail fins */}
          <mesh position={[1.15, 0.55, 0]} rotation={[0, 0, -0.55]}>
            <boxGeometry args={[0.6, 0.08, 0.32]} />
            <meshStandardMaterial color={HULL} metalness={0.45} roughness={0.3} />
          </mesh>
          <mesh position={[1.4, 0.82, 0]}>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshStandardMaterial color={NEON_PURPLE} emissive={NEON_PURPLE} emissiveIntensity={3} toneMapped={false} />
          </mesh>
          <mesh position={[1.1, -0.42, 0.45]} rotation={[0.6, 0, 0.5]}>
            <boxGeometry args={[0.55, 0.06, 0.28]} />
            <meshStandardMaterial color={HULL} metalness={0.45} roughness={0.3} />
          </mesh>
          <mesh position={[1.1, -0.42, -0.45]} rotation={[-0.6, 0, 0.5]}>
            <boxGeometry args={[0.55, 0.06, 0.28]} />
            <meshStandardMaterial color={HULL} metalness={0.45} roughness={0.3} />
          </mesh>
          {/* antenna */}
          <mesh position={[-0.05, 0.75, 0]} rotation={[0, 0, 0.25]}>
            <cylinderGeometry args={[0.012, 0.012, 0.42, 6]} />
            <meshStandardMaterial color="#8a8fa3" />
          </mesh>
          <mesh position={[-0.1, 0.96, 0]}>
            <sphereGeometry args={[0.045, 10, 10]} />
            <meshStandardMaterial ref={antenna} color="#ff3b3b" emissive="#ff3b3b" emissiveIntensity={3} toneMapped={false} />
          </mesh>
          {/* engines */}
          <Engine y={-0.05} z={0.32} flame={flameA} />
          <Engine y={-0.05} z={-0.32} flame={flameB} />
          {/* a soft light so the hull reads against black space */}
          <pointLight position={[-1, 1.5, 2]} intensity={6} distance={6} color="#cfd6ff" />
        </group>
      </group>

      <Html position={[0, -1.05, 0]} center zIndexRange={[10, 0]} portal={portal} style={{ pointerEvents: 'none' }}>
        <div className={`planet-label ${away ? 'is-dimmed' : ''} ${active ? 'is-hovered' : ''} ${boarding ? 'is-selected' : ''}`}>
          <span className="planet-label__name">Contact</span>
          <span className="planet-label__caption">Board the ship</span>
        </div>
      </Html>
    </group>
  );
}
