# Feature: Spatial Restructuring

**Wave:** 1 (no dependencies)
**Status:** planned
**Blocks:** scale-and-movement, diegetic-hud, audio-landscape

## Overview

Transform the flat, cramped node distribution into a true 3D volumetric cosmos. This is the foundational spatial change that enables the Outer Wilds feeling of vast, navigable space where nodes are destinations worth traveling to.

**Current Problem:**
- Biome radii: 6-14 units (tiny)
- Vertical spread: 2-6 units (essentially flat)
- Distribution: cylindrical (Math.cos/sin on angle — 2D ring pattern)
- Deep biome only at y=-10 (barely below)
- Camera starts at [0, 5, 20] — already close to everything

**Target State:**
- Biome radii: 30-55 units (4x+ expansion)
- Vertical spread: 20-45 units (true 3D)
- Distribution: spherical (uniform random on sphere surface)
- Deep biome at y=-90 (significant descent required)
- Camera starts at [0, 15, 60] — overview position
- Journeys between biomes feel substantial

**Why This Matters:**
This feature is a CRITICAL BLOCKER for:
- **scale-and-movement:** Needs expanded distances for movement calibration
- **diegetic-hud:** Needs biome centers for 3D beacon placement
- **audio-landscape:** Needs biome centers for PositionalAudio placement

---

## Phase 1: Expand Biome Configuration (2 tasks)

### Task 1.1: Update BIOME_CONFIGS with 4x Scale

**File:** `site/src/lib/atlas/biomeLayout.ts`

**Current:**
```typescript
const BIOME_CONFIGS: Record<string, BiomeConfig> = {
  threshold: { center: [0, 2, 8], radius: 6, verticalSpread: 2 },
  lore: { center: [-12, 0, -5], radius: 10, verticalSpread: 4 },
  creation: { center: [14, -2, -10], radius: 12, verticalSpread: 5 },
  play: { center: [8, 6, -15], radius: 9, verticalSpread: 4 },
  reflection: { center: [-10, -1, -20], radius: 11, verticalSpread: 3 },
  deep: { center: [0, -10, -35], radius: 14, verticalSpread: 6 },
};
```

**New:**
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

**Design rationale:**
- **threshold** at origin — player starts here, familiar ground
- **lore** lower-left-forward — descent and leftward journey
- **creation** upper-right — ascend to create
- **play** upper-forward — elevated, distant
- **reflection** upper-left-far — contemplative height
- **deep** below and far — significant descent required

---

### Task 1.2: Export Biome Configs for Other Features

**File:** `site/src/lib/atlas/biomeLayout.ts`

**Add exports:**
```typescript
// Export for audio-landscape (biome centers for PositionalAudio)
export function getAllBiomeCenters(): Record<string, [number, number, number]> {
  return Object.fromEntries(
    Object.entries(BIOME_CONFIGS).map(([k, v]) => [k, v.center])
  );
}

// Export for diegetic-hud (beacon positioning)
export function getBiomeRadius(biome: string): number {
  return BIOME_CONFIGS[biome]?.radius || BIOME_CONFIGS.threshold.radius;
}

// Re-export the full config for components that need all data
export { BIOME_CONFIGS };
```

---

**Phase 1 Verification:**
- [ ] BIOME_CONFIGS updated with new values
- [ ] New export functions available
- [ ] TypeScript compiles without errors

---

## Phase 2: Spherical Distribution (2 tasks)

### Task 2.1: Replace Cylindrical with Spherical Distribution

**File:** `site/src/lib/atlas/biomeLayout.ts`

**Current (cylindrical):**
```typescript
const angle = random() * Math.PI * 2;
const distance = random() * config.radius;
const heightOffset = (random() - 0.5) * config.verticalSpread;

const x = config.center[0] + Math.cos(angle) * distance;
const y = config.center[1] + heightOffset;
const z = config.center[2] + Math.sin(angle) * distance;
```

**New (spherical, volume-uniform):**
```typescript
// Uniform distribution on sphere surface, then scale to volume
// Using Marsaglia method for uniform sphere point
const theta = random() * Math.PI * 2;              // Azimuthal angle [0, 2π]
const phi = Math.acos(2 * random() - 1);           // Polar angle [0, π] (uniform on sphere)
const r = Math.cbrt(random()) * config.radius;     // Cube root for volume-uniform distribution

const x = config.center[0] + r * Math.sin(phi) * Math.cos(theta);
const y = config.center[1] + r * Math.cos(phi);    // Y is vertical axis
const z = config.center[2] + r * Math.sin(phi) * Math.sin(theta);
```

**Why:**
- `Math.acos(2 * random() - 1)` gives uniform distribution on sphere surface
- `Math.cbrt(random())` ensures uniform distribution within volume (not clustering at center)
- Result: nodes distributed evenly throughout spherical biome volumes

---

### Task 2.2: Validate Distribution Visually

**Action:** Run dev server and manually inspect

**Verification criteria:**
- [ ] Nodes visible above AND below camera
- [ ] Nodes visible in all horizontal directions
- [ ] No visible flat "ring" patterns
- [ ] Deep biome requires looking/traveling downward

---

**Phase 2 Verification:**
- [ ] Spherical distribution algorithm implemented
- [ ] Nodes distributed in true 3D
- [ ] No cylindrical artifacts visible

---

## Phase 3: Camera and View Updates (3 tasks)

### Task 3.1: Update Camera Starting Position

