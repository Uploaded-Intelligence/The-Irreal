# Platform Architecture Options for The Irreal
## Research Document — Living, Iterative

*Last Updated: 2025-12-29*
*Status: Initial research compilation*

---

## The Question

What platform/architecture best serves The Irreal MVP v0.1?

**Requirements from core documents:**
- Knowledge graph navigation (not linear feeds)
- Atmospheric, not "webby"
- Entry feels like crossing into
- Content as nodes with connections
- Growth states (seedling → growing → evergreen)
- Zone/self attribution
- No navbar, menubar, footer, breadcrumbs
- Eventually: 3D spatial layer
- Federated/witnessed (Signal Dock function)

---

## Option Categories

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   1. STATIC SITE GENERATORS (Digital Garden Tools)                          │
│      Quartz, Astro, Hugo, Jekyll, Eleventy                                  │
│      → Content as files, build to static site, graph features vary         │
│                                                                             │
│   2. FEDIVERSE / SOCIAL                                                     │
│      Sharkey, Mastodon, Hubzilla                                            │
│      → ActivityPub integration, social features built-in                    │
│                                                                             │
│   3. 3D / IMMERSIVE WEB                                                     │
│      React Three Fiber, Three.js, Spline                                    │
│      → Spatial navigation, atmosphere-first                                 │
│                                                                             │
│   4. INDIE WEB / LO-FI                                                      │
│      Neocities, Nekoweb, GitHub Pages                                       │
│      → Raw HTML/CSS/JS, maximum control, community                          │
│                                                                             │
│   5. KNOWLEDGE GRAPH SPECIFIC                                               │
│      Obsidian Publish, TiddlyWiki, Logseq                                   │
│      → Graph-native, backlinks built-in                                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

# Category 1: Static Site Generators

## Quartz

**What it is**: Free alternative to Obsidian Publish. Transforms Obsidian vault to website.

**Strengths**:
- Automatic backlinks
- Local graph visualization
- Link previews
- Built for digital gardens
- Free (GitHub Pages hosting)
- v4 rewrite: TypeScript, extensible

**Weaknesses**:
- Tied to Obsidian workflow
- Graph viz is supplementary, not primary navigation
- Still fundamentally "pages with links"
- No atmospheric/3D capabilities
- Looks like a digital garden (not a world)

**Verdict**: Good for content publishing, not for world-building.

