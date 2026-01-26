# Embodied Navigation System — The Irreal Atlas

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform Mycelium Atlas from disembodied camera to embodied visitor with first-person piloting, mouse-look, ceremonial hyperdrive journeys, and Elite Dangerous / No Man's Sky-style cockpit HUD.

**Architecture:** First-person embodiment (you ARE the visitor, you see your trail behind you). Camera = visitor position. WASD + mouse-look for 6DOF movement. Hyperdrive = ceremonial multi-phase journey with visual/audio arc. Biome-aware deterministic spatial clustering. Zustand stores primitives only (tuples, not THREE objects). HUD system with CSS animations + R3F hooks for real-time instrument updates.

**Tech Stack:** R3F 9.5 | drei 10.7 (Trail, Html, PointerLockControls) | Three.js r182 | Zustand 5.0 | Tone.js 15.1 | CSS Custom Properties | backdrop-filter

**Philosophy:** You don't VIEW the mycelium. You MOVE THROUGH it. You don't CLICK nodes. You JOURNEY to them. The trail behind you is the only avatar — proof you exist, fading into the void. Your HUD is your cockpit — instruments that ground you in the cosmos.

---

## Pre-Implementation Check

✅ **Dependencies verified:**
- `@react-three/drei` - Trail, Html, PointerLockControls installed
- `tone` - already used by LureBeam
- No new dependencies required for HUD (pure CSS + existing hooks)

⚠️ **Architecture decisions:**
- **First-person view** — You see your trail, not your body
- **Mouse-look via PointerLockControls** — Click canvas to enable, ESC to release
- **Zustand stores tuples only** — No THREE.Vector3 in state (mutation bugs)
- **Deterministic layout** — Node positions seeded by ID hash (stable across reloads)
- **HUD as HTML overlay** — CSS animations for performance, R3F hooks for real-time data
- **HUD toggleable** — H key shows/hides, respects reduced motion preference

---

## Phase 1: Camera Rig Overhaul

**Objective:** Replace SporeRig's conflicting dual-layer system with clean first-person rig
**Verification:** WASD moves, mouse looks, no OrbitControls conflict

### Task 1.1: Create FirstPersonRig component

**Files:**
- Create: `site/src/components/atlas/FirstPersonRig.tsx`

**Implementation:**

```typescript
import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import * as THREE from 'three';
import { useAtlasStore } from '../../stores/atlasStore';

export function FirstPersonRig() {
  const { camera, gl } = useThree();
  const controlsRef = useRef<any>(null);

  // Read primitives from store, create vectors in render
  const velocity = useAtlasStore((s) => s.velocity);
  const updateVelocity = useAtlasStore((s) => s.updateVelocity);
  const setCameraPosition = useAtlasStore((s) => s.setCameraPosition);
  const hyperdrive = useAtlasStore((s) => s.hyperdrive);

  // Movement vectors (created once, reused)
  const moveVector = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    // Skip during hyperdrive travel
    if (hyperdrive.phase !== 'idle' && hyperdrive.phase !== 'orbiting') return;

    // Update velocity based on input
    updateVelocity(delta);

    // Get camera's forward and right vectors
    camera.getWorldDirection(direction.current);
    const right = new THREE.Vector3().crossVectors(direction.current, camera.up).normalize();

    // Apply velocity in camera-relative space
    moveVector.current.set(0, 0, 0);
    moveVector.current.addScaledVector(direction.current, -velocity[2] * delta); // forward/back
    moveVector.current.addScaledVector(right, velocity[0] * delta); // left/right
    moveVector.current.y += velocity[1] * delta; // up/down

    camera.position.add(moveVector.current);

    // Sync position to store for trail rendering
    setCameraPosition([camera.position.x, camera.position.y, camera.position.z]);
  });

  // Lock pointer on canvas click
  useEffect(() => {
    const handleClick = () => {
      if (controlsRef.current && hyperdrive.phase === 'idle') {
        controlsRef.current.lock();
      }
    };
    gl.domElement.addEventListener('click', handleClick);
    return () => gl.domElement.removeEventListener('click', handleClick);
  }, [gl, hyperdrive.phase]);

  return (
    <PointerLockControls
      ref={controlsRef}
      makeDefault
    />
  );
}
```

**Commit:**
```bash
git add site/src/components/atlas/FirstPersonRig.tsx
git commit -m "feat(atlas): create FirstPersonRig with mouse-look

- PointerLockControls for mouse-look (click to enable, ESC to release)
- Camera-relative movement (forward is where you look)
- Reads velocity tuples from store (no THREE.Vector3 in state)
- Syncs camera position back to store for trail

Replaces conflicting SporeRig dual-layer system.

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

### Task 1.2: Refactor atlasStore with correct state types

**Files:**
- Modify: `site/src/stores/atlasStore.ts`

**Key changes:**
1. Store velocity as `[number, number, number]` tuple, NOT THREE.Vector3
2. Add camera position for trail rendering
3. Add hyperdrive state with correct types
4. Use immer-style updates for nested state

```typescript
import { create } from 'zustand';

export interface AtlasNode {
  id: string;
  title: string;
  summary?: string;
  biome: string;
  stage: string;
  x: number;
  y: number;
  z: number;
}

export interface AtlasEdge {
  source: string;
  target: string;
}

export type HyperdrivePhase = 'idle' | 'locking' | 'charging' | 'traveling' | 'arriving' | 'orbiting';

export interface HyperdriveState {
  phase: HyperdrivePhase;
  targetNodeId: string | null;
  targetPosition: [number, number, number] | null;
  startPosition: [number, number, number] | null;
  progress: number;
}

interface AtlasState {
  // Graph
  nodes: AtlasNode[];
  edges: AtlasEdge[];

  // Selection
  hoveredNodeId: string | null;
  hoveredNodePos: [number, number, number] | null;
  selectedNodeId: string | null;
  focusedIndex: number;

  // Movement (tuples only, no THREE objects!)
  cameraPosition: [number, number, number];
  velocity: [number, number, number];
  targetVelocity: [number, number, number];
  moveDirection: { forward: number; right: number; up: number };
  isBoosting: boolean;

  // Hyperdrive
  hyperdrive: HyperdriveState;

  // Actions
  setGraph: (nodes: AtlasNode[], edges: AtlasEdge[]) => void;
  setHoveredNode: (id: string | null, pos?: [number, number, number] | null) => void;
  selectNode: (id: string | null) => void;
  focusNextNode: () => void;
  focusPrevNode: () => void;

  // Movement actions
  setCameraPosition: (pos: [number, number, number]) => void;
  setMoveDirection: (dir: { forward: number; right: number; up: number }) => void;
  setBoosting: (boosting: boolean) => void;
  updateVelocity: (delta: number) => void;

  // Hyperdrive actions
  initiateHyperdrive: (nodeId: string, nodePosition: [number, number, number], cameraPosition: [number, number, number]) => void;
  advanceHyperdrive: (phase: HyperdrivePhase, progress?: number) => void;
  cancelHyperdrive: () => void;
}

const MOVEMENT = {
  maxSpeed: 12,
  boostMultiplier: 2.5,
  acceleration: 40,  // units/sec²
  deceleration: 25,  // units/sec² (slower = drift feel)
};

export const useAtlasStore = create<AtlasState>((set, get) => ({
  // Initial state
  nodes: [],
  edges: [],
  hoveredNodeId: null,
  hoveredNodePos: null,
  selectedNodeId: null,
  focusedIndex: -1,

  cameraPosition: [0, 5, 20],
  velocity: [0, 0, 0],
  targetVelocity: [0, 0, 0],
  moveDirection: { forward: 0, right: 0, up: 0 },
  isBoosting: false,

  hyperdrive: {
    phase: 'idle',
    targetNodeId: null,
    targetPosition: null,
    startPosition: null,
    progress: 0,
  },

  // Graph actions
  setGraph: (nodes, edges) => set({ nodes, edges }),
  setHoveredNode: (id, pos) => set({ hoveredNodeId: id, hoveredNodePos: pos || null }),
  selectNode: (id) => set({ selectedNodeId: id }),

  focusNextNode: () => {
    const { nodes, focusedIndex } = get();
    if (nodes.length === 0) return;
    const nextIndex = (focusedIndex + 1) % nodes.length;
    const node = nodes[nextIndex];
    set({ focusedIndex: nextIndex, selectedNodeId: node.id });
  },

  focusPrevNode: () => {
    const { nodes, focusedIndex } = get();
    if (nodes.length === 0) return;
    const prevIndex = focusedIndex <= 0 ? nodes.length - 1 : focusedIndex - 1;
    const node = nodes[prevIndex];
    set({ focusedIndex: prevIndex, selectedNodeId: node.id });
  },

  // Movement actions
  setCameraPosition: (pos) => set({ cameraPosition: pos }),

  setMoveDirection: (dir) => set({ moveDirection: dir }),

  setBoosting: (boosting) => set({ isBoosting: boosting }),

  updateVelocity: (delta) => {
    const { moveDirection, isBoosting, velocity } = get();
    const speed = MOVEMENT.maxSpeed * (isBoosting ? MOVEMENT.boostMultiplier : 1);

    // Target velocity based on input
    const targetX = moveDirection.right * speed;
    const targetY = moveDirection.up * speed;
    const targetZ = moveDirection.forward * speed;

    // Smooth interpolation (acceleration when input, deceleration when none)
    const hasInput = moveDirection.forward !== 0 || moveDirection.right !== 0 || moveDirection.up !== 0;
    const rate = (hasInput ? MOVEMENT.acceleration : MOVEMENT.deceleration) * delta;

    const newVelocity: [number, number, number] = [
      velocity[0] + Math.sign(targetX - velocity[0]) * Math.min(Math.abs(targetX - velocity[0]), rate),
      velocity[1] + Math.sign(targetY - velocity[1]) * Math.min(Math.abs(targetY - velocity[1]), rate),
      velocity[2] + Math.sign(targetZ - velocity[2]) * Math.min(Math.abs(targetZ - velocity[2]), rate),
    ];

    set({ velocity: newVelocity });
  },

  // Hyperdrive actions
  initiateHyperdrive: (nodeId, nodePosition, cameraPosition) => {
    set({
      hyperdrive: {
        phase: 'locking',
        targetNodeId: nodeId,
        targetPosition: nodePosition,
        startPosition: cameraPosition,  // FIXED: Store actual camera position
        progress: 0,
      },
      selectedNodeId: nodeId,
    });
  },

  advanceHyperdrive: (phase, progress = 0) => {
    set((state) => ({
      hyperdrive: { ...state.hyperdrive, phase, progress },
    }));
  },

  cancelHyperdrive: () => {
    set({
      hyperdrive: {
        phase: 'idle',
        targetNodeId: null,
        targetPosition: null,
        startPosition: null,
        progress: 0,
      },
    });
  },
}));
```

**Commit:**
```bash
git add site/src/stores/atlasStore.ts
git commit -m "feat(atlas): refactor store with correct movement/hyperdrive state

