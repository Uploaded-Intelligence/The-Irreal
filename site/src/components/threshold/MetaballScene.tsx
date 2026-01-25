/**
 * MetaballScene
 * Organic morphin-style blobs using Three.js MarchingCubes.
 * Mouse-following with elastic trail effect.
 *
 * Credits:
 * - Three.js MarchingCubes (based on greggman's blob, original by Henrik Rydgard)
 * - Samsy Ninja aesthetic inspiration
 */
import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { MarchingCubes } from 'three/addons/objects/MarchingCubes.js';

interface MetaballSceneProps {
  /** Number of metaballs (default 8) */
  count?: number;
  /** Resolution of marching cubes grid (default 48) */
  resolution?: number;
  /** Base color for the metaballs */
  color?: string;
}

export function MetaballScene({
  count = 8,
  resolution = 48,
  color = '#9d8fff',
}: MetaballSceneProps) {
  const marchingCubesRef = useRef<MarchingCubes>(null);
  const { viewport, pointer } = useThree();

  // Mouse trail for elastic following effect (15 elements per plan)
  const trail = useRef<THREE.Vector3[]>(
    Array(15)
      .fill(null)
      .map(() => new THREE.Vector3(0, 0, 0))
  );

  // Metaball positions (random initial positions)
  const ballPositions = useRef<THREE.Vector3[]>(
    Array(count)
      .fill(null)
      .map(
        () =>
          new THREE.Vector3(
            (Math.random() - 0.5) * 0.6,
            (Math.random() - 0.5) * 0.6,
            (Math.random() - 0.5) * 0.3
          )
      )
  );

  // Create material for the metaballs
  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      roughness: 0.3,
      metalness: 0.6,
      emissive: new THREE.Color(color).multiplyScalar(0.15),
    });
  }, [color]);

  // Animation loop
  useFrame((state) => {
    const mc = marchingCubesRef.current;
    if (!mc) return;

    // Update mouse trail (elastic following)
    const mouseX = (pointer.x * viewport.width) / 2;
    const mouseY = (pointer.y * viewport.height) / 2;

    // Shift trail and add new position at front
    for (let i = trail.current.length - 1; i > 0; i--) {
      trail.current[i].lerp(trail.current[i - 1], 0.15);
    }
    trail.current[0].set(mouseX * 0.15, mouseY * 0.15, 0);

    // Reset and rebuild metaballs
    mc.reset();

    const time = state.clock.elapsedTime;

    // Add metaballs at trail positions (main blob group)
    const numTrailBalls = Math.min(5, trail.current.length);
    for (let i = 0; i < numTrailBalls; i++) {
      const pos = trail.current[i];
      const strength = 0.5 - i * 0.06; // Decreasing strength along trail
      const subtract = 12;

      // Normalize position to 0-1 range for MarchingCubes
      mc.addBall(
        0.5 + pos.x,
        0.5 + pos.y,
        0.5 + pos.z,
        strength,
        subtract
      );
    }

    // Add ambient floating metaballs
    for (let i = 0; i < count; i++) {
      const pos = ballPositions.current[i];

      // Gentle floating motion
      const offsetX = Math.sin(time * 0.5 + i * 1.3) * 0.08;
      const offsetY = Math.cos(time * 0.4 + i * 0.9) * 0.08;
      const offsetZ = Math.sin(time * 0.3 + i * 1.7) * 0.05;

      mc.addBall(
        0.5 + pos.x + offsetX,
        0.5 + pos.y + offsetY,
        0.5 + pos.z + offsetZ,
        0.25, // strength
        12    // subtract (controls smoothMin blending sharpness)
      );
    }
  });

  return (
    <group position={[0, 0, 2]}>
      {/* Lighting for the metaballs */}
      <pointLight position={[2, 2, 4]} intensity={1.5} color="#ffffff" />
      <pointLight position={[-2, -1, 3]} intensity={0.8} color="#7c6fe0" />

      {/* MarchingCubes mesh */}
      <primitive
        ref={marchingCubesRef}
        object={new MarchingCubes(resolution, material, true, true, 100000)}
        scale={3}
      />
    </group>
  );
}
