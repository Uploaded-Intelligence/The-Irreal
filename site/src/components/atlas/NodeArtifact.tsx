import { useRef, useState, useMemo } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import * as THREE from 'three';
import { useAtlasStore } from '../../stores/atlasStore';
import { MToonNodeMaterial } from './shaders/MToonNode';

// Register the material so R3F knows about <mToonNodeMaterial>
extend({ MToonNodeMaterial });

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
  const materialRef = useRef<any>(null); // Ref to the shader material
  const [hovered, setHovered] = useState(false);
  const setHoveredNode = useAtlasStore((s) => s.setHoveredNode);
  const selectNode = useAtlasStore((s) => s.selectNode);
  const setCameraTarget = useAtlasStore((s) => s.setCameraTarget);

  const color = useMemo(() => new THREE.Color(BIOME_COLORS[biome] || BIOME_COLORS.default), [biome]);
  const rimColor = useMemo(() => new THREE.Color('#ffffff'), []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    // Gentle rotation
    meshRef.current.rotation.y += delta * 0.3;
    
    // Scale on hover
    const targetScale = hovered ? 1.3 : 1;
    meshRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.1
    );

    // Update Shader Time
    if (materialRef.current) {
      materialRef.current.time = state.clock.elapsedTime;
      // Pulse rim power based on hover
      const targetRim = hovered ? 3.0 : 2.0;
      materialRef.current.rimPower = THREE.MathUtils.lerp(
        materialRef.current.rimPower,
        targetRim,
        0.1
      );
    }
  });

  const handlePointerEnter = () => {
    setHovered(true);
    setHoveredNode(nodeId, position);
    setCameraTarget(position);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerLeave = () => {
    setHovered(false);
    setHoveredNode(null, null);
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
      {/* @ts-ignore - Custom shader material extended in R3F */}
      <mToonNodeMaterial
        ref={materialRef}
        color={color}
        rimColor={rimColor}
        rimPower={2.0}
        transparent
      />
    </mesh>
  );
}
