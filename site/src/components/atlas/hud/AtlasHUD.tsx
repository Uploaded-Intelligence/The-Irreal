import { useAtlasStore } from '../../../stores/atlasStore';
import { Reticle } from './Reticle';
import { CompassRing } from './CompassRing';
import { VelocityOrb } from './VelocityOrb';
import { HyperdrivePanel } from './HyperdrivePanel';
import { ProximityScanner } from './ProximityScanner';
import { BiomeIndicator } from './BiomeIndicator';
import './hud.css';

export function AtlasHUD() {
  const hyperdrive = useAtlasStore((s) => s.hyperdrive);
  const hudVisible = useAtlasStore((s) => s.hudVisible);

  const isHyperdriving = hyperdrive.phase !== 'idle';

  // Hide HUD when toggled off
  if (!hudVisible) return null;

  return (
    <div className={`atlas-hud ${isHyperdriving ? 'hud--hyperdrive' : ''}`}>
      {/* Center */}
      <Reticle />

      {/* Top */}
      <CompassRing />

      {/* Bottom-left */}
      <VelocityOrb />

      {/* Bottom-right */}
      <HyperdrivePanel />

      {/* Top-right */}
      <ProximityScanner />

      {/* Top-left */}
      <BiomeIndicator />
    </div>
  );
}
