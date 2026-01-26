# Feature: Diegetic HUD

**Wave:** 2
**Status:** planned
**Dependencies:** spatial-restructuring
**Blocks:** polish-wonder

## Overview

Replace corner HUD with world-integrated navigation. Remove screen clutter, add 3D beacons at biome centers, peripheral glow for biome indication, minimize screen-space UI.

**Current State:** 6 corner-positioned HUD panels (ProximityScanner, CompassRing, VelocityOrb, HyperdrivePanel, BiomeIndicator, Reticle)

**Target State:** 3D beacons, peripheral glow, minimal screen UI, accessibility toggle

---

## Phase 1: 3D Billboard Beacons (6 tasks)

- [ ] Create `BiomeBeacon.tsx` — Vertical cylinder + floating Html label
- [ ] Export `BIOME_COLORS` from biomeLayout.ts
- [ ] Add LOD optimization (8 → 4 segments when >100 units)
- [ ] Implement proximity fade (dim when <20 units from center)
- [ ] Set `toneMapped={false}` for bloom compatibility
- [ ] Integrate beacons in MyceliumScene

**Verification:** 6 beacons visible with labels, billboarded to camera

---

## Phase 2: Peripheral Biome Glow (4 tasks)

- [ ] Create `PeripheralGlow.tsx` — radial-gradient vignette CSS
- [ ] Use `mix-blend-mode: screen` for natural blending
- [ ] Add 12s pulse cycle synchronized with beacons
- [ ] Intensify during hyperdrive (opacity 0.15 → 0.35)

**Verification:** Screen edges glow biome color, intensity scales with proximity

---

## Phase 3: Stationary Reticle Fade (3 tasks)

- [ ] Add velocity-based opacity (speed < 0.1 → opacity 0.2)
- [ ] Use 0.8s CSS transition for smooth fade
- [ ] Override fade when targeting node or hyperdriving

**Verification:** Reticle fades when stationary, returns when moving

---

## Phase 4: Diegetic Hyperdrive Progress (5 tasks)

- [ ] Create `HyperdriveEdgeStrips.tsx` — 4px border strips
- [ ] Linear gradient shows progress along strip length
- [ ] Phase-based colors (locking=blue, charging=cyan, traveling=white)
- [ ] Add destination label at top-center during lock
- [ ] Pulse animation during charging phase

**Verification:** Edge strips replace corner panel, progress visible

---

## Phase 5: Remove Remaining Panels (3 tasks)

- [ ] Remove ProximityScanner from default render (beacons replace)
- [ ] Remove VelocityOrb (velocity felt through movement/trail)
- [ ] Clean up unused CSS

**Verification:** Minimal UI, immersive view

---

## Phase 6: Accessibility Toggle (4 tasks)

- [ ] Add `diegeticMode` flag to atlasStore
- [ ] Add H key binding in InputController
- [ ] Conditional rendering in AtlasHUD based on mode
- [ ] Keep removed components available for traditional mode

**Verification:** H key toggles between diegetic and traditional HUD

---

## Epic Integration

### Dependencies
- **spatial-restructuring:** `getAllBiomeCenters()` for beacon positions

### Provides To
- **polish-wonder:** Clean interface foundation

### Handoff Criteria
- [ ] 6 beacons visible with labels
- [ ] Peripheral glow responds to biome
- [ ] Reticle fades when stationary
- [ ] Edge strips show hyperdrive progress
- [ ] H key toggles modes
- [ ] 60fps maintained

---

## Files Summary

| File | Action |
|------|--------|
| `BiomeBeacon.tsx` | Create |
| `PeripheralGlow.tsx` | Create |
| `HyperdriveEdgeStrips.tsx` | Create |
| `biomeLayout.ts` | Modify — export BIOME_COLORS |
| `MyceliumScene.tsx` | Modify — render beacons |
| `atlasStore.ts` | Modify — diegeticMode flag |
| `InputController.tsx` | Modify — H key binding |
| `AtlasHUD.tsx` | Modify — conditional rendering |
| `Reticle.tsx` | Modify — velocity fade |

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Beacons too distracting | Medium | Reduce opacity, shorter beams |
| Users miss old HUD | Medium | H key toggle ensures accessibility |

---

## Estimated Task Count: 25 tasks across 6 phases
