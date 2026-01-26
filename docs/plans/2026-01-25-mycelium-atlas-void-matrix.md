# Milestone 2: Mycelium Atlas (The Living Network)
## Implementation Plan — Void Matrix Architecture

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the static graph visualization into a living, zero-gravity "Void Matrix" that responds to player presence (The Wake), intent (The Lure), and arrival (The Bloom).

**Architecture:**
- **Navigation:** Zero-G Physics Rig (already spiked) refined for 3D web traversal.
- **Visuals:** GPGPU Particle System for "The Wake" (performance critical).
- **Interaction:** Raycasting-based "Lure" beams for connection.
- **Content:** "Bloom" animation for node opening using shader uniforms.

**Tech Stack:** React Three Fiber, Drei, Tone.js, GLSL (Custom Shaders).

---

### Task 1: The Wake (GPGPU Particle System)

**Files:**
- Create: `site/src/components/atlas/VoidMatrixParticles.tsx`
- Create: `site/src/components/atlas/shaders/VoidMatrixMaterial.tsx`
- Modify: `site/src/components/atlas/MyceliumScene.tsx`

**Step 1: Create GPGPU Simulation Shader**
Define the shader that handles particle position updates on the GPU.
- `void-sim.glsl`: Updates particle positions based on curl noise + camera velocity repulsor.

**Step 2: Create Particle Rendering Shader**
Define the visual appearance of the spores.
- `void-render.glsl`: Renders points with distance attenuation and "glow" falloff.

**Step 3: Implement VoidMatrixParticles Component**
- Initialize FBO (Frame Buffer Object) for positions.
- Hook into `useFrame` to update simulation uniforms (time, mouse, camera velocity).
- Render `points` with the custom shader material.

**Step 4: Integrate into Scene**
- Add `<VoidMatrixParticles />` to `MyceliumScene.tsx`.
- Ensure it sits behind the nodes (z-sorting) but responds to camera.

**Step 5: Verify Performance**
- Run `npm run dev`.
- Check FPS with `r3f-perf`. Target > 50fps with 5000 particles.

**Step 6: Commit**
```bash
git add site/src/components/atlas/VoidMatrixParticles.tsx site/src/components/atlas/shaders/
git commit -m "feat(atlas): implement GPGPU void matrix particles (The Wake)"
```

---

### Task 2: The Lure (Connection Beams)

**Files:**
- Create: `site/src/components/atlas/LureBeam.tsx`
- Modify: `site/src/stores/atlasStore.ts` (add `hoveredNode` state)
- Modify: `site/src/components/atlas/NodeArtifact.tsx`

**Step 1: State Management**
- Ensure `atlasStore` tracks `hoveredNode` position (Vector3) and ID.

**Step 2: Implement LureBeam Component**
- Uses `MeshLine` (drei) or custom `ShaderMaterial` on a cylinder.
- Start point: Camera position (slightly below, like coming from chest).
- End point: `hoveredNode` position.
- Animation: Material `dashOffset` or `opacity` flows from Start -> End.

**Step 3: Audio Trigger**
- When `hoveredNode` changes from null -> ID: Trigger `Tone.Synth` chord.
- Pitch based on node biome (Lore = Deep, Play = High).

**Step 4: Integrate & Test**
- Add `<LureBeam />` to `MyceliumScene`.
- Verify beam only appears on hover.
- Verify audio plays once per hover (debounce).

**Step 5: Commit**
```bash
git add site/src/components/atlas/LureBeam.tsx site/src/stores/atlasStore.ts
git commit -m "feat(atlas): implement lure beams and gaze audio (The Lure)"
```

---

### Task 3: The Bloom (Content Unfolding)

**Files:**
- Modify: `site/src/components/atlas/NodeArtifact.tsx`
- Modify: `site/src/components/atlas/shaders/MToonNode.tsx`
- Create: `site/src/components/atlas/NodeContent.tsx`

**Step 1: Shader Upgrade (Bloom)**
- Add `uniform float bloomProgress` to `MToonNodeMaterial`.
- In vertex shader: Displace vertices outward based on `bloomProgress` (explode/open effect).
- In fragment shader: Increase emission brightness with `bloomProgress`.

**Step 2: Component Logic**
- In `NodeArtifact`, detect "Arrival" (distance < 5 units).
- Animate `bloomProgress` 0 -> 1 using `maath/easing`.

**Step 3: Content Overlay**
- Create `NodeContent`: An `<Html>` component that renders *inside* the bloom.
- Opacity fades in as `bloomProgress` > 0.8.
- Render MDX title/summary initially.

**Step 4: Commit**
```bash
git add site/src/components/atlas/NodeArtifact.tsx site/src/components/atlas/NodeContent.tsx
git commit -m "feat(atlas): implement node bloom and content revelation (The Bloom)"
```

---

### Task 4: The Navigation (Zero-G Swim)

**Files:**
- Modify: `site/src/components/atlas/SporeRig.tsx` (Rename to `VoidRig`)

**Step 1: Physics Upgrade**
- Port the spring-dampening logic from `Threshold/CameraRig` to the Atlas rig.
- Tuning: Slower, floatier. Less friction than the Threshold.
- "Swim" feel: Mouse movement adds slight rotation momentum (roll).

**Step 2: Click-to-Travel**
- On click (if hovering node):
  - Set `targetPosition` to node position (offset by 4 units for viewing).
  - Engage "hyper-drive" (particle speed x 5).
  - Audio: Whoosh sound (noise filter sweep).

**Step 3: Commit**
```bash
git add site/src/components/atlas/SporeRig.tsx
git commit -m "feat(atlas): implement zero-g void rig navigation"
```
