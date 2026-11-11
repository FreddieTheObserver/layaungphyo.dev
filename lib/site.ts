export const site = {
  url: 'https://layaungphyo.dev',
  name: 'La Yaung Phyo',
  nickname: 'Freddie',
  role: 'Backend & systems engineer',
  location: 'Bangkok, Thailand',
  title: 'La Yaung Phyo (Freddie) - Backend & systems engineer',
  description:
    'Backend and systems engineer in Bangkok. I build reliable services with TypeScript, NestJS and Postgres, with a focus on data integrity, concurrency and failure modes.',
  email: 'hello@layaungphyo.dev',
  github: 'https://github.com/FreddieTheObserver',
  // Set to the real profile URL; the link is hidden while this is null.
  linkedin: null as string | null,
  // Drop the PDF into public/ before going live.
  resume: '/freddie-resume.pdf',
};

export const nav = [
  { href: '/#work', label: 'Work' },
  { href: '/#about', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/#contact', label: 'Contact' },
];

export const skills = [
  { group: 'Languages', items: ['TypeScript', 'SQL', 'Go', 'Python'] },
  { group: 'Data', items: ['PostgreSQL', 'sqlc'] },
  { group: 'Backend & web', items: ['NestJS', 'Express', 'Next.js', 'REST'] },
  { group: 'Tooling', items: ['Docker', 'GitHub Actions', 'Testcontainers', 'Linux'] },
];

export const principles = [
  {
    title: "Measure, don't guess",
    body: 'A confident suggestion is not a result. I test against a real Postgres and Redis instead of mocks, so the numbers and the failures are real.',
  },
  {
    title: 'Let the database hold the line',
    body: 'Locks and constraints beat careful application code. In CineBook, a partial unique index is the last defense against double booking.',
  },
  {
    title: 'Fail loudly, recover quietly',
    body: 'Watchdogs, health checks and honest messages. When floodwatch goes down, a heartbeat alarm fires and subscribers hear about the gap.',
  },
];

export const now = {
  updated: 'October 2026',
  items: [
    'Building cafe-pos, a NestJS backend with self-order kiosks as first-class clients.',
    'Mentoring CS juniors on CSC102 practice sets.',
    'Sending my first open-source PR: setup docs for unishare.',
    'Keeping floodwatch running through the Bangkok floods.',
  ],
};
