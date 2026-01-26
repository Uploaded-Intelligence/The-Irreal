# Feature: Polish and Wonder

**Wave:** 4 (Final)
**Status:** planned
**Dependencies:** living-cosmos, scale-and-movement, diegetic-hud, audio-landscape, artifact-destinations
**Blocks:** none (capstone)

## Overview

Final polish pass that ties everything together. Entry sequence that introduces the cosmos. Synchronized breathing across all systems. Accessibility options. Performance optimization. The "wow" moments.

---

## Phase 1: Entry Sequence (5 tasks)

- [ ] Create `EntrySequence.tsx` — 7-second ceremonial entry
  - Fade from black (2s) → drift into cosmos (3s) → gentle arrival (2s)
- [ ] Add skip functionality (space/enter)
- [ ] Persist `entryViewed` to localStorage
- [ ] Create `TutorialHints.tsx` — subtle, diegetic hints
- [ ] Integrate entry in MyceliumScene

**Verification:** First visit shows entry, subsequent visits skip, hints appear contextually

---

## Phase 2: Breathing Synchronization (4 tasks)

- [ ] Create `breathingCycle.ts` — Zustand store with 8-second cycle constant
- [ ] Export `useBreathingIntensity()` hook (sine wave 0.85-1.0)
- [ ] Apply to NebulaBackdrop shader uniforms
- [ ] Apply to Sparkles opacity and ambient audio gain

**Verification:** Nebula, sparkles, and audio pulse in sync every 8 seconds

---

## Phase 3: Accessibility Features (5 tasks)

- [ ] Create `accessibilityStore.ts` — reducedMotion, highContrast, audioDescriptions
- [ ] Auto-detect `prefers-reduced-motion` system preference
- [ ] Create `AccessibilityPanel.tsx` — A key toggle, settings UI
- [ ] Create `AudioDescriber.tsx` — speech synthesis for biome/node announcements
- [ ] Apply accessibility flags across all features

**Verification:** Reduced motion stops animations, high contrast visible, descriptions spoken

---

## Phase 4: Performance Optimization (5 tasks)

- [ ] Create `PerformanceMonitor.tsx` — FPS tracking over 60 frames
- [ ] Create `performanceTiers.ts` — high/medium/low configurations
- [ ] Implement auto-detection and tier switching
- [ ] Add LOD system for node geometry (distance-based)
- [ ] Add frustum culling for off-screen nodes

**Verification:** 60fps on desktop, 30fps on mobile, auto-degrades gracefully

---

## Phase 5: Mobile and Touch Support (3 tasks)

- [ ] Create `useTouchDevice.ts` hook
- [ ] Create `VirtualJoystick.tsx` component
- [ ] Configure responsive quality tiers for mobile

**Verification:** Touch navigation works, performance acceptable on mobile

---

## Phase 6: Final Polish Pass (4 tasks)

- [ ] Sound design integration review — all audio harmonizes
- [ ] Visual harmony check — colors, timing, transitions cohesive
- [ ] Interaction polish — all clicks/hovers feel responsive
- [ ] Create `USER_GUIDE.md` and `TECHNICAL_REFERENCE.md`

**Verification:** Complete experience feels cohesive and wonder-inducing

---

## Epic Integration

### Dependencies (ALL previous features)
- **living-cosmos:** Post-processing, breathing visual foundation
- **scale-and-movement:** Movement system, hyperdrive timing
- **diegetic-hud:** HUD visibility, tutorial hint placement
- **audio-landscape:** Ambient audio for breathing sync
- **artifact-destinations:** Portal experience

### Provides To
Nothing — this is the capstone

### Handoff Criteria
- [ ] Entry sequence completes ceremonially
- [ ] Breathing cycle synchronized across systems
- [ ] Accessibility options functional
- [ ] Performance tiers working
- [ ] Mobile touch support functional
- [ ] Documentation complete
- [ ] 60fps maintained
- [ ] Wonder achieved

---

## Files Summary

| File | Action |
|------|--------|
| `EntrySequence.tsx` | Create |
| `TutorialHints.tsx` | Create |
| `breathingCycle.ts` | Create |
| `accessibilityStore.ts` | Create |
| `AccessibilityPanel.tsx` | Create |
| `AudioDescriber.tsx` | Create |
| `PerformanceMonitor.tsx` | Create |
| `performanceTiers.ts` | Create |
| `useTouchDevice.ts` | Create |
| `VirtualJoystick.tsx` | Create |
| `USER_GUIDE.md` | Create |
| `TECHNICAL_REFERENCE.md` | Create |
| `MyceliumScene.tsx` | Modify — entry, breathing, performance |
| `NebulaBackdrop.tsx` | Modify — breathing sync |
| `FirstPersonRig.tsx` | Modify — reduced motion |

---

## Success Criteria (Phenomenological)

From experience testing:
- "I felt like I was arriving somewhere" (entry sequence)
- "Everything felt alive" (breathing sync)
- "I could explore without instructions" (diegetic hints)
- "Even with reduced motion it was beautiful" (accessibility)
- "I wanted to stay and look around" (wonder achieved)

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Entry too slow | Medium | Skip functionality, tune timing |
| Breathing sync complex | High | Single source of truth, thorough testing |
| Accessibility breaks features | High | Test each mode with each feature |
| Performance insufficient | Medium | Have 'minimal' fallback tier |

---

## Estimated Task Count: 26 tasks across 6 phases
