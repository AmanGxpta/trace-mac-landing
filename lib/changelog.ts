/**
 * Changelog data — drives the "Changelog" section on the landing page.
 *
 * TO ADD A RELEASE: prepend a new entry to the top of the array. Newest first.
 * `kind` controls the little label: "new" | "improved" | "fixed".
 * Keep `version` in sync with APP_VERSION in lib/site.ts when you ship a build.
 */
export type ChangeKind = "new" | "improved" | "fixed";

export type ChangelogEntry = {
  version: string;
  /** ISO date (YYYY-MM-DD) of the release. */
  date: string;
  /** Optional one-line headline for the release. */
  title?: string;
  changes: { kind: ChangeKind; text: string }[];
};

export const changelog: ChangelogEntry[] = [
  {
    version: "1.0.2",
    date: "2026-06-19",
    title: "First public release",
    changes: [
      {
        kind: "new",
        text: "The slash surface — /task, /done, and /log to capture work in under five seconds, with #project targeting and tab-completion from anywhere.",
      },
      {
        kind: "new",
        text: "Per-project, GitHub-style heatmaps built only from completions and journal entries, locked immutable after 24 hours.",
      },
      {
        kind: "new",
        text: "Combined view that fuses every visible project into one heatmap, with each project's own map stacked below.",
      },
      {
        kind: "new",
        text: "Tags and /filter to narrow both the project list and the heatmaps.",
      },
      {
        kind: "new",
        text: "Menubar focus timers with an edge-sweep finish — no popup, no sound.",
      },
      {
        kind: "new",
        text: "Developer jumps: open the linked folder in Cursor or cmux, or open the git origin in your browser.",
      },
    ],
  },
];
