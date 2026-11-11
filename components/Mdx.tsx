import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypePrettyCode from 'rehype-pretty-code';
import Link from 'next/link';
import type { ComponentProps } from 'react';

function A({ href = '', ...props }: ComponentProps<'a'>) {
  if (href.startsWith('/') || href.startsWith('#')) return <Link href={href} {...props} />;
  return <a href={href} target="_blank" rel="noopener noreferrer" {...props} />;
}

export function Mdx({ source }: { source: string }) {
  return (
    <MDXRemote
      source={source}
      components={{ a: A }}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [
            rehypeSlug,
            [
              rehypePrettyCode,
              {
                theme: { light: 'github-light-high-contrast', dark: 'github-dark-high-contrast' },
                keepBackground: false,
              },
            ],
          ],
        },
      }}
    />
  );
}
