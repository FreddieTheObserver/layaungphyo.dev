'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/ThemeToggle';
import { cn } from '@/lib/utils';
import { nav, site } from '@/lib/site';

const sectionIds = nav.filter((item) => item.href.startsWith('/#')).map((item) => item.href.slice(2));

function useActiveHref() {
  const pathname = usePathname();
  const [section, setSection] = useState<string | null>(null);
  const onHome = pathname === '/';

  useEffect(() => {
    if (!onHome) return;
    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        const current = sectionIds.find((id) => visible.has(id));
        // Sections outside the nav (now, writing) keep the last highlight; only the hero clears it.
        if (current) setSection(current);
        else if (window.scrollY < 100) setSection(null);
      },
      { rootMargin: '-40% 0px -55% 0px' },
    );
    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [onHome]);

  if (pathname.startsWith('/blog')) return '/blog';
  return onHome && section ? `/#${section}` : null;
}

export function Header() {
  const [open, setOpen] = useState(false);
  const activeHref = useActiveHref();
  const pathname = usePathname();
  const pendingId = useRef<string | null>(null);

  // On the home page a hash link to the current hash does not navigate, so Next never scrolls.
  // Scroll ourselves once the overlay has finished closing and released the scroll lock.
  function onMenuLink(e: React.MouseEvent, href: string) {
    if (pathname !== '/' || !href.startsWith('/#')) return;
    e.preventDefault();
    pendingId.current = href.slice(2);
    window.history.pushState(null, '', href);
    setOpen(false);
  }
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });

  return (
    <header
      className="rise sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md"
      style={{ '--i': 0 } as React.CSSProperties}
    >
      <div className="mx-auto flex h-14 w-full max-w-2xl items-center justify-between px-5">
        <Link href="/" className="font-semibold tracking-tight transition-opacity hover:opacity-70">
          {site.name}
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 sm:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={item.href === activeHref ? 'true' : undefined}
              className={cn(
                'group relative rounded-md px-3 py-2 text-sm transition-colors hover:text-foreground',
                item.href === activeHref ? 'text-foreground' : 'text-muted-foreground',
              )}
            >
              {item.label}
              <span
                className={cn(
                  'absolute inset-x-3 bottom-1 h-px origin-left bg-primary transition-transform duration-300 ease-out-expo group-hover:scale-x-100',
                  item.href === activeHref ? 'scale-x-100' : 'scale-x-0',
                )}
              />
            </Link>
          ))}
          <Button
            asChild
            size="sm"
            className="ml-2 rounded-full transition-transform hover:-translate-y-0.5 active:scale-95"
          >
            <a href={site.resume}>Résumé</a>
          </Button>
          <ThemeToggle />
        </nav>

        <div className="sm:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="full"
              showCloseButton={false}
              className="gap-0"
              onCloseAutoFocus={(e) => {
                const id = pendingId.current;
                if (!id) return;
                pendingId.current = null;
                e.preventDefault();
                document.getElementById(id)?.scrollIntoView();
              }}
            >
              <div className="flex h-14 shrink-0 items-center justify-between px-5">
                <SheetTitle className="tracking-tight">{site.name}</SheetTitle>
                <SheetClose asChild>
                  <Button variant="ghost" size="icon" aria-label="Close menu">
                    <X />
                  </Button>
                </SheetClose>
              </div>
              <SheetDescription className="sr-only">Site navigation</SheetDescription>
              <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
                <nav aria-label="Mobile" className="flex flex-col px-5 pt-[clamp(0.5rem,3dvh,2rem)]">
                  {nav.map((item, i) => {
                    const active = item.href === activeHref;
                    return (
                      <SheetClose asChild key={item.href}>
                        <Link
                          href={item.href}
                          aria-current={active ? 'true' : undefined}
                          onClick={(e) => onMenuLink(e, item.href)}
                          className={cn(
                            'menu-rise flex items-baseline gap-4 border-b py-[clamp(0.5rem,2.2dvh,1.25rem)] text-[length:clamp(1.75rem,5.5dvh,2.25rem)] font-semibold tracking-tight transition-colors',
                            active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
                          )}
                          style={{ '--i': i } as React.CSSProperties}
                        >
                          <span
                            aria-hidden="true"
                            className={cn(
                              'font-mono text-sm tabular-nums',
                              active ? 'text-primary' : 'text-muted-foreground',
                            )}
                          >
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          {item.label}
                        </Link>
                      </SheetClose>
                    );
                  })}
                </nav>
                <div
                  className="menu-rise mt-auto flex flex-col gap-5 p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]"
                  style={{ '--i': nav.length } as React.CSSProperties}
                >
                  <Button asChild size="lg" className="w-full rounded-full">
                    <a href={site.resume}>Résumé</a>
                  </Button>
                  <div className="flex items-center justify-between">
                    <span className="flex gap-5 text-sm text-muted-foreground">
                      <a
                        className="transition-colors hover:text-foreground"
                        href={site.github}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        GitHub
                      </a>
                      {site.linkedin && (
                        <a
                          className="transition-colors hover:text-foreground"
                          href={site.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          LinkedIn
                        </a>
                      )}
                      <a className="transition-colors hover:text-foreground" href={`mailto:${site.email}`}>
                        Email
                      </a>
                    </span>
                    <ThemeToggle />
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-[-1px] h-0.5 origin-left bg-primary"
        style={{ scaleX }}
      />
    </header>
  );
}
