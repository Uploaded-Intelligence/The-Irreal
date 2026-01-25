# Phase 2: Mycelium Atlas Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the "Living Mycelium" navigation system using the **Bruno Simon** engine architecture (Physics/Time) and **Samsy** visual aesthetics (GPGPU flow).

**Architecture:** A custom R3F scene (`MyceliumScene`) powered by a decoupled `Engine` class (Time loop). The camera is a "Spore" controlled by a physics-based rig that follows spline paths ("Veins") between "Node" artifacts.

**Tech Stack:** React Three Fiber, Rapier (Physics), Zustand (State), GSAP (Animation), PostProcessing.

---

## Task 1: The Engine Core (Time & Loop)

**Files:**
- Create: `site/src/lib/engine/Time.ts`
- Create: `site/src/lib/engine/EventEmitter.ts`
- Test: `site/src/lib/engine/Time.test.ts`

**Step 1: Write the failing test**

```typescript
import { describe, it, expect, vi } from 'vitest';
import { Time } from './Time';

describe('Time Engine', () => {
  it('should emit tick events', () => {
    const time = new Time();
    const spy = vi.fn();
    time.on('tick', spy);
    
    // Simulate frame
    time.tick();
    
    expect(spy).toHaveBeenCalled();
    expect(time.delta).toBeDefined();
    expect(time.elapsed).toBeDefined();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test site/src/lib/engine/Time.test.ts`
Expected: FAIL

**Step 3: Implement EventEmitter (Bruno Port)**

```typescript
type Callback = (...args: any[]) => void;

export class EventEmitter {
  callbacks: { [key: string]: Callback[] };

  constructor() {
    this.callbacks = {};
  }

  on(_name: string, _callback: Callback) {
    if (!this.callbacks[_name]) {
      this.callbacks[_name] = [];
    }
    this.callbacks[_name].push(_callback);
    return this;
  }

  off(_name: string, _callback: Callback) {
    // Implementation of removing callback
    // ...
  }

  trigger(_name: string, _args: any[] = []) {
    if (this.callbacks[_name]) {
      this.callbacks[_name].forEach((callback) => {
        callback.apply(this, _args);
      });
    }
  }
}
```

**Step 4: Implement Time (Bruno Port)**

```typescript
import { EventEmitter } from './EventEmitter';

export class Time extends EventEmitter {
  start: number;
  current: number;
  elapsed: number;
  delta: number;
  ticker?: number;

  constructor() {
    super();

    this.start = Date.now();
    this.current = this.start;
    this.elapsed = 0;
    this.delta = 16;

    // Start loop automatically? Or manual?
    // Bruno starts in constructor
    window.requestAnimationFrame(() => this.tick());
  }

  tick() {
    const currentTime = Date.now();
    this.delta = currentTime - this.current;
    this.current = currentTime;
    this.elapsed = this.current - this.start;

    if (this.delta > 60) {
      this.delta = 60;
    }

    this.trigger('tick');

    window.requestAnimationFrame(() => this.tick());
  }
}
```

**Step 5: Run test to verify it passes**

Run: `npm test site/src/lib/engine/Time.test.ts`
Expected: PASS

**Step 6: Commit**

```bash
git add site/src/lib/engine/
git commit -m "feat(engine): add Time and EventEmitter classes based on Bruno Simon architecture"
```

---

## Task 2: The Spore Rig (Camera Controller)

**Files:**
- Create: `site/src/components/atlas/SporeRig.tsx`
- Modify: `site/src/components/atlas/MyceliumScene.tsx`

**Architecture:**
Instead of `OrbitControls`, we create a `Rig` component that:
1.  Listens to `Time` tick.
2.  Updates camera position based on a "Rail" (Spline) progress.
3.  Adds "Swim" offset based on mouse position (Parallax).

**Step 1: Create SporeRig**

