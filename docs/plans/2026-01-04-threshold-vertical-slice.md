# Threshold Vertical Slice Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the complete 5-stage Threshold crossing ritual that produces "I've never experienced anything like this on the web."

**Architecture:** State machine (Zustand) drives stage progression. Each stage triggers visual changes (Three.js/R3F particles, text, portals) and audio changes (Tone.js 40Hz drone ramping up). The camera is INSIDE a sphere of particles — you're surrounded by the void, not looking at it. Mouse movement during Attunement stage causes particles to respond to your presence.

**Tech Stack:** Astro 5 | React 19 | Three.js + R3F + Drei | Tone.js | Zustand | GSAP

**Source of Truth:** `docs/plans/2026-01-03-irreal-complete-vision.md`

---

## Stage Timing Reference

| Stage | Duration | Key Event |
|-------|----------|-----------|
| detection | 0.5s | Detect preferences, prepare audio context |
| void | 2s | Particles emerge from nothing, 40Hz drone fades in |
| attunement | 2s | Particles sync to mouse, drone rises 40→55Hz |
| crystallization | 2s | "The Irreal" forms from particles, drone 55→80Hz |
| portals | ∞ | Two portals materialize, wait for user choice |
| crossing | 1.2s | Selected portal expands to fill screen |

---

## Task 1: Install Dependencies

**Files:**
- Modify: `/Users/dea/claude-test/The-Irreal/.worktrees/enhanced-threshold/site/package.json`

**Step 1: Install 3D stack**

```bash
cd /Users/dea/claude-test/The-Irreal/.worktrees/enhanced-threshold/site
npm install three @react-three/fiber @react-three/drei
npm install -D @types/three
```

**Expected:** Packages added to package.json

**Step 2: Install audio + state**

```bash
npm install tone zustand
```

**Expected:** tone and zustand in dependencies

**Step 3: Update Vite config for Three.js SSR**

Modify `/Users/dea/claude-test/The-Irreal/.worktrees/enhanced-threshold/site/astro.config.mjs`:

```javascript
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [
    mdx(),
    react()
  ],
  site: 'https://the-irreal.world',
  vite: {
    optimizeDeps: {
      exclude: ['@resvg/resvg-js']
    },
    ssr: {
      noExternal: ['three', '@react-three/fiber', '@react-three/drei']
    }
  }
});
```

**Step 4: Commit**

```bash
git add package.json package-lock.json astro.config.mjs
git commit -m "feat(threshold): add Three.js, Tone.js, Zustand dependencies"
```

---

## Task 2: Create Threshold State Store

**Files:**
- Create: `/Users/dea/claude-test/The-Irreal/.worktrees/enhanced-threshold/site/src/stores/thresholdStore.ts`

**Step 1: Create stores directory and state machine**

```typescript
import { create } from 'zustand';

export type ThresholdStage =
  | 'detection'
  | 'void'
  | 'attunement'
  | 'crystallization'
  | 'portals'
  | 'crossing';

interface ThresholdState {
  // Stage
  stage: ThresholdStage;
  stageStartTime: number;

  // User input
  mousePosition: { x: number; y: number };
  mouseVelocity: number;

  // Preferences (detected in detection stage)
  prefersReducedMotion: boolean;
  audioEnabled: boolean;

  // Portal selection
  selectedPortal: 'atlas' | 'grove' | null;

  // Actions
  setStage: (stage: ThresholdStage) => void;
  setMousePosition: (x: number, y: number) => void;
  setMouseVelocity: (velocity: number) => void;
  setPrefersReducedMotion: (prefers: boolean) => void;
  setAudioEnabled: (enabled: boolean) => void;
  selectPortal: (portal: 'atlas' | 'grove') => void;
  reset: () => void;
}

const initialState = {
  stage: 'detection' as ThresholdStage,
  stageStartTime: Date.now(),
  mousePosition: { x: 0, y: 0 },
  mouseVelocity: 0,
  prefersReducedMotion: false,
  audioEnabled: true,
  selectedPortal: null,
};

export const useThresholdStore = create<ThresholdState>((set) => ({
  ...initialState,

  setStage: (stage) => set({ stage, stageStartTime: Date.now() }),

  setMousePosition: (x, y) => set({ mousePosition: { x, y } }),

  setMouseVelocity: (velocity) => set({ mouseVelocity: velocity }),

  setPrefersReducedMotion: (prefers) => set({ prefersReducedMotion: prefers }),

  setAudioEnabled: (enabled) => set({ audioEnabled: enabled }),

  selectPortal: (portal) => set({ selectedPortal: portal, stage: 'crossing' }),

  reset: () => set(initialState),
}));
```

