/**
 * Atlas Component
 * A minimal force-directed graph visualization.
 * Uses simple physics simulation - no D3 dependency initially.
 */
import { useState, useEffect, useRef, useCallback } from 'react';

interface Node {
  id: string;
  title: string;
  biome: string;
  stage: string;
  summary?: string;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

interface Edge {
  source: string;
  target: string;
}

interface GraphData {
  nodes: Node[];
  edges: Edge[];
}

interface Props {
  graphData: GraphData;
}

const BIOME_COLORS: Record<string, string> = {
  threshold: '#9d8fff',
  lore: '#8888a0',
  creation: '#ff8f6b',
  reflection: '#6bc5ff',
  play: '#ffcc4d',
  deep: '#4a8d9d',
};

const STAGE_SIZES: Record<string, number> = {
  seedling: 8,
  growing: 12,
  evergreen: 16,
};

export default function Atlas({ graphData }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [nodes, setNodes] = useState<Node[]>([]);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const animationRef = useRef<number>();

  // Initialize nodes with random positions
  useEffect(() => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    setDimensions({ width: rect.width, height: rect.height });

    const initialNodes = graphData.nodes.map(node => ({
      ...node,
      x: Math.random() * rect.width,
      y: Math.random() * rect.height,
      vx: 0,
      vy: 0,
    }));
    setNodes(initialNodes);
  }, [graphData]);

  // Simple force simulation
  useEffect(() => {
    if (nodes.length === 0) return;

    const simulate = () => {
      setNodes(prevNodes => {
        const newNodes = prevNodes.map(node => ({ ...node }));
        const centerX = dimensions.width / 2;
        const centerY = dimensions.height / 2;

        // Apply forces
        newNodes.forEach((node, i) => {
          // Center gravity
          node.vx! += (centerX - node.x!) * 0.001;
          node.vy! += (centerY - node.y!) * 0.001;

          // Repulsion between nodes
          newNodes.forEach((other, j) => {
            if (i === j) return;
            const dx = node.x! - other.x!;
            const dy = node.y! - other.y!;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const force = 500 / (dist * dist);
            node.vx! += (dx / dist) * force;
            node.vy! += (dy / dist) * force;
          });
        });

        // Apply edge forces (attraction)
        graphData.edges.forEach(edge => {
          const source = newNodes.find(n => n.id === edge.source);
          const target = newNodes.find(n => n.id === edge.target);
          if (!source || !target) return;

          const dx = target.x! - source.x!;
          const dy = target.y! - source.y!;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = (dist - 100) * 0.01;

          source.vx! += (dx / dist) * force;
          source.vy! += (dy / dist) * force;
          target.vx! -= (dx / dist) * force;
          target.vy! -= (dy / dist) * force;
        });

        // Apply velocity and damping
        newNodes.forEach(node => {
          node.vx! *= 0.9;
          node.vy! *= 0.9;
          node.x! += node.vx!;
          node.y! += node.vy!;

          // Bounds
          node.x = Math.max(20, Math.min(dimensions.width - 20, node.x!));
          node.y = Math.max(20, Math.min(dimensions.height - 20, node.y!));
        });

        return newNodes;
      });

      animationRef.current = requestAnimationFrame(simulate);
    };

    animationRef.current = requestAnimationFrame(simulate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions, graphData.edges, nodes.length]);

  const handleNodeClick = useCallback((nodeId: string) => {
    window.location.href = `/world/${nodeId}`;
  }, []);

  if (nodes.length === 0) {
    return (
      <div ref={containerRef} style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#8888a0' }}>No worlds yet. Plant the first seed.</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
      <svg width={dimensions.width} height={dimensions.height}>
        {/* Edges */}
        {graphData.edges.map((edge, i) => {
          const source = nodes.find(n => n.id === edge.source);
          const target = nodes.find(n => n.id === edge.target);
          if (!source || !target) return null;
          return (
            <line
              key={i}
              x1={source.x}
              y1={source.y}
              x2={target.x}
              y2={target.y}
              stroke="#2a2a36"
              strokeWidth={1}
              opacity={0.5}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map(node => (
          <g key={node.id}>
            <circle
              cx={node.x}
              cy={node.y}
              r={STAGE_SIZES[node.stage] || 10}
              fill={BIOME_COLORS[node.biome] || '#8888a0'}
              stroke={hoveredNode === node.id ? '#fff' : 'none'}
              strokeWidth={2}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              onClick={() => handleNodeClick(node.id)}
            />
            {hoveredNode === node.id && (
              <text
                x={node.x}
                y={node.y! - (STAGE_SIZES[node.stage] || 10) - 8}
                textAnchor="middle"
                fill="#e0e0e8"
                fontSize={12}
              >
                {node.title}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}
