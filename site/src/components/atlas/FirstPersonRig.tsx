import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import * as THREE from 'three';
import { useAtlasStore } from '../../stores/atlasStore';

export function FirstPersonRig() {
  const { camera, gl } = useThree();
  const controlsRef = useRef<any>(null);

  // Read primitives from store, create vectors in render
  const velocity = useAtlasStore((s) => s.velocity);
  const updateVelocity = useAtlasStore((s) => s.updateVelocity);
  const setCameraPosition = useAtlasStore((s) => s.setCameraPosition);
  const hyperdrive = useAtlasStore((s) => s.hyperdrive);

  // Movement vectors (created once, reused)
  const moveVector = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    // Skip during hyperdrive travel
    if (hyperdrive.phase !== 'idle' && hyperdrive.phase !== 'orbiting') return;

    // Update velocity based on input
    updateVelocity(delta);

    // Get camera's forward and right vectors
    camera.getWorldDirection(direction.current);
    const right = new THREE.Vector3().crossVectors(direction.current, camera.up).normalize();

    // Apply velocity in camera-relative space
    moveVector.current.set(0, 0, 0);
    moveVector.current.addScaledVector(direction.current, -velocity[2] * delta); // forward/back
    moveVector.current.addScaledVector(right, velocity[0] * delta); // left/right
    moveVector.current.y += velocity[1] * delta; // up/down

    camera.position.add(moveVector.current);

    // Sync position to store for trail rendering
    setCameraPosition([camera.position.x, camera.position.y, camera.position.z]);
  });

  // Lock pointer on canvas click
  useEffect(() => {
    const handleClick = () => {
      if (controlsRef.current && hyperdrive.phase === 'idle') {
        controlsRef.current.lock();
      }
    };
    gl.domElement.addEventListener('click', handleClick);
    return () => gl.domElement.removeEventListener('click', handleClick);
  }, [gl, hyperdrive.phase]);

  return (
    <PointerLockControls
      ref={controlsRef}
      makeDefault
    />
  );
}
