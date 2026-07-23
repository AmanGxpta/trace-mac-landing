// Deterministic activity heatmap for the Trace landing page.
// Seeded with a fixed value, and anchored to a fixed end date, so the grid
// looks organic but renders identically on the server and the client
// (no hydration mismatch).

/** 53 weeks — "last 12 months", matching the app's own project heatmap. */
const WEEKS = 53;
const DAYS = WEEKS * 7;

/** Fixed anchor instead of `new Date()` so SSR and hydration agree. */
const END_DATE = new Date(2026, 5, 6);

const WEEKDAYS = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function rng(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

export type HeatmapCell = {
  /** 0 (empty) through 4 (most active) */
  level: number;
  /** Preformatted so the client never re-derives it — e.g. "Monday, June 1" */
  label: string;
};

export function buildHeatmap(): HeatmapCell[] {
  const rand = rng(20260606);
  const cells: HeatmapCell[] = [];

  for (let i = DAYS - 1; i >= 0; i--) {
    const date = new Date(END_DATE);
    date.setDate(END_DATE.getDate() - i);

    const w = (DAYS - 1 - i) / 7;
    // "intensity" drifts over time so there are busy and neglected stretches
    const drift = 0.35 + 0.4 * Math.sin(w / 4) + (w / WEEKS) * 0.25;
    const day = date.getDay();
    const weekend = day === 0 || day === 6 ? 0.45 : 1;
    const v = rand() * drift * weekend;

    let level = 0;
    if (v > 0.62) level = 4;
    else if (v > 0.42) level = 3;
    else if (v > 0.26) level = 2;
    else if (v > 0.13) level = 1;
    // a few honest gaps even in busy stretches
    if (rand() > 0.86) level = 0;

    cells.push({
      level,
      label: `${WEEKDAYS[day]}, ${MONTHS[date.getMonth()]} ${date.getDate()}`,
    });
  }

  return cells;
}
