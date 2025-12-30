# DECISIONS.md
## Worldseed Decision Log
*Purpose: keep the organism coherent as it grows. Every “yes” implies a thousand silent “nos.”*

---

## How to use this file
Each decision gets:
- **ID**: YYYY-MM-DD / short name
- **Status**: Proposed | Accepted | Deprecated
- **Decision**
- **Why (the load-bearing reasons)**
- **Consequences** (what becomes easier/harder)
- **Guardrails** (failure modes + how we avoid them)
- **Revisit trigger** (what would make us reconsider)

---

## DEC-2025-12-30 / Two-Layer Worldseed
**Status:** Accepted  
**Decision:** Publishing a world must never depend on 3D or advanced interactivity. Every world ships perfectly in 2D/HTML first; 3D and artifacts are optional layers.  
**Why:** Protects momentum; prevents “every post requires dev work,” the Wordpress deadening trap.  
**Consequences:**  
- ✅ Fast publishing cadence, low friction  
- ✅ Mobile/accessible baseline always works  
- ⚠ Some experiences will be “nice later,” not “required now”  
**Guardrails:**  
- If 3D fails: fall back to normal page.  
- Artifacts must have fallback render.  
**Revisit trigger:** When publishing is effortless for 30+ worlds and we feel under-stimulated by baseline.

---

## DEC-2025-12-30 / Map-First Navigation
**Status:** Accepted  
**Decision:** The default entrance is a **Threshold** (place), with the **Mycelium Atlas** (graph/map) as primary navigation. Timeline is secondary.  
**Why:** Nonlinear as primary; curiosity-driven exploration; “corner of the internet” as *world*, not feed.  
**Consequences:**  
- ✅ Feels game-like; visitors roam  
- ✅ Links become organism structure, not decoration  
- ⚠ Requires graph generation + map UI early  
**Guardrails:**  
- Always provide “Grove list” fallback index.  
**Revisit trigger:** If visitors can’t find anything without the map (usability collapse).

---

## DEC-2025-12-30 / Astro as World-Generator
**Status:** Accepted  
**Decision:** Use Astro to build the canonical site. Interactive parts are islands. React is allowed inside islands and MDX artifacts.  
**Why:** Static-first performance + selective interactivity; avoids framework heaviness while keeping “cool artifacts.”  
**Consequences:**  
- ✅ Fast pages, less JS  
- ✅ React artifacts remain possible  
- ⚠ Requires intentional boundaries (“React only where it earns its keep”)  
**Guardrails:**  
- Limit hydration scope; prefer `client:visible` for heavy components.  
**Revisit trigger:** If interactivity needs exceed what islands can comfortably handle.

---

## DEC-2025-12-30 / Neocities/Nekoweb as Potential Habitat
**Status:** Proposed  
**Decision:** Consider hosting the built output on Neocities or Nekoweb to inherit small-web punk neighborhood energy, while keeping modern infra via Astro build.  
**Why:** Culture/discovery loops + alterhuman resonance; still supports JS interactivity.  
**Consequences:**  
- ✅ Neighborhood aliveness  
- ⚠ Deploy workflow differs from Netlify/Vercel  
**Guardrails:**  
- Hosting is orthogonal; architecture remains portable.  
**Revisit trigger:** When we’re ready to choose “home soil” (domain + deploy).

---

## DEC-2025-12-30 / Sharkey as Membrane
**Status:** Proposed  
**Decision:** Use Sharkey as a social river surface that posts “seed notes” linking back to canonical worlds.  
**Why:** Aliveness + feedback loops without making the canonical archive depend on a platform.  
**Consequences:**  
- ✅ Social game-feel  
- ⚠ Risk of attention capture; river eating the map  
**Guardrails:**  
- Rule: “The home is the Gate, not the Membrane.”  
**Revisit trigger:** If Sharkey becomes the primary writing destination.

---

## DEC-2025-12-30 / Biomes over Categories
**Status:** Accepted  
**Decision:** Organize content into **Biomes** (streams of becoming), each with identity, ritual, and templates.  
**Why:** Keeps creation fun; reduces cognitive load; supports multiplicity.  
**Consequences:**  
- ✅ Easier to start writing  
- ✅ Clear aesthetic variety  
- ⚠ Needs consistent naming + iconography  
**Guardrails:**  
- Biomes must be few and meaningful; avoid taxonomy sprawl.  
**Revisit trigger:** When we have >7 biomes and feel lost.

---

## DEC-2025-12-30 / “Questboard” Entry Screen
**Status:** Accepted  
**Decision:** Create a single daily entry point with 3 actions: 🌱 Seed, 🕸 Link, 🚪 Publish.  
**Why:** ADHD-friendly activation; micro-wins; keeps the system playful.  
**Consequences:**  
- ✅ Reduces initiation friction  
- ⚠ Requires discipline to keep it minimal  
**Guardrails:**  
- If more than 3 actions appear, we remove one.  
**Revisit trigger:** If the questboard stops being used.

---

## DEC-2025-12-30 / Heartbeat Systems staged
**Status:** Accepted  
**Decision:** Add “aliveness systems” in order: RSS first, then guestbook or webmentions, federation later.  
**Why:** Avoid scope explosion; ship first.  
**Consequences:**  
- ✅ Early “it’s alive” signal  
- ⚠ Delays deeper social integration  
**Guardrails:**  
- No ActivityPub until the garden has real cadence.  
**Revisit trigger:** When cadence is stable and we want external echoes.

---

## Template for future decisions
### DEC-YYYY-MM-DD / Name
**Status:** Proposed | Accepted | Deprecated  
**Decision:**  
**Why:**  
**Consequences:**  
**Guardrails:**  
**Revisit trigger:**
