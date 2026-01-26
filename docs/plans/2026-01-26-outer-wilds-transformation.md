# Mycelium Atlas: Outer Wilds Transformation

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the Mycelium Atlas from a tech demo into an Outer Wilds-inspired experience where nodes feel like destinations, the cosmos breathes with bioluminescent life, and navigation is a cosmic journey of wonder.

**Architecture:** Living cosmos (layered nebulae + twinkling particles), true 3D spatial distribution (spherical biomes), logarithmic node scaling (destinations not markers), deliberate cosmic movement, diegetic HUD (contextual beacons + peripheral glow), musical signatures per biome/node.

**Tech Stack:** R3F 9.5 | drei 10.7 | Three.js r182 | Zustand 5.0 | Tone.js 15.1 | @react-three/postprocessing | CSS Custom Properties

**Design DNA (from Outer Wilds):**
- Diegetic UI — information exists in-universe (helmet, instruments), not overlaid
- Curiosity as sole motivation — wonder IS the reward
- Feeling small — tiny player in vast (but navigable) cosmos
- Systemic consistency — physics/audio rules apply universally
- Earned discovery — information reveals through approach, not UI

**Source References:**
- [Outer Wilds UX as Human Experience](https://medium.com/@claudmohe/how-outer-wilds-transcends-ux-to-become-human-experience-3ff41def8f8c)
- [Mobius Digital UI Concepting](https://www.mobiusdigitalgames.com/news/concepting-ui)
- [drei Sparkles docs](https://drei.docs.pmnd.rs/staging/sparkles)
- [react-postprocessing Bloom](https://react-postprocessing.docs.pmnd.rs/effects/bloom)
- [Codrops GPGPU Particles](https://tympanus.net/codrops/2024/12/19/crafting-a-dreamy-particle-effect-with-three-js-and-gpgpu/)
- [TSL Field Guide](https://blog.maximeheckel.com/posts/field-guide-to-tsl-and-webgpu/)

---

## Existing Project Artifacts (REUSE, don't reinvent)

**Critical:** These artifacts contain battle-tested patterns we should leverage.

### Teleodynamic Signature v8 (`artifacts/teleodynamic-signature-v8.jsx`)

**What it is:** 1330-line Canvas2D particle system visualizing psychophysiological states

**Patterns to extract:**

| Pattern | Description | Use In Atlas |
|---------|-------------|--------------|
| **Invisible attractors** | Forces create flow patterns without being drawn | Biome centers as invisible gravitational wells |
| **Energy field grid** | Tracks where energy accumulates vs circulates | Heat map for node activity/visits |
| **Mode-differentiated dynamics** | Different systems (not parameter tweaks) per mode | Biome-specific particle behaviors |
| **Breathing mechanism** | Global coherent rhythm vs local conflicting rhythms | Cosmos breathing (Task 1.5, Task 7.2) |
| **Color = State encoding** | arousal→hue, coherence→saturation, energy→brightness | Node glow encoding engagement metrics |
| **Recovery vs amplification** | Feedback types: negative (dampen), positive (amplify) | Click perturbation ripples |
| **Chaos/freedom parameter** | 0 = stable spirals, 1 = free flowing | Boost/hyperdrive state transitions |

**Key code patterns:**
```javascript
// Breathing calculation from Teleodynamic
const calculateBreath = (particle, mode, time) => {
  const t = time * mode.breathFrequency;
  switch (mode.breathCoherence) {
    case 'global': return Math.sin(t) * mode.breathAmplitude;
    case 'local': // Conflicting local rhythms
      const localPhase = noise(particle.x * 0.008, particle.y * 0.008) * Math.PI * 2;
      return Math.sin(t + localPhase) * mode.breathAmplitude;
    case 'multi': // Golden ratio interference
      return (Math.sin(t) * 0.4 + Math.sin(t * 1.618) * 0.35) * mode.breathAmplitude;
  }
};

// Flow field with attractor influence
const calculateFlowField = (x, y, time, attractors) => {
  let angle = noise(x * 0.005, y * 0.005, time * 0.0001) * Math.PI * 4;
  attractors.forEach(att => {
    const dist = Math.sqrt((att.x - x) ** 2 + (att.y - y) ** 2);
    if (dist < att.radius * 2.5) {
      const influence = Math.pow(1 - dist / (att.radius * 2.5), 1.5) * att.strength;
      // Spiral, well, pulse, vortex, bloom types...
    }
  });
  return { angle, magnitude };
};
```

### Sympoietic Signature v3 (`artifacts/sympoietic-signature-v3.jsx`)

**What it is:** 1057-line process-oriented system with mycelium growth and self-reference

**Patterns to extract:**

| Pattern | Description | Use In Atlas |
|---------|-------------|--------------|
| **Multi-scale particles** | Fast (ephemeral), slow (structural), bridge (weavers) | Node artifacts at different activity levels |
| **Mycelium network growth** | Organic branching influenced by field | Connection trails between visited nodes |
| **Emergent forms** | Clusters detected, glow created, fade naturally | Constellation highlights when nodes cluster |
| **Field memory** | Interactions leave lasting traces | Visitor trail persistence |
| **Self-reference metrics** | Coherence, entropy, emergenceLevel computed | System health indicators |
| **Phase detection** | sensing → building → crystallizing → dissolving → transcending | Journey phase awareness |

**Key code patterns:**
```javascript
// Mycelium growth influenced by flow field
const updateMycelium = (network, field, time) => {
  if (Math.random() < 0.03 * network.activity) {
    const growableNodes = network.nodes.filter(n => n.alive && n.children.length < 3);
    const parent = growableNodes[Math.floor(Math.random() * growableNodes.length)];
    const fieldHere = getFieldInfluence(parent.x, parent.y, time);
    const growAngle = fieldHere.angle + (Math.random() - 0.5) * Math.PI * 0.5;
    // Create child node in field-influenced direction...
  }
};

// Self-reference: system observes itself
const updateSelfReference = (particles, forms) => {
  // Coherence from clustering
  let clusterScore = particles.filter(p => p.memory > 0.5).length;
  coherence = coherence * 0.95 + (clusterScore / particles.length) * 0.05;

  // Phase detection from metrics
  if (emergence > 0.4) phase = 'transcending';
  else if (coherence > 0.55) phase = 'crystallizing';
  // ...
};
```

### Labyrinth Genesis (`artifacts/Labyrinth_particle-pov.html`, `labyrinth-genesis-coupled.html`)

**What it is:** Three.js Thomas/Lorenz/Rössler attractor visualizations

**Patterns to extract:**

| Pattern | Description | Use In Atlas |
|---------|-------------|--------------|
| **RK4 integration** | Robust numerical integration for chaotic systems | Smooth hyperdrive trajectories |
| **POV mode vignette** | Radial gradient darkening at edges | First-person immersion |
| **Bifurcation exploration** | Parameter controls reveal regime changes | Node stage transitions |
| **Mean-field coupling** | Different systems influence each other through centroids | Cross-biome harmony |
| **Sync metrics** | Distance between centroids measures coherence | Biome proximity indicators |
| **Professional sidebar UI** | Compact sliders, toggles, equations display | Settings panel inspiration |

**Key code patterns:**
```javascript
// Mean-field diffusive coupling (Boccaletti)
function computeCouplingTerm(particleState, particleType, centroids) {
  const ε = couplingStrength;
  let coupling = [0, 0, 0];
  for (const otherType of attractorTypes) {
    if (otherType === particleType) continue;
    // Diffusive coupling to other population's centroid
    coupling[0] += ε * (centroids[otherType][0] - particleState[0]);
    // ...
  }
  return coupling;
}

// RK4 with coupling
function rk4Step(state, derivFn, params, dt, coupling) {
  const k1 = derivFn(state, params);
  const s2 = state.map((v, i) => v + (k1[i] + coupling[i]) * dt * 0.5);
  const k2 = derivFn(s2, params);
  // ... classic RK4 with coupling term added
}
```

### Pattern Synthesis for Mycelium Atlas

**Phase 1 (Living Cosmos):**
- Use Teleodynamic's breathing mechanism for nebula pulsing
- Apply flow field math for Sparkles particle drift

**Phase 3 (Scale & Perspective):**
- Adapt energy field concept for node proximity glow intensity
- Use attractor strength for logarithmic scaling

**Phase 4 (Movement):**
- Apply RK4 patterns for smooth hyperdrive trajectories
- Use chaos parameter for boost state transitions

**Phase 6 (Audio):**
- Apply coupling concept: nodes influence each other's audio
- Use coherence metrics for harmonic layering

**Phase 7 (Polish):**
- Use self-reference pattern: cosmos responds to player behavior
- Apply phase detection for journey awareness

---

## Library Arsenal (LEVERAGE, don't rebuild)

### Visual Libraries

| Need | Library | Why | Docs |
|------|---------|-----|------|
| **Starfield** | `<Stars>` from drei | 5000 twinkling stars, shader-based | [drei Stars](https://drei.docs.pmnd.rs/staging/sparkles) |
| **Floating particles** | `<Sparkles>` from drei | Glowing particles, biome-tinted | [drei Sparkles](https://drei.docs.pmnd.rs/staging/sparkles) |
| **Post-processing** | `@react-three/postprocessing` | Unified Bloom + Vignette + DOF | [react-postprocessing](https://docs.pmnd.rs/react-postprocessing) |
| **God rays** | `<GodRays>` from postprocessing | Light beams from biome centers | [GodRays docs](https://react-postprocessing.docs.pmnd.rs/effects/god-rays) |
| **Sky/Atmosphere** | `<Sky>` from drei | Dynamic atmospheric colors | [drei Environment](https://drei.docs.pmnd.rs/staging/environment) |
| **Environment** | `<Environment preset="night">` | HDRI lighting (or custom) | [drei Environment](https://drei.docs.pmnd.rs/staging/environment) |

### Audio Libraries

| Need | Library | Why | Docs |
|------|---------|-----|------|
| **Spatial audio** | `<PositionalAudio>` from drei | 3D positioned sounds that fade with distance | [drei PositionalAudio](https://drei.docs.pmnd.rs/abstractions/positional-audio) |
| **Synthesis** | Tone.js (existing) | Drones, pads, procedural melodies | [Tone.js](https://tonejs.github.io/) |
| **Drone synth pattern** | "Call to the Void" architecture | 4-oscillator drone, PWM, -64dB to 0dB | [GitHub](https://github.com/devin-hart/Call-to-the-Void) |
| **Generative music** | generative.fm patterns | Procedural ambient composition | [generative.fm](https://generative.fm/) |

### Audio Assets (FREE, CC-Licensed)

| Source | Content | License | URL |
|--------|---------|---------|-----|
| **Scott Buckley** | Ambient, cosmic horror, space | CC | [scottbuckley.com.au](https://www.scottbuckley.com.au/library/genre/ambient/) |
| **Free Music Archive** | Ambient genre catalog | Various CC | [freemusicarchive.org](https://freemusicarchive.org/genre/Ambient/) |
| **OpenGameArt** | Space music, CC0 loops | CC0 | [opengameart.org](https://opengameart.org/content/audiomusicspace) |
| **Looperman** | Space ambient loops, drone samples | Royalty-free | [looperman.com](https://www.looperman.com/loops/tags/free-space-ambient-loops-samples-sounds-wavs-download) |
| **Ambient-Mixer** | Sci-fi atmospheres | CC Sampling+ | [ambient-mixer.com](https://www.ambient-mixer.com/) |
| **LonePeakMusic** | 3hr free ambient pack | Free for games | [itch.io](https://lonepeakmusic.itch.io/free-ambient-music) |
| **Mixkit** | 44 ambient tracks | Mixkit License | [mixkit.co](https://mixkit.co/free-stock-music/ambient/) |

### Outer Wilds Audio Design Reference

From composer [Andrew Prahlow's interviews](https://filmmusiccentral.com/2020/03/26/an-interview-with-andrew-prahlow-composer-of-outer-wilds/):

> "The Travelers and their instruments... they're all playing the same song together like parts of a band."
> "Music can bring people together no matter the distance."
> "When there's constant looping music, it becomes wallpaper. I crafted the music to follow the player's sense of exploration."

**Key patterns to emulate:**
- Each "Traveler" (biome/node) has a UNIQUE INSTRUMENT
- Same underlying melody, different timbres
- Music REVEALS with exploration, not constant loop
- Folk instruments for warmth (banjo, strings)
- Ambient synths for alien/mysterious areas
- Audio gets LOUDER as you approach (positional)

**DO NOT rebuild:**
- ❌ Custom starfield shader → use `<Stars>` instead
- ❌ Custom particle system → use `<Sparkles>` instead
- ❌ Manual bloom → use `<EffectComposer>` + `<Bloom>`
- ❌ Custom positional audio → use `<PositionalAudio>` from drei
- ❌ Create original music → use CC-licensed ambient tracks + Tone.js layering

---

## Pre-Planning Validation

✅ **Dependencies verified (in use):**
- React Three Fiber, drei, Three.js — core rendering
- Zustand — state management (tuples only, no Vector3)
- Tone.js — already used for hyperdrive audio
- @react-three/postprocessing — add to package.json

⚠️ **To install:**
```bash
npm install @react-three/postprocessing postprocessing
```

⚠️ **Medium-risk (validate during implementation):**
- Particle count with Sparkles (test 2000+ particles)
- Multiple postprocessing effects (monitor FPS)

---

## Phase 1: Living Cosmos Background

**Objective:** Transform static void into breathing, layered bioluminescent cosmos
**Verification:** Stars twinkle, particles float, bloom creates glow, 60fps maintained

**LEVERAGE:** Use `<Stars>`, `<Sparkles>`, `<EffectComposer>` from drei/postprocessing instead of building custom.

### Task 1.1: Install postprocessing

**Files:**
- Modify: `site/package.json`

```bash
cd site && npm install @react-three/postprocessing postprocessing
```

---

### Task 1.2: Add drei Stars Component

**Files:**
- Modify: `site/src/components/atlas/MyceliumScene.tsx`

**Implementation:**
```typescript
import { Stars } from '@react-three/drei';

// In scene:
<Stars
  radius={500}           // Inner sphere radius
  depth={100}            // Depth of star field
  count={8000}           // Number of stars
  factor={6}             // Size factor
  saturation={0.1}       // Slight color variation
  fade                   // Faded edges
  speed={0.5}            // Twinkle speed
/>
```

**Why:** Built-in twinkling, shader-optimized, configurable. No custom shader needed.

---

### Task 1.3: Add Sparkles for Bioluminescent Spores

**Files:**
- Modify: `site/src/components/atlas/MyceliumScene.tsx`

**Implementation:**
```typescript
import { Sparkles } from '@react-three/drei';

// Near each biome center, add floating spores:
{BIOME_CENTERS.map((center, i) => (
  <Sparkles
    key={i}
    count={100}
    scale={[40, 40, 40]}
    position={center}
    size={2}
    speed={0.3}
    opacity={0.4}
    color={BIOME_COLORS[i]}
  />
))}
```

**Why:** Drei handles the particle shader, we just configure per-biome.

---

### Task 1.4: Add EffectComposer with Bloom + Vignette

**Files:**
- Modify: `site/src/components/atlas/MyceliumScene.tsx`

**Implementation:**
```typescript
import { EffectComposer, Bloom, Vignette, DepthOfField } from '@react-three/postprocessing';

// After all scene content, before </Canvas>:
<EffectComposer>
  <Bloom
    luminanceThreshold={0.2}
    luminanceSmoothing={0.9}
    intensity={0.8}
    radius={0.8}
  />
  <Vignette
    eskil={false}
    offset={0.2}
    darkness={0.8}
  />
  <DepthOfField
    focusDistance={0}
    focalLength={0.05}
    bokehScale={3}
    height={480}
  />
</EffectComposer>
```

**Why:** Unified bloom makes nodes glow naturally. Vignette focuses attention. DOF adds depth.

---

### Task 1.5: Create Simple NebulaBackdrop (Single Layer)

**Files:**
- Create: `site/src/components/atlas/NebulaBackdrop.tsx`

**Concept:** Single large sphere with gradient shader (simplified from 3-layer).

```typescript
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';

// Simplified nebula: one sphere, noise-based color, breathing
const NebulaShaderMaterial = shaderMaterial(
  { uTime: 0 },
  // vertex
  `varying vec3 vPosition;
   void main() {
     vPosition = position;
     gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
   }`,
  // fragment - simplex noise for soft clouds
  `uniform float uTime;
   varying vec3 vPosition;

   // Insert simplex3D here

   void main() {
     float n = snoise(vPosition * 0.008 + uTime * 0.02);
     float breath = sin(uTime * 0.785) * 0.15 + 0.85;

     vec3 colorA = vec3(0.04, 0.02, 0.12); // deep purple
     vec3 colorB = vec3(0.02, 0.08, 0.15); // teal
     vec3 color = mix(colorA, colorB, n * 0.5 + 0.5);

     gl_FragColor = vec4(color * breath, 0.3);
   }`
);

export function NebulaBackdrop() {
  const ref = useRef<THREE.ShaderMaterial>(null);

  useFrame(({ clock }) => {
    if (ref.current) ref.current.uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    <mesh>
      <sphereGeometry args={[600, 32, 32]} />
      <nebulaShaderMaterial ref={ref} side={THREE.BackSide} transparent depthWrite={false} />
    </mesh>
  );
}
```

---

### Task 1.6: Add Dynamic Biome Lighting

**Files:**
- Modify: `site/src/components/atlas/MyceliumScene.tsx`

**Implementation:**
```typescript
// Create useBiomeLight hook:
function useBiomeLight(cameraPosition: [number, number, number]) {
  const [color, setColor] = useState('#1a1a2e');

  useEffect(() => {
    // Calculate weighted average of biome colors based on distance
    let totalWeight = 0;
    let r = 0, g = 0, b = 0;

    BIOMES.forEach(biome => {
      const dist = distance(cameraPosition, biome.center);
      const weight = 1 / (dist * dist + 1);
      totalWeight += weight;
      r += biome.color.r * weight;
      g += biome.color.g * weight;
      b += biome.color.b * weight;
    });

    setColor(`rgb(${r/totalWeight*255}, ${g/totalWeight*255}, ${b/totalWeight*255})`);
  }, [cameraPosition]);

  return color;
}

// Use in scene:
<ambientLight intensity={0.3} color={biomeColor} />
```

---

### Task 1.7: Browser Verification (Phase 1)

**Dispatch:** `web-verifier:web-dev-verifier`

**Criteria:**
- [ ] Stars visible and twinkling
- [ ] Sparkles floating near biome centers
- [ ] Bloom makes nodes glow
- [ ] Vignette darkens edges
- [ ] Nebula backdrop visible (subtle clouds)
- [ ] 60fps maintained
- [ ] Screenshot evidence

---

## Phase 2: Spatial Restructuring

**Objective:** Transform 2D-ish planar distribution into true 3D volumetric cosmos
**Verification:** Nodes distributed spherically, Deep biome requires descent, journey between biomes feels substantial

### Task 2.1: Redesign Biome Configuration

**Files:**
- Modify: `site/src/lib/atlas/biomeLayout.ts`

**New biome centers (4x scale, true 3D):**

```typescript
const BIOME_CONFIGS: Record<string, BiomeConfig> = {
  threshold: {
    center: [0, 0, 0],
    radius: 30,
    verticalSpread: 20,
  },
  lore: {
    center: [-80, -25, -70],
    radius: 40,
    verticalSpread: 30,
  },
  creation: {
    center: [100, 35, -90],
    radius: 45,
    verticalSpread: 35,
  },
  play: {
    center: [55, 60, -130],
    radius: 35,
    verticalSpread: 25,
  },
  reflection: {
    center: [-65, 45, -160],
    radius: 40,
    verticalSpread: 30,
  },
  deep: {
    center: [0, -90, -220],
    radius: 55,
    verticalSpread: 45,
  },
};
```

---

### Task 2.2: Implement Spherical Distribution

**Files:**
- Modify: `site/src/lib/atlas/biomeLayout.ts`

**Change cylindrical to spherical:**

```typescript
// Replace current placement algorithm:
const theta = random() * Math.PI * 2;
const phi = Math.acos(2 * random() - 1); // Uniform sphere
const r = Math.cbrt(random()) * config.radius; // Volume-uniform

const x = config.center[0] + r * Math.sin(phi) * Math.cos(theta);
const y = config.center[1] + r * Math.cos(phi);
const z = config.center[2] + r * Math.sin(phi) * Math.sin(theta);
```

---

### Task 2.3: Update Camera and Scanner

**Files:**
- Modify: `site/src/stores/atlasStore.ts`
- Modify: `site/src/components/atlas/hud/ProximityScanner.tsx`

**Changes:**
```typescript
// atlasStore.ts
cameraPosition: [0, 15, 60], // Start further back

// ProximityScanner.tsx
const SCAN_RADIUS = 150; // Was 50
```

---

### Task 2.4: Browser Verification (Phase 2)

**Criteria:**
- [ ] Nodes visibly distributed in all directions (up, down, left, right, forward)
- [ ] Deep biome requires looking/traveling downward
- [ ] Journey between biomes takes noticeable time
- [ ] Scanner shows nodes at correct relative positions

---

## Phase 3: Scale and Perspective

**Objective:** Make nodes feel like approaching planets, not clicking markers
**Verification:** Distant nodes small, approaching makes them grow dramatically, audio proximity works

### Task 3.1: Implement Logarithmic Node Scaling

**Files:**
- Modify: `site/src/components/atlas/NodeArtifact.tsx`

**Implementation:**
```typescript
// In useFrame:
const dist = camera.position.distanceTo(worldPos);

// Logarithmic: small at distance, grows dramatically as approach
// At 150+ units: 0.8 (tiny)
// At 80 units: ~1.5
// At 40 units: ~3.0
// At 15 units: ~6.0
// At 5 units: ~10.0 (destination scale)
const scale = Math.max(0.8, 4.0 * Math.log10(120 / Math.max(dist, 1)));
const targetScale = THREE.MathUtils.clamp(scale, 0.8, 12.0);

// Smooth lerp
currentScale.current = THREE.MathUtils.lerp(currentScale.current, targetScale, 0.08);
meshRef.current.scale.setScalar(currentScale.current);
```

---

### Task 3.2: Add Distance-Based Visibility Tiers

**Files:**
- Modify: `site/src/components/atlas/NodeArtifact.tsx`

**Tiers:**
```typescript
// >100 units: Dim glow only, no label
// 50-100 units: Visible, subtle pulse
// 20-50 units: Full glow, title fades in
// <20 units: Bloom effect, summary visible
// <8 units: Full interaction zone, content preview
```

---

### Task 3.3: Add Node Proximity Audio

**Files:**
- Modify: `site/src/components/atlas/NodeArtifact.tsx`

**Concept:** Each node emits quiet musical signature (like Outer Wilds travelers).

```typescript
// Create persistent Tone.js synth per node
// Pitch based on biome (C3-A3 range)
// Volume: -60dB at 150 units, -15dB at 10 units
// Plays simple 3-note melody on loop (derived from node ID hash)
```

---

### Task 3.4: Add Orbital Rings to Evergreen Nodes

**Files:**
- Modify: `site/src/components/atlas/NodeArtifact.tsx`

```typescript
// If node.stage === 'evergreen':
// Add <Ring> from drei, slowly rotating, semi-transparent
// Makes evergreen nodes feel more planetary/important
```

---

### Task 3.5: Browser Verification (Phase 3)

**Criteria:**
- [ ] Distant nodes appear very small
- [ ] Approaching a node makes it grow dramatically (like approaching a planet)
- [ ] Can hear faint audio from nodes when within range (~80 units)
- [ ] Audio gets louder as approaching
- [ ] Evergreen nodes have visible orbital rings

---

## Phase 4: Movement Tuning

**Objective:** Deliberate, cosmic movement that respects the new scale
**Verification:** Base movement slower, boost powerful, drift satisfying, hyperdrive epic

### Task 4.1: Adjust Movement Parameters

**Files:**
- Modify: `site/src/stores/atlasStore.ts`

```typescript
const MOVEMENT = {
  maxSpeed: 6,              // Was 12 — slower, more deliberate
  boostMultiplier: 5.0,     // Was 2.5 — boost feels powerful
  acceleration: 15,         // Was 40 — slower ramp
  deceleration: 5,          // Was 25 — much more drift
};
```

---

### Task 4.2: Enhance Hyperdrive Ceremony

**Files:**
- Modify: `site/src/components/atlas/HyperdriveController.tsx`

```typescript
const DURATIONS = {
  locking: 1.0,     // Was 0.6 — more deliberate lock-on
  charging: 2.0,    // Was 0.8 — build anticipation
  traveling: 0,     // Distance-based (unchanged)
  arriving: 1.0,    // Was 0.5 — dramatic slowdown
  orbiting: 2.5,    // Was 1.5 — savor the arrival
};

// Add: Camera shake intensity during charge
// Add: FOV expansion during travel (70 → 100)
// Add: Arrival "bloom" flash
```

---

### Task 4.3: Add FOV Distortion

**Files:**
- Modify: `site/src/components/atlas/FirstPersonRig.tsx`

```typescript
// During boost: FOV 70 → 80
// During hyperdrive travel: FOV 70 → 100
// Smooth lerp transitions
```

---

### Task 4.4: Enhance Visitor Trail

**Files:**
- Modify: `site/src/components/atlas/VisitorTrail.tsx`

```typescript
// Trail intensity varies with speed:
// - Width: 0.05 at rest, 0.4 at boost
// - Length: 8 at rest, 40 at boost
// - Opacity: 0.2 at rest, 0.9 at boost
```

---

### Task 4.5: Browser Verification (Phase 4)

**Criteria:**
- [ ] Base movement noticeably slower
- [ ] Boost feels powerful and fast (5x difference)
- [ ] Releasing input creates long, satisfying drift
- [ ] Hyperdrive ceremony feels longer and more dramatic
- [ ] FOV widens during boost/hyperdrive
- [ ] Trail intensity reflects movement speed

---

## Phase 5: Diegetic HUD

**Objective:** Transform cluttered corner widgets into contextual, world-integrated information
**Verification:** Screen mostly clear, beacons visible in 3D space, info appears contextually

### Task 5.1: Remove Corner Clutter

**Files:**
- Modify: `site/src/components/atlas/hud/AtlasHUD.tsx`

**Remove:**
- BiomeIndicator (top-left) — will be replaced by contextual approach
- ProximityScanner (top-right) — will be replaced by peripheral glow
- CompassRing (top-center) — will be replaced by 3D beacons

**Keep (redesigned):**
- Reticle (center) — essential for first-person
- VelocityOrb — minimized and contextual
- HyperdrivePanel — only visible when relevant

---

### Task 5.2: Create BiomeBeacons (3D)

**Files:**
- Create: `site/src/components/atlas/BiomeBeacons.tsx`

**Concept:** Small glowing markers at biome centers, visible in 3D space.

```typescript
// For each biome:
// - Render small sprite at biome center
// - Billboard always faces camera
// - Opacity based on distance (fade at extremes)
// - Size based on distance (small when far, grows when looking at it)
// - Name label appears when within 100 units
// - Color matches biome
```

---

### Task 5.3: Create PeripheralGlow

**Files:**
- Create: `site/src/components/atlas/hud/PeripheralGlow.tsx`
- Create: `site/src/components/atlas/hud/peripheral-glow.css`

**Concept:** Edge glow indicates nearby off-screen nodes.

```typescript
// For each node within 80 units:
// - Calculate screen position
// - If off-screen: determine edge (top/bottom/left/right)
// - Add subtle glow at that edge, colored by biome
// - Intensity = inverse distance
```

```css
.peripheral-glow {
  position: fixed;
  pointer-events: none;
  /* Radial gradients at edges */
}
```

---

### Task 5.4: Redesign VelocityOrb

**Files:**
- Modify: `site/src/components/atlas/hud/VelocityOrb.tsx`
- Modify: `site/src/components/atlas/hud/hud.css`

**Changes:**
- Move to bottom-center (was bottom-left corner)
- Shrink to 50px (was 80px)
- Only visible during movement (fade out when stopped)
- Much simpler: just a dot showing direction

---

### Task 5.5: Make HyperdrivePanel Contextual

**Files:**
- Modify: `site/src/components/atlas/hud/HyperdrivePanel.tsx`

**Changes:**
- Hidden by default (not always visible)
- Appears when: (1) hovering a node, (2) during hyperdrive
- Position: bottom-center, above velocity indicator
- Larger text (14px status, was 13px)

---

### Task 5.6: Browser Verification (Phase 5)

**Criteria:**
- [ ] Screen is mostly clear (no corner panels)
- [ ] Biome beacons visible as 3D markers in space
- [ ] Edge glow appears when nodes are nearby but off-screen
- [ ] Velocity indicator minimal, only visible during movement
- [ ] Hyperdrive panel appears only when relevant

---

## Phase 6: Audio Landscape

**Objective:** Musical signatures that make the cosmos sing
**Verification:** Each biome has distinct sound, nodes emit proximity audio, audio crossfades smoothly

**LEVERAGE:** Use `<PositionalAudio>` from drei + CC-licensed ambient tracks + Tone.js for synthesis.

### Task 6.1: Download/Prepare Audio Assets

**Files:**
- Create: `site/public/audio/biomes/` directory
- Create: `site/public/audio/ui/` directory

**Assets to acquire (CC-licensed):**

| Biome | Sound Type | Source Suggestion |
|-------|-----------|-------------------|
| threshold | Warm ambient pad | Scott Buckley or Mixkit |
| lore | Low drone, ancient | Looperman drone loops |
| creation | Bright texture | Ambient-Mixer sci-fi |
| play | Playful bells/chimes | OpenGameArt CC0 |
| reflection | Ethereal, reverb | Free Music Archive |
| deep | Dark bass drone | LonePeakMusic pack |

**UI sounds:**
- `hyperdrive-charge.mp3` — Rising tone
- `hyperdrive-travel.mp3` — Whoosh/warp
- `discovery-chime.mp3` — Subtle reveal tone

---

### Task 6.2: Create BiomeAmbience with PositionalAudio

**Files:**
- Create: `site/src/components/atlas/audio/BiomeAmbience.tsx`

**Implementation using drei:**
```typescript
import { PositionalAudio } from '@react-three/drei';

// One PositionalAudio per biome center
// distance={100} — audible within 100 units
// loop — continuous playback
// Volume managed by THREE.PositionalAudio's distance model

export function BiomeAmbience() {
  return (
    <>
      {BIOMES.map(biome => (
        <group key={biome.id} position={biome.center}>
          <PositionalAudio
            url={`/audio/biomes/${biome.id}.mp3`}
            distance={80}
            loop
          />
        </group>
      ))}
    </>
  );
}
```

**Why this works:** drei's PositionalAudio automatically handles:
- Distance-based volume falloff
- Spatial positioning (left/right stereo)
- Integration with R3F render loop

---

### Task 6.3: Add Node Proximity Audio (Tone.js Synthesis)

**Files:**
- Modify: `site/src/components/atlas/NodeArtifact.tsx`

**Concept:** Each node generates a simple tone using Tone.js, volume based on distance.

```typescript
import * as Tone from 'tone';

// Per-node synth (created once, volume updated per frame)
const synth = new Tone.Synth({
  oscillator: { type: 'sine' },
  envelope: { attack: 0.5, decay: 0.1, sustain: 0.8, release: 1 }
}).toDestination();

// In useFrame:
// - Calculate distance to camera
// - Map distance to volume: -60dB at 100 units, -20dB at 10 units
// - Play note derived from biome (C4 for threshold, D4 for lore, etc.)

// Pattern from "Call to the Void" drone synth:
// - Low frequency range (C2-C4)
// - Slow attack for ambient feel
// - PWM modulation for texture
```

**Outer Wilds pattern:** Each node is like a "Traveler" with their own instrument. Same melody, different timbre.

---

### Task 6.4: Enhance Hyperdrive Audio Arc

**Files:**
- Modify: `site/src/components/atlas/HyperdriveController.tsx`

**Use pre-recorded assets + Tone.js synthesis:**

```typescript
// Locking phase: Play target node's synth louder
// Charging phase: Tone.js frequency sweep (200Hz → 800Hz over 2s)
// Traveling phase: Play hyperdrive-travel.mp3 (whoosh sound)
// Arriving phase: Frequency sweep down (800Hz → 200Hz)
// Orbiting phase: Fade in destination biome ambience
```

---

### Task 6.5: Browser Verification (Phase 6)

**Criteria:**
- [ ] Each biome has distinct ambient sound (different audio files)
- [ ] Approaching biome center increases volume
- [ ] Individual nodes emit quiet tones
- [ ] Hyperdrive has audio feedback throughout journey
- [ ] Audio doesn't clip or cause performance issues

---

## Phase 7: Artifact Destinations (The Deep Content)

**Objective:** Embed existing artifacts as discoverable destinations — the rewards for deep exploration
**Verification:** Each artifact loads as interactive experience when approached, discovery feels momentous

**Philosophy:** These aren't just "Easter eggs" — they're the heart of the experience. The Atlas is a cosmos containing worlds within worlds.

### Task 7.1: Create ArtifactPortal Component

**Files:**
- Create: `site/src/components/atlas/ArtifactPortal.tsx`

**Concept:** Special node type that opens into an artifact experience.

```typescript
interface ArtifactPortal {
  artifactId: 'teleodynamic' | 'sympoietic' | 'labyrinth-pov' | 'labyrinth-coupled';
  position: [number, number, number];
  biome: string;
  discoveryText: string;
  component: React.FC;
}

const ARTIFACT_PORTALS: ArtifactPortal[] = [
  {
    artifactId: 'teleodynamic',
    position: [0, -120, -280], // Deep biome, far in
    biome: 'deep',
    discoveryText: 'The Signature of Self',
    // Loads TeleodynamicSignature component
  },
  {
    artifactId: 'sympoietic',
    position: [-85, 55, -180], // Reflection biome
    biome: 'reflection',
    discoveryText: 'The Living Between',
    // Loads SympoieticSignature component
  },
  // ... etc
];
```

---

### Task 7.2: Convert JSX Artifacts to R3F

**Files:**
- Create: `site/src/components/artifacts/TeleodynamicWorld.tsx`
- Create: `site/src/components/artifacts/SympoieticWorld.tsx`

**Approach:**
1. JSX artifacts use Canvas2D — wrap in Html component or convert to R3F
2. Each artifact becomes a "world within world" — enter portal, experience artifact
3. Add "exit" button to return to Atlas navigation

**For TeleodynamicWorld:**
```typescript
// Option A: Html overlay (fastest)
<Html fullscreen>
  <TeleodynamicSignature />
</Html>

// Option B: Port to R3F (most integrated)
// Convert Canvas2D particle system to Three.js Points/Shaders
```

---

### Task 7.3: Convert HTML Artifacts to Portals

**Files:**
- Create: `site/src/components/artifacts/LabyrinthPOVWorld.tsx`
- Create: `site/src/components/artifacts/LabyrinthCoupledWorld.tsx`

**Approach:**
1. HTML artifacts use Three.js directly — can iframe or extract/port
2. Iframe approach: Load artifact in fullscreen iframe with exit overlay
3. Port approach: Extract Three.js code into R3F component

```typescript
// Iframe portal approach
function LabyrinthPOVWorld({ onExit }) {
  return (
    <div className="artifact-portal-container">
      <iframe
        src="/artifacts/Labyrinth_particle-pov.html"
        className="artifact-iframe"
      />
      <button onClick={onExit} className="portal-exit">
        Return to Atlas
      </button>
    </div>
  );
}
```

---

### Task 7.4: Portal Discovery Ceremony

**Files:**
- Modify: `site/src/components/atlas/NodeArtifact.tsx`
- Create: `site/src/components/atlas/PortalNode.tsx`

**Concept:** Artifact portals look different from regular nodes — larger, more luminous, with distinct visual signature.

```typescript
// Portal nodes have:
// - Larger base size (2x regular nodes)
// - Orbital rings (like saturn)
// - Unique color per artifact (not biome-colored)
// - "Enter" prompt when close enough
// - Discovery audio: unique chime per artifact
```

---

### Task 7.5: Portal State Management

**Files:**
- Modify: `site/src/stores/atlasStore.ts`

**Additions:**
```typescript
interface AtlasState {
  // ... existing state

  // Portal state
  activePortal: string | null;
  discoveredPortals: string[];

  // Actions
  enterPortal: (portalId: string) => void;
  exitPortal: () => void;
}
```

---

### Task 7.6: Browser Verification (Phase 7)

**Criteria:**
- [ ] Artifact portals visible as special nodes in designated biomes
- [ ] Approaching portal shows "Enter" prompt
- [ ] Entering portal transitions smoothly to artifact experience
- [ ] Each artifact is fully interactive
- [ ] Exit returns to Atlas at portal location
- [ ] Discovery state persists in localStorage

---

## Phase 8: Polish and Wonder

**Objective:** Final touches that create emotional resonance
**Verification:** Entry sequence works, cosmos breathes together, accessibility complete

### Task 8.1: Add Entry Sequence

**Files:**
- Create: `site/src/components/atlas/EntrySequence.tsx`

**Concept:** First load: camera starts in darkness, cosmos reveals.

```typescript
// 4 second sequence:
// 0-1s: Pure black, single distant star appears
// 1-2.5s: Stars fade in, nebulae appear
// 2.5-4s: Camera moves to starting position, UI fades in
// Sets localStorage flag to skip on return visits
```

---

### Task 8.2: Sync Cosmos Breathing

**Files:**
- Modify: NebulaBackdrop, VoidMatrixParticles, NodeArtifact

**Concept:** Everything pulses on same 8-second cycle.

```typescript
const BREATH_PERIOD = 8.0;
// All pulsing/breathing uses: sin(time * (2 * Math.PI / BREATH_PERIOD))
// Creates subconscious sense of living cosmos
```

---

### Task 8.3: Add First Discovery Moment

**Files:**
- Modify: `site/src/components/atlas/NodeArtifact.tsx`

**Concept:** First time approaching a node very close, special reveal.

```typescript
// If distance < 15 and node not in localStorage.discoveredNodes:
// - Brief pause (150ms camera smoothing)
// - Title appears with subtle audio chime
// - Mark as discovered
// - Never triggers again for this node
```

---

### Task 8.4: Accessibility Pass

**Files:**
- Multiple (all animation/audio components)

**Requirements:**
1. `prefers-reduced-motion`: Disable breathing, shorter hyperdrive, no FOV changes
2. Keyboard navigation: Tab cycles nodes, Enter hyperdrives, Escape cancels
3. Audio can be muted globally via setting

---

### Task 8.5: Performance Optimization

**Files:**
- Multiple

**Checks:**
1. Particle LOD (reduce count at distance)
2. Audio pooling (max 6 node synths active)
3. Nebula shader complexity option
4. Test on lower-end hardware

---

### Task 8.6: Final Browser Verification

**Criteria:**
- [ ] Entry sequence creates sense of arrival (first visit)
- [ ] Cosmos breathes as unified living system
- [ ] First node discovery feels special
- [ ] Reduced motion preference fully respected
- [ ] Keyboard-only navigation works
- [ ] 60fps maintained throughout

---

## Critical Files Summary

| File | Changes |
|------|---------|
| `package.json` | Add @react-three/postprocessing |
| `NebulaBackdrop.tsx` | **NEW** — Simple procedural nebula backdrop |
| `biomeLayout.ts` | 4x scale, spherical distribution |
| `NodeArtifact.tsx` | Log scaling, proximity audio, discovery |
| `atlasStore.ts` | Movement params, camera position, portal state |
| `HyperdriveController.tsx` | Longer ceremony, FOV, audio arc |
| `FirstPersonRig.tsx` | FOV distortion |
| `VisitorTrail.tsx` | Speed-responsive intensity |
| `MyceliumScene.tsx` | Stars, Sparkles, EffectComposer, BiomeLight |
| `AtlasHUD.tsx` | Remove corner panels |
| `BiomeBeacons.tsx` | **NEW** — 3D biome markers |
| `PeripheralGlow.tsx` | **NEW** — Edge proximity indicators |
| `VelocityOrb.tsx` | Smaller, contextual |
| `HyperdrivePanel.tsx` | Contextual visibility |
| `BiomeAmbience.tsx` | **NEW** — Per-biome audio |
| `ArtifactPortal.tsx` | **NEW** — Portal node type for artifact destinations |
| `PortalNode.tsx` | **NEW** — Special visual treatment for portals |
| `TeleodynamicWorld.tsx` | **NEW** — Embedded Teleodynamic Signature |
| `SympoieticWorld.tsx` | **NEW** — Embedded Sympoietic Signature |
| `LabyrinthPOVWorld.tsx` | **NEW** — Embedded Labyrinth POV |
| `LabyrinthCoupledWorld.tsx` | **NEW** — Embedded Labyrinth Coupled |
| `EntrySequence.tsx` | **NEW** — First-visit reveal |

**Libraries Leveraged (not rebuilt):**
- `<Stars>` from drei — twinkling starfield
- `<Sparkles>` from drei — floating biome particles
- `<EffectComposer>` + `<Bloom>` + `<Vignette>` — unified post-processing
- `shaderMaterial` from drei — cleaner shader definition
- `<Html>` from drei — embedding 2D artifacts in 3D space

**Existing Artifacts Integrated (as destinations):**
- `artifacts/teleodynamic-signature-v8.jsx` → Deep biome: "The Signature of Self"
- `artifacts/sympoietic-signature-v3.jsx` → Reflection biome: "The Living Between"
- `artifacts/Labyrinth_particle-pov.html` → Deep biome (far): "Labyrinth Genesis"
- `artifacts/labyrinth-genesis-coupled.html` → Creation biome: "Coupled Systems"

---

## Execution Notes

**Recommended approach:** Subagent-driven development in this session. Each phase is independent enough for fresh subagent context, and browser verification between phases catches issues early.

**Risk mitigation:**
- Phase 1 (postprocessing) — verify Bloom + DOF doesn't tank FPS
- Phase 6 (audio) may have Tone.js complexity — test on multiple browsers
- If Sparkles count is too high, reduce per-biome to 50

**Commit strategy:**
- Commit after each phase completion
- Push before moving to next phase
- Update SESSION-STATE.md after Phase 3 and Phase 7

**Key Principle:** LEVERAGE existing libraries. Don't rebuild what drei/postprocessing already provides.

---

## Quick Command Reference

```bash
# Install postprocessing
cd site && npm install @react-three/postprocessing postprocessing

# Run dev
npm run dev

# Type check
npx tsc --noEmit

# Build
npm run build
```

---

---

## Research Sources (Deep Creative-Technical)

### Design Philosophy
- [Outer Wilds UX as Human Experience](https://medium.com/@claudmohe/how-outer-wilds-transcends-ux-to-become-human-experience-3ff41def8f8c) — Diegetic UI, curiosity-driven design
- [Mobius Digital UI Concepting](https://www.mobiusdigitalgames.com/news/concepting-ui) — Retro NASA aesthetic, information hierarchy through omission
- [Andrew Prahlow Interview](https://filmmusiccentral.com/2020/03/26/an-interview-with-andrew-prahlow-composer-of-outer-wilds/) — Travelers and instruments, music follows exploration

### Visual Libraries
- [drei Documentation](https://drei.docs.pmnd.rs/) — Stars, Sparkles, PositionalAudio, Environment
- [react-postprocessing](https://docs.pmnd.rs/react-postprocessing) — Bloom, Vignette, DepthOfField, GodRays
- [drei PositionalAudio](https://drei.docs.pmnd.rs/abstractions/positional-audio) — 3D spatial sound
- [drei Environment](https://drei.docs.pmnd.rs/staging/environment) — HDRI presets, Sky component

### Audio Synthesis
- [Tone.js](https://tonejs.github.io/) — Web Audio framework
- [Tone.js Examples](https://tonejs.github.io/examples/) — Synth patterns
- [Call to the Void](https://github.com/devin-hart/Call-to-the-Void) — Drone synth architecture
- [generative.fm](https://generative.fm/) — Procedural ambient patterns
- [Web Audio Spatialization](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Web_audio_spatialization_basics) — HRTF, panning models

### Free Audio Assets
- [Scott Buckley Ambient Library](https://www.scottbuckley.com.au/library/genre/ambient/) — CC ambient music
- [Free Music Archive Ambient](https://freemusicarchive.org/genre/Ambient/) — CC catalog
- [OpenGameArt Space Music](https://opengameart.org/content/audiomusicspace) — CC0 game audio
- [Looperman Space Ambient](https://www.looperman.com/loops/tags/free-space-ambient-loops-samples-sounds-wavs-download) — Royalty-free loops
- [Ambient-Mixer](https://www.ambient-mixer.com/) — CC Sampling+ atmospheres
- [LonePeakMusic Free Pack](https://lonepeakmusic.itch.io/free-ambient-music) — 3hr ambient for games
- [Mixkit Ambient](https://mixkit.co/free-stock-music/ambient/) — 44 free tracks

### Advanced Techniques
- [Codrops GPGPU Particles](https://tympanus.net/codrops/2024/12/19/crafting-a-dreamy-particle-effect-with-three-js-and-gpgpu/) — Dreamy particle effects
- [TSL Field Guide](https://blog.maximeheckel.com/posts/field-guide-to-tsl-and-webgpu/) — Future-proof shaders
- [Howler.js Spatial](https://github.com/goldfire/howler.js) — Alternative audio library
- [Procedural Audio Effects](https://dev.to/hexshift/how-to-create-procedural-audio-effects-in-javascript-with-web-audio-api-199e) — Web Audio synthesis

### Project Research Assets
- `research/samsy_shaders.glsl` — 58KB extracted shader patterns
- `research/bruno_shaders.glsl` — Loop/time patterns
- `research/awesome-sites/` — Reference site collection
- `docs/plans/2026-01-25-grand-unification-research.md` — Behavioral DNA extraction protocol

### Existing Project Artifacts — DESTINATIONS, Not Just Patterns

**CRITICAL INSIGHT:** These artifacts shouldn't just be pattern extraction — they ARE the content. They become actual points of interest in the Atlas that players discover.

| Artifact | As Destination | Placement | Discovery |
|----------|----------------|-----------|-----------|
| **Teleodynamic Signature v8** | Interactive psychophysiological sandbox | Deep biome (inner journey) | Approach reveals 5 states of being |
| **Sympoietic Signature v3** | Living process visualization | Reflection biome | Mycelium grows as you observe |
| **Labyrinth Genesis POV** | Chaotic attractor journey | Deep biome (further in) | POV mode = immersive bifurcation |
| **Labyrinth Genesis Coupled** | Heterogeneous coupling visualization | Creation biome | Multiple systems learning to sync |

**Files:**
- `artifacts/teleodynamic-signature-v8.jsx` — **1330 lines** (regulated/dysregulated/flowing states)
- `artifacts/sympoietic-signature-v3.jsx` — **1057 lines** (mycelium, emergent forms)
- `artifacts/Labyrinth_particle-pov.html` — **242KB** (Thomas attractor, POV vignette)
- `artifacts/labyrinth-genesis-coupled.html` — **51KB** (heterogeneous coupling)

**Integration approach:**
1. Convert JSX artifacts to R3F components embedded in special "destination nodes"
2. HTML artifacts become iframe portals or converted to R3F
3. Discovering these = major milestone moments with unique audio signatures
4. Each artifact is its own mini-world within the Atlas

**Pattern extraction ALSO happens:** Breathing mechanisms, flow fields, etc. can be reused for ambient cosmos effects, but the artifacts themselves are the rewards for deep exploration.