**Step 2: Verify TypeScript compiles**

```bash
cd /Users/dea/claude-test/The-Irreal/.worktrees/enhanced-threshold/site
npx tsc --noEmit src/stores/thresholdStore.ts
```

**Expected:** No errors

**Step 3: Commit**

```bash
git add src/stores/thresholdStore.ts
git commit -m "feat(threshold): add Zustand state machine for stages"
```

---

## Task 3: Create Audio Engine

**Files:**
- Create: `/Users/dea/claude-test/The-Irreal/.worktrees/enhanced-threshold/site/src/lib/audio/ThresholdAudio.ts`

**Step 1: Create lib/audio directory and engine**

```typescript
import * as Tone from 'tone';

/**
 * ThresholdAudio
 *
 * Generative audio for the Threshold crossing ritual.
 * - Sub-bass drone (40Hz base, rises through stages)
 * - Filter opens with mouse velocity
 * - Long reverb for spatial depth
 */
class ThresholdAudioEngine {
  private initialized = false;
  private started = false;

  // Audio nodes
  private drone: Tone.Oscillator | null = null;
  private filter: Tone.Filter | null = null;
  private reverb: Tone.Reverb | null = null;
  private gain: Tone.Gain | null = null;

  // Stage frequencies (Hz)
  private readonly stageFrequencies = {
    detection: 0,      // Silent
    void: 40,          // Sub-bass, felt more than heard
    attunement: 55,    // Rising
    crystallization: 80,
    portals: 110,      // A2, warm
    crossing: 110,
  };

  async init(): Promise<void> {
    if (this.initialized) return;

    // Create audio chain: Oscillator → Filter → Reverb → Gain → Destination
    this.drone = new Tone.Oscillator({
      type: 'sine',
      frequency: 40,
    });

    this.filter = new Tone.Filter({
      type: 'lowpass',
      frequency: 200,
      rolloff: -24,
    });

    this.reverb = new Tone.Reverb({
      decay: 8,
      wet: 0.6,
    });
    await this.reverb.generate();

    this.gain = new Tone.Gain(0);

    // Chain
    this.drone.connect(this.filter);
    this.filter.connect(this.reverb);
    this.reverb.connect(this.gain);
    this.gain.toDestination();

    this.initialized = true;
  }

  async start(): Promise<void> {
    if (!this.initialized) await this.init();
    if (this.started) return;

    await Tone.start();
    this.drone?.start();
    this.started = true;
  }

  stop(): void {
    this.drone?.stop();
    this.started = false;
  }

  setStage(stage: keyof typeof this.stageFrequencies): void {
    if (!this.drone || !this.gain) return;

    const targetFreq = this.stageFrequencies[stage];
    const targetGain = stage === 'detection' ? 0 : 0.3;

    // Smooth ramp over 1 second
    this.drone.frequency.rampTo(targetFreq, 1);
    this.gain.gain.rampTo(targetGain, 1);
  }

  setMouseVelocity(velocity: number): void {
    if (!this.filter) return;

    // Map velocity (0-1) to filter cutoff (200-2000 Hz)
    const cutoff = 200 + velocity * 1800;
    this.filter.frequency.rampTo(cutoff, 0.1);
  }

  setVolume(volume: number): void {
    if (!this.gain) return;
    this.gain.gain.rampTo(volume * 0.3, 0.5);
  }

  mute(): void {
    this.gain?.gain.rampTo(0, 0.5);
  }

  unmute(): void {
    this.gain?.gain.rampTo(0.3, 0.5);
  }

  dispose(): void {
    this.drone?.dispose();
    this.filter?.dispose();
    this.reverb?.dispose();
    this.gain?.dispose();
    this.initialized = false;
    this.started = false;
  }
}

// Singleton
export const thresholdAudio = new ThresholdAudioEngine();
```

**Step 2: Commit**

```bash
mkdir -p src/lib/audio
git add src/lib/audio/ThresholdAudio.ts
git commit -m "feat(threshold): add Tone.js audio engine with sub-bass drone"
```

