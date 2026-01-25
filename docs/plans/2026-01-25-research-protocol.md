# Creative Tech Research Protocol: The "AwesomeSites" Deep Dive

> **Directive:** FULL EXTENSIVE DEEP DIVING. Use all available agent skills. Full autonomy.
> **Target:** The `ezshine/AwesomeSites` repository ("The Keys to the Kingdom").

**Objective:** Systematically mine, reverse-engineer, and hybridize the most advanced creative web techniques available in the open source wild to build The Irreal's "Mycelium Atlas" (Phase 2).

---

## Part 0: The Archeological Dig (Data Acquisition)

**Goal:** Secure the raw materials (source code) for analysis.

1.  **Target Acquisition:**
    *   `AwesomeSites-Pack01`: Contains **Bruno Simon** (Physics/Micro-world), **Lusion** (E-commerce/Particles).
    *   `AwesomeSites-Pack06`: Contains **Samsy Ninja** (Morphing/Liquid), **Equinox** (Space).
    *   `AwesomeSites-Pack02` & `Pack03`: **Coastal World** (Metaverse), **Slow Roads** (Infinite Generation).

2.  **Execution:**
    *   Clone these repositories into a temporary research workspace `research/awesome-sites/`.
    *   *Note:* These are large repos. We will pull them partially or shallowly if possible, or just specific subfolders if the structure allows (sparse checkout).

---

## Part 1: The "Samsy" Dissection (Liquid Morphing)

**Target:** `AwesomeSites-Pack06/metaverse/samsy.ninja`
**Why:** The user explicitly identified this as the "north star" for the organic feel.

**Extraction List:**
1.  **The Shader:** Locate the GLSL code responsible for the liquid morphing.
    *   Is it Raymarching (SDFs)?
    *   Is it Vertex Displacement (Noise)?
    *   Is it Marching Cubes?
2.  **The Interaction:** How does the mouse influence the mesh?
3.  **The Stack:** What is the underlying engine? (Three.js, OGL, custom?)

**Output:** `docs/research/extracted/samsy-mechanics.md` + raw shader files.

---

## Part 2: The "Bruno" Dissection (Micro-World Physics)

**Target:** `AwesomeSites-Pack01/portfolio/bruno-simon.com`
**Why:** Best-in-class implementation of a "gamified" navigation interface.

**Extraction List:**
1.  **Camera Controller:** How does the camera follow the vehicle/player? (Smooth dampening, offsets).
2.  **Physics Optimization:** How does he run Cannon.js so smoothly? (Broadphase, worker usage).
3.  **Scale:** How are units defined to make it feel like a "toy world"?

**Output:** `docs/research/extracted/bruno-mechanics.md`.

---

## Part 3: The "Scrollytelling" Investigation (SBS Style)

**Target:** Search Packs for "scrollytelling" or "path-following" implementations.
**Candidates:**
- `Pack01/game/exp-my-little-storybook.lusion.co` (Lusion is the master of this).
- `Pack05/game/alexanderperrin.com.au` (Short Trip - rail-guided movement).

**Extraction List:**
1.  **Curve Following:** How is the camera constrained to a path? (`CatmullRomCurve3` logic).
2.  **Scroll Mapping:** How is scroll delta mapped to path progress? (GSAP ScrollTrigger vs custom).

**Output:** `docs/research/extracted/rail-mechanics.md`.

---

## Part 4: The Synthesis (The Irreal Architecture)

**Goal:** Combine these DNA strands into the "Mycelium Atlas" specification.

1.  **Visuals:** Samsy's **Liquid Shaders** applied to the Nodes.
2.  **Physics/Feel:** Bruno's **Micro-World Scale** and camera dampening.
3.  **Navigation:** Lusion's **Rail-Guided Flight** for traveling between nodes.

**Deliverable:** `docs/architecture/PHASE2-MYCELIUM-ATLAS.md` (Technical Design Document).

---

## Execution Command Center

**Immediate Action:**
1.  Run the `scripts/research/clone_packs.sh` (I will create this).
2.  Sub-agent `codebase_investigator` will be deployed to analyze `samsy.ninja`.
3.  Sub-agent `codebase_investigator` will be deployed to analyze `bruno-simon.com`.