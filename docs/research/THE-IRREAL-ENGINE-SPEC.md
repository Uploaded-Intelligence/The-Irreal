# THE IRREAL ENGINE SPECIFICATION
## Hybridizing the Best of the Open Web

> **Vision:** A "Chimera" engine that combines Bruno Simon's physics-driven micro-world feel with Samsy's organic liquid visuals and Lusion's cinematic camera control.

---

## 1. THE NERVOUS SYSTEM (Game Loop & Time)

**Reference:** `Bruno Simon (Pack01)`
**Analysis:** Bruno decouples the "Render Loop" from the "Physics Loop".
*   **Visuals:** Run at screen refresh rate (`requestAnimationFrame`).
*   **Physics:** Run at fixed timestep (1/60s) to prevent tunneling/instability.

**Irreal Implementation:**
```typescript
class Time {
  constructor() {
    this.start = Date.now()
    this.current = this.start
    this.elapsed = 0
    this.delta = 16
    
    // The Heartbeat
    window.requestAnimationFrame(() => this.tick())
  }

  tick() {
    const currentTime = Date.now()
    this.delta = currentTime - this.current
    this.current = currentTime
    this.elapsed = this.current - this.start

    // 1. Physics Tick (Fixed)
    // 2. Logic Tick (Delta)
    // 3. Render Tick (Interpolated)
    this.trigger('tick') 
    window.requestAnimationFrame(() => this.tick())
  }
}
```

---

## 2. THE SKELETON (Camera & Navigation)

**Reference:** `Lusion` (Rail Flight) + `Bruno` (Spline)
**Analysis:** 
*   **Lusion:** Uses `CatmullRomCurve3` for the "Rail". The camera's position is a normalized value (`t = 0..1`) along this curve.
*   **Bruno:** Adds "Dampening" (Spring physics) to the look-at target so it feels heavy, not robotic.

**Irreal Implementation:**
*   **The Spore Rig:**
    *   **Rail:** Primary movement is constrained to the `MyceliumConnection` (a spline).
    *   **Offset:** Mouse X/Y adds a slight "swim" offset from the rail (freedom within constraint).
    *   **Damping:** `lerp(current, target, 0.05)` for position, `0.03` for rotation.

---

## 3. THE SKIN (Visuals & Shaders)

**Reference:** `Samsy Ninja` (Liquid Morphing)
**Analysis (from extracted GLSL):**
*   Samsy uses **Vertex Displacement** driven by Simplex Noise.
*   He likely uses **Marching Cubes** or **Raymarching** for the most complex blobs, but the efficient ones are displaced spheres.
*   **Key Shader Uniforms:** `uTime`, `uMouse`, `uNoiseScale`, `uDistortion`.

**Irreal Implementation:**
*   **Node Artifacts:** `MeshStandardMaterial` + `onBeforeCompile` hook to inject the Samsy noise function into the vertex shader.
*   **Veins:** `InstancedMesh` tubes with a scrolling UV offset to simulate flow.

---

## 4. THE METABOLISM (State & Performance)

**Reference:** `Coastal World` + `Slow Roads`
**Analysis:**
*   **State:** `Zustand` (Transient state like mouse position) + `Context` (Deep state like User Progress).
*   **Performance:**
    *   **OffscreenCanvas:** Used for heavy texture generation.
    *   **Workers:** Physics calculations happen off the main thread.
    *   **Instancing:** EVERYTHING is instanced.

**Irreal Implementation:**
*   **Resource Manager:** Pre-load assets in a `Suspense` wrapper.
*   **Quality Tiering:** Detect GPU tier (using `detect-gpu`) and downgrade shaders (remove noise octaves) for low-end devices.

---

## 5. EXECUTION PLAN (Phase 2)

1.  **Engine Core:** Build the `Time`, `Resources`, and `Loop` classes.
2.  **Spore Rig:** Implement the Spline-based camera controller.
3.  **Visuals:** Port the extracted Samsy shaders into R3F materials.
4.  **Integration:** Connect the rig to the graph data structure.

**Ready to start Phase 2 Implementation?**