---

## Task 4: Create 3D Void Particles

**Files:**
- Create: `/Users/dea/claude-test/The-Irreal/.worktrees/enhanced-threshold/site/src/components/threshold/VoidParticles.tsx`

**Step 1: Create particle system component**

```tsx
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useThresholdStore } from '../../stores/thresholdStore';

interface VoidParticlesProps {
  count?: number;
  radius?: number;
}

export function VoidParticles({ count = 2000, radius = 50 }: VoidParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const { stage, mouseVelocity } = useThresholdStore();

  // Generate initial positions in a sphere around origin (camera will be at origin)
  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Spherical distribution
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius * (0.3 + Math.random() * 0.7); // 30-100% of radius

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      // Random drift velocities
      vel[i * 3] = (Math.random() - 0.5) * 0.02;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }

    return [pos, vel];
  }, [count, radius]);

  // Breathing animation (60 BPM = 1 Hz)
  const breathPhase = useRef(0);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;

    // Breathing: expand/contract at 60 BPM
    breathPhase.current += delta * Math.PI * 2; // Full cycle per second at 60 BPM
    const breathScale = 1 + Math.sin(breathPhase.current) * 0.03; // 3% scale variation

    // Velocity multiplier based on mouse (attunement stage)
    const velocityMult = stage === 'attunement' ? 1 + mouseVelocity * 3 : 1;

    // Opacity based on stage
    const opacity = stage === 'detection' ? 0 :
                    stage === 'void' ? Math.min((Date.now() - useThresholdStore.getState().stageStartTime) / 2000, 1) * 0.6 :
                    0.6;

    // Update particle positions
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Apply velocity
      positions[i3] += velocities[i3] * velocityMult;
      positions[i3 + 1] += velocities[i3 + 1] * velocityMult;
      positions[i3 + 2] += velocities[i3 + 2] * velocityMult;

      // Apply breathing
      const dist = Math.sqrt(
        positions[i3] ** 2 +
        positions[i3 + 1] ** 2 +
        positions[i3 + 2] ** 2
      );

      if (dist > 0) {
        const targetDist = dist * breathScale;
        const scale = targetDist / dist;
        positions[i3] *= scale;
        positions[i3 + 1] *= scale;
        positions[i3 + 2] *= scale;
      }

      // Wrap particles that drift too far
      const maxDist = radius * 1.2;
      if (dist > maxDist) {
        const newR = radius * 0.5;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        positions[i3] = newR * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = newR * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = newR * Math.cos(phi);
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    // Update material opacity
    const material = pointsRef.current.material as THREE.PointsMaterial;
    material.opacity = opacity;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.5}
        color="#7c6fe0"
        transparent
        opacity={0}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/threshold/VoidParticles.tsx
git commit -m "feat(threshold): add 3D void particles with breathing animation"
```

---

## Task 5: Create Void Scene Canvas

**Files:**
- Create: `/Users/dea/claude-test/The-Irreal/.worktrees/enhanced-threshold/site/src/components/threshold/VoidScene.tsx`

**Step 1: Create the R3F canvas wrapper**

```tsx
import { Canvas } from '@react-three/fiber';
import { VoidParticles } from './VoidParticles';
import { useThresholdStore } from '../../stores/thresholdStore';

export function VoidScene() {
  const prefersReducedMotion = useThresholdStore((s) => s.prefersReducedMotion);

  // Reduced motion fallback
  if (prefersReducedMotion) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'radial-gradient(ellipse at center, #1a1a24 0%, #0a0a0f 70%)',
          zIndex: 0,
        }}
      />
    );
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 0], fov: 75 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: '#0a0a0f' }}
      >
        {/* Ambient light for subtle particle illumination */}
        <ambientLight intensity={0.2} color="#7c6fe0" />

        {/* Particles surround the camera */}
        <VoidParticles count={2000} radius={50} />
      </Canvas>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/threshold/VoidScene.tsx
git commit -m "feat(threshold): add R3F void scene with camera inside particles"
```

---

## Task 6: Create Crystallizing Text

**Files:**
- Create: `/Users/dea/claude-test/The-Irreal/.worktrees/enhanced-threshold/site/src/components/threshold/CrystallizingText.tsx`

**Step 1: Create text component with GSAP animation**

