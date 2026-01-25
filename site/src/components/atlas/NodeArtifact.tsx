import { useRef, useState, useMemo } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
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
  const materialRef = useRef<any>(null); 
  const [hovered, setHovered] = useState(false);
  const [bloom, setBloom] = useState(0);
  
  const setHoveredNode = useAtlasStore((s) => s.setHoveredNode);
  const selectNode = useAtlasStore((s) => s.selectNode);
  const setCameraTarget = useAtlasStore((s) => s.setCameraTarget);

  const color = useMemo(() => new THREE.Color(BIOME_COLORS[biome] || BIOME_COLORS.default), [biome]);
  const rimColor = useMemo(() => new THREE.Color('#ffffff'), []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    // 1. Rotation & Hover Scale
    meshRef.current.rotation.y += delta * 0.3;
    const targetScale = hovered ? 1.3 : 1;
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

    // 2. Distance Check (Bloom Detection)
    const worldPos = new THREE.Vector3(...position);
    const dist = state.camera.position.distanceTo(worldPos);
    const isArrived = dist < 8.0;
    const targetBloom = isArrived ? 1.0 : 0.0;

    // 3. Update Shader
    if (materialRef.current) {
      materialRef.current.time = state.clock.elapsedTime;
      
      // Interpolate Bloom progress
      materialRef.current.uBloom = THREE.MathUtils.lerp(materialRef.current.uBloom, targetBloom, 0.05);
      setBloom(materialRef.current.uBloom);

      const targetRim = hovered ? 3.0 : 2.0;
      materialRef.current.rimPower = THREE.MathUtils.lerp(materialRef.current.rimPower, targetRim, 0.1);
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
    // Deep jump if clicked
    // window.location.href = `/world/${nodeId}`;
  };

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onClick={handleClick}
      >
        <icosahedronGeometry args={[0.8, 1]} />
        {/* @ts-ignore */}
        <mToonNodeMaterial
          ref={materialRef}
          color={color}
          rimColor={rimColor}
          rimPower={2.0}
          transparent
        />
      </mesh>

      {/* Content Bloom Overlay */}
      {bloom > 0.5 && (
        <Html distanceFactor={10} position={[0, 1.2, 0]} transform>
          <div style={{
            opacity: (bloom - 0.5) * 2,
            background: 'rgba(10, 10, 15, 0.8)',
            backdropFilter: 'blur(10px)',
            padding: '1rem',
            borderRadius: '8px',
            border: `1px solid ${BIOME_COLORS[biome]}`,
            color: 'white',
            width: '200px',
            pointerEvents: 'none',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontFamily: 'EB Garamond' }}>{nodeId}</h3>
            <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>Click to enter this world</p>
          </div>
        </Html>
      )}
    </group>
  );
}
