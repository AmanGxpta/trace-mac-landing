// Deterministic activity heatmap for the Trace landing page.
// Seeded with a fixed value so the grid looks organic but renders identically
// on the server and the client (no hydration mismatch).

const WEEKS = 26;

function rng(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

export type HeatmapData = {
  /** levels[week][day] — 0 (empty) through 4 (most active) */
  levels: number[][];
  /** number of days with any activity */
  active: number;
  /** month labels with their column span */
  months: { name: string; w: number }[];
};

export function buildHeatmap(): HeatmapData {
  const rand = rng(20260606);

  let active = 0;
  const levels: number[][] = [];
  for (let w = 0; w < WEEKS; w++) {
    levels[w] = [];
    // "intensity" drifts over time so there are busy and neglected stretches
    const drift = 0.35 + 0.4 * Math.sin(w / 4) + (w / WEEKS) * 0.25;
    for (let d = 0; d < 7; d++) {
      const r = rand();
      const weekend = d === 0 || d === 6 ? 0.45 : 1;
      const v = r * drift * weekend;
      let lvl = 0;
      if (v > 0.62) lvl = 4;
      else if (v > 0.42) lvl = 3;
      else if (v > 0.26) lvl = 2;
      else if (v > 0.13) lvl = 1;
      // a few honest gaps even in busy stretches
      if (rand() > 0.86) lvl = 0;
      levels[w][d] = lvl;
      if (lvl > 0) active++;
    }
  }

  const names = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const now = new Date(2026, 5, 6);
  const startMonth = (now.getMonth() - 6 + 12) % 12;
  const blockWidths = [4, 5, 4, 5, 4, 4];
  const months = blockWidths.map((w, idx) => ({
    w,
    name: names[(startMonth + idx) % 12],
  }));

  return { levels, active, months };
}
