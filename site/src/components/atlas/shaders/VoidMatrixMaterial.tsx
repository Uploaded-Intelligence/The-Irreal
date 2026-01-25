import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Simulation Material - Updates positions
export const VoidSimMaterial = shaderMaterial(
  {
    uPositions: null,
    uTime: 0,
    uDelta: 0,
    uCameraPos: new THREE.Vector3(0, 0, 0),
    uCameraVel: new THREE.Vector3(0, 0, 0),
  },
  // Vertex
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment
  `
    uniform sampler2D uPositions;
    uniform float uTime;
    uniform float uDelta;
    uniform vec3 uCameraPos;
    uniform vec3 uCameraVel;
    varying vec2 vUv;

    // Simple curl-like noise or random drift for now
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    float snoise(vec3 v) {
      const vec2 C = vec2(1.0/6.0, 1.0/3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      i = mod289(i);
      vec4 p = permute(permute(permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0))
              + i.x + vec4(0.0, i1.x, i2.x, 1.0));
      float n_ = 0.142857142857;
      vec3 ns = n_ * D.wyz - x0.yzx;
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);
      vec4 x = x_ * ns.x + ns.y;
      vec4 y = y_ * ns.x + ns.y;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);
      vec4 s0 = floor(b0) * 2.0 + 1.0;
      vec4 s1 = floor(b1) * 2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
      p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
    }

    void main() {
      vec4 posData = texture2D(uPositions, vUv);
      vec3 pos = posData.xyz;
      
      // 1. Noise Drift
      float n = snoise(pos * 0.1 + uTime * 0.1);
      pos.x += n * 0.01;
      pos.y += snoise(pos * 0.1 + 100.0) * 0.01;
      pos.z += snoise(pos * 0.1 + 200.0) * 0.01;

      // 2. Camera Wake (Repulsor)
      vec3 dirToCam = pos - uCameraPos;
      float dist = length(dirToCam);
      if (dist < 10.0) {
        float force = (1.0 - dist / 10.0) * 0.2;
        pos += normalize(dirToCam) * force;
        // Also push by camera velocity
        pos += uCameraVel * force * 5.0;
      }

      // 3. Boundary check (keep them in a cloud)
      if (length(pos) > 100.0) {
        pos *= 0.95;
      }

      gl_FragColor = vec4(pos, 1.0);
    }
  `
);

// Rendering Material - Visualizes particles
export const VoidRenderMaterial = shaderMaterial(
  {
    uPositions: null,
    uTime: 0,
    uColor: new THREE.Color('#7c6fe0'),
  },
  // Vertex
  `
    uniform sampler2D uPositions;
    uniform float uTime;
    varying vec2 vUv;
    varying float vDistance;

    void main() {
      vUv = uv;
      vec4 posData = texture2D(uPositions, uv);
      vec3 pos = posData.xyz;
      
      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      vDistance = -mvPosition.z;
      
      gl_Position = projectionMatrix * mvPosition;
      
      // Size attenuation
      gl_PointSize = (20.0 / vDistance);
      // Breathing effect
      gl_PointSize *= (0.8 + 0.2 * sin(uTime * 2.0 + uv.x * 100.0));
    }
  `,
  // Fragment
  `
    uniform vec3 uColor;
    varying vec2 vUv;
    varying float vDistance;

    void main() {
      // Circular points
      float dist = length(gl_PointCoord - vec2(0.5));
      if (dist > 0.5) discard;
      
      // Glow falloff
      float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
      alpha *= (5.0 / vDistance); // Fade out at distance
      
      gl_FragColor = vec4(uColor, alpha * 0.6);
    }
  `
);
