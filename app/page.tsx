import Link from 'next/link';
import { ArrowRight, Download, Mail } from 'lucide-react';
import { ProjectCard } from '@/components/ProjectCard';
import { Reveal } from '@/components/Reveal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatDate, getPosts, getProjects } from '@/lib/content';
import { now, principles, site, skills } from '@/lib/site';

const container = 'mx-auto w-full max-w-2xl px-5';
const section = `${container} py-14`;
const h2 = 'mb-6 text-2xl font-semibold';
const rise = (i: number) => ({ '--i': i }) as React.CSSProperties;

export default function Home() {
  const projects = getProjects();
  const posts = getPosts().slice(0, 3);

  return (
    <>
      <section className={`${container} pt-16 pb-10 sm:pt-28`}>
        <p className="rise mb-4 font-mono text-sm text-muted-foreground" style={rise(0)}>
          {site.role} · {site.location}
        </p>
        <h1 className="rise mb-4 text-4xl font-semibold sm:text-5xl" style={rise(1)}>
          Hi, I&apos;m {site.name} <span className="font-normal text-muted-foreground">({site.nickname}).</span>
        </h1>
        <p className="rise max-w-xl text-lg text-muted-foreground" style={rise(2)}>
          I build reliable backend services with TypeScript, NestJS and Postgres, with a focus on data integrity,
          concurrency and how systems fail. Computer science student at KMUTT, open to internships and junior roles.
        </p>
        <div className="rise mt-7 flex flex-wrap gap-3" style={rise(3)}>
          <Button
            asChild
            size="lg"
            className="group rounded-full transition-transform hover:-translate-y-0.5 active:scale-95"
          >
            <a href="#work">
              View projects
              <ArrowRight className="transition-transform group-hover:translate-x-1" />
            </a>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-full transition-transform hover:-translate-y-0.5 active:scale-95"
          >
            <a href={site.resume}>
              <Download /> Résumé
            </a>
          </Button>
          <Button
            asChild
            size="lg"
            variant="ghost"
            className="rounded-full transition-transform hover:-translate-y-0.5 active:scale-95"
          >
            <a href={site.github} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </Button>
        </div>
      </section>

      <section id="work" className={section}>
        <Reveal>
          <h2 className={h2}>Selected work</h2>
        </Reveal>
        <div className="grid gap-5">
          {projects.map((p) => (
            <Reveal key={p.slug}>
              <ProjectCard project={p} />
            </Reveal>
          ))}
        </div>
      </section>

      <div className={container}>
        <Separator />
      </div>

      <section id="about" className={section}>
        <Reveal>
          <h2 className={h2}>About</h2>
          <div className="grid gap-8 sm:grid-cols-[1.3fr_1fr]">
            <div className="prose">
              <p>
                I&apos;m a backend and systems engineer based in {site.location}, studying computer science at KMUTT. I
                like the parts of software that have to be right: transactions, locks, retries and what happens when a
                dependency goes away.
              </p>
              <p>
                I build small, complete projects end to end and write down how they work, so the decisions are easy to
                review.
              </p>
            </div>
            <dl className="grid gap-3 text-sm">
              {skills.map((g) => (
                <div key={g.group}>
                  <dt className="font-semibold">{g.group}</dt>
                  <dd className="text-muted-foreground">{g.items.join(', ')}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
        <ul className="mt-10 grid gap-4 sm:grid-cols-3">
          {principles.map((p, i) => (
            <li key={p.title}>
              <Reveal delay={i * 0.08} className="h-full">
                <Card className="h-full gap-2 py-5 transition-all duration-300 ease-out-expo hover:-translate-y-1 hover:border-primary/40 hover:shadow-md">
                  <CardHeader className="px-5">
                    <h3 className="text-base font-semibold">{p.title}</h3>
                  </CardHeader>
                  <CardContent className="px-5 text-sm text-muted-foreground">{p.body}</CardContent>
                </Card>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      <div className={container}>
        <Separator />
      </div>

      <section id="now" className={section}>
        <Reveal>
          <h2 className={h2}>
            Now <span className="ml-2 text-sm font-normal text-muted-foreground">updated {now.updated}</span>
          </h2>
          <ul className="grid gap-2">
            {now.items.map((i) => (
              <li key={i} className="flex gap-3">
                <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary" />
                {i}
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {posts.length > 0 && (
        <>
          <div className={container}>
            <Separator />
          </div>
          <section id="writing" className={section}>
            <Reveal>
              <h2 className={h2}>Latest writing</h2>
              <ul>
                {posts.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/blog/${p.slug}`}
                      className="group flex items-baseline justify-between gap-4 border-b py-3 transition-colors hover:text-primary"
                    >
                      <span className="font-medium transition-transform duration-300 group-hover:translate-x-1">
                        {p.title}
                      </span>
                      <span className="shrink-0 text-sm text-muted-foreground">{formatDate(p.date)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href="/blog"
                className="group mt-4 inline-flex items-center gap-1 font-medium text-primary underline-offset-4 hover:underline"
              >
                All posts <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </section>
        </>
      )}

      <div className={container}>
        <Separator />
      </div>

      <section id="contact" className={section}>
        <Reveal>
          <h2 className={h2}>Contact</h2>
          <p className="mb-5 text-lg text-muted-foreground">
            The best way to reach me is email. I reply within a couple of days.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              asChild
              size="lg"
              className="rounded-full transition-transform hover:-translate-y-0.5 active:scale-95"
            >
              <a href={`mailto:${site.email}`}>
                <Mail /> {site.email}
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full transition-transform hover:-translate-y-0.5 active:scale-95"
            >
              <a href={site.github} target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            </Button>
            {site.linkedin && (
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full transition-transform hover:-translate-y-0.5 active:scale-95"
              >
                <a href={site.linkedin} target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              </Button>
            )}
          </div>
        </Reveal>
      </section>
    </>
  );
}
