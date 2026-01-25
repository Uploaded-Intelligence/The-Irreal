import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { VoidParticles } from './VoidParticles';
import { MetaballScene } from './MetaballScene';
import { FlowFieldParticles } from './FlowFieldParticles';
import { CameraRig } from './CameraRig';
import { PortalGroup } from './PortalGroup';
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
        {/* Camera controller - handles z-axis movement and crossing animation */}
        <CameraRig />

        {/* Ambient light for subtle particle illumination */}
        <ambientLight intensity={0.2} color="#7c6fe0" />
        <pointLight position={[0, 0, -30]} intensity={1} color="#7c6fe0" />

        {/* Background: distant starfield (z: -100 to -50) */}
        <Stars
          radius={100}
          depth={50}
          count={2000}
          factor={4}
          saturation={0.1}
          fade
          speed={0.5}
        />

        {/* Particles around camera origin (z: -50 to +50) */}
        <group position={[0, 0, 0]}>
          <VoidParticles count={2000} radius={50} />
        </group>

        {/* Mid-ground: curl noise flow field (z: -15) */}
        <group position={[0, 0, -15]}>
          <FlowFieldParticles count={800} size={0.04} color="#6bc5ff" speed={0.4} />
        </group>

        {/* Foreground: organic morphin metaballs (z: +5) */}
        <group position={[0, 0, 5]}>
          <MetaballScene count={6} resolution={40} color="#9d8fff" />
        </group>

        {/* Portals at z: -35 (rendered by PortalGroup when stage is portals/crossing) */}
        <PortalGroup />

        {/* Post-processing effects */}
        <EffectComposer>
          <Bloom
            intensity={0.5}
            luminanceThreshold={0.15}
            luminanceSmoothing={0.9}
            mipmapBlur
          />
          <ChromaticAberration
            blendFunction={BlendFunction.NORMAL}
            offset={[0.001, 0.001]}
            radialModulation={true}
            modulationOffset={0.5}
          />
          <Vignette darkness={0.5} offset={0.3} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
