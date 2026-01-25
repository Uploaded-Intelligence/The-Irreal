import { useRef, useMemo } from 'react';
import { useFrame, useThree, extend } from '@react-three/fiber';
import * as THREE from 'three';
import { VoidSimMaterial, VoidRenderMaterial } from './shaders/VoidMatrixMaterial';

extend({ VoidSimMaterial, VoidRenderMaterial });

interface VoidMatrixParticlesProps {
  count?: number;
}

export function VoidMatrixParticles({ count = 128 }: VoidMatrixParticlesProps) {
  const { gl } = useThree();
  const size = count; // Texture size (size * size particles)
  
  // 1. Initialize Random Positions Texture
  const positions = useMemo(() => {
    const data = new Float32Array(size * size * 4);
    for (let i = 0; i < size * size; i++) {
      data[i * 4 + 0] = (Math.random() - 0.5) * 100;
      data[i * 4 + 1] = (Math.random() - 0.5) * 100;
      data[i * 4 + 2] = (Math.random() - 0.5) * 100;
      data[i * 4 + 3] = 1.0;
    }
    const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat, THREE.FloatType);
    tex.needsUpdate = true;
    return tex;
  }, [size]);

  // 2. Setup FBOs for Ping-Ponging
  const fboA = useMemo(() => new THREE.WebGLRenderTarget(size, size, {
    type: THREE.FloatType,
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
  }), [size]);
  
  const fboB = fboA.clone();
  const renderTargets = useRef({ primary: fboA, secondary: fboB });

  // 3. Material Refs
  const simMatRef = useRef<any>(null);
  const renderMatRef = useRef<any>(null);
  
  // Create a full-screen quad for simulation
  const mesh = useMemo(() => new THREE.Mesh(new THREE.PlaneGeometry(2, 2)), []);
  const simCamera = useMemo(() => new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), []);

  const prevCameraPos = useRef(new THREE.Vector3());
  const cameraVel = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    const { primary, secondary } = renderTargets.current;

    // A. Update Camera Velocity
    cameraVel.current.subVectors(state.camera.position, prevCameraPos.current).divideScalar(delta || 1);
    prevCameraPos.current.copy(state.camera.position);

    // B. Run Simulation
    if (simMatRef.current) {
      // Input is the previous frame's result (secondary)
      simMatRef.current.uPositions = secondary.texture;
      simMatRef.current.uTime = state.clock.elapsedTime;
      simMatRef.current.uDelta = delta;
      simMatRef.current.uCameraPos.copy(state.camera.position);
      simMatRef.current.uCameraVel.copy(cameraVel.current);
      
      gl.setRenderTarget(primary);
      gl.render(mesh, simCamera);
      gl.setRenderTarget(null);
    }

    // C. Swap FBOs (Ping-Pong)
    renderTargets.current = { primary: secondary, secondary: primary };

    // D. Update Render Material
    if (renderMatRef.current) {
      renderMatRef.current.uPositions = primary.texture;
      renderMatRef.current.uTime = state.clock.elapsedTime;
    }
  });

  // Reference for UVs used to sample the texture
  const particlesUv = useMemo(() => {
    const uv = new Float32Array(size * size * 2);
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const idx = (i * size + j) * 2;
        uv[idx] = i / (size - 1);
        uv[idx + 1] = j / (size - 1);
      }
    }
    return uv;
  }, [size]);

  return (
    <>
      {/* Simulation Scene (Hidden) */}
      <primitive object={mesh} visible={false}>
        {/* @ts-ignore */}
        <voidSimMaterial ref={simMatRef} uPositions={positions} />
      </primitive>

      {/* Visible Particles */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array(size * size * 3), 3]}
          />
          <bufferAttribute
            attach="attributes-uv"
            args={[particlesUv, 2]}
          />
        </bufferGeometry>
        {/* @ts-ignore */}
        <voidRenderMaterial ref={renderMatRef} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
    </>
  );
}
