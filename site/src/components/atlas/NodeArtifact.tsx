import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAtlasStore } from '../../stores/atlasStore';

interface NodeArtifactProps {
  nodeId: string;
  position: [number, number, number];
  biome: string;
}

const BIOME_COLORS: Record<string, string> = {
  lore: '#7c6fe0',
  creation: '#e06f9d',
  reflection: '#6fe0c4',
  play: '#e0c46f',
  deep: '#4a6fe0',
  default: '#9d8fff',
};

export function NodeArtifact({ nodeId, position, biome }: NodeArtifactProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const setHoveredNode = useAtlasStore((s) => s.setHoveredNode);
  const selectNode = useAtlasStore((s) => s.selectNode);
  const setCameraTarget = useAtlasStore((s) => s.setCameraTarget);

  const color = BIOME_COLORS[biome] || BIOME_COLORS.default;

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    // Gentle rotation
    meshRef.current.rotation.y += delta * 0.3;
    // Scale on hover
    const targetScale = hovered ? 1.3 : 1;
    meshRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.1
    );
  });

  const handlePointerEnter = () => {
    setHovered(true);
    setHoveredNode(nodeId);
    setCameraTarget(position);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerLeave = () => {
    setHovered(false);
    setHoveredNode(null);
    document.body.style.cursor = 'default';
  };

  const handleClick = () => {
    selectNode(nodeId);
    // Navigate to world page
    window.location.href = `/world/${nodeId}`;
  };

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
    >
      <icosahedronGeometry args={[0.8, 1]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={hovered ? 0.5 : 0.2}
        roughness={0.3}
        metalness={0.7}
      />
    </mesh>
  );
}
