import { VoidScene } from './VoidScene';
import { CrystallizingText } from './CrystallizingText';
import { PortalLayer } from './PortalLayer';
import { CrossingTransition } from './CrossingTransition';
import { ThresholdOrchestrator } from './ThresholdOrchestrator';
import { useThresholdStore } from '../../stores/thresholdStore';

// Debug component to show current stage
function DebugOverlay() {
  const stage = useThresholdStore((s) => s.stage);
  return (
    <div style={{
      position: 'fixed',
      top: 10,
      left: 10,
      background: 'rgba(0,0,0,0.8)',
      color: '#0f0',
      padding: '10px',
      fontFamily: 'monospace',
      fontSize: '14px',
      zIndex: 9999,
    }}>
      Stage: {stage}
    </div>
  );
}

export function ThresholdExperience() {
  return (
    <>
      {/* Debug overlay */}
      <DebugOverlay />

      {/* Logic controller - no visual output */}
      <ThresholdOrchestrator />

      {/* Background layer: void with particles */}
      <VoidScene />

      {/* Text layer: crystallizing title */}
      <CrystallizingText />

      {/* Portal layer: navigation options */}
      <PortalLayer />

      {/* Transition layer: crossing effect */}
      <CrossingTransition />
    </>
  );
}
