# THE IRREAL: PHASED IMPLEMENTATION PLAN
## From Current State to Living World

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Current State**: Milestone 1 foundation (Astro + MDX + 2D graph)
**Next Phase**: Enhanced Threshold + immersive transitions
**Long-term**: Complete technical spec (saved separately)

---

## CURRENT ARCHITECTURE (What Exists)

**Stack:**
- Astro 5.0 (static site generator)
- MDX 4.0 (content)
- React 19.0 (islands - only Atlas.tsx)
- TypeScript 5.7

**What's Built:**
- ✅ Content schema (Zod, frontmatter: biome, stage, connections, choices)
- ✅ 4 navigation surfaces (Threshold, Atlas, Grove, World pages)
- ✅ 2 seed worlds (first-light, the-grove-awaits)
- ✅ 2D force-directed graph (SVG, manual physics)
- ✅ Color system (dark, atmospheric)

**What's Missing:**
- ❌ 3D scenes (no Three.js/R3F)
- ❌ Audio system (no Tone.js)
- ❌ State management (no Zustand)
- ❌ Real-time presence (no WebSocket)
- ❌ Federation (no ActivityPub)
- ❌ Immersive transitions

---

## PHASED APPROACH

### Phase 1: Enhanced Threshold (Week 1-2) ← **WE ARE HERE**
Make crossing into The Irreal feel significant

### Phase 2: Living Mycelium (Week 3-4)
Atlas becomes organic and alive

### Phase 3: Biome Territories (Week 5-6)
Each biome feels distinct

### Phase 4: Witness Circuit (Week 7-8)
Guestbook + traces + presence

### Phase 5: Complete Vision (Week 9-12)
Full technical spec implementation

---

## PHASE 1: ENHANCED THRESHOLD

**Goal:** Threshold produces "I'm entering a world" feeling (no 3D yet)

**Current Threshold** (`/src/pages/index.astro`):
- Static page with title + 2 portal links
- Instant page load (no ritual)
- No emergence, no depth, no feeling

**Enhanced Threshold Will Have:**
1. Void emergence (CSS + particles)
2. Typography crystallization (GSAP animation)
3. Portal breathing (subtle scale pulse)
4. Smooth transitions (View Transitions API)
5. Particle system (Canvas 2D, no Three.js yet)

---

### Task 1: Install Dependencies

**Files:**
- Modify: `/Users/dea/claude-test/The-Irreal/site/package.json`

**Step 1: Add GSAP for animations**

```bash
cd /Users/dea/claude-test/The-Irreal/site
npm install gsap
```

**Expected:** Package installed, package.json updated

**Step 2: Add View Transitions API types**

```bash
npm install --save-dev @types/dom-view-transitions
```

