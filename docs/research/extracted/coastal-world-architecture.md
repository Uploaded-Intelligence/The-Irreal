# Coastal World Architecture Analysis (Pack03)

**Source:** `research/coastal-world-investigation/metaverse/coastalworld.com/assets/workerThread.dcadb976.js`
**Date:** 2026-01-25
**Analyst:** Gemini CLI (Ungabunga)

## Executive Summary
Coastal World uses a **Worker-Based Physics Architecture**. The main thread is purely for Rendering (Three.js) and I/O. All game logic, collision detection, and camera control happens in a dedicated Web Worker (`workerThread.js`). This ensures smooth 60fps rendering even if physics calculation spikes.

## The Chimera Pattern (Verified)

### 1. The Worker (The Brain)
The worker (`workerThread.js`) contains the entire game state.
-   **`Us` (User/Player):** A `zs` class instance. Handles movement, velocity, and collision with the world.
-   **`Zs` (Camera):** A `Zs` class instance. Calculates camera target/lookAt based on Player position.
-   **`Hs` (Helpers/Entities):** Manages "Spheres" (NPCs, dynamic objects, likely other players).
-   **`Js` (World/Physics):** A BVH/Octree structure for the static world geometry.

### 2. The Loop (`$s` function)
The worker runs a fixed time step loop, likely decoupled from the render loop.
```javascript
function $s() {
    const t = Math.min(.05, js.getDelta()); // Delta time
    const s = t / 5; // Substep delta (5 physics steps per frame!)
    
    Us.storePreviousPosition();
    Us.updateVelocity(30, t);
    
    // Physics Sub-stepping for stability
    for (let r = 0; r < 5; r++) {
        Us.update(Js, Zs, Qs, 30, s, 4 === r);
        Hs.update(Js, Us, 30, s);
    }
    
    Us.computeAppliedVelocity(t);
    Zs.update(Js, Us, Qs, t);
    
    // Return State Snapshot
    return {
        canPause: ...,
        player: Us.data,
        camera: Zs.data,
        spheres: Hs.data
    };
}
```

### 3. State Synchronization (The Nervous System)
The Main Thread and Worker communicate via `postMessage`.

**Main -> Worker (Input/Commands):**
-   `45` (Input): Sends `[45, x, y, z]` (Movement vector?).
-   `set-player-options`: Configures player.
-   `add-sphere`: Adds an entity (NPC/Player) to the physics world.
-   `toggle-layer`: Enables/disables collision layers.

**Worker -> Main (State):**
-   `update`: Contains the full snapshot `{ player, camera, spheres }`.
-   The Main thread applies this snapshot to the Three.js meshes.

## Multiplayer Implications (The Witness System)
Coastal World likely handles multiplayer by:
1.  **Main Thread:** Receives network packets (other player positions).
2.  **Main Thread:** Sends `add-sphere` or `update-sphere` messages to the Worker.
3.  **Worker:** Updates these "Spheres" in the physics world (handling collisions with the local player).
4.  **Worker:** Returns their smoothed positions in the `update` snapshot.

## Recommendation for The Irreal
To achieve the "Living" feel:
1.  **Adopt the Worker Pattern:** Move `SporeRig` and `Rapier` logic into a worker (or use `useWorker` from R3F if applicable, though manual is cleaner for this level of control).
2.  **Physics Substepping:** The 5x subloop is key for stable collisions on complex geometry (like our Mycelium veins).
3.  **Witnesses as Spheres:** Represents other players as simple physics spheres in the worker, allowing us to collide with them (or bounce off them) without complex networking logic affecting the render thread.

## Artifacts
-   **Quaternion Math:** Uses a custom `r` class (minified) for rotations, likely optimized for the worker.
-   **BVH:** `Js` class constructs a bounding volume hierarchy from buffer attributes (`add-batch`).

---
*End of Report*
