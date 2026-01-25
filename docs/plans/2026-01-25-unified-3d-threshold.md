# Unified 3D Threshold Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform The Irreal's Threshold from multi-canvas 2D layers to a single unified 3D world where the camera physically moves through space.

**Architecture:** Single R3F Canvas containing all 3D elements. Camera moves along z-axis during stage progression. Crossing animation uses CatmullRomCurve3 spline to dolly through selected portal.

**Tech Stack:** React Three Fiber, Three.js, Zustand, Astro (client:only hydration)

---

## Task 0: Persist Plan to Git (FIRST!)

**Files:**
- Create: `docs/plans/2026-01-25-unified-3d-threshold.md`

**Step 1: Copy plan to repo**

```bash
cp ~/.claude/plans/zippy-wishing-truffle.md \
   /home/ungabunga/claude-workspace/PROJECTS-WORKSPACE/The-Irreal/docs/plans/2026-01-25-unified-3d-threshold.md
```

**Step 2: Commit the plan**

```bash
cd /home/ungabunga/claude-workspace/PROJECTS-WORKSPACE/The-Irreal
git add docs/plans/2026-01-25-unified-3d-threshold.md
git commit -m "docs(plan): unified 3D threshold architecture"
git push origin feature/mycelium-atlas
```

**Why:** Plans not committed = plans that will be lost. This makes it canonical for any Claude instance.

---

## Task 1: Add Camera State to Store

**Files:**
- Modify: `site/src/stores/thresholdStore.ts`

**Step 1: Read current store structure**

Verify current store shape before modifying.

**Step 2: Add camera state to interface**

```typescript
// Add to ThresholdState interface:
cameraZ: number;
cameraTargetZ: number;
crossingProgress: number;

// Add to actions:
setCameraTargetZ: (z: number) => void;
startCrossing: () => void;
```

**Step 3: Add camera state to create function**

```typescript
// Add to initial state:
cameraZ: 0,
cameraTargetZ: 0,
crossingProgress: 0,

// Add actions:
setCameraTargetZ: (z) => set({ cameraTargetZ: z }),
startCrossing: () => set({ crossingProgress: 0 }),
```

**Step 4: Verify store compiles**

Run: `cd site && npx tsc --noEmit`
Expected: No type errors

**Step 5: Commit**

```bash
git add site/src/stores/thresholdStore.ts
git commit -m "feat(threshold): add camera state to store"
```

---

## Task 2: Create CameraRig Component

**Files:**
- Create: `site/src/components/threshold/CameraRig.tsx`
- Reference: `site/src/components/atlas/SporeRig.tsx`

**Step 1: Create CameraRig with basic structure**

```typescript
import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useThresholdStore } from '../../stores/thresholdStore';

const CAMERA_POSITIONS: Record<string, number> = {
  detection: 0,
  void: 0,
  attunement: 0,
  crystallization: -5,
  portals: -15,
  crossing: -15, // Starting position for crossing
};

export function CameraRig() {
  const { camera } = useThree();
  const groupRef = useRef<THREE.Group>(null);

  const stage = useThresholdStore((s) => s.stage);
  const cameraTargetZ = useThresholdStore((s) => s.cameraTargetZ);
  const selectedPortal = useThresholdStore((s) => s.selectedPortal);
  const setCameraTargetZ = useThresholdStore((s) => s.setCameraTargetZ);

  const currentZ = useRef(0);
  const crossingPath = useRef<THREE.CatmullRomCurve3 | null>(null);
  const crossingProgress = useRef(0);

  // Update target Z when stage changes
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Mouse parallax (subtle)
    const parallaxMult = stage === 'crossing' ? 0.2 : 1;
    const parallaxX = state.pointer.x * 2 * parallaxMult;
    const parallaxY = state.pointer.y * 1.5 * parallaxMult;

    groupRef.current.position.x += (parallaxX - groupRef.current.position.x) * 2 * delta;
    groupRef.current.position.y += (parallaxY - groupRef.current.position.y) * 2 * delta;

    if (stage === 'crossing' && crossingPath.current) {
      // Spline-based crossing
      crossingProgress.current += delta / 1.5; // 1.5s duration
      const t = easeOutCubic(Math.min(crossingProgress.current, 1));

      const point = crossingPath.current.getPointAt(t);
      camera.position.copy(point);
      camera.position.x += groupRef.current.position.x;
      camera.position.y += groupRef.current.position.y;

      // Look ahead
      const lookAhead = crossingPath.current.getPointAt(Math.min(t + 0.05, 1));
      camera.lookAt(lookAhead);
    } else {
      // Stage-based z position
      const targetZ = CAMERA_POSITIONS[stage] ?? 0;
      const easing = 0.03;
      currentZ.current += (targetZ - currentZ.current) * easing;

      camera.position.z = currentZ.current;
      camera.lookAt(0, 0, currentZ.current - 20);
    }
  });

  // Create crossing path when entering crossing stage
  useFrame(() => {
    if (stage === 'crossing' && selectedPortal && !crossingPath.current) {
      const portalX = selectedPortal === 'atlas' ? -8 : 8;
      crossingPath.current = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, currentZ.current),
        new THREE.Vector3(portalX * 0.3, 0, currentZ.current - 15),
        new THREE.Vector3(portalX * 0.8, 0, -40),
        new THREE.Vector3(portalX * 0.5, 0, -100),
        new THREE.Vector3(0, 0, -200),
      ]);
      crossingProgress.current = 0;
    }

    // Reset path when not crossing
    if (stage !== 'crossing') {
      crossingPath.current = null;
    }
  });

  return <group ref={groupRef} />;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}
```