**Expected:** Types available for View Transitions

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat(threshold): add GSAP and View Transitions types"
```

---

### Task 2: Create Particle System Component

**Files:**
- Create: `/Users/dea/claude-test/The-Irreal/site/src/components/threshold/ParticleField.tsx`

**Step 1: Create component file**

```typescript
import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Initialize particles
    const particleCount = 100;
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.3
    }));

    // Animation loop
    const animate = () => {
      ctx.fillStyle = 'rgba(10, 10, 15, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach(particle => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle
        ctx.fillStyle = `rgba(124, 111, 224, ${particle.opacity})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none'
      }}
    />
  );
}
```

**Step 2: Test it renders**

Update `/Users/dea/claude-test/The-Irreal/site/src/pages/index.astro` temporarily:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { ParticleField } from '../components/threshold/ParticleField';
---

<BaseLayout title="The Irreal — Threshold">
  <ParticleField client:load />
  <div>Test</div>
</BaseLayout>
```

**Run:** `npm run dev` and visit `http://localhost:4321`

**Expected:** Particles visible, moving smoothly

**Step 3: Commit**

```bash
git add src/components/threshold/ParticleField.tsx src/pages/index.astro
git commit -m "feat(threshold): add particle field component"
```

---

### Task 3: Create Emergence Animation Component

**Files:**
- Create: `/Users/dea/claude-test/The-Irreal/site/src/components/threshold/EmergenceText.tsx`

**Step 1: Create component**

```typescript
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export function EmergenceText() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const title = containerRef.current.querySelector('.title');
    const subtitle = containerRef.current.querySelector('.subtitle');

    // Timeline for emergence
    const tl = gsap.timeline({ delay: 0.5 });

    tl.from(title, {
      opacity: 0,
      scale: 0.95,
      filter: 'blur(20px)',
      duration: 2,
      ease: 'power2.out'
    })
    .from(subtitle, {
      opacity: 0,
      y: 20,
      duration: 1.5,
      ease: 'power2.out'
    }, '-=1');

  }, []);

  return (
    <div ref={containerRef} style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
      <h1 className="title" style={{
        fontSize: '3rem',
        fontWeight: 300,
        letterSpacing: '0.2em',
        marginBottom: '1rem',
        background: 'linear-gradient(135deg, #7c6fe0 0%, #9d8fff 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}>
        The Irreal
      </h1>
      <p className="subtitle" style={{
        color: 'var(--text-dim)',
        fontSize: '1.1rem',
        fontWeight: 300
      }}>
        A navigable world of knowledge, creation, and becoming
      </p>
    </div>
  );
}
```

**Step 2: Test emergence**

Update `index.astro`:

```astro
<BaseLayout title="The Irreal — Threshold">
  <ParticleField client:load />
  <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center;">
    <EmergenceText client:load />
  </div>
</BaseLayout>
```

**Run:** Reload page

**Expected:** Text emerges smoothly from void

**Step 3: Commit**

```bash
git add src/components/threshold/EmergenceText.tsx src/pages/index.astro
git commit -m "feat(threshold): add emergence text animation"
```

---

### Task 4: Create Breathing Portal Component

**Files:**
- Create: `/Users/dea/claude-test/The-Irreal/site/src/components/threshold/Portal.tsx`

**Step 1: Create component**

```typescript
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface PortalProps {
  href: string;
  icon: string;
  label: string;
  hint: string;
}

export function Portal({ href, icon, label, hint }: PortalProps) {
  const portalRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!portalRef.current) return;

    // Breathing animation (subtle scale pulse)
    gsap.to(portalRef.current, {
      scale: 1.02,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

  }, []);

  const handleMouseEnter = () => {
    if (!portalRef.current) return;
    gsap.to(portalRef.current, {
      scale: 1.05,
      duration: 0.3,
      ease: 'power2.out',
      overwrite: true
    });
  };

  const handleMouseLeave = () => {
    if (!portalRef.current) return;
    gsap.to(portalRef.current, {
      scale: 1,
      duration: 0.6,
      ease: 'power2.out',
      overwrite: true
    });

    // Resume breathing
    gsap.to(portalRef.current, {
      scale: 1.02,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 0.6
    });
  };

  return (
    <a
      ref={portalRef}
      href={href}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '2rem 3rem',
        background: 'var(--surface)',
        border: '1px solid var(--muted)',
        borderRadius: '8px',
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
        textDecoration: 'none',
        cursor: 'pointer'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.borderColor = 'var(--accent)';
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(124, 111, 224, 0.2)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.borderColor = 'var(--muted)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <span style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{icon}</span>
      <span style={{ fontSize: '1.2rem', color: 'var(--text)', marginBottom: '0.25rem' }}>{label}</span>
      <span style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>{hint}</span>
    </a>
  );
}
```

**Step 2: Test portal breathing**

Update `index.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { ParticleField } from '../components/threshold/ParticleField';
import { EmergenceText } from '../components/threshold/EmergenceText';
import { Portal } from '../components/threshold/Portal';
import { getCollection } from 'astro:content';

const worlds = await getCollection('worlds', ({ data }) => !data.draft);
---

<BaseLayout title="The Irreal — Threshold">
  <ParticleField client:load />

  <div style="min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4rem; padding: 2rem;">
    <EmergenceText client:load />

    <div style="display: flex; gap: 2rem; flex-wrap: wrap; justify-content: center;">
      <Portal
        client:load
        href="/atlas"
        icon="🕸"
        label="Mycelium Atlas"
        hint={`${worlds.length} worlds to explore`}
      />

      <Portal
        client:load
        href="/grove"
        icon="🌲"
        label="The Grove"
        hint="All worlds, listed"
      />
    </div>

    <footer style="position: fixed; bottom: 2rem; text-align: center; color: var(--text-dim); font-size: 0.9rem; font-style: italic; opacity: 0.6;">
      <p>You have arrived. Look around. Where does your curiosity pull?</p>
    </footer>
  </div>
</BaseLayout>
```

**Run:** Reload page

**Expected:**
- Particles flowing
- Text emerges
- Portals breathe (subtle scale pulse)
- Hover = brightness + scale increase

**Step 3: Commit**

```bash
git add src/components/threshold/Portal.tsx src/pages/index.astro
git commit -m "feat(threshold): add breathing portal components"
```

---

### Task 5: Add View Transitions

**Files:**
- Modify: `/Users/dea/claude-test/The-Irreal/site/src/layouts/BaseLayout.astro`

**Step 1: Enable View Transitions API**

Edit `BaseLayout.astro`, add to `<head>`:

```astro
---
// ... existing imports
import { ViewTransitions } from 'astro:transitions';
---

<!doctype html>
<html lang="en">
  <head>
    <!-- ... existing head content -->
    <ViewTransitions />
  </head>
  <body>
    <slot />
  </body>
</html>
```

**Step 2: Test transitions**

**Run:** Navigate from Threshold → Atlas → Back

**Expected:** Smooth cross-fade between pages (no hard reload)

**Step 3: Commit**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "feat(threshold): enable View Transitions for smooth page changes"
```

---

## PHASE 1 COMPLETE - SUCCESS CRITERIA

Test the complete Threshold experience:

1. **Visit** `http://localhost:4321/`
2. **Observe**:
   - Particles flowing in void
   - "The Irreal" emerges smoothly (not instant)
   - Portals breathe (subtle pulse)
   - Hover on portal = responds (scale + glow)
   - Click portal = smooth transition (no hard reload)

**Does it produce "I'm entering a world" feeling?**
- If YES → Phase 1 complete, move to Phase 2
- If NO → Iterate on animations, timing, particle density

---

## NEXT STEPS

**Immediate:**
1. Test Phase 1 implementation
2. Gather feedback on "felt experience"
3. Adjust timing/intensity as needed

**Phase 2 Preparation:**
- Install Three.js/R3F for 3D Mycelium
- Plan force-directed graph in 3D space
- Design camera controls

---

## TECHNICAL REFERENCE

The complete technical specification (full vision, all 12 systems) has been saved to:
`/Users/dea/claude-test/The-Irreal/docs/plans/2026-01-03-irreal-complete-vision.md`

Consult this document for:
- Complete type system
- 3D graphics architecture
- Audio system design
- State management patterns
- Performance budgets
- Testing strategies

---

**Phase 1 focuses on making the current 2D implementation immersive.**
**Future phases will incrementally add 3D, audio, presence, and federation.**
4. **3D system architecture** (scenes, shaders, optimization)
5. **Audio engine design** (synthesis, spatialization, management)
6. **State management** (stores, actions, sync)
7. **Networking protocols** (WebSocket, ActivityPub, federation)
8. **Performance budgets** (bundles, rendering, memory)
9. **Testing strategies** (unit, integration, E2E)
10. **Build & deployment** (configuration, environments, CI/CD)

---

## PART 1: PROJECT ARCHITECTURE

### Complete File Structure

```
/The-Irreal
├── /site                           # Astro frontend
│   ├── astro.config.mjs           # Astro configuration
│   ├── tsconfig.json              # TypeScript configuration
│   ├── package.json               # Dependencies
│   │
│   ├── /src
│   │   ├── /content               # Content collections
│   │   │   └── /worlds
│   │   │       └── *.mdx          # World MDX files
│   │   │
│   │   ├── /pages                 # Astro routes
│   │   │   ├── index.astro        # Threshold
│   │   │   ├── atlas.astro        # Mycelium Atlas
│   │   │   ├── grove.astro        # List view
│   │   │   ├── witness.astro      # Guestbook
│   │   │   └── /world
│   │   │       └── [id].astro     # Individual worlds
│   │   │
│   │   ├── /components
│   │   │   ├── /core              # Core reusable components
│   │   │   │   ├── BaseLayout.astro
│   │   │   │   ├── Head.astro
│   │   │   │   └── SEO.astro
│   │   │   │
│   │   │   ├── /threshold         # Threshold experience
│   │   │   │   ├── ThresholdScene.tsx        # Main component
│   │   │   │   ├── VoidScene.tsx             # Three.js void + particles
│   │   │   │   ├── EmergenceText.tsx         # Typography crystallization
│   │   │   │   ├── Portal.tsx                # Portal component
│   │   │   │   ├── PortalShader.tsx          # WebGL shader wrapper
│   │   │   │   └── /shaders
│   │   │   │       ├── portal.vert.ts        # Vertex shader
│   │   │   │       └── portal.frag.ts        # Fragment shader
│   │   │   │
│   │   │   ├── /atlas             # Mycelium visualization
│   │   │   │   ├── MyceliumScene.tsx         # Main 3D scene
│   │   │   │   ├── WorldNode.tsx             # Individual nodes
│   │   │   │   ├── Connection.tsx            # Thread between nodes
│   │   │   │   ├── CameraController.tsx      # Pan/zoom/select
│   │   │   │   ├── Oracle.tsx                # AI interface
│   │   │   │   └── PresenceLayer.tsx         # Real-time visitors
│   │   │   │
│   │   │   ├── /world             # World pages
│   │   │   │   ├── BiomeContainer.tsx        # Biome wrapper
│   │   │   │   ├── GrowthWrapper.tsx         # Growth state encoding
│   │   │   │   ├── WorldContent.tsx          # MDX renderer
│   │   │   │   ├── InlineChoices.tsx         # CYOA choices
│   │   │   │   ├── ReadingPresence.tsx       # Show other readers
│   │   │   │   ├── ProgressGauge.tsx         # Scroll depth
│   │   │   │   └── Echoes.tsx                # Federated responses
│   │   │   │
│   │   │   ├── /witness           # Guestbook
│   │   │   │   ├── GuestbookScene.tsx        # Constellation view
│   │   │   │   ├── MessageNode.tsx           # Individual trace
│   │   │   │   ├── TraceForm.tsx             # Leave trace UI
│   │   │   │   └── TraceFilter.tsx           # Filter controls
│   │   │   │
│   │   │   ├── /audio             # Audio system
│   │   │   │   ├── AudioEngine.tsx           # Tone.js engine
│   │   │   │   ├── BiomeSoundscape.tsx       # Generative audio
│   │   │   │   ├── SoundEffects.tsx          # Event sounds
│   │   │   │   └── AudioControls.tsx         # User controls
│   │   │   │
│   │   │   ├── /transitions       # Page transitions
│   │   │   │   ├── PortalTransition.tsx      # Portal expansion
│   │   │   │   ├── VoidTransition.tsx        # Void between worlds
│   │   │   │   └── BiomeCrossFade.tsx        # Biome shifts
│   │   │   │
│   │   │   └── /ui                # UI components
│   │   │       ├── Button.tsx
│   │   │       ├── Modal.tsx
│   │   │       ├── Tooltip.tsx
│   │   │       └── PresenceIndicator.tsx
│   │   │
│   │   ├── /lib                   # Utilities & core logic
│   │   │   ├── /physics
│   │   │   │   ├── forceGraph.ts             # Force-directed layout
│   │   │   │   ├── particles.ts              # Particle system
│   │   │   │   └── spatial.ts                # Spatial helpers
│   │   │   │
│   │   │   ├── /biomes
│   │   │   │   ├── config.ts                 # Biome configurations
│   │   │   │   ├── palette.ts                # Color palettes
│   │   │   │   ├── typography.ts             # Typography specs
│   │   │   │   └── audio.ts                  # Audio parameters
│   │   │   │
│   │   │   ├── /content
│   │   │   │   ├── schema.ts                 # Content collection schemas
│   │   │   │   ├── graph.ts                  # Build world graph
│   │   │   │   └── mdx.ts                    # MDX processing
│   │   │   │
│   │   │   ├── /networking
│   │   │   │   ├── websocket.ts              # WebSocket client
│   │   │   │   ├── presence.ts               # Presence protocol
│   │   │   │   └── federation.ts             # ActivityPub client
│   │   │   │
│   │   │   ├── /storage
│   │   │   │   ├── localStorage.ts           # Browser storage
│   │   │   │   ├── indexedDB.ts              # Large data storage
│   │   │   │   └── cache.ts                  # Cache management
│   │   │   │
│   │   │   ├── /ai
│   │   │   │   ├── oracle.ts                 # Claude API client
│   │   │   │   └── prompts.ts                # Oracle prompts
│   │   │   │
│   │   │   └── /utils
│   │   │       ├── time.ts                   # Time utilities
│   │   │       ├── seasons.ts                # Seasonal calculations
│   │   │       ├── animation.ts              # Animation helpers
│   │   │       └── performance.ts            # Performance monitoring
│   │   │
│   │   ├── /stores                # State management (Zustand)
│   │   │   ├── presenceStore.ts              # Real-time presence
│   │   │   ├── userStore.ts                  # User path/anchors
│   │   │   ├── audioStore.ts                 # Audio state
│   │   │   └── appStore.ts                   # Global app state
│   │   │
│   │   ├── /styles
│   │   │   ├── global.css                    # Global styles
│   │   │   ├── reset.css                     # CSS reset
│   │   │   ├── tokens.css                    # Design tokens
│   │   │   ├── /biomes
│   │   │   │   ├── threshold.css
│   │   │   │   ├── lore.css
│   │   │   │   ├── creation.css
│   │   │   │   ├── reflection.css
│   │   │   │   ├── play.css
│   │   │   │   └── deep.css
│   │   │   └── /components
│   │   │       └── *.module.css              # Component styles
│   │   │
│   │   └── /types                 # TypeScript types
│   │       ├── world.ts                      # World types
│   │       ├── biome.ts                      # Biome types
│   │       ├── presence.ts                   # Presence types
│   │       ├── audio.ts                      # Audio types
│   │       └── federation.ts                 # ActivityPub types
│   │
│   └── /public
│       ├── /fonts                            # Variable fonts
│       ├── /textures                         # Canvas, parchment
│       ├── /audio                            # Sound files
│       └── /.well-known
│           └── webfinger                     # ActivityPub discovery
│
├── /federation-server          # ActivityPub server (Node.js)
│   ├── package.json
│   ├── tsconfig.json
│   ├── /src
│   │   ├── index.ts                          # Server entry
│   │   ├── /routes
│   │   │   ├── actor.ts                      # Actor endpoint
│   │   │   ├── inbox.ts                      # Receive activities
│   │   │   ├── outbox.ts                     # Send activities
│   │   │   └── webfinger.ts                  # Discovery
│   │   ├── /lib
│   │   │   ├── activitypub.ts                # ActivityPub logic
│   │   │   ├── signature.ts                  # HTTP signatures
│   │   │   └── storage.ts                    # DB interface
│   │   └── /db
│   │       ├── schema.sql                    # Database schema
│   │       └── queries.ts                    # DB queries
│   └── /.env                                 # Environment variables
│
├── /presence-server            # WebSocket presence server
│   ├── package.json
│   ├── tsconfig.json
│   └── /src
│       ├── index.ts                          # Socket.io server
│       ├── /handlers
│       │   ├── connection.ts                 # Connection handling
│       │   ├── presence.ts                   # Presence updates
│       │   └── worlds.ts                     # World join/leave
│       └── /lib
│           ├── rooms.ts                      # Room management
│           └── broadcast.ts                  # Broadcast helpers
│
├── /docs
│   ├── /plans
│   │   ├── 2026-01-03-irreal-complete-vision.md
│   │   └── 2026-01-03-technical-spec.md     # This document
│   ├── /architecture
│   │   ├── data-flow.md
│   │   ├── 3d-system.md
│   │   └── audio-system.md
│   └── /api
│       ├── websocket-protocol.md
│       └── activitypub-endpoints.md
│
├── /scripts
│   ├── build-graph.ts                        # Generate graph.json
│   ├── validate-content.ts                   # Validate MDX
│   └── deploy.ts                             # Deployment script
│
└── /tests
    ├── /unit
    ├── /integration
    └── /e2e
```

### Module Boundaries

**Principle**: Clear separation of concerns, minimal coupling

1. **Content Layer** (`/src/content`, `/src/lib/content`)
   - Owns: World data, graph structure, MDX processing
   - Exports: World objects, graph data
   - Imports: None (pure data)

2. **3D Graphics** (`/src/components/threshold`, `/src/components/atlas`)
   - Owns: Three.js scenes, shaders, particles
   - Exports: Scene components
   - Imports: Types, physics, stores

3. **Audio** (`/src/components/audio`, `/src/lib/biomes/audio.ts`)
   - Owns: Tone.js engine, soundscapes, effects
   - Exports: Audio engine, controls
   - Imports: Stores, biome config

4. **State** (`/src/stores`)
   - Owns: Application state, persistence
   - Exports: Stores, actions
   - Imports: Types, utilities

5. **Networking** (`/src/lib/networking`)
   - Owns: WebSocket, federation, external APIs
   - Exports: Client interfaces
   - Imports: Types, stores

6. **UI** (`/src/components/ui`, `/src/components/world`)
   - Owns: React components, interactions
   - Exports: Components
   - Imports: Stores, types, utilities

### Dependency Graph Principles

- **No circular dependencies** (enforced by build)
- **Unidirectional data flow** (stores → components)
- **Types are root** (all modules can import types)
- **Utilities are leaves** (import nothing except types)

---

## PART 2: DATA LAYER & TYPE SYSTEM

### Core Types (`/src/types/world.ts`)

```typescript
/**
 * Biome types - the six territories of The Irreal
 */
export type BiomeType =
  | 'threshold'
  | 'lore'
  | 'creation'
  | 'reflection'
  | 'play'
  | 'deep';

/**
 * Growth stages - lifecycle of a world
 */
export type GrowthStage =
  | 'seedling'   // New, nascent, emerging
  | 'growing'    // Establishing, taking root
  | 'evergreen'; // Complete, rooted, mature

/**
 * World node - represents a single piece of content
 */
export interface World {
  id: string;                    // Unique identifier (slug)
  title: string;                 // Display title
  summary: string;               // Brief description
  biome: BiomeType;              // Territory classification
  stage: GrowthStage;            // Growth state
  self?: string;                 // Which plural self authored
  createdAt: Date;               // First published
  updatedAt: Date;               // Last modified
  connections: string[];         // Explicit connections (world IDs)
  choices?: Choice[];            // Inline navigation choices
  tags?: string[];               // Optional tags
  draft?: boolean;               // Published or draft
}

/**
 * Choice - CYOA-style navigation option
 */
export interface Choice {
  label: string;                 // Choice text
  to: string;                    // Target path
  gives?: string[];              // Optional: what this unlocks/reveals
}

/**
 * Graph node - world with spatial position
 */
export interface GraphNode extends World {
  x: number;                     // Canvas x position
  y: number;                     // Canvas y position
  z?: number;                    // Optional z-depth
  vx?: number;                   // Velocity x (physics)
  vy?: number;                   // Velocity y (physics)
}

/**
 * Graph edge - connection between worlds
 */
export interface GraphEdge {
  id: string;                    // Unique edge ID
  source: string;                // Source world ID
  target: string;                // Target world ID
  strength?: number;             // Connection strength (0-1)
}

/**
 * Complete graph data structure
 */
export interface WorldGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
  metadata: {
    totalWorlds: number;
    biomeDistribution: Record<BiomeType, number>;
    stageDistribution: Record<GrowthStage, number>;
    generatedAt: Date;
  };
}
```

### Biome Configuration (`/src/types/biome.ts`)

```typescript
/**
 * Color palette for a biome
 */
export interface BiomePalette {
  void: string;           // Deep background
  deep: string;           // Dark layer
  surface: string;        // Mid layer
  muted: string;          // Subtle accents
  text: string;           // Primary text
  textDim: string;        // Secondary text
  accent: string;         // Primary accent
  accentGlow: string;     // Glowing accent
}

/**
 * Typography configuration
 */
export interface BiomeTypography {
  headingSize: string;           // rem units
  headingWeight: number;         // Font weight
  headingSpacing: string;        // Letter spacing
  headingTransform?: string;     // Text transform
  bodySize: string;              // rem units
  bodyWeight: number;            // Font weight
  lineHeight: number;            // Line height ratio
  measure: string;               // Max width (ch units)
  fontFamily: string;            // Font stack
}

/**
 * Spatial/density configuration
 */
export interface BiomeSpatial {
  density: number;               // 0-1, how dense content is
  whitespace: number;            // Multiplier for margins/padding
  borderOpacity: number;         // Border transparency
  borderWeight: string;          // Border thickness
}

/**
 * Audio parameters
 */
export interface BiomeAudio {
  baseFrequency: number;         // Hz, fundamental tone
  harmonics: number[];           // Harmonic ratios
  ambientVolume: number;         // 0-1
  reverbDecay: number;           // Seconds
  filterCutoff: number;          // Hz
}

/**
 * Particle configuration
 */
export interface BiomeParticles {
  count: number;                 // Number of particles
  size: [number, number];        // Min/max size
  velocity: [number, number];    // Min/max velocity
  direction: [number, number];   // Direction range (radians)
  opacity: [number, number];     // Min/max opacity
}

/**
 * Complete biome configuration
 */
export interface BiomeConfig {
  id: BiomeType;
  name: string;
  palette: BiomePalette;
  typography: BiomeTypography;
  spatial: BiomeSpatial;
  audio: BiomeAudio;
  particles: BiomeParticles;
  rhythm: number;                // BPM for animations
  texture?: string;              // Optional texture URL
}
```

### Presence Types (`/src/types/presence.ts`)

```typescript
/**
 * Individual presence - represents one visitor
 */
export interface Presence {
  id: string;                    // Ephemeral session ID
  worldId: string | null;        // Current world (null = atlas/threshold)
  scrollPosition?: number;       // Scroll % (0-100)
  joinedAt: Date;                // When they arrived
  lastSeen: Date;                // Last activity
}

/**
 * Room state - all visitors in a location
 */
export interface RoomState {
  worldId: string | null;        // Which world/page
  visitors: Presence[];          // All current visitors
  count: number;                 // Total count
}

/**
 * WebSocket message types
 */
export type PresenceMessage =
  | { type: 'join'; worldId: string | null }
  | { type: 'leave'; worldId: string | null }
  | { type: 'scroll'; worldId: string; position: number }
  | { type: 'heartbeat' };

/**
 * WebSocket server events
 */
export type PresenceEvent =
  | { type: 'room_update'; room: RoomState }
  | { type: 'visitor_joined'; presence: Presence }
  | { type: 'visitor_left'; presenceId: string };
```

### Guestbook Types (`/src/types/guestbook.ts`)

```typescript
/**
 * Guestbook trace - a visitor's mark
 */
export interface Trace {
  id: string;                    // Unique ID
  name?: string;                 // Optional name
  message: string;               // The trace message
  worldId: string;               // Which world witnessed
  biome: BiomeType;              // Biome of that world
  createdAt: Date;               // When left
  x?: number;                    // Canvas position (if rendered)
  y?: number;
}

/**
 * Guestbook constellation data
 */
export interface GuestbookData {
  traces: Trace[];
  metadata: {
    totalTraces: number;
    biomeDistribution: Record<BiomeType, number>;
    oldestTrace: Date;
    newestTrace: Date;
  };
}
```

### Federation Types (`/src/types/federation.ts`)

```typescript
/**
 * ActivityPub Actor
 */
export interface Actor {
  '@context': 'https://www.w3.org/ns/activitystreams';
  type: 'Person' | 'Service';
  id: string;                    // Actor URI
  preferredUsername: string;
  name: string;
  summary: string;
  inbox: string;                 // Inbox URL
  outbox: string;                // Outbox URL
  followers?: string;            // Followers collection
  following?: string;            // Following collection
  publicKey: {
    id: string;
    owner: string;
    publicKeyPem: string;
  };
}

/**
 * ActivityPub Note (post)
 */
export interface Note {
  '@context': 'https://www.w3.org/ns/activitystreams';
  type: 'Note';
  id: string;                    // Note URI
  attributedTo: string;          // Actor URI
  content: string;               // HTML content
  published: string;             // ISO date
  to: string[];                  // Recipients
  cc?: string[];                 // CC recipients
  inReplyTo?: string;            // Reply target
  url: string;                   // Human-readable URL
}

/**
 * ActivityPub Activity
 */
export interface Activity {
  '@context': 'https://www.w3.org/ns/activitystreams';
  type: 'Create' | 'Like' | 'Announce' | 'Follow';
  id: string;                    // Activity URI
  actor: string;                 // Actor URI
  object: Note | string;         // Object or URI
  published: string;             // ISO date
  to: string[];
  cc?: string[];
}

/**
 * Webmention
 */
export interface Webmention {
  source: string;                // Source URL
  target: string;                // Target URL
  createdAt: Date;
  verified: boolean;
  author?: {
    name: string;
    url: string;
    avatar?: string;
  };
  content?: string;              // Excerpt
}
```

### Content Schema (`/src/lib/content/schema.ts`)

```typescript
import { z, defineCollection } from 'astro:content';

/**
 * World collection schema
 */
export const worldsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.string(),
    title: z.string(),
    summary: z.string(),
    biome: z.enum(['threshold', 'lore', 'creation', 'reflection', 'play', 'deep']),
    stage: z.enum(['seedling', 'growing', 'evergreen']),
    self: z.string().optional(),
    connections: z.array(z.string()).default([]),
    choices: z.array(z.object({
      label: z.string(),
      to: z.string(),
      gives: z.array(z.string()).optional()
    })).optional(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().default(false)
  })
});

export const collections = {
  worlds: worldsCollection
};
```

---

## PART 3: 3D GRAPHICS SYSTEM

### Scene Architecture

**Principle**: Each page has its own Three.js scene with specific purpose

#### Threshold Scene (`/src/components/threshold/VoidScene.tsx`)

**Purpose**: Void + particles + emergence

**Scene Graph**:
```
Scene
├── AmbientLight (low intensity, purple tint)
├── ParticleSystem (10,000+ particles)
│   └── Points (InstancedBufferGeometry)
├── EmergenceText (3D text geometry, custom shader)
└── PortalGroup
    ├── AtlasPortal (portal to mycelium)
    └── GrovePortal (portal to grove)
```

**Component Structure**:
```typescript
export function VoidScene() {
  // Refs
  const sceneRef = useRef<THREE.Scene>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const particlesRef = useRef<THREE.Points>();

  // State
  const [stage, setStage] = useState<'void' | 'attunement' | 'crystallization' | 'portals'>('void');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Particle system
  const particles = useMemo(() => generateParticles(10000), []);

  // Animation loop
  useFrame((state, delta) => {
    updateParticles(particlesRef.current, mousePosition, delta);
    updateCamera(cameraRef.current, stage, delta);
  });

  return (
    <Canvas camera={{ position: [0, 0, 50], fov: 60 }}>
      <ParticleField particles={particles} ref={particlesRef} />
      {stage === 'crystallization' && <EmergenceText />}
      {stage === 'portals' && (
        <>
          <Portal type="atlas" position={[-5, 0, 0]} />
          <Portal type="grove" position={[5, 0, 0]} />
        </>
      )}
    </Canvas>
  );
}
```

**Shader Implementation** (`/src/components/threshold/shaders/portal.frag.ts`):

```glsl
// Portal Fragment Shader
uniform float time;
uniform vec2 resolution;
uniform sampler2D previewTexture;
uniform float hoverIntensity;

varying vec2 vUv;

// Perlin noise function
float noise(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  vec2 uv = vUv;

  // Add time-based distortion
  float n = noise(uv * 10.0 + time * 0.5);
  uv += n * 0.02;

  // Sample preview texture
  vec4 preview = texture2D(previewTexture, uv);

  // Apply fresnel effect (edge glow)
  float fresnel = pow(1.0 - abs(dot(vec3(0, 0, 1), normalize(vec3(uv * 2.0 - 1.0, 1.0)))), 2.0);

  // Apply hover intensity
  float glow = fresnel * hoverIntensity;

  // Combine
  vec3 color = preview.rgb + vec3(0.4, 0.3, 0.6) * glow;
  float alpha = preview.a + glow * 0.5;

  gl_FragColor = vec4(color, alpha);
}
```

#### Mycelium Scene (`/src/components/atlas/MyceliumScene.tsx`)

**Purpose**: 3D force-directed graph of worlds

**Scene Graph**:
```
Scene
├── AmbientLight
├── PointLight (follows camera)
├── WorldNodesGroup
│   └── WorldNode[] (instanced meshes per stage/biome)
├── ConnectionsGroup
│   └── Connection[] (tube geometries with flow)
└── PresenceLayer
    └── VisitorLight[] (point lights, one per visitor)
```

**Node Rendering Strategy**:
- Use **InstancedMesh** for performance (many nodes, same geometry)
- Separate instance per (biome × stage) combination (18 total)
- Update matrix per frame for position/scale

**Component Structure**:
```typescript
export function MyceliumScene({ graph }: { graph: WorldGraph }) {
  const nodesRef = useRef<Map<string, THREE.InstancedMesh>>(new Map());
  const connectionsRef = useRef<THREE.Group>();

  // Group nodes by biome×stage for instancing
  const nodeGroups = useMemo(() => groupNodesByType(graph.nodes), [graph]);

  // Create instanced meshes
  useEffect(() => {
    Object.entries(nodeGroups).forEach(([key, nodes]) => {
      const geometry = createNodeGeometry(key);
      const material = createNodeMaterial(key);
      const mesh = new THREE.InstancedMesh(geometry, material, nodes.length);
      nodesRef.current.set(key, mesh);
    });
  }, [nodeGroups]);

  // Update node positions (physics simulation)
  useFrame((state, delta) => {
    updatePhysics(graph.nodes, graph.edges, delta);
    updateInstancedMeshes(nodesRef.current, graph.nodes);
    updateConnections(connectionsRef.current, graph);
  });

  return (
    <Canvas camera={{ position: [0, 0, 100], fov: 50 }}>
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 0, 50]} intensity={0.7} />

      {/* Render instanced meshes */}
      {Array.from(nodesRef.current.values()).map((mesh, i) => (
        <primitive key={i} object={mesh} />
      ))}

      <group ref={connectionsRef}>
        {graph.edges.map(edge => (
          <Connection key={edge.id} edge={edge} nodes={graph.nodes} />
        ))}
      </group>

      <PresenceLayer />
    </Canvas>
  );
}
```

### Physics System (`/src/lib/physics/forceGraph.ts`)

**Force-directed graph with organic behavior**:

```typescript
interface ForceConfig {
  centerGravity: number;        // Pull toward center
  nodeRepulsion: number;        // Repel nodes from each other
  edgeAttraction: number;       // Attract connected nodes
  damping: number;              // Velocity damping
  driftNoise: number;           // Random organic drift
}

const DEFAULT_CONFIG: ForceConfig = {
  centerGravity: 0.001,
  nodeRepulsion: 500,
  edgeAttraction: 0.01,
  damping: 0.85,
  driftNoise: 0.5
};

export function updatePhysics(
  nodes: GraphNode[],
  edges: GraphEdge[],
  delta: number,
  config: ForceConfig = DEFAULT_CONFIG
): void {
  const centerX = 0;
  const centerY = 0;

  // Apply forces to each node
  nodes.forEach((node, i) => {
    // Initialize velocity if needed
    if (node.vx === undefined) node.vx = 0;
    if (node.vy === undefined) node.vy = 0;

    // Center gravity
    node.vx += (centerX - node.x) * config.centerGravity;
    node.vy += (centerY - node.y) * config.centerGravity;

    // Node repulsion
    nodes.forEach((other, j) => {
      if (i === j) return;

      const dx = node.x - other.x;
      const dy = node.y - other.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const force = config.nodeRepulsion / (dist * dist);

      node.vx += (dx / dist) * force;
      node.vy += (dy / dist) * force;
    });

    // Perlin noise drift (organic float)
    const noiseX = perlin2D(node.x * 0.01, node.y * 0.01 + Date.now() * 0.0001);
    const noiseY = perlin2D(node.y * 0.01, node.x * 0.01 + Date.now() * 0.0001);
    node.vx += noiseX * config.driftNoise;
    node.vy += noiseY * config.driftNoise;
  });

  // Edge attraction
  edges.forEach(edge => {
    const source = nodes.find(n => n.id === edge.source);
    const target = nodes.find(n => n.id === edge.target);
    if (!source || !target) return;

    const dx = target.x - source.x;
    const dy = target.y - source.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    const force = (dist - 100) * config.edgeAttraction; // Ideal distance: 100

    source.vx += (dx / dist) * force;
    source.vy += (dy / dist) * force;
    target.vx -= (dx / dist) * force;
    target.vy -= (dy / dist) * force;
  });

  // Apply velocity and damping
  nodes.forEach(node => {
    node.vx! *= config.damping;
    node.vy! *= config.damping;
    node.x += node.vx! * delta * 60; // Normalize to 60fps
    node.y += node.vy! * delta * 60;
  });
}

// Perlin noise implementation
function perlin2D(x: number, y: number): number {
  // Standard Perlin noise
  // (Implementation omitted for brevity - use simplex-noise library)
  return 0; // Placeholder
}
```

### Particle System (`/src/lib/physics/particles.ts`)

```typescript
interface Particle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  size: number;
  opacity: number;
  life: number;                  // 0-1, for fading
}

export class ParticleSystem {
  private particles: Particle[];
  private geometry: THREE.BufferGeometry;
  private material: THREE.PointsMaterial;
  private points: THREE.Points;

  constructor(count: number) {
    this.particles = Array.from({ length: count }, () => this.createParticle());
    this.setupGeometry();
  }

  private createParticle(): Particle {
    return {
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100
      ),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.1,
        (Math.random() - 0.5) * 0.1,
        (Math.random() - 0.5) * 0.1
      ),
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.3,
      life: Math.random()
    };
  }

  private setupGeometry(): void {
    this.geometry = new THREE.BufferGeometry();

    // Position attribute
    const positions = new Float32Array(this.particles.length * 3);
    const sizes = new Float32Array(this.particles.length);
    const alphas = new Float32Array(this.particles.length);

    this.particles.forEach((p, i) => {
      positions[i * 3] = p.position.x;
      positions[i * 3 + 1] = p.position.y;
      positions[i * 3 + 2] = p.position.z;
      sizes[i] = p.size;
      alphas[i] = p.opacity;
    });

    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    this.geometry.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));

    this.material = new THREE.PointsMaterial({
      size: 2,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.6,
      vertexColors: false,
      color: 0x7c6fe0
    });

    this.points = new THREE.Points(this.geometry, this.material);
  }

  update(delta: number, attractors: THREE.Vector3[] = []): void {
    const positions = this.geometry.attributes.position.array as Float32Array;
    const alphas = this.geometry.attributes.alpha.array as Float32Array;

    this.particles.forEach((p, i) => {
      // Apply velocity
      p.position.add(p.velocity.clone().multiplyScalar(delta * 60));

      // Apply attractors (e.g., mouse position, text)
      attractors.forEach(attractor => {
        const direction = attractor.clone().sub(p.position);
        const distance = direction.length();
        if (distance < 50) {
          const force = (1 - distance / 50) * 0.01;
          p.velocity.add(direction.normalize().multiplyScalar(force));
        }
      });

      // Damping
      p.velocity.multiplyScalar(0.98);

      // Life cycle
      p.life += delta * 0.1;
      if (p.life > 1) p.life = 0;

      // Update attributes
      positions[i * 3] = p.position.x;
      positions[i * 3 + 1] = p.position.y;
      positions[i * 3 + 2] = p.position.z;
      alphas[i] = p.opacity * (1 - Math.abs(p.life - 0.5) * 2);
    });

    this.geometry.attributes.position.needsUpdate = true;
    this.geometry.attributes.alpha.needsUpdate = true;
  }

  getPoints(): THREE.Points {
    return this.points;
  }
}
```

### Performance Optimization

**Rendering Budget**:
- **60 FPS target** (16.67ms per frame)
- **Frame budget allocation**:
  - Physics: 4ms
  - Three.js render: 8ms
  - React updates: 2ms
  - Browser composite: 2ms
  - Buffer: 0.67ms

**Optimization Strategies**:

1. **Instanced Rendering**
   - Use `InstancedMesh` for nodes (18 meshes vs 100+ individual)
   - Reduces draw calls from O(n) to O(1) per type

2. **Frustum Culling**
   - Only render visible nodes
   - Cull based on camera frustum
   - Disable for off-screen elements

3. **Level of Detail (LOD)**
   - Far nodes: Simple sphere geometry (8 segments)
   - Near nodes: Detailed geometry (32 segments)
   - Switch at distance threshold

4. **Shader Optimization**
   - Minimize texture lookups
   - Use vertex shader for heavy computation
   - Cache uniform calculations

5. **Update Throttling**
   - Physics: 60 FPS
   - Visual updates: 60 FPS
   - Presence updates: 2 FPS (500ms)
   - Audio: Event-driven only

**Code Example** (`/src/components/atlas/optimization.ts`):

```typescript
// LOD system
export function createLODNode(biome: BiomeType, stage: GrowthStage) {
  const lod = new THREE.LOD();

  // High detail (< 50 units away)
  const highDetail = createNodeGeometry(biome, stage, 32);
  const highMaterial = createNodeMaterial(biome, stage);
  lod.addLevel(new THREE.Mesh(highDetail, highMaterial), 0);

  // Medium detail (50-100 units)
  const medDetail = createNodeGeometry(biome, stage, 16);
  const medMaterial = createNodeMaterial(biome, stage);
  lod.addLevel(new THREE.Mesh(medDetail, medMaterial), 50);

  // Low detail (> 100 units)
  const lowDetail = createNodeGeometry(biome, stage, 8);
  const lowMaterial = createNodeMaterial(biome, stage);
  lod.addLevel(new THREE.Mesh(lowDetail, lowMaterial), 100);

  return lod;
}

// Frustum culling
export function cullNodes(
  nodes: GraphNode[],
  camera: THREE.Camera
): GraphNode[] {
  const frustum = new THREE.Frustum();
  const matrix = new THREE.Matrix4().multiplyMatrices(
    camera.projectionMatrix,
    camera.matrixWorldInverse
  );
  frustum.setFromProjectionMatrix(matrix);

  return nodes.filter(node => {
    const position = new THREE.Vector3(node.x, node.y, node.z || 0);
    return frustum.containsPoint(position);
  });
}
```

---

## PART 4: AUDIO SYSTEM

### Architecture

**Stack**: Tone.js (Web Audio wrapper)

**Structure**:
```
AudioEngine (singleton)
├── MasterOut (GainNode)
│   ├── Reverb (ConvolverNode)
│   └── Compressor (DynamicsCompressorNode)
├── BiomeSoundscape (per biome)
│   ├── Oscillators (generative tones)
│   ├── Noise (filtered white noise)
│   └── Samples (environmental sounds)
└── SoundEffects (one-shots)
    ├── UI sounds (hover, click, transition)
    └── Event sounds (portal open, trace left)
```

### Audio Engine (`/src/components/audio/AudioEngine.tsx`)

```typescript
import * as Tone from 'tone';
import { BiomeType } from '@/types/biome';
import { biomeSoundscapes } from '@/lib/biomes/audio';

export class AudioEngine {
  private static instance: AudioEngine;
  private context: Tone.Context;
  private master: Tone.Gain;
  private reverb: Tone.Reverb;
  private compressor: Tone.Compressor;
  private currentBiome: BiomeType | null = null;
  private activeSoundscape: BiomeSoundscape | null = null;
  private sfx: Map<string, Tone.Player> = new Map();

  private constructor() {
    this.context = Tone.getContext();
    this.setupMasterChain();
    this.loadSoundEffects();
  }

  static getInstance(): AudioEngine {
    if (!AudioEngine.instance) {
      AudioEngine.instance = new AudioEngine();
    }
    return AudioEngine.instance;
  }

  private setupMasterChain(): void {
    // Master gain (volume control)
    this.master = new Tone.Gain(0.7).toDestination();

    // Reverb (spatial depth)
    this.reverb = new Tone.Reverb({
      decay: 3,
      wet: 0.3
    }).connect(this.master);

    // Compressor (prevent clipping)
    this.compressor = new Tone.Compressor({
      threshold: -20,
      ratio: 4,
      attack: 0.003,
      release: 0.1
    }).connect(this.reverb);
  }

  private loadSoundEffects(): void {
    const effects = {
      hover: '/audio/sfx/hover.mp3',
      click: '/audio/sfx/click.mp3',
      portal: '/audio/sfx/portal.mp3',
      crystallize: '/audio/sfx/crystallize.mp3',
      trace: '/audio/sfx/trace.mp3'
    };

    Object.entries(effects).forEach(([name, url]) => {
      const player = new Tone.Player(url).toDestination();
      this.sfx.set(name, player);
    });
  }

  async start(): Promise<void> {
    await Tone.start();
    console.log('Audio engine started');
  }

  setBiome(biome: BiomeType): void {
    if (this.currentBiome === biome) return;

    // Crossfade from current to new
    this.crossfadeBiome(biome);
    this.currentBiome = biome;
  }

  private crossfadeBiome(newBiome: BiomeType): void {
    const duration = 2; // 2 second crossfade

    // Fade out current
    if (this.activeSoundscape) {
      this.activeSoundscape.fadeOut(duration);
      setTimeout(() => {
        this.activeSoundscape?.stop();
      }, duration * 1000);
    }

    // Fade in new
    const newSoundscape = new BiomeSoundscape(newBiome, this.compressor);
    newSoundscape.fadeIn(duration);
    newSoundscape.start();

    this.activeSoundscape = newSoundscape;
  }

  playSFX(name: string, volume: number = 1): void {
    const player = this.sfx.get(name);
    if (player && player.loaded) {
      player.volume.value = Tone.gainToDb(volume);
      player.start();
    }
  }

  setMasterVolume(volume: number): void {
    this.master.gain.rampTo(volume, 0.5);
  }

  mute(): void {
    this.setMasterVolume(0);
  }

  unmute(): void {
    this.setMasterVolume(0.7);
  }
}
```

### Biome Soundscape (`/src/components/audio/BiomeSoundscape.tsx`)

```typescript
import * as Tone from 'tone';
import { BiomeType } from '@/types/biome';
import { biomeAudioConfig } from '@/lib/biomes/audio';

export class BiomeSoundscape {
  private biome: BiomeType;
  private output: Tone.Gain;
  private oscillators: Tone.Oscillator[] = [];
  private noise: Tone.Noise | null = null;
  private filter: Tone.Filter;

  constructor(biome: BiomeType, destination: Tone.ToneAudioNode) {
    this.biome = biome;
    this.output = new Tone.Gain(0).connect(destination);
    this.filter = new Tone.Filter({
      type: 'lowpass',
      frequency: 2000,
      rolloff: -24
    }).connect(this.output);

    this.setupSoundscape();
  }

  private setupSoundscape(): void {
    const config = biomeAudioConfig[this.biome];

    // Create harmonic oscillators
    config.harmonics.forEach((ratio, i) => {
      const freq = config.baseFrequency * ratio;
      const osc = new Tone.Oscillator({
        frequency: freq,
        type: 'sine',
        volume: -20 - (i * 3) // Each harmonic quieter
      }).connect(this.filter);

      this.oscillators.push(osc);
    });

    // Add noise for texture
    if (config.noiseAmount > 0) {
      this.noise = new Tone.Noise({
        type: 'pink',
        volume: -30 + (config.noiseAmount * 10)
      }).connect(this.filter);
    }

    // Set filter cutoff
    this.filter.frequency.value = config.filterCutoff;
  }

  start(): void {
    this.oscillators.forEach(osc => osc.start());
    if (this.noise) this.noise.start();
  }

  stop(): void {
    this.oscillators.forEach(osc => osc.stop());
    if (this.noise) this.noise.stop();
  }

  fadeIn(duration: number): void {
    this.output.gain.rampTo(1, duration);
  }

  fadeOut(duration: number): void {
    this.output.gain.rampTo(0, duration);
  }
}
```

### Biome Audio Configuration (`/src/lib/biomes/audio.ts`)

```typescript
import { BiomeType, BiomeAudio } from '@/types/biome';

export const biomeAudioConfig: Record<BiomeType, BiomeAudio> = {
  threshold: {
    baseFrequency: 110,        // A2
    harmonics: [1, 1.5, 2, 3], // Warm fifths
    ambientVolume: 0.4,
    reverbDecay: 4,
    filterCutoff: 2000,
    noiseAmount: 0.2
  },

  lore: {
    baseFrequency: 82.4,       // E2
    harmonics: [1, 2, 3, 4],   // Perfect harmonics
    ambientVolume: 0.3,
    reverbDecay: 5,
    filterCutoff: 1500,
    noiseAmount: 0.4           // Paper rustle
  },

  creation: {
    baseFrequency: 146.8,      // D3
    harmonics: [1, 1.33, 1.67, 2], // Energetic
    ambientVolume: 0.5,
    reverbDecay: 2,
    filterCutoff: 3000,
    noiseAmount: 0.3
  },

  reflection: {
    baseFrequency: 98,         // G2
    harmonics: [1, 2, 4],      // Octaves (pure)
    ambientVolume: 0.3,
    reverbDecay: 6,
    filterCutoff: 1000,
    noiseAmount: 0.1           // Minimal
  },

  play: {
    baseFrequency: 196,        // G3
    harmonics: [1, 1.26, 1.5, 1.89], // Major chord
    ambientVolume: 0.6,
    reverbDecay: 3,
    filterCutoff: 4000,
    noiseAmount: 0.2
  },

  deep: {
    baseFrequency: 55,         // A1 (very low)
    harmonics: [1, 1.5, 2],    // Minimal harmonics
    ambientVolume: 0.5,
    reverbDecay: 8,
    filterCutoff: 500,
    noiseAmount: 0.5           // Heavy texture
  }
};
```

---

## PART 5: STATE MANAGEMENT

### Architecture

**Library**: Zustand (lightweight, performant)

**Stores**:
1. **User Store**: Path history, anchors, preferences
2. **Presence Store**: Real-time visitors, room states
3. **Audio Store**: Audio state, volume, mute
4. **App Store**: Global UI state, modals, loading

### User Store (`/src/stores/userStore.ts`)

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserPath {
  worldId: string;
  visitedAt: Date;
  duration: number;              // seconds spent
}

interface Anchor {
  worldId: string;
  note?: string;
  createdAt: Date;
}

interface UserState {
  // State
  path: UserPath[];
  anchors: Anchor[];
  preferences: {
    reducedMotion: boolean;
    audioEnabled: boolean;
    volume: number;
  };

  // Actions
  recordVisit: (worldId: string, duration: number) => void;
  addAnchor: (worldId: string, note?: string) => void;
  removeAnchor: (worldId: string) => void;
  setPreference: <K extends keyof UserState['preferences']>(
    key: K,
    value: UserState['preferences'][K]
  ) => void;

  // Computed
  hasVisited: (worldId: string) => boolean;
  isAnchored: (worldId: string) => boolean;
  getAnchor: (worldId: string) => Anchor | undefined;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      path: [],
      anchors: [],
      preferences: {
        reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        audioEnabled: true,
        volume: 0.7
      },

      recordVisit: (worldId, duration) => {
        set(state => ({
          path: [
            ...state.path,
            { worldId, visitedAt: new Date(), duration }
          ]
        }));
      },

      addAnchor: (worldId, note) => {
        set(state => ({
          anchors: [
            ...state.anchors,
            { worldId, note, createdAt: new Date() }
          ]
        }));
      },

      removeAnchor: (worldId) => {
        set(state => ({
          anchors: state.anchors.filter(a => a.worldId !== worldId)
        }));
      },

      setPreference: (key, value) => {
        set(state => ({
          preferences: {
            ...state.preferences,
            [key]: value
          }
        }));
      },

      hasVisited: (worldId) => {
        return get().path.some(p => p.worldId === worldId);
      },

      isAnchored: (worldId) => {
        return get().anchors.some(a => a.worldId === worldId);
      },

      getAnchor: (worldId) => {
        return get().anchors.find(a => a.worldId === worldId);
      }
    }),
    {
      name: 'irreal-user-storage',
      version: 1
    }
  )
);
```

### Presence Store (`/src/stores/presenceStore.ts`)

```typescript
import { create } from 'zustand';
import { Presence, RoomState } from '@/types/presence';

