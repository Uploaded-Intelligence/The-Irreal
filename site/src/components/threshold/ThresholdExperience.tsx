import { VoidScene } from './VoidScene';
import { CrystallizingText } from './CrystallizingText';
import { ThresholdOrchestrator } from './ThresholdOrchestrator';

export function ThresholdExperience() {
  return (
    <>
      {/* Logic controller - no visual output */}
      <ThresholdOrchestrator />

      {/* Unified 3D scene: void, particles, portals, camera movement */}
      <VoidScene />

      {/* Text layer: crystallizing title (CSS overlay) */}
      <CrystallizingText />
    </>
  );
}
