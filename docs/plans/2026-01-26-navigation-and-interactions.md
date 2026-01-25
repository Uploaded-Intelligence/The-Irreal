# The Irreal: Navigation and Interactions Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix broken navigation, implement promised interactions, enhance content experience.

**Architecture:** Fix NodeArtifact click handler → Add OrbitControls for drag/zoom → Pass real content to previews → Contextual back navigation.

**Tech Stack:** Astro 5.x | React 19 | Three.js + R3F + Drei | Zustand | Vercel

**Scope:** Phases 1-3 (Critical fix + Interactions + Content). Phases 4-5 deferred.

---

## Pre-Implementation: Persist Plan to Repo

**BEFORE starting Phase 1, commit this plan to the canonical location:**

```bash
cd /home/ungabunga/claude-workspace/PROJECTS-WORKSPACE/The-Irreal
cp ~/.claude/plans/polymorphic-puzzling-bonbon.md docs/plans/2026-01-26-navigation-and-interactions.md
git add docs/plans/2026-01-26-navigation-and-interactions.md
git commit -m "docs(plan): navigation and interactions implementation plan"
```

---

## The Bugs (Root Cause Analysis)

| Issue | Location | Root Cause |
|-------|----------|------------|
| Can't navigate to worlds | `NodeArtifact.tsx:82` | `window.location.href` commented out |
| No drag/scroll | `SporeRig.tsx` | No OrbitControls, only parallax |
| Back always goes to "/" | `atlas.astro:48` | Hardcoded href |
| Preview shows ID not title | `NodeArtifact.tsx:119` | `{nodeId}` instead of `{title}` |

---

## Phase 1: Critical Navigation Fix

**Objective:** Users can click nodes and navigate to world pages.
**Verification:** Click any node → arrive at `/world/{id}` page.

### Task 1.1: Enable Node Click Navigation

**Files:**
- Modify: `site/src/components/atlas/NodeArtifact.tsx`

**Step 1: Uncomment navigation**

Find line 82:
```typescript
const handleClick = () => {
  selectNode(nodeId);
  // Deep jump if clicked
  // window.location.href = `/world/${nodeId}`;
};
```

Change to:
```typescript
const handleClick = () => {
  selectNode(nodeId);
  window.location.href = `/world/${nodeId}`;
};
```

**Step 2: Verify navigation works**

Run: `cd site && bun dev`
Navigate to: http://localhost:4321/atlas
Click any node → should navigate to `/world/{id}`

**Step 3: Commit**

```bash
git add site/src/components/atlas/NodeArtifact.tsx
git commit -m "fix(atlas): enable node click navigation"
```

---

## Phase 2: Promised Interactions

**Objective:** Implement "Drag to explore. Scroll to zoom." as UI promises.
**Verification:** Drag rotates camera, scroll zooms, keyboard cycles nodes.

### Task 2.1: Add OrbitControls for Drag and Zoom

**Files:**
- Modify: `site/src/components/atlas/SporeRig.tsx`

**Step 1: Add OrbitControls import**

```typescript
import { OrbitControls } from '@react-three/drei';
```

**Step 2: Add controls to SporeRig return**

```typescript
export function SporeRig() {
  // ... existing code ...

  return (
    <>
      <group ref={groupRef} />
      <OrbitControls
        enablePan={false}
        enableRotate={true}
        enableZoom={true}
        dampingFactor={0.05}
        enableDamping
        minDistance={15}
        maxDistance={80}
        rotateSpeed={0.3}
        zoomSpeed={0.5}
      />
    </>
  );
}
```

**Step 3: Verify interactions**

- Drag on empty space → camera rotates around center
- Scroll → camera zooms in/out
- Node hover/click still works

**Step 4: Commit**

```bash
git add site/src/components/atlas/SporeRig.tsx
git commit -m "feat(atlas): add drag-to-explore and scroll-to-zoom"
```

---

### Task 2.2: Add Keyboard Navigation

**Files:**
- Modify: `site/src/stores/atlasStore.ts`
- Modify: `site/src/components/atlas/MyceliumScene.tsx`

**Step 1: Add keyboard state to store**

In `atlasStore.ts`, add to interface and store:

```typescript
interface AtlasState {
  // ... existing ...
  focusedIndex: number;
  focusNextNode: () => void;
  focusPrevNode: () => void;
}

// In create():
focusedIndex: -1,
focusNextNode: () => set((state) => ({
  focusedIndex: (state.focusedIndex + 1) % state.nodes.length,
  selectedNodeId: state.nodes[(state.focusedIndex + 1) % state.nodes.length]?.id || null,
})),
focusPrevNode: () => set((state) => ({
  focusedIndex: state.focusedIndex <= 0 ? state.nodes.length - 1 : state.focusedIndex - 1,
  selectedNodeId: state.nodes[state.focusedIndex <= 0 ? state.nodes.length - 1 : state.focusedIndex - 1]?.id || null,
})),
```