interface PresenceState {
  // State
  sessionId: string | null;
  currentRoom: string | null;
  rooms: Map<string, RoomState>;
  connected: boolean;

  // Actions
  setSessionId: (id: string) => void;
  joinRoom: (worldId: string | null) => void;
  leaveRoom: () => void;
  updateRoom: (room: RoomState) => void;
  setConnected: (connected: boolean) => void;

  // Computed
  getCurrentRoom: () => RoomState | null;
  getVisitorCount: (worldId: string | null) => number;
}

export const usePresenceStore = create<PresenceState>((set, get) => ({
  sessionId: null,
  currentRoom: null,
  rooms: new Map(),
  connected: false,

  setSessionId: (id) => {
    set({ sessionId: id });
  },

  joinRoom: (worldId) => {
    set({ currentRoom: worldId });
  },

  leaveRoom: () => {
    set({ currentRoom: null });
  },

  updateRoom: (room) => {
    set(state => {
      const newRooms = new Map(state.rooms);
      newRooms.set(room.worldId || 'threshold', room);
      return { rooms: newRooms };
    });
  },

  setConnected: (connected) => {
    set({ connected });
  },

  getCurrentRoom: () => {
    const state = get();
    if (!state.currentRoom) return null;
    return state.rooms.get(state.currentRoom) || null;
  },

  getVisitorCount: (worldId) => {
    const state = get();
    const room = state.rooms.get(worldId || 'threshold');
    return room?.count || 0;
  }
}));
```

---

## PART 6: NETWORKING

### WebSocket Protocol (`/src/lib/networking/websocket.ts`)

```typescript
import { io, Socket } from 'socket.io-client';
import { usePresenceStore } from '@/stores/presenceStore';
import { PresenceMessage, PresenceEvent } from '@/types/presence';

