# Creative Tech Hybridization Research

> **Deep dive research document for The Irreal's threshold experience.**
> Standing on the shoulders of giants — cataloging the best open-source creative coding for hybridization.

---

## Table of Contents

1. [Core Philosophy](#core-philosophy)
2. [Metaballs & Organic Blobs](#metaballs--organic-blobs)
3. [Raymarching & SDFs](#raymarching--sdfs)
4. [Particles & Flow Fields](#particles--flow-fields)
5. [Post-Processing](#post-processing)
6. [Shader Materials](#shader-materials)
7. [Vertex Displacement](#vertex-displacement)
8. [Essential Helpers](#essential-helpers)
9. [Curated Reference Lists](#curated-reference-lists)
10. [Integration Strategy](#integration-strategy)
11. [Attribution Requirements](#attribution-requirements)

---

## Core Philosophy

**Why hybridize instead of reinvent?**

1. **Time efficiency** — Years of collective dev effort already exists
2. **Battle-tested** — These libraries are proven in production
3. **Community knowledge** — Learn from how others solved problems
4. **Attribution culture** — Creative coding community values crediting sources
5. **Iteration speed** — Start from working code, customize to vision

**The Samsy Effect:**
The inspiration from [samsy.ninja/morphin](https://samsy.ninja/morphin/index.html) showed that organic, blob-like morphing effects create the "I've never seen anything like this" feeling we're after. But Samsy's work isn't open-source — so we find similar techniques from those who've shared their work.

---

## Metaballs & Organic Blobs

### 1. sjpt/metaballsWebgl
**URL:** https://github.com/sjpt/metaballsWebgl
**License:** Check repo
**Key Features:**
- GPU implementation using optimized marching cubes
- **10,000 spheres at 100x100x100 grid at 60fps** (33% GPU on 1080)
- Input: texture containing sphere positions (and optionally colors)
- Output: rendered image as part of THREE.js scene
- Designed for dynamic data

**Integration Notes:**
- Uses THREE.js standard materials
- Can provide custom shader patches
- Excellent for interactive mouse-following blobs

**Code Pattern:**
```js
// Input is texture with sphere positions
// Output is rendered metaball mesh
```

---

### 2. codrops/WebGLBlobs
**URL:** https://github.com/codrops/WebGLBlobs
**License:** MIT (typical for Codrops)
**Key Features:**
- Tutorial: "How to deform and color spheres in Three.js"
- Vertex shader displacement
- Color gradients on organic shapes

**Integration Notes:**
- Good for understanding blob aesthetics
- Simpler than full marching cubes approach
- Can combine with post-processing

---

### 3. takumi0125/threejsMarchingCubesMetaball
**URL:** https://github.com/takumi0125/threejsMarchingCubesMetaball
**Key Features:**
- WebGL Marching Cubes implementation
- THREE.js powered

---

### 4. Three.js Built-in MarchingCubes
**Location:** `three/addons/objects/MarchingCubes`
**Demo:** https://threejs.org/examples/webgl_marchingcubes.html
**Key Features:**
- Part of official Three.js examples
- Based on greggman's blob (original by Henrik Rydgård)
- Multiple material presets: shiny, chrome, liquid, matte, textured

**Materials in demo:**
- MeshStandardMaterial for 'shiny'
- MeshLambertMaterial with envMap for 'chrome'/'liquid'
- MeshPhongMaterial for 'matte'/'textured'/'colors'

**This is likely the simplest path to working metaballs.**

---

## Raymarching & SDFs

### 1. shader-park/shader-park-core
**URL:** https://github.com/shader-park/shader-park-core
**Docs:** https://docs.shaderpark.com/references/
**License:** Check repo
**Key Features:**
- **JavaScript → GLSL abstraction**
- Built-in SDFs and boolean operations
- Works in p5js style OR raw GLSL
- CLI tools: `npm run toThreeJS`, `npm run toOffline`

**SDF Coloring:**
```js
// SDFs are colored in the shade function
// Evaluated at intersection with surfaceDistance SDF
// Normals computed numerically using tetrahedron technique
```

**Custom Raymarcher:**
```js
// Set surfaceDistance to return 0.0
// Implement everything from scratch in shade function
```

**Three.js Templates:**
- `es6-vite-prebuild-three-template` — Recommended for production
- `es6-three-starter-template` — Quick start with parcel

---

### 2. nicoptere/raymarching-for-THREE
**URL:** https://github.com/nicoptere/raymarching-for-THREE
**Key Features:**
- Based on stack.gl core modules
- Easy to upload data to shader (cameras, lights, textures)
- Can use THREE's post-processing ecosystem
- Includes `noise_bulb.glsl` example

**Advantage:** Post-processing friendly

---

### 3. danielesteban/three-raymarcher
**URL:** https://github.com/danielesteban/three-raymarcher
**Key Features:**
- Raymarching abstraction for SDF animations
- Supports THREE.js Raycaster out of the box

**Integration Notes:**
- Good for simple SDF animations
- Raycaster support means interactive clicking works

---

### 4. piellardj/ray-marching-webgl
**URL:** https://github.com/piellardj/ray-marching-webgl
**Demo:** https://piellardj.github.io/ray-marching-webgl/readme/
**Key Features:**
- Ray marching + noise generation in 3D/4D
- **Gradient noise** — more organic than value noise
- **4D mode** — "otherworldly object crossing our dimension" feel

**Quote:**
> "The 4D mode creates the unsettling impression of witnessing an otherworldly object crossing our dimension."

**This could be perfect for The Irreal's liminal threshold feel.**

---

## Particles & Flow Fields

### 1. sebastien-lempens/r3f-flow-field-particles
**URL:** https://github.com/sebastien-lempens/r3f-flow-field-particles
**Key Features:**
- **GPGPU particle system**
- React Three Fiber native
- Drop-in component: `FlowFieldParticles.jsx`

**Integration Notes:**
- Direct R3F component — minimal adaptation needed
- GPU-accelerated for performance

---

### 2. juniorxsound/Particle-Curl-Noise
**URL:** https://github.com/juniorxsound/Particle-Curl-Noise
**Key Features:**
- Three.js FBO particle system
- Curl noise implementation
- Based on @edankwan's example

**FBO Pattern:**
- Frame Buffer Objects for GPU particle state
- Curl noise creates organic, smoke-like flow

---

### 3. edankwan/The-Spirit
**URL:** https://github.com/edankwan/The-Spirit
**Key Features:**
- **LEGENDARY** smoke effect
- Uses noise derivatives and curl noise
- "New particles" technique by Simo Santavirta (@simppafi)
- Inspired by David Li's Flow experiment

**This is the gold standard for organic particle atmospherics.**

---

### 4. wawa-vfx
**URL:** https://wawasensei.dev/blog/wawa-vfx-open-source-particle-system-for-react-three-fiber-projects
**Key Features:**
- Lightweight, composable VFX engine
- React Three Fiber native
- GPU-accelerated particles, bursts, trails
- Two components: `VFXParticles` + `VFXEmitter`

**Use case:** Interactive particle effects, bursts on events

---

### 5. tim-soft/react-particles-webgl
**URL:** https://github.com/tim-soft/react-particles-webgl
**Key Features:**
- Inspired by particles.js
- Built with react-three-fiber
- 60FPS high-count particle fields
- Works in 2D and 3D

**Use case:** Background particle layer

---

### 6. szymonkaliski/threejs-exp-particles
**URL:** https://github.com/szymonkaliski/threejs-exp-particles
**Demo:** http://szymonkaliski.github.io/threejs-exp-particles/
**Key Features:**
- 3D flow-field particles experiment
- Pure THREE.js

---

## Post-Processing

### 1. pmndrs/postprocessing
**URL:** https://github.com/pmndrs/postprocessing
**License:** MIT
**Key Features:**

**Available Effects:**
- Antialiasing
- **Bloom** — essential for glow
- Blur
- Color Depth, Color Grading, Color Average
- Sepia, Brightness & Contrast, Hue & Saturation
- LUT (Look-Up Tables)
- Depth of Field
- **Vignette** — frame the experience
- Glitch
- **Chromatic Aberration** — with radial modulation!
- **Noise** — film grain
- God Rays
- Pattern, Dot-Screen, Grid, Scanline
- Pixelation
- Outline
- Shock Wave
- Depth Picking
- SSAO
- Texture
- Tone Mapping

**Performance Note:**
> "EffectPass automatically organizes and merges effects. This minimizes render operations and makes it possible to combine many effects without performance penalties of traditional pass chaining."
> "All fullscreen render operations use a single triangle that fills the screen."

**Chromatic Aberration Details:**
- Radial modulation support
- Weaker in middle, stronger at edges
- Creates "camera lens" feel

---

### 2. pmndrs/react-postprocessing
**URL:** https://github.com/pmndrs/react-postprocessing
**License:** MIT
**Key Features:**
- React wrapper for postprocessing
- Integrates with @react-three/fiber

**Usage:**
```jsx
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';

<EffectComposer>
  <Bloom intensity={0.5} luminanceThreshold={0.2} />
  <ChromaticAberration offset={[0.002, 0.002]} radialModulation />
</EffectComposer>
```

---

## Shader Materials

### 1. ruucm/shadergradient
**URL:** https://github.com/ruucm/shadergradient
**License:** Check repo
**Key Features:**
- Beautiful moving gradients
- Works in Framer, Figma, and React
- Built on R3F

**Packages:**
- `@shadergradient/react` — renderer only
- `@shadergradient/ui` — stateless UI components

**Installation:**
```bash
npm i @shadergradient/react @react-three/fiber three three-stdlib camera-controls
npm i -D @types/three
```

**Usage:**
```jsx
import { ShaderGradientCanvas, ShaderGradient } from '@shadergradient/react'

<ShaderGradientCanvas style={{ position: 'absolute', inset: 0 }} pixelDensity={1.5} fov={45}>
  <ShaderGradient cDistance={32} cPolarAngle={125} />
</ShaderGradientCanvas>
```

**Use case:** Background layer alternative to particles

---

### 2. pmndrs/lamina
**URL:** https://github.com/pmndrs/lamina
**Status:** Archived (July 2023), but still usable
**License:** MIT
**Key Features:**
- Layer-based shader materials
- Declarative system for stacking/blending effects
- Built on three-custom-shader-material (CSM)

**Built-in Noise Functions:**
- `lamina_noise_perlin()`
- `lamina_noise_simplex()`
- `lamina_noise_worley()`
- `lamina_noise_white()`
- `lamina_noise_swirl()`

**Note:** Needs maintainers/rewrite, but core functionality works.

---

### 3. JohnnyLeek1/React-Mesh-Gradient
**URL:** https://github.com/JohnnyLeek1/React-Mesh-Gradient
**Key Features:**
- Interactive mesh gradients with React
- Built with R3F

---

## Vertex Displacement

### 1. spite/vertex-displacement-noise-3d-webgl-glsl-three-js
**URL:** https://github.com/spite/vertex-displacement-noise-3d-webgl-glsl-three-js
**Blog:** https://www.clicktorelease.com/blog/vertex-displacement-noise-3d-webgl-glsl-three-js/
**Key Features:**
- Tutorial: animated shape with Perlin noise displacement
- Sphere geometry + normal-direction displacement
- Uses Ashima's webgl-noise

**Technique:**
> "Disturbing each vertex along the direction of its normal. Lines from center to each vertex — make some longer, some shorter."

**Noise Source:**
- Ashima Arts webgl-noise (MIT License)
- GLSL textureless classic 3D noise
- 'cnoise' + periodic variant 'pnoise'
- Authors: Stefan Gustavson, Ian McEwan

**Use case:** Organic blob surface detail

---

## Essential Helpers

### 1. pmndrs/drei
**URL:** https://github.com/pmndrs/drei
**Docs:** https://pmndrs.github.io/drei
**License:** MIT
**Key Features:**

**Relevant for Threshold:**
- `Stars` — shader-based blinking starfield (background layer)
- `MeshWobbleMaterial` — factor + speed configurable
- `Sky` — distance + sun position
- `Environment` — HDR environments
- `Effects` — post-processing helpers

**Cameras:**
- PerspectiveCamera, OrthographicCamera, CubeCamera, CameraShake

**Controls:**
- OrbitControls, FlyControls, MapControls, etc.

**useHelper Hook:**
- Quick way to add helpers to scene nodes

**Note:** drei is already in package.json as `@react-three/drei`

---

## Curated Reference Lists

### 1. AxiomeCG/awesome-threejs
**URL:** https://github.com/AxiomeCG/awesome-threejs
**Description:** Curated list of awesome ThreeJS resources
**Key Items:**
- The Book of Shaders
- The Nature of Code
- NodeToy — shader tool for web
- **Shader Park** — JS library for procedural shaders

---

### 2. terkelg/awesome-creative-coding
**URL:** https://github.com/terkelg/awesome-creative-coding
**Description:** Massive creative coding resource list
**Key Items:**
- THREE.js instanced geometry tutorials
- GPGPU particles with regl
- WebGL Quest — raymarching/distance functions
- Flow fields / vector fields tutorials
- Three.js Journey course

---

## Integration Strategy

### Recommended Architecture

```
┌────────────────────────────────────────────────┐
│                POST-PROCESSING                  │
│  Bloom + ChromaticAberration + Noise + Vignette │
├────────────────────────────────────────────────┤
│              FOREGROUND: Metaballs              │
│   sjpt/metaballsWebgl OR Three.js MarchingCubes │
│          Mouse trail interaction                │
├────────────────────────────────────────────────┤
│              MID-GROUND: Flow Field             │
│      r3f-flow-field-particles OR curl noise     │
│            Sympoietic patterns                  │
├────────────────────────────────────────────────┤
│              BACKGROUND: Atmosphere             │
│      drei/Stars OR shadergradient OR both       │
│              Distant particle field             │
└────────────────────────────────────────────────┘
```

### Implementation Priority

1. **Fix build** — TypeScript errors (trivial)
2. **Add postprocessing** — `npm install @react-three/postprocessing`
3. **Start with built-in MarchingCubes** — fastest path to working metaballs
4. **Add Stars from drei** — instant atmosphere
5. **Layer in flow field particles** — adapt from r3f-flow-field-particles
6. **Tune post-processing** — bloom + chromatic aberration
7. **Polish interactions** — mouse trail for metaballs
8. **Iterate** — swap/upgrade components as needed

### Simplest First Implementation

```tsx
// MetaballThreshold.tsx — MVP version
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { MarchingCubes } from 'three/addons/objects/MarchingCubes.js';

// Start here, iterate from working base
```

---

## Attribution Requirements

**CRITICAL:** All hybridized code must credit original authors.

### Required Credits

1. **Three.js MarchingCubes**
   - "Based on greggman's blob, original code by Henrik Rydgård"

2. **sjpt/metaballsWebgl** (if used)
   - Link to repo, check license

3. **Noise Functions**
   - Ashima Arts webgl-noise (MIT License)
   - Stefan Gustavson, Ian McEwan

4. **pmndrs Ecosystem**
   - react-three-fiber, drei, postprocessing (MIT License)

5. **Flow Field Particles** (if adapted)
   - sebastien-lempens/r3f-flow-field-particles

6. **The Spirit Inspiration** (if patterns used)
   - edankwan/The-Spirit
   - Simo Santavirta (@simppafi) — particle technique
   - David Li — Flow experiment

### Attribution File Location

Create: `/site/src/lib/creative-tech/CREDITS.md`

---

## GPGPU & Fluid Simulation

### 1. amandaghassaei/FluidSimulation
**URL:** https://github.com/amandaghassaei/FluidSimulation
**Demo:** https://apps.amandaghassaei.com/FluidSimulation
**Key Features:**
- Mixed grid-particle fluid simulation
- Cursor-responsive forces
- WebGL shader-based

---

### 2. squarefeet/ShaderParticleEngine
**URL:** https://github.com/squarefeet/ShaderParticleEngine
**Key Features:**
- GPU-based particle effects
- Built for THREE.js
- Frees up CPU cycles

---

### 3. mharrys/fluids-2d
**URL:** https://github.com/mharrys/fluids-2d
**Key Features:**
- Real-time fluid dynamics on GPU
- Three.js integration

---

### 4. amsXYZ/three-fluid-sim
**URL:** https://github.com/amsXYZ/three-fluid-sim
**Key Features:**
- 2D fluid simulation
- References GPU Gems Chapter 38
- Based on Pavel Dobryakov's WebGL-Fluid-Simulation

---

### 5. poeti8/one-million-particles
**URL:** https://github.com/poeti8/one-million-particles
**Key Features:**
- **1,000,000 GPGPU particles**
- All animations with Three.js
- Performance benchmark reference

---

## Custom Shader Materials

### 1. FarazzShaikh/THREE-CustomShaderMaterial
**URL:** https://github.com/FarazzShaikh/THREE-CustomShaderMaterial
**License:** MIT
**Key Features:**
- Extend Three.js standard materials with custom shaders
- Supports Vanilla AND React
- Version 6.4.0

**Note:** Lamina is built on top of this library.

---

### 2. Three.js Shading Language (TSL)
**URL:** https://github.com/mrdoob/three.js/wiki/Three.js-Shading-Language
**Key Features:**
- Easy environment for shader creation
- Renderer-agnostic
- Node-based abstraction

**Use case:** Modern approach to custom shaders in Three.js

---

## Portal & Transition Effects

### 1. MisterPrada/vortex-glass-sphere
**URL:** https://github.com/MisterPrada/vortex-glass-sphere
**Key Features:**
- Procedural vortex in glass sphere
- Uses Three.js Shader Language (TSL)
- 2D shader → texture effects → particles → glass material
- Step-by-step tutorial

**Use case:** Portal entrance effect

---

### 2. sctlcd/threejs-sci-fi-portal-effect
**URL:** https://github.com/sctlcd/threejs-sci-fi-portal-effect
**Key Features:**
- Animated 3D sci-fi portal
- Desktop-focused

---

### 3. zadvorsky/three.portals
**URL:** https://github.com/zadvorsky/three.portals
**Key Features:**
- Portal implementation in THREE.js
- In-scene "window" to different part of virtual world

**Conceptual Note (from Medium article):**
> "A portal is a kind of in-scene 'window' which displays a view into a different part of the virtual world. It has a 'local/source' end close to the player, and a 'remote/destination' end."

---

### 4. Dissolve Effects
**Repos:**
- [magnuswahlstrand/demo-r3f-dissolve-shader](https://github.com/magnuswahlstrand/demo-r3f-dissolve-shader) — R3F dissolve shader
- [kekkorider/flame-dissolve-shader](https://github.com/kekkorider/patreon-tutorial-flame-dissolve-shader) — Flamy dissolve

**Tutorial:**
- [Codrops: Dissolve Effect with Shaders and Particles](https://tympanus.net/codrops/2025/02/17/implementing-a-dissolve-effect-with-shaders-and-particles-in-three-js/)

**Technique:**
- Perlin noise creates continuous dissolve pattern
- Natural-looking transitions
- Works with particles for "evaporation" effect

---

### 5. GL Transitions
**URL:** https://gl-transitions.com/
**Key Features:**
- Collection of WebGL transitions
- Can be used with various frameworks
- Mix and match for custom effects

---

## Glass & Refraction Materials

### 1. MeshPhysicalMaterial (Built-in)
**Location:** Three.js core
**Key Properties:**
```js
{
  roughness: 0,      // Smooth surface
  transmission: 1,   // Fully transmissive
  thickness: 2,      // Creates magnifying effect
  ior: 1.5          // Index of Refraction (glass ~1.5, diamond ~2.4)
}
```

**Note:** Higher performance cost per pixel, but effects are disabled by default.

---

### 2. MeshTransmissionMaterial (Drei)
**Location:** `@react-three/drei`
**Key Features:**
- Layers shaders on top of MeshPhysicalMaterial
- More control over refraction effects
- Built for R3F

**IOR (Index of Refraction):**
- Lower IOR = less refraction
- Higher IOR = more distortion/depth (glass, diamonds)

---

### 3. sachinmotwani02/refractive-fractal-glass-effect
**URL:** https://github.com/sachinmotwani02/refractive-fractal-glass-effect
**Key Features:**
- React + Three.js + R3F
- Dynamic chromatic aberration
- Interactive controls for transmission, thickness, roughness, IOR

**Use case:** The morphin blobs could use glass-like transmission for that liquid feel.

---

### 4. Codrops: Real-time Multiside Refraction
**URL:** https://tympanus.net/codrops/2019/10/29/real-time-multiside-refraction-in-three-steps/
**Key Features:**
- Custom shader approach
- Fresnel equation for reflected/refracted ratio
- Critical angle calculations

---

## Mirror & Recursion Effects

### THREE.Reflector (Built-in)
**Location:** `three/addons/objects/Reflector`
**Limitations:**
- Recursion capped at 3 reflections
- Performance degrades with multiple mirrors
- Each reflection requires scene re-render

**Use case:** Portal frame reflections (limited use)

---

## Audio Visualization

### 1. dcyoung/r3f-audio-visualizer
**URL:** https://github.com/dcyoung/r3f-audio-visualizer
**Demo:** https://dcyoung.github.io/r3f-audio-visualizer/
**Key Features:**
- Interactive audio visualizer
- React + THREE.js
- R3F native

---

### 2. AskAlice/react-three-midi
**URL:** https://github.com/AskAlice/react-three-midi
**Key Features:**
- MIDI and audio analysis
- React-three-fiber integration

---

### 3. Codrops: Audio-Reactive Visuals Tutorial
**URL:** https://tympanus.net/codrops/2023/12/19/creating-audio-reactive-visuals-with-dynamic-particles-in-three-js/
**Key Features:**
- Sync visuals with audio frequencies and tempo
- BPM detection with `web-audio-beat-detector`
- Procedural particle animations

**Relevance:** The Irreal already uses Tone.js for audio — this could sync metaballs with the 40Hz→110Hz drone.

---

## Environment & Lighting

### drei Environment Component
**Location:** `@react-three/drei`
**Key Features:**
- HDRI environment maps
- Image-based lighting (IBL)
- Pre-filtered roughness mipmaps (PMREM)

**Usage:**
```jsx
import { Environment } from '@react-three/drei'

<Environment preset="sunset" background />
// Or with custom HDRI:
<Environment files="path/to/your.hdr" />
```

**Presets available:** sunset, dawn, night, warehouse, forest, apartment, studio, city, park, lobby

---

## Research Sources

- [Codrops Three.js Tag](https://tympanus.net/codrops/tag/three-js/)
- [Maxime Heckel's Shader Studies](https://blog.maximeheckel.com/posts/the-study-of-shaders-with-react-three-fiber/)
- [Three.js Journey](https://threejs-journey.com/)
- [Jamie Wong: Metaballs and WebGL](https://jamie-wong.com/2016/07/06/metaballs-and-webgl/)
- [Codrops: Droplet-like Metaballs](https://tympanus.net/codrops/2025/06/09/how-to-create-interactive-droplet-like-metaballs-with-three-js-and-glsl/)
- [Clicktorelease: Vertex Displacement](https://www.clicktorelease.com/blog/vertex-displacement-noise-3d-webgl-glsl-three-js/)
- [Shader Park Documentation](https://docs.shaderpark.com/references/)

---

*Document created: 2026-01-25*
*For: The Irreal (Beworlding Studio)*
*Purpose: Persistent research for creative tech hybridization*
