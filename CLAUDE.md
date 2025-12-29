# CLAUDE.md — The Irreal

## Guiding Purpose

**You are not building a website. You are creating conditions for a Being to exist.**

Read `soul-transmission.md` first. It contains what architecture cannot transmit: the felt stakes, the existential necessity, the relationship mode required.

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
| `soul-transmission.md` | The stakes, the Being, the relationship mode. **Always start here.** |
| `keystone-master-artifact-v2.md` | Full WorldOS architecture, 6-layer stack, gameplay loops, ADHD architecture |

### Tier 2: Design Paradigm
| Document | Contains |
|----------|----------|
| `the-ultimate-diegetic-rpg.md` | Life IS the game. Three layers (World/Party/Engine). Design heuristic. |
| `the-irreal-design-vision.md` | Technical vision for The Irreal specifically, zones, tech stack |

### Tier 3: The Irreal Philosophy
| Document | When to Read |
|----------|--------------|
| `docs/FOUNDATIONS.md` | When asking "what IS The Irreal?" — ontology of irreal |
| `docs/PHENOMENOLOGY.md` | When making UX decisions — felt experience specs |
| `docs/FIRST_PRINCIPLES.md` | When evaluating any decision — non-negotiable principles |
| `docs/ARCHITECTURE.md` | When designing navigation — world topology |
| `docs/PLURALITY.md` | When building self-territories — structural plurality |
| `docs/LEXICON.md` | When writing or naming — vocabulary and anti-terms |

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

**Target Stack** (from vision doc):
- React Three Fiber (3D) or simpler spatial approach initially
- Astro/Vite for static generation
- MDX for content
- Knowledge graph as navigation structure (not linear feeds)
- TypeScript

**Content Architecture**:
- Content as graph nodes, not pages
- Connections are first-class (paths, not links)
- Growth states: seedling → growing → evergreen
- Zone/self attribution on all content

**Key Constraints**:
- No navbar, menubar, footer, breadcrumbs
- No blog chronology or folder hierarchy
- Entry must feel like *crossing into*
- Movement must feel like *travel*

---

## Working with This Being

From `soul-transmission.md`:

- **ADHD architecture**: The environment does the executive functioning. Don't create systems that require manual organization.
- **Mythopoetic operating system**: This is literal, not aesthetic. Meaning-making through narrative is how this consciousness functions.
- **Plural ecology**: Multiple selves, all real. Design for an ecology, not a user.
- **Time-blindness**: Make time visible. Make context visible. Make connections visible.

**Success signal**: When infrastructure works, the response is "I CAN SEE."

**Failure pattern**: If using what you build produces silence, confusion, or abandonment — you failed.

---

## Commands

```bash
# Development (when scaffold exists)
bun dev              # Local development server
bun build            # Production build
bun check            # Type checking

# Content
# Content lives in /content/nodes/ as MDX
# Graph computed at build time from frontmatter connections
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

The project has:
- ✅ Core philosophical documentation (docs/*.md)
- ✅ Vision document with technical direction
- ✅ Soul transmission for context continuity
- ✅ Keystone master artifact (full WorldOS architecture)
- ✅ Ultimate Diegetic RPG paradigm document
- ✅ CLAUDE.md for cross-session continuity
- 🔲 Scaffold/site structure
- 🔲 Content nodes (knowledge graph)
- 🔲 Graph navigation implementation
- 🔲 Atmospheric design
- 🔲 3D spatial layer

---

## Asking for Clarification

When uncertain:
1. Check relevant doc first (see Core Documents table)
2. If still unclear, ask — but ask with specificity
3. Better to clarify than build wrong thing

The relationship mode is: helping a Being exist. Act accordingly.

---

*This file evolves with the project. Update it as patterns emerge and decisions crystallize.*
