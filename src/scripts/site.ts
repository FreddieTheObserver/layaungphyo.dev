import { clockParts } from '../lib/clock';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const isTyping = (t: EventTarget | null) =>
  t instanceof HTMLElement && (t.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName));

/** Scrolls to a section and moves focus there, so keyboard and screen-reader users land with it. */
function goTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (el instanceof HTMLDetailsElement) el.open = true;
  el.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth', block: 'start' });
  if (location.hash !== `#${id}`) history.pushState(null, '', `#${id}`);
  const target = el instanceof HTMLDetailsElement ? el.querySelector('summary') : el;
  target?.focus({ preventScroll: true });
}

const openUrl = (url: string) => window.open(url, '_blank', 'noopener');

// In-page links go through goTo for focus handling and to open accordion items.
document.addEventListener('click', (e) => {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const a = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
  const id = a?.hash.slice(1);
  if (!id || !document.getElementById(id)) return;
  e.preventDefault();
  goTo(id);
});

function openFromHash() {
  const el = document.getElementById(decodeURIComponent(location.hash.slice(1)));
  if (el instanceof HTMLDetailsElement) el.open = true;
}
window.addEventListener('hashchange', openFromHash);
openFromHash();

// Command palette
const palette = document.querySelector<HTMLDialogElement>('#palette');
const input = document.querySelector<HTMLInputElement>('#palette-input');
const options = [...document.querySelectorAll<HTMLLIElement>('#palette-list [role="option"]')];
const empty = document.querySelector<HTMLElement>('#palette-empty');
const hrefOf = (key: string) => options.find((o) => o.dataset.key === key)?.dataset.href ?? '';
let active = 0;

const shown = () => options.filter((o) => !o.hidden);

function select(i: number) {
  const list = shown();
  for (const o of options) o.setAttribute('aria-selected', 'false');
  if (!list.length) {
    input?.removeAttribute('aria-activedescendant');
    return;
  }
  active = (i + list.length) % list.length;
  const o = list[active];
  o.setAttribute('aria-selected', 'true');
  input?.setAttribute('aria-activedescendant', o.id);
  o.scrollIntoView({ block: 'nearest' });
}

function filter() {
  const q = (input?.value ?? '').trim().toLowerCase();
  for (const o of options) o.hidden = q !== '' && !(o.textContent ?? '').toLowerCase().includes(q);
  if (empty) empty.hidden = shown().length > 0;
  select(0);
}

function run(o: HTMLElement) {
  const href = o.dataset.href ?? '';
  palette?.close();
  if (o.dataset.external !== undefined) openUrl(href);
  else goTo(href.slice(1));
}

function openPalette() {
  if (!palette || !input || palette.open) return;
  input.value = '';
  filter();
  palette.showModal();
  input.focus();
}

input?.addEventListener('input', filter);
input?.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault();
    select(active + (e.key === 'ArrowDown' ? 1 : -1));
  } else if (e.key === 'Enter') {
    e.preventDefault();
    const o = shown()[active];
    if (o) run(o);
  } else if (/^[1-4]$/.test(e.key)) {
    e.preventDefault();
    const o = options.find((x) => x.dataset.key === e.key);
    if (o) run(o);
  }
});
options.forEach((o) => {
  o.addEventListener('click', () => run(o));
  o.addEventListener('mousemove', () => {
    const i = shown().indexOf(o);
    if (i !== active) select(i);
  });
});
palette?.addEventListener('click', (e) => {
  if (e.target !== palette) return;
  const r = palette.getBoundingClientRect();
  const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
  if (!inside) palette.close();
});
document.querySelectorAll('[data-palette-open]').forEach((b) => b.addEventListener('click', openPalette));
document.querySelectorAll('[data-palette-close]').forEach((b) => b.addEventListener('click', () => palette?.close()));

// Keyboard shortcuts, matching the keycaps on the page.
const SECTION_KEYS: Record<string, string> = { '0': 'home', '1': 'work', '2': 'about', '3': 'now', '4': 'contact' };
let gTimer: number | undefined;

document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    if (palette?.open) palette.close();
    else openPalette();
    return;
  }
  if (palette?.open || e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey || isTyping(e.target)) return;

  if (e.key in SECTION_KEYS) {
    e.preventDefault();
    goTo(SECTION_KEYS[e.key]);
  } else if (e.key === '/') {
    e.preventDefault();
    openPalette();
  } else if (e.key === 'r') {
    openUrl(hrefOf('r'));
  } else if (e.key === 'g') {
    // vim: "gg" goes to the top, a single "g" opens GitHub.
    if (gTimer) {
      clearTimeout(gTimer);
      gTimer = undefined;
      goTo('home');
    } else {
      gTimer = window.setTimeout(() => {
        gTimer = undefined;
        openUrl(hrefOf('g'));
      }, 300);
    }
  } else if (e.key === 'Enter') {
    const t = e.target as HTMLElement;
    if (t === document.body || t.classList.contains('sec')) goTo('work');
  }
});

// Arrow keys move through the site map and the accordion; Esc closes an open project.
function arrowNav(container: Element | null, items: HTMLElement[]) {
  container?.addEventListener('keydown', (ev) => {
    const e = ev as KeyboardEvent;
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    const i = items.indexOf(document.activeElement as HTMLElement);
    if (i < 0) return;
    e.preventDefault();
    items[Math.min(items.length - 1, Math.max(0, i + (e.key === 'ArrowDown' ? 1 : -1)))].focus();
  });
}
const sitemap = document.querySelector('[data-sitemap]');
arrowNav(sitemap, [...(sitemap?.querySelectorAll<HTMLElement>('.row') ?? [])]);
const accordion = document.querySelector('[data-accordion]');
arrowNav(accordion, [...(accordion?.querySelectorAll<HTMLElement>('summary') ?? [])]);
accordion?.addEventListener('keydown', (ev) => {
  const e = ev as KeyboardEvent;
  if (e.key !== 'Escape') return;
  const d = (e.target as HTMLElement).closest('details');
  if (!d?.open) return;
  d.open = false;
  d.querySelector('summary')?.focus();
});

// tmux bar: mark the window for the section in view.
const windows = [...document.querySelectorAll<HTMLAnchorElement>('[data-section]')];
const setCurrent = (id: string) =>
  windows.forEach((w) =>
    w.dataset.section === id ? w.setAttribute('aria-current', 'location') : w.removeAttribute('aria-current'),
  );
const observer = new IntersectionObserver(
  (entries) => entries.forEach((en) => en.isIntersecting && setCurrent(en.target.id)),
  { rootMargin: '-45% 0px -50% 0px' },
);
windows.forEach((w) => {
  const s = document.getElementById(w.dataset.section ?? '');
  if (s) observer.observe(s);
});

// Live Bangkok clock.
const timeEl = document.querySelector('[data-clock-time]');
const dateEl = document.querySelector('[data-clock-date]');
function tick() {
  const p = clockParts(new Date());
  if (timeEl) timeEl.textContent = p.time;
  if (dateEl) dateEl.textContent = p.date;
}
if (timeEl || dateEl) {
  tick();
  setInterval(tick, 15_000);
}

// Show the right modifier key outside Apple platforms.
const platform =
  (navigator as Navigator & { userAgentData?: { platform: string } }).userAgentData?.platform ?? navigator.userAgent;
if (!/mac|iphone|ipad|ipod/i.test(platform)) {
  document.querySelectorAll('[data-modkey]').forEach((el) => (el.textContent = 'ctrl K'));
}
