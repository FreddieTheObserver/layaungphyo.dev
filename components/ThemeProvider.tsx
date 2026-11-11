'use client';

import { ThemeProvider as NextThemes } from 'next-themes';
import { MotionConfig } from 'motion/react';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemes attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </NextThemes>
  );
}
