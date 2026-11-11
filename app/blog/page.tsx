import type { Metadata } from 'next';
import Link from 'next/link';
import { formatDate, getPosts } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Notes on backend engineering, Postgres and failure modes.',
  alternates: { canonical: '/blog' },
};

export default function BlogIndex() {
  const posts = getPosts();
  return (
    <div className="mx-auto w-full max-w-2xl px-5 py-14">
      <h1 className="mb-3 text-4xl font-semibold">Blog</h1>
      <p className="mb-8 text-lg text-muted-foreground">Notes on backend engineering, Postgres and failure modes.</p>
      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        <ul>
          {posts.map((p) => (
            <li key={p.slug}>
              <Link href={`/blog/${p.slug}`} className="group grid gap-1 border-b py-5">
                <span className="font-semibold transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary">
                  {p.title}
                </span>
                <span className="text-sm text-muted-foreground">
                  {formatDate(p.date)} · {p.readingMinutes} min read
                </span>
                <span className="text-muted-foreground">{p.description}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
