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

  // Camera state (for unified 3D scene)
  cameraZ: number;
  cameraTargetZ: number;
  crossingProgress: number;

  // Actions
  setStage: (stage: ThresholdStage) => void;
  setMousePosition: (x: number, y: number) => void;
  setMouseVelocity: (velocity: number) => void;
  setPrefersReducedMotion: (prefers: boolean) => void;
  setAudioEnabled: (enabled: boolean) => void;
  selectPortal: (portal: 'atlas' | 'grove') => void;
  setCameraTargetZ: (z: number) => void;
  startCrossing: () => void;
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
  cameraZ: 0,
  cameraTargetZ: 0,
  crossingProgress: 0,
};

export const useThresholdStore = create<ThresholdState>((set) => ({
  ...initialState,

  setStage: (stage) => set({ stage, stageStartTime: Date.now() }),

  setMousePosition: (x, y) => set({ mousePosition: { x, y } }),

  setMouseVelocity: (velocity) => set({ mouseVelocity: velocity }),

  setPrefersReducedMotion: (prefers) => set({ prefersReducedMotion: prefers }),

  setAudioEnabled: (enabled) => set({ audioEnabled: enabled }),

  selectPortal: (portal) => set({ selectedPortal: portal, stage: 'crossing' }),

  setCameraTargetZ: (z) => set({ cameraTargetZ: z }),

  startCrossing: () => set({ crossingProgress: 0 }),

  reset: () => set(initialState),
}));