```tsx
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useThresholdStore } from '../../stores/thresholdStore';

export function CrystallizingText() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stage = useThresholdStore((s) => s.stage);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (stage !== 'crystallization' || hasAnimated.current) return;
    if (!containerRef.current) return;

    hasAnimated.current = true;

    const title = containerRef.current.querySelector('.title');
    const subtitle = containerRef.current.querySelector('.subtitle');

    // Timeline: emerge from blur/scale, crystallize into clarity
    const tl = gsap.timeline();

    tl.fromTo(title,
      {
        opacity: 0,
        scale: 0.8,
        filter: 'blur(30px)',
        letterSpacing: '0.5em'
      },
      {
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        letterSpacing: '0.2em',
        duration: 2,
        ease: 'power2.out'
      }
    )
    .fromTo(subtitle,
      {
        opacity: 0,
        y: 20
      },
      {
        opacity: 0.7,
        y: 0,
        duration: 1,
        ease: 'power2.out'
      },
      '-=0.8'
    );
  }, [stage]);

  // Only render during crystallization and beyond
  const visible = ['crystallization', 'portals', 'crossing'].includes(stage);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: '35%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        zIndex: 10,
        opacity: visible ? 1 : 0,
        pointerEvents: 'none',
      }}
    >
      <h1
        className="title"
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(2.5rem, 8vw, 5rem)',
          fontWeight: 300,
          letterSpacing: '0.2em',
          marginBottom: '1rem',
          background: 'linear-gradient(135deg, #7c6fe0 0%, #9d8fff 50%, #7c6fe0 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textShadow: '0 0 60px rgba(124, 111, 224, 0.5)',
          opacity: 0,
        }}
      >
        The Irreal
      </h1>
      <p
        className="subtitle"
        style={{
          fontFamily: "'EB Garamond', serif",
          fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
          fontWeight: 400,
          fontStyle: 'italic',
          color: '#8888a0',
          opacity: 0,
        }}
      >
        A navigable world of knowledge, creation, and becoming
      </p>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/threshold/CrystallizingText.tsx
git commit -m "feat(threshold): add crystallizing text with GSAP blur animation"
```

---

## Task 7: Create Portal Components

**Files:**
- Create: `/Users/dea/claude-test/The-Irreal/.worktrees/enhanced-threshold/site/src/components/threshold/Portal.tsx`
- Create: `/Users/dea/claude-test/The-Irreal/.worktrees/enhanced-threshold/site/src/components/threshold/PortalLayer.tsx`

**Step 1: Create Portal component**

```tsx
import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface PortalProps {
  position: [number, number, number];
  color: string;
  glowColor: string;
  label: string;
  hint: string;
  onClick: () => void;
}

export function Portal({ position, color, glowColor, label, hint, onClick }: PortalProps) {
  const groupRef = useRef<THREE.Group>(null);
  const torusRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Breathing animation
  const breathPhase = useRef(Math.random() * Math.PI * 2);

  useFrame((state, delta) => {
    if (!torusRef.current) return;

    // Breathing pulse (slightly different rate than particles)
    breathPhase.current += delta * Math.PI * 1.5; // 45 BPM
    const breathScale = 1 + Math.sin(breathPhase.current) * 0.05;

    // Apply scale
    const targetScale = hovered ? 1.15 : breathScale;
    torusRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.1
    );

    // Rotate slowly
    torusRef.current.rotation.z += delta * 0.1;
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Portal ring */}
      <mesh
        ref={torusRef}
        onClick={onClick}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <torusGeometry args={[1.5, 0.08, 16, 64]} />
        <meshStandardMaterial
          color={color}
          emissive={glowColor}
          emissiveIntensity={hovered ? 2 : 0.8}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Inner glow */}
      <mesh>
        <circleGeometry args={[1.4, 32]} />
        <meshBasicMaterial
          color={glowColor}
          transparent
          opacity={hovered ? 0.3 : 0.15}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Label */}
      <Text
        position={[0, -2.2, 0]}
        fontSize={0.35}
        color="#e0e0e8"
        anchorX="center"
        anchorY="middle"
        font="/fonts/CormorantGaramond-Light.ttf"
      >
        {label}
      </Text>

      {/* Hint */}
      <Text
        position={[0, -2.7, 0]}
        fontSize={0.2}
        color="#8888a0"
        anchorX="center"
        anchorY="middle"
        font="/fonts/EBGaramond-Regular.ttf"
      >
        {hint}
      </Text>
    </group>
  );
}
```