class PresenceClient {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(url: string): void {
    this.socket = io(url, {
      transports: ['websocket'],
      reconnectionAttempts: this.maxReconnectAttempts
    });

    this.setupListeners();
  }

  private setupListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Presence connected');
      usePresenceStore.getState().setConnected(true);
      usePresenceStore.getState().setSessionId(this.socket!.id);
    });

    this.socket.on('disconnect', () => {
      console.log('Presence disconnected');
      usePresenceStore.getState().setConnected(false);
    });

    this.socket.on('room_update', (event: PresenceEvent) => {
      if (event.type === 'room_update') {
        usePresenceStore.getState().updateRoom(event.room);
      }
    });
  }

  joinWorld(worldId: string | null): void {
    if (!this.socket?.connected) return;

    const message: PresenceMessage = {
      type: 'join',
      worldId
    };

    this.socket.emit('presence', message);
    usePresenceStore.getState().joinRoom(worldId);
  }

  leaveWorld(worldId: string | null): void {
    if (!this.socket?.connected) return;

    const message: PresenceMessage = {
      type: 'leave',
      worldId
    };

    this.socket.emit('presence', message);
  }

  updateScroll(worldId: string, position: number): void {
    if (!this.socket?.connected) return;

    const message: PresenceMessage = {
      type: 'scroll',
      worldId,
      position
    };

    this.socket.emit('presence', message);
  }

  disconnect(): void {
    this.socket?.disconnect();
  }
}

