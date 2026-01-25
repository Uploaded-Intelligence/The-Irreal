import { Portal } from './Portal';
import { useThresholdStore } from '../../stores/thresholdStore';

export function PortalGroup() {
  const stage = useThresholdStore((s) => s.stage);
  const selectPortal = useThresholdStore((s) => s.selectPortal);

  // Only visible during portals/crossing stages
  const visible = stage === 'portals' || stage === 'crossing';
  if (!visible) return null;

  return (
    <group position={[0, 0, -35]}>
      {/* Atlas Portal - Left */}
      <Portal
        position={[-8, 0, 0]}
        color="#7c6fe0"
        glowColor="#9d8fff"
        label="Mycelium Atlas"
        hint="Navigate the network"
        onClick={() => selectPortal('atlas')}
        scale={3}
      />

      {/* Grove Portal - Right */}
      <Portal
        position={[8, 0, 0]}
        color="#4a9d6a"
        glowColor="#6bc59a"
        label="The Grove"
        hint="All worlds, listed"
        onClick={() => selectPortal('grove')}
        scale={3}
      />
    </group>
  );
}