**Step 2: Create PortalLayer component**

```tsx
import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Portal } from './Portal';
import { useThresholdStore } from '../../stores/thresholdStore';

export function PortalLayer() {
  const stage = useThresholdStore((s) => s.stage);
  const selectPortal = useThresholdStore((s) => s.selectPortal);
  const [visible, setVisible] = useState(false);

  // Fade in portals when entering 'portals' stage
  useEffect(() => {
    if (stage === 'portals') {
      const timer = setTimeout(() => setVisible(true), 500);
      return () => clearTimeout(timer);
    } else if (stage === 'crossing') {
      // Keep visible during crossing
    } else {
      setVisible(false);
    }
  }, [stage]);

  if (!visible && stage !== 'crossing') return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 5,
        opacity: visible ? 1 : 0,
        transition: 'opacity 1s ease',
        pointerEvents: stage === 'portals' ? 'auto' : 'none',
      }}
    >
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[0, 0, 5]} intensity={1} color="#7c6fe0" />

        {/* Atlas Portal - Left */}
        <Portal
          position={[-4, 0, 0]}
          color="#7c6fe0"
          glowColor="#9d8fff"
          label="Mycelium Atlas"
          hint="Navigate the network"
          onClick={() => selectPortal('atlas')}
        />

        {/* Grove Portal - Right */}
        <Portal
          position={[4, 0, 0]}
          color="#4a9d6a"
          glowColor="#6bc59a"
          label="The Grove"
          hint="All worlds, listed"
          onClick={() => selectPortal('grove')}
        />
      </Canvas>
    </div>
  );
}
```

**Step 3: Commit**

```bash
git add src/components/threshold/Portal.tsx src/components/threshold/PortalLayer.tsx
git commit -m "feat(threshold): add 3D portal components with glow and breathing"
```

---

## Task 8: Create Threshold Orchestrator

**Files:**
- Create: `/Users/dea/claude-test/The-Irreal/.worktrees/enhanced-threshold/site/src/components/threshold/ThresholdOrchestrator.tsx`

**Step 1: Create the stage timing controller**

