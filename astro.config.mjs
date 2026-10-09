// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

export default defineConfig({
  site: 'https://layaungphyo.dev',
  // Astro 7 defaults to JSX-style whitespace, which glues adjacent inline spans
  // (prompt user, path, command) together. Keep HTML-aware whitespace instead.
  compressHTML: true,
  fonts: [
    // The official release, not the Fontsource subsets: the banner, diagrams and
    // site map need its box-drawing and geometric glyphs.
    {
      name: 'JetBrains Mono',
      cssVariable: '--font-mono',
      provider: fontProviders.local(),
      fallbacks: ['ui-monospace', 'monospace'],
      options: {
        variants: [
          { weight: 400, style: 'normal', src: ['./src/assets/fonts/JetBrainsMono-Regular.woff2'] },
          { weight: 500, style: 'normal', src: ['./src/assets/fonts/JetBrainsMono-Medium.woff2'] },
          { weight: 700, style: 'normal', src: ['./src/assets/fonts/JetBrainsMono-Bold.woff2'] },
        ],
      },
    },
    {
      name: 'Geist',
      cssVariable: '--font-geist',
      provider: fontProviders.fontsource(),
      weights: [400, 500],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['sans-serif'],
    },
    {
      name: 'Geist Mono',
      cssVariable: '--font-geist-mono',
      provider: fontProviders.fontsource(),
      weights: [400],
      styles: ['normal'],
      subsets: ['latin', 'symbols2'],
      fallbacks: ['monospace'],
    },
  ],
});
