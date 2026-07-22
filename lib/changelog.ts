/**
 * Changelog data — drives the "Changelog" section on the landing page.
 *
 * TO ADD A RELEASE: prepend a new entry to the top of the array. Newest first.
 * `kind` controls the little label: "new" | "improved" | "fixed" | "removed".
 * Keep `version` in sync with APP_VERSION in lib/site.ts when you ship a build.
 */
export type ChangeKind = "new" | "improved" | "fixed" | "removed";

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
    version: "1.11.0",
    date: "2026-07-23",
    title: "Capturing Actions Happened in past",
    changes: [
      {
        kind: "new",
        text: "Now Users can capture actions happened on their screen in last 30/60/90 seconds with /capture-screen 30|60|90 given their preferences. It captures actions prior the command was sent, and stores that in the journal as a log.",
      },
    ],
  },
  {
    version: "1.10.0",
    date: "2026-07-21",
    title: "Cinematic onboarding tour",
    changes: [
      {
        kind: "new",
        text: "A self-driving first-run experience: a director script drives the real UI through a staged takeover, seeded with demo projects that carry backdated history and a fabricated git repository so every screen has plausible data.",
      },
      {
        kind: "new",
        text: "Accessibility-gated event synthesis powering the tour — right-click menus, keystrokes, and Unicode typing — with longer interludes for the Cursor agent prompt and a real repository page.",
      },
      {
        kind: "new",
        text: "Application picker for shortcut targets, so editor and terminal launches respect which apps are actually installed.",
      },
      {
        kind: "new",
        text: "Command history cycling in the input bar via the arrow keys, plus placeholder hint text.",
      },
      {
        kind: "new",
        text: "Input bar and entry pinning in the Journal view.",
      },
      {
        kind: "new",
        text: "TRACE_STORE_DIR debug override for isolated development stores, guarded against migrating a legacy store into a dev location.",
      },
      {
        kind: "improved",
        text: "Onboarding moved from a ghost-cursor takeover to a progressive, step-by-step flow after the ghost model proved fragile to pacing and window geometry.",
      },
      {
        kind: "improved",
        text: "Project focus view gained a card-shuffle transition between task states.",
      },
      {
        kind: "removed",
        text: "The /council entry point and its access path from the app.",
      },
      {
        kind: "removed",
        text: "The legacy slideshow onboarding — views, window controller, and roughly 50 MB of bundled video assets.",
      },
      {
        kind: "fixed",
        text: "Heatmap day step in the onboarding flow now advances reliably.",
      },
      {
        kind: "fixed",
        text: "Kill-port menu no longer renders as a clipped sliver inside project rows.",
      },
      {
        kind: "fixed",
        text: "Long journal logs containing blank lines render in full instead of being truncated.",
      },
      {
        kind: "fixed",
        text: "Back button hit area expanded to a usable size.",
      },
    ],
  },
  {
    version: "1.9.0",
    date: "2026-07-18",
    title: "TraceServer & AI Council",
    changes: [
      {
        kind: "new",
        text: "TraceServer — a localhost HTTP surface on 127.0.0.1:8787 (NWListener, bearer-token auth) exposing /health, POST /command routed through the existing command pipeline, and GET /projects/:id/context for journal and task grounding.",
      },
      {
        kind: "new",
        text: "/council — a Next.js AI council of seven personas across six gated stages, grounded in live journal and task data. Includes cross-persona relay with unread badges, automatic stage-insight capture and manual save-back into the project journal, side threads, and an artifact gallery.",
      },
      {
        kind: "new",
        text: "Council agent harness with a mode-aware tool registry (artifacts including Mermaid, relays, stage insights), attachable skills, and web search.",
      },
      {
        kind: "new",
        text: "Council chat input with file and skill attachments, push-to-talk voice transcription with a live waveform, and an elapsed-time activity indicator.",
      },
      {
        kind: "new",
        text: "Council rendering for Markdown, Mermaid, and HTML artifact previews, zoomable inline diagrams, and a browse trail.",
      },
      {
        kind: "new",
        text: "Notification system with twelve triggers derived from existing app data and tiered delivery levels, including Claude usage alerts keyed to remaining quota.",
      },
      {
        kind: "new",
        text: "/config for power-user opt-ins and for setting how many actions earn a project its daily checkmark.",
      },
      {
        kind: "new",
        text: "In-app /claude-usage popup.",
      },
      {
        kind: "improved",
        text: "The recap pipeline was extracted into a dedicated generator so the overlay and headless callers share a single map-reduce path.",
      },
      {
        kind: "fixed",
        text: "Deleting a log now clears that day's checkmark instead of leaving it lit.",
      },
      {
        kind: "fixed",
        text: "The council launcher treats a hung listener on port 3789 as foreign rather than spawning over it.",
      },
    ],
  },
  {
    version: "1.8.0",
    date: "2026-07-15",
    title: "On-device AI",
    changes: [
      {
        kind: "new",
        text: "On-device AI over Foundation Models, with swift-ai-sdk vendored into the project — no network calls and no API keys.",
      },
      {
        kind: "new",
        text: "/recap for on-device work summaries, scoped to the calling view: the project list recaps everything, the focus view recaps only the project in focus.",
      },
      {
        kind: "new",
        text: "Project catch-up banner for stale projects, and a cross-project briefing shown on return after a break.",
      },
      {
        kind: "new",
        text: "/find — on-device semantic search across the work log, available from both the project and Priorities views.",
      },
      {
        kind: "new",
        text: "/canvas — an AI pipeline that traces features out of git history into a draggable, pinch-zoomable feature map, presented from the project focus view.",
      },
      {
        kind: "new",
        text: "Structured-output and enum-pick primitives in the AI layer, plus history-derived cache invalidation keyed on the repository HEAD.",
      },
      {
        kind: "improved",
        text: "Shortcuts now support multiple directories and repositories per project; the GitHub shortcut lists every repository across a project's directories.",
      },
      {
        kind: "fixed",
        text: "Repaired guided-generation streaming in the vendored swift-ai-sdk.",
      },
    ],
  },
  {
    version: "1.7.0",
    date: "2026-07-13",
    changes: [
      {
        kind: "new",
        text: "/create-section to group pending tasks under named dividers, with those dividers carried through to the completed-tasks table.",
      },
      {
        kind: "new",
        text: "Task completions broadcast to local listeners.",
      },
      {
        kind: "fixed",
        text: "Attaching images from folder-based sources.",
      },
      {
        kind: "fixed",
        text: "Duplicate prompt when submitting non-command input in the focus view.",
      },
    ],
  },
  {
    version: "1.6.0",
    date: "2026-07-09",
    changes: [
      {
        kind: "new",
        text: "Clickable links in tasks and logs, styled to match body text with an underline and a per-link hover fade.",
      },
      {
        kind: "new",
        text: "Completion tick beside a project's name once meaningful progress is recorded that day.",
      },
      {
        kind: "new",
        text: "Wrapping and unwrapping in the Priorities view.",
      },
      {
        kind: "improved",
        text: "Access gating: free use is limited to two projects; a full unlock requires contacting the maintainers.",
      },
      {
        kind: "improved",
        text: "Onboarding is now mandatory — the app is unreachable until it completes.",
      },
      {
        kind: "improved",
        text: "Onboarding steps reordered.",
      },
      {
        kind: "improved",
        text: "The docs/ folder is no longer tracked in version control.",
      },
      {
        kind: "fixed",
        text: "Restored SwiftUI text rendering for task rows that had gone invisible.",
      },
    ],
  },
  {
    version: "1.5.0",
    date: "2026-06-23",
    changes: [
      {
        kind: "new",
        text: "Live dev-server port detection per project, surfaced in a dedicated row beneath the project focus header.",
      },
      {
        kind: "new",
        text: "/claude-usage to open Claude usage settings.",
      },
      {
        kind: "new",
        text: "/show-tags and /hide-tags to toggle tag display on project rows.",
      },
      {
        kind: "new",
        text: "Git commits shown alongside logs in the Journal view.",
      },
      {
        kind: "new",
        text: "First-run onboarding flow.",
      },
      {
        kind: "new",
        text: "Image attachments in journal logs.",
      },
      {
        kind: "new",
        text: "Delete action for pending tasks.",
      },
      {
        kind: "improved",
        text: "The cursor now becomes a pointer over tappable elements across the project list and focus views.",
      },
      {
        kind: "fixed",
        text: "View state is preserved when the app is summoned via the global hotkey.",
      },
    ],
  },
  {
    version: "1.4.0",
    date: "2026-06-17",
    changes: [
      {
        kind: "new",
        text: "Header statistics on the project heatmap view.",
      },
      {
        kind: "new",
        text: "Automatic new tag on projects for their first ten days, removed automatically thereafter.",
      },
      {
        kind: "new",
        text: "/delete-project to remove abandoned projects from the database, cascading their rows.",
      },
      {
        kind: "new",
        text: 'Temporary Priorities list for day-scoped work outside any project, with its completions surfacing in the "today" feed.',
      },
      {
        kind: "new",
        text: "Inline slash-command suggestions in the input bar.",
      },
    ],
  },
  {
    version: "1.3.0",
    date: "2026-06-09",
    changes: [
      {
        kind: "new",
        text: "Global hotkey to summon the app from anywhere.",
      },
      {
        kind: "new",
        text: "Voice input support.",
      },
    ],
  },
  {
    version: "1.2.0",
    date: "2026-06-07",
    changes: [
      {
        kind: "new",
        text: "Open a project directly in Cursor from the task screen, and in cmux from the project focus view.",
      },
      {
        kind: "new",
        text: "/rename, /add-tag, /remove-tag, and /filter commands.",
      },
      {
        kind: "new",
        text: "Combined and per-project heatmaps reachable from the project list.",
      },
      {
        kind: "new",
        text: "Timer views with accompanying animations.",
      },
      {
        kind: "new",
        text: "GitHub repository link button.",
      },
      {
        kind: "new",
        text: "Right-click menu with a quit action.",
      },
      {
        kind: "removed",
        text: "The /archive and /bring-back commands, superseded by tagging and filtering.",
      },
      {
        kind: "fixed",
        text: "Crash when the timer's finish outline animation completed, caused by overlay windows tearing down mid-stroke.",
      },
      {
        kind: "fixed",
        text: "Heatmap view positioning, task text editing, and text overflow in task cards.",
      },
      {
        kind: "fixed",
        text: "cmux launch button target resolution.",
      },
    ],
  },
  {
    version: "1.1.0",
    date: "2026-05-26",
    title: "Initial release",
    changes: [
      {
        kind: "new",
        text: "Initial release of Trace, a menubar-only macOS 14 application for tracking projects, tasks, and work history.",
      },
      {
        kind: "new",
        text: "SQLite storage layer built on a database actor with schema migrations, over a four-table schema.",
      },
      {
        kind: "new",
        text: "Domain models for projects, tasks, journal entries, and activity, each with an observable repository store.",
      },
      {
        kind: "new",
        text: "Slash-command system — command enum, parser, and router — driving all interaction from a single input field.",
      },
      {
        kind: "new",
        text: "Project list view and a per-project kanban focus view.",
      },
      {
        kind: "new",
        text: "Secondary views: help overlay, today feed, contribution heatmap, and journal.",
      },
      {
        kind: "new",
        text: "Reusable components: command input with #project autocomplete, task cards, project rows, and an undo toast.",
      },
      {
        kind: "new",
        text: "Floating heatmap tooltip with click-to-expand day activity.",
      },
      {
        kind: "new",
        text: "Relative time formatting, task rot staging, and data export utilities.",
      },
      {
        kind: "new",
        text: "/show-all and /show-active as explicit commands rather than a single toggle.",
      },
      {
        kind: "new",
        text: "Product specification, architecture notes, feature list, build milestones, and README.",
      },
    ],
  },
];