```tsx
import { useEffect, useRef, useCallback } from 'react';
import { useThresholdStore } from '../../stores/thresholdStore';
import { thresholdAudio } from '../../lib/audio/ThresholdAudio';

// Stage durations in milliseconds
const STAGE_DURATIONS = {
  detection: 500,
  void: 2000,
  attunement: 2000,
  crystallization: 2000,
  portals: Infinity,  // User-driven
  crossing: 1200,
};

const STAGE_ORDER: Array<keyof typeof STAGE_DURATIONS> = [
  'detection',
  'void',
  'attunement',
  'crystallization',
  'portals',
];

export function ThresholdOrchestrator() {
  const stage = useThresholdStore((s) => s.stage);
  const setStage = useThresholdStore((s) => s.setStage);
  const setPrefersReducedMotion = useThresholdStore((s) => s.setPrefersReducedMotion);
  const setAudioEnabled = useThresholdStore((s) => s.setAudioEnabled);
  const setMouseVelocity = useThresholdStore((s) => s.setMouseVelocity);
  const audioEnabled = useThresholdStore((s) => s.audioEnabled);
  const selectedPortal = useThresholdStore((s) => s.selectedPortal);

  const lastMousePos = useRef({ x: 0, y: 0 });
  const lastMouseTime = useRef(Date.now());
  const audioInitialized = useRef(false);

  // Detection stage: detect preferences
  useEffect(() => {
    if (stage === 'detection') {
      // Check reduced motion preference
      const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(motionQuery.matches);

      // Check if audio context can be created (will need user gesture)
      setAudioEnabled(!motionQuery.matches);
    }
  }, [stage, setPrefersReducedMotion, setAudioEnabled]);

  // Stage progression timer
  useEffect(() => {
    const duration = STAGE_DURATIONS[stage];
    if (duration === Infinity) return;

    const currentIndex = STAGE_ORDER.indexOf(stage);
    if (currentIndex === -1 || currentIndex >= STAGE_ORDER.length - 1) return;

    const nextStage = STAGE_ORDER[currentIndex + 1];

    const timer = setTimeout(() => {
      setStage(nextStage);
    }, duration);

    return () => clearTimeout(timer);
  }, [stage, setStage]);

  // Audio management
  useEffect(() => {
    if (!audioEnabled) return;

    const initAudio = async () => {
      if (audioInitialized.current) return;

      try {
        await thresholdAudio.init();
        audioInitialized.current = true;
      } catch (e) {
        console.warn('Audio init failed:', e);
      }
    };

    initAudio();
  }, [audioEnabled]);

  // Update audio for stage changes
  useEffect(() => {
    if (audioEnabled && audioInitialized.current) {
      thresholdAudio.setStage(stage);
    }
  }, [stage, audioEnabled]);

  // Mouse tracking for attunement
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const now = Date.now();
    const dt = now - lastMouseTime.current;

    if (dt > 0) {
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const velocity = Math.min(distance / dt / 2, 1); // Normalize to 0-1

      setMouseVelocity(velocity);

      if (audioEnabled && audioInitialized.current) {
        thresholdAudio.setMouseVelocity(velocity);
      }
    }

    lastMousePos.current = { x: e.clientX, y: e.clientY };
    lastMouseTime.current = now;
  }, [setMouseVelocity, audioEnabled]);

  // Start audio on first interaction (required by browsers)
  const handleFirstInteraction = useCallback(async () => {
    if (!audioEnabled || !audioInitialized.current) return;

    try {
      await thresholdAudio.start();
      thresholdAudio.setStage(stage);
    } catch (e) {
      console.warn('Audio start failed:', e);
    }

    // Remove listeners after first interaction
    window.removeEventListener('click', handleFirstInteraction);
    window.removeEventListener('keydown', handleFirstInteraction);
  }, [audioEnabled, stage]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, [handleMouseMove, handleFirstInteraction]);

  // Handle crossing navigation
  useEffect(() => {
    if (stage === 'crossing' && selectedPortal) {
      const timer = setTimeout(() => {
        const destination = selectedPortal === 'atlas' ? '/atlas' : '/grove';
        window.location.href = destination;
      }, STAGE_DURATIONS.crossing);

      return () => clearTimeout(timer);
    }
  }, [stage, selectedPortal]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      thresholdAudio.dispose();
    };
  }, []);

  return null; // Orchestrator is logic-only
}
```

**Step 2: Commit**

```bash
git add src/components/threshold/ThresholdOrchestrator.tsx
git commit -m "feat(threshold): add stage orchestrator with timing and audio sync"
```

---

## Task 9: Create Crossing Transition Effect

**Files:**
- Create: `/Users/dea/claude-test/The-Irreal/.worktrees/enhanced-threshold/site/src/components/threshold/CrossingTransition.tsx`

**Step 1: Create the portal expansion transition**

```tsx
import { useEffect, useState } from 'react';
import { useThresholdStore } from '../../stores/thresholdStore';

export function CrossingTransition() {
  const stage = useThresholdStore((s) => s.stage);
  const selectedPortal = useThresholdStore((s) => s.selectedPortal);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    if (stage === 'crossing') {
      // Animate scale from 0 to cover entire screen
      const start = Date.now();
      const duration = 1200;

      const animate = () => {
        const elapsed = Date.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setScale(eased);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    } else {
      setScale(0);
    }
  }, [stage]);

  if (stage !== 'crossing' || !selectedPortal) return null;

  const color = selectedPortal === 'atlas' ? '#7c6fe0' : '#4a9d6a';
  const maxSize = Math.max(window.innerWidth, window.innerHeight) * 3;

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: selectedPortal === 'atlas' ? '30%' : '70%',
        transform: 'translate(-50%, -50%)',
        width: maxSize,
        height: maxSize,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        opacity: scale,
        scale: scale,
        zIndex: 100,
        pointerEvents: 'none',
      }}
    />
  );
}
```

**Step 2: Commit**

```bash
git add src/components/threshold/CrossingTransition.tsx
git commit -m "feat(threshold): add crossing transition with portal expansion"
```

---

## Task 10: Integrate All Components

**Files:**
- Modify: `/Users/dea/claude-test/The-Irreal/.worktrees/enhanced-threshold/site/src/pages/index.astro`

**Step 1: Update the threshold page to use all components**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="The Irreal — Threshold">
  <div id="threshold-root"></div>
</BaseLayout>