CRITICAL FIXES:
- Store velocity as [number,number,number] tuple (not THREE.Vector3)
- initiateHyperdrive takes cameraPosition param (fixes start position bug)
- Slower deceleration (25 vs 40) for zero-g drift feel

Movement params: 12 base speed, 2.5x boost, smooth accel/decel

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

### Task 1.3: Create InputController for WASD + modifiers

**Files:**
- Create: `site/src/components/atlas/InputController.tsx`

```typescript
import { useEffect } from 'react';
import { useAtlasStore } from '../../stores/atlasStore';

export function InputController() {
  const setMoveDirection = useAtlasStore((s) => s.setMoveDirection);
  const setBoosting = useAtlasStore((s) => s.setBoosting);
  const hyperdrive = useAtlasStore((s) => s.hyperdrive);
  const cancelHyperdrive = useAtlasStore((s) => s.cancelHyperdrive);
  const focusNextNode = useAtlasStore((s) => s.focusNextNode);
  const focusPrevNode = useAtlasStore((s) => s.focusPrevNode);
  const selectedNodeId = useAtlasStore((s) => s.selectedNodeId);

  useEffect(() => {
    const keys = new Set<string>();

    const updateMovement = () => {
      // Disable movement during hyperdrive travel
      if (hyperdrive.phase !== 'idle') {
        setMoveDirection({ forward: 0, right: 0, up: 0 });
        return;
      }

      let forward = 0, right = 0, up = 0;

      if (keys.has('w') || keys.has('arrowup')) forward -= 1;    // W = forward (negative Z)
      if (keys.has('s') || keys.has('arrowdown')) forward += 1;  // S = backward
      if (keys.has('d') || keys.has('arrowright')) right += 1;   // D = right
      if (keys.has('a') || keys.has('arrowleft')) right -= 1;    // A = left
      if (keys.has(' ')) up += 1;                                 // Space = ascend
      if (keys.has('c') || keys.has('control')) up -= 1;         // C/Ctrl = descend

      setMoveDirection({ forward, right, up });
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      keys.add(key);

      // Boost on shift
      if (e.shiftKey) setBoosting(true);

      // ESC cancels hyperdrive
      if (e.key === 'Escape' && hyperdrive.phase !== 'idle') {
        cancelHyperdrive();
        return;
      }

      // J/K for node cycling (vim-style)
      if (key === 'j') {
        e.preventDefault();
        focusNextNode();
        return;
      }
      if (key === 'k') {
        e.preventDefault();
        focusPrevNode();
        return;
      }

      // Enter to navigate to selected node (keyboard fallback)
      if (e.key === 'Enter' && selectedNodeId && hyperdrive.phase === 'idle') {
        window.location.href = `/world/${selectedNodeId}`;
        return;
      }

      updateMovement();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys.delete(e.key.toLowerCase());
      if (!e.shiftKey) setBoosting(false);
      updateMovement();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [setMoveDirection, setBoosting, hyperdrive.phase, cancelHyperdrive, focusNextNode, focusPrevNode, selectedNodeId]);

  return null;
}
```

**Commit:**
```bash
git add site/src/components/atlas/InputController.tsx
git commit -m "feat(atlas): create unified InputController

Controls:
- WASD/Arrows: move relative to camera facing
- Space: ascend, C/Ctrl: descend
- Shift: boost (2.5x speed)
- J/K: cycle through nodes (vim-style)
- Enter: navigate to selected node
- ESC: cancel hyperdrive

Movement disabled during hyperdrive travel.

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Phase 2: Visitor Trail (First-Person Avatar)

**Objective:** Create trailing particles that prove you exist — the only "avatar" in first-person
**Verification:** Trail follows camera, fades over distance, visible when you look back

### Task 2.1: Create VisitorTrail component

**Files:**
- Create: `site/src/components/atlas/VisitorTrail.tsx`

```typescript
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Trail } from '@react-three/drei';
import * as THREE from 'three';
import { useAtlasStore } from '../../stores/atlasStore';

export function VisitorTrail() {
  const cameraPosition = useAtlasStore((s) => s.cameraPosition);
  const velocity = useAtlasStore((s) => s.velocity);
  const hyperdrive = useAtlasStore((s) => s.hyperdrive);

  const meshRef = useRef<THREE.Mesh>(null!);
  const trailColor = useMemo(() => new THREE.Color(0x88ddff), []);

  // Calculate speed for trail intensity
  const speed = Math.sqrt(velocity[0]**2 + velocity[1]**2 + velocity[2]**2);
  const isMoving = speed > 0.5;

  // Trail parameters based on state
  const trailWidth = hyperdrive.phase === 'traveling' ? 1.2 : (isMoving ? 0.4 : 0.15);
  const trailLength = hyperdrive.phase === 'traveling' ? 30 : (isMoving ? 12 : 5);

  // Position trail slightly behind camera (so it's visible when looking back)
  useFrame(({ camera }) => {
    if (!meshRef.current) return;
    const behind = new THREE.Vector3(0, 0, 2).applyQuaternion(camera.quaternion);
    meshRef.current.position.set(
      camera.position.x + behind.x,
      camera.position.y + behind.y - 0.5,  // slightly below eye level
      camera.position.z + behind.z
    );
  });

  return (
    <Trail
      width={trailWidth}
      length={trailLength}
      color={trailColor}
      attenuation={(t) => t * t * t}  // cubic falloff for ethereal look
      decay={1}
    >
      <mesh ref={meshRef}>
        {/* Tiny glowing core - almost invisible, just enough to anchor the trail */}
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshBasicMaterial
          color={trailColor}
          transparent
          opacity={isMoving ? 0.6 : 0.2}
        />
      </mesh>
    </Trail>
  );
}
```

**Commit:**
```bash
git add site/src/components/atlas/VisitorTrail.tsx
git commit -m "feat(atlas): create VisitorTrail (first-person avatar)

The trail IS your avatar in first-person:
- Tiny glowing core behind/below camera
- Trail width responds to speed (0.15 → 0.4 → 1.2 in hyperdrive)
- Cubic attenuation for ethereal fading
- Visible when you look back = proof you exist

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Phase 3: Hyperdrive System

**Objective:** Click node → ceremonial journey with visual/audio arc
**Verification:** Full sequence plays, camera follows curve, arrives at orbit distance

### Task 3.1: Create HyperdriveController with visual phases

**Files:**
- Create: `site/src/components/atlas/HyperdriveController.tsx`

