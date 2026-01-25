import {
  forceSimulation,
  forceManyBody,
  forceLink,
  forceCenter,
} from 'd3-force-3d';
import type { AtlasNode, AtlasEdge } from '../stores/atlasStore';

interface RawNode {
  id: string;
  title: string;
  biome: string;
  stage: string;
}

interface SimNode extends RawNode {
  x: number;
  y: number;
  z: number;
  vx?: number;
  vy?: number;
  vz?: number;
}

export function computeLayout(
  rawNodes: RawNode[],
  edges: AtlasEdge[],
  iterations = 100
): AtlasNode[] {
  // Initialize with random positions
  const nodes: SimNode[] = rawNodes.map((n) => ({
    ...n,
    x: (Math.random() - 0.5) * 20,
    y: (Math.random() - 0.5) * 20,
    z: (Math.random() - 0.5) * 20,
  }));

  // Create simulation with 3 dimensions
  const simulation = forceSimulation(nodes, 3)
    .force('charge', forceManyBody().strength(-80))
    .force(
      'link',
      forceLink(edges)
        .id((d: unknown) => (d as SimNode).id)
        .distance(8)
    )
    .force('center', forceCenter(0, 0, 0))
    .stop();

  // Run simulation synchronously
  for (let i = 0; i < iterations; i++) {
    simulation.tick();
  }

  // Return positioned nodes (strip velocity fields)
  return nodes.map((n) => ({
    id: n.id,
    title: n.title,
    biome: n.biome,
    stage: n.stage,
    x: n.x,
    y: n.y,
    z: n.z,
  }));
}
