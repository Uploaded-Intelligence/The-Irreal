# Feature: Living Cosmos

**Wave:** 1 (no dependencies)
**Status:** planned
**Blocks:** polish-wonder

## Overview

Transform the static void background into a breathing, layered bioluminescent cosmos. This feature creates the visual foundation that makes the Mycelium Atlas feel like a living universe rather than a tech demo.

The cosmos should breathe — every 8 seconds, a subtle pulse moves through stars, particles, and nebulae, creating a subconscious sense of life. Biomes should have distinct visual signatures through colored sparkles. Post-processing creates the cinematic glow that makes nodes feel luminous.

**Current State:**
- VoidMatrixParticles (4096 GPGPU particles, 100³ cube)
- Basic lighting (1 ambient, 2 point lights)
- No post-processing
- No starfield
- No biome-specific particles

**Target State:**
- 8000 twinkling stars (drei `<Stars>`)
- Per-biome floating sparkles (drei `<Sparkles>`)
- Post-processing pipeline (Bloom + Vignette + DOF)
- Simple breathing nebula backdrop
- Biome-responsive ambient lighting

---

## Phase 1: Post-Processing Pipeline (3 tasks)

### Task 1.1: Add EffectComposer to MyceliumScene

**File:** `site/src/components/atlas/MyceliumScene.tsx`

**Implementation:**
```typescript
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';

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
</EffectComposer>
```

**Why these values:**
- `luminanceThreshold={0.2}` — Only bright elements bloom (nodes, sparkles)
- `intensity={0.8}` — Visible glow without overwhelming
- `darkness={0.8}` — Strong edge darkening focuses attention

**Verification:** Nodes should glow visibly, edges of screen darker

---

### Task 1.2: Add Depth of Field (Optional Enhancement)

**File:** `site/src/components/atlas/MyceliumScene.tsx`

**Implementation:**
```typescript
import { DepthOfField } from '@react-three/postprocessing';

// Inside EffectComposer, BEFORE Bloom:
<DepthOfField
  focusDistance={0}
  focalLength={0.02}
  bokehScale={2}
  height={480}
/>
```

**Why:** Creates cinematic depth, distant objects slightly blurred.

**Verification:** Objects far from camera should have subtle blur

---

### Task 1.3: Performance Validation

**Action:** Run dev server, check FPS counter in browser devtools

**Acceptance criteria:**
- [ ] 60fps maintained with post-processing enabled
- [ ] No visible stutter during camera movement
- [ ] If <60fps: reduce bokehScale or disable DOF

**Rollback:** If performance unacceptable, remove DepthOfField effect

---

**Phase 1 Verification:**
- [ ] Bloom visible on nodes and bright elements
- [ ] Vignette darkening screen edges
- [ ] 60fps maintained
- [ ] Screenshot captured for comparison

---

## Phase 2: Starfield (2 tasks)

### Task 2.1: Add drei Stars Component

**File:** `site/src/components/atlas/MyceliumScene.tsx`

**Implementation:**
```typescript
import { Stars } from '@react-three/drei';

// After VoidMatrixParticles, before nodes:
<Stars
  radius={500}           // Inner sphere radius (beyond all biomes)
  depth={100}            // Depth of star field
  count={8000}           // Number of stars
  factor={6}             // Size factor
  saturation={0.1}       // Slight color variation
  fade                   // Faded at edges
  speed={0.5}            // Twinkle speed
/>
```

**Why these values:**
- `radius={500}` — Stars well beyond biome boundaries (max biome will be ~120 radius after spatial restructuring)
- `count={8000}` — Dense enough for "cosmos" feel
- `speed={0.5}` — Slow twinkle (not distracting)

**Verification:** Stars should be visible in all directions, twinkling subtly

---

### Task 2.2: Tune Stars for Biome Visibility

**Action:** Adjust if stars compete with nodes visually

**Parameters to tune:**
- `factor` — Decrease if stars too prominent
- `saturation` — Decrease if colors distract
- `count` — Decrease if performance suffers

**Verification:** Stars visible but nodes remain primary visual focus

---

**Phase 2 Verification:**
- [ ] Stars visible surrounding the play area
- [ ] Stars twinkle subtly
- [ ] Nodes still visually prominent
- [ ] 60fps maintained

