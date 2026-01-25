import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import * as Tone from 'tone';
import { useAtlasStore } from '../../stores/atlasStore';

export function LureBeam() {
  const { camera } = useThree();
  const hoveredNodeId = useAtlasStore((s) => s.hoveredNodeId);
  const hoveredNodePos = useAtlasStore((s) => s.hoveredNodePos);
  const nodes = useAtlasStore((s) => s.nodes);
  
  const lineRef = useRef<THREE.Line>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const synthRef = useRef<Tone.PolySynth | null>(null);

  // 1. Setup Audio
  useEffect(() => {
    synthRef.current = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'sine' },
      envelope: { attack: 0.1, decay: 0.2, sustain: 0.1, release: 0.8 }
    }).toDestination();
    synthRef.current.volume.value = -20;

    return () => {
      synthRef.current?.dispose();
    };
  }, []);

  // 2. Play Audio on Hover
  useEffect(() => {
    if (hoveredNodeId && synthRef.current) {
      const node = nodes.find((n: any) => n.id === hoveredNodeId);
      if (node) {
        // Map biome to pitch
        const pitches: Record<string, string> = {
          lore: 'C3',
          creation: 'E3',
          reflection: 'G3',
          play: 'B3',
          deep: 'A2',
          default: 'D3'
        };
        const pitch = pitches[node.biome] || pitches.default;
        synthRef.current.triggerAttackRelease(pitch, '8n');
      }
    }
  }, [hoveredNodeId, nodes]);

  // 3. Update Beam Geometry
  useFrame((state) => {
    if (!lineRef.current || !materialRef.current) return;

    if (hoveredNodePos) {
      // Line follows camera and target
      const start = camera.position.clone();
      // Offset start to come from "chest"
      start.y -= 0.5;
      
      const end = new THREE.Vector3(...hoveredNodePos);
      
      const positions = new Float32Array([
        start.x, start.y, start.z,
        end.x, end.y, end.z
      ]);
      
      lineRef.current.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      lineRef.current.geometry.attributes.position.needsUpdate = true;
      
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      materialRef.current.uniforms.uOpacity.value = THREE.MathUtils.lerp(materialRef.current.uniforms.uOpacity.value, 1.0, 0.1);
    } else {
      materialRef.current.uniforms.uOpacity.value = THREE.MathUtils.lerp(materialRef.current.uniforms.uOpacity.value, 0.0, 0.2);
    }
  });

  const shader = useMemo(() => ({
    uniforms: {
      uTime: { value: 0 },
      uOpacity: { value: 0 },
      uColor: { value: new THREE.Color('#9d8fff') }
    },
    vertexShader: `
      varying float vDist;
      void main() {
        vDist = position.y; 
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform float uOpacity;
      uniform vec3 uColor;
      void main() {
        // Pulsing dash effect
        float pulse = sin(uTime * 10.0) * 0.5 + 0.5;
        gl_FragColor = vec4(uColor, uOpacity * (0.3 + 0.7 * pulse));
      }
    `
  }), []);

  return (
    // @ts-ignore
    <line ref={lineRef}>
      <bufferGeometry />
      <shaderMaterial 
        ref={materialRef} 
        args={[shader]} 
        transparent 
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </line>
  );
}
