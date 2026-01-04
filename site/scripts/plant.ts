#!/usr/bin/env npx tsx
/**
 * PLANT - Quick seed planting
 *
 * For when you just want to capture a thought fast.
 * Run: bun plant "Title of Your World"
 * Or:  npm run plant -- "Title"
 */

import chalk from 'chalk';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { exec } from 'child_process';

const SEED_TEMPLATE = `---
id: {{id}}
title: "{{title}}"
summary: ""
biome: lore
stage: seedling
choices: []
connections: []
---

<!--
  🌱 Seedling planted. Write when ready.

  Tips:
  - Just start writing below
  - Add connections to other worlds in frontmatter
  - Change biome/stage as it grows
-->

`;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function main() {
  const title = process.argv.slice(2).join(' ');

  if (!title) {
    console.log(chalk.yellow(`
  🌱 Plant a seed quickly:

    ${chalk.cyan('npm run plant -- "Your World Title"')}

  For the full ritual experience:

    ${chalk.cyan('npm run summon')}
    `));
    process.exit(0);
  }

  const id = slugify(title);
  const worldsDir = join(process.cwd(), 'content', 'worlds');
  const filePath = join(worldsDir, `${id}.mdx`);

  // Check if world already exists
  if (existsSync(filePath)) {
    console.log(chalk.red(`\n  ✗ World "${id}" already exists.\n`));
    process.exit(1);
  }

  // Ensure directory exists
  if (!existsSync(worldsDir)) {
    mkdirSync(worldsDir, { recursive: true });
  }

  // Generate content
  const content = SEED_TEMPLATE
    .replace('{{id}}', id)
    .replace('{{title}}', title);

  writeFileSync(filePath, content);

  console.log(chalk.green(`
  🌱 Seed planted: ${chalk.bold(title)}

     ${chalk.dim(filePath)}

  ${chalk.dim('Open it when ready. The Irreal grows.')}
  `));

  // Try to open in editor
  const editor = process.env.EDITOR || 'code';
  exec(`${editor} "${filePath}"`);
}

main().catch(console.error);
