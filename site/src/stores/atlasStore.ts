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
  hoveredNodePos: [number, number, number] | null;
  selectedNodeId: string | null;
  cameraTarget: [number, number, number];
  focusedIndex: number;

  setGraph: (nodes: AtlasNode[], edges: AtlasEdge[]) => void;
  setHoveredNode: (id: string | null, pos?: [number, number, number] | null) => void;
  selectNode: (id: string | null) => void;
  setCameraTarget: (target: [number, number, number]) => void;
  focusNextNode: () => void;
  focusPrevNode: () => void;
}

export const useAtlasStore = create<AtlasState>((set, get) => ({
  nodes: [],
  edges: [],
  hoveredNodeId: null,
  hoveredNodePos: null,
  selectedNodeId: null,
  cameraTarget: [0, 0, 0],
  focusedIndex: -1,

  setGraph: (nodes, edges) => set({ nodes, edges }),
  setHoveredNode: (id, pos) => set({ hoveredNodeId: id, hoveredNodePos: pos || null }),
  selectNode: (id) => set({ selectedNodeId: id }),
  setCameraTarget: (target) => set({ cameraTarget: target }),
  focusNextNode: () => {
    const { nodes, focusedIndex } = get();
    if (nodes.length === 0) return;
    const nextIndex = (focusedIndex + 1) % nodes.length;
    const node = nodes[nextIndex];
    set({
      focusedIndex: nextIndex,
      selectedNodeId: node.id,
      cameraTarget: [node.x, node.y, node.z],
    });
  },
  focusPrevNode: () => {
    const { nodes, focusedIndex } = get();
    if (nodes.length === 0) return;
    const prevIndex = focusedIndex <= 0 ? nodes.length - 1 : focusedIndex - 1;
    const node = nodes[prevIndex];
    set({
      focusedIndex: prevIndex,
      selectedNodeId: node.id,
      cameraTarget: [node.x, node.y, node.z],
    });
  },
}));
