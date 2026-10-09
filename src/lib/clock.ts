const time = new Intl.DateTimeFormat('en-US', {
  timeZone: 'Asia/Bangkok',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});
const date = new Intl.DateTimeFormat('en-US', {
  timeZone: 'Asia/Bangkok',
  weekday: 'short',
  day: '2-digit',
  month: 'short',
});

/** Bangkok wall-clock time for the tmux status bar, e.g. { time: '22:51', date: 'wed 07 oct' }. */
export function clockParts(d: Date): { time: string; date: string } {
  const p = Object.fromEntries(date.formatToParts(d).map((x) => [x.type, x.value]));
  return { time: time.format(d), date: `${p.weekday} ${p.day} ${p.month}`.toLowerCase() };
}