---

## Phase 3: Biome Sparkles (3 tasks)

### Task 3.1: Define Biome Sparkle Configuration

**File:** `site/src/lib/atlas/biomeLayout.ts` (add export)

**Implementation:**
```typescript
export const BIOME_SPARKLE_COLORS: Record<string, string> = {
  threshold: '#9d8fff',   // Soft purple
  lore: '#7c6fe0',        // Deep purple
  creation: '#e06f9d',    // Pink
  play: '#e0c46f',        // Gold
  reflection: '#6fe0c4',  // Teal
  deep: '#4a6fe0',        // Deep blue
};
```

---

### Task 3.2: Add Sparkles to Scene

**File:** `site/src/components/atlas/MyceliumScene.tsx`

**Implementation:**
```typescript
import { Sparkles } from '@react-three/drei';
import { getBiomeCenter, getAllBiomes, BIOME_SPARKLE_COLORS } from '../../lib/atlas/biomeLayout';

// After Stars, before nodes:
{getAllBiomes().map((biome) => {
  const center = getBiomeCenter(biome);
  const color = BIOME_SPARKLE_COLORS[biome];
  return (
    <Sparkles
      key={biome}
      count={80}
      scale={[30, 30, 30]}      // Will need adjustment after spatial-restructuring
      position={center}
      size={3}
      speed={0.2}
      opacity={0.5}
      color={color}
    />
  );
})}
```

**Note:** Scale will need adjustment after spatial-restructuring increases biome radii

**Verification:** Each biome should have colored floating particles

---

### Task 3.3: Fine-tune Sparkle Parameters

**Action:** Adjust parameters for visual balance

**Parameters to tune:**
- `count` — More for larger biomes (after spatial-restructuring)
- `size` — Larger if too subtle
- `opacity` — Decrease if too prominent
- `speed` — Increase for more activity

**Verification:** Sparkles visible but not distracting, colors distinguishable

---

**Phase 3 Verification:**
- [ ] Each biome has distinctly colored sparkles
- [ ] Sparkles float naturally (not too fast/slow)
- [ ] Sparkles don't obscure nodes
- [ ] 60fps maintained

---

## Phase 4: Breathing Nebula Backdrop (3 tasks)

### Task 4.1: Create NebulaBackdrop Component

**File:** `site/src/components/atlas/NebulaBackdrop.tsx` (NEW)

**Implementation:**
```typescript
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';

// Simple breathing nebula - procedural noise-based gradient
const NebulaShaderMaterial = shaderMaterial(
  { uTime: 0 },
  // Vertex shader
  `
    varying vec3 vPosition;
    void main() {
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader - simplex noise for soft clouds
  `
    uniform float uTime;
    varying vec3 vPosition;

    // Simplex noise function (embed or import)
    // ... simplex3D implementation ...

    void main() {
      // 8-second breathing cycle
      float breath = sin(uTime * 0.785398) * 0.15 + 0.85; // 2π/8 ≈ 0.785

      // Simple gradient based on position
      float n = sin(vPosition.x * 0.01 + uTime * 0.05) *
                cos(vPosition.y * 0.01 + uTime * 0.03) *
                sin(vPosition.z * 0.01 + uTime * 0.04);

      vec3 colorA = vec3(0.04, 0.02, 0.12); // Deep purple
      vec3 colorB = vec3(0.02, 0.08, 0.15); // Teal
      vec3 color = mix(colorA, colorB, n * 0.5 + 0.5);

      gl_FragColor = vec4(color * breath, 0.3);
    }
  `
);

export function NebulaBackdrop() {
  const ref = useRef<THREE.ShaderMaterial>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.uniforms.uTime.value = clock.elapsedTime;
    }
  });

  return (
    <mesh>
      <sphereGeometry args={[600, 32, 32]} />
      <nebulaShaderMaterial
        ref={ref}
        side={THREE.BackSide}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}
```

---

### Task 4.2: Integrate NebulaBackdrop into Scene

**File:** `site/src/components/atlas/MyceliumScene.tsx`

**Implementation:**
```typescript
import { NebulaBackdrop } from './NebulaBackdrop';