**Step 2: Add keyboard handler to MyceliumScene**

```typescript
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        focusNextNode();
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        focusPrevNode();
        break;
      case 'Enter':
        if (selectedNodeId) {
          window.location.href = `/world/${selectedNodeId}`;
        }
        break;
      case 'Escape':
        selectNode(null);
        break;
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [focusNextNode, focusPrevNode, selectedNodeId, selectNode]);
```

**Step 3: Commit**

```bash
git add site/src/stores/atlasStore.ts site/src/components/atlas/MyceliumScene.tsx
git commit -m "feat(atlas): add keyboard navigation (arrows + enter)"
```

---

## Phase 3: Content Experience

**Objective:** Show real content in previews, contextual back navigation.
**Verification:** Preview shows title/summary, back button respects history.

### Task 3.1: Fix Content Preview to Show Real Titles

**Files:**
- Modify: `site/src/stores/atlasStore.ts`
- Modify: `site/src/pages/atlas.astro`
- Modify: `site/src/components/atlas/MyceliumScene.tsx`
- Modify: `site/src/components/atlas/NodeArtifact.tsx`

**Step 1: Add summary to AtlasNode interface**

In `atlasStore.ts`:
```typescript
export interface AtlasNode {
  id: string;
  title: string;
  summary?: string;  // ADD THIS
  biome: string;
  stage: string;
  x: number;
  y: number;
  z: number;
}
```

**Step 2: Pass summary in atlas.astro graph construction**

Find where `graphData.nodes` is built, ensure `summary` is included:
```typescript
nodes: worlds.map((w) => ({
  id: w.id,
  title: w.data.title,
  summary: w.data.summary,  // ADD THIS
  biome: w.data.biome,
  stage: w.data.stage,
})),
```

**Step 3: Pass title and summary to NodeArtifact**

In `MyceliumScene.tsx`:
```tsx
<NodeArtifact
  key={node.id}
  nodeId={node.id}
  title={node.title}      // ADD
  summary={node.summary}  // ADD
  position={[node.x, node.y, node.z]}
  biome={node.biome}
/>
```

**Step 4: Update NodeArtifact props and preview**

In `NodeArtifact.tsx`:
```typescript
interface NodeArtifactProps {
  nodeId: string;
  title: string;          // ADD
  summary?: string;       // ADD
  position: [number, number, number];
  biome: string;
}

// In the Html bloom overlay:
<h3>{title}</h3>
<p>{summary || 'Click to explore'}</p>
```

**Step 5: Commit**

```bash
git add site/src/stores/atlasStore.ts site/src/pages/atlas.astro \
       site/src/components/atlas/MyceliumScene.tsx \
       site/src/components/atlas/NodeArtifact.tsx
git commit -m "fix(atlas): show real titles and summaries in node preview"
```

---

### Task 3.2: Improve Back Navigation

**Files:**
- Modify: `site/src/pages/world/[id].astro`

**Step 1: Use history.back() for contextual navigation**

Find the back link in footer:
```astro
<a href="/atlas">← Back to Atlas</a>
```

Change to:
```astro
<a href="javascript:history.back()" class="back">← Back</a>
```

Or with fallback:
```astro
<script>
  const backLink = document.querySelector('.back-link');
  if (backLink) {
    backLink.addEventListener('click', (e) => {
      e.preventDefault();
      if (document.referrer.includes(window.location.origin)) {
        history.back();
      } else {
        window.location.href = '/atlas';
      }
    });
  }
</script>
<a href="/atlas" class="back-link">← Back</a>
```

**Step 2: Commit**

```bash
git add site/src/pages/world/[id].astro
git commit -m "fix(navigation): contextual back navigation using history"
```

---

## Phase 4: Gemini's Deferred Enhancements

**Objective:** Implement features from Gemini's deferred list.
**Verification:** Labels visible, biome shapes vary, enhanced previews.

### Task 4.1: Add Node Labels

**Files:**
- Modify: `site/src/components/atlas/NodeArtifact.tsx`

**Step 1: Add Text component for label**

```typescript
import { Html } from '@react-three/drei';

// Below the mesh, inside the returned group:
<Html
  position={[0, -1.5, 0]}
  center
  distanceFactor={15}
  style={{ opacity: bloom > 0.3 ? 1 : 0.6 }}
>
  <div style={{
    fontSize: '12px',
    color: '#c8c8d4',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    textShadow: '0 0 8px rgba(0,0,0,0.8)',
  }}>
    {title}
  </div>
</Html>
```