<script>
  import { createElement } from 'react';
  import { createRoot } from 'react-dom/client';
  import { ThresholdExperience } from '../components/threshold/ThresholdExperience';

  // Mount React app
  const root = document.getElementById('threshold-root');
  if (root) {
    createRoot(root).render(createElement(ThresholdExperience));
  }
</script>

<style>
  #threshold-root {
    position: fixed;
    inset: 0;
  }
</style>
```

**Step 2: Create ThresholdExperience wrapper component**

Create `/Users/dea/claude-test/The-Irreal/.worktrees/enhanced-threshold/site/src/components/threshold/ThresholdExperience.tsx`:

```tsx
import { VoidScene } from './VoidScene';
import { CrystallizingText } from './CrystallizingText';
import { PortalLayer } from './PortalLayer';
import { CrossingTransition } from './CrossingTransition';
import { ThresholdOrchestrator } from './ThresholdOrchestrator';

export function ThresholdExperience() {
  return (
    <>
      {/* Logic controller - no visual output */}
      <ThresholdOrchestrator />

      {/* Background layer: void with particles */}
      <VoidScene />

      {/* Text layer: crystallizing title */}
      <CrystallizingText />

      {/* Portal layer: navigation options */}
      <PortalLayer />

      {/* Transition layer: crossing effect */}
      <CrossingTransition />
    </>
  );
}
```

**Step 3: Delete old placeholder components**

```bash
rm src/components/threshold/ParticleField.tsx
rm src/components/threshold/EmergenceText.tsx
```

**Step 4: Commit**

```bash
git add src/pages/index.astro src/components/threshold/ThresholdExperience.tsx
git add -u  # Stage deletions
git commit -m "feat(threshold): integrate all components into complete experience"
```

---

## Task 11: Add Font Files for 3D Text

**Files:**
- Create: `/Users/dea/claude-test/The-Irreal/.worktrees/enhanced-threshold/site/public/fonts/` (directory)

**Step 1: Download font files**

The `@react-three/drei` Text component needs actual font files. For now, use a fallback approach:

Update `/Users/dea/claude-test/The-Irreal/.worktrees/enhanced-threshold/site/src/components/threshold/Portal.tsx` to use system fonts:

```tsx
// Replace the Text components with simpler versions that don't require font files
import { Html } from '@react-three/drei';

// In the Portal component, replace Text with:
{/* Label */}
<Html position={[0, -2.2, 0]} center>
  <div style={{
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '1.2rem',
    color: '#e0e0e8',
    textAlign: 'center',
    whiteSpace: 'nowrap',
  }}>
    {label}
  </div>
</Html>

{/* Hint */}
<Html position={[0, -2.8, 0]} center>
  <div style={{
    fontFamily: "'EB Garamond', serif",
    fontSize: '0.9rem',
    color: '#8888a0',
    textAlign: 'center',
    whiteSpace: 'nowrap',
  }}>
    {hint}
  </div>
</Html>
```

**Step 2: Update full Portal.tsx file**

```tsx
import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface PortalProps {
  position: [number, number, number];
  color: string;
  glowColor: string;
  label: string;
  hint: string;
  onClick: () => void;
}

