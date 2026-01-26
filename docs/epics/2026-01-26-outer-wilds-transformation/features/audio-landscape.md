# Feature: Audio Landscape

**Wave:** 2
**Status:** planned
**Dependencies:** spatial-restructuring
**Blocks:** artifact-destinations, polish-wonder

## Overview

Transform silent void into living soundscape. Each biome has distinct ambient audio via PositionalAudio. Discovery moments have audio feedback. Movement creates subtle whoosh. Hyperdrive has full audio ceremony.

**Architecture Decision:** Hybrid system — Three.js PositionalAudio for spatial biome ambients + Tone.js for effects/synthesis

---

## Phase 1: Infrastructure (3 tasks)

- [ ] Create `AudioManager.ts` singleton — Three.js AudioListener + Tone.js buses
- [ ] Initialize AudioManager in MyceliumScene (attach listener to camera)
- [ ] Create `biomeAudioAssets.ts` config mapping biomes → audio files

**Verification:** TypeScript compiles, AudioManager exports correctly

---

## Phase 2: Asset Acquisition (1 task)

- [ ] Download royalty-free audio files (6 biome loops + 4 effects)
  - Create `/public/audio/biomes/` and `/public/audio/effects/`
  - Document attribution in `AUDIO-CREDITS.md`
  - Sources: Scott Buckley, Free Music Archive, OpenGameArt

**Verification:** All audio files present, <500KB each

---

## Phase 3: Biome Ambient (2 tasks)

- [ ] Create `BiomeAmbientAudio.tsx` — PositionalAudio component with anchor mesh
- [ ] Integrate in MyceliumScene — map over biome centers

**Verification:** Audio audible when approaching biome centers, fades with distance

---

## Phase 4: Discovery Feedback (2 tasks)

- [ ] Add `discoveredNodes: Set<string>` to atlasStore
- [ ] Create `DiscoveryAudioTrigger.tsx` — plays chime on first approach (<15 units)

**Verification:** Chime plays once per node on discovery

---

## Phase 5: Movement Whoosh (2 tasks)

- [ ] Create `MovementAudio.tsx` — Tone.js filtered noise scaled to velocity
- [ ] Integrate in MyceliumScene

**Verification:** Whoosh scales with speed, silent when stationary

---

## Phase 6: Hyperdrive Enhancement (3 tasks)

- [ ] Create `HyperdriveAudio.tsx` — phase-transition detection with Players
- [ ] Remove old audio code from HyperdriveController (lines 42-63, etc.)
- [ ] Integrate in MyceliumScene

**Verification:** Full audio ceremony: charge hum → travel drone → arrival resonance

---

## Phase 7: Accessibility (2 tasks)

- [ ] Create `AudioControls.tsx` — mute button + volume slider (ARIA labels)
- [ ] Add to atlas page

**Verification:** Mute/volume controls functional, keyboard accessible

---

## Epic Integration

### Dependencies
- **spatial-restructuring:** `getAllBiomeCenters()` for PositionalAudio placement

### Provides To
- **artifact-destinations:** effectsBus infrastructure for portal sounds
- **polish-wonder:** Audio foundation for breathing cosmos sync

### Handoff Criteria
- [ ] 6 biome ambient sources positioned correctly
- [ ] Discovery chime on first approach
- [ ] Movement whoosh scales with velocity
- [ ] Hyperdrive ceremony complete
- [ ] Audio controls accessible
- [ ] 60fps maintained

---

## Files Summary

| File | Action |
|------|--------|
| `AudioManager.ts` | Create |
| `biomeAudioAssets.ts` | Create |
| `AUDIO-CREDITS.md` | Create |
| `BiomeAmbientAudio.tsx` | Create |
| `DiscoveryAudioTrigger.tsx` | Create |
| `MovementAudio.tsx` | Create |
| `HyperdriveAudio.tsx` | Create |
| `AudioControls.tsx` | Create |
| `MyceliumScene.tsx` | Modify |
| `HyperdriveController.tsx` | Modify — remove old audio |
| `atlasStore.ts` | Modify — discoveredNodes |

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Browser autoplay restrictions | High | Integrate Tone.start() with user gesture |
| Audio assets too large | Medium | Compress to MP3, <500KB each |
| PositionalAudio not working | High | Test browsers, fallback to 2D |

---

## Estimated Task Count: 15 tasks across 7 phases
