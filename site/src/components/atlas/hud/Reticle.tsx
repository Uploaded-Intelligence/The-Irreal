import { useAtlasStore } from '../../../stores/atlasStore';

export function Reticle() {
  const hoveredNodeId = useAtlasStore((s) => s.hoveredNodeId);
  const hyperdrive = useAtlasStore((s) => s.hyperdrive);

  const isTargeting = hoveredNodeId !== null;
  const isLocking = hyperdrive.phase === 'locking';
  const isCharging = hyperdrive.phase === 'charging';

  return (
    <div className="reticle">
      {/* Center dot */}
      <div className={`reticle__dot ${isTargeting ? 'reticle__dot--target' : ''}`} />

      {/* Outer ring - expands when targeting */}
      <div className={`reticle__ring ${isTargeting ? 'reticle__ring--expand' : ''}`}>
        <svg viewBox="0 0 100 100" width="60" height="60">
          <circle
            cx="50" cy="50" r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray={isTargeting ? "10 5" : "2 8"}
            className="reticle__circle"
          />
        </svg>
      </div>

      {/* Lock brackets - appear during locking phase */}
      {(isLocking || isCharging) && (
        <div className="reticle__brackets">
          <span className="reticle__bracket reticle__bracket--tl">┌</span>
          <span className="reticle__bracket reticle__bracket--tr">┐</span>
          <span className="reticle__bracket reticle__bracket--bl">└</span>
          <span className="reticle__bracket reticle__bracket--br">┘</span>
        </div>
      )}

      {/* Charge progress ring */}
      {isCharging && (
        <svg className="reticle__charge" viewBox="0 0 100 100" width="80" height="80">
          <circle
            cx="50" cy="50" r="40"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray={`${hyperdrive.progress * 251} 251`}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
          />
        </svg>
      )}
    </div>
  );
}
