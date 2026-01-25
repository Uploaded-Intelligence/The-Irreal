// Organic Portal Fragment Shader
// Credits: Hybrid of swirling noise patterns + fresnel glow

uniform float time;
uniform vec3 colorStart;
uniform vec3 colorEnd;
uniform float hover;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

// Simplex 2D noise
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vec2 uv = vUv * 2.0 - 1.0; // Centered UV -1 to 1
  float dist = length(uv);
  float angle = atan(uv.y, uv.x);

  // Swirling distortion
  float swirl = snoise(vec2(dist * 3.0 - time * 0.5, angle * 2.0));
  
  // Organic radius variation (breathing/undulating)
  float radiusNoise = snoise(vec2(angle * 4.0, time * 0.2));
  float baseRadius = 0.7 + hover * 0.1; // Expand on hover
  float organicRadius = baseRadius + radiusNoise * 0.05 + swirl * 0.02;

  // Soft edge glow (Fresnel-like falloff)
  float glow = smoothstep(organicRadius, organicRadius - 0.2, dist);
  float core = smoothstep(organicRadius - 0.3, organicRadius - 0.6, dist);
  
  // Cutout center (donut/portal shape)
  float innerHole = smoothstep(0.3 + hover * 0.05, 0.4, dist);
  float alpha = glow * innerHole;

  // Vortex interior detail
  float vortex = snoise(vec2(uv.x * 2.0 + time, uv.y * 2.0 - time));
  float vortexStr = smoothstep(0.0, 1.0, vortex) * 0.5;

  // Color blending
  vec3 finalColor = mix(colorStart, colorEnd, dist + vortexStr);
  
  // Intensity boost on hover
  float intensity = 1.5 + hover * 1.5;
  
  // Rim light effect
  float rim = 1.0 - smoothstep(organicRadius - 0.05, organicRadius, dist);
  finalColor += vec3(1.0) * rim * 2.0 * intensity;

  gl_FragColor = vec4(finalColor * intensity, alpha);
}
