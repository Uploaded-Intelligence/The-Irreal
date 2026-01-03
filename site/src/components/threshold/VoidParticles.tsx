import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useThresholdStore } from '../../stores/thresholdStore';

interface VoidParticlesProps {
  count?: number;
  radius?: number;
}

export function VoidParticles({ count = 2000, radius = 50 }: VoidParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const geometryRef = useRef<THREE.BufferGeometry>(null);
  const stage = useThresholdStore((s) => s.stage);
  const mouseVelocity = useThresholdStore((s) => s.mouseVelocity);
  const stageStartTime = useThresholdStore((s) => s.stageStartTime);

  // Generate initial positions in a sphere around origin (camera will be at origin)
  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Spherical distribution
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius * (0.3 + Math.random() * 0.7); // 30-100% of radius

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      // Random drift velocities
      vel[i * 3] = (Math.random() - 0.5) * 0.02;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }

    return [pos, vel];
  }, [count, radius]);

  // Set up buffer attribute on geometry
  useEffect(() => {
    if (geometryRef.current) {
      geometryRef.current.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, 3)
      );
    }
  }, [positions]);

  // Breathing animation (60 BPM = 1 Hz)
  const breathPhase = useRef(0);

  useFrame((_, delta) => {
    if (!pointsRef.current || !geometryRef.current) return;
    const posAttr = geometryRef.current.attributes.position;
    if (!posAttr) return;

    const posArray = posAttr.array as Float32Array;

    // Breathing: expand/contract at 60 BPM
    breathPhase.current += delta * Math.PI * 2; // Full cycle per second
    const breathScale = 1 + Math.sin(breathPhase.current) * 0.03; // 3% scale variation

    // Velocity multiplier based on mouse (attunement stage)
    const velocityMult = stage === 'attunement' ? 1 + mouseVelocity * 3 : 1;

    // Calculate opacity based on stage
    let opacity = 0;
    if (stage === 'detection') {
      opacity = 0;
    } else if (stage === 'void') {
      // Fade in during void stage
      const elapsed = Date.now() - stageStartTime;
      opacity = Math.min(elapsed / 2000, 1) * 0.6;
    } else {
      opacity = 0.6;
    }

    // Update particle positions
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Apply velocity
      posArray[i3] += velocities[i3] * velocityMult;
      posArray[i3 + 1] += velocities[i3 + 1] * velocityMult;
      posArray[i3 + 2] += velocities[i3 + 2] * velocityMult;

      // Apply breathing
      const dist = Math.sqrt(
        posArray[i3] ** 2 +
        posArray[i3 + 1] ** 2 +
        posArray[i3 + 2] ** 2
      );

      if (dist > 0) {
        const targetDist = dist * breathScale;
        const scale = targetDist / dist;
        posArray[i3] *= 1 + (scale - 1) * 0.1;
        posArray[i3 + 1] *= 1 + (scale - 1) * 0.1;
        posArray[i3 + 2] *= 1 + (scale - 1) * 0.1;
      }

      // Wrap particles that drift too far
      const currentDist = Math.sqrt(
        posArray[i3] ** 2 +
        posArray[i3 + 1] ** 2 +
        posArray[i3 + 2] ** 2
      );
      const maxDist = radius * 1.2;
      if (currentDist > maxDist) {
        const newR = radius * 0.5;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        posArray[i3] = newR * Math.sin(phi) * Math.cos(theta);
        posArray[i3 + 1] = newR * Math.sin(phi) * Math.sin(theta);
        posArray[i3 + 2] = newR * Math.cos(phi);
      }
    }

    posAttr.needsUpdate = true;

    // Update material opacity
    const material = pointsRef.current.material as THREE.PointsMaterial;
    material.opacity = opacity;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry ref={geometryRef} />
      <pointsMaterial
        size={0.5}
        color="#7c6fe0"
        transparent
        opacity={0}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
