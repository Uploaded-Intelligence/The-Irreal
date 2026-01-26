import { useAtlasStore } from '../../../stores/atlasStore';

const SCAN_RADIUS = 50; // Units in 3D space
const DISPLAY_RADIUS = 45; // Pixels

export function ProximityScanner() {
  const cameraPosition = useAtlasStore((s) => s.cameraPosition);
  const nodes = useAtlasStore((s) => s.nodes);
  const selectedNodeId = useAtlasStore((s) => s.selectedNodeId);

  return (
    <div className="scanner hud-panel">
      <div className="scanner__label">PROXIMITY</div>
      <div className="scanner__display">
        {/* Rings */}
        <div className="scanner__ring scanner__ring--inner" />
        <div className="scanner__ring scanner__ring--outer" />

        {/* Center (you) */}
        <div className="scanner__center" />

        {/* Sweep line */}
        <div className="scanner__sweep" />

        {/* Node dots */}
        {nodes.map(node => {
          // Vector from camera to node (flatten to XZ plane)
          const dx = node.x - cameraPosition[0];
          const dz = node.z - cameraPosition[2];
          const distance = Math.sqrt(dx * dx + dz * dz);

          if (distance > SCAN_RADIUS) return null;

          // Scale to display
          const displayX = (dx / SCAN_RADIUS) * DISPLAY_RADIUS;
          const displayZ = (dz / SCAN_RADIUS) * DISPLAY_RADIUS;

          const isSelected = node.id === selectedNodeId;

          return (
            <div
              key={node.id}
              className={`scanner__dot scanner__dot--${node.biome} ${isSelected ? 'scanner__dot--selected' : ''}`}
              style={{
                left: `${50 + displayX}px`,
                top: `${50 + displayZ}px`,
                opacity: 1 - distance / SCAN_RADIUS,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
