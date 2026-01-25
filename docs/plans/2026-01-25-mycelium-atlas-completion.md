# Mycelium Atlas Completion Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Complete the Mycelium Atlas so users can navigate from Threshold → Atlas → individual Worlds, with a living 3D force-directed graph.

**Architecture:** Atlas receives graph data from Astro build → renders 3D nodes (NodeArtifact) + veins (VeinFlow) → SporeRig camera follows hovered/selected nodes → click navigates to /world/[id].

**Tech Stack:** React Three Fiber, Three.js, Zustand, Astro content collections, d3-force for layout

**Current State:** Core components exist (NodeArtifact, VeinFlow, SporeRig) but MyceliumScene is empty—graph data never injected, no nodes rendered.

---

## Task 0: Persist Plan to Git

**Files:**
- Create: `docs/plans/2026-01-25-mycelium-atlas-completion.md`

**Step 1: Copy plan to repo**

```bash
cp ~/.claude/plans/zippy-wishing-truffle.md \
   /home/ungabunga/claude-workspace/PROJECTS-WORKSPACE/The-Irreal/docs/plans/2026-01-25-mycelium-atlas-completion.md
```

**Step 2: Commit the plan**

```bash
cd /home/ungabunga/claude-workspace/PROJECTS-WORKSPACE/The-Irreal
git add docs/plans/2026-01-25-mycelium-atlas-completion.md
git commit -m "docs(plan): mycelium atlas completion plan"
git push origin feature/mycelium-atlas
```

---

## Task 1: Create Atlas Store

**Files:**
- Create: `site/src/stores/atlasStore.ts`

**Step 1: Define store interface**

```typescript
import { create } from 'zustand';

export interface AtlasNode {
  id: string;
  title: string;
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

interface AtlasState {
  nodes: AtlasNode[];
  edges: AtlasEdge[];
  hoveredNodeId: string | null;
  selectedNodeId: string | null;
  cameraTarget: [number, number, number];

  setGraph: (nodes: AtlasNode[], edges: AtlasEdge[]) => void;
  setHoveredNode: (id: string | null) => void;
  selectNode: (id: string | null) => void;
  setCameraTarget: (target: [number, number, number]) => void;
}

export const useAtlasStore = create<AtlasState>((set) => ({
  nodes: [],
  edges: [],
  hoveredNodeId: null,
  selectedNodeId: null,
  cameraTarget: [0, 0, 0],

  setGraph: (nodes, edges) => set({ nodes, edges }),
  setHoveredNode: (id) => set({ hoveredNodeId: id }),
  selectNode: (id) => set({ selectedNodeId: id }),
  setCameraTarget: (target) => set({ cameraTarget: target }),
}));
```

**Step 2: Verify compiles**

Run: `cd site && npx tsc --noEmit`
Expected: No type errors

**Step 3: Commit**

```bash
git add site/src/stores/atlasStore.ts
git commit -m "feat(atlas): create atlasStore for graph state management"
```

---

## Task 2: Implement Force-Directed 3D Layout

**Files:**
- Create: `site/src/lib/forceLayout3D.ts`

**Step 1: Create layout function using d3-force-3d**

```typescript
import { forceSimulation, forceManyBody, forceLink, forceCenter } from 'd3-force-3d';
import type { AtlasNode, AtlasEdge } from '../stores/atlasStore';

interface RawNode {
  id: string;
  title: string;
  biome: string;
  stage: string;
}

export function computeLayout(
  rawNodes: RawNode[],
  edges: AtlasEdge[],
  iterations = 100
): AtlasNode[] {
  // Initialize with random positions
  const nodes = rawNodes.map((n) => ({
    ...n,
    x: (Math.random() - 0.5) * 20,
    y: (Math.random() - 0.5) * 20,
    z: (Math.random() - 0.5) * 20,
  }));

  // Create simulation
  const simulation = forceSimulation(nodes, 3)
    .force('charge', forceManyBody().strength(-50))
    .force('link', forceLink(edges).id((d: any) => d.id).distance(5))
    .force('center', forceCenter(0, 0, 0))
    .stop();

  // Run simulation synchronously
  for (let i = 0; i < iterations; i++) {
    simulation.tick();
  }

  return nodes;
}
```

**Step 2: Install d3-force-3d**

```bash
cd site && npm install d3-force-3d @types/d3-force-3d
```

**Step 3: Verify compiles**

Run: `cd site && npx tsc --noEmit`

**Step 4: Commit**

```bash
git add site/src/lib/forceLayout3D.ts site/package.json site/package-lock.json
git commit -m "feat(atlas): add 3D force-directed layout computation"
```

---

## Task 3: Wire GraphData to MyceliumScene

**Files:**
- Modify: `site/src/components/atlas/MyceliumScene.tsx`
- Modify: `site/src/pages/atlas.astro`

**Step 1: Update MyceliumScene to accept and use graphData**