**Step 2: Verify component compiles**

Run: `cd site && npx tsc --noEmit`
Expected: No type errors

**Step 3: Commit**

```bash
git add site/src/components/threshold/CameraRig.tsx
git commit -m "feat(threshold): create CameraRig with z-axis movement and crossing spline"
```

---

## Task 3: Create PortalGroup Component

**Files:**
- Create: `site/src/components/threshold/PortalGroup.tsx`
- Reference: `site/src/components/threshold/Portal.tsx`

**Step 1: Create PortalGroup**

```typescript
import { Portal } from './Portal';
import { useThresholdStore } from '../../stores/thresholdStore';

export function PortalGroup() {
  const stage = useThresholdStore((s) => s.stage);
  const selectPortal = useThresholdStore((s) => s.selectPortal);

  // Only visible during portals/crossing stages
  const visible = stage === 'portals' || stage === 'crossing';
  if (!visible) return null;

  return (
    <group position={[0, 0, -35]}>
      {/* Atlas Portal - Left */}
      <Portal
        position={[-8, 0, 0]}
        color="#7c6fe0"
        glowColor="#9d8fff"
        label="Mycelium Atlas"
        hint="Navigate the network"
        onClick={() => selectPortal('atlas')}
        scale={3}
      />

      {/* Grove Portal - Right */}
      <Portal
        position={[8, 0, 0]}
        color="#4a9d6a"
        glowColor="#6bc59a"
        label="The Grove"
        hint="All worlds, listed"
        onClick={() => selectPortal('grove')}
        scale={3}
      />
    </group>
  );
}
```

**Step 2: Update Portal.tsx to accept scale prop**

Add to Portal interface:
```typescript
scale?: number;
```

Add to mesh:
```typescript
<mesh scale={scale ?? 1} /* existing props */ />
```

**Step 3: Verify components compile**

Run: `cd site && npx tsc --noEmit`
Expected: No type errors

**Step 4: Commit**

```bash
git add site/src/components/threshold/PortalGroup.tsx site/src/components/threshold/Portal.tsx
git commit -m "feat(threshold): create PortalGroup for unified scene"
```

---

## Task 4: Refactor VoidScene to UnifiedScene

**Files:**
- Modify: `site/src/components/threshold/VoidScene.tsx`

**Step 1: Add PortalGroup import**

```typescript
import { PortalGroup } from './PortalGroup';
import { CameraRig } from './CameraRig';
```

**Step 2: Add CameraRig and PortalGroup to scene**

Inside the Canvas, add:
```typescript
<CameraRig />
{/* ... existing content ... */}
<PortalGroup />
```

**Step 3: Adjust z-positions of existing elements**

Update positions to match z-axis layout:
- Stars: keep at default (background)
- VoidParticles: wrap in group at z: 0
- FlowFieldParticles: position at z: -15
- MetaballScene: position at z: 5