// First element after Canvas opens (renders behind everything):
<NebulaBackdrop />
```

**Verification:** Subtle colored backdrop visible, breathing gently

---

### Task 4.3: Tune Nebula Breathing

**Parameters to tune:**
- Breathing amplitude (currently 0.15)
- Color intensity
- Noise frequency

**Acceptance criteria:**
- [ ] Breathing is subtle, not distracting
- [ ] Colors complement biome sparkles
- [ ] 8-second cycle synchronized

---

**Phase 4 Verification:**
- [ ] Nebula backdrop visible
- [ ] Breathing cycle perceptible but subtle
- [ ] Colors harmonize with overall aesthetic
- [ ] 60fps maintained

---

## Phase 5: Biome-Responsive Lighting (2 tasks)

### Task 5.1: Create useBiomeLight Hook

**File:** `site/src/hooks/useBiomeLight.ts` (NEW)

**Implementation:**
```typescript
import { useState, useEffect, useMemo } from 'react';
import { useAtlasStore } from '../stores/atlasStore';
import { BIOME_CONFIGS, BIOME_SPARKLE_COLORS } from '../lib/atlas/biomeLayout';
import * as THREE from 'three';

export function useBiomeLight() {
  const cameraPosition = useAtlasStore((s) => s.cameraPosition);

  const color = useMemo(() => {
    let totalWeight = 0;
    let r = 0, g = 0, b = 0;

    Object.entries(BIOME_CONFIGS).forEach(([biome, config]) => {
      const dx = cameraPosition[0] - config.center[0];
      const dy = cameraPosition[1] - config.center[1];
      const dz = cameraPosition[2] - config.center[2];
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      // Inverse square weight, clamped
      const weight = 1 / (dist * dist * 0.01 + 1);
      totalWeight += weight;

      const biomeColor = new THREE.Color(BIOME_SPARKLE_COLORS[biome]);
      r += biomeColor.r * weight;
      g += biomeColor.g * weight;
      b += biomeColor.b * weight;
    });

    return new THREE.Color(r / totalWeight, g / totalWeight, b / totalWeight);
  }, [cameraPosition]);

  return color;
}
```

---

### Task 5.2: Apply Dynamic Lighting to Scene

**File:** `site/src/components/atlas/MyceliumScene.tsx`

**Implementation:**
```typescript
import { useBiomeLight } from '../../hooks/useBiomeLight';

// Inside the component, before return:
const biomeColor = useBiomeLight();

// Replace static ambientLight:
<ambientLight intensity={0.3} color={biomeColor} />
```

**Verification:** Ambient light color should shift subtly as camera moves between biomes

---

**Phase 5 Verification:**
- [ ] Light color changes as camera moves
- [ ] Changes are subtle, not jarring
- [ ] Biome colors reflected in lighting

---

## Epic Integration

### Dependencies
None — Wave 1 feature

### Provides To
- **polish-wonder:** Post-processing pipeline, breathing sync pattern
- **All features:** Visual foundation, biome color definitions

### Integration Verification
- [ ] Post-processing pipeline exports cleanly (other features may add effects)
- [ ] Breathing cycle constant (8 seconds) can be shared
- [ ] Biome colors exported for audio-landscape and diegetic-hud

### Handoff Criteria
- [ ] Stars twinkling, surrounding play area
- [ ] Sparkles floating at each biome center
- [ ] Bloom making nodes glow
- [ ] Vignette focusing attention
- [ ] Nebula breathing on 8-second cycle
- [ ] Ambient light responds to biome proximity
- [ ] 60fps maintained throughout
- [ ] All components committed to git

---

## Files Summary

| File | Action |
|------|--------|
| `MyceliumScene.tsx` | Modify — Add Stars, Sparkles, EffectComposer, NebulaBackdrop |
| `NebulaBackdrop.tsx` | Create — Breathing nebula shader |
| `biomeLayout.ts` | Modify — Export BIOME_SPARKLE_COLORS |
| `useBiomeLight.ts` | Create — Dynamic biome lighting hook |

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Postprocessing FPS drop | Medium | High | Reduce bloom intensity, disable DOF |
| Sparkles overlap nodes | Low | Medium | Tune count and opacity |
| Nebula shader complexity | Low | Medium | Simplify to gradient if needed |

---

## Estimated Task Count: 13 tasks across 5 phases
