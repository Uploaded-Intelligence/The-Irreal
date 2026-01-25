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

  const currentZ = useRef(0);
  const crossingPath = useRef<THREE.CatmullRomCurve3 | null>(null);
  const crossingProgress = useRef(0);

  // Update target Z when stage changes
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Mouse parallax (subtle)
    const parallaxMult = stage === 'crossing' ? 0.2 : 1;
    const parallaxX = state.pointer.x * 2 * parallaxMult;
    const parallaxY = state.pointer.y * 1.5 * parallaxMult;

    groupRef.current.position.x += (parallaxX - groupRef.current.position.x) * 2 * delta;
    groupRef.current.position.y += (parallaxY - groupRef.current.position.y) * 2 * delta;

    if (stage === 'crossing' && crossingPath.current) {
      // Spline-based crossing
      crossingProgress.current += delta / 1.5; // 1.5s duration
      const t = easeOutCubic(Math.min(crossingProgress.current, 1));

      const point = crossingPath.current.getPointAt(t);
      camera.position.copy(point);
      camera.position.x += groupRef.current.position.x;
      camera.position.y += groupRef.current.position.y;

      // Look ahead
      const lookAhead = crossingPath.current.getPointAt(Math.min(t + 0.05, 1));
      camera.lookAt(lookAhead);
    } else {
      // Stage-based z position
      const targetZ = CAMERA_POSITIONS[stage] ?? 0;
      const easing = 0.03;
      currentZ.current += (targetZ - currentZ.current) * easing;

      camera.position.z = currentZ.current;
      camera.lookAt(0, 0, currentZ.current - 20);
    }
  });

  // Create crossing path when entering crossing stage
  useFrame(() => {
    if (stage === 'crossing' && selectedPortal && !crossingPath.current) {
      const portalX = selectedPortal === 'atlas' ? -8 : 8;
      crossingPath.current = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, currentZ.current),
        new THREE.Vector3(portalX * 0.3, 0, currentZ.current - 15),
        new THREE.Vector3(portalX * 0.8, 0, -40),
        new THREE.Vector3(portalX * 0.5, 0, -100),
        new THREE.Vector3(0, 0, -200),
      ]);
      crossingProgress.current = 0;
    }

    // Reset path when not crossing
    if (stage !== 'crossing') {
      crossingPath.current = null;
    }
  });

  return <group ref={groupRef} />;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}
