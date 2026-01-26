import { useRef, useEffect, useState } from 'react';
import { useAtlasStore } from '../../../stores/atlasStore';
import { getBiomeCenter, getAllBiomes } from '../../../lib/atlas/biomeLayout';

const BIOMES = getAllBiomes();

export function CompassRing() {
  const cameraPosition = useAtlasStore((s) => s.cameraPosition);
  const [heading, setHeading] = useState(0);
  const [biomeAngles, setBiomeAngles] = useState<Record<string, number>>({});
  const rafRef = useRef<number | undefined>(undefined);

  // Update compass on animation frame (uses store position, not R3F camera directly)
  // This runs outside the canvas but reads from the synced store
  useEffect(() => {
    const update = () => {
      // Since we don't have access to camera rotation in this component,
      // we'll show biome directions based on position only
      // The compass heading will be approximated from camera position

      const newAngles: Record<string, number> = {};
      BIOMES.forEach(biome => {
        const center = getBiomeCenter(biome);
        const dx = center[0] - cameraPosition[0];
        const dz = center[2] - cameraPosition[2];
        const angle = Math.atan2(dx, -dz) * (180 / Math.PI);
        newAngles[biome] = angle;
      });
      setBiomeAngles(newAngles);

      rafRef.current = requestAnimationFrame(update);
    };

    rafRef.current = requestAnimationFrame(update);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [cameraPosition]);

  return (
    <div className="compass-ring hud-panel">
      <div className="compass-ring__track">
        {/* Center notch */}
        <div className="compass-ring__notch">▼</div>

        {/* Biome markers */}
        {BIOMES.map(biome => {
          const angle = biomeAngles[biome] || 0;
          // Only show if within ±60° of forward
          const visible = Math.abs(angle) < 60;
          const position = 50 + (angle / 60) * 45; // Map to 5-95% of width

          return (
            <div
              key={biome}
              className={`compass-ring__marker compass-ring__marker--${biome}`}
              style={{
                display: visible ? 'flex' : 'none',
                left: `${position}%`,
                opacity: 1 - Math.abs(angle) / 90,
              }}
            >
              <span className="compass-ring__marker-icon">◆</span>
              <span className="compass-ring__marker-label">{biome[0].toUpperCase()}</span>
            </div>
          );
        })}

        {/* Heading display - approximate based on position */}
        <div className="compass-ring__heading">
          {Math.round(((heading % 360) + 360) % 360)}°
        </div>
      </div>
    </div>
  );
}
