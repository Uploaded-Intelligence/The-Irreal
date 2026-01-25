import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useThresholdStore } from '../../stores/thresholdStore';

const CAMERA_POSITIONS: Record<string, number> = {
  detection: 0,
  void: 0,
  attunement: 0,
  crystallization: -5,
  portals: -15,
  crossing: -15, // Starting position for crossing
};

export function CameraRig() {
  const { camera } = useThree();
  const groupRef = useRef<THREE.Group>(null);

  const stage = useThresholdStore((s) => s.stage);
  const selectedPortal = useThresholdStore((s) => s.selectedPortal);

  // We track velocity for true spring physics eventually, but for now
  // smooth damping provides the "drawn toward" feeling better than linear lerp
  const currentPos = useRef(new THREE.Vector3(0, 0, 0));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, -50));

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // 1. Determine Target Position based on Stage
    const targetPos = new THREE.Vector3(0, 0, 0);
    
    if (stage === 'crossing' && selectedPortal) {
      // Fly deep into the portal
      const portalX = selectedPortal === 'atlas' ? -8 : 8;
      // We target a point *past* the visual portal to ensure we fly through it
      targetPos.set(portalX, 0, -200); 
    } else {
      // Standard z-depth for stages
      const zDepth = CAMERA_POSITIONS[stage] ?? 0;
      targetPos.set(0, 0, zDepth);
    }

    // 2. Apply "Drawn Toward" Physics (Damping)
    // We use different smoothing factors for X/Y vs Z to feel "heavy" yet "responsive"
    // Lambda (smoothing factor): higher = faster
    
    // Z-axis: The "Pull" (slower acceleration, feels heavy)
    const zSmooth = stage === 'crossing' ? 1.5 : 2.5; 
    currentPos.current.z = THREE.MathUtils.damp(
      currentPos.current.z, 
      targetPos.z, 
      zSmooth, 
      delta
    );

    // X/Y-axis: The "Drift" (slightly looser than Z during crossing)
    const xySmooth = stage === 'crossing' ? 2.0 : 3.0;
    currentPos.current.x = THREE.MathUtils.damp(
      currentPos.current.x, 
      targetPos.x, 
      xySmooth, 
      delta
    );
    currentPos.current.y = THREE.MathUtils.damp(
      currentPos.current.y, 
      targetPos.y, 
      xySmooth, 
      delta
    );

    // 3. Mouse Parallax (Head Look)
    // Instead of moving the world, we subtle shift the camera to simulate head movement
    const mouseX = state.pointer.x;
    const mouseY = state.pointer.y;
    
    // Parallax intensity
    const intensity = 2.0;
    const parallaxX = mouseX * intensity;
    const parallaxY = mouseY * intensity;

    // Apply to camera
    camera.position.copy(currentPos.current);
    camera.position.x += parallaxX;
    camera.position.y += parallaxY;

    // 4. LookAt Logic
    // We look slightly ahead of where we are going
    targetLookAt.current.set(
      currentPos.current.x * 0.5, // Look slightly towards center
      currentPos.current.y * 0.5,
      currentPos.current.z - 20 // Look ahead
    );

    // If crossing, look firmly at the destination
    if (stage === 'crossing' && selectedPortal) {
       const portalX = selectedPortal === 'atlas' ? -8 : 8;
       targetLookAt.current.set(portalX, 0, -200);
    }

    camera.lookAt(targetLookAt.current);
  });

  return <group ref={groupRef} />;
}
