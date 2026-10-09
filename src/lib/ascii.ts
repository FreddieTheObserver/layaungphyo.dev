export const banner = [
  '███████╗██████╗ ███████╗██████╗ ██████╗ ██╗███████╗',
  '██╔════╝██╔══██╗██╔════╝██╔══██╗██╔══██╗██║██╔════╝',
  '█████╗  ██████╔╝█████╗  ██║  ██║██║  ██║██║█████╗  ',
  '██╔══╝  ██╔══██╗██╔══╝  ██║  ██║██║  ██║██║██╔══╝  ',
  '██║     ██║  ██║███████╗██████╔╝██████╔╝██║███████╗',
  '╚═╝     ╚═╝  ╚═╝╚══════╝╚═════╝ ╚═════╝ ╚═╝╚══════╝',
].join('\n');

export type Tone = 'ink' | 'soft' | 'accent' | 'ok' | 'dim';
export type Run = [text: string, tone: Tone];

const NBSP = ' ';
const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const n = (v: number) => Math.round(v * 100) / 100;

/**
 * Draws the figlet banner as SVG. As text, each █ lands on a fractional pixel
 * (0.6em advances), so browsers anti-alias a seam between every pair of blocks.
 * Units are 1/100 em of JetBrains Mono at the design's 34/28 line height.
 */
export function bannerSvg(text = banner) {
  const W = 60;
  const H = 121.43;
  const D = 10; // half the gap between the two strokes of a double line
  const rows = text.split('\n');
  const rects: string[] = [];
  const path: string[] = [];

  rows.forEach((line, r) => {
    const chars = [...line];
    for (let c = 0; c < chars.length;) {
      if (chars[c] === '█') {
        let end = c;
        while (chars[end] === '█') end++;
        // Overlap the next row by one unit so rows never show a hairline between them.
        rects.push(
          `<rect x="${c * W}" y="${n(r * H)}" width="${(end - c) * W}" height="${n(H + (r < rows.length - 1 ? 1 : 0))}"/>`,
        );
        c = end;
        continue;
      }
      const [x0, y0] = [c * W, r * H];
      const [x1, y1, cx, cy] = [x0 + W, y0 + H, x0 + W / 2, y0 + H / 2];
      const seg: Record<string, string> = {
        '═': `M${x0} ${cy - D}H${x1}M${x0} ${cy + D}H${x1}`,
        '║': `M${cx - D} ${y0}V${y1}M${cx + D} ${y0}V${y1}`,
        '╗': `M${x0} ${cy - D}H${cx + D}V${y1}M${x0} ${cy + D}H${cx - D}V${y1}`,
        '╔': `M${x1} ${cy - D}H${cx - D}V${y1}M${x1} ${cy + D}H${cx + D}V${y1}`,
        '╝': `M${x0} ${cy + D}H${cx + D}V${y0}M${x0} ${cy - D}H${cx - D}V${y0}`,
        '╚': `M${x1} ${cy + D}H${cx - D}V${y0}M${x1} ${cy - D}H${cx + D}V${y0}`,
      };
      if (seg[chars[c]]) path.push(seg[chars[c]].replace(/-?\d+\.\d+/g, (v) => String(n(Number(v)))));
      c++;
    }
  });

  const width = Math.max(...rows.map((l) => [...l].length)) * W;
  return {
    viewBox: `0 0 ${width} ${n(rows.length * H)}`,
    inner: `<g class="blocks">${rects.join('')}</g><path class="shadow" d="${path.join('')}"/>`,
  };
}

/**
 * Lays out colored monospace text as SVG, one <text> per line with an exact
 * textLength. Browsers that round glyph advances at small sizes (Chrome on Linux)
 * would otherwise make ASCII art wider than its box. Units: 100 per em, 60 per column
 * (large units also keep audits from reading the scaled-down art as 10px text).
 */
export function textGridSvg(runs: Run[], lineHeight: number) {
  const FS = 100;
  const CW = 60;
  const LH = FS * lineHeight;
  // JetBrains Mono spans 1.02em above the baseline and 0.30em below it.
  const baseline = ((lineHeight - 1.32) / 2 + 1.02) * FS;

  const lines: Run[][] = [[]];
  for (const [text, tone] of runs) {
    text.split('\n').forEach((part, i) => {
      if (i > 0) lines.push([]);
      if (part) lines[lines.length - 1].push([part, tone]);
    });
  }
  const cols = Math.max(...lines.map((line) => [...line.map(([t]) => t).join('')].length));

  // One layer per tone instead of a <tspan> per color change: other tones' characters
  // become blanks, so columns line up and the DOM stays small. No-break spaces,
  // because SVG collapses ordinary ones and would shift every column.
  const tones = [...new Set(runs.map(([, tone]) => tone))];
  const inner = tones
    .map((tone) => {
      const texts = lines.map((line, i) => {
        const chars = line.flatMap(([t, tt]) => [...t].map((ch) => (tt === tone && ch !== ' ' ? ch : NBSP)));
        if (chars.every((ch) => ch === NBSP)) return '';
        return `<text x="0" y="${n(i * LH + baseline)}" textLength="${chars.length * CW}" lengthAdjust="spacingAndGlyphs">${escape(chars.join(''))}</text>`;
      });
      return `<g class="${tone}">${texts.join('')}</g>`;
    })
    .join('');
  return { viewBox: `0 0 ${cols * CW} ${n(lines.length * LH)}`, inner, cols };
}

/** Splits the portrait into runs; the two lightest ramp steps are dimmed so the face reads. */
export function portraitRuns(text: string): Run[] {
  const runs: Run[] = [];
  for (const ch of text) {
    const tone: Tone = ch === '.' || ch === ':' ? 'dim' : 'ink';
    const last = runs[runs.length - 1];
    if (last && last[1] === tone) last[0] += ch;
    else runs.push([ch, tone]);
  }
  return runs;
}