**Step 2: Commit**

```bash
git add site/src/components/atlas/NodeArtifact.tsx
git commit -m "feat(atlas): add node labels below artifacts"
```

---

### Task 4.2: Biome-Specific Geometries

**Files:**
- Modify: `site/src/components/atlas/NodeArtifact.tsx`

**Step 1: Create geometry selector function**

```typescript
const BIOME_GEOMETRIES: Record<string, JSX.Element> = {
  threshold: <torusGeometry args={[0.6, 0.2, 16, 32]} />,
  lore: <dodecahedronGeometry args={[0.8]} />,
  creation: <coneGeometry args={[0.6, 1.2, 8]} />,
  reflection: <sphereGeometry args={[0.7, 32, 32]} />,
  play: <octahedronGeometry args={[0.8]} />,
  deep: <tetrahedronGeometry args={[0.9]} />,
  default: <icosahedronGeometry args={[0.8, 1]} />,
};

// In mesh:
<mesh ref={meshRef} position={position} ...>
  {BIOME_GEOMETRIES[biome] || BIOME_GEOMETRIES.default}
  <meshStandardMaterial ... />
</mesh>
```

**Step 2: Commit**

```bash
git add site/src/components/atlas/NodeArtifact.tsx
git commit -m "feat(atlas): biome-specific node geometries"
```

---

## Phase 5: Polish and Accessibility

**Objective:** Reduced motion support, focus indicators, loading state.
**Verification:** Respects prefers-reduced-motion, keyboard focus visible.

### Task 5.1: Reduced Motion Support

**Files:**
- Modify: `site/src/components/atlas/SporeRig.tsx`
- Modify: `site/src/components/atlas/NodeArtifact.tsx`

**Step 1: Check preference and reduce animation**

```typescript
const prefersReducedMotion = typeof window !== 'undefined'
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// In useFrame:
if (prefersReducedMotion) {
  // Skip rotation animation
  return;
}
```

**Step 2: Commit**

```bash
git add site/src/components/atlas/SporeRig.tsx site/src/components/atlas/NodeArtifact.tsx
git commit -m "feat(atlas): respect prefers-reduced-motion"
```

---

## Verification Checklist

### Phase 1
- [ ] Click node → navigates to `/world/{id}`

### Phase 2
- [ ] Drag to rotate camera works
- [ ] Scroll to zoom works
- [ ] Arrow keys cycle through nodes
- [ ] Enter navigates to focused node

### Phase 3
- [ ] Preview shows real title (not ID)
- [ ] Preview shows summary
- [ ] Back button uses history

### Phase 4
- [ ] Labels visible below nodes
- [ ] Different biomes have different shapes

### Phase 5
- [ ] Reduced motion disables animations
- [ ] Focus indicators visible

---

## Critical Files

| File | Purpose |
|------|---------|
| `site/src/components/atlas/NodeArtifact.tsx` | THE BUG + preview + geometry |
| `site/src/components/atlas/SporeRig.tsx` | Camera controls |
| `site/src/stores/atlasStore.ts` | Graph state + keyboard nav |
| `site/src/components/atlas/MyceliumScene.tsx` | Scene composition |
| `site/src/pages/atlas.astro` | Graph data assembly |
| `site/src/pages/world/[id].astro` | Back navigation |

---

## Post-Implementation: Update SESSION-STATE.md

**AFTER completing implementation, update SESSION-STATE.md:**

```markdown
### Claude's Last Session
- **Date**: 2026-01-26 (navigation fix session)
- **Work done**:
  - Phase 1: Fixed NodeArtifact click handler (uncommented navigation)
  - Phase 2: Added OrbitControls (drag-to-explore, scroll-to-zoom), keyboard nav
  - Phase 3: Fixed content preview (real titles/summaries), contextual back nav
  - Created implementation plan for future phases
- **PRs opened**: [TBD after implementation]
- **Branches touched**: main or feature/navigation-fix
- **Next steps planned**: Phases 4-5 (node labels, biome geometries, accessibility)

### Context for Next LLM
- **Navigation now works**: Clicking nodes navigates to /world/{id}
- **Interactions added**: Drag to rotate, scroll to zoom, arrow keys to cycle
- **Content preview fixed**: Shows real titles and summaries
- **Deferred**: Node labels, biome geometries, reduced motion support (see Phase 4-5)
```

```bash
git add SESSION-STATE.md
git commit -m "docs: update SESSION-STATE.md with navigation fix session"
git push origin main
```

---

## Verification Commands

```bash
# Dev server
cd site && bun dev

# Build test
bun run build

# Type check
bunx tsc --noEmit
```
