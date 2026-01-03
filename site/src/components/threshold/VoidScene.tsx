import { Canvas } from '@react-three/fiber';
import { VoidParticles } from './VoidParticles';
import { useThresholdStore } from '../../stores/thresholdStore';

export function VoidScene() {
  const prefersReducedMotion = useThresholdStore((s) => s.prefersReducedMotion);

  // Reduced motion fallback - static gradient instead of 3D
  if (prefersReducedMotion) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'radial-gradient(ellipse at center, #1a1a24 0%, #0a0a0f 70%)',
          zIndex: 0,
        }}
      />
    );
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 0], fov: 75 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: '#0a0a0f' }}
      >
        {/* Ambient light for subtle particle illumination */}
        <ambientLight intensity={0.2} color="#7c6fe0" />

        {/* Particles surround the camera */}
        <VoidParticles count={2000} radius={50} />
      </Canvas>
    </div>
  );
}
