# Feature: Scale and Movement

**Wave:** 2
**Status:** planned
**Dependencies:** spatial-restructuring
**Blocks:** artifact-destinations, polish-wonder

## Overview

Transform nodes from markers into destinations through logarithmic scaling, and make movement feel deliberate and cosmic through slower base speed, powerful boost, and ceremonial hyperdrive journeys.

**Current State:**
- Nodes: Fixed size (0.8 icosahedron), all same scale regardless of distance
- Movement: maxSpeed=12, boostMultiplier=2.5, fast acceleration/deceleration
- Hyperdrive: locking=0.6s, charging=0.8s — feels rushed
- Trail: Fixed intensity regardless of speed

**Target State:**
- Nodes: Logarithmic scaling — tiny at distance, huge when close (like approaching a planet)
- Movement: maxSpeed=6 (slower), boostMultiplier=5 (powerful), more drift
- Hyperdrive: locking=1.0s, charging=2.0s — ceremonial, dramatic
- Trail: Speed-responsive intensity
- FOV: Distorts during boost/hyperdrive

**Why This Matters:**
Nodes as destinations requires them to GROW as you approach. Slower movement makes the expanded cosmos feel vast. Powerful boost gives players agency. Hyperdrive ceremony creates anticipation.

---

## Phase 1: Logarithmic Node Scaling (3 tasks)

### Task 1.1: Add Distance-Based Scale Calculation

**File:** `site/src/components/atlas/NodeArtifact.tsx`

**Add to component:**
```typescript
const currentScale = useRef(1);

useFrame((state, delta) => {
  if (!meshRef.current) return;

  const worldPos = new THREE.Vector3(...position);
  const dist = state.camera.position.distanceTo(worldPos);

  // Logarithmic scaling:
  // At 150+ units: 0.8 (tiny dot)
  // At 80 units: ~1.5
  // At 40 units: ~3.0
  // At 15 units: ~6.0
  // At 5 units: ~10.0 (destination scale)
  const scale = Math.max(0.8, 4.0 * Math.log10(120 / Math.max(dist, 1)));
  const targetScale = THREE.MathUtils.clamp(scale, 0.8, 12.0);

  // Smooth lerp (don't snap)
  currentScale.current = THREE.MathUtils.lerp(currentScale.current, targetScale, 0.08);

  // Apply scale instead of fixed hover scaling
  const finalScale = currentScale.current * (hovered ? 1.15 : 1.0);
  meshRef.current.scale.setScalar(finalScale);

  // Existing rotation...
  meshRef.current.rotation.y += delta * 0.3;

  // ... rest of useFrame
});
```

**Verification:** Distant nodes appear small, approaching makes them grow dramatically

---

### Task 1.2: Add Distance-Based Visibility Tiers

**File:** `site/src/components/atlas/NodeArtifact.tsx`

**Add visibility logic:**
```typescript
// Visibility tiers
// >100 units: Dim glow only, no label
// 50-100 units: Visible, subtle pulse
// 20-50 units: Full glow, title fades in (Html label)
// <20 units: Bloom effect (existing), summary visible
// <8 units: Full interaction zone, content preview (existing)

// Update material opacity based on distance
const opacity = dist > 100 ? 0.4 : dist > 50 ? 0.7 : 1.0;
if (materialRef.current) {
  materialRef.current.opacity = opacity;
}

// Only show Html label when close enough
const showLabel = dist < 50;
```

**Verification:** Distant nodes dimmer, labels appear as approaching

---

### Task 1.3: Add Orbital Rings to Evergreen Nodes

**File:** `site/src/components/atlas/NodeArtifact.tsx`

**Add optional rings:**
```typescript
import { Ring } from '@react-three/drei';

// Inside the group, conditional on node.stage:
{node.stage === 'evergreen' && (
  <Ring
    args={[1.2, 1.4, 32]}
    rotation={[Math.PI / 2, 0, 0]}
  >
    <meshBasicMaterial
      color={BIOME_COLORS[biome]}
      transparent
      opacity={0.3}
      side={THREE.DoubleSide}
    />
  </Ring>
)}
```

**Note:** Requires passing `stage` prop to NodeArtifact

