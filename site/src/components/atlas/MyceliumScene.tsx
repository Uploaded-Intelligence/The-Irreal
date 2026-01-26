import { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { FirstPersonRig } from './FirstPersonRig';
import { InputController } from './InputController';
import { VisitorTrail } from './VisitorTrail';
import { HyperdriveController } from './HyperdriveController';
import { NodeArtifact } from './NodeArtifact';
import { VeinFlow } from './VeinFlow';
import { VoidMatrixParticles } from './VoidMatrixParticles';
import { LureBeam } from './LureBeam';
import { AtlasHUD } from './hud/AtlasHUD';
import { useAtlasStore } from '../../stores/atlasStore';
import { computeBiomeLayout } from '../../lib/atlas/biomeLayout';

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

  // Compute deterministic biome layout on mount
  useEffect(() => {
    if (graphData.nodes.length > 0) {
      const positioned = computeBiomeLayout(graphData.nodes);
      setGraph(positioned, graphData.edges);
    }
  }, [graphData, setGraph]);

  return (
    <div style={{ position: 'fixed', inset: 0, cursor: 'crosshair' }}>
      <Canvas camera={{ position: [0, 5, 20], fov: 70 }}>
        {/* Navigation System */}
        <FirstPersonRig />
        <HyperdriveController />
        <VisitorTrail />

        {/* Environment */}
        <VoidMatrixParticles count={64} />
        <LureBeam />
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#6bc5ff" />

        {/* Nodes */}
        {nodes.map((node) => (
          <NodeArtifact
            key={node.id}
            nodeId={node.id}
            title={node.title}
            summary={node.summary}
            position={[node.x, node.y, node.z]}
            biome={node.biome}
          />
        ))}

        {/* Connections */}
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

      {/* Input handling outside canvas */}
      <InputController />

      {/* HUD Overlay */}
      <AtlasHUD />

      {/* Instructions overlay - minimal, HUD has the details now */}
      <div style={{
        position: 'fixed',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(0,0,0,0.6)',
        color: '#88ddff',
        padding: '8px 16px',
        borderRadius: 8,
        fontFamily: 'monospace',
        fontSize: 11,
        textAlign: 'center',
        pointerEvents: 'none',
        backdropFilter: 'blur(8px)',
        opacity: 0.7,
      }}>
        Click to look | WASD move | Shift boost | H toggle HUD
      </div>
    </div>
  );
}