```tsx
import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { useThresholdStore } from '../../stores/thresholdStore'; // Reuse or create new store

export function SporeRig() {
  const { camera, mouse } = useThree();
  const group = useRef<THREE.Group>(null);
  
  // State for dampening
  const targetLook = useRef(new THREE.Vector3(0, 0, 0));
  const currentLook = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state, delta) => {
    // 1. Mouse Parallax (The Swim)
    // Convert normalized mouse (-1 to 1) to offset
    const parallaxX = state.mouse.x * 2;
    const parallaxY = state.mouse.y * 2;
    
    if (group.current) {
      // Dampened lerp
      group.current.position.x += (parallaxX - group.current.position.x) * 2 * delta;
      group.current.position.y += (parallaxY - group.current.position.y) * 2 * delta;
    }

    // 2. LookAt Logic (Dampened)
    // For now, look at center. Later, look at target node.
    targetLook.current.set(0, 0, 0);
    currentLook.current.lerp(targetLook.current, 0.05);
    
    camera.lookAt(currentLook.current);
  });

  return (
    <group ref={group}>
      {/* Camera is parented to this group for parallax offset */}
      <primitive object={camera} />
    </group>
  );
}
```

**Step 2: Commit**

```bash
git add site/src/components/atlas/SporeRig.tsx
git commit -m "feat(atlas): add SporeRig camera controller with dampening"
```

---

## Task 3: The MToon Node Artifact

**Files:**
- Create: `site/src/components/atlas/NodeArtifact.tsx`
- Create: `site/src/components/atlas/shaders/MToonNode.tsx` (ShaderMaterial)

**Step 1: Create Custom Shader Material**

We will adapt the "Bruno Toon" shader we extracted (`Shader 10` in report). Simplified for Phase 2.

```tsx
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
```

**Step 2: Create Node Component**

```tsx
import { MToonNodeMaterial } from './shaders/MToonNode';

export function NodeArtifact({ position, type }: { position: [number, number, number], type: string }) {
  return (
    <mesh position={position}>
      {/* Artifact Geometry - e.g. Icosahedron for Lore */}
      <icosahedronGeometry args={[1, 0]} />
      {/* @ts-ignore */}
      <mToonNodeMaterial color={type === 'lore' ? '#7c6fe0' : '#4a9d6a'} />
    </mesh>
  );
}
```

**Step 3: Commit**

```bash
git add site/src/components/atlas/
git commit -m "feat(atlas): add NodeArtifact with custom Toon/Rim shader"
```

---

## Task 4: The GPGPU Vein Connection

**Files:**
- Create: `site/src/components/atlas/VeinFlow.tsx`

**Architecture:**
Use `CatmullRomCurve3` to define the path.
Use `MeshLine` (from `meshline` package, or Drei's `Line`) for the vein structure.
Use a moving texture offset for the "flow".

**Step 1: Install Meshline**

```bash
npm install meshline
```

**Step 2: Create Vein Component**

```tsx
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export function VeinFlow({ start, end }: { start: [number, number, number], end: [number, number, number] }) {
  const points = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(...start),
      new THREE.Vector3(
        (start[0] + end[0]) / 2 + (Math.random() - 0.5) * 2, // Jitter mid point
        (start[1] + end[1]) / 2 + (Math.random() - 0.5) * 2,
        (start[2] + end[2]) / 2 + (Math.random() - 0.5) * 2
      ),
      new THREE.Vector3(...end)
    ]);
    return curve.getPoints(20);
  }, [start, end]);

  const matRef = useRef<any>();

  useFrame((state, delta) => {
    if (matRef.current) {
      // Flow animation
      matRef.current.dashOffset -= delta * 0.5;
    }
  });

  return (
    <Line
      points={points}
      color="#9d8fff"
      lineWidth={0.2}
      dashed
      dashScale={2}
      dashSize={1}
      gapSize={0.5}
      ref={matRef}
    />
  );
}
```

**Step 3: Commit**

```bash
git add site/src/components/atlas/VeinFlow.tsx
git commit -m "feat(atlas): add VeinFlow using animated dashed lines"
```

---

## Execution Handoff

**Plan complete and saved to `docs/plans/2026-01-25-mycelium-vertical-slice.md`.**

Two execution options:

**1. Subagent-Driven (this session)** - I dispatch `research-worker` to write these files immediately.

**2. Parallel Session (separate)** - Open new session with executing-plans.

Which approach?
