/**
 * FlowFieldParticles
 * Mid-ground atmospheric particles using curl noise for organic flow.
 *
 * Credits:
 * - sebastien-lempens/r3f-flow-field-particles (GPGPU pattern)
 * - juniorxsound/Particle-Curl-Noise (curl noise technique)
 * - edankwan/The-Spirit (atmosphere aesthetic)
 */
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FlowFieldParticlesProps {
  /** Number of particles */
  count?: number;
  /** Size of particles */
  size?: number;
  /** Color of particles */
  color?: string;
  /** Speed multiplier */
  speed?: number;
}

// Simple 3D noise function for flow field
function noise3D(x: number, y: number, z: number): number {
  // Simplified noise using sin waves
  return (
    Math.sin(x * 1.2 + z * 0.5) * Math.cos(y * 0.9 + x * 0.3) +
    Math.sin(y * 1.5 + x * 0.8) * Math.cos(z * 1.1 + y * 0.4) +
    Math.sin(z * 0.7 + y * 0.6) * Math.cos(x * 1.3 + z * 0.2)
  ) * 0.33;
}

// Curl noise for divergence-free flow (no sinks/sources)
function curlNoise(x: number, y: number, z: number, time: number): THREE.Vector3 {
  const eps = 0.0001;
  const t = time * 0.3;

  // Partial derivatives
  const dx = (noise3D(x + eps, y, z + t) - noise3D(x - eps, y, z + t)) / (2 * eps);
  const dy = (noise3D(x, y + eps, z + t) - noise3D(x, y - eps, z + t)) / (2 * eps);
  const dz = (noise3D(x, y, z + eps + t) - noise3D(x, y, z - eps + t)) / (2 * eps);

  // Curl = nabla x F (cross product of gradient)
  return new THREE.Vector3(
    dy - dz, // ∂Fz/∂y - ∂Fy/∂z
    dz - dx, // ∂Fx/∂z - ∂Fz/∂x
    dx - dy  // ∂Fy/∂x - ∂Fx/∂y
  );
}

export function FlowFieldParticles({
  count = 1000,
  size = 0.03,
  color = '#6bc5ff',
  speed = 0.5,
}: FlowFieldParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);

  // Initialize particle positions
  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel: THREE.Vector3[] = [];

    for (let i = 0; i < count; i++) {
      // Distribute in a sphere around the camera
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 5 + Math.random() * 15;

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi) - 5; // Offset behind camera

      vel.push(new THREE.Vector3(0, 0, 0));
    }

    return { positions: pos, velocities: vel };
  }, [count]);

  // Create geometry
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  // Create material with additive blending for glow effect
  const material = useMemo(() => {
    return new THREE.PointsMaterial({
      size,
      color: new THREE.Color(color),
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });
  }, [size, color]);

  // Animation loop
  useFrame((state) => {
    const points = pointsRef.current;
    if (!points) return;

    const positionAttribute = points.geometry.getAttribute('position') as THREE.BufferAttribute;
    const posArray = positionAttribute.array as Float32Array;
    const time = state.clock.elapsedTime;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const x = posArray[idx];
      const y = posArray[idx + 1];
      const z = posArray[idx + 2];

      // Get curl noise velocity at this position
      const curl = curlNoise(x * 0.1, y * 0.1, z * 0.1, time);

      // Update velocity with damping
      velocities[i].lerp(curl, 0.02);
      velocities[i].multiplyScalar(0.98);

      // Apply velocity
      posArray[idx] += velocities[i].x * speed * 0.016;
      posArray[idx + 1] += velocities[i].y * speed * 0.016;
      posArray[idx + 2] += velocities[i].z * speed * 0.016;

      // Reset particles that drift too far
      const dist = Math.sqrt(x * x + y * y + (z + 5) * (z + 5));
      if (dist > 25) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = 5 + Math.random() * 5;

        posArray[idx] = r * Math.sin(phi) * Math.cos(theta);
        posArray[idx + 1] = r * Math.sin(phi) * Math.sin(theta);
        posArray[idx + 2] = r * Math.cos(phi) - 5;
      }
    }

    positionAttribute.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} geometry={geometry} material={material} />
  );
}
