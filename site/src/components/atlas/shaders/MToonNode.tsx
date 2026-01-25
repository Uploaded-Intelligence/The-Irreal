import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { extend } from '@react-three/fiber';

export const MToonNodeMaterial = shaderMaterial(
  {
    color: new THREE.Color('#7c6fe0'),
    rimColor: new THREE.Color('#ffffff'),
    rimPower: 2.0,
    time: 0,
  },
  // Vertex
  `
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  // Fragment
  `
    uniform vec3 color;
    uniform vec3 rimColor;
    uniform float rimPower;
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);
      
      // Rim light (Fresnel)
      float rim = 1.0 - dot(viewDir, normal);
      rim = pow(rim, rimPower);
      
      vec3 finalColor = color + rim * rimColor;
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
);

extend({ MToonNodeMaterial });
