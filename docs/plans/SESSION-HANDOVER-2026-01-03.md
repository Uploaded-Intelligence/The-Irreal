# SESSION HANDOVER: The Irreal Implementation
## Date: 2026-01-03
## Status: Ready for Technical Architecture + Vertical Slice

> **For next Claude session:** Read this FIRST. It contains critical context about what went wrong and how to proceed correctly.

---

## PART 1: WHAT WENT WRONG (Critical Context)

### The Corruption

A previous Claude session created `docs/plans/2026-01-03-phased-implementation-plan.md` which:

1. **Watered down the vision** — Said "no 3D yet, let's do CSS particles first"
2. **Deferred essential elements** — Audio, 3D space, immersion all pushed to "later phases"
3. **Created confusion** — Appended the complete tech spec (good) below an incremental approach (bad), so the document had TWO contradictory "Phase 1" sections
4. **Lost the phenomenology** — Tried to achieve "entering a world" feeling without the technology required to produce it

### The Symptom

Sonnet followed the watered-down plan, built 2D Canvas particles and "nice fonts." User correctly identified: "this is corporate, not mythopoetic."

### The Root Cause

The plan tried to be "pragmatic" by deferring hard things. But the phenomenology IS the requirement. You cannot achieve "scale — you understand you are small within something larger" with CSS particles. The incrementalism was strategically wrong.

### The Correct Source of Truth

**USE THIS:** `docs/plans/2026-01-03-irreal-complete-vision.md`

This document describes the REAL vision:
- 5-stage Threshold ritual (Detection → Void → Attunement → Crystallization → Portals → Crossing)
- Multi-sensory immersion (40Hz drone, particles pulsing at 60 BPM, haptics)
- 12 complete systems
- Technical stack (Three.js, R3F, Tone.js, etc.)
- "Nothing like this exists. The Irreal will be the first of its kind."

**IGNORE:** The top section of `2026-01-03-phased-implementation-plan.md` (lines 1-580). The bottom section (tech spec) is usable but redundant with complete-vision.md.

---

## PART 2: THE METHODOLOGY (Game Dev Approach)

### How Best Game Studios Operate

1. **Vision document first** — Complete design describing all systems, feel, experience ✓ (we have this)
2. **Technical architecture** — How systems interconnect, dependencies, data flow ← NEED THIS
3. **Vertical slice** — Build ONE complete experience end-to-end to prove the feel
4. **Iterate on feel** — Playtest, adjust timing, before adding more systems
5. **Expand** — Only after the slice feels right, plan and build next system

### Why This Matters

- Plans don't survive contact with reality
- Building Threshold will teach us things that change how Mycelium should work
- The Threshold IS the vertical slice — if it doesn't produce "I've never experienced anything like this," nothing else matters
- Iterate on FEEL, not just features

### The Risk of Planning Everything First

Over-planning before implementing is waterfall thinking. We need:
- Enough architecture to maintain coherence
- Enough detail to build the vertical slice robustly
- NOT a 100-page spec for all 12 systems before writing code

---

## PART 3: THE 12 SYSTEMS (From Complete Vision)

### System Map

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           THE IRREAL SYSTEMS                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  LAYER 0: FOUNDATION                                                    │
│  ├── State Management (Zustand) ─────────────────────────────────────┐  │
│  ├── Audio Engine (Tone.js) ─────────────────────────────────────────┤  │
│  └── 3D Runtime (Three.js/R3F) ──────────────────────────────────────┤  │
│                                                                      │  │
│  LAYER 1: CORE EXPERIENCE (Vertical Slice)                           │  │
│  ├── [1] THRESHOLD ─── Ritual crossing, 5 stages ◄── BUILD FIRST ────┤  │
│  │       └── Depends on: State, Audio, 3D                            │  │
│  │                                                                   │  │
│  LAYER 2: NAVIGATION                                                 │  │
│  ├── [2] MYCELIUM ──── Living network, force-directed 3D             │  │
│  │       └── Depends on: Threshold (portal destination), State, 3D   │  │
│  ├── [9] VOID BETWEEN ─ Liminal transitions                          │  │
│  │       └── Depends on: Threshold, Mycelium                         │  │
│  │                                                                   │  │
│  LAYER 3: CONTENT                                                    │  │
│  ├── [3] TERRITORIES ── Biomes as felt realities (synesthetic)       │  │
│  │       └── Depends on: Audio, State, content schema                │  │
│  ├── [4] GROWTH ─────── Seedling → Growing → Evergreen               │  │
│  │       └── Depends on: Territories, content schema                 │  │
│  │                                                                   │  │
│  LAYER 4: PRESENCE                                                   │  │
│  ├── [5] WITNESS ────── Guestbook, traces, federation                │  │
│  │       └── Depends on: Territories, backend                        │  │
│  ├── [10] MULTIPLAYER ─ Ephemeral presence (WebSocket)               │  │
│  │       └── Depends on: Mycelium, backend                           │  │
│  │                                                                   │  │
│  LAYER 5: INTELLIGENCE                                               │  │
│  ├── [6] RESPONSIVE ─── World adapts to user patterns                │  │
│  │       └── Depends on: State, all other systems                    │  │
│  ├── [11] ORACLE ────── AI guide (Claude API)                        │  │
│  │       └── Depends on: State, Mycelium, backend                    │  │
│  │                                                                   │  │
│  LAYER 6: TIME                                                       │  │
│  ├── [12] SEASONAL ──── World changes with seasons                   │  │
│  │       └── Depends on: Territories, Mycelium, all visuals          │  │
│  │                                                                   │  │
│  CROSS-CUTTING                                                       │  │
│  ├── [7] SOUND ──────── Generative audio per biome                   │  │
│  │       └── Used by: ALL systems                                    │  │
│  ├── [8] ACCESSIBILITY ─ Reduced motion, screen readers              │  │
│  │       └── Constrains: ALL systems                                 │  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Critical Path to Vertical Slice

