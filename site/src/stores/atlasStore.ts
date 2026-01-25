import { create } from 'zustand';

export interface AtlasNode {
  id: string;
  title: string;
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

interface AtlasState {
  nodes: AtlasNode[];
  edges: AtlasEdge[];
  hoveredNodeId: string | null;
  selectedNodeId: string | null;
  cameraTarget: [number, number, number];

  setGraph: (nodes: AtlasNode[], edges: AtlasEdge[]) => void;
  setHoveredNode: (id: string | null) => void;
  selectNode: (id: string | null) => void;
  setCameraTarget: (target: [number, number, number]) => void;
}

export const useAtlasStore = create<AtlasState>((set) => ({
  nodes: [],
  edges: [],
  hoveredNodeId: null,
  selectedNodeId: null,
  cameraTarget: [0, 0, 0],

  setGraph: (nodes, edges) => set({ nodes, edges }),
  setHoveredNode: (id) => set({ hoveredNodeId: id }),
  selectNode: (id) => set({ selectedNodeId: id }),
  setCameraTarget: (target) => set({ cameraTarget: target }),
}));
