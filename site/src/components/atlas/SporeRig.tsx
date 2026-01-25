import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

export function SporeRig() {
  const { camera, mouse } = useThree();
  const group = useRef<THREE.Group>(null);
  
  // State for dampening
  const targetLook = useRef(new THREE.Vector3(0, 0, 0));
  const currentLook = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state, delta) => {
    // 1. Mouse Parallax (The Swim)
    // Convert normalized mouse (-1 to 1) to offset
    const parallaxX = state.mouse.x * 2;
    const parallaxY = state.mouse.y * 2;
    
    if (group.current) {
      // Dampened lerp
      group.current.position.x += (parallaxX - group.current.position.x) * 2 * delta;
      group.current.position.y += (parallaxY - group.current.position.y) * 2 * delta;
    }

    // 2. LookAt Logic (Dampened)
    // For now, look at center. Later, look at target node.
    targetLook.current.set(0, 0, 0);
    currentLook.current.lerp(targetLook.current, 0.05);
    
    camera.lookAt(currentLook.current);
  });

  return (
    <group ref={group}>
      {/* Camera is parented to this group for parallax offset */}
      <primitive object={camera} />
    </group>
  );
}