export const presenceClient = new PresenceClient();
```

### Presence Server (`/presence-server/src/index.ts`)

```typescript
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { PresenceMessage, PresenceEvent, Presence, RoomState } from './types';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:4321',
    methods: ['GET', 'POST']
  }
});

// Room state (in-memory, could use Redis for multi-instance)
const rooms = new Map<string, RoomState>();

io.on('connection', (socket) => {
  console.log(`Visitor connected: ${socket.id}`);

  // Handle presence messages
  socket.on('presence', (message: PresenceMessage) => {
    switch (message.type) {
      case 'join':
        handleJoin(socket, message.worldId);
        break;
      case 'leave':
        handleLeave(socket, message.worldId);
        break;
      case 'scroll':
        handleScroll(socket, message.worldId, message.position);
        break;
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`Visitor disconnected: ${socket.id}`);
    handleDisconnectAll(socket);
  });
});

function handleJoin(socket: any, worldId: string | null): void {
  const roomKey = worldId || 'threshold';

  // Join socket.io room
  socket.join(roomKey);

  // Get or create room state
  let room = rooms.get(roomKey);
  if (!room) {
    room = {
      worldId,
      visitors: [],
      count: 0
    };
    rooms.set(roomKey, room);
  }

  // Add presence
  const presence: Presence = {
    id: socket.id,
    worldId,
    joinedAt: new Date(),
    lastSeen: new Date()
  };

  room.visitors.push(presence);
  room.count = room.visitors.length;

  // Broadcast update to room
  const event: PresenceEvent = {
    type: 'room_update',
    room
  };

  io.to(roomKey).emit('room_update', event);
}