```typescript
import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import * as Tone from 'tone';
import { useAtlasStore } from '../../stores/atlasStore';

const DURATIONS = {
  locking: 0.6,    // Turn to face target
  charging: 0.8,   // Energy buildup
  traveling: 0,    // Calculated from distance
  arriving: 0.5,   // Deceleration
  orbiting: 1.5,   // Circle once, then navigate
};

export function HyperdriveController() {
  const { camera } = useThree();
  const hyperdrive = useAtlasStore((s) => s.hyperdrive);
  const advanceHyperdrive = useAtlasStore((s) => s.advanceHyperdrive);
  const cancelHyperdrive = useAtlasStore((s) => s.cancelHyperdrive);

  const phaseTimer = useRef(0);
  const travelCurve = useRef<THREE.CatmullRomCurve3 | null>(null);
  const initialRotation = useRef<THREE.Quaternion>(new THREE.Quaternion());
  const targetRotation = useRef<THREE.Quaternion>(new THREE.Quaternion());

  // Audio refs
  const chargeOsc = useRef<Tone.Oscillator | null>(null);
  const travelSynth = useRef<Tone.Synth | null>(null);

  // Initialize audio
  useEffect(() => {
    chargeOsc.current = new Tone.Oscillator({
      type: 'sine',
      frequency: 80,
    }).toDestination();
    chargeOsc.current.volume.value = -30;

    travelSynth.current = new Tone.Synth({
      oscillator: { type: 'sawtooth' },
      envelope: { attack: 0.3, decay: 0.5, sustain: 0.4, release: 1.5 },
    }).toDestination();
    travelSynth.current.volume.value = -20;

    return () => {
      chargeOsc.current?.dispose();
      travelSynth.current?.dispose();
    };
  }, []);

  useFrame((state, delta) => {
    const { phase, targetPosition, startPosition, progress } = hyperdrive;

    if (phase === 'idle') {
      phaseTimer.current = 0;
      return;
    }

    phaseTimer.current += delta;

    switch (phase) {
      case 'locking': {
        // Smoothly rotate camera to face target
        if (phaseTimer.current < 0.01 && targetPosition) {
          initialRotation.current.copy(camera.quaternion);
          const lookAtMatrix = new THREE.Matrix4().lookAt(
            camera.position,
            new THREE.Vector3(...targetPosition),
            camera.up
          );
          targetRotation.current.setFromRotationMatrix(lookAtMatrix);
        }

        const lockProgress = Math.min(phaseTimer.current / DURATIONS.locking, 1);
        camera.quaternion.slerpQuaternions(
          initialRotation.current,
          targetRotation.current,
          easeOutCubic(lockProgress)
        );

        if (lockProgress >= 1) {
          phaseTimer.current = 0;
          advanceHyperdrive('charging', 0);
          chargeOsc.current?.start();
        }
        break;
      }

      case 'charging': {
        const chargeProgress = Math.min(phaseTimer.current / DURATIONS.charging, 1);
        advanceHyperdrive('charging', chargeProgress);

        // Rising pitch during charge
        if (chargeOsc.current) {
          chargeOsc.current.frequency.value = 80 + chargeProgress * 320;
          chargeOsc.current.volume.value = -30 + chargeProgress * 15;
        }

        // Camera shake
        const shake = chargeProgress * 0.03;
        camera.position.x += (Math.random() - 0.5) * shake;
        camera.position.y += (Math.random() - 0.5) * shake;

        if (chargeProgress >= 1) {
          chargeOsc.current?.stop();

          // Build travel curve
          if (startPosition && targetPosition) {
            const start = new THREE.Vector3(...startPosition);
            const end = new THREE.Vector3(...targetPosition);
            const distance = start.distanceTo(end);

            // Arc height proportional to distance
            const mid = start.clone().lerp(end, 0.5);
            mid.y += distance * 0.25;

            // Control points for smooth S-curve
            const cp1 = start.clone().lerp(mid, 0.5);
            cp1.y += distance * 0.15;
            const cp2 = mid.clone().lerp(end, 0.5);
            cp2.y += distance * 0.1;

            travelCurve.current = new THREE.CatmullRomCurve3([start, cp1, mid, cp2, end]);

            // Store travel duration based on distance
            DURATIONS.traveling = Math.max(1.5, distance / 15);
          }

          phaseTimer.current = 0;
          advanceHyperdrive('traveling', 0);
          travelSynth.current?.triggerAttack('C2');
        }
        break;
      }

      case 'traveling': {
        if (!travelCurve.current) break;

        const travelProgress = Math.min(phaseTimer.current / DURATIONS.traveling, 1);
        const easedProgress = easeInOutQuart(travelProgress);

        const point = travelCurve.current.getPoint(easedProgress);
        camera.position.copy(point);

        // Look along the curve tangent
        const tangent = travelCurve.current.getTangent(easedProgress);
        camera.lookAt(camera.position.clone().add(tangent));

        advanceHyperdrive('traveling', travelProgress);

        // Pitch rises during travel
        if (travelSynth.current) {
          const freq = 65 + travelProgress * 130;
          travelSynth.current.frequency.value = freq;
        }

        if (travelProgress >= 1) {
          travelSynth.current?.triggerRelease();
          phaseTimer.current = 0;
          advanceHyperdrive('arriving', 0);
        }
        break;
      }

      case 'arriving': {
        const arriveProgress = Math.min(phaseTimer.current / DURATIONS.arriving, 1);
        advanceHyperdrive('arriving', arriveProgress);

        if (arriveProgress >= 1) {
          phaseTimer.current = 0;
          advanceHyperdrive('orbiting', 0);
        }
        break;
      }

      case 'orbiting': {
        if (!targetPosition) break;

        const orbitProgress = phaseTimer.current / DURATIONS.orbiting;
        const angle = orbitProgress * Math.PI * 2;
        const orbitRadius = 5;

        const target = new THREE.Vector3(...targetPosition);
        camera.position.set(
          target.x + Math.cos(angle) * orbitRadius,
          target.y + Math.sin(angle * 0.3) * 1.5 + 1,
          target.z + Math.sin(angle) * orbitRadius
        );
        camera.lookAt(target);

        advanceHyperdrive('orbiting', orbitProgress);

        if (orbitProgress >= 1) {
          // Navigate to world
          const nodeId = hyperdrive.targetNodeId;
          cancelHyperdrive();
          if (nodeId) {
            window.location.href = `/world/${nodeId}`;
          }
        }
        break;
      }
    }
  });

  return null;
}

// Easing functions
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function easeInOutQuart(t: number): number {
  return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
}
```

**Commit:**
```bash
git add site/src/components/atlas/HyperdriveController.tsx
git commit -m "feat(atlas): create HyperdriveController with full ceremony

Phases:
1. Locking (0.6s): Smooth camera rotation to face target
2. Charging (0.8s): Rising pitch (80→400Hz), camera shake
3. Traveling (variable): S-curve arc, tangent-aligned camera
4. Arriving (0.5s): Deceleration
5. Orbiting (1.5s): Circle world once, then navigate

Audio: Sine oscillator for charge, sawtooth synth for travel
Easing: Cubic out for lock, quartic in-out for travel

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

### Task 3.2: Update NodeArtifact to initiate hyperdrive correctly

**Files:**
- Read first: `site/src/components/atlas/NodeArtifact.tsx`
- Modify: `site/src/components/atlas/NodeArtifact.tsx`

**Change:** Click handler must pass camera position (not read velocity)

```typescript
// In handleClick:
const handleClick = () => {
  const store = useAtlasStore.getState();
  const cameraPos = store.cameraPosition;
  store.selectNode(nodeId);
  store.initiateHyperdrive(nodeId, position, cameraPos);
};
```

**Commit:**
```bash
git add site/src/components/atlas/NodeArtifact.tsx
git commit -m "fix(atlas): pass camera position to initiateHyperdrive

Fixes bug where travelStartPos was storing velocity instead of position.
Now correctly reads cameraPosition from store.

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Phase 4: Deterministic Biome Layout

**Objective:** Replace random layout with seeded, stable positions
**Verification:** Same node = same position across page reloads

### Task 4.1: Create biome layout with seeded randomness

**Files:**
- Create: `site/src/lib/atlas/biomeLayout.ts`

```typescript
import type { AtlasNode } from '../../stores/atlasStore';

// Simple hash function for deterministic seeding
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

// Seeded random number generator
function seededRandom(seed: number): () => number {
  return () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
}

interface BiomeConfig {
  center: [number, number, number];
  radius: number;
  verticalSpread: number;
}

const BIOME_CONFIGS: Record<string, BiomeConfig> = {
  threshold: { center: [0, 2, 8], radius: 6, verticalSpread: 2 },
  lore: { center: [-12, 0, -5], radius: 10, verticalSpread: 4 },
  creation: { center: [14, -2, -10], radius: 12, verticalSpread: 5 },
  play: { center: [8, 6, -15], radius: 9, verticalSpread: 4 },
  reflection: { center: [-10, -1, -20], radius: 11, verticalSpread: 3 },
  deep: { center: [0, -10, -35], radius: 14, verticalSpread: 6 },
};

export function computeBiomeLayout(nodes: AtlasNode[]): AtlasNode[] {
  return nodes.map((node) => {
    const config = BIOME_CONFIGS[node.biome] || BIOME_CONFIGS.threshold;

    // Seed from node ID for deterministic placement
    const seed = hashString(node.id);
    const random = seededRandom(seed);

    // Distribute within biome cluster
    const angle = random() * Math.PI * 2;
    const distance = random() * config.radius;
    const heightOffset = (random() - 0.5) * config.verticalSpread;

    const x = config.center[0] + Math.cos(angle) * distance;
    const y = config.center[1] + heightOffset;
    const z = config.center[2] + Math.sin(angle) * distance;

    return { ...node, x, y, z };
  });
}

// Utility to get biome center for camera starting position
export function getBiomeCenter(biome: string): [number, number, number] {
  return BIOME_CONFIGS[biome]?.center || BIOME_CONFIGS.threshold.center;
}
```

