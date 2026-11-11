import { site } from '@/lib/site';

const link = 'transition-colors hover:text-foreground';

export function Footer() {
  return (
    <footer className="border-t text-sm text-muted-foreground">
      <div className="mx-auto flex w-full max-w-2xl flex-wrap justify-between gap-2 px-5 py-6">
        <span>
          © {new Date().getFullYear()} {site.name}
        </span>
        <span className="flex gap-4">
          <a className={link} href={site.github} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a className={link} href="/blog/rss.xml">
            RSS
          </a>
        </span>
      </div>
    </footer>
  );
}
