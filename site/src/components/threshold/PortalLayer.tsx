import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Portal } from './Portal';
import { useThresholdStore } from '../../stores/thresholdStore';

export function PortalLayer() {
  const stage = useThresholdStore((s) => s.stage);
  const selectPortal = useThresholdStore((s) => s.selectPortal);
  const [visible, setVisible] = useState(false);

  // Fade in portals when entering 'portals' stage
  useEffect(() => {
    if (stage === 'portals') {
      const timer = setTimeout(() => setVisible(true), 500);
      return () => clearTimeout(timer);
    } else if (stage === 'crossing') {
      // Keep visible during crossing
    } else {
      setVisible(false);
    }
  }, [stage]);

  if (!visible && stage !== 'crossing') return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 5,
        opacity: visible ? 1 : 0,
        transition: 'opacity 1s ease',
        pointerEvents: stage === 'portals' ? 'auto' : 'none',
      }}
    >
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[0, 0, 5]} intensity={1} color="#7c6fe0" />

        {/* Atlas Portal - Left */}
        <Portal
          position={[-4, 0, 0]}
          color="#7c6fe0"
          glowColor="#9d8fff"
          label="Mycelium Atlas"
          hint="Navigate the network"
          onClick={() => selectPortal('atlas')}
        />

        {/* Grove Portal - Right */}
        <Portal
          position={[4, 0, 0]}
          color="#4a9d6a"
          glowColor="#6bc59a"
          label="The Grove"
          hint="All worlds, listed"
          onClick={() => selectPortal('grove')}
        />
      </Canvas>
    </div>
  );
}