**Verification:** Evergreen nodes have visible orbital rings

---

**Phase 1 Verification:**
- [ ] Nodes scale logarithmically with distance
- [ ] Distant nodes appear as tiny dots
- [ ] Approaching nodes grow dramatically
- [ ] Labels appear at appropriate distance
- [ ] Evergreen nodes have rings

---

## Phase 2: Movement Parameter Tuning (3 tasks)

### Task 2.1: Adjust Base Movement Parameters

**File:** `site/src/stores/atlasStore.ts`

**Current:**
```typescript
const MOVEMENT = {
  maxSpeed: 12,
  boostMultiplier: 2.5,
  acceleration: 40,
  deceleration: 25,
};
```

**New:**
```typescript
const MOVEMENT = {
  maxSpeed: 6,              // Slower, more deliberate
  boostMultiplier: 5.0,     // Powerful boost (6 * 5 = 30)
  acceleration: 15,         // Slower ramp
  deceleration: 5,          // Much more drift
};
```

**Rationale:**
- maxSpeed 6 at 4x scale = same feeling as 1.5 at 1x scale
- High boost multiplier makes boost feel impactful
- Low deceleration creates satisfying drift

**Verification:** Movement feels slower and more deliberate, boost is powerful

---

### Task 2.2: Add FOV Distortion Hook

**File:** `site/src/hooks/useFOVDistortion.ts` (NEW)

**Implementation:**
```typescript
import { useFrame, useThree } from '@react-three/fiber';
import { useAtlasStore } from '../stores/atlasStore';
import * as THREE from 'three';

export function useFOVDistortion() {
  const { camera } = useThree();
  const isBoosting = useAtlasStore((s) => s.isBoosting);
  const hyperdrive = useAtlasStore((s) => s.hyperdrive);

  useFrame((state, delta) => {
    const perspCamera = camera as THREE.PerspectiveCamera;

    // Target FOV based on state
    let targetFOV = 70; // base
    if (isBoosting) targetFOV = 80;
    if (hyperdrive.phase === 'traveling') targetFOV = 100;

    // Smooth lerp
    perspCamera.fov = THREE.MathUtils.lerp(perspCamera.fov, targetFOV, 0.05);
    perspCamera.updateProjectionMatrix();
  });
}
```

---

### Task 2.3: Apply FOV Distortion to FirstPersonRig

**File:** `site/src/components/atlas/FirstPersonRig.tsx`

**Add hook:**
```typescript
import { useFOVDistortion } from '../../hooks/useFOVDistortion';

export function FirstPersonRig() {
  // ... existing code

  useFOVDistortion();

  // ... rest
}
```

**Verification:** FOV widens during boost, dramatic during hyperdrive travel

---

**Phase 2 Verification:**
- [ ] Base movement slower (6 vs 12)
- [ ] Boost feels powerful (5x)
- [ ] Drift noticeable after releasing input
- [ ] FOV widens during boost
- [ ] FOV dramatic during hyperdrive

---

## Phase 3: Hyperdrive Ceremony Enhancement (3 tasks)

### Task 3.1: Extend Phase Durations

**File:** `site/src/components/atlas/HyperdriveController.tsx`

**Current:**
```typescript
const DURATIONS = {
  locking: 0.6,
  charging: 0.8,
  traveling: 0,
  arriving: 0.5,
  orbiting: 1.5,
};
```

**New:**
```typescript
const DURATIONS = {
  locking: 1.0,     // More deliberate lock-on
  charging: 2.0,    // Build anticipation
  traveling: 0,     // Distance-based (unchanged)
  arriving: 1.0,    // Dramatic slowdown
  orbiting: 2.5,    // Savor the arrival
};
```

**Verification:** Hyperdrive journey feels more ceremonial

---

### Task 3.2: Enhance Camera Shake During Charge

**File:** `site/src/components/atlas/HyperdriveController.tsx`

**Current:**
```typescript
const shake = chargeProgress * 0.03;
```

**New:**
```typescript
// Exponential shake buildup
const shake = Math.pow(chargeProgress, 2) * 0.05;
```

**Verification:** Camera shake builds more dramatically during charge

---

### Task 3.3: Add Arrival Bloom Flash