```typescript
import { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { SporeRig } from './SporeRig';
import { NodeArtifact } from './NodeArtifact';
import { VeinFlow } from './VeinFlow';
import { useAtlasStore } from '../../stores/atlasStore';
import { computeLayout } from '../../lib/forceLayout3D';

interface GraphData {
  nodes: Array<{ id: string; title: string; biome: string; stage: string }>;
  edges: Array<{ source: string; target: string }>;
}

interface MyceliumSceneProps {
  graphData: GraphData;
}

export function MyceliumScene({ graphData }: MyceliumSceneProps) {
  const setGraph = useAtlasStore((s) => s.setGraph);
  const nodes = useAtlasStore((s) => s.nodes);
  const edges = useAtlasStore((s) => s.edges);

  // Compute layout on mount
  useEffect(() => {
    const positioned = computeLayout(graphData.nodes, graphData.edges);
    setGraph(positioned, graphData.edges);
  }, [graphData, setGraph]);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 0, 30], fov: 60 }}>
        <SporeRig />
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} />

        {/* Render nodes */}
        {nodes.map((node) => (
          <NodeArtifact
            key={node.id}
            nodeId={node.id}
            position={[node.x, node.y, node.z]}
            biome={node.biome}
          />
        ))}

        {/* Render veins */}
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
    </div>
  );
}
```

**Step 2: Update atlas.astro to pass graphData**

In atlas.astro, find where MyceliumScene is rendered and pass props:

```astro
<MyceliumScene client:load graphData={graphData} />
```

**Step 3: Verify renders**

Run: `cd site && npm run dev`
Navigate to http://localhost:4321/atlas
Expected: Nodes and veins visible in 3D space

**Step 4: Commit**

```bash
git add site/src/components/atlas/MyceliumScene.tsx site/src/pages/atlas.astro
git commit -m "feat(atlas): wire graph data to MyceliumScene, render nodes and veins"
```

---

## Task 4: Update NodeArtifact for Interaction

**Files:**
- Modify: `site/src/components/atlas/NodeArtifact.tsx`

**Step 1: Add hover and click handlers**

```typescript
import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAtlasStore } from '../../stores/atlasStore';

interface NodeArtifactProps {
  nodeId: string;
  position: [number, number, number];
  biome: string;
}

const BIOME_COLORS: Record<string, string> = {
  lore: '#7c6fe0',
  creation: '#e06f9d',
  reflection: '#6fe0c4',
  play: '#e0c46f',
  deep: '#4a6fe0',
  default: '#9d8fff',
};

export function NodeArtifact({ nodeId, position, biome }: NodeArtifactProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const setHoveredNode = useAtlasStore((s) => s.setHoveredNode);
  const selectNode = useAtlasStore((s) => s.selectNode);
  const setCameraTarget = useAtlasStore((s) => s.setCameraTarget);

  const color = BIOME_COLORS[biome] || BIOME_COLORS.default;

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    // Gentle rotation
    meshRef.current.rotation.y += delta * 0.3;
    // Scale on hover
    const targetScale = hovered ? 1.3 : 1;
    meshRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.1
    );
  });

  const handlePointerEnter = () => {
    setHovered(true);
    setHoveredNode(nodeId);
    setCameraTarget(position);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerLeave = () => {
    setHovered(false);
    setHoveredNode(null);
    document.body.style.cursor = 'default';
  };

  const handleClick = () => {
    selectNode(nodeId);
    // Navigate to world page
    window.location.href = `/world/${nodeId}`;
  };

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
    >
      <icosahedronGeometry args={[0.8, 1]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={hovered ? 0.5 : 0.2}
        roughness={0.3}
        metalness={0.7}
      />
    </mesh>
  );
}
```

**Step 2: Verify interaction**

Run: `npm run dev`
Hover nodes → cursor changes, node scales up
Click node → navigates to /world/[id]

**Step 3: Commit**

```bash
git add site/src/components/atlas/NodeArtifact.tsx
git commit -m "feat(atlas): add hover/click interaction to NodeArtifact"
```

---

## Task 5: Update SporeRig to Follow Camera Target

**Files:**
- Modify: `site/src/components/atlas/SporeRig.tsx`

**Step 1: Make SporeRig follow cameraTarget from store**

```typescript
import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useAtlasStore } from '../../stores/atlasStore';

export function SporeRig() {
  const { camera } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const cameraTarget = useAtlasStore((s) => s.cameraTarget);
  const targetVec = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Mouse parallax
    const parallaxX = state.pointer.x * 3;
    const parallaxY = state.pointer.y * 2;
    groupRef.current.position.x += (parallaxX - groupRef.current.position.x) * 2 * delta;
    groupRef.current.position.y += (parallaxY - groupRef.current.position.y) * 2 * delta;

    // Smooth camera look-at toward target
    targetVec.current.lerp(
      new THREE.Vector3(cameraTarget[0], cameraTarget[1], cameraTarget[2]),
      0.05
    );
    camera.lookAt(targetVec.current);
  });

  return <group ref={groupRef} />;
}
```

**Step 2: Verify camera follows hovered nodes**

Run: `npm run dev`
Hover over different nodes → camera smoothly looks at them

**Step 3: Commit**

```bash
git add site/src/components/atlas/SporeRig.tsx
git commit -m "feat(atlas): SporeRig follows hovered node position"
```

---

