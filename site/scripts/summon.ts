#!/usr/bin/env npx tsx
/**
 * SUMMON - The Irreal World Creation Ritual
 *
 * Not a form. A threshold crossing.
 * Run: bun summon
 */

import * as p from '@clack/prompts';
import chalk from 'chalk';
import { writeFileSync, existsSync, mkdirSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import { BIOMES } from '../src/lib/biomes.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const STAGES = {
  seedling: { icon: '🌱', desc: 'Just sprouting - rough, incomplete, alive' },
  growing: { icon: '🌿', desc: 'Taking shape - has form, still changing' },
  evergreen: { icon: '🌲', desc: 'Mature - stands on its own' },
};

// ASCII art for the ritual feel
const THRESHOLD_ART = chalk.dim(`
    ╭──────────────────────────────────────╮
    │                                      │
    │   ${chalk.cyan('✧')}  You stand at the threshold  ${chalk.cyan('✧')}   │
    │                                      │
    │      A new world awaits naming       │
    │                                      │
    ╰──────────────────────────────────────╯
`);

const SUCCESS_ART = (title: string) => chalk.dim(`
    ╭──────────────────────────────────────╮
    │                                      │
    │   ${chalk.green('✓')}  ${chalk.bold(title.slice(0, 26).padEnd(26))}  ${chalk.green('✓')}   │
    │                                      │
    │      has emerged into The Irreal     │
    │                                      │
    ╰──────────────────────────────────────╯
`);

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function getTemplate(biome: string): string {
  const templatePath = join(__dirname, 'templates', `${biome}.mdx`);
  try {
    if (existsSync(templatePath)) {
      return readFileSync(templatePath, 'utf-8');
    }
  } catch {
    // Fall through to default
  }
  return '\n<!-- Write your world here. It begins. -->\n\n';
}

function generateFrontmatter(data: {
  id: string;
  title: string;
  summary: string;
  biome: string;
  stage: string;
  self?: string;
}): string {
  const lines = [
    '---',
    `id: ${data.id}`,
    `title: "${data.title}"`,
    `summary: "${data.summary}"`,
    `biome: ${data.biome}`,
    `stage: ${data.stage}`,
  ];

  if (data.self) {
    lines.push(`self: "${data.self}"`);
  }

  lines.push('choices:', '  # - label: "Path forward"', '  #   to: "/world/somewhere"');
  lines.push('connections:', '  # - other-world-id');
  lines.push('---', '');

  return lines.join('\n');
}

async function main() {
  console.clear();
  console.log(THRESHOLD_ART);

  p.intro(chalk.cyan('Summoning a new world into The Irreal'));

  const values = await p.group(
    {
      title: () =>
        p.text({
          message: 'What is this world called?',
          placeholder: 'The Grove of Whispers',
          validate: (value) => {
            if (!value) return 'Every world needs a name';
            if (value.length < 2) return 'Even the smallest worlds have names longer than one letter';
          },
        }),

      summary: () =>
        p.text({
          message: 'Describe it in one breath (optional)',
          placeholder: 'A place where thoughts echo...',
        }),

      biome: () =>
        p.select({
          message: 'Which biome does it belong to?',
          options: Object.entries(BIOMES).map(([key, val]) => ({
            value: key,
            label: `${val.icon} ${val.label}`,
            hint: val.desc,
          })),
        }),

      stage: () =>
        p.select({
          message: 'How grown is this world?',
          initialValue: 'seedling',
          options: Object.entries(STAGES).map(([key, val]) => ({
            value: key,
            label: `${val.icon} ${key.charAt(0).toUpperCase() + key.slice(1)}`,
            hint: val.desc,
          })),
        }),

      self: () =>
        p.text({
          message: 'Which Self authors this? (optional)',
          placeholder: 'Leave empty if just you',
        }),
    },
    {
      onCancel: () => {
        p.cancel('The threshold remains uncrossed.');
        process.exit(0);
      },
    }
  );

  const id = slugify(values.title as string);
  const worldsDir = join(process.cwd(), 'content', 'worlds');
  const filePath = join(worldsDir, `${id}.mdx`);

  // Check if world already exists
  if (existsSync(filePath)) {
    p.cancel(`A world named "${id}" already exists in The Irreal.`);
    process.exit(1);
  }

  // Generate content
  const content = generateFrontmatter({
    id,
    title: values.title as string,
    summary: (values.summary as string) || '',
    biome: values.biome as string,
    stage: values.stage as string,
    self: values.self as string || undefined,
  });

  // Ensure directory exists
  if (!existsSync(worldsDir)) {
    mkdirSync(worldsDir, { recursive: true });
  }

  // Get biome-specific template
  const template = getTemplate(values.biome as string);

  // Write the file
  const s = p.spinner();
  s.start('Manifesting world...');

  writeFileSync(filePath, content + template);

  await new Promise(r => setTimeout(r, 500)); // Brief pause for ritual feel
  s.stop('World manifested');

  console.log(SUCCESS_ART(values.title as string));

  // Ask about next actions
  const next = await p.select({
    message: 'What now?',
    options: [
      { value: 'edit', label: '✏️  Open in editor', hint: 'Start writing immediately' },
      { value: 'dev', label: '🌐 Start dev server', hint: 'See it live at localhost:4321' },
      { value: 'both', label: '✨ Both!', hint: 'Editor + dev server' },
      { value: 'done', label: '📦 Done for now', hint: 'File is ready when you are' },
    ],
  });

  if (next === 'edit' || next === 'both') {
    // Try common editors
    const editor = process.env.EDITOR || 'code';
    exec(`${editor} "${filePath}"`);
    p.log.success(`Opened in ${editor}`);
  }

  if (next === 'dev' || next === 'both') {
    p.log.info('Starting dev server...');
    p.note(`Your world awaits at:\n${chalk.cyan(`http://localhost:4321/world/${id}`)}`);

    // Don't await - let it run
    const child = exec('npm run dev', { cwd: process.cwd() });
    child.stdout?.pipe(process.stdout);
    child.stderr?.pipe(process.stderr);

    // Give it a moment then exit (server runs in background)
    if (next !== 'both') {
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  if (next === 'done') {
    p.note(`Your world is waiting at:\n${chalk.dim(filePath)}\n\nRun ${chalk.cyan('bun dev')} when ready to see it.`);
  }

  p.outro(chalk.green('The Irreal grows.'));
}

main().catch(console.error);
