import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';
import { Mdx } from '@/components/Mdx';
import { formatDate, getPost, getPosts } from '@/lib/content';
import { site } from '@/lib/site';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  const url = `/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url },
    openGraph: { type: 'article', title: post.title, description: post.description, url, publishedTime: post.date },
  };
}

export default async function Post({ params }: Props) {
  const post = getPost((await params).slug);
  if (!post) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { '@type': 'Person', name: site.name },
    mainEntityOfPage: `${site.url}/blog/${post.slug}`,
  };

  return (
    <article className="mx-auto w-full max-w-2xl px-5 py-14">
      <Link
        href="/blog"
        className="group mb-6 inline-flex items-center gap-1 text-sm text-primary underline-offset-4 hover:underline"
      >
        <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" /> All posts
      </Link>
      <h1 className="mb-3 text-4xl font-semibold">{post.title}</h1>
      <p className="text-sm text-muted-foreground">
        {formatDate(post.date)} · {post.readingMinutes} min read
        {post.draft && ' · draft'}
      </p>
      <div className="prose mt-8 text-[1.0625rem]">
        <Mdx source={post.body} />
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </article>
  );
}