## Task 6: Update VeinFlow Props

**Files:**
- Modify: `site/src/components/atlas/VeinFlow.tsx`

**Step 1: Update VeinFlow to accept start/end props**

```typescript
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';

interface VeinFlowProps {
  start: [number, number, number];
  end: [number, number, number];
}

export function VeinFlow({ start, end }: VeinFlowProps) {
  const lineRef = useRef<any>(null);

  const points = useMemo(() => {
    const startVec = new THREE.Vector3(...start);
    const endVec = new THREE.Vector3(...end);
    const mid = startVec.clone().lerp(endVec, 0.5);
    // Add random offset to midpoint for organic curve
    mid.x += (Math.random() - 0.5) * 2;
    mid.y += (Math.random() - 0.5) * 2;
    mid.z += (Math.random() - 0.5) * 2;

    const curve = new THREE.CatmullRomCurve3([startVec, mid, endVec]);
    return curve.getPoints(20);
  }, [start, end]);

  useFrame((_, delta) => {
    if (lineRef.current) {
      lineRef.current.material.dashOffset -= delta * 0.5;
    }
  });

  return (
    <Line
      ref={lineRef}
      points={points}
      color="#6bc5ff"
      lineWidth={1}
      dashed
      dashSize={0.3}
      gapSize={0.2}
    />
  );
}
```

**Step 2: Verify veins render**

Run: `npm run dev`
Expected: Animated dashed lines between connected nodes

**Step 3: Commit**

```bash
git add site/src/components/atlas/VeinFlow.tsx
git commit -m "feat(atlas): VeinFlow accepts start/end positions"
```

---

## Task 7: Add RSS Feed Generation

**Files:**
- Create: `site/src/pages/feed.xml.ts`

**Step 1: Create RSS feed endpoint**

```typescript
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const worlds = await getCollection('worlds');

  return rss({
    title: 'The Irreal',
    description: 'Worlds from the Irreal - a creative studio exploring the edges of reality',
    site: context.site!,
    items: worlds.map((world) => ({
      title: world.data.title,
      pubDate: world.data.date || new Date(),
      description: world.data.description || '',
      link: `/world/${world.id}/`,
      categories: [world.data.biome, world.data.stage].filter(Boolean),
    })),
    customData: `<language>en-us</language>`,
  });
}
```

**Step 2: Install RSS package if needed**

```bash
cd site && npm install @astrojs/rss
```

**Step 3: Update astro.config.mjs to include site URL**

Ensure `site` is set in astro.config.mjs:
```javascript
export default defineConfig({
  site: 'https://the-irreal.vercel.app',
  // ... rest of config
});
```

**Step 4: Verify feed generates**

Run: `npm run build`
Check: `dist/feed.xml` exists and contains world entries

**Step 5: Commit**

```bash
git add site/src/pages/feed.xml.ts site/astro.config.mjs site/package.json
git commit -m "feat(content): add RSS feed generation at /feed.xml"
```

---

## Task 8: Clean Up Warnings

**Files:**
- Modify: `site/src/pages/atlas.astro` (remove unused graphData variable if still present after wiring)
- Modify: `site/src/components/atlas/SporeRig.tsx` (use `state.pointer` instead of deprecated `state.mouse`)

**Step 1: Fix deprecation warning in SporeRig**

Change `state.mouse` to `state.pointer` (already done in Task 5)

**Step 2: Remove any remaining unused variables**

Run: `cd site && npm run build`
Check for warnings, fix any remaining unused imports

**Step 3: Commit**

```bash
git add -A
git commit -m "chore(atlas): clean up warnings and unused code"
```

---

## Task 9: Final Verification

**Step 1: Run full build**

```bash
cd site && npm run build
```

Expected: Build succeeds with no errors

**Step 2: Run dev server and test flow**

```bash
npm run dev
```

**Manual testing checklist:**

- [ ] Navigate to / (Threshold)
- [ ] Wait for portals to appear
- [ ] Click "Mycelium Atlas" portal
- [ ] Verify crossing animation plays
- [ ] Arrive at /atlas
- [ ] See 3D nodes positioned in space
- [ ] See veins connecting nodes
- [ ] Hover node → cursor changes, node scales, camera looks at it
- [ ] Click node → navigates to /world/[id]
- [ ] Visit /feed.xml → RSS feed renders

**Step 3: Commit verification**

```bash
git commit --allow-empty -m "chore(atlas): verified mycelium atlas completion"
```

**Step 4: Push to remote**

```bash
git push origin feature/mycelium-atlas
```

---

## Verification Commands

```bash
# Type check
cd site && npx tsc --noEmit

# Build
npm run build

# Dev server
npm run dev

# Check RSS feed
curl http://localhost:4321/feed.xml
```

---

## Deferred to Next Phase

- Node labels (troika-three-text or Html overlay)
- Biome-specific node geometries (not just icosahedron)
- Node hover preview panels
- CYOA choice blocks in world pages
- Collectible sigils/unlocks
- Sound spatialization
- Bridgy Fed fediverse integration
- GPU instancing for large graphs
- Layer A fallback (2D SVG for reduced motion)
