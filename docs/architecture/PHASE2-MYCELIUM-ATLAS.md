# PHASE 2: THE MYCELIUM ATLAS - Technical Design Document

> **Vision:** A living, breathing neural network that the user *flies through* like a spore. Not a map. A world.
> **References:** Samsy Ninja (Organic Flow), Bruno Simon (Toy Physics), Lusion (Rail Flight).

---

## 1. Core Mechanics

### 1.1 The "Rail-Shooter Spore" (Camera Controller)
Instead of orbit controls (which feel objective/distant), we implement a **subjective flight controller**.

*   **State:** The camera is attached to a `SporeRig`.
*   **Locomotion:**
    *   **Cruising:** The camera automatically drifts slowly along the "current vein" (connection).
    *   **Boost:** Scrolling moves you faster along the rail.
    *   **Jump:** Clicking a Node creates a new temporary spline curve from your current position to the target, and you "leap" across the void to it.
*   **Feel:** Dampened, fluid, underwater. Not rigid 3D movement.

### 1.2 The "Fog of Discovery"
*   **Render Distance:** High fog density. You can only see 2-3 hops away.
*   **Discovery:** As you visit nodes, they "ignite" (permanent state change in `userStore`). Ignited nodes push back the fog slightly.
*   **Aesthetic:** Bioluminescent lights in deep heavy mist (Reference: *Inside*, *Abzu*).

---

## 2. Visual Architecture

### 2.1 The Nodes: "MToon Micro-Worlds" (Bruno Hybrid)
Nodes are not spheres. They are stylized 3D artifacts.

*   **Shader:** Custom `IrrealToonMaterial` (Reverse-engineered from Bruno's Shader 10).
    *   **Rim Light:** Strong fresnel for readability against the dark void.
    *   **Shade Shift:** Quantized lighting (bands) to look illustrative.
*   **Geometry:**
    *   **Lore:** Crystalline shards.
    *   **Creation:** Blooming buds (Samsy morphing logic).
    *   **Deep:** Void stones (dark with emissive cracks).

### 2.2 The Veins: "Liquid GPGPU Connections" (Samsy Hybrid)
Connections are not lines. They are flowing streams of particles.

*   **Technique:** GPGPU Flow Field (Samsy Shader 4/5).
*   **Implementation:**
    *   Use `THREE.InstancedMesh` for particles.
    *   Use an FBO (Frame Buffer Object) to update positions.
    *   **Flow Logic:** Particles spawn at Source Node, flow along the curve to Target Node, and die/respawn.
    *   *Result:* You see the *direction* of the relationship.

---

## 3. Technical Implementation Plan

### 3.1 The Tech Stack
*   **Engine:** R3F (`@react-three/fiber`)
*   **Physics:** Rapier (`@react-three/rapier`) - lighter/faster than Cannon for this use case.
*   **Shaders:** TSL (Three.js Shading Language) or raw GLSL.
*   **State:** `useAtlasStore` (Zustand).

### 3.2 Key Components

**`components/atlas/`**
*   `MyceliumScene.tsx`: The main container. Handles fog, lighting.
*   `SporeRig.tsx`: The camera controller (The "Player").
*   `NodeArtifact.tsx`: The interactive node (MToon shader).
*   `VeinFlow.tsx`: The GPGPU particle stream (Samsy logic).
*   `AtlasOracle.tsx`: The UI layer (html overlay).

### 3.3 Data Structure
```typescript
interface AtlasNode {
  id: string;
  position: [x, y, z];
  biome: 'lore' | 'creation' | 'deep';
  unlocked: boolean; // Has user visited?
}

interface AtlasVein {
  source: string;
  target: string;
  flowStrength: number;
}
```

---

## 4. Execution Steps (For Next Session)

1.  **Scaffold the Scene:** Set up `MyceliumScene` with deep fog and `SporeRig`.
2.  **Port the MToon Shader:** Adapt Bruno's shader for the Nodes.
3.  **Implement Rail Flight:** Create the spline-based camera movement.
4.  **Add GPGPU Veins:** Port the Samsy flow logic to the connections.

**Success Criteria:**
*   Does moving between nodes feel like *traveling*?
*   Do the nodes look like *artifacts*, not geometry?
*   Is the void *thick*?