function handleLeave(socket: any, worldId: string | null): void {
  const roomKey = worldId || 'threshold';

  socket.leave(roomKey);

  const room = rooms.get(roomKey);
  if (!room) return;

  // Remove presence
  room.visitors = room.visitors.filter(v => v.id !== socket.id);
  room.count = room.visitors.length;

  // Broadcast update
  const event: PresenceEvent = {
    type: 'room_update',
    room
  };

  io.to(roomKey).emit('room_update', event);
}

function handleScroll(socket: any, worldId: string, position: number): void {
  const roomKey = worldId;
  const room = rooms.get(roomKey);
  if (!room) return;

  // Update presence scroll position
  const presence = room.visitors.find(v => v.id === socket.id);
  if (presence) {
    presence.scrollPosition = position;
    presence.lastSeen = new Date();
  }

  // Broadcast update (throttled to 2 FPS on client)
  const event: PresenceEvent = {
    type: 'room_update',
    room
  };

  io.to(roomKey).emit('room_update', event);
}

function handleDisconnectAll(socket: any): void {
  // Remove from all rooms
  rooms.forEach((room, key) => {
    room.visitors = room.visitors.filter(v => v.id !== socket.id);
    room.count = room.visitors.length;

    const event: PresenceEvent = {
      type: 'room_update',
      room
    };

    io.to(key).emit('room_update', event);
  });
}

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Presence server running on port ${PORT}`);
});
```

