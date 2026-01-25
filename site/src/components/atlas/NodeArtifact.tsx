import { MToonNodeMaterial } from './shaders/MToonNode';

export function NodeArtifact({ position, type }: { position: [number, number, number], type: string }) {
  return (
    <mesh position={position}>
      {/* Artifact Geometry - e.g. Icosahedron for Lore */}
      <icosahedronGeometry args={[1, 0]} />
      {/* @ts-ignore */}
      <mToonNodeMaterial color={type === 'lore' ? '#7c6fe0' : '#4a9d6a'} />
    </mesh>
  );
}
