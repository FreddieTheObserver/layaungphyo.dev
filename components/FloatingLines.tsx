'use client';

import { useEffect, useRef } from 'react';

const STEP = 20;
const CHUNK = 8;

type Strand = { k: number; width: number; alpha: number; accent: boolean };

type Bundle = {
  base: number;
  amps: [number, number];
  freqs: [number, number];
  speeds: [number, number];
  phases: [number, number];
  twist: { cycles: number; phase: number; speed: number };
  spacing: number;
  strands: Strand[];
};

const rand = (min: number, max: number) => min + Math.random() * (max - min);

function makeBundle(base: number, count: number): Bundle {
  const mid = Math.floor(count / 2);
  return {
    base,
    amps: [rand(36, 80), rand(14, 34)],
    freqs: [rand(0.0016, 0.003), rand(0.0038, 0.0065)],
    speeds: [rand(0.05, 0.11), rand(-0.1, -0.05)],
    phases: [rand(0, 6.28), rand(0, 6.28)],
    twist: { cycles: rand(0.7, 1.1), phase: rand(0, 6.28), speed: rand(0.03, 0.06) * (Math.random() < 0.5 ? -1 : 1) },
    spacing: rand(20, 26),
    strands: Array.from({ length: count }, (_, i) => ({
      k: i - (count - 1) / 2,
      width: i === mid ? 1.7 : 1,
      alpha: i === mid ? 0.4 : rand(0.2, 0.3),
      accent: i % 2 === 0,
    })),
  };
}

export function FloatingLines() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
    const lowEnd = (navigator.hardwareConcurrency ?? 8) <= 4 || memory <= 4;
    const frameMs = 1000 / (lowEnd ? 20 : 30);
    const dprCap = lowEnd ? 1 : 2;

    let bundles: Bundle[] = [];
    let xs = new Float32Array(0);
    let ys = new Float32Array(0);
    let width = 0;
    let height = 0;
    let accent = '96 165 250';
    let ink = '161 161 170';
    let accentFade: CanvasGradient | string = '';
    let inkFade: CanvasGradient | string = '';
    let time = 40;
    let frame = 0;
    let last = 0;

    const toRgb = (value: string, fallback: string) => {
      const probe = document.createElement('span');
      probe.style.color = value;
      document.body.appendChild(probe);
      const match = getComputedStyle(probe).color.match(/\d+(\.\d+)?/g);
      probe.remove();
      return match && match.length >= 3 ? `${match[0]} ${match[1]} ${match[2]}` : fallback;
    };

    // Strokes fade in from the left edge and out at the right edge, so lines never end abruptly.
    const fade = (rgb: string) => {
      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      for (const [stop, alpha] of [
        [0, 0],
        [0.16, 0.8],
        [0.5, 1],
        [0.84, 0.8],
        [1, 0],
      ]) {
        gradient.addColorStop(stop, `rgb(${rgb} / ${alpha})`);
      }
      return gradient;
    };

    const buildFades = () => {
      accentFade = fade(accent);
      inkFade = fade(ink);
    };

    const readColors = () => {
      accent = toRgb('var(--primary)', accent);
      ink = toRgb('var(--muted-foreground)', ink);
      buildFades();
    };

    const populate = () => {
      const count = lowEnd ? 2 : 3;
      const strands = lowEnd ? 4 : 5;
      bundles = Array.from({ length: count }, (_, i) =>
        makeBundle(height * ((i + 0.6) / count) + rand(-40, 40), strands),
      );
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, dprCap);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      const points = Math.ceil(width / STEP) + 3;
      xs = new Float32Array(points);
      ys = new Float32Array(points);
      buildFades();
      populate();
    };

    // The signed twist factor passes through zero, so the strands pinch into one thread and then fan out the other way, crossing over.
    const yAt = (b: Bundle, k: number, x: number) => {
      let y = b.base + Math.sin(time * 0.06 + b.phases[0]) * 16;
      for (let i = 0; i < 2; i++) {
        y += Math.sin(x * b.freqs[i] + time * b.speeds[i] + b.phases[i]) * b.amps[i];
      }
      const twist = Math.cos((x / width) * b.twist.cycles * Math.PI * 2 + b.twist.phase + time * b.twist.speed);
      return y + k * b.spacing * twist + Math.sin(x * 0.008 + time * 0.15 + k) * 3;
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const n = xs.length;
      for (const bundle of bundles) {
        for (const strand of bundle.strands) {
          for (let i = 0; i < n; i++) {
            xs[i] = (i - 1) * STEP;
            ys[i] = yAt(bundle, strand.k, xs[i]);
          }
          ctx.strokeStyle = strand.accent ? accentFade : inkFade;
          ctx.globalAlpha = strand.alpha;
          let s = 0;
          while (s < n - 2) {
            const e = Math.min(s + CHUNK, n - 1);
            const u = Math.min(1, Math.max(0, xs[s] / width));
            // Width swells toward the middle of the page and thins toward the edges.
            ctx.lineWidth = strand.width * (0.35 + 0.65 * Math.sin(Math.PI * u));
            ctx.beginPath();
            ctx.moveTo((xs[s] + xs[s + 1]) / 2, (ys[s] + ys[s + 1]) / 2);
            for (let j = s + 1; j < e; j++) {
              ctx.quadraticCurveTo(xs[j], ys[j], (xs[j] + xs[j + 1]) / 2, (ys[j] + ys[j + 1]) / 2);
            }
            ctx.stroke();
            s = e - 1;
          }
        }
      }
      ctx.globalAlpha = 1;
    };

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      const elapsed = now - last;
      if (elapsed < frameMs) return;
      last = now;
      time += Math.min(elapsed, 100) / 1000;
      draw();
    };

    const stop = () => cancelAnimationFrame(frame);
    const start = () => {
      stop();
      if (motion.matches || document.hidden) return draw();
      last = performance.now();
      frame = requestAnimationFrame(tick);
    };

    const onResize = () => {
      resize();
      start();
    };

    const theme = new MutationObserver(() => {
      readColors();
      draw();
    });

    readColors();
    resize();
    start();
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', start);
    motion.addEventListener('change', start);
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => {
      stop();
      theme.disconnect();
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', start);
      motion.removeEventListener('change', start);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="absolute inset-0 h-full w-full" />;
}
