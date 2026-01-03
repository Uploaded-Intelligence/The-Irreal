import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface PortalProps {
  position: [number, number, number];
  color: string;
  glowColor: string;
  label: string;
  hint: string;
  onClick: () => void;
}

export function Portal({ position, color, glowColor, label, hint, onClick }: PortalProps) {
  const groupRef = useRef<THREE.Group>(null);
  const torusRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Breathing animation
  const breathPhase = useRef(Math.random() * Math.PI * 2);

  useFrame((state, delta) => {
    if (!torusRef.current) return;

    // Breathing pulse
    breathPhase.current += delta * Math.PI * 1.5;
    const breathScale = 1 + Math.sin(breathPhase.current) * 0.05;

    // Apply scale
    const targetScale = hovered ? 1.15 : breathScale;
    torusRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.1
    );

    // Rotate slowly
    torusRef.current.rotation.z += delta * 0.1;
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Portal ring */}
      <mesh
        ref={torusRef}
        onClick={onClick}
        onPointerEnter={() => {
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerLeave={() => {
          setHovered(false);
          document.body.style.cursor = 'default';
        }}
      >
        <torusGeometry args={[1.5, 0.08, 16, 64]} />
        <meshStandardMaterial
          color={color}
          emissive={glowColor}
          emissiveIntensity={hovered ? 2 : 0.8}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Inner glow */}
      <mesh>
        <circleGeometry args={[1.4, 32]} />
        <meshBasicMaterial
          color={glowColor}
          transparent
          opacity={hovered ? 0.3 : 0.15}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Label - using Html for proper fonts */}
      <Html position={[0, -2.2, 0]} center>
        <div style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '1.2rem',
          color: '#e0e0e8',
          textAlign: 'center',
          whiteSpace: 'nowrap',
          textShadow: '0 0 10px rgba(124, 111, 224, 0.5)',
        }}>
          {label}
        </div>
      </Html>

      {/* Hint */}
      <Html position={[0, -2.8, 0]} center>
        <div style={{
          fontFamily: "'EB Garamond', serif",
          fontSize: '0.9rem',
          color: '#8888a0',
          textAlign: 'center',
          whiteSpace: 'nowrap',
        }}>
          {hint}
        </div>
      </Html>
    </group>
  );
}