**File:** `site/src/stores/atlasStore.ts`

**Current:**
```typescript
cameraPosition: [0, 5, 20],
```

**New:**
```typescript
cameraPosition: [0, 15, 60],
```

**Rationale:** Higher and further back gives overview of threshold biome on start

---

### Task 3.2: Update Canvas Camera

**File:** `site/src/components/atlas/MyceliumScene.tsx`

**Current:**
```typescript
<Canvas camera={{ position: [0, 5, 20], fov: 70 }}>
```

**New:**
```typescript
<Canvas camera={{ position: [0, 15, 60], fov: 70 }}>
```

---

### Task 3.3: Update ProximityScanner Range

**File:** `site/src/components/atlas/hud/ProximityScanner.tsx`

**Find and update scan radius constant:**
```typescript
// Was likely ~50, update to:
const SCAN_RADIUS = 150;
```

**Rationale:** With 4x scale, scanner needs to see further

---

**Phase 3 Verification:**
- [ ] Camera starts at new position
- [ ] Threshold biome visible on start
- [ ] Scanner shows nodes at appropriate distances

---

## Phase 4: Movement Validation (2 tasks)

### Task 4.1: Test Movement at New Scale

**Action:** Run dev server and test navigation

**Check:**
- [ ] Can navigate between threshold and lore biome
- [ ] Journey feels substantial (not instant)
- [ ] Boost makes noticeable difference
- [ ] Can descend to deep biome

**Note:** Movement parameters will be fully tuned in scale-and-movement feature; this is just validation that basic navigation works

---

### Task 4.2: Update VoidMatrixParticles Range

**File:** `site/src/components/atlas/VoidMatrixParticles.tsx`

**Current:**
```typescript
data[i * 4 + 0] = (Math.random() - 0.5) * 100;  // x
data[i * 4 + 1] = (Math.random() - 0.5) * 100;  // y
data[i * 4 + 2] = (Math.random() - 0.5) * 100;  // z
```

**New:**
```typescript
data[i * 4 + 0] = (Math.random() - 0.5) * 400;  // x (4x range)
data[i * 4 + 1] = (Math.random() - 0.5) * 400;  // y
data[i * 4 + 2] = (Math.random() - 0.5) * 400;  // z
```

**Rationale:** Void particles should fill the expanded space

---

**Phase 4 Verification:**
- [ ] Navigation works between biomes
- [ ] Void particles visible throughout expanded space
- [ ] No empty void gaps in expanded areas

---

## Phase 5: Sparkles Adjustment (living-cosmos integration) (1 task)

### Task 5.1: Adjust Sparkles Scale (Coordinate with living-cosmos)

**File:** `site/src/components/atlas/MyceliumScene.tsx`

**If living-cosmos is implemented first, update Sparkles scale:**
```typescript
<Sparkles
  key={biome}
  count={80}
  scale={[80, 80, 80]}   // Expanded to match new biome radii
  position={center}
  // ... other props
/>
```

**Note:** This adjustment should be made after living-cosmos feature adds Sparkles. If spatial-restructuring is implemented first, leave a TODO comment for living-cosmos to use expanded scale.

---

**Phase 5 Verification:**
- [ ] Sparkles (if present) fill expanded biome volumes
- [ ] Or TODO comment left for living-cosmos feature

---

## Epic Integration

### Dependencies
None — Wave 1 feature

### Provides To
- **scale-and-movement:** Biome centers and radii for movement calibration
- **diegetic-hud:** Biome centers for 3D beacon placement via `getAllBiomeCenters()`
- **audio-landscape:** Biome centers for PositionalAudio via `getAllBiomeCenters()`
- **artifact-destinations:** Portal positions in expanded 3D space
- **living-cosmos:** Sparkles need expanded scale parameter

### Integration Verification
- [ ] `getAllBiomeCenters()` export working
- [ ] `getBiomeRadius()` export working
- [ ] `BIOME_CONFIGS` export available
- [ ] Spherical distribution produces no flat patterns

### Handoff Criteria
- [ ] Biomes distributed in true 3D volumetric space
- [ ] Deep biome requires significant descent (y: -90)
- [ ] Navigation between biomes takes noticeable time
- [ ] Export functions available for dependent features
- [ ] 60fps maintained
- [ ] All changes committed to git

---

## Files Summary

| File | Action |
|------|--------|
| `biomeLayout.ts` | Modify — New BIOME_CONFIGS, spherical distribution, exports |
| `atlasStore.ts` | Modify — New camera starting position |
| `MyceliumScene.tsx` | Modify — New Canvas camera position |
| `ProximityScanner.tsx` | Modify — Expanded scan radius |
| `VoidMatrixParticles.tsx` | Modify — Expanded particle range |

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Nodes too spread out | Medium | High | Tune biome radii if too sparse |
| Camera far from content | Low | Medium | Adjust starting position |
| Scanner too limited | Low | Low | Increase SCAN_RADIUS further |
| Performance with larger space | Low | Medium | VoidMatrixParticles already GPGPU |

---

## Coordinate Notes

**With living-cosmos:**
- If living-cosmos is implemented FIRST: Sparkles need scale update here
- If spatial-restructuring is implemented FIRST: living-cosmos uses expanded centers

**With scale-and-movement:**
- Movement parameters (maxSpeed, boostMultiplier) may feel wrong at new scale
- scale-and-movement feature will tune these based on new distances

---

## Estimated Task Count: 10 tasks across 5 phases
