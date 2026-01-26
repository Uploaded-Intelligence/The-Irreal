import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Trail } from '@react-three/drei';
import * as THREE from 'three';
import { useAtlasStore } from '../../stores/atlasStore';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

export function VisitorTrail() {
  const velocity = useAtlasStore((s) => s.velocity);
  const hyperdrive = useAtlasStore((s) => s.hyperdrive);
  const reducedMotion = usePrefersReducedMotion();

  const meshRef = useRef<THREE.Mesh>(null!);
  const trailColor = useMemo(() => new THREE.Color(0x88ddff), []);

  // Calculate speed for trail intensity
  const speed = Math.sqrt(velocity[0]**2 + velocity[1]**2 + velocity[2]**2);
  const isMoving = speed > 0.5;

  // Trail parameters based on state (shorter when reduced motion preferred)
  const baseWidth = hyperdrive.phase === 'traveling' ? 1.2 : (isMoving ? 0.4 : 0.15);
  const baseLength = hyperdrive.phase === 'traveling' ? 30 : (isMoving ? 12 : 5);
  const trailWidth = reducedMotion ? baseWidth * 0.5 : baseWidth;
  const trailLength = reducedMotion ? Math.max(3, baseLength * 0.4) : baseLength;

  // Position trail slightly behind camera (so it's visible when looking back)
  useFrame(({ camera }) => {
    if (!meshRef.current) return;
    const behind = new THREE.Vector3(0, 0, 2).applyQuaternion(camera.quaternion);
    meshRef.current.position.set(
      camera.position.x + behind.x,
      camera.position.y + behind.y - 0.5,  // slightly below eye level
      camera.position.z + behind.z
    );
  });

  return (
    <Trail
      width={trailWidth}
      length={trailLength}
      color={trailColor}
      attenuation={(t) => t * t * t}  // cubic falloff for ethereal look
      decay={1}
    >
      <mesh ref={meshRef}>
        {/* Tiny glowing core - almost invisible, just enough to anchor the trail */}
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshBasicMaterial
          color={trailColor}
          transparent
          opacity={isMoving ? 0.6 : 0.2}
        />
      </mesh>
    </Trail>
  );
}
