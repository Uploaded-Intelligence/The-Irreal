import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const worlds = await getCollection('worlds', ({ data }) => !data.draft);

  return rss({
    title: 'The Irreal',
    description:
      'Worlds from the Irreal - a creative studio exploring the edges of reality',
    site: context.site!,
    items: worlds.map((world) => ({
      title: world.data.title,
      pubDate: world.data.created || world.data.updated || new Date(),
      description: world.data.summary || '',
      link: `/world/${world.data.id}/`,
      categories: [world.data.biome, world.data.stage].filter(Boolean),
    })),
    customData: `<language>en-us</language>`,
  });
}
