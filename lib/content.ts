import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

const root = path.join(process.cwd(), 'content');

export interface Link {
  label: string;
  href: string;
}

export interface Project {
  slug: string;
  order: number;
  name: string;
  status: 'Live' | 'In progress' | 'Completed' | 'Design' | 'Study';
  summary: string;
  stack: string[];
  links: Link[];
  media?: { src: string; alt: string; kind?: 'image' | 'video' };
  body: string;
}

export interface Post {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  draft: boolean;
  readingMinutes: number;
  body: string;
}

function readDir(dir: string) {
  const full = path.join(root, dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((f) => /\.mdx?$/.test(f))
    .map((file) => {
      const raw = fs.readFileSync(path.join(full, file), 'utf8');
      const { data, content } = matter(raw);
      return { slug: file.replace(/\.mdx?$/, ''), data, content };
    });
}

function need<T>(value: T | undefined, field: string, slug: string): T {
  if (value === undefined || value === null || value === '') {
    throw new Error(`content/${slug}: missing frontmatter field "${field}"`);
  }
  return value;
}

export function getProjects(): Project[] {
  return readDir('projects')
    .map(({ slug, data, content }) => ({
      slug,
      order: need<number>(data.order, 'order', slug),
      name: need<string>(data.name, 'name', slug),
      status: need<Project['status']>(data.status, 'status', slug),
      summary: need<string>(data.summary, 'summary', slug),
      stack: need<string[]>(data.stack, 'stack', slug),
      links: (data.links ?? []) as Link[],
      media: data.media as Project['media'],
      body: content.trim(),
    }))
    .sort((a, b) => a.order - b.order);
}

export function getPosts(): Post[] {
  const showDrafts = process.env.NODE_ENV !== 'production';
  return readDir('posts')
    .map(({ slug, data, content }) => ({
      slug,
      title: need<string>(data.title, 'title', slug),
      description: need<string>(data.description, 'description', slug),
      date: new Date(need<string | Date>(data.date, 'date', slug)).toISOString().slice(0, 10),
      tags: (data.tags ?? []) as string[],
      draft: Boolean(data.draft),
      readingMinutes: Math.max(1, Math.round(readingTime(content).minutes)),
      body: content,
    }))
    .filter((p) => showDrafts || !p.draft)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string) {
  return getPosts().find((p) => p.slug === slug);
}

export function formatDate(iso: string) {
  return new Date(iso + 'T00:00:00Z').toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
