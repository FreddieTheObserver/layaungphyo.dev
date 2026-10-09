/** Keeps deliberate runs of spaces (terminal-style column gaps) from being collapsed. */
export const nb = (s: string) => s.replace(/ {2,}/g, (m) => ' '.repeat(m.length));
