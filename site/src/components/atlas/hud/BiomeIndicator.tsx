import { useAtlasStore } from '../../../stores/atlasStore';
import { getBiomeCenter, getAllBiomes } from '../../../lib/atlas/biomeLayout';

const BIOMES = getAllBiomes();

const BIOME_INFO: Record<string, { name: string; depth: number; color: string }> = {
  threshold: { name: 'The Threshold', depth: 1, color: '#88ff88' },
  lore: { name: 'Lore Archives', depth: 2, color: '#ffaa88' },
  creation: { name: 'Creation Grounds', depth: 2, color: '#ff88ff' },
  play: { name: 'Play Fields', depth: 3, color: '#ffff88' },
  reflection: { name: 'Reflection Pools', depth: 3, color: '#88ffff' },
  deep: { name: 'The Deep', depth: 4, color: '#8888ff' },
};

export function BiomeIndicator() {
  const cameraPosition = useAtlasStore((s) => s.cameraPosition);

  // Find closest biome
  let closestBiome = 'threshold';
  let closestDist = Infinity;

  BIOMES.forEach(biome => {
    const center = getBiomeCenter(biome);
    const dist = Math.sqrt(
      (cameraPosition[0] - center[0]) ** 2 +
      (cameraPosition[1] - center[1]) ** 2 +
      (cameraPosition[2] - center[2]) ** 2
    );
    if (dist < closestDist) {
      closestDist = dist;
      closestBiome = biome;
    }
  });

  const biome = BIOME_INFO[closestBiome] || BIOME_INFO.threshold;
  const depthBars = Array(4).fill(0).map((_, i) => i < biome.depth);

  return (
    <div className="biome-indicator hud-panel">
      <div className="biome-indicator__label">REGION</div>

      <div
        className="biome-indicator__name"
        style={{ color: biome.color }}
      >
        {biome.name}
      </div>

      <div className="biome-indicator__depth">
        <span className="biome-indicator__depth-label">DEPTH</span>
        <div className="biome-indicator__depth-bars">
          {depthBars.map((active, i) => (
            <div
              key={i}
              className={`biome-indicator__bar ${active ? 'biome-indicator__bar--active' : ''}`}
              style={active ? { background: biome.color } : {}}
            />
          ))}
        </div>
      </div>

      <div className="biome-indicator__distance">
        {closestDist.toFixed(0)}u from center
      </div>
    </div>
  );
}
