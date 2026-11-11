import { techIcon } from '@/lib/tech-icons';

export function TechIcon({ name }: { name: string }) {
  const icon = techIcon(name);
  if (!icon) return null;
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" className="size-3.5 shrink-0">
      <path d={icon.path} />
    </svg>
  );
}
