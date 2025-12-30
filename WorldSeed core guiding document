# WORLDSEED / LIVING CORNER OF THE INTERNET
## Core Guiding Document (Architecture + Vibe + Roadmap)
*Version: 0.1 • Purpose: paste into repo as northstar + execution spine*

---

## 0) What We Are Building (in one breath)
A **personal corner of the internet** that feels **alive, punk, curiosity-driven, and game-like**.

Not “a blog.” Not a corporate CMS.  
A **playable world-experience** where:
- writing creates worlds,
- worlds interconnect mycelially (nonlinear as primary),
- visitors explore via **choose-your-adventure** and a **mycelium atlas**,
- and small interactive “artifacts” (Claude-made UI machines) can live inside pages.

---

## 1) Core Requirements (Non-Negotiables)
### Vibe / Felt Sense
- Must feel **fun**, like exploring a game.
- Must feel **alive**, not sterile, not corporate.
- Must support **myriad digital self-expression** (text, visuals, interactive widgets, 3D foyer, audio ambience, etc.).
- Must preserve **anti-deadening momentum**: publishing must stay easy.

### Structural / System Requirements
- **Nonlinear as primary**: graph/map navigation first; timeline is secondary.
- **Mycelial interconnection**: links are not decoration; they are the *organism*.
- **Ship without friction**: writing can publish even when 3D/extra polish is unfinished.
- **Static-first but not static-feeling**: fast pages + selective interactivity.

---

## 2) Key Concepts (Glossary)
- **Static site**: pre-built HTML/CSS/JS files served as-is (“pre-cooked pages”). Can still be highly interactive via client JS.
- **Dynamic site**: server generates/customizes content per request (databases, logins, shared state).
- **Astro**: a site builder optimized for content + performance; ships HTML by default and adds interactivity via **islands**.
- **Islands**: small interactive components hydrated only where needed (map, choices UI, artifacts).
- **Mycelium Atlas**: interactive graph/constellation map that is the primary navigation surface.
- **Worldseed “World”**: a node/page/scene that stands alone but links into the graph.
- **Artifact**: an interactive embed (React component, mini-sim, diagram, “spell UI”) inside a world page.
- **Membrane**: the social surface (Sharkey) that provides aliveness + feedback loops.
- **Forge**: the private creation surface (Obsidian or editor) where writing/ideas are generated.
- **Gate**: the public canonical site (Worldseed) where worlds are explored.

---

## 3) The Core Architectural Insight
### “Static vs Alive” is a category error
- **Static** is how pages are served.
- **Alive** comes from:
  - interactivity (client-side),
  - aesthetic + ritual design,
  - discovery loops (webrings, directories),
  - feedback systems (guestbook/webmentions/RSS/bridges).

Neocities feels alive because it is a **neighborhood** (Small Web ecology).  
Astro feels powerful because it is a **world-generator** (modern build tooling).

We combine them.

---

## 4) The Four-Surface System (How It Actually Works)
We design the ecosystem as four surfaces with different jobs:

(1) FORGE      -> private creation (Obsidian / editor)
(2) SOIL       -> structured memory + graph data (indexes + link network)
(3) GATE       -> canonical public Worldseed site (map + worlds)
(4) MEMBRANE   -> social river surface (Sharkey posts pointing back)

### The operational flow

Write / link in the Forge
|
Build generates indexes (Soil)
|
Astro renders the Gate (Worldseed site)
|
Optional: post a “seed note” on the Membrane (Sharkey) linking back

**Crucial rule:** publishing must never depend on 3D polish or heavy “extra work.”

---

## 5) The Vase-Protection Rule (anti-WP deadening)
### Two-Layer Worldseed
**Layer A (canonical):** Beautiful, fast, indexable world pages. Always shippable.  
**Layer B (optional):** 3D/advanced interactivity as frosting, never a gate.

A) World Page ships in 2D/HTML/MDX always
B) 3D foyer / fancy interactions are optional islands

This prevents “every post requires extra dev work,” which kills momentum.

