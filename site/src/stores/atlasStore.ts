import { create } from 'zustand';

export interface AtlasNode {
  id: string;
  title: string;
  summary?: string;
  biome: string;
  stage: string;
  x: number;
  y: number;
  z: number;
}

export interface AtlasEdge {
  source: string;
  target: string;
}

export type HyperdrivePhase = 'idle' | 'locking' | 'charging' | 'traveling' | 'arriving' | 'orbiting';

export interface HyperdriveState {
  phase: HyperdrivePhase;
  targetNodeId: string | null;
  targetPosition: [number, number, number] | null;
  startPosition: [number, number, number] | null;
  progress: number;
}

interface AtlasState {
  // Graph
  nodes: AtlasNode[];
  edges: AtlasEdge[];

  // Selection
  hoveredNodeId: string | null;
  hoveredNodePos: [number, number, number] | null;
  selectedNodeId: string | null;
  focusedIndex: number;

  // Movement (tuples only, no THREE objects!)
  cameraPosition: [number, number, number];
  velocity: [number, number, number];
  targetVelocity: [number, number, number];
  moveDirection: { forward: number; right: number; up: number };
  isBoosting: boolean;

  // Hyperdrive
  hyperdrive: HyperdriveState;

  // HUD
  hudVisible: boolean;

  // Actions
  setGraph: (nodes: AtlasNode[], edges: AtlasEdge[]) => void;
  setHoveredNode: (id: string | null, pos?: [number, number, number] | null) => void;
  selectNode: (id: string | null) => void;
  focusNextNode: () => void;
  focusPrevNode: () => void;

  // Movement actions
  setCameraPosition: (pos: [number, number, number]) => void;
  setMoveDirection: (dir: { forward: number; right: number; up: number }) => void;
  setBoosting: (boosting: boolean) => void;
  updateVelocity: (delta: number) => void;

  // Hyperdrive actions
  initiateHyperdrive: (nodeId: string, nodePosition: [number, number, number], cameraPosition: [number, number, number]) => void;
  advanceHyperdrive: (phase: HyperdrivePhase, progress?: number) => void;
  cancelHyperdrive: () => void;

  // HUD actions
  toggleHUD: () => void;
}

const MOVEMENT = {
  maxSpeed: 12,
  boostMultiplier: 2.5,
  acceleration: 40,  // units/sec²
  deceleration: 25,  // units/sec² (slower = drift feel)
};

export const useAtlasStore = create<AtlasState>((set, get) => ({
  // Initial state
  nodes: [],
  edges: [],
  hoveredNodeId: null,
  hoveredNodePos: null,
  selectedNodeId: null,
  focusedIndex: -1,

  cameraPosition: [0, 5, 20],
  velocity: [0, 0, 0],
  targetVelocity: [0, 0, 0],
  moveDirection: { forward: 0, right: 0, up: 0 },
  isBoosting: false,

  hyperdrive: {
    phase: 'idle',
    targetNodeId: null,
    targetPosition: null,
    startPosition: null,
    progress: 0,
  },

  hudVisible: true,

  // Graph actions
  setGraph: (nodes, edges) => set({ nodes, edges }),
  setHoveredNode: (id, pos) => set({ hoveredNodeId: id, hoveredNodePos: pos || null }),
  selectNode: (id) => set({ selectedNodeId: id }),

  focusNextNode: () => {
    const { nodes, focusedIndex } = get();
    if (nodes.length === 0) return;
    const nextIndex = (focusedIndex + 1) % nodes.length;
    const node = nodes[nextIndex];
    set({ focusedIndex: nextIndex, selectedNodeId: node.id });
  },

  focusPrevNode: () => {
    const { nodes, focusedIndex } = get();
    if (nodes.length === 0) return;
    const prevIndex = focusedIndex <= 0 ? nodes.length - 1 : focusedIndex - 1;
    const node = nodes[prevIndex];
    set({ focusedIndex: prevIndex, selectedNodeId: node.id });
  },

  // Movement actions
  setCameraPosition: (pos) => set({ cameraPosition: pos }),

  setMoveDirection: (dir) => set({ moveDirection: dir }),

  setBoosting: (boosting) => set({ isBoosting: boosting }),

  updateVelocity: (delta) => {
    const { moveDirection, isBoosting, velocity } = get();
    const speed = MOVEMENT.maxSpeed * (isBoosting ? MOVEMENT.boostMultiplier : 1);

    // Target velocity based on input
    const targetX = moveDirection.right * speed;
    const targetY = moveDirection.up * speed;
    const targetZ = moveDirection.forward * speed;

    // Smooth interpolation (acceleration when input, deceleration when none)
    const hasInput = moveDirection.forward !== 0 || moveDirection.right !== 0 || moveDirection.up !== 0;
    const rate = (hasInput ? MOVEMENT.acceleration : MOVEMENT.deceleration) * delta;

    const newVelocity: [number, number, number] = [
      velocity[0] + Math.sign(targetX - velocity[0]) * Math.min(Math.abs(targetX - velocity[0]), rate),
      velocity[1] + Math.sign(targetY - velocity[1]) * Math.min(Math.abs(targetY - velocity[1]), rate),
      velocity[2] + Math.sign(targetZ - velocity[2]) * Math.min(Math.abs(targetZ - velocity[2]), rate),
    ];

    set({ velocity: newVelocity });
  },

  // Hyperdrive actions
  initiateHyperdrive: (nodeId, nodePosition, cameraPosition) => {
    set({
      hyperdrive: {
        phase: 'locking',
        targetNodeId: nodeId,
        targetPosition: nodePosition,
        startPosition: cameraPosition,  // FIXED: Store actual camera position
        progress: 0,
      },
      selectedNodeId: nodeId,
    });
  },

  advanceHyperdrive: (phase, progress = 0) => {
    set((state) => ({
      hyperdrive: { ...state.hyperdrive, phase, progress },
    }));
  },

  cancelHyperdrive: () => {
    set({
      hyperdrive: {
        phase: 'idle',
        targetNodeId: null,
        targetPosition: null,
        startPosition: null,
        progress: 0,
      },
    });
  },

  // HUD actions
  toggleHUD: () => set((state) => ({ hudVisible: !state.hudVisible })),
}));