**Step 4: Verify scene renders**

Run: `npm run dev`
Navigate to localhost:4321
Expected: Scene loads without errors

**Step 5: Commit**

```bash
git add site/src/components/threshold/VoidScene.tsx
git commit -m "feat(threshold): integrate CameraRig and PortalGroup into VoidScene"
```

---

## Task 5: Simplify ThresholdExperience

**Files:**
- Modify: `site/src/components/threshold/ThresholdExperience.tsx`

**Step 1: Remove PortalLayer import and usage**

Remove:
```typescript
import { PortalLayer } from './PortalLayer';
// ...
<PortalLayer />
```

**Step 2: Remove CrossingTransition import and usage**

Remove:
```typescript
import { CrossingTransition } from './CrossingTransition';
// ...
<CrossingTransition />
```

**Step 3: Verify simplified composition**

Final structure should be:
```typescript
export function ThresholdExperience() {
  return (
    <>
      <ThresholdOrchestrator />
      <VoidScene />
      <CrystallizingText />
    </>
  );
}
```

**Step 4: Verify page loads**

Run: `npm run dev`
Navigate to localhost:4321
Expected: Single canvas visible in DevTools, portals appear in same 3D space

**Step 5: Commit**

```bash
git add site/src/components/threshold/ThresholdExperience.tsx
git commit -m "refactor(threshold): simplify to single canvas architecture"
```

---

## Task 6: Add Particle Rush Effect

**Files:**
- Modify: `site/src/components/threshold/VoidParticles.tsx`

**Step 1: Add stage awareness**

```typescript
import { useThresholdStore } from '../../stores/thresholdStore';

// Inside component:
const stage = useThresholdStore((s) => s.stage);
```

**Step 2: Modify useFrame to add rush during crossing**

```typescript
// Inside useFrame, after normal velocity update:
if (stage === 'crossing') {
  // Rush particles toward camera
  velocities[i * 3 + 2] += 0.5; // Increase z velocity
}
```

**Step 3: Verify rush effect**

Run: `npm run dev`
Click a portal
Expected: Particles rush past camera during crossing

**Step 4: Commit**

```bash
git add site/src/components/threshold/VoidParticles.tsx
git commit -m "feat(threshold): add particle rush effect during crossing"
```

---

## Task 7: Cleanup Obsolete Files

**Files:**
- Delete: `site/src/components/threshold/PortalLayer.tsx`
- Delete: `site/src/components/threshold/CrossingTransition.tsx`

**Step 1: Verify files are not imported anywhere**

Run: `grep -r "PortalLayer\|CrossingTransition" site/src/`
Expected: No results (already removed imports in Task 5)

**Step 2: Delete files**

```bash
rm site/src/components/threshold/PortalLayer.tsx
rm site/src/components/threshold/CrossingTransition.tsx
```

**Step 3: Verify build still works**

Run: `cd site && npm run build`
Expected: Build succeeds

**Step 4: Commit**

```bash
git add -A
git commit -m "chore(threshold): remove obsolete multi-canvas components"
```

---

## Task 8: Final Verification

**Step 1: Run dev server**

Run: `cd site && npm run dev`

**Step 2: Manual testing checklist**

- [ ] Single Canvas visible in DevTools (Elements tab)
- [ ] Particles visible at load
- [ ] Stage progression works (wait for portals to appear)
- [ ] Portals are in same 3D space as particles
- [ ] Click portal → camera moves forward through portal
- [ ] Particles rush past during crossing
- [ ] Reduced motion preference → fallback works

**Step 3: Commit verification note**

```bash
git commit --allow-empty -m "chore(threshold): verified unified 3D architecture working"
```

**Step 4: Push to remote**

```bash
git push origin feature/mycelium-atlas
```

---

## Verification Commands

```bash
# Type check
cd site && npx tsc --noEmit

# Dev server
npm run dev

# Production build
npm run build

# Check for duplicate Canvas
# In browser DevTools: document.querySelectorAll('canvas').length === 1
```

---

## Deferred to Phase 2

- 3D Text with troika-three-text (keep CSS overlay for now)
- SPA routing for truly seamless crossing
- GPU instancing for particles
- Quality tiering by GPU capability
- Sound spatialization
- Bridgy Fed fediverse integration