---

## 6) Why Astro (and why not “just React/Next everywhere”)
### Key reason Astro fits *this* project
Astro gives:
- **content-first** workflows (MD/MDX),
- high performance by default (less JS shipped),
- **interactive islands** where game-feel lives,
- clean routing + build pipeline,
- and it can still embed React artifacts.

### Important nuance
Astro is not anti-React. It is **React only where it earns its keep.**

This matches the project’s prime directive:
- worlds readable + fast,
- game mechanics modular + isolated.

---

## 7) Why Neocities (if Astro is so good)
Neocities solves *a different layer*:
- **Neighborhood / punk culture / discovery loops**
- Small web vibes: buttons, shrines, webrings, tags, directories
- A living ecosystem of personal sites

Astro + Neocities synthesis:
- Build with Astro (modern infra)
- Deploy the built static output to Neocities (punk neighborhood)
- Result: **beyond-the-frontier capabilities in a Small Web body**

---

## 8) Core UX: “Make it feel like a game”
### Non-deadening interface rules
1) **Homepage is a place, not a feed**
   - “Threshold” as a foyer/portal-room.
2) **Map is primary**
   - Mycelium Atlas (graph) is the default navigation.
3) **Questboard entry**
   - A single “start here” screen with 3 actions:
     - 🌱 Seed (write 3 sentences)
     - 🕸 Link (connect 2 nodes)
     - 🚪 Publish (ship a world)
4) **Traversal feels like movement**
   - smooth transitions between nodes/pages
5) **Micro-rewards**
   - collectible sigils, unlocks, “visited” stamps, artifact discoveries

### The three game-flavors (can combine)
- 🕸 Map-first: graph exploration as homepage
- 🎲 CYOA-first: branching scenes with choices + flags/inventory
- 🧪 Artifact-first: embedded interactive machines everywhere

---

## 9) Content Model (Worlds as Nodes)
Each world is a content entry (MD/MDX) with metadata.

