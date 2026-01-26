import { useAtlasStore } from '../../../stores/atlasStore';

const PHASE_LABELS: Record<string, string> = {
  idle: 'READY',
  locking: 'LOCKING TARGET',
  charging: 'CHARGING DRIVE',
  traveling: 'IN TRANSIT',
  arriving: 'DECELERATING',
  orbiting: 'ENTERING ORBIT',
};

const PHASE_ICONS: Record<string, string> = {
  idle: '◇',
  locking: '◈',
  charging: '◆',
  traveling: '»',
  arriving: '«',
  orbiting: '○',
};

export function HyperdrivePanel() {
  const hyperdrive = useAtlasStore((s) => s.hyperdrive);
  const nodes = useAtlasStore((s) => s.nodes);

  const targetNode = hyperdrive.targetNodeId
    ? nodes.find(n => n.id === hyperdrive.targetNodeId)
    : null;

  const isActive = hyperdrive.phase !== 'idle';

  return (
    <div className={`hyperdrive-panel hud-panel ${isActive ? 'hyperdrive-panel--active' : ''}`}>
      <div className="hyperdrive-panel__header">
        <span className="hyperdrive-panel__icon">{PHASE_ICONS[hyperdrive.phase]}</span>
        <span className="hyperdrive-panel__label">HYPERDRIVE</span>
      </div>

      <div className="hyperdrive-panel__status">
        {PHASE_LABELS[hyperdrive.phase]}
      </div>

      {/* Progress bar */}
      {isActive && (
        <div className="hyperdrive-panel__progress">
          <div
            className="hyperdrive-panel__progress-fill"
            style={{ width: `${hyperdrive.progress * 100}%` }}
          />
        </div>
      )}

      {/* Target info */}
      {targetNode && (
        <div className="hyperdrive-panel__target">
          <div className="hyperdrive-panel__target-label">DESTINATION</div>
          <div className="hyperdrive-panel__target-name">{targetNode.title}</div>
          <div className="hyperdrive-panel__target-biome">{targetNode.biome.toUpperCase()}</div>
        </div>
      )}

      {/* Idle hint */}
      {!isActive && (
        <div className="hyperdrive-panel__hint">
          Click world to engage
        </div>
      )}
    </div>
  );
}
