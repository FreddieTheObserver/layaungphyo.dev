export interface Link {
  label: string;
  url: string | null;
}

export const site = {
  url: 'https://layaungphyo.dev',
  title: 'La Yaung Phyo (Freddie) · backend & systems engineer',
  description:
    'Backend and systems engineer in Bangkok. Go and Postgres, concurrency, data and failure modes, from a terminal.',
  name: 'La Yaung Phyo',
  user: 'freddie',
  host: 'bkk',
  dir: '~/layaungphyo.dev',
  role: 'backend & systems engineer',
  location: 'Bangkok, TH',
  email: 'hello@layaungphyo.dev',
  github: { handle: 'FreddieTheObserver', url: 'https://github.com/FreddieTheObserver' },
  // Placeholder until the real profile URL is known; a null url renders as plain text.
  linkedin: { label: 'linkedin.com/in/…', url: null } satisfies Link,
  // Placeholder: drop the PDF into public/ before going live.
  resume: { label: 'freddie-resume.pdf', url: '/freddie-resume.pdf' } satisfies Link,
};

export const sections = [
  { key: '0', id: 'home', label: 'home' },
  { key: '1', id: 'work', label: 'work' },
  { key: '2', id: 'about', label: 'about' },
  { key: '3', id: 'now', label: 'now' },
  { key: '4', id: 'contact', label: 'contact' },
] as const;
