import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/projects' }),
  schema: z.object({
    order: z.number().int().positive(),
    name: z.string(),
    status: z.enum(['live', 'in progress', 'design', 'study']),
    summary: z.string(),
    stack: z.array(z.string()).min(1),
    tags: z.array(z.string()).min(1),
    links: z.array(z.object({ label: z.string(), href: z.url() })).default([]),
    media: z.discriminatedUnion('kind', [
      z.object({ kind: z.literal('plate'), id: z.enum(['floodwatch', 'cinebook']) }),
      z.object({ kind: z.literal('diagram'), id: z.enum(['indexproof', 'sakha', 'sgoauth']) }),
    ]),
    open: z.boolean().default(false),
  }),
});

export const collections = { projects };