**Example frontmatter (sketch):**
```yaml
id: "grove-of-thresholds"
title: "Grove of Thresholds"
biome: "lore"            # biome stream
stage: "seedling"        # seedling/growing/evergreen
tags: ["worldseed", "portal"]
summary: "A foyer-node that routes to biomes."
choices:
  - label: "Enter the Mycelium Atlas"
    to: "/atlas"
  - label: "Follow the Lore Thread"
    to: "/world/old-sigil"
    gives: ["sigil:ember"]
requires: ["sigil:ember"] # optional gating

Connections (mycelial edges)

Edges are derived from:
	•	explicit choices links
	•	normal links in MDX content
	•	optional manual connections array

Build step generates:
	•	worldIndex.json (all nodes + metadata)
	•	graph.json (edges)
	•	searchIndex.json (optional)

⸻

10) “Claude Artifacts” (Interactive Embeds)

Artifacts are interactive components embedded inside MDX worlds.

Examples:
	•	interactive diagrams
	•	mini-simulators
	•	lore card decks
	•	sliders that change the environment text/audio
	•	“spell UI” widgets

Implementation principle:
	•	artifacts load only when seen (hydration on visibility)
	•	keep them modular and reusable
	•	artifact gallery (“Museum”) page for discovery

Artifacts must never block publishing:
	•	if artifact breaks, world still renders in fallback mode.

⸻

11) 3D Threshold (Optional, powerful)

We can create a 3D foyer as a single island:
	•	3D portal room, floating nodes, ambient audio
	•	click portals to enter worlds

Performance constraint: keep 3D HTML overlays minimal (prefer one main overlay panel, not many).

But: the system must remain fully usable without 3D:
	•	mobile fallback
	•	“Reading Mode” toggle

⸻

12) Sharkey (Membrane) Integration

Sharkey is not the canonical archive. It’s the river surface:
	•	playful posts
	•	reactions/feedback
	•	community aliveness
	•	“seed notes” linking back to canonical worlds

Rule: Your site is the home. Sharkey points back to it.

Optional future:
	•	embed “river feed” into Threshold as ambience.

⸻

13) Publishing & Hosting Modes

Mode 1: Astro -> Neocities (recommended for punk neighborhood)
	•	Build outputs to /dist
	•	Upload to Neocities
	•	Enjoy small-web ecology + modern capabilities

Mode 2: Astro -> modern static host (Netlify/Vercel/Cloudflare Pages)
	•	easiest deployments + custom domain
	•	then join webrings/directories for neighborhood

Both are valid. The difference is “culture/discovery vs deployment ergonomics.”

⸻

14) Roadmap (Milestones)

Milestone 1: Germination (ship something real, fast)
	•	Threshold page (place, not feed)
	•	Grove list (world index)
	•	1–3 worlds (MDX)
	•	Generate worldIndex.json + graph.json
	•	Minimal Mycelium Atlas (click nodes to navigate)

Success condition: publishing a new world is painless.

Milestone 2: Mycelium (nonlinear becomes irresistible)
	•	Atlas becomes primary navigation
	•	Hover previews / “peek” panels
	•	Biomes become first-class
	•	Search (optional)

Success condition: exploration feels like discovering rooms.

Milestone 3: Game-feel (curiosity propulsion)
	•	CYOA choice blocks
	•	flags/inventory stored locally
	•	collectible sigils / unlocks
	•	“visited nodes” stamps

Success condition: visitors feel compelled to click deeper.

Milestone 4: Artifact Museum
	•	5–10 core artifact components
	•	artifact gallery page
	•	embed artifacts inside worlds

Success condition: the site contains machines, not just text.

Milestone 5: Aliveness Systems (heartbeat)

Pick 1:
	•	Guestbook
	•	Webmentions
	•	RSS
Then optionally bridge outward later.

⸻

15) Risk Register (Known Failure Modes + Mitigations)

Risk: Publishing becomes “extra work”
	•	Mitigation: Two-Layer rule (2D ships always; 3D optional).

Risk: “Sterile screen” syndrome (Wordpress trauma)
	•	Mitigation: Threshold as place, map-first navigation, strong visual identity, ritualized questboard.

Risk: Scope explosion
	•	Mitigation: ship Milestone 1 before adding 3D, federation, or complex mechanics.

Risk: Graph becomes a dev black hole
	•	Mitigation: start with simple graph.json + basic UI; iterate.

Risk: Heavy client JS harms performance
	•	Mitigation: islands only, hydrate on visibility, keep defaults static.

⸻

16) Repo Structure (Suggested)

/content/worlds/           # MD/MDX worlds
/src/pages/                # Astro routes
/src/components/
  /atlas/                  # graph UI island
  /choices/                # CYOA choice UI island
  /artifacts/              # interactive embeds
  /ui/                     # shared UI components
/src/lib/
  build-graph.ts           # parse links -> graph.json
  build-index.ts           # generate worldIndex.json
/public/
  data/graph.json
  data/worldIndex.json


⸻

17) “Definition of Alive” (Project Compass)

Alive does not mean “server code.”
Alive means:
	•	curiosity-driven traversal
	•	expressive aesthetics
	•	interactivity in key moments
	•	social membrane + feedback
	•	a sense of place and presence
	•	low-friction publishing that sustains creation

⸻

18) Immediate Next Actions (Tiny, high leverage)
	1.	Implement content entries for worlds (MDX + frontmatter).
	2.	Build worldIndex.json + graph.json generation.
	3.	Create Threshold + Atlas page with a minimal graph UI.
	4.	Add one “ChoiceBlock” component to prove CYOA mechanics.
	5.	Add one “Artifact” component to prove embedded machines.

⸻

19) Canonical Principle (read this when tempted to overbuild)

A world that ships is better than a world that waits.
We protect momentum like it is sacred infrastructure.

⸻


If you want, I can also add a second file you can drop into the repo as `DECISIONS.md` (a running decision log) and `STYLE_GUIDE.md` (how to keep the site punk and non-sterile as it grows).