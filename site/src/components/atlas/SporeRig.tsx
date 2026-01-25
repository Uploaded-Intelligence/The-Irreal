import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { useAtlasStore } from '../../stores/atlasStore';

export function SporeRig() {
  const { camera } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const cameraTarget = useAtlasStore((s) => s.cameraTarget);
  const targetVec = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Mouse parallax (use pointer, not deprecated mouse)
    const parallaxX = state.pointer.x * 3;
    const parallaxY = state.pointer.y * 2;
    groupRef.current.position.x += (parallaxX - groupRef.current.position.x) * 2 * delta;
    groupRef.current.position.y += (parallaxY - groupRef.current.position.y) * 2 * delta;

    // Smooth camera look-at toward target
    targetVec.current.lerp(
      new THREE.Vector3(cameraTarget[0], cameraTarget[1], cameraTarget[2]),
      0.05
    );
    camera.lookAt(targetVec.current);
  });

  return (
    <group ref={groupRef}>
      {/* Camera is parented to this group for parallax offset */}
      <primitive object={camera} />
    </group>
  );
}
