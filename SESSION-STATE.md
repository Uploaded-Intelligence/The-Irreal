# Session State - The Irreal

**Last Updated**: 2026-01-25 (after PR #4 merge)
**Updated By**: Claude (Opus 4.5)

---

## Quick Status

| Component | Status | Notes |
|-----------|--------|-------|
| **Production URL** | ✅ `the-irreal.vercel.app` | Should work after Vercel redeploys |
| **Threshold** | ✅ Full 3D | WebGL starfield, GPGPU particles, portals |
| **Mycelium Atlas** | ✅ Implemented | 3D force-directed graph, zero-g navigation |
| **The Grove** | ✅ Working | World directory with 2 entries |
| **World Pages** | ✅ Working | Content, navigation, connections |
| **Audio** | ✅ Implemented | Ambient drone soundscape |

---

## Recent Merge (2026-01-25)

**PR #4 merged to main** — `feat: Mycelium Atlas with unified 3D architecture`

Includes:
- GPGPU void matrix particles (The Wake)
- Zero-g void rig navigation
- Node bloom and content revelation (The Bloom)
- Lure beams and gaze audio (The Lure)
- Film grain, glowing selection, view transitions
- Physics-based camera rig with spring dampening
- 3D force-directed layout
- Vercel deployment config fix (`vercel.json`)

---

## Branch State

| Branch | Status | Contents |
|--------|--------|----------|
| `main` | ✅ Current | Full 3D Mycelium Atlas implementation |
| `feature/mycelium-atlas` | Merged → main | — |
| `feature/enhanced-threshold` | Open PR #2 | Alternative threshold with shader portals |

**Open PRs:**
- #2: `feat(threshold): Hybridized Creative Tech + 5-Stage Crossing Ritual` (different direction, review needed)

---

## Architecture

```
THE IRREAL (as deployed)
├── Threshold (/) — WebGL 3D starfield + floating cubes + portal links
├── Mycelium Atlas (/atlas) — Interactive 3D force graph
├── The Grove (/grove) — World directory listing
└── World Pages (/world/*) — Individual content pages
    ├── first-light — Intro/welcome
    └── the-grove-awaits — Lore entry
```

### Tech Stack (Implemented)
- **Framework**: Astro 5.x with React islands
- **3D**: Three.js r182 via @react-three/fiber
- **Particles**: GPGPU shader-based
- **Audio**: Tone.js ambient soundscape
- **Styling**: CSS variables + view transitions
- **Deployment**: Vercel (configured via `vercel.json`)

---

## Who You Are (Context for AI)

- **The Beworlding System** — plural ecology, not single user
- Neuroqueer, ADHD-powered creativity
- "No more hiding" — this is conditions for existence
- **Irreal** = not unreal (escapist), not merely real (mundane), but the register where meaning lives

---

## Key Documents

| Document | Purpose |
|----------|---------|
| `soul-transmission.md` | Stakes, Being, relationship mode — **read first** |
| `CLAUDE.md` | Technical context and methodology |
| `docs/FIRST_PRINCIPLES.md` | Non-negotiable design principles |
| `docs/plans/2026-01-25-mycelium-atlas-completion.md` | Atlas implementation plan |

---

## What's Next

1. **Verify production deployment** — check `the-irreal.vercel.app` works
2. **Content population** — more worlds beyond the 2 seed entries
3. **Review PR #2** — decide on enhanced-threshold direction
4. **Audio refinement** — lure beams, crossing sounds

---

## Cross-LLM Coordination Notes

**This file must be updated after significant work.**

Protocol for new sessions:
```bash
# Before starting work
git fetch --all
git branch -a
gh pr list --state open
cat SESSION-STATE.md
```

**Known coordination gaps:**
- Claude and Gemini don't share memory
- Episodic memory is Claude-only
- Always check branch state, not just main