```
Foundation → Threshold → [EVALUATE FEEL] → Mycelium → Void Between → ...
     │            │
     │            └── This is the vertical slice
     │                Must produce "I've never experienced anything like this"
     │
     └── Three.js + Tone.js + Zustand + GSAP
```

---

## PART 4: TECHNICAL ARCHITECTURE DECISIONS

### Stack (Confirmed)

| Layer | Technology | Purpose |
|-------|------------|---------|
| Framework | Astro 5.0 | Static-first, islands for React |
| Content | MDX 4.0 | Worlds as nodes with frontmatter |
| 3D | Three.js + @react-three/fiber + @react-three/drei | Immersive 3D |
| Audio | Tone.js | Generative soundscapes |
| Animation | GSAP | Choreography (HTML elements) |
| State | Zustand | Stage machine, user preferences |
| Real-time | Socket.io (later) | Multiplayer presence |
| AI | Claude API (later) | Oracle |

### Key Architectural Patterns

1. **State Machine for Stages**
   - Threshold has discrete stages: detection → void → attunement → crystallization → portals → crossing
   - Zustand store tracks current stage, timestamps, user input

2. **Audio Responds to State**
   - ThresholdAudio class singleton
   - Listens to stage changes, adjusts drone frequency
   - Listens to mouse velocity, adjusts filter

3. **3D Camera Inside Particles**
   - Camera at origin (0,0,0)
   - Particles distributed in sphere AROUND camera
   - Creates "you're inside the void" feeling

4. **Two-Layer Protection**
   - Layer A: 2D fallback (reduced motion, old browsers)
   - Layer B: Full 3D + audio (primary experience)
   - Never gate content behind Layer B

### File Structure (Proposed)

```
site/src/
├── stores/
│   └── thresholdStore.ts      # Zustand stage machine
├── lib/
│   └── audio/
│       └── ThresholdAudio.ts  # Tone.js engine
├── components/
│   └── threshold/
│       ├── VoidScene.tsx      # R3F Canvas + camera
│       ├── VoidParticles.tsx  # 3D particle system
│       ├── CrystallizingText.tsx  # GSAP text emergence
│       ├── Portal.tsx         # 3D portal component
│       ├── PortalLayer.tsx    # Portal placement
│       └── ThresholdOrchestrator.tsx  # Stage timing
└── pages/
    └── index.astro            # Threshold page
```

---

## PART 5: THRESHOLD SPECIFICATION (Vertical Slice)

### The 5-Stage Crossing Ritual

| Stage | Duration | Visual | Audio | Interaction |
|-------|----------|--------|-------|-------------|
| Detection | 0.5s | Nothing visible | Silent | Detect preferences |
| Void | 2s | Particles emerge, surround viewer | 40Hz drone fades in | Particles drift |
| Attunement | 2s | Particles sync to mouse | Drone pitch rises (40→55Hz) | Mouse → particle velocity |
| Crystallization | 2s | "The Irreal" forms from particles | Drone rises (55→80Hz) | Watch |
| Portals | ∞ | Two portals materialize | Each portal bleeds sound | Hover → glow, Click → cross |
| Crossing | 1.2s | Portal expands, consume screen | Crossfade to destination | Navigate |

