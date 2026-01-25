import { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { SporeRig } from './SporeRig';
import { NodeArtifact } from './NodeArtifact';
import { VeinFlow } from './VeinFlow';
import { useAtlasStore } from '../../stores/atlasStore';
import { computeLayout } from '../../lib/forceLayout3D';

interface GraphData {
  nodes: Array<{ id: string; title: string; biome: string; stage: string }>;
  edges: Array<{ source: string; target: string }>;
}

interface MyceliumSceneProps {
  graphData: GraphData;
}

export function MyceliumScene({ graphData }: MyceliumSceneProps) {
  const setGraph = useAtlasStore((s) => s.setGraph);
  const nodes = useAtlasStore((s) => s.nodes);
  const edges = useAtlasStore((s) => s.edges);

  // Compute layout on mount
  useEffect(() => {
    if (graphData.nodes.length > 0) {
      const positioned = computeLayout(graphData.nodes, graphData.edges);
      setGraph(positioned, graphData.edges);
    }
  }, [graphData, setGraph]);

  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <Canvas camera={{ position: [0, 0, 30], fov: 60 }}>
        <SporeRig />
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#6bc5ff" />

        {/* Render nodes */}
        {nodes.map((node) => (
          <NodeArtifact
            key={node.id}
            nodeId={node.id}
            position={[node.x, node.y, node.z]}
            biome={node.biome}
          />
        ))}

        {/* Render veins */}
        {edges.map((edge) => {
          const source = nodes.find((n) => n.id === edge.source);
          const target = nodes.find((n) => n.id === edge.target);
          if (!source || !target) return null;
          return (
            <VeinFlow
              key={`${edge.source}-${edge.target}`}
              start={[source.x, source.y, source.z]}
              end={[target.x, target.y, target.z]}
            />
          );
        })}
      </Canvas>
    </div>
  );
}
