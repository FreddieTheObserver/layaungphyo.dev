import { ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Project } from '@/lib/content';
import { Mdx } from './Mdx';
import { TechIcon } from './TechIcon';

const statusColor: Record<Project['status'], string> = {
  Live: 'text-live',
  'In progress': 'text-progress',
  Completed: 'text-live',
  Design: 'text-muted-foreground',
  Study: 'text-muted-foreground',
};

export function ProjectCard({ project }: { project: Project }) {
  const { media } = project;
  return (
    <Card className="group gap-4 transition-all duration-300 ease-out-expo hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <h3 className="font-mono text-lg font-semibold">{project.name}</h3>
          <Badge variant="outline" className={cn('rounded-full', statusColor[project.status])}>
            {project.status}
          </Badge>
        </div>
        <p className="font-medium">{project.summary}</p>
      </CardHeader>
      <CardContent className="grid gap-4">
        {media && (
          <div className="overflow-hidden rounded-lg border">
            {media.kind === 'video' ? (
              <video
                className="block h-auto w-full transition-transform duration-500 group-hover:scale-[1.03]"
                src={media.src}
                aria-label={media.alt}
                autoPlay
                loop
                muted
                playsInline
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element -- recorded GIFs must not be re-encoded
              <img
                className="block h-auto w-full transition-transform duration-500 group-hover:scale-[1.03]"
                src={media.src}
                alt={media.alt}
                loading="lazy"
              />
            )}
          </div>
        )}
        <div className="prose text-muted-foreground">
          <Mdx source={project.body} />
        </div>
        <ul className="flex flex-wrap gap-2" aria-label="Stack">
          {project.stack.map((s) => (
            <li key={s}>
              <Badge variant="secondary" className="gap-1.5 font-mono font-normal">
                <TechIcon name={s} />
                {s}
              </Badge>
            </li>
          ))}
        </ul>
        {project.links.length > 0 && (
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {project.links.map((l) => (
              <li key={l.href}>
                <a
                  className="group/link inline-flex items-center gap-1 font-medium text-primary underline-offset-4 hover:underline"
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {l.label}
                  <ArrowUpRight className="size-4 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                </a>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
