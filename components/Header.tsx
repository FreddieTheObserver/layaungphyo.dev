'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/ThemeToggle';
import { nav, site } from '@/lib/site';

export function Header() {
  const [open, setOpen] = useState(false);
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
              className="group relative rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
              <span className="absolute inset-x-3 bottom-1 h-px origin-left scale-x-0 bg-primary transition-transform duration-300 ease-out-expo group-hover:scale-x-100" />
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

        <div className="flex items-center gap-1 sm:hidden">
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <SheetTitle className="px-4 pt-4">Menu</SheetTitle>
              <SheetDescription className="sr-only">Site navigation</SheetDescription>
              <nav aria-label="Mobile" className="flex flex-col gap-1 px-2">
                {nav.map((item) => (
                  <SheetClose asChild key={item.href}>
                    <Link href={item.href} className="rounded-md px-3 py-2 text-base transition-colors hover:bg-accent">
                      {item.label}
                    </Link>
                  </SheetClose>
                ))}
                <SheetClose asChild>
                  <a href={site.resume} className="rounded-md px-3 py-2 text-base transition-colors hover:bg-accent">
                    Résumé
                  </a>
                </SheetClose>
              </nav>
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
