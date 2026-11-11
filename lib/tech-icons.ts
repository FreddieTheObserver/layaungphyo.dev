import {
  siDrizzle,
  siExpress,
  siGithubactions,
  siGo,
  siNestjs,
  siNextdotjs,
  siPostgresql,
  siPrisma,
  siPython,
  siReact,
  siRedis,
  siSqlite,
  siTelegram,
  siTypescript,
  type SimpleIcon,
} from 'simple-icons';

const icons: Record<string, SimpleIcon> = {
  typescript: siTypescript,
  nestjs: siNestjs,
  'next.js': siNextdotjs,
  react: siReact,
  express: siExpress,
  go: siGo,
  python: siPython,
  postgresql: siPostgresql,
  drizzle: siDrizzle,
  prisma: siPrisma,
  sqlite: siSqlite,
  redis: siRedis,
  telegram: siTelegram,
  'github actions': siGithubactions,
};

export function techIcon(name: string) {
  return icons[name.toLowerCase()];
}
