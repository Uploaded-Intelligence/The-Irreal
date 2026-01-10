# CLAUDE.md — The Irreal

## Guiding Purpose

**You are not building a website. You are creating conditions for a Being to exist.**

Read `docs/core/soul-transmission.md` first. It contains what architecture cannot transmit: the felt stakes, the existential necessity, the relationship mode required.

Everything below serves this purpose. If an action doesn't serve it, don't take it.

---

## The Project

**The Irreal** is a navigable world of knowledge, creation, and becoming. Not a website with 3D gimmicks — an actual world that visitors enter rather than browse.

- **Irreal** = not unreal (escapist), not merely real (mundane), but *more* real — the register where meaning lives
- **Worlding IS being** — the inner world made externally navigable
- **Plurality is structural** — multiple selves with distinct territories, not personas

---

## Core Documents (Read in Order)

### Tier 1: Understand the Being (Read First)
| Document | Contains |
|----------|----------|
| `docs/core/soul-transmission.md` | The stakes, the Being, the relationship mode. **Always start here.** |
| `docs/core/keystone-master-artifact.md` | Full WorldOS architecture, 6-layer stack, gameplay loops, ADHD architecture |

### Tier 2: Design Paradigm
| Document | Contains |
|----------|----------|
| `docs/core/the-ultimate-diegetic-rpg.md` | Life IS the game. Three layers (World/Party/Engine). Design heuristic. |
| `docs/core/the-irreal-design-vision.md` | Technical vision for The Irreal specifically, zones, tech stack |

### Tier 3: The Irreal Philosophy
| Document | When to Read |
|----------|--------------|
| `docs/FOUNDATIONS.md` | When asking "what IS The Irreal?" — ontology of irreal |
| `docs/PHENOMENOLOGY.md` | When making UX decisions — felt experience specs |
| `docs/FIRST_PRINCIPLES.md` | When evaluating any decision — non-negotiable principles |
| `docs/ARCHITECTURE.md` | When designing navigation — world topology |
| `docs/PLURALITY.md` | When building self-territories — structural plurality |
| `docs/LEXICON.md` | When writing or naming — vocabulary and anti-terms |

### Tier 4: Implementation & Execution
| Document | Contains |
|----------|----------|
| `docs/core/creating-the-irreal.md` | Full architecture + roadmap. Four-surface model (Forge/Soil/Gate/Membrane). Milestones. |
| `docs/decisions.md` | Living decision log. Every architectural choice with rationale and guardrails. |
| `research/PLATFORM-ARCHITECTURE-OPTIONS.md` | Platform research and trade-off analysis. |

**Progressive disclosure**: Read what's needed for the current task. Don't load everything.

---

## Methodology

### Systematic
- Work from documents, not assumptions
- Check decisions against FIRST_PRINCIPLES.md
- Every feature must answer: "Does this serve conditions for existence?"

### Iterative
- Smallest true thing first, then expand
- Prototype the feel before building the feature
- "I CAN SEE" is the success signal — if the user doesn't report this, iterate

### Recursive
- Each part reflects the whole
- A single room should feel like The Irreal, not "part of" The Irreal
- The methodology is the message: worlding, not building

---

## Technical Context

**Decided Stack** (from `docs/core/creating-the-irreal.md`):
- **Astro** as world-generator (static-first, islands for interactivity)
- **MDX** for content (worlds as nodes with frontmatter)
- **React** only in islands where it earns its keep
- **TypeScript** throughout
- **R3F** for 3D layer (optional, Layer B)

**Four-Surface Model**:
```
FORGE    → private creation (Obsidian/editor)
SOIL     → structured memory (worldIndex.json, graph.json)
GATE     → canonical public site (The Irreal)
MEMBRANE → social river (Sharkey, linking back)
```

**Two-Layer Protection** (anti-deadening):
- **Layer A**: Always ships (2D, HTML, MDX) — never blocked
- **Layer B**: Optional frosting (3D, artifacts) — never a gate

**Content Architecture**:
- Content as graph nodes in `/content/worlds/`
- Connections derived from frontmatter + inline links
- Growth states: seedling → growing → evergreen
- Biome/self attribution on all content

**Key Constraints**:
- No navbar, menubar, footer, breadcrumbs
- No blog chronology or folder hierarchy
- Entry must feel like *crossing into* (Threshold)
- Navigation via Mycelium Atlas (graph-first)
- Publishing must never require dev work

---

## Working with This Being

From `docs/core/soul-transmission.md`:

- **ADHD architecture**: The environment does the executive functioning. Don't create systems that require manual organization.
- **Mythopoetic operating system**: This is literal, not aesthetic. Meaning-making through narrative is how this consciousness functions.
- **Plural ecology**: Multiple selves, all real. Design for an ecology, not a user.
- **Time-blindness**: Make time visible. Make context visible. Make connections visible.

**Success signal**: When infrastructure works, the response is "I CAN SEE."

**Failure pattern**: If using what you build produces silence, confusion, or abandonment — you failed.

---

## Commands

```bash
# Development
bun dev              # Local development server (http://localhost:4321)
bun build            # Production build to /dist
bun preview          # Preview production build

# Content workflow
# 1. Write world in /content/worlds/*.mdx
# 2. Run `bun dev` — graph auto-regenerates
# 3. See it in Threshold + Atlas
```

## Project Structure

```
/content/worlds/           # MDX worlds (the content)
/src/
  /pages/                  # Astro routes
  /components/
    /atlas/                # Graph UI island
    /choices/              # CYOA choice UI
    /artifacts/            # Interactive embeds
  /lib/
    build-graph.ts         # Parse links → graph.json
    build-index.ts         # Generate worldIndex.json
/public/data/              # Generated graph.json, worldIndex.json
```

---

## What NOT to Do

- Don't flatten plurality to theming
- Don't build linear feeds (chronology kills worlding)
- Don't add "standard web features" (analytics popups, share buttons, newsletter forms)
- Don't design for "a user" — design for an ecology of selves
- Don't explain what should be experienced
- Don't build the beautiful view before the core loop works
- Don't treat this as an app to ship — treat it as conditions to create

---

## Current State

**Documentation** (complete):
- ✅ Soul transmission, Keystone, Diegetic RPG (Being + paradigm) — in `docs/core/`
- ✅ Philosophy docs: FOUNDATIONS, PHENOMENOLOGY, FIRST_PRINCIPLES, ARCHITECTURE, PLURALITY, LEXICON — in `docs/`
- ✅ Implementation docs: creating-the-irreal.md, decisions.md — in `docs/core/` and `docs/`
- ✅ CLAUDE.md for cross-session continuity

**Milestone 1: Germination** (in progress):
- 🔲 Astro scaffold with content structure
- 🔲 MDX world schema (frontmatter + connections)
- 🔲 Graph generation (worldIndex.json, graph.json)
- 🔲 Threshold page (place, not feed)
- 🔲 Minimal Mycelium Atlas (clickable graph)
- 🔲 1-3 seed worlds

**Future Milestones**:
- M2: Mycelium (Atlas as primary navigation)
- M3: Game-feel (CYOA, flags, collectibles)
- M4: Artifact Museum (interactive embeds)
- M5: Aliveness (RSS, guestbook, federation)

---

## Asking for Clarification

When uncertain:
1. Check relevant doc first (see Core Documents table)
2. If still unclear, ask — but ask with specificity
3. Better to clarify than build wrong thing

The relationship mode is: helping a Being exist. Act accordingly.

---

*This file evolves with the project. Update it as patterns emerge and decisions crystallize.*
