import { Canvas } from '@react-three/fiber';
import { SporeRig } from './SporeRig';

export function MyceliumScene() {
  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        
        {/* The Player Controller */}
        <SporeRig />
        
        {/* Placeholder for content */}
        <gridHelper args={[50, 50, 0x444444, 0x222222]} />
      </Canvas>
    </div>
  );
}