**Commit:**
```bash
git add site/src/lib/atlas/biomeLayout.ts
git commit -m "feat(atlas): deterministic biome layout with seeded positions

Biome clusters:
- Threshold: front/center (entry point) [0, 2, 8]
- Lore: left mid-distance [-12, 0, -5]
- Creation: right mid-distance [14, -2, -10]
- Play: upper right [8, 6, -15]
- Reflection: left far [-10, -1, -20]
- Deep: center far bottom [0, -10, -35]

Node positions seeded from ID hash = stable across reloads.

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Phase 5: Scene Integration

**Objective:** Wire everything together in MyceliumScene
**Verification:** Full navigation works: move, look, hyperdrive, arrive

### Task 5.1: Refactor MyceliumScene with new components

**Files:**
- Modify: `site/src/components/atlas/MyceliumScene.tsx`

**Changes:**
1. Replace SporeRig with FirstPersonRig
2. Add InputController
3. Add VisitorTrail
4. Add HyperdriveController
5. Use computeBiomeLayout instead of computeLayout

```typescript
import { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { FirstPersonRig } from './FirstPersonRig';
import { InputController } from './InputController';
import { VisitorTrail } from './VisitorTrail';
import { HyperdriveController } from './HyperdriveController';
import { NodeArtifact } from './NodeArtifact';
import { VeinFlow } from './VeinFlow';
import { VoidMatrixParticles } from './VoidMatrixParticles';
import { LureBeam } from './LureBeam';
import { useAtlasStore } from '../../stores/atlasStore';
import { computeBiomeLayout } from '../../lib/atlas/biomeLayout';

interface GraphData {
  nodes: Array<{ id: string; title: string; summary?: string; biome: string; stage: string }>;
  edges: Array<{ source: string; target: string }>;
}

interface MyceliumSceneProps {
  graphData: GraphData;
}

export function MyceliumScene({ graphData }: MyceliumSceneProps) {
  const setGraph = useAtlasStore((s) => s.setGraph);
  const nodes = useAtlasStore((s) => s.nodes);
  const edges = useAtlasStore((s) => s.edges);

  // Compute deterministic layout on mount
  useEffect(() => {
    if (graphData.nodes.length > 0) {
      const positioned = computeBiomeLayout(graphData.nodes);
      setGraph(positioned, graphData.edges);
    }
  }, [graphData, setGraph]);

  return (
    <div style={{ position: 'fixed', inset: 0, cursor: 'crosshair' }}>
      <Canvas camera={{ position: [0, 5, 20], fov: 70 }}>
        {/* Navigation */}
        <FirstPersonRig />
        <HyperdriveController />
        <VisitorTrail />

        {/* Environment */}
        <VoidMatrixParticles count={64} />
        <LureBeam />
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#6bc5ff" />

        {/* Nodes */}
        {nodes.map((node) => (
          <NodeArtifact
            key={node.id}
            nodeId={node.id}
            title={node.title}
            summary={node.summary}
            position={[node.x, node.y, node.z]}
            biome={node.biome}
          />
        ))}

        {/* Connections */}
        {edges.map((edge) => {
          const source = nodes.find((n) => n.id === edge.source);
          const target = nodes.find((n) => n.id === edge.target);
          if (!source || !target) return null;
          return (
            <VeinFlow
              key={`${edge.source}-${edge.target}`}
              start={[source.x, source.y, source.z]}
              end={[target.x, target.y, target.z]}
            />
          );
        })}
      </Canvas>

      {/* Input handling outside canvas */}
      <InputController />

      {/* Instructions overlay */}
      <div style={{
        position: 'fixed',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(0,0,0,0.6)',
        color: '#88ddff',
        padding: '12px 24px',
        borderRadius: 8,
        fontFamily: 'monospace',
        fontSize: 13,
        textAlign: 'center',
        pointerEvents: 'none',
        backdropFilter: 'blur(8px)',
      }}>
        <div style={{ marginBottom: 4 }}>Click to look • WASD to move • Shift to boost</div>
        <div style={{ opacity: 0.7 }}>Click a world to journey there</div>
      </div>
    </div>
  );
}
```

**Commit:**
```bash
git add site/src/components/atlas/MyceliumScene.tsx
git commit -m "feat(atlas): integrate embodied navigation into scene

- Replace SporeRig with FirstPersonRig (mouse-look)
- Add InputController (WASD + modifiers)
- Add VisitorTrail (first-person avatar)
- Add HyperdriveController (ceremonial journeys)
- Use deterministic biomeLayout
- Add instruction overlay

Full embodied navigation now operational.

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

### Task 5.2: Delete obsolete SporeRig

**Files:**
- Delete: `site/src/components/atlas/SporeRig.tsx`

**Commit:**
```bash
git rm site/src/components/atlas/SporeRig.tsx
git commit -m "chore(atlas): remove obsolete SporeRig

Replaced by FirstPersonRig with cleaner architecture.
No more OrbitControls + custom camera conflict.

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Phase 6: Sci-Fi Viewport HUD

**Objective:** Create an immersive first-person HUD inspired by No Man's Sky and Elite Dangerous
**Verification:** All HUD elements visible, responsive to state, non-intrusive during exploration

**Design Philosophy:**
- **Elite Dangerous**: Holographic cockpit feel, target lock brackets, detailed status readouts
- **No Man's Sky**: Minimalist scanning, discovery popups, compass waypoints
- **The Irreal**: Organic/mycelial curves, breathing animations, cyan glow aesthetic

**HUD Elements:**
1. **Reticle** - Central crosshair that responds to hover/target
2. **Compass Ring** - Top-center heading with biome markers
3. **Velocity Orb** - Bottom-left speed visualization
4. **Target Lock Brackets** - Animate around looked-at nodes
5. **Hyperdrive Status Panel** - Phase indicator with charge bar
6. **Proximity Scanner** - Radar-style node map
7. **Biome Indicator** - Current biome name and depth

---

### Task 6.1: Create HUD container and base styles

**Files:**
- Create: `site/src/components/atlas/hud/AtlasHUD.tsx`
- Create: `site/src/components/atlas/hud/hud.css`

**AtlasHUD.tsx:**
```typescript
import { useAtlasStore } from '../../../stores/atlasStore';
import { Reticle } from './Reticle';
import { CompassRing } from './CompassRing';
import { VelocityOrb } from './VelocityOrb';
import { HyperdrivePanel } from './HyperdrivePanel';
import { ProximityScanner } from './ProximityScanner';
import { BiomeIndicator } from './BiomeIndicator';
import './hud.css';

export function AtlasHUD() {
  const hyperdrive = useAtlasStore((s) => s.hyperdrive);
  const isHyperdriving = hyperdrive.phase !== 'idle';

  return (
    <div className={`atlas-hud ${isHyperdriving ? 'hud--hyperdrive' : ''}`}>
      {/* Center */}
      <Reticle />

      {/* Top */}
      <CompassRing />

      {/* Bottom-left */}
      <VelocityOrb />

      {/* Bottom-right */}
      <HyperdrivePanel />

      {/* Top-right */}
      <ProximityScanner />

      {/* Top-left */}
      <BiomeIndicator />
    </div>
  );
}
```

**hud.css:**
```css
/* Base HUD Container */
.atlas-hud {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 100;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  color: var(--hud-color);

  /* HUD color palette */
  --hud-color: #88ddff;
  --hud-color-dim: rgba(136, 221, 255, 0.4);
  --hud-color-bright: #aaeeff;
  --hud-glow: 0 0 10px rgba(136, 221, 255, 0.5);
  --hud-bg: rgba(0, 8, 16, 0.6);

  /* Animation timing */
  --breathe-duration: 3s;
  --pulse-duration: 1.5s;
}

/* Hyperdrive mode intensifies colors */
.hud--hyperdrive {
  --hud-color: #ffdd88;
  --hud-color-dim: rgba(255, 221, 136, 0.4);
  --hud-color-bright: #ffeebb;
  --hud-glow: 0 0 20px rgba(255, 221, 136, 0.7);
}

/* Shared panel styling */
.hud-panel {
  background: var(--hud-bg);
  border: 1px solid var(--hud-color-dim);
  border-radius: 8px;
  backdrop-filter: blur(8px);
  padding: 12px 16px;
  box-shadow: var(--hud-glow);
}

/* Breathing animation */
@keyframes hud-breathe {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
}

/* Pulse animation */
@keyframes hud-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

/* Scan line effect */
@keyframes hud-scanline {
  0% { background-position: 0 0; }
  100% { background-position: 0 100%; }
}

.hud-scanlines {
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(136, 221, 255, 0.03) 2px,
    rgba(136, 221, 255, 0.03) 4px
  );
  animation: hud-scanline 8s linear infinite;
}
```

**Commit:**
```bash
git add site/src/components/atlas/hud/
git commit -m "feat(atlas): create HUD container with base styles

Elite Dangerous + No Man's Sky inspired HUD system:
- CSS custom properties for color theming
- Hyperdrive mode color shift (cyan → amber)
- Breathing and pulse animations
- Scanline overlay effect
- Backdrop blur glass panels

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

### Task 6.2: Create Reticle component

**Files:**
- Create: `site/src/components/atlas/hud/Reticle.tsx`

