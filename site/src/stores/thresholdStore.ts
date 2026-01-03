import { create } from 'zustand';

export type ThresholdStage =
  | 'detection'
  | 'void'
  | 'attunement'
  | 'crystallization'
  | 'portals'
  | 'crossing';

interface ThresholdState {
  // Stage
  stage: ThresholdStage;
  stageStartTime: number;

  // User input
  mousePosition: { x: number; y: number };
  mouseVelocity: number;

  // Preferences (detected in detection stage)
  prefersReducedMotion: boolean;
  audioEnabled: boolean;

  // Portal selection
  selectedPortal: 'atlas' | 'grove' | null;

  // Actions
  setStage: (stage: ThresholdStage) => void;
  setMousePosition: (x: number, y: number) => void;
  setMouseVelocity: (velocity: number) => void;
  setPrefersReducedMotion: (prefers: boolean) => void;
  setAudioEnabled: (enabled: boolean) => void;
  selectPortal: (portal: 'atlas' | 'grove') => void;
  reset: () => void;
}

const initialState = {
  stage: 'detection' as ThresholdStage,
  stageStartTime: Date.now(),
  mousePosition: { x: 0, y: 0 },
  mouseVelocity: 0,
  prefersReducedMotion: false,
  audioEnabled: true,
  selectedPortal: null,
};

export const useThresholdStore = create<ThresholdState>((set) => ({
  ...initialState,

  setStage: (stage) => set({ stage, stageStartTime: Date.now() }),

  setMousePosition: (x, y) => set({ mousePosition: { x, y } }),

  setMouseVelocity: (velocity) => set({ mouseVelocity: velocity }),

  setPrefersReducedMotion: (prefers) => set({ prefersReducedMotion: prefers }),

  setAudioEnabled: (enabled) => set({ audioEnabled: enabled }),

  selectPortal: (portal) => set({ selectedPortal: portal, stage: 'crossing' }),

  reset: () => set(initialState),
}));
