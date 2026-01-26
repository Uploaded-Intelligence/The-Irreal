import type { AtlasNode } from '../../stores/atlasStore';

// Simple hash function for deterministic seeding
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

// Seeded random number generator
function seededRandom(seed: number): () => number {
  return () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
}

interface BiomeConfig {
  center: [number, number, number];
  radius: number;
  verticalSpread: number;
}

const BIOME_CONFIGS: Record<string, BiomeConfig> = {
  threshold: { center: [0, 2, 8], radius: 6, verticalSpread: 2 },
  lore: { center: [-12, 0, -5], radius: 10, verticalSpread: 4 },
  creation: { center: [14, -2, -10], radius: 12, verticalSpread: 5 },
  play: { center: [8, 6, -15], radius: 9, verticalSpread: 4 },
  reflection: { center: [-10, -1, -20], radius: 11, verticalSpread: 3 },
  deep: { center: [0, -10, -35], radius: 14, verticalSpread: 6 },
};

export function computeBiomeLayout(nodes: Array<Omit<AtlasNode, 'x' | 'y' | 'z'>>): AtlasNode[] {
  return nodes.map((node) => {
    const config = BIOME_CONFIGS[node.biome] || BIOME_CONFIGS.threshold;

    // Seed from node ID for deterministic placement
    const seed = hashString(node.id);
    const random = seededRandom(seed);

    // Distribute within biome cluster
    const angle = random() * Math.PI * 2;
    const distance = random() * config.radius;
    const heightOffset = (random() - 0.5) * config.verticalSpread;

    const x = config.center[0] + Math.cos(angle) * distance;
    const y = config.center[1] + heightOffset;
    const z = config.center[2] + Math.sin(angle) * distance;

    return { ...node, x, y, z };
  });
}

// Utility to get biome center for camera starting position
export function getBiomeCenter(biome: string): [number, number, number] {
  return BIOME_CONFIGS[biome]?.center || BIOME_CONFIGS.threshold.center;
}

// Get all biome names for HUD compass
export function getAllBiomes(): string[] {
  return Object.keys(BIOME_CONFIGS);
}