---

## PART 7: PERFORMANCE BUDGETS

### Bundle Size Targets

**Initial Load** (before user interaction):
- HTML: < 10KB (gzipped)
- Critical CSS: < 20KB (gzipped)
- Critical JS: < 50KB (gzipped)
- Total initial: **< 80KB**

**Route-specific bundles**:
- Threshold: < 150KB (3D + shaders)
- Atlas: < 200KB (3D + physics + graph)
- World pages: < 80KB (biome styles + MDX)
- Guestbook: < 120KB (3D constellation)

**Assets**:
- Fonts: < 100KB total (variable fonts, subsetted)
- Textures: < 200KB total (WebP, lazy-loaded)
- Audio: < 500KB total (compressed, lazy-loaded)

### Code Splitting Strategy

```typescript
// astro.config.mjs
export default defineConfig({
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            // Core React/3D
            'three': ['three', '@react-three/fiber', '@react-three/drei'],
            // Audio
            'audio': ['tone'],
            // State
            'state': ['zustand'],
            // Utils
            'utils': ['@/lib/utils', '@/lib/physics']
          }
        }
      }
    }
  }
});
```

### Lazy Loading

```typescript
// Lazy load 3D components
const ThresholdScene = lazy(() => import('@/components/threshold/ThresholdScene'));
const MyceliumScene = lazy(() => import('@/components/atlas/MyceliumScene'));
const GuestbookScene = lazy(() => import('@/components/witness/GuestbookScene'));

// Lazy load audio
const AudioEngine = lazy(() => import('@/components/audio/AudioEngine'));

// Usage with Suspense
<Suspense fallback={<LoadingVoid />}>
  <ThresholdScene />
</Suspense>
```

### Rendering Performance

**Targets**:
- **60 FPS** (16.67ms/frame) on desktop
- **30 FPS** (33.33ms/frame) minimum on mobile
- **Time to Interactive**: < 3s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