**File:** `site/src/components/atlas/HyperdriveController.tsx`

**Add flash at arrival:**
```typescript
// In 'arriving' phase, at start:
if (phaseTimer.current < 0.05) {
  // Trigger bloom flash - this needs post-processing integration
  // For now, add a brief white flash overlay
  // Will be enhanced in polish-wonder feature
}
```

**Note:** Full bloom integration depends on living-cosmos post-processing. Add placeholder for now.

**Verification:** Arrival phase has visible feedback

---

**Phase 3 Verification:**
- [ ] Hyperdrive locking takes longer
- [ ] Charging phase builds anticipation
- [ ] Camera shake intensifies during charge
- [ ] Orbiting phase longer, more satisfying

---

## Phase 4: Speed-Responsive Trail (2 tasks)

### Task 4.1: Add Speed-Based Trail Parameters

**File:** `site/src/components/atlas/VisitorTrail.tsx`

**Current:**
```typescript
const baseWidth = hyperdrive.phase === 'traveling' ? 1.2 : (isMoving ? 0.4 : 0.15);
const baseLength = hyperdrive.phase === 'traveling' ? 30 : (isMoving ? 12 : 5);
```

**New:**
```typescript
// Speed-responsive calculations
const normalizedSpeed = Math.min(speed / 30, 1); // 30 = max boost speed

// Trail grows with speed
const baseWidth = hyperdrive.phase === 'traveling'
  ? 1.5
  : THREE.MathUtils.lerp(0.05, 0.5, normalizedSpeed);

const baseLength = hyperdrive.phase === 'traveling'
  ? 40
  : THREE.MathUtils.lerp(5, 25, normalizedSpeed);

// Opacity also responds to speed
const trailOpacity = THREE.MathUtils.lerp(0.2, 0.9, normalizedSpeed);
```

**Verification:** Trail is thin when slow, thick and long when boosting

---

### Task 4.2: Add Trail Color Shift at High Speed

**File:** `site/src/components/atlas/VisitorTrail.tsx`

**Optional enhancement:**
```typescript
// Color shifts toward white at high speed
const trailColor = useMemo(() => {
  const base = new THREE.Color(0x88ddff);
  const boost = new THREE.Color(0xffffff);
  return base.lerp(boost, normalizedSpeed * 0.5);
}, [normalizedSpeed]);
```

**Note:** This may require refactoring useMemo dependencies

**Verification:** Trail becomes brighter at high speeds

---

**Phase 4 Verification:**
- [ ] Trail thin and short when stationary/slow
- [ ] Trail thick and long when boosting
- [ ] Trail intensity clearly reflects speed

---

## Epic Integration

### Dependencies
- **spatial-restructuring:** Expanded scale defines movement calibration needs

### Provides To
- **artifact-destinations:** Movement system for portal approach detection
- **polish-wonder:** Hyperdrive ceremony foundation

### Integration Verification
- [ ] Movement feels appropriate at expanded scale
- [ ] Hyperdrive travel time scales with distance
- [ ] Trail visible but not distracting

### Handoff Criteria
- [ ] Nodes scale logarithmically, feel like destinations
- [ ] Movement deliberate, boost powerful
- [ ] Hyperdrive is a ceremonial journey
- [ ] Trail responds to speed
- [ ] 60fps maintained
- [ ] All changes committed

---

## Files Summary

| File | Action |
|------|--------|
| `NodeArtifact.tsx` | Modify — Logarithmic scaling, visibility tiers, orbital rings |
| `atlasStore.ts` | Modify — Movement parameters |
| `useFOVDistortion.ts` | Create — FOV hook |
| `FirstPersonRig.tsx` | Modify — Apply FOV distortion |
| `HyperdriveController.tsx` | Modify — Extended durations, enhanced shake |
| `VisitorTrail.tsx` | Modify — Speed-responsive trail |

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Movement too slow | Medium | Medium | Expose config for tuning |
| Scaling too aggressive | Low | Medium | Clamp values, tune coefficients |
| FOV distortion nausea | Medium | Medium | Reduce distortion, add option to disable |

---

## Estimated Task Count: 11 tasks across 4 phases
