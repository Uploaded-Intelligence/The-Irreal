# GRAND UNIFICATION RESEARCH PROTOCOL (v2)
## Systematically Mining the "AwesomeSites" Goldmine: Anatomy & Physiology

> **Critique:** "Is it only shaders?" -> **NO.** Shaders are just the skin.
> **Correction:** We must dissect the **Nervous System (Logic)**, **Skeleton (Architecture)**, and **Metabolism (Performance)**.

---

## PART 1: THE EXTENDED TARGET MATRIX (Systems Analysis)

We are looking for **Behavioral DNA**, not just visual DNA.

| Target | System to Extract | Keywords to Hunt |
| :--- | :--- | :--- |
| **Bruno Simon** | **Game Loop & Time** | `Raf`, `Tick`, `Time.js`, `EventEmitter` |
| **Lusion** | **Camera Choreography** | `CatmullRom`, `Spline`, `CameraRig`, `Path` |
| **Slow Roads** | **Infinite Terrain Logic** | `QuadTree`, `Chunk`, `Generation`, `Seed` |
| **Coastal World** | **Networked State** | `Socket`, `Prediction`, `Interpolation`, `Room` |
| **Active Theory** | **Threaded Loading** | `Worker`, `OffscreenCanvas`, `AssetManager` |
| **Make Me Pulse** | **Scroll Physics** | `VirtualScroll`, `Inertia`, `Damping` |

---

## PART 2: THE ANATOMY DISSECTION TOOLS

We need scripts that understand **Structure**, not just Regex.

### 2.1 The Loop Analyzer (`analyze_loops.py`)
*   **Target:** Find the `requestAnimationFrame` heartbeat.
*   **Goal:** How do they handle delta time? Do they use fixed timesteps for physics?
*   **Output:** `docs/research/extracted/game-loops.md`

### 2.2 The Physics Bridge Mapper (`map_physics.ts`)
*   **Target:** Integration points between Three.js (Visuals) and Cannon/Rapier (Physics).
*   **Goal:** How do they sync positions? Do they use `position.copy()` or direct array access?
*   **Output:** `docs/research/extracted/physics-integration.md`

### 2.3 The Camera Rig Extractor (`extract_rigs.ts`)
*   **Target:** Camera controllers.
*   **Goal:** Extract the math for "smooth dampening" and "cinematic look-at".
*   **Output:** `docs/research/extracted/camera-math.js`

---

## PART 3: ARCHITECTURAL SYNTHESIS (The Irreal Engine)

We will build the **Irreal Engine Core** by hybridizing these systems.

1.  **The "Heartbeat" (Bruno + Active Theory):**
    *   A decoupled `Time` class that handles `delta`, `elapsed`, and `lag smoothing`.
    *   Separate `Update` (Logic) and `Render` (Visual) ticks.

2.  **The "Spine" (Lusion):**
    *   A Spline-based camera system that allows both "Rail Travel" and "Free Look".

3.  **The "Brain" (Coastal World):**
    *   A State Machine that predicts user intent (e.g., "they are scrolling fast, widen the FOV").

---

## PART 4: EXECUTION (Updated)

1.  **Clone:** `scripts/research/clone_expanded.sh` (The 12 targets).
2.  **Scan Logic:** `scripts/research/analyze_architecture.py` (New tool).
3.  **Scan Visuals:** `scripts/research/extract_shaders.py` (Existing tool).
4.  **Report:** `docs/research/THE-IRREAL-ENGINE-SPEC.md`.

**Ready to build the Logic Scanner?**