```typescript
import { useAtlasStore } from '../../../stores/atlasStore';

export function Reticle() {
  const hoveredNodeId = useAtlasStore((s) => s.hoveredNodeId);
  const hyperdrive = useAtlasStore((s) => s.hyperdrive);

  const isTargeting = hoveredNodeId !== null;
  const isLocking = hyperdrive.phase === 'locking';
  const isCharging = hyperdrive.phase === 'charging';

  return (
    <div className="reticle">
      {/* Center dot */}
      <div className={`reticle__dot ${isTargeting ? 'reticle__dot--target' : ''}`} />

      {/* Outer ring - expands when targeting */}
      <div className={`reticle__ring ${isTargeting ? 'reticle__ring--expand' : ''}`}>
        <svg viewBox="0 0 100 100" width="60" height="60">
          <circle
            cx="50" cy="50" r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray={isTargeting ? "10 5" : "2 8"}
            className="reticle__circle"
          />
        </svg>
      </div>

      {/* Lock brackets - appear during locking phase */}
      {(isLocking || isCharging) && (
        <div className="reticle__brackets">
          <span className="reticle__bracket reticle__bracket--tl">┌</span>
          <span className="reticle__bracket reticle__bracket--tr">┐</span>
          <span className="reticle__bracket reticle__bracket--bl">└</span>
          <span className="reticle__bracket reticle__bracket--br">┘</span>
        </div>
      )}

      {/* Charge progress ring */}
      {isCharging && (
        <svg className="reticle__charge" viewBox="0 0 100 100" width="80" height="80">
          <circle
            cx="50" cy="50" r="40"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray={`${hyperdrive.progress * 251} 251`}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
          />
        </svg>
      )}
    </div>
  );
}
```

**CSS (add to hud.css):**
```css
/* Reticle */
.reticle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.reticle__dot {
  width: 4px;
  height: 4px;
  background: var(--hud-color);
  border-radius: 50%;
  box-shadow: var(--hud-glow);
  transition: all 0.2s ease;
}

.reticle__dot--target {
  width: 8px;
  height: 8px;
  background: var(--hud-color-bright);
}

.reticle__ring {
  position: absolute;
  transition: all 0.3s ease;
  opacity: 0.6;
}

.reticle__ring--expand {
  transform: scale(1.3);
  opacity: 1;
}

.reticle__circle {
  animation: hud-breathe var(--breathe-duration) ease-in-out infinite;
}

.reticle__brackets {
  position: absolute;
  width: 100px;
  height: 100px;
  font-size: 24px;
  animation: reticle-lock 0.6s ease-out forwards;
}

@keyframes reticle-lock {
  from { transform: scale(1.5); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.reticle__bracket {
  position: absolute;
  color: var(--hud-color-bright);
  text-shadow: var(--hud-glow);
}

.reticle__bracket--tl { top: 0; left: 0; }
.reticle__bracket--tr { top: 0; right: 0; }
.reticle__bracket--bl { bottom: 0; left: 0; }
.reticle__bracket--br { bottom: 0; right: 0; }

.reticle__charge {
  position: absolute;
  color: var(--hud-color-bright);
  filter: drop-shadow(var(--hud-glow));
}
```

**Commit:**
```bash
git add site/src/components/atlas/hud/Reticle.tsx
git commit -m "feat(atlas): create Reticle HUD component

Elite Dangerous-style targeting reticle:
- Center dot expands on node hover
- Dashed ring breathes and expands when targeting
- Lock brackets animate in during locking phase
- Charge progress ring fills during charging

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

### Task 6.3: Create CompassRing component

**Files:**
- Create: `site/src/components/atlas/hud/CompassRing.tsx`

```typescript
import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useAtlasStore } from '../../../stores/atlasStore';
import { getBiomeCenter } from '../../../lib/atlas/biomeLayout';

const BIOMES = ['threshold', 'lore', 'creation', 'play', 'reflection', 'deep'];

export function CompassRing() {
  const { camera } = useThree();
  const headingRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const selectedNodeId = useAtlasStore((s) => s.selectedNodeId);
  const nodes = useAtlasStore((s) => s.nodes);

  // Update compass heading on each frame
  useFrame(() => {
    if (!headingRef.current) return;

    // Get camera's Y rotation in degrees
    const euler = new THREE.Euler().setFromQuaternion(camera.quaternion, 'YXZ');
    const heading = THREE.MathUtils.radToDeg(-euler.y);
    const normalizedHeading = ((heading % 360) + 360) % 360;

    // Update heading display
    headingRef.current.textContent = `${Math.round(normalizedHeading)}°`;

    // Update biome markers
    BIOMES.forEach(biome => {
      const marker = markersRef.current.get(biome);
      if (!marker) return;

      const biomeCenter = getBiomeCenter(biome);
      const toTarget = new THREE.Vector3(
        biomeCenter[0] - camera.position.x,
        0,
        biomeCenter[2] - camera.position.z
      );

      // Calculate angle to biome
      const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
      forward.y = 0;
      forward.normalize();

      const angle = Math.atan2(
        forward.x * toTarget.z - forward.z * toTarget.x,
        forward.x * toTarget.x + forward.z * toTarget.z
      );
      const angleDeg = THREE.MathUtils.radToDeg(angle);

      // Position marker on compass (only show if within ±60° of center)
      if (Math.abs(angleDeg) < 60) {
        marker.style.display = 'block';
        marker.style.left = `${50 + angleDeg}%`;
        marker.style.opacity = `${1 - Math.abs(angleDeg) / 60}`;
      } else {
        marker.style.display = 'none';
      }
    });
  });

  return (
    <div className="compass-ring">
      <div className="compass-ring__track">
        {/* Cardinal directions */}
        <div className="compass-ring__cardinal compass-ring__cardinal--n">N</div>

        {/* Biome markers */}
        {BIOMES.map(biome => (
          <div
            key={biome}
            ref={el => el && markersRef.current.set(biome, el)}
            className={`compass-ring__marker compass-ring__marker--${biome}`}
          >
            <span className="compass-ring__marker-icon">◆</span>
            <span className="compass-ring__marker-label">{biome[0].toUpperCase()}</span>
          </div>
        ))}

        {/* Center heading */}
        <div className="compass-ring__heading" ref={headingRef}>0°</div>

        {/* Center notch */}
        <div className="compass-ring__notch">▼</div>
      </div>
    </div>
  );
}
```

**CSS (add to hud.css):**
```css
/* Compass Ring */
.compass-ring {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 400px;
}

.compass-ring__track {
  position: relative;
  height: 40px;
  background: var(--hud-bg);
  border: 1px solid var(--hud-color-dim);
  border-radius: 20px;
  overflow: hidden;
}

.compass-ring__heading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 14px;
  font-weight: bold;
  color: var(--hud-color-bright);
  text-shadow: var(--hud-glow);
}

.compass-ring__notch {
  position: absolute;
  top: 2px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  color: var(--hud-color-bright);
}

.compass-ring__marker {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 10px;
  transition: opacity 0.1s ease;
}

.compass-ring__marker-icon {
  font-size: 8px;
  color: var(--hud-color);
}

.compass-ring__marker-label {
  font-size: 9px;
  color: var(--hud-color-dim);
}

