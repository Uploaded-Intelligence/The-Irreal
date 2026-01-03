import { VoidScene } from './VoidScene';
import { CrystallizingText } from './CrystallizingText';
import { PortalLayer } from './PortalLayer';
import { CrossingTransition } from './CrossingTransition';
import { ThresholdOrchestrator } from './ThresholdOrchestrator';

export function ThresholdExperience() {
  return (
    <>
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
