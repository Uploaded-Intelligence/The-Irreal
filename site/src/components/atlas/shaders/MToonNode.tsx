import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { extend } from '@react-three/fiber';

export const MToonNodeMaterial = shaderMaterial(
  {
    color: new THREE.Color('#7c6fe0'),
    rimColor: new THREE.Color('#ffffff'),
    rimPower: 2.0,
    time: 0,
    uBloom: 0, // 0 to 1
  },
  // Vertex
  `
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    uniform float uBloom;
    uniform float time;

    void main() {
      vNormal = normalize(normalMatrix * normal);
      
      // Vertex Displacement (Bloom)
      vec3 pos = position;
      if (uBloom > 0.01) {
        // Explode outward based on normal
        pos += normal * uBloom * 0.5;
        // Add some jitter/noise
        pos.x += sin(time * 5.0 + position.y * 10.0) * uBloom * 0.1;
      }

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  // Fragment
  `
    uniform vec3 color;
    uniform vec3 rimColor;
    uniform float rimPower;
    uniform float uBloom;
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);
      
      // Rim light (Fresnel)
      float rim = 1.0 - dot(viewDir, normal);
      rim = pow(rim, rimPower);
      
      vec3 finalColor = color + rim * rimColor;
      
      // Increase brightness during bloom
      finalColor += uBloom * rimColor * 0.5;

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
);

extend({ MToonNodeMaterial });
