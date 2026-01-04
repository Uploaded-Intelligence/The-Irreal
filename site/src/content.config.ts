import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { BIOME_IDS } from './lib/biomes';

/**
 * World Schema
 * Each world is a node in the knowledge graph.
 * Connections are first-class citizens.
 */
const worldSchema = z.object({
  // Identity
  id: z.string(),
  title: z.string(),
  summary: z.string().optional(),

  // Classification - biomes defined in src/lib/biomes.ts
  biome: z.enum(BIOME_IDS as [string, ...string[]]).default('lore'),
  stage: z.enum(['seedling', 'growing', 'evergreen']).default('seedling'),
  self: z.string().optional(), // Which Self authored this

  // Navigation
  choices: z.array(z.object({
    label: z.string(),
    to: z.string(),
    gives: z.array(z.string()).optional(), // Items/sigils granted
    requires: z.array(z.string()).optional(), // Items/sigils required
  })).optional(),

  // Connections (explicit links beyond inline)
  connections: z.array(z.string()).optional(),

  // Meta
  created: z.date().optional(),
  updated: z.date().optional(),
  draft: z.boolean().default(false),
});

const worlds = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './content/worlds' }),
  schema: worldSchema,
});

export const collections = { worlds };

export type World = z.infer<typeof worldSchema>;
