import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import vertexShader from './shaders/portal.vert.glsl?raw';
import fragmentShader from './shaders/portal.frag.glsl?raw';

interface PortalProps {
  position: [number, number, number];
  color: string;
  glowColor: string;
  label: string;
  hint: string;
  onClick: () => void;
}

export function Portal({ position, color, glowColor, label, hint, onClick }: PortalProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const hoverValue = useRef(0);

  const uniforms = useMemo(
    () => ({
      time: { value: 0 },
      colorStart: { value: new THREE.Color(color) },
      colorEnd: { value: new THREE.Color(glowColor) },
      hover: { value: 0 },
    }),
    [color, glowColor]
  );

  useFrame((state) => {
    if (!meshRef.current) return;

    // Update uniforms
    uniforms.time.value = state.clock.elapsedTime;
    
    // Smooth hover transition
    const targetHover = hovered ? 1 : 0;
    hoverValue.current += (targetHover - hoverValue.current) * 0.1;
    uniforms.hover.value = hoverValue.current;

    // Floating animation
    meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
  });

  return (
    <group position={position}>
      {/* The Shader Portal - A Quad (Plane) that renders the organic shape */}
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerEnter={() => {
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerLeave={() => {
          setHovered(false);
          document.body.style.cursor = 'default';
        }}
        scale={2.5} // Larger canvas for the shader to draw in
      >
        <planeGeometry args={[2, 2]} />
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent={true}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Label - using Html for proper fonts */}
      <Html position={[0, -2.5, 0]} center style={{ pointerEvents: 'none' }}>
        <div style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '1.4rem',
          color: '#e0e0e8',
          textAlign: 'center',
          whiteSpace: 'nowrap',
          textShadow: '0 0 15px rgba(124, 111, 224, 0.8)',
          opacity: hovered ? 1 : 0.7,
          transition: 'opacity 0.3s',
          transform: hovered ? 'scale(1.1)' : 'scale(1)',
        }}>
          {label}
        </div>
      </Html>

      {/* Hint */}
      <Html position={[0, -3.0, 0]} center style={{ pointerEvents: 'none' }}>
        <div style={{
          fontFamily: "'EB Garamond', serif",
          fontSize: '1rem',
          color: '#8888a0',
          textAlign: 'center',
          whiteSpace: 'nowrap',
          opacity: hovered ? 1 : 0.5,
          transition: 'opacity 0.3s',
        }}>
          {hint}
        </div>
      </Html>
    </group>
  );
}