export function Portal({ position, color, glowColor, label, hint, onClick }: PortalProps) {
  const groupRef = useRef<THREE.Group>(null);
  const torusRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Breathing animation
  const breathPhase = useRef(Math.random() * Math.PI * 2);

  useFrame((state, delta) => {
    if (!torusRef.current) return;

    // Breathing pulse
    breathPhase.current += delta * Math.PI * 1.5;
    const breathScale = 1 + Math.sin(breathPhase.current) * 0.05;

    // Apply scale
    const targetScale = hovered ? 1.15 : breathScale;
    torusRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.1
    );

    // Rotate slowly
    torusRef.current.rotation.z += delta * 0.1;
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Portal ring */}
      <mesh
        ref={torusRef}
        onClick={onClick}
        onPointerEnter={() => {
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerLeave={() => {
          setHovered(false);
          document.body.style.cursor = 'default';
        }}
      >
        <torusGeometry args={[1.5, 0.08, 16, 64]} />
        <meshStandardMaterial
          color={color}
          emissive={glowColor}
          emissiveIntensity={hovered ? 2 : 0.8}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Inner glow */}
      <mesh>
        <circleGeometry args={[1.4, 32]} />
        <meshBasicMaterial
          color={glowColor}
          transparent
          opacity={hovered ? 0.3 : 0.15}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Label - using Html for proper fonts */}
      <Html position={[0, -2.2, 0]} center>
        <div style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '1.2rem',
          color: '#e0e0e8',
          textAlign: 'center',
          whiteSpace: 'nowrap',
          textShadow: '0 0 10px rgba(124, 111, 224, 0.5)',
        }}>
          {label}
        </div>
      </Html>

      {/* Hint */}
      <Html position={[0, -2.8, 0]} center>
        <div style={{
          fontFamily: "'EB Garamond', serif",
          fontSize: '0.9rem',
          color: '#8888a0',
          textAlign: 'center',
          whiteSpace: 'nowrap',
        }}>
          {hint}
        </div>
      </Html>
    </group>
  );
}
```

**Step 3: Commit**

```bash
git add src/components/threshold/Portal.tsx
git commit -m "fix(threshold): use Html component for portal labels (font compatibility)"
```

---

## Task 12: Test and Verify

**Step 1: Start development server**

```bash
cd /Users/dea/claude-test/The-Irreal/.worktrees/enhanced-threshold/site
npm run dev
```

**Expected:** Server starts on http://localhost:4321

**Step 2: Visual verification checklist**

Open http://localhost:4321 and verify:

- [ ] Screen starts dark (detection stage)
- [ ] Particles emerge from void (~0.5s)
- [ ] Particles breathe (subtle expand/contract)
- [ ] Moving mouse changes particle behavior (attunement)
- [ ] "The Irreal" text crystallizes from blur (~4.5s)
- [ ] Two portals appear (~6.5s)
- [ ] Portals breathe and glow
- [ ] Hovering portal increases glow
- [ ] Clicking portal triggers expansion transition
- [ ] Audio plays (40Hz drone rising) after first click

**Step 3: If errors, check console**

```bash
# Check for TypeScript errors
npm run check
```

**Step 4: Final commit**

```bash
git add -A
git commit -m "feat(threshold): complete vertical slice - 5-stage crossing ritual

IMPLEMENTED:
- Detection stage: preference detection
- Void stage: 3D particles emerge, 40Hz drone
- Attunement stage: particles sync to mouse, drone rises
- Crystallization stage: title forms from blur
- Portals stage: two breathing 3D portals
- Crossing stage: portal expansion transition

COMPONENTS:
- VoidScene: R3F canvas with camera inside particle sphere
- VoidParticles: 2000 particles with breathing animation
- CrystallizingText: GSAP blur-to-clarity emergence
- Portal: 3D torus with glow and hover effects
- PortalLayer: dual portal layout
- CrossingTransition: portal expansion effect
- ThresholdOrchestrator: stage machine and audio sync

AUDIO:
- Tone.js sub-bass drone (40Hz → 110Hz through stages)
- Filter responds to mouse velocity
- Long reverb for spatial depth

SUCCESS CRITERIA: 'I've never experienced anything like this on the web'"
```

---

## Troubleshooting

### Common Issues

**1. "Cannot use import statement outside module"**
- Check `astro.config.mjs` has SSR noExternal for three.js

**2. "Tone.js: The AudioContext was not allowed to start"**
- Audio requires user gesture. Click anywhere to start.

**3. Particles not visible**
- Check camera position is [0,0,0]
- Check particles are distributed around camera, not in front

**4. GSAP animation not playing**
- Verify stage is 'crystallization' when component mounts
- Check hasAnimated ref logic

**5. Portals not clickable**
- Verify pointerEvents is 'auto' during portals stage
- Check Canvas has event handling enabled

---

## Post-Implementation

After completing this plan:

1. **Test on multiple devices** (mobile, tablet, desktop)
2. **Check reduced motion fallback** (set prefers-reduced-motion in browser)
3. **Evaluate feel** — Does it produce "I've never experienced this"?
4. **Iterate on timing** if needed (adjust STAGE_DURATIONS)
5. **Then proceed to Mycelium Atlas** (next vertical slice)

---

**Plan complete and saved to `docs/plans/2026-01-04-threshold-vertical-slice.md`.**

Two execution options:

**1. Subagent-Driven (this session)** - I dispatch fresh subagent per task, review between tasks, fast iteration

**2. Parallel Session (separate)** - Open new session with executing-plans, batch execution with checkpoints

Which approach?