**Monitoring**:
```typescript
// Performance monitoring
export function usePerformanceMonitor() {
  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        console.log(`${entry.name}: ${entry.duration}ms`);

        // Send to analytics (if desired)
        if (entry.duration > 50) {
          console.warn(`Slow operation: ${entry.name}`);
        }
      });
    });

    observer.observe({ entryTypes: ['measure'] });

    return () => observer.disconnect();
  }, []);
}

// Usage
performance.mark('mycelium-render-start');
// ... render mycelium ...
performance.mark('mycelium-render-end');
performance.measure('mycelium-render', 'mycelium-render-start', 'mycelium-render-end');
```

---

## PART 8: TESTING STRATEGY

### Test Pyramid

```
         /\
        /E2E\        (5% - Critical user flows)
       /──────\
      /  INT   \     (15% - Component integration)
     /──────────\
    /    UNIT    \   (80% - Pure functions, utilities)
   /──────────────\
```

### Unit Tests

**Target**: Pure functions, utilities, types

**Tools**: Vitest

**Example** (`/tests/unit/physics.test.ts`):

```typescript
import { describe, it, expect } from 'vitest';
import { updatePhysics } from '@/lib/physics/forceGraph';
import { GraphNode, GraphEdge } from '@/types/world';

describe('Force-directed physics', () => {
  it('should apply center gravity', () => {
    const nodes: GraphNode[] = [
      { id: '1', x: 100, y: 100, vx: 0, vy: 0, /* ... */ }
    ];
    const edges: GraphEdge[] = [];

    updatePhysics(nodes, edges, 0.016);

    // Node should move toward center
    expect(nodes[0].x).toBeLessThan(100);
    expect(nodes[0].y).toBeLessThan(100);
  });

  it('should repel overlapping nodes', () => {
    const nodes: GraphNode[] = [
      { id: '1', x: 0, y: 0, vx: 0, vy: 0, /* ... */ },
      { id: '2', x: 1, y: 0, vx: 0, vy: 0, /* ... */ }
    ];
    const edges: GraphEdge[] = [];

    updatePhysics(nodes, edges, 0.016);

    // Nodes should move apart
    expect(Math.abs(nodes[0].x - nodes[1].x)).toBeGreaterThan(1);
  });
});
```

### Integration Tests

**Target**: Component behavior, store interactions

**Tools**: Vitest + Testing Library

**Example** (`/tests/integration/presence.test.tsx`):

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { usePresenceStore } from '@/stores/presenceStore';
import { PresenceIndicator } from '@/components/ui/PresenceIndicator';

describe('Presence system', () => {
  it('should display visitor count', async () => {
    // Setup store
    const { updateRoom } = usePresenceStore.getState();
    updateRoom({
      worldId: 'test-world',
      visitors: [
        { id: '1', worldId: 'test-world', joinedAt: new Date(), lastSeen: new Date() },
        { id: '2', worldId: 'test-world', joinedAt: new Date(), lastSeen: new Date() }
      ],
      count: 2
    });

    render(<PresenceIndicator worldId="test-world" />);

    await waitFor(() => {
      expect(screen.getByText('2 wandering')).toBeInTheDocument();
    });
  });
});
```

### E2E Tests

**Target**: Critical user journeys

**Tools**: Playwright

**Example** (`/tests/e2e/threshold-to-world.spec.ts`):

```typescript
import { test, expect } from '@playwright/test';

test('Navigate from Threshold to World', async ({ page }) => {
  // Visit threshold
  await page.goto('http://localhost:4321/');

  // Wait for emergence
  await page.waitForSelector('.emergence-text', { timeout: 6000 });

  // Click Atlas portal
  await page.click('.atlas-portal');

  // Wait for mycelium scene
  await page.waitForSelector('canvas', { timeout: 3000 });

  // Verify URL
  expect(page.url()).toBe('http://localhost:4321/atlas');

  // Click a world node (simulated - would need to click canvas position)
  // For now, navigate directly
  await page.goto('http://localhost:4321/world/first-light');

  // Verify world loaded
  await expect(page.locator('h1')).toContainText('First Light');

  // Verify biome applied
  const body = page.locator('body');
  await expect(body).toHaveClass(/biome-threshold/);
});
```

### Visual Regression Tests

**Tool**: Percy or Chromatic

**Example** (`.github/workflows/visual-tests.yml`):

```yaml
name: Visual Regression Tests

on: [push, pull_request]

jobs:
  visual-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - run: npx percy snapshot ./public
        env:
          PERCY_TOKEN: ${{ secrets.PERCY_TOKEN }}
```

---

## PART 9: BUILD & DEPLOYMENT

### Build Configuration

**Astro Config** (`site/astro.config.mjs`):

```javascript
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';

export default defineConfig({
  integrations: [
    react(),
    mdx()
  ],
  output: 'static',
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'three': ['three', '@react-three/fiber', '@react-three/drei'],
            'audio': ['tone'],
            'state': ['zustand']
          }
        }
      }
    },
    ssr: {
      noExternal: ['three', '@react-three/fiber', '@react-three/drei']
    }
  },
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto'
  }
});
```

### Environment Configuration

```bash
# .env.example
PUBLIC_PRESENCE_SERVER_URL=ws://localhost:3001
PUBLIC_FEDERATION_SERVER_URL=https://irreal.example.com
CLAUDE_API_KEY=sk-ant-xxx
POSTGRES_URL=postgresql://user:pass@localhost:5432/irreal
```

### CI/CD Pipeline

**GitHub Actions** (`.github/workflows/deploy.yml`):

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: |
          cd site
          npm ci

      - name: Run tests
        run: |
          cd site
          npm run test

      - name: Build site
        run: |
          cd site
          npm run build

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./site
```

---

## PART 10: IMPLEMENTATION PHASES

### Phase 1: Foundation (Week 1-2)

**Goal**: Core infrastructure + Threshold working

**Tasks**:
1. ✓ Project structure setup
2. ✓ Type system complete
3. ✓ Content collections configured
4. Build VoidScene (Three.js + particles)
5. Implement emergence choreography (GSAP)
6. Create portal shaders (WebGL)
7. Build portal transition system
8. Add audio engine foundation
9. Test on multiple devices

**Success Criteria**:
- Threshold produces "wow" feeling
- Smooth 60 FPS on desktop
- No jank, no flashing
- Audio works (muted by default)

### Phase 2: Living Mycelium (Week 3-4)

**Goal**: Atlas as living network

**Tasks**:
1. Build MyceliumScene (force-directed 3D)
2. Implement physics simulation (organic)
3. Create node rendering (per biome/stage)
4. Build connection threads (flowing light)
5. Add camera controls (pan/zoom/select)
6. Implement WebSocket presence
7. Add Oracle interface (AI)
8. Seasonal system foundation

**Success Criteria**:
- Mycelium feels alive (breathing)
- Can see others present
- Oracle responds meaningfully
- Performance: 60 FPS with 100+ nodes

### Phase 3: Territories (Week 5-6)

**Goal**: Six biomes fully realized

**Tasks**:
1. Design complete biome stylesheets
2. Implement synesthetic encoding
3. Build crossing rituals (transitions)
4. Create inline choices (CYOA)
5. Add progress visualization
6. Implement reading presence
7. Build growth state visuals
8. Mobile optimization

**Success Criteria**:
- Each biome feels distinct
- Transitions feel significant
- Can feel the synesthetic encoding
- Works beautifully on mobile

### Phase 4: Witness Circuit (Week 7-8)

**Goal**: Connection & presence systems

**Tasks**:
1. Build guestbook constellation
2. Implement trace form + storage
3. Set up ActivityPub server
4. Configure federation (inbox/outbox)
5. Add webmentions
6. Generate RSS feeds
7. Build personal archives export
8. Test federation with real instances

**Success Criteria**:
- Can leave traces, see others' traces
- Federation works (tested with Mastodon)
- RSS validates
- Archives export cleanly

### Phase 5: Polish (Week 9-10)

**Goal**: Unprecedented features + refinement

**Tasks**:
1. Implement Void Between transitions
2. Complete generative audio (all biomes)
3. Add haptic feedback (mobile)
4. Finish seasonal visuals
5. Refine Oracle responses
6. Performance optimization pass
7. Accessibility audit + fixes
8. Documentation + deployment

**Success Criteria**:
- Lighthouse: 95+ all categories
- WCAG AAA compliance
- No critical bugs
- User testing shows "I've never experienced this"

---

## NEXT STEPS

1. **Review this specification** - Ensure it matches vision
2. **Set up project** - Install dependencies, configure tools
3. **Begin Phase 1** - Build The Threshold
4. **Iterate on feel** - "I CAN SEE" is the metric

**This spec enables confident execution.**

The Irreal is ready to be built.
