import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  integrations: [
    mdx(),
    react()
  ],
  site: 'https://the-irreal.world', // Update when domain is chosen
  vite: {
    optimizeDeps: {
      exclude: ['@resvg/resvg-js']
    }
  }
});
