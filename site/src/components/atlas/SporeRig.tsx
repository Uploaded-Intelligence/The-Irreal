import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useAtlasStore } from '../../stores/atlasStore';

export function SporeRig() {
  const { camera, gl } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  
  const cameraTarget = useAtlasStore((s) => s.cameraTarget);

  const currentPos = useRef(new THREE.Vector3(0, 0, 30));
  const targetPos = useRef(new THREE.Vector3(0, 0, 30));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));

  // Handle Click-to-Travel
  useEffect(() => {
    const handlePointerDown = () => {
      // Find the currently hovered node position from store
      // In a real app we'd use the store's cameraTarget which is set on hover
      const target = new THREE.Vector3(...cameraTarget);
      
      // Move to a position near the node
      const dir = new THREE.Vector3().subVectors(currentPos.current, target).normalize();
      targetPos.current.copy(target).add(dir.multiplyScalar(6));
      targetLookAt.current.copy(target);
    };

    gl.domElement.addEventListener('pointerdown', handlePointerDown);
    return () => gl.domElement.removeEventListener('pointerdown', handlePointerDown);
  }, [cameraTarget, gl]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // 1. Position Damping (Zero-G Swim)
    currentPos.current.x = THREE.MathUtils.damp(currentPos.current.x, targetPos.current.x, 1.5, delta);
    currentPos.current.y = THREE.MathUtils.damp(currentPos.current.y, targetPos.current.y, 1.5, delta);
    currentPos.current.z = THREE.MathUtils.damp(currentPos.current.z, targetPos.current.z, 1.5, delta);

    camera.position.copy(currentPos.current);

    // 2. Mouse Parallax (Head Drift)
    const parallaxX = state.pointer.x * 2;
    const parallaxY = state.pointer.y * 1.5;
    groupRef.current.position.x += (parallaxX - groupRef.current.position.x) * 2 * delta;
    groupRef.current.position.y += (parallaxY - groupRef.current.position.y) * 2 * delta;

    // 3. LookAt Damping
    const nextLookAt = new THREE.Vector3(...cameraTarget);
    currentLookAt.current.lerp(nextLookAt, 0.05);
    camera.lookAt(currentLookAt.current);
  });

  return (
    <group ref={groupRef}>
      <primitive object={camera} />
    </group>
  );
}