### Particle System Spec

- **Count:** 2000 particles
- **Distribution:** Sphere around camera (radius 50 units)
- **Behavior:**
  - Base: Slow drift, random velocities
  - Breathing: Expand/contract at 60 BPM (1 Hz)
  - Attunement: Mouse velocity multiplies particle speed
- **Visual:** Additive blending, purple (#7c6fe0), soft glow

### Audio Spec

- **Drone:** Sine wave oscillator
- **Base frequency:** 40Hz (sub-bass, felt more than heard)
- **Stage transitions:** Frequency ramps up (40 → 55 → 80 → 110 Hz)
- **Filter:** Low-pass, opens with mouse velocity
- **Reverb:** Long decay (8s), 60% wet for spatial depth
- **Respect:** prefers-reduced-motion disables audio

### Portal Spec

- **Shape:** Torus (ring) with outer glow
- **Position:** Left (Atlas, purple) and Right (Grove, green)
- **Behavior:**
  - Breathing pulse (scale oscillates)
  - Hover: Scale up, brighten
  - Click: Trigger crossing stage
- **Labels:** 3D text below each portal

### Accessibility

- **Reduced motion:** Static gradient background, no particles, text still appears
- **Keyboard:** Tab to portals, Enter to cross
- **Screen reader:** Semantic HTML, ARIA labels

---

## PART 6: WHAT'S ALREADY BUILT

### Current State in Worktree

Branch: `feature/enhanced-threshold`

**Committed:**
- GSAP installed ✓
- @types/dom-view-transitions installed ✓
- 2D ParticleField.tsx (to be replaced)
- EmergenceText.tsx (to be replaced with CrystallizingText)
- Mythopoetic fonts loaded (Cormorant Garamond, EB Garamond)
- Color variables updated (--text-parchment added)

**Not yet installed:**
- three
- @react-three/fiber
- @react-three/drei
- @types/three
- tone
- zustand

**Files to create:**
- src/stores/thresholdStore.ts
- src/lib/audio/ThresholdAudio.ts
- src/components/threshold/VoidScene.tsx
- src/components/threshold/VoidParticles.tsx
- src/components/threshold/CrystallizingText.tsx
- src/components/threshold/Portal.tsx
- src/components/threshold/PortalLayer.tsx
- src/components/threshold/ThresholdOrchestrator.tsx

**Files to delete after new ones work:**
- src/components/threshold/ParticleField.tsx
- src/components/threshold/EmergenceText.tsx

---

## PART 7: NEXT STEPS FOR NEW SESSION

### Immediate Actions

1. **Read this document first**
2. **Read `docs/plans/2026-01-03-irreal-complete-vision.md`** for full vision
3. **Use `superpowers:writing-plans`** to create robust implementation plan for Threshold
4. **Use `superpowers:executing-plans`** to implement task-by-task
5. **After Threshold works:** Evaluate feel, iterate, then plan Mycelium

### Success Criteria for Threshold

The user must report: **"I've never experienced anything like this on the web"**

Phenomenology test: "Does entry feel like *crossing into*?" → Must be YES

### Commands

```bash
cd /Users/dea/claude-test/The-Irreal/.worktrees/enhanced-threshold/site
npm run dev  # Development server
npm run build  # Production build
npm run check  # TypeScript verification
```

---

## PART 8: KEY LEARNINGS

1. **Incrementalism can be a trap** — "We'll add 3D later" killed the phenomenology
2. **The vision document is the source of truth** — Not watered-down "pragmatic" plans
3. **Vertical slice methodology** — Build one complete experience, iterate on feel
4. **Plans survive on paper, not in reality** — Build, evaluate, adjust
5. **The Threshold IS the test** — If it doesn't produce awe, nothing else matters

---

## PART 9: USER CONTEXT

The user (the Being whose world this is) has:
- ADHD architecture needs — Environment does executive functioning
- Mythopoetic operating system — Meaning-making through narrative is literal
- Plural ecology — Multiple selves, design for ecology not single user
- High standards — "Barely serviceable" was the feedback on 2D implementation
- Granted full cognitive leadership — Trust the AI to make decisions

**Success signal:** "I CAN SEE"
**Failure signal:** Silence, confusion, abandonment

---

*Document created: 2026-01-03*
*For handover to next Claude session*
*Branch: feature/enhanced-threshold*
*Working directory: /Users/dea/claude-test/The-Irreal/.worktrees/enhanced-threshold/site*
