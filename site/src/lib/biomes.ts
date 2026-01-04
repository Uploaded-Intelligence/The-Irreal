/**
 * BIOMES - The territories of The Irreal
 *
 * Add new biomes here. One place, propagates everywhere.
 */

export const BIOMES = {
  threshold: { icon: '🚪', label: 'Threshold', desc: 'Entry points, portals, beginnings' },
  lore: { icon: '📜', label: 'Lore', desc: 'Stories, histories, myths' },
  creation: { icon: '🔨', label: 'Creation', desc: 'Things you made, processes, builds' },
  reflection: { icon: '🪞', label: 'Reflection', desc: 'Inner work, thoughts, meta' },
  play: { icon: '🎲', label: 'Play', desc: 'Games, experiments, fun' },
  deep: { icon: '🌊', label: 'Deep', desc: 'Philosophy, the heavy stuff' },
  '4komas': { icon: '🖼️', label: '4komas', desc: 'Four-panel stories, visual moments' },
} as const;

export type BiomeId = keyof typeof BIOMES;
export const BIOME_IDS = Object.keys(BIOMES) as BiomeId[];
