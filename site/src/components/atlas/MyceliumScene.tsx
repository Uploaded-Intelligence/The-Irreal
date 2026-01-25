import { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { SporeRig } from './SporeRig';
import { NodeArtifact } from './NodeArtifact';
import { VeinFlow } from './VeinFlow';
import { VoidMatrixParticles } from './VoidMatrixParticles';
import { LureBeam } from './LureBeam';
import { useAtlasStore } from '../../stores/atlasStore';
import { computeLayout } from '../../lib/forceLayout3D';

interface GraphData {
  nodes: Array<{ id: string; title: string; summary?: string; biome: string; stage: string }>;
  edges: Array<{ source: string; target: string }>;
}

interface MyceliumSceneProps {
  graphData: GraphData;
}

export function MyceliumScene({ graphData }: MyceliumSceneProps) {
  const setGraph = useAtlasStore((s) => s.setGraph);
  const nodes = useAtlasStore((s) => s.nodes);
  const edges = useAtlasStore((s) => s.edges);
  const selectedNodeId = useAtlasStore((s) => s.selectedNodeId);
  const focusNextNode = useAtlasStore((s) => s.focusNextNode);
  const focusPrevNode = useAtlasStore((s) => s.focusPrevNode);
  const selectNode = useAtlasStore((s) => s.selectNode);

  // Compute layout on mount
  useEffect(() => {
    if (graphData.nodes.length > 0) {
      const positioned = computeLayout(graphData.nodes, graphData.edges);
      setGraph(positioned, graphData.edges);
    }
  }, [graphData, setGraph]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case 'j':
          e.preventDefault();
          focusNextNode();
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'k':
          e.preventDefault();
          focusPrevNode();
          break;
        case 'Enter':
          if (selectedNodeId) {
            window.location.href = `/world/${selectedNodeId}`;
          }
          break;
        case 'Escape':
          selectNode(null);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusNextNode, focusPrevNode, selectedNodeId, selectNode]);

  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <Canvas camera={{ position: [0, 0, 30], fov: 60 }}>
        <SporeRig />
        <VoidMatrixParticles count={64} />
        <LureBeam />
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#6bc5ff" />

        {/* Render nodes */}
        {nodes.map((node: any) => (
          <NodeArtifact
            key={node.id}
            nodeId={node.id}
            title={node.title}
            summary={node.summary}
            position={[node.x, node.y, node.z]}
            biome={node.biome}
          />
        ))}

        {/* Render veins */}
        {edges.map((edge: any) => {
          const source = nodes.find((n: any) => n.id === edge.source);
          const target = nodes.find((n: any) => n.id === edge.target);
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
