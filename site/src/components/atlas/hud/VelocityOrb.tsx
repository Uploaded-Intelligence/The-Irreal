import { useAtlasStore } from '../../../stores/atlasStore';

export function VelocityOrb() {
  const velocity = useAtlasStore((s) => s.velocity);
  const isBoosting = useAtlasStore((s) => s.isBoosting);

  const speed = Math.sqrt(velocity[0]**2 + velocity[1]**2 + velocity[2]**2);
  const maxSpeed = isBoosting ? 30 : 12;
  const speedPercent = Math.min(speed / maxSpeed * 100, 100);

  // Velocity vector visualization (normalized)
  const vx = speed > 0.1 ? (velocity[0] / speed) * 15 : 0;
  const vy = speed > 0.1 ? (-velocity[1] / speed) * 15 : 0; // Invert Y for screen coords

  return (
    <div className="velocity-orb hud-panel">
      <div className="velocity-orb__label">DRIFT</div>

      {/* Outer ring with speed fill */}
      <svg className="velocity-orb__ring" viewBox="0 0 100 100" width="80" height="80">
        {/* Background ring */}
        <circle
          cx="50" cy="50" r="40"
          fill="none"
          stroke="var(--hud-color-dim)"
          strokeWidth="2"
        />
        {/* Speed fill */}
        <circle
          cx="50" cy="50" r="40"
          fill="none"
          stroke={isBoosting ? 'var(--hud-color-bright)' : 'var(--hud-color)'}
          strokeWidth="3"
          strokeDasharray={`${speedPercent * 2.51} 251`}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
          style={{ transition: 'stroke-dasharray 0.1s ease' }}
        />
        {/* Cross-hairs */}
        <line x1="50" y1="10" x2="50" y2="20" stroke="var(--hud-color-dim)" strokeWidth="1" />
        <line x1="50" y1="80" x2="50" y2="90" stroke="var(--hud-color-dim)" strokeWidth="1" />
        <line x1="10" y1="50" x2="20" y2="50" stroke="var(--hud-color-dim)" strokeWidth="1" />
        <line x1="80" y1="50" x2="90" y2="50" stroke="var(--hud-color-dim)" strokeWidth="1" />
      </svg>

      {/* Center velocity indicator */}
      <div
        className="velocity-orb__indicator"
        style={{
          transform: `translate(calc(-50% + ${vx}px), calc(-50% + ${vy}px))`,
          opacity: speed > 0.1 ? 1 : 0.3,
        }}
      />

      {/* Speed readout */}
      <div className="velocity-orb__speed">
        {speed.toFixed(1)}
        {isBoosting && <span className="velocity-orb__boost">▲</span>}
      </div>
    </div>
  );
}
