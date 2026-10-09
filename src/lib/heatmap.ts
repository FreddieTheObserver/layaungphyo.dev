export type Day = [date: string, count: number, level: number];

export interface Geometry {
  cell: number;
  gap: number;
  /** Width reserved on the left for the mon/wed/fri labels (0 hides them). */
  labelCol: number;
  /** Height reserved on top for month labels. */
  monthRow: number;
}

const monthFmt = new Intl.DateTimeFormat('en-US', { month: 'short', timeZone: 'UTC' });
const dayFmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
const utc = (date: string) => new Date(`${date}T00:00:00Z`);

export function layout(weeks: Day[][], g: Geometry) {
  const pitch = g.cell + g.gap;
  const width = g.labelCol + weeks.length * pitch - g.gap;
  const height = g.monthRow + 7 * pitch - g.gap;

  const cells = weeks.flatMap((week, col) =>
    week.map(([date, count, level]) => ({
      x: g.labelCol + col * pitch,
      y: g.monthRow + utc(date).getUTCDay() * pitch,
      level,
      title: `${count} contribution${count === 1 ? '' : 's'} on ${dayFmt.format(utc(date))}`,
    })),
  );

  // A month is labelled at the week holding its 1st; the opening partial month only
  // if it has room. Labels closer than three columns would overlap, so they are dropped.
  const candidates = weeks.flatMap((week, col) => {
    const first = week.find(([d]) => d.endsWith('-01'));
    if (first) return [{ col, date: first[0] }];
    return col === 0 ? [{ col, date: week[0][0] }] : [];
  });
  const months: { x: number; label: string }[] = [];
  let lastCol = -Infinity;
  candidates.forEach((c, i) => {
    if (i === 0 && candidates[1] && candidates[1].col - c.col < 3) return;
    if (c.col - lastCol < 3) return;
    lastCol = c.col;
    months.push({ x: g.labelCol + c.col * pitch, label: monthFmt.format(utc(c.date)).toLowerCase() });
  });

  const days =
    g.labelCol > 0
      ? [
          { label: 'mon', y: g.monthRow + 1 * pitch + g.cell / 2 },
          { label: 'wed', y: g.monthRow + 3 * pitch + g.cell / 2 },
          { label: 'fri', y: g.monthRow + 5 * pitch + g.cell / 2 },
        ]
      : [];

  const total = weeks.flat().reduce((sum, [, count]) => sum + count, 0);
  return { width, height, cells, months, days, total };
}
