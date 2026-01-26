# Feature: Artifact Destinations

**Wave:** 3
**Status:** planned
**Dependencies:** scale-and-movement, audio-landscape
**Blocks:** polish-wonder

## Overview

Existing project artifacts become discoverable destinations — portal nodes that transport players into embedded artifact worlds. These are "points of interest" as players explore further and deeper.

**Artifacts Integrated:**
| Artifact | File | Biome | Position | Portal Name |
|----------|------|-------|----------|-------------|
| Teleodynamic Signature | `teleodynamic-signature-v8.jsx` | deep | [0, -85, -200] | "The Signature of Self" |
| Sympoietic Signature | `sympoietic-signature-v3.jsx` | reflection | [-60, 50, -155] | "The Living Between" |
| Labyrinth Particle POV | `Labyrinth_particle-pov.html` | deep (far) | [15, -100, -240] | "Labyrinth Genesis" |
| Labyrinth Coupled | `labyrinth-genesis-coupled.html` | creation | [95, 40, -85] | "Coupled Systems" |

---

## Phase 1: Portal Node Foundation (4 tasks)

- [ ] Extend node schema with `nodeType: 'standard' | 'portal'` field
- [ ] Add portal node data to biomeLayout with fixed positions
- [ ] Create `portalStore.ts` (activePortal, isViewing, transitionState)
- [ ] Create `PortalParticles.tsx` — 120 instanced particles, torus formation

**Verification:** Portal nodes appear at designated positions with particles

---

## Phase 2: Portal Interaction (3 tasks)

- [ ] Modify NodeArtifact for portal detection and proximity intensity
- [ ] Create `PortalOverlay.tsx` — fullscreen viewer (React/iframe), ESC exit
- [ ] Integrate overlay into Atlas scene

**Verification:** Click portal → artifact loads in overlay → ESC returns

---

## Phase 3: Audio Integration (3 tasks)

- [ ] Create `usePortalAudio.ts` — proximity hum (60-100Hz), activation sweep
- [ ] Integrate audio into NodeArtifact proximity detection
- [ ] Add transition whoosh on entry/exit

**Verification:** Proximity hum audible, activation sound on click

---

## Phase 4: Visual Polish (3 tasks)

- [ ] Portal glow shader enhancement (pulsing emissive)
- [ ] Particle burst on activation (100 particles outward)
- [ ] Radial blur transition effect on entry

**Verification:** Portals feel mysterious and inviting

---

## Epic Integration

### Dependencies
- **scale-and-movement:** Movement system for approach detection
- **audio-landscape:** effectsBus for portal sounds

### Provides To
- **polish-wonder:** Portal experience for final polish

### Handoff Criteria
- [ ] 4 portal nodes at designated positions
- [ ] Portals have distinct particle effects
- [ ] Click activates artifact viewer
- [ ] ESC returns to atlas
- [ ] Audio cues on proximity and activation
- [ ] 60fps maintained

---

## Files Summary

| File | Action |
|------|--------|
| `portalStore.ts` | Create |
| `PortalParticles.tsx` | Create |
| `PortalOverlay.tsx` | Create |
| `usePortalAudio.ts` | Create |
| `atlasStore.ts` | Modify — portal node schema |
| `biomeLayout.ts` | Modify — portal positions |
| `NodeArtifact.tsx` | Modify — portal detection |
| `MyceliumScene.tsx` | Modify — overlay integration |

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Three.js conflicts with artifacts | High | Use iframe for HTML, React portal for JSX |
| Artifact load failures | Medium | Error boundary, fallback UI |
| Performance with particles | Low | InstancedMesh, frustum culling |

---

## Estimated Task Count: 13 tasks across 4 phases