**Source**: [Quartz Documentation](https://quartz.jzhao.xyz/)

---

## Astro

**What it is**: Modern static site generator with islands architecture.

**Strengths**:
- Excellent MDX support
- Content collections (structured content)
- TypeScript native
- Can integrate React Three Fiber
- Fast builds, minimal JS by default
- Highly flexible

**Weaknesses**:
- No built-in graph features (must build)
- MDX + content collections have had bugs in v5
- Still fundamentally page-based
- Atmospheric design is on you

**Verdict**: Strong foundation for custom build. Good hybrid base.

**Source**: [Astro Docs](https://docs.astro.build/)

---

## Hugo / Jekyll

**What it is**: Traditional static site generators. Hugo (Go), Jekyll (Ruby).

**Strengths**:
- Extremely fast builds (Hugo especially)
- Huge theme ecosystem
- Battle-tested, stable
- Markdown native

**Weaknesses**:
- Designed for blogs (chronological)
- Graph features require significant customization
- Not component-based (harder to add interactivity)
- Feels dated for modern web

**Verdict**: Not aligned with The Irreal's needs.

---

## Eleventy (11ty)

**What it is**: Flexible, minimal static site generator.

**Strengths**:
- Very flexible (any templating language)
- Fast, simple
- Good for custom approaches

**Weaknesses**:
- Minimal by design (must build everything)
- No built-in graph
- Less ecosystem than Astro

**Verdict**: Possible but Astro offers more for similar effort.

---

# Category 2: Fediverse / Social

## Sharkey

**What it is**: Misskey fork. Beautiful, customizable Fediverse server.

**Strengths**:
- ActivityPub native (federated)
- Gorgeous UI (best in Fediverse)
- Highly customizable (themes, plugins via AiScript)
- Profile backgrounds, music status
- Import from other platforms
- Self-hostable
- TypeScript codebase

**Weaknesses**:
- Social media paradigm (posts, follows, timelines)
- Not designed for knowledge graph / digital garden
- Requires server infrastructure
- Not spatial/atmospheric
- Content is ephemeral (feed-based)

**Verdict**: Good for social/federated layer, not for primary world structure.

**Sources**:
- [Sharkey Official](https://joinsharkey.org/)
- [Elena Rossini's Sharkey Review](https://blog.elenarossini.com/sharkey-a-fediverse-project-that-is-beautiful-inside-out/)

---

## Hubzilla / Streams

**What it is**: Fediverse platform with nomadic identity, wiki features.

**Strengths**:
- Wiki/CMS features built-in
- Nomadic identity (move between servers)
- More content-focused than microblogging

**Weaknesses**:
- Smaller community
- Less polished UI
- Complex setup

**Verdict**: Worth exploring but less mature.

---

# Category 3: 3D / Immersive Web

## React Three Fiber (R3F)

**What it is**: Declarative Three.js for React.

**Strengths**:
- React's component model for 3D
- Excellent ecosystem (@react-three/drei, postprocessing)
- HTML in 3D space (critical for content)
- Hot reload development
- TypeScript support
- Active community

**Weaknesses**:
- Significant learning curve
- Performance requires expertise
- Asset creation (3D models) is separate skill
- Accessibility challenges

**Key capability**: `<Html>` component from drei allows placing HTML/React content IN 3D space. This is critical for The Irreal.

**Verdict**: THE choice for 3D layer. Question is: start here or evolve toward it?

**Sources**:
- [React Three Fiber Docs](https://docs.pmnd.rs/react-three-fiber)
- [Vercel R3F Guide](https://vercel.com/blog/add-3d-to-your-web-projects-with-v0-and-react-three-fiber)

---

## Bruno Simon Style

**What it is**: Fully immersive 3D web experiences (like Bruno Simon's portfolio).

**Key insight**: "Everything had to be part of the 3D world, and he chose to have no interface so that the experience could be as immersive as possible."

**Strengths**:
- Maximum immersion
- Navigation IS the experience
- Proves the concept is possible

**Weaknesses**:
- Extremely high effort
- Custom everything
- Accessibility very challenging
- Mobile/performance issues

**Source**: [Bruno Simon Portfolio](https://bruno-simon.com/)

**Verdict**: Aspirational north star, not MVP approach.

---

## Spline

**What it is**: Visual 3D design tool, exports to web.

**Strengths**:
- Visual design (not code-first)
- Can export to React/vanilla JS
- Faster prototyping for 3D

**Weaknesses**:
- Less control than R3F
- Vendor dependency
- May not integrate well with content system

**Verdict**: Possible for asset creation, not for full solution.

---

# Category 4: Indie Web / Lo-Fi

## Neocities

**What it is**: Free web hosting inspired by GeoCities. 1GB space.

**Strengths**:
- Free
- 500k+ users, strong community
- Raw HTML/CSS/JS (maximum control)
- Indie web philosophy aligned
- No algorithms, no AI

**Weaknesses**:
- No build system
- No content management
- Everything manual
- 1GB limit
- No server-side anything

**Community insight**: "The indie web movement revives personal website creation... promotes human-created, creative content and rejects algorithms."

**Source**: [Neocities](https://neocities.org/)

**Verdict**: Good for static hosting, but need tooling built elsewhere.

---

## Nekoweb

**What it is**: Newer indie web host, "graduate school" of Neocities.

**Strengths**:
- More connected community
- Blocks AI crawlers (explicit stance)
- Growing feature set

**Weaknesses**:
- Smaller, newer
- Similar limitations to Neocities

**Source**: [Nekoweb](https://nekoweb.org/)

**Verdict**: Alternative to Neocities, similar trade-offs.

---

## GitHub Pages

**What it is**: Free static site hosting from GitHub repos.

**Strengths**:
- Free
- Git-based (version control)
- CI/CD built-in (GitHub Actions)
- Custom domains
- Well-documented

**Weaknesses**:
- Static only
- GitHub dependency

**Verdict**: Excellent free hosting for any static approach.

---

# Category 5: Knowledge Graph Specific

## Obsidian Publish

**What it is**: Official Obsidian hosted publishing.

**Strengths**:
- Graph visualization built-in
- Backlinks native
- Seamless from Obsidian workflow
- Good defaults

**Weaknesses**:
- $8/month
- Limited customization
- Looks like Obsidian (not unique)
- No 3D/atmospheric

**Verdict**: Easy but not distinctive enough.

---

## TiddlyWiki

**What it is**: Single HTML file wiki. Incredibly powerful and unique.

**Strengths**:
- Single file (portable, self-contained)
- Bi-directional links native
- Highly customizable via macros
- Devoted community
- Non-linear by design

**Weaknesses**:
- Steep learning curve
- Unique syntax/approach
- Not modern web tech
- Limited 3D/atmospheric options

**Verdict**: Philosophically aligned but tech stack mismatch.

---

## Logseq

**What it is**: Graph-based note-taking, can publish.

**Strengths**:
- Graph visualization
- Block-based (like Roam)
- Open source

**Weaknesses**:
- Publishing less mature than writing
- Designed for personal knowledge, not public world

**Verdict**: Not for primary publishing.

---

# Hybrid Approaches

## Approach A: Astro + R3F Evolution

```
PHASE 1: Astro + MDX (write and post NOW)
├── Content as MDX files with frontmatter
├── Graph computed from connections in frontmatter
├── Atmospheric but 2D (dark, spatial feel)
├── Deployable immediately (Netlify/Vercel/GitHub Pages)

PHASE 2: Add 3D layer
├── Integrate React Three Fiber
├── Content panels exist in 3D space
├── Navigation becomes spatial
├── 2D content preserved, wrapped in 3D

PHASE 3: Full Irreal
├── Complete 3D world
├── Zone-specific atmospheres
├── Plural territories
├── Claude artifacts embedded
```

**Pros**: Start writing immediately, evolve incrementally
**Cons**: May need significant refactoring between phases

---

## Approach B: R3F from Start, Minimal

```
PHASE 1: Single 3D Room
├── One atmospheric space
├── Content as HTML panels in 3D
├── Minimal but TRUE to vision
├── Proves the feel before scaling

PHASE 2: Expand World
├── Add zones
├── Add navigation between spaces
├── Content system matures

PHASE 3: Full Irreal
├── (same as above)
```

**Pros**: Vision-aligned from day one, no compromise
**Cons**: Slower to first post, higher technical bar

---

## Approach C: Sharkey + Static World Hybrid

```
SHARKEY INSTANCE (social/federated layer)
├── Posts federate to Fediverse
├── Social interaction
├── "Signal Dock" function
├── Living/ephemeral content

STATIC WORLD (The Irreal proper)
├── Astro + R3F
├── Evergreen content
├── Knowledge graph
├── The actual world

BRIDGE:
├── Sharkey posts can link to Irreal content
├── Irreal embeds/displays Sharkey activity
├── Two layers serving different functions
```

**Pros**: Best of both worlds, federated presence
**Cons**: Two systems to maintain, complexity

---

## Approach D: Neocities + Custom Build

```
BUILD LOCALLY:
├── Astro/Vite builds static site
├── R3F compiles to static JS/HTML

DEPLOY TO NEOCITIES:
├── Upload built files
├── Indie web hosting
├── Community visibility

OPTIONAL: Mirror to GitHub Pages
```

**Pros**: Indie web community, free hosting, own your stuff
**Cons**: Manual deployment, 1GB limit

---

# Analysis: What The Irreal Needs

## Must Have
- [ ] Knowledge graph as primary navigation
- [ ] Atmospheric (not "webby")
- [ ] MDX or Markdown for content authoring
- [ ] Growth states visible
- [ ] No forced linearity
- [ ] Deployable (can post NOW)

## Should Have
- [ ] 3D capability (now or evolution path)
- [ ] Federated/ActivityPub (Signal Dock function)
- [ ] Zone/self attribution
- [ ] Claude artifact embedding
- [ ] Dark/spatial aesthetic

## Nice to Have
- [ ] Full VR experience
- [ ] Real-time features
- [ ] Visitor traces

---

# Recommendation Framework

## If Priority = "Post NOW, 3D Later"
**Use**: Astro + MDX + custom graph navigation
**Host**: GitHub Pages or Vercel
**Path**: Approach A

## If Priority = "Vision-True from Start"
**Use**: R3F minimal world + content panels
**Host**: Vercel (needs SPA routing)
**Path**: Approach B

## If Priority = "Federated Presence"
**Use**: Sharkey for social + static world for content
**Host**: Self-hosted Sharkey + static hosting
**Path**: Approach C

## If Priority = "Indie Web Community"
**Use**: Astro build → Neocities hosting
**Host**: Neocities
**Path**: Approach D

---

# Open Questions

1. **What's the actual priority?** Writing/posting vs. atmospheric experience?

2. **How much 3D is truly essential for v0.1?** Can atmospheric 2D suffice initially?

3. **Is federation essential or aspirational?** Sharkey integration adds complexity.

4. **What's the content volume expectation?** Many small nodes or fewer deep pieces?

5. **Who maintains this?** Solo or eventual contributors?

---

# Next Steps

After reviewing, decide:
1. Which approach resonates most
2. What's truly essential for v0.1
3. What can wait for v0.2+

Then: prototype the core loop before building the beautiful view.

---

*This document will evolve as we learn more and make decisions.*