/* Biome marker colors */
.compass-ring__marker--threshold .compass-ring__marker-icon { color: #88ff88; }
.compass-ring__marker--lore .compass-ring__marker-icon { color: #ffaa88; }
.compass-ring__marker--creation .compass-ring__marker-icon { color: #ff88ff; }
.compass-ring__marker--play .compass-ring__marker-icon { color: #ffff88; }
.compass-ring__marker--reflection .compass-ring__marker-icon { color: #88ffff; }
.compass-ring__marker--deep .compass-ring__marker-icon { color: #8888ff; }
```

**Commit:**
```bash
git add site/src/components/atlas/hud/CompassRing.tsx
git commit -m "feat(atlas): create CompassRing HUD component

No Man's Sky-style compass with biome waypoints:
- Real-time heading display in degrees
- Biome markers positioned by angle from camera
- Markers fade as they approach edge of view
- Color-coded biome diamonds (T L C P R D)

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

### Task 6.4: Create VelocityOrb component

**Files:**
- Create: `site/src/components/atlas/hud/VelocityOrb.tsx`

```typescript
import { useAtlasStore } from '../../../stores/atlasStore';

export function VelocityOrb() {
  const velocity = useAtlasStore((s) => s.velocity);
  const isBoosting = useAtlasStore((s) => s.isBoosting);

  const speed = Math.sqrt(velocity[0]**2 + velocity[1]**2 + velocity[2]**2);
  const maxSpeed = isBoosting ? 30 : 12;
  const speedPercent = Math.min(speed / maxSpeed * 100, 100);

  // Velocity vector visualization (normalized)
  const vx = speed > 0.1 ? (velocity[0] / speed) * 15 : 0;
  const vy = speed > 0.1 ? (-velocity[1] / speed) * 15 : 0; // Invert Y for screen coords

  return (
    <div className="velocity-orb">
      <div className="velocity-orb__label">DRIFT</div>

      {/* Outer ring with speed fill */}
      <svg className="velocity-orb__ring" viewBox="0 0 100 100" width="80" height="80">
        {/* Background ring */}
        <circle
          cx="50" cy="50" r="40"
          fill="none"
          stroke="var(--hud-color-dim)"
          strokeWidth="2"
        />
        {/* Speed fill */}
        <circle
          cx="50" cy="50" r="40"
          fill="none"
          stroke={isBoosting ? 'var(--hud-color-bright)' : 'var(--hud-color)'}
          strokeWidth="3"
          strokeDasharray={`${speedPercent * 2.51} 251`}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
          style={{ transition: 'stroke-dasharray 0.1s ease' }}
        />
        {/* Cross-hairs */}
        <line x1="50" y1="10" x2="50" y2="20" stroke="var(--hud-color-dim)" strokeWidth="1" />
        <line x1="50" y1="80" x2="50" y2="90" stroke="var(--hud-color-dim)" strokeWidth="1" />
        <line x1="10" y1="50" x2="20" y2="50" stroke="var(--hud-color-dim)" strokeWidth="1" />
        <line x1="80" y1="50" x2="90" y2="50" stroke="var(--hud-color-dim)" strokeWidth="1" />
      </svg>

      {/* Center velocity indicator */}
      <div
        className="velocity-orb__indicator"
        style={{
          transform: `translate(${vx}px, ${vy}px)`,
          opacity: speed > 0.1 ? 1 : 0.3,
        }}
      />

      {/* Speed readout */}
      <div className="velocity-orb__speed">
        {speed.toFixed(1)}
        {isBoosting && <span className="velocity-orb__boost">▲</span>}
      </div>
    </div>
  );
}
```

**CSS (add to hud.css):**
```css
/* Velocity Orb */
.velocity-orb {
  position: absolute;
  bottom: 30px;
  left: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.velocity-orb__label {
  font-size: 10px;
  color: var(--hud-color-dim);
  margin-bottom: 4px;
  letter-spacing: 2px;
}

.velocity-orb__ring {
  filter: drop-shadow(var(--hud-glow));
}

.velocity-orb__indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 8px;
  height: 8px;
  background: var(--hud-color-bright);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: transform 0.1s ease, opacity 0.2s ease;
  box-shadow: var(--hud-glow);
}

.velocity-orb__speed {
  margin-top: 8px;
  font-size: 14px;
  color: var(--hud-color);
}

.velocity-orb__boost {
  color: var(--hud-color-bright);
  margin-left: 4px;
  animation: hud-pulse var(--pulse-duration) ease-in-out infinite;
}
```

**Commit:**
```bash
git add site/src/components/atlas/hud/VelocityOrb.tsx
git commit -m "feat(atlas): create VelocityOrb HUD component

Elite Dangerous-style drift indicator:
- Circular ring fills with current speed
- Center dot shows velocity direction
- Numeric speed readout
- Boost indicator pulses when active
- Smooth transitions for all values

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

### Task 6.5: Create HyperdrivePanel component

**Files:**
- Create: `site/src/components/atlas/hud/HyperdrivePanel.tsx`

```typescript
import { useAtlasStore } from '../../../stores/atlasStore';

const PHASE_LABELS: Record<string, string> = {
  idle: 'READY',
  locking: 'LOCKING TARGET',
  charging: 'CHARGING DRIVE',
  traveling: 'IN TRANSIT',
  arriving: 'DECELERATING',
  orbiting: 'ENTERING ORBIT',
};

const PHASE_ICONS: Record<string, string> = {
  idle: '◇',
  locking: '◈',
  charging: '◆',
  traveling: '»',
  arriving: '«',
  orbiting: '○',
};

export function HyperdrivePanel() {
  const hyperdrive = useAtlasStore((s) => s.hyperdrive);
  const nodes = useAtlasStore((s) => s.nodes);

  const targetNode = hyperdrive.targetNodeId
    ? nodes.find(n => n.id === hyperdrive.targetNodeId)
    : null;

  const isActive = hyperdrive.phase !== 'idle';

  return (
    <div className={`hyperdrive-panel hud-panel ${isActive ? 'hyperdrive-panel--active' : ''}`}>
      <div className="hyperdrive-panel__header">
        <span className="hyperdrive-panel__icon">{PHASE_ICONS[hyperdrive.phase]}</span>
        <span className="hyperdrive-panel__label">HYPERDRIVE</span>
      </div>

      <div className="hyperdrive-panel__status">
        {PHASE_LABELS[hyperdrive.phase]}
      </div>

      {/* Progress bar */}
      {isActive && (
        <div className="hyperdrive-panel__progress">
          <div
            className="hyperdrive-panel__progress-fill"
            style={{ width: `${hyperdrive.progress * 100}%` }}
          />
        </div>
      )}

      {/* Target info */}
      {targetNode && (
        <div className="hyperdrive-panel__target">
          <div className="hyperdrive-panel__target-label">DESTINATION</div>
          <div className="hyperdrive-panel__target-name">{targetNode.title}</div>
          <div className="hyperdrive-panel__target-biome">{targetNode.biome.toUpperCase()}</div>
        </div>
      )}

      {/* Idle hint */}
      {!isActive && (
        <div className="hyperdrive-panel__hint">
          Click world to engage
        </div>
      )}
    </div>
  );
}
```

**CSS (add to hud.css):**
```css
/* Hyperdrive Panel */
.hyperdrive-panel {
  position: absolute;
  bottom: 30px;
  right: 30px;
  width: 180px;
  transition: all 0.3s ease;
}

.hyperdrive-panel--active {
  border-color: var(--hud-color-bright);
  box-shadow: 0 0 20px rgba(136, 221, 255, 0.4);
}

.hyperdrive-panel__header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: var(--hud-color-dim);
  letter-spacing: 2px;
  margin-bottom: 8px;
}

.hyperdrive-panel__icon {
  font-size: 14px;
  color: var(--hud-color);
}

.hyperdrive-panel--active .hyperdrive-panel__icon {
  color: var(--hud-color-bright);
  animation: hud-pulse var(--pulse-duration) ease-in-out infinite;
}

.hyperdrive-panel__status {
  font-size: 13px;
  font-weight: bold;
  color: var(--hud-color);
  margin-bottom: 8px;
}

.hyperdrive-panel--active .hyperdrive-panel__status {
  color: var(--hud-color-bright);
}

.hyperdrive-panel__progress {
  height: 4px;
  background: var(--hud-color-dim);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 12px;
}

.hyperdrive-panel__progress-fill {
  height: 100%;
  background: var(--hud-color-bright);
  transition: width 0.1s ease;
  box-shadow: var(--hud-glow);
}

.hyperdrive-panel__target {
  border-top: 1px solid var(--hud-color-dim);
  padding-top: 8px;
}

.hyperdrive-panel__target-label {
  font-size: 9px;
  color: var(--hud-color-dim);
  letter-spacing: 1px;
  margin-bottom: 4px;
}

.hyperdrive-panel__target-name {
  font-size: 12px;
  color: var(--hud-color-bright);
  margin-bottom: 2px;
}

.hyperdrive-panel__target-biome {
  font-size: 10px;
  color: var(--hud-color-dim);
}

.hyperdrive-panel__hint {
  font-size: 10px;
  color: var(--hud-color-dim);
  font-style: italic;
}
```

**Commit:**
```bash
git add site/src/components/atlas/hud/HyperdrivePanel.tsx
git commit -m "feat(atlas): create HyperdrivePanel HUD component

Elite Dangerous-style FSD panel:
- Phase icon and status label
- Progress bar during active phases
- Target destination name and biome
- Glowing border when active
- Idle state shows engagement hint

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

### Task 6.6: Create ProximityScanner component

**Files:**
- Create: `site/src/components/atlas/hud/ProximityScanner.tsx`

```typescript
import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useAtlasStore } from '../../../stores/atlasStore';

const SCAN_RADIUS = 50; // Units in 3D space
const DISPLAY_RADIUS = 50; // Pixels

export function ProximityScanner() {
  const { camera } = useThree();
  const dotsRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const nodes = useAtlasStore((s) => s.nodes);
  const selectedNodeId = useAtlasStore((s) => s.selectedNodeId);

  useFrame(() => {
    const camPos = camera.position;
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);

    nodes.forEach(node => {
      const dot = dotsRef.current.get(node.id);
      if (!dot) return;

      // Vector from camera to node
      const toNode = new THREE.Vector3(
        node.x - camPos.x,
        0, // Flatten to 2D
        node.z - camPos.z
      );

      const distance = toNode.length();

      if (distance > SCAN_RADIUS) {
        dot.style.display = 'none';
        return;
      }

      // Project onto camera's XZ plane
      const dotX = toNode.dot(right);
      const dotZ = -toNode.dot(forward);

      // Scale to display
      const displayX = (dotX / SCAN_RADIUS) * DISPLAY_RADIUS;
      const displayZ = (dotZ / SCAN_RADIUS) * DISPLAY_RADIUS;

      dot.style.display = 'block';
      dot.style.left = `${50 + displayX}px`;
      dot.style.top = `${50 + displayZ}px`;

      // Fade with distance
      dot.style.opacity = `${1 - distance / SCAN_RADIUS}`;

      // Highlight selected
      if (node.id === selectedNodeId) {
        dot.classList.add('scanner__dot--selected');
      } else {
        dot.classList.remove('scanner__dot--selected');
      }
    });
  });

  return (
    <div className="scanner hud-panel">
      <div className="scanner__label">PROXIMITY</div>
      <div className="scanner__display">
        {/* Rings */}
        <div className="scanner__ring scanner__ring--inner" />
        <div className="scanner__ring scanner__ring--outer" />

        {/* Center (you) */}
        <div className="scanner__center" />

        {/* Sweep line */}
        <div className="scanner__sweep" />

        {/* Node dots */}
        {nodes.map(node => (
          <div
            key={node.id}
            ref={el => el && dotsRef.current.set(node.id, el)}
            className={`scanner__dot scanner__dot--${node.biome}`}
          />
        ))}
      </div>
    </div>
  );
}
```

**CSS (add to hud.css):**
```css
/* Proximity Scanner */
.scanner {
  position: absolute;
  top: 30px;
  right: 30px;
  width: 120px;
}

.scanner__label {
  font-size: 10px;
  color: var(--hud-color-dim);
  letter-spacing: 2px;
  margin-bottom: 8px;
  text-align: center;
}

.scanner__display {
  position: relative;
  width: 100px;
  height: 100px;
  margin: 0 auto;
  border-radius: 50%;
  background: rgba(0, 20, 40, 0.8);
  overflow: hidden;
}

.scanner__ring {
  position: absolute;
  border: 1px solid var(--hud-color-dim);
  border-radius: 50%;
}

.scanner__ring--inner {
  top: 25%;
  left: 25%;
  width: 50%;
  height: 50%;
}

.scanner__ring--outer {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.scanner__center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 6px;
  height: 6px;
  background: var(--hud-color-bright);
  border-radius: 50%;
  box-shadow: var(--hud-glow);
}

.scanner__sweep {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 50%;
  height: 2px;
  background: linear-gradient(90deg, var(--hud-color-bright), transparent);
  transform-origin: left center;
  animation: scanner-sweep 4s linear infinite;
}

@keyframes scanner-sweep {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.scanner__dot {
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: opacity 0.2s ease;
}

.scanner__dot--selected {
  width: 8px;
  height: 8px;
  box-shadow: 0 0 8px currentColor;
}

/* Biome colors */
.scanner__dot--threshold { background: #88ff88; }
.scanner__dot--lore { background: #ffaa88; }
.scanner__dot--creation { background: #ff88ff; }
.scanner__dot--play { background: #ffff88; }
.scanner__dot--reflection { background: #88ffff; }
.scanner__dot--deep { background: #8888ff; }
```

**Commit:**
```bash
git add site/src/components/atlas/hud/ProximityScanner.tsx
git commit -m "feat(atlas): create ProximityScanner HUD component

No Man's Sky-style radar scanner:
- Circular display with concentric rings
- Rotating sweep line animation
- Nodes shown as color-coded dots
- Dots fade with distance
- Selected node highlighted
- Real-time position updates

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

### Task 6.7: Create BiomeIndicator component

**Files:**
- Create: `site/src/components/atlas/hud/BiomeIndicator.tsx`

```typescript
import { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { getBiomeCenter } from '../../../lib/atlas/biomeLayout';

const BIOMES = ['threshold', 'lore', 'creation', 'play', 'reflection', 'deep'] as const;

const BIOME_INFO: Record<string, { name: string; depth: number; color: string }> = {
  threshold: { name: 'The Threshold', depth: 1, color: '#88ff88' },
  lore: { name: 'Lore Archives', depth: 2, color: '#ffaa88' },
  creation: { name: 'Creation Grounds', depth: 2, color: '#ff88ff' },
  play: { name: 'Play Fields', depth: 3, color: '#ffff88' },
  reflection: { name: 'Reflection Pools', depth: 3, color: '#88ffff' },
  deep: { name: 'The Deep', depth: 4, color: '#8888ff' },
};

export function BiomeIndicator() {
  const { camera } = useThree();
  const [currentBiome, setCurrentBiome] = useState('threshold');
  const [distance, setDistance] = useState(0);

  useFrame(() => {
    const camPos = camera.position;

    // Find closest biome
    let closestBiome = 'threshold';
    let closestDist = Infinity;

    BIOMES.forEach(biome => {
      const center = getBiomeCenter(biome);
      const dist = Math.sqrt(
        (camPos.x - center[0]) ** 2 +
        (camPos.y - center[1]) ** 2 +
        (camPos.z - center[2]) ** 2
      );
      if (dist < closestDist) {
        closestDist = dist;
        closestBiome = biome;
      }
    });

    setCurrentBiome(closestBiome);
    setDistance(closestDist);
  });

  const biome = BIOME_INFO[currentBiome];
  const depthBars = Array(4).fill(0).map((_, i) => i < biome.depth);

  return (
    <div className="biome-indicator hud-panel">
      <div className="biome-indicator__label">REGION</div>

      <div
        className="biome-indicator__name"
        style={{ color: biome.color }}
      >
        {biome.name}
      </div>

      <div className="biome-indicator__depth">
        <span className="biome-indicator__depth-label">DEPTH</span>
        <div className="biome-indicator__depth-bars">
          {depthBars.map((active, i) => (
            <div
              key={i}
              className={`biome-indicator__bar ${active ? 'biome-indicator__bar--active' : ''}`}
              style={active ? { background: biome.color } : {}}
            />
          ))}
        </div>
      </div>

      <div className="biome-indicator__distance">
        {distance.toFixed(0)}u from center
      </div>
    </div>
  );
}
```

**CSS (add to hud.css):**
```css
/* Biome Indicator */
.biome-indicator {
  position: absolute;
  top: 30px;
  left: 30px;
  width: 150px;
}

.biome-indicator__label {
  font-size: 10px;
  color: var(--hud-color-dim);
  letter-spacing: 2px;
  margin-bottom: 8px;
}

.biome-indicator__name {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 12px;
  text-shadow: var(--hud-glow);
}

.biome-indicator__depth {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.biome-indicator__depth-label {
  font-size: 9px;
  color: var(--hud-color-dim);
}

.biome-indicator__depth-bars {
  display: flex;
  gap: 3px;
}

.biome-indicator__bar {
  width: 12px;
  height: 6px;
  background: var(--hud-color-dim);
  border-radius: 2px;
  transition: background 0.3s ease;
}

.biome-indicator__bar--active {
  box-shadow: 0 0 6px currentColor;
}

.biome-indicator__distance {
  font-size: 10px;
  color: var(--hud-color-dim);
}
```

**Commit:**
```bash
git add site/src/components/atlas/hud/BiomeIndicator.tsx
git commit -m "feat(atlas): create BiomeIndicator HUD component

Location awareness display:
- Current biome name (color-coded)
- Depth indicator bars (1-4)
- Distance from biome center
- Real-time updates as you move
- Smooth color transitions

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

### Task 6.8: Integrate HUD into MyceliumScene

**Files:**
- Modify: `site/src/components/atlas/MyceliumScene.tsx`

**Changes:**
1. Import and add AtlasHUD component
2. Wrap compass/scanner in R3F context provider for useFrame access

```typescript
// Add import
import { AtlasHUD } from './hud/AtlasHUD';

// In return, add HUD before the instructions overlay:
      {/* HUD Overlay */}
      <AtlasHUD />

      {/* Instructions overlay - now part of HUD aesthetic */}
```

**Create HUD context bridge for R3F hooks:**

```typescript
// site/src/components/atlas/hud/HUDCanvas.tsx
import { Canvas } from '@react-three/fiber';
import { CompassRing } from './CompassRing';
import { ProximityScanner } from './ProximityScanner';
import { BiomeIndicator } from './BiomeIndicator';

// Invisible canvas just for useFrame hooks in HUD components
export function HUDCanvas() {
  return (
    <div style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden' }}>
      <Canvas>
        <CompassRing />
        <ProximityScanner />
        <BiomeIndicator />
      </Canvas>
    </div>
  );
}
```

**Note:** Alternatively, use Zustand subscriptions + requestAnimationFrame instead of useFrame for HUD updates. This avoids needing a second Canvas.

**Commit:**
```bash
git add site/src/components/atlas/MyceliumScene.tsx site/src/components/atlas/hud/
git commit -m "feat(atlas): integrate HUD into MyceliumScene

Full sci-fi viewport now active:
- Reticle with target lock brackets
- Compass ring with biome waypoints
- Velocity orb showing drift
- Hyperdrive status panel
- Proximity scanner radar
- Biome/region indicator

The cosmos is now instrumented.

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

### Task 6.9: Add HUD toggle and instructions update

**Files:**
- Modify: `site/src/stores/atlasStore.ts` (add hudVisible state)
- Modify: `site/src/components/atlas/hud/AtlasHUD.tsx`
- Modify: `site/src/components/atlas/InputController.tsx`

**Store addition:**
```typescript
// Add to state
hudVisible: boolean;

// Add action
toggleHUD: () => void;

// Implementation
hudVisible: true,
toggleHUD: () => set((s) => ({ hudVisible: !s.hudVisible })),
```

**InputController addition:**
```typescript
// H key toggles HUD
if (key === 'h') {
  e.preventDefault();
  useAtlasStore.getState().toggleHUD();
  return;
}
```

**AtlasHUD wrapper:**
```typescript
const hudVisible = useAtlasStore((s) => s.hudVisible);

if (!hudVisible) return null;
```

**Updated instructions overlay:**
```typescript
<div className="hud-instructions">
  <div>Click to look • WASD to move • Shift to boost</div>
  <div>Click world to journey • H to toggle HUD</div>
</div>
```

**Commit:**
```bash
git add site/src/stores/atlasStore.ts site/src/components/atlas/hud/ site/src/components/atlas/InputController.tsx
git commit -m "feat(atlas): add HUD toggle with H key

- H key toggles entire HUD visibility
- Store tracks hudVisible state
- Instructions updated with HUD toggle hint
- Clean experience when HUD is hidden

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Phase 7: Polish & Verification

### Task 7.1: Add reduced motion support

**Files:**
- Create: `site/src/hooks/usePrefersReducedMotion.ts`
- Modify: `site/src/components/atlas/HyperdriveController.tsx`
- Modify: `site/src/components/atlas/VisitorTrail.tsx`
- Modify: `site/src/components/atlas/hud/hud.css`

```typescript
// usePrefersReducedMotion.ts
import { useEffect, useState } from 'react';

export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(query.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    query.addEventListener('change', handler);
    return () => query.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
}
```

**Changes in HyperdriveController:**
```typescript
const reducedMotion = usePrefersReducedMotion();
const durations = reducedMotion ? {
  locking: 0.2,
  charging: 0.3,
  traveling: 0.8,
  arriving: 0.2,
  orbiting: 0.5,
} : DURATIONS;
```

**CSS reduced motion (add to hud.css):**
```css
@media (prefers-reduced-motion: reduce) {
  .scanner__sweep,
  .reticle__circle,
  .velocity-orb__boost {
    animation: none;
  }

  .atlas-hud * {
    transition-duration: 0.1s !important;
  }
}
```

**Commit:**
```bash
git add site/src/hooks/usePrefersReducedMotion.ts site/src/components/atlas/HyperdriveController.tsx site/src/components/atlas/VisitorTrail.tsx site/src/components/atlas/hud/hud.css
git commit -m "feat(atlas): add reduced motion accessibility

- Detect prefers-reduced-motion media query
- Faster hyperdrive durations (60% reduction)
- Shorter trail when reduced motion enabled
- Disable HUD animations when reduced motion
- Shorten all transition durations

Accessibility is non-negotiable.

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

### Task 7.2: Final testing and verification

**Verification checklist:**

1. **Movement:**
   - [ ] WASD moves relative to camera facing
   - [ ] Mouse-look works (click canvas to enable)
   - [ ] Shift boosts speed
   - [ ] Space ascends, C descends
   - [ ] Movement has slight drift when keys released (zero-g feel)

2. **Trail:**
   - [ ] Trail visible when looking back
   - [ ] Trail lengthens with speed
   - [ ] Trail fades naturally

3. **Hyperdrive:**
   - [ ] Click node initiates sequence
   - [ ] Camera rotates to face target (locking)
   - [ ] Shake + rising audio (charging)
   - [ ] S-curve flight path (traveling)
   - [ ] Orbits destination once
   - [ ] Navigates to world page
   - [ ] ESC cancels at any point

4. **Layout:**
   - [ ] Threshold worlds closest
   - [ ] Deep worlds farthest
   - [ ] Same positions on page reload

5. **HUD System:**
   - [ ] Reticle expands when hovering nodes
   - [ ] Lock brackets appear during locking phase
   - [ ] Charge ring fills during charging
   - [ ] Compass shows heading and biome markers
   - [ ] Velocity orb shows speed and direction
   - [ ] Hyperdrive panel shows phase and target
   - [ ] Scanner shows nearby nodes as dots
   - [ ] Biome indicator updates as you move
   - [ ] H key toggles HUD visibility
   - [ ] HUD colors shift to amber during hyperdrive

6. **Accessibility:**
   - [ ] Reduced motion mode works
   - [ ] HUD animations disabled with reduced motion
   - [ ] Keyboard-only navigation works (J/K/Enter)

**Run:**
```bash
cd site && npm run dev
```

**Visit:** `http://localhost:4321/atlas`

**Final commit:**
```bash
git add -A
git commit -m "feat(atlas): complete embodied navigation with sci-fi viewport

PHASE 1: First-person camera rig with mouse-look
PHASE 2: Visitor trail as first-person avatar
PHASE 3: Ceremonial hyperdrive with audio
PHASE 4: Deterministic biome layout
PHASE 5: Full scene integration
PHASE 6: Sci-fi viewport HUD (Elite Dangerous + No Man's Sky)
PHASE 7: Accessibility polish

The transformation is complete:
- You don't VIEW the mycelium. You MOVE THROUGH it.
- You don't CLICK nodes. You JOURNEY to them.
- The trail behind you is proof you exist.
- Your instruments tell you where you are in the cosmos.

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Critical Files Summary

| File | Purpose |
|------|---------|
| `FirstPersonRig.tsx` | Mouse-look + camera-relative movement |
| `InputController.tsx` | WASD + modifiers + ESC + H handling |
| `VisitorTrail.tsx` | First-person avatar (trailing particles) |
| `HyperdriveController.tsx` | Ceremonial journey orchestration |
| `biomeLayout.ts` | Deterministic spatial clustering |
| `atlasStore.ts` | Movement + hyperdrive + HUD state (tuples only) |
| `MyceliumScene.tsx` | Scene integration |
| `usePrefersReducedMotion.ts` | Accessibility hook |
| **HUD Components** | |
| `hud/AtlasHUD.tsx` | HUD container and visibility control |
| `hud/hud.css` | Shared HUD styles and animations |
| `hud/Reticle.tsx` | Central crosshair with target lock |
| `hud/CompassRing.tsx` | Heading display with biome markers |
| `hud/VelocityOrb.tsx` | Speed and drift visualization |
| `hud/HyperdrivePanel.tsx` | Phase status and destination info |
| `hud/ProximityScanner.tsx` | Radar-style node map |
| `hud/BiomeIndicator.tsx` | Current region and depth display |

---

## Post-Implementation

**Update SESSION-STATE.md:**

```markdown
### Claude's Last Session (Opus 4.5)
- **Date**: 2026-01-26 (embodied navigation + sci-fi viewport)
- **Work done**:
  - Reviewed and revised Sonnet's plan with critical bug fixes
  - Phase 1: First-person rig (replaced conflicting SporeRig)
  - Phase 2: Visitor trail as avatar (first-person paradigm)
  - Phase 3: Hyperdrive with audio and proper camera rotation
  - Phase 4: Deterministic biome layout (seeded from node ID)
  - Phase 5: Full scene integration
  - Phase 6: Sci-fi viewport HUD (Elite Dangerous + No Man's Sky)
  - Phase 7: Accessibility polish
- **Key fixes from Sonnet's plan**:
  - Store velocity as tuple, not THREE.Vector3 (mutation bug)
  - Pass cameraPosition to initiateHyperdrive (start position bug)
  - Use ref for camera sync, not setState in useFrame (performance)
  - Add mouse-look via PointerLockControls (embodiment gap)
  - Seeded random for stable node positions (UX)
- **HUD System** (new):
  - Reticle with target lock brackets
  - Compass ring with biome waypoints
  - Velocity orb showing drift direction
  - Hyperdrive status panel
  - Proximity scanner radar
  - Biome/region indicator
- **Philosophy**: First-person embodiment. You ARE the visitor. Trail = proof of existence. HUD = cosmic instrumentation.
```

---

## The Philosophy (Revised)

**Before:** Disembodied camera observing abstract nodes.
**After:** First-person visitor moving through living cosmos, with instruments.

**Before:** You can see a sphere representing "you" from... nowhere?
**After:** You see only what's ahead. Your trail fades behind you. You know you exist because of where you've been.

**Before:** Click = instant teleport.
**After:** Click = ceremonial journey. Lock. Charge. Travel. Arrive. The intention becomes the experience.

**Before:** Random scatter every reload.
**After:** The cosmos remembers where things are. Same node = same position.

**Before:** No sense of where you are in the cosmos.
**After:** Your HUD tells you: compass heading, nearby worlds, current biome, depth into the mycelium.

**You don't VIEW the mycelium. You MOVE THROUGH it.**
**You don't CLICK nodes. You JOURNEY to them.**
**Your trail is the only proof you exist.**
**Your instruments tell you where you are.**

---

## The HUD Philosophy

Inspired by **Elite Dangerous** and **No Man's Sky**, but organic to The Irreal:

| Element | Elite Dangerous | No Man's Sky | The Irreal |
|---------|-----------------|--------------|------------|
| Targeting | Hard brackets, red hostiles | Soft scanning | Breathing brackets, cyan glow |
| Compass | Pitch/roll/heading | Waypoint markers | Biome diamonds, heading degrees |
| Speed | Numeric thrust indicator | Pulse engine bar | Velocity orb with drift direction |
| Radar | Detailed ship scanner | Discovery ping | Proximity dots, sweep line |
| Status | Power distribution | Ship diagnostics | Hyperdrive phase, destination |
| Location | System/body info | Planet/region name | Biome name, depth indicator |

**Color philosophy:**
- **Cyan (#88ddff)** — Default, calm exploration
- **Amber (#ffdd88)** — Hyperdrive active, heightened state

**Animation philosophy:**
- **Breathing** — Slow, organic pulse (3s cycle)
- **Pulse** — Alert state (1.5s cycle)
- **Sweep** — Scanner rotation (4s cycle)
- All animations disable with `prefers-reduced-motion`

---

*This plan delivers the full Elite Dangerous / No Man's Sky experience requested: first-person embodiment with comprehensive cockpit instrumentation. You're not just moving through the cosmos — you're piloting a vessel, reading your instruments, charting a course through the mycelium.*
