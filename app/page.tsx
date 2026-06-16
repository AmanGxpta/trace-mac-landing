import Image from "next/image";
import Reveal from "./components/Reveal";
import HeatmapInteractive from "./components/HeatmapInteractive";
import { buildHeatmap } from "@/lib/heatmap";

const DMG_HREF = "/downloads/Trace-0.1.0.dmg";

function DownloadIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-[15px] h-[15px]"
    >
      <path d="M12 3v12m0 0l4-4m-4 4l-4-4M5 21h14" />
    </svg>
  );
}

export default function Home() {
  const { levels, active, months } = buildHeatmap();

  return (
    <>
      <div className="glow" />

      {/* ── NAV ─────────────────────────────────────────────────────── */}
      <nav
        className="sticky top-0 z-50 backdrop-blur-[14px] saturate-120 border-b border-line"
        style={{
          background: "color-mix(in oklab, var(--bg) 72%, transparent)",
        }}
      >
        <div className="max-w-[1140px] mx-auto h-[62px] px-7 flex items-center justify-between">
          <a
            href="#top"
            className="flex items-center gap-[11px] font-mono font-semibold tracking-[-0.01em]"
          >
            <Image
              src="/trace-icon.png"
              alt="Trace"
              width={26}
              height={26}
              className="rounded-[7px]"
            />
            <span>trace</span>
            <span className="text-[11px] text-ink-faint font-medium px-[6px] py-[1px] border border-line2 rounded-[5px]">
              v0.1.0
            </span>
          </a>
          <div className="flex items-center gap-7">
            <a
              href="#commands"
              className="font-mono text-[13.5px] text-ink-dim hover:text-ink transition-colors duration-150 whitespace-nowrap hidden md:block"
            >
              Commands
            </a>
            <a
              href="#features"
              className="font-mono text-[13.5px] text-ink-dim hover:text-ink transition-colors duration-150 whitespace-nowrap hidden md:block"
            >
              Features
            </a>
            <a
              href="#dev"
              className="font-mono text-[13.5px] text-ink-dim hover:text-ink transition-colors duration-150 whitespace-nowrap hidden md:block"
            >
              Developers
            </a>
            <a
              className="font-mono text-[13.5px] font-semibold inline-flex items-center gap-[9px] px-4 py-[9px] rounded-[9px] cursor-pointer border border-transparent transition-all duration-200 bg-accent text-[#06140b] shadow-[0_0_0_1px_color-mix(in_oklab,var(--accent)_60%,transparent),0_8px_30px_-10px_color-mix(in_oklab,var(--accent)_60%,transparent)] hover:-translate-y-px whitespace-nowrap"
              href={DMG_HREF}
              download
            >
              <DownloadIcon />
              Download
            </a>
          </div>
        </div>
      </nav>

      <a id="top" />

      {/* ── HERO ────────────────────────────────────────────────────── */}
      <header className="pt-[84px] pb-[30px] text-center max-w-[1140px] mx-auto px-7">
        <span className="font-mono text-[12.5px] tracking-[.16em] uppercase text-ink-faint inline-flex items-center gap-[9px] whitespace-nowrap before:content-[''] before:w-[6px] before:h-[6px] before:rounded-full before:bg-accent before:shadow-[0_0_10px_var(--accent)]">
          macOS menubar · keyboard-driven
        </span>
        <h1 className="font-sans font-bold text-[clamp(34px,6vw,62px)] leading-[1.04] tracking-[-0.025em] max-w-[16ch] mx-auto mt-[22px] [text-wrap:balance]">
          An honest record of what you{" "}
          <em className="not-italic text-accent">actually</em> did.
        </h1>
        <p className="max-w-[58ch] mx-auto mt-6 text-[clamp(16px,2.1vw,19px)] text-ink-dim leading-[1.62] [text-wrap:pretty]">
          Trace is a menubar app for people running several projects at once.
          Log tasks and notes with slash commands in under five seconds — tag
          and filter your work, run a focus timer, jump into Cursor — and watch
          a per-project heatmap built from your real work, not your intentions.
        </p>
        <div className="flex gap-[13px] justify-center flex-wrap mt-[34px]">
          <a
            className="font-mono text-[14.5px] font-semibold inline-flex items-center gap-[9px] px-6 py-[14px] rounded-[11px] cursor-pointer border border-transparent bg-accent text-[#06140b] shadow-[0_0_0_1px_color-mix(in_oklab,var(--accent)_60%,transparent),0_8px_30px_-10px_color-mix(in_oklab,var(--accent)_60%,transparent)] hover:-translate-y-px transition-transform duration-[120ms] whitespace-nowrap"
            href={DMG_HREF}
            download
          >
            <DownloadIcon />
            Download for macOS
          </a>
          <a
            className="font-mono text-[14.5px] font-semibold inline-flex items-center gap-[9px] px-6 py-[14px] rounded-[11px] border border-line2 text-ink hover:bg-white/[0.04] hover:border-white/[0.22] transition-all duration-200 whitespace-nowrap"
            href="#commands"
          >
            See the commands
          </a>
        </div>
        <div className="mt-[18px] font-mono text-[12.5px] text-ink-faint flex gap-[10px] justify-center flex-wrap items-center">
          <span className="whitespace-nowrap">Free</span>
          <span className="w-[3px] h-[3px] rounded-full bg-ink-faint opacity-60" />
          <span className="whitespace-nowrap">macOS 14 Sonoma+</span>
          <span className="w-[3px] h-[3px] rounded-full bg-ink-faint opacity-60" />
          <span className="whitespace-nowrap">Apple Silicon &amp; Intel</span>
          <span className="w-[3px] h-[3px] rounded-full bg-ink-faint opacity-60" />
          <span className="whitespace-nowrap">.dmg · 3.3&nbsp;MB</span>
        </div>

        <Reveal className="mt-[62px] max-w-[980px] mx-auto">
          <video
            className="w-full aspect-video rounded-[16px] border border-line2 shadow-[0_40px_90px_-30px_rgba(0,0,0,.85)] bg-[#0b0d10]"
            preload="metadata"
            playsInline
            autoPlay
            muted
            loop
            aria-label="Trace app demo"
          >
            <source src="/demo.mp4" type="video/mp4" />
          </video>
        </Reveal>
      </header>

      <div className="h-10" />
      <div
        className="h-px max-w-[1140px] mx-auto"
        style={{ background: "var(--line)" }}
      />

      {/* ── COMMANDS ────────────────────────────────────────────────── */}
      <section className="py-[92px] relative" id="commands">
        <div className="max-w-[1140px] mx-auto px-7">
          <Reveal className="max-w-[64ch]">
            <span className="font-mono text-[12.5px] tracking-[.16em] uppercase text-ink-faint inline-flex items-center gap-[9px] whitespace-nowrap before:content-[''] before:w-[6px] before:h-[6px] before:rounded-full before:bg-accent before:shadow-[0_0_10px_var(--accent)]">
              The slash surface
            </span>
            <h2 className="font-sans font-bold text-[clamp(26px,3.6vw,38px)] tracking-[-0.02em] leading-[1.1] mt-4 [text-wrap:balance]">
              Everything runs through one input.
            </h2>
            <p className="mt-4 text-ink-dim text-[17px] max-w-[54ch] [text-wrap:pretty]">
              Log, organise, and navigate without a menu in sight. Project
              arguments are implicit inside a project, explicit (
              <span className="font-mono text-accent">#project</span>) from
              global — and typing <span className="font-mono">#</span>{" "}
              tab-completes project names, quotes and all.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_.95fr] gap-[54px] mt-[50px] items-start">
            {/* Command list — grouped */}
            <Reveal className="flex flex-col gap-[2px] font-mono">
              {/* Log */}
              <div className="mb-[26px]">
                <span className="font-mono text-[11px] tracking-[.15em] uppercase text-accent block mb-1 opacity-85">
                  Log — the core loop
                </span>
                <CmdItem
                  syn={
                    <>
                      <b className="text-accent font-semibold">/task</b>{" "}
                      <span className="text-ink-faint">&lt;text&gt;</span>
                    </>
                  }
                  desc="Create a pending task in the current project."
                />
                <CmdItem
                  syn={
                    <>
                      <b className="text-accent font-semibold">/done</b>{" "}
                      <span className="text-ink-faint">&lt;text&gt;</span>
                    </>
                  }
                  desc="Create and immediately complete a task. Counts as activity."
                />
                <CmdItem
                  syn={
                    <>
                      <b className="text-accent font-semibold">/log</b>{" "}
                      <span className="text-ink-faint">&lt;text&gt;</span>
                    </>
                  }
                  desc="Add a short journal entry. Counts as activity."
                />
              </div>
              {/* Organise */}
              <div className="mb-[26px]">
                <span className="font-mono text-[11px] tracking-[.15em] uppercase text-accent block mb-1 opacity-85">
                  Organise — in a project
                </span>
                <CmdItem
                  syn={
                    <>
                      <b className="text-accent font-semibold">
                        /rename-project
                      </b>{" "}
                      <span className="text-ink-faint">&lt;name&gt;</span>
                    </>
                  }
                  desc="Rename the project you're focused on."
                />
                <CmdItem
                  syn={
                    <>
                      <b className="text-accent font-semibold">/add-tag</b>{" "}
                      <span className="text-ink-faint">&lt;tag&gt;</span>
                    </>
                  }
                  desc="Tag the current project for grouping."
                />
                <CmdItem
                  syn={
                    <>
                      <b className="text-accent font-semibold">/remove-tag</b>{" "}
                      <span className="text-ink-faint">&lt;tag&gt;</span>
                    </>
                  }
                  desc="Strip a tag back off."
                />
              </div>
              {/* Navigate */}
              <div>
                <span className="font-mono text-[11px] tracking-[.15em] uppercase text-accent block mb-1 opacity-85">
                  Navigate — from global
                </span>
                <CmdItem
                  syn={
                    <>
                      <b className="text-accent font-semibold">/filter</b>{" "}
                      <span className="text-ink-faint">&lt;tag&gt;</span>
                    </>
                  }
                  desc="Show only projects with a tag. /filter alone clears it."
                />
                <CmdItem
                  syn={
                    <>
                      <b className="text-accent font-semibold">/done</b>{" "}
                      <span className="text-ink-faint">#proj &lt;text&gt;</span>
                    </>
                  }
                  desc="Target any project by name from anywhere."
                />
                <CmdItem
                  syn={
                    <>
                      <b className="text-accent font-semibold">/show-all</b>{" "}
                      <span className="text-ink-faint">· /show-active</span>
                    </>
                  }
                  desc="Fold archived projects into the list, or hide them again."
                />
                <CmdItem
                  syn={
                    <>
                      <b className="text-accent font-semibold">/help</b>
                    </>
                  }
                  desc="Show every command inline, in place."
                />
              </div>
            </Reveal>

            <Reveal>
              <div className="bg-[#0b0d10] border border-line2 rounded-[14px] shadow-[0_30px_70px_-30px_rgba(0,0,0,.8)] overflow-hidden font-mono">
                <div className="flex items-center gap-2 px-[14px] py-[11px] border-b border-line bg-white/[0.02]">
                  <span className="flex gap-[6px]">
                    <i className="w-[11px] h-[11px] rounded-full bg-[#2a2e34] block" />
                    <i className="w-[11px] h-[11px] rounded-full bg-[#2a2e34] block" />
                    <i className="w-[11px] h-[11px] rounded-full bg-[#2a2e34] block" />
                  </span>
                  <span className="text-[11.5px] text-ink-faint tracking-[.04em] whitespace-nowrap">
                    trace — #global
                  </span>
                </div>
                <div className="px-[18px] py-[18px] pb-5 text-[13px] leading-[2.05]">
                  <div className="pl-[22px] -indent-[22px] text-ink">
                    <span className="text-accent font-bold inline-block w-[22px] indent-0">
                      ›
                    </span>
                    /done #trace shipped heatmap scale
                  </div>
                  <span className="text-ink-faint pl-[22px] block">
                    <span className="text-accent">✓</span> completed · logged to{" "}
                    <span className="text-accent">#trace</span>
                  </span>
                  <div className="pl-[22px] -indent-[22px] text-ink">
                    <span className="text-accent font-bold inline-block w-[22px] indent-0">
                      ›
                    </span>
                    /add-tag swift
                  </div>
                  <span className="text-ink-faint pl-[22px] block">
                    ＃ tagged <span className="text-accent">#trace</span> ·
                    swift
                  </span>
                  <div className="pl-[22px] -indent-[22px] text-ink">
                    <span className="text-accent font-bold inline-block w-[22px] indent-0">
                      ›
                    </span>
                    /filter swift
                  </div>
                  <span className="text-ink-faint pl-[22px] block">
                    ⊟ filtered list · 3 projects tagged{" "}
                    <span className="text-accent">swift</span>
                  </span>
                  <div className="pl-[22px] -indent-[22px] text-ink">
                    <span className="text-accent font-bold inline-block w-[22px] indent-0">
                      ›
                    </span>
                    /log shipped it yesterday
                  </div>
                  <span
                    className="pl-[22px] block"
                    style={{ color: "#e06c6c" }}
                  >
                    ✕ no project in scope — name one first
                  </span>
                </div>
              </div>
              <p
                className="mt-[22px] font-mono text-[13px] text-ink-faint pl-4 border-l-2 leading-[1.7]"
                style={{
                  borderColor:
                    "color-mix(in oklab, var(--accent) 55%, transparent)",
                }}
              >
                <b className="text-ink-dim font-medium">
                  Explicit over magical.
                </b>{" "}
                Typos produce errors, not autocorrect. From global you always
                name the project. Archiving is no longer a command — flip the{" "}
                <span className="font-mono">Active</span> toggle in the project
                header instead.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <div
        className="h-px max-w-[1140px] mx-auto"
        style={{ background: "var(--line)" }}
      />

      {/* ── HEATMAP ─────────────────────────────────────────────────── */}
      <section className="py-[92px] relative" id="heatmap">
        <div className="max-w-[1140px] mx-auto px-7">
          <Reveal className="max-w-[64ch]">
            <span className="font-mono text-[12.5px] tracking-[.16em] uppercase text-ink-faint inline-flex items-center gap-[9px] whitespace-nowrap before:content-[''] before:w-[6px] before:h-[6px] before:rounded-full before:bg-accent before:shadow-[0_0_10px_var(--accent)]">
              Honest by construction
            </span>
            <h2 className="font-sans font-bold text-[clamp(26px,3.6vw,38px)] tracking-[-0.02em] leading-[1.1] mt-4 [text-wrap:balance]">
              The heatmap reflects real work — and it can&apos;t be edited into
              a lie.
            </h2>
            <p className="mt-4 text-ink-dim text-[17px] max-w-[54ch] [text-wrap:pretty]">
              Every project gets a GitHub-style heatmap, from the day you
              created it to today. Only completions and journal entries count —
              creating a task does not — and once an activity is more than 24
              hours old it&apos;s immutable. Click any day to see exactly what
              you logged.{" "}
              <span className="text-ink-faint">(Try it below.)</span>
            </p>
          </Reveal>

          <Reveal
            className="mt-[48px] rounded-[18px] border border-line2 p-[30px] pb-[26px] shadow-[0_30px_80px_-40px_rgba(0,0,0,.7)]"
            style={{
              background: "linear-gradient(180deg,var(--panel-2),var(--panel))",
            }}
          >
            <HeatmapInteractive
              levels={levels}
              active={active}
              months={months}
            />
          </Reveal>

          <p
            className="mt-[22px] font-mono text-[13px] text-ink-faint pl-4 border-l-2 leading-[1.7]"
            style={{
              borderColor:
                "color-mix(in oklab, var(--accent) 55%, transparent)",
            }}
          >
            <b className="text-ink-dim font-medium">Zoom out, too.</b> From the
            project list, open the <span className="font-mono">Combined</span>{" "}
            view — one heatmap fused across every visible project, with each
            project&apos;s own map stacked below. It respects your current
            filter: active-only, tag-filtered, or all.
          </p>
        </div>
      </section>

      <div
        className="h-px max-w-[1140px] mx-auto"
        style={{ background: "var(--line)" }}
      />

      {/* ── CAPABILITIES ────────────────────────────────────────────── */}
      <section className="py-[92px] relative" id="features">
        <div className="max-w-[1140px] mx-auto px-7">
          <Reveal className="max-w-[64ch]">
            <span className="font-mono text-[12.5px] tracking-[.16em] uppercase text-ink-faint inline-flex items-center gap-[9px] whitespace-nowrap before:content-[''] before:w-[6px] before:h-[6px] before:rounded-full before:bg-accent before:shadow-[0_0_10px_var(--accent)]">
              What&apos;s inside
            </span>
            <h2 className="font-sans font-bold text-[clamp(26px,3.6vw,38px)] tracking-[-0.02em] leading-[1.1] mt-4 [text-wrap:balance]">
              Small surface. More range than it looks.
            </h2>
            <p className="mt-4 text-ink-dim text-[17px] max-w-[54ch] [text-wrap:pretty]">
              Every addition extends the core loop without bending the
              honest-record philosophy. Nothing nags, nothing syncs, nothing
              phones home.
            </p>
          </Reveal>

          <Reveal
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px mt-[50px] rounded-[16px] overflow-hidden border border-line"
            style={{ background: "var(--line)" }}
          >
            <CapCard
              icon={
                <>
                  <path d="M20.6 13.4l-7.2 7.2a2 2 0 0 1-2.8 0l-6.6-6.6A2 2 0 0 1 3.4 12.6V5a2 2 0 0 1 2-2h7.2a2 2 0 0 1 1.4.6l6.6 6.6a2 2 0 0 1 0 2.8z" />
                  <circle cx="7.8" cy="7.8" r="1.1" />
                </>
              }
              title="Tags &amp; filtering"
              desc={
                <>
                  Tag any project, then{" "}
                  <span className="font-mono text-accent">/filter swift</span>{" "}
                  narrows the list — and the heatmaps — to what matches.{" "}
                  <span className="font-mono">/filter</span> clears it.
                </>
              }
            />
            <CapCard
              icon={<path d="M5 3l13 6.5-5.5 1.8L11 17 5 3z" />}
              title="Click a day, see the receipts"
              desc="Every heatmap cell is clickable. Open a day to see exactly which tasks you completed and which notes you wrote — and when."
            />
            <CapCard
              icon={
                <>
                  <path d="M12 3l9 4.5-9 4.5-9-4.5L12 3z" />
                  <path d="M3 12l9 4.5 9-4.5" />
                  <path d="M3 16.5L12 21l9-4.5" />
                </>
              }
              title="Combined view across projects"
              desc="Fuse every visible project into one heatmap, with individual maps stacked below. See where all your attention went at a glance."
            />
            <CapCard
              icon={
                <>
                  <circle cx="12" cy="13.5" r="7.5" />
                  <path d="M12 13.5V9.5" />
                  <path d="M9.5 2.5h5" />
                </>
              }
              title="Focus timers, in the menubar"
              desc="Start a Pomodoro tile and the countdown lives in your menubar. When it ends, a green outline sweeps the screen edge — no popup, no sound."
            />
            <CapCard
              icon={
                <>
                  <path d="M8 6h12M8 12h12M8 18h8" />
                  <path d="M3.5 6h.01M3.5 12h.01M3.5 18h.01" />
                </>
              }
              title="Tasks that age &amp; reorder"
              desc="Drag to reorder, double-click to edit inline. Unfinished tasks fade from fresh to aging to rotting — neglect is visible, not hidden."
            />
            <CapCard
              icon={
                <>
                  <ellipse cx="12" cy="5.5" rx="7.5" ry="3" />
                  <path d="M4.5 5.5v6c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3v-6" />
                  <path d="M4.5 11.5v6c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3v-6" />
                </>
              }
              title="Fully local, SQLite-backed"
              desc="Every byte lives in one SQLite file on your machine. No account, no sync, no network calls for logging. Menubar-only — no Dock icon."
            />
          </Reveal>
        </div>
      </section>

      <div
        className="h-px max-w-[1140px] mx-auto"
        style={{ background: "var(--line)" }}
      />

      {/* ── DEVELOPER BAND ──────────────────────────────────────────── */}
      <section className="py-[92px] relative" id="dev">
        <div className="max-w-[1140px] mx-auto px-7">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.05fr] gap-[54px] items-center">
            <Reveal>
              <span className="font-mono text-[12.5px] tracking-[.16em] uppercase text-ink-faint inline-flex items-center gap-[9px] whitespace-nowrap before:content-[''] before:w-[6px] before:h-[6px] before:rounded-full before:bg-accent before:shadow-[0_0_10px_var(--accent)]">
                Built for developers
              </span>
              <h2 className="font-sans font-bold text-[clamp(26px,3.6vw,38px)] tracking-[-0.02em] leading-[1.1] mt-4 [text-wrap:balance]">
                Jump into the work without leaving the record.
              </h2>
              <p className="text-ink-dim text-[17px] mt-4 max-w-[46ch] [text-wrap:pretty]">
                Link a project to a folder once. From then on, the tools you
                already live in are one click from the log.
              </p>
              <div className="flex flex-col gap-[18px] mt-[26px]">
                <DevListItem
                  icon={
                    <>
                      <path d="M4 6l8-3 8 3v10l-8 3-8-3z" />
                      <path d="M12 3v18M4 6l8 3 8-3" />
                    </>
                  }
                  title="Open in Cursor"
                  desc="Launch the linked folder straight into your editor."
                />
                <DevListItem
                  icon={
                    <>
                      <rect x="3" y="4" width="18" height="16" rx="2" />
                      <path d="M7 9l3 3-3 3M13 15h4" />
                    </>
                  }
                  title="Open in cmux"
                  desc="Drop into a named workspace when socket access allows."
                />
                <DevListItem
                  icon={
                    <>
                      <circle cx="6" cy="6" r="2.5" />
                      <circle cx="6" cy="18" r="2.5" />
                      <circle cx="18" cy="8" r="2.5" />
                      <path d="M6 8.5v7M18 10.5c0 4-6 2-6 6" />
                    </>
                  }
                  title="Open the repo"
                  desc={
                    <>
                      Resolves{" "}
                      <code className="font-mono text-[12.5px] text-accent">
                        git origin
                      </code>{" "}
                      and opens it in your browser of choice.
                    </>
                  }
                />
                <DevListItem
                  icon={
                    <>
                      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <path d="M10 13h4" />
                    </>
                  }
                  title="Link once, reuse forever"
                  desc="A per-project folder path, stored locally. One step toward auto-logging — never a sync."
                />
              </div>
            </Reveal>

            <Reveal>
              {/* Focus card mockup */}
              <div
                className="rounded-[16px] border border-line2 overflow-hidden shadow-[0_30px_70px_-34px_rgba(0,0,0,.8)]"
                style={{
                  background:
                    "linear-gradient(180deg,var(--panel-2),var(--panel))",
                }}
              >
                <div className="flex items-center justify-between gap-[14px] px-[17px] py-4 border-b border-line flex-wrap">
                  <div className="font-mono text-[14px] text-ink flex items-center gap-[9px]">
                    <span className="w-[9px] h-[9px] rounded-full bg-accent shadow-[0_0_9px_var(--accent)]" />
                    trace
                    <span className="text-[11px] text-ink-faint">
                      swift · menubar
                    </span>
                  </div>
                  <span
                    className="font-mono text-[11px] text-accent inline-flex items-center gap-[7px] border rounded-[20px] px-[10px] py-[3px] pl-2"
                    style={{
                      borderColor:
                        "color-mix(in oklab,var(--accent) 32%,transparent)",
                      background:
                        "color-mix(in oklab,var(--accent) 10%,transparent)",
                    }}
                  >
                    <span className="w-2 h-2 rounded-full bg-accent" />
                    Active
                  </span>
                </div>
                <div className="flex gap-2 px-[17px] py-[13px] border-b border-line flex-wrap">
                  <DevBtn
                    icon={
                      <>
                        <path d="M4 6l8-3 8 3v10l-8 3-8-3z" />
                        <path d="M12 3v18" />
                      </>
                    }
                    label="Cursor"
                  />
                  <DevBtn
                    icon={
                      <>
                        <rect x="3" y="4" width="18" height="16" rx="2" />
                        <path d="M7 9l3 3-3 3" />
                      </>
                    }
                    label="cmux"
                  />
                  <DevBtn
                    icon={
                      <>
                        <circle cx="6" cy="6" r="2.2" />
                        <circle cx="6" cy="18" r="2.2" />
                        <circle cx="18" cy="8" r="2.2" />
                        <path d="M6 8.2v7.6M18 10.2c0 4-6 2-6 5.8" />
                      </>
                    }
                    label="GitHub"
                  />
                </div>
                <div className="p-3 flex flex-col gap-[3px]">
                  <FocusTask
                    state="fresh"
                    text="wire keyboard nav into the kanban"
                    age="2h"
                  />
                  <FocusTask
                    state="aging"
                    text="add the export menu item"
                    age="6d"
                  />
                  <FocusTask
                    state="rotting"
                    text="investigate the SQLite vacuum"
                    age="3w"
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <div
        className="h-px max-w-[1140px] mx-auto"
        style={{ background: "var(--line)" }}
      />

      {/* ── WHY IT EXISTS ────────────────────────────────────────────── */}
      <section className="py-[92px] relative">
        <div className="max-w-[1140px] mx-auto px-7">
          <Reveal className="max-w-[64ch]">
            <span className="font-mono text-[12.5px] tracking-[.16em] uppercase text-ink-faint inline-flex items-center gap-[9px] whitespace-nowrap before:content-[''] before:w-[6px] before:h-[6px] before:rounded-full before:bg-accent before:shadow-[0_0_10px_var(--accent)]">
              Why it exists
            </span>
            <h2 className="font-sans font-bold text-[clamp(26px,3.6vw,38px)] tracking-[-0.02em] leading-[1.1] mt-4 [text-wrap:balance]">
              Four problems no planner solves.
            </h2>
          </Reveal>
          <Reveal
            className="grid grid-cols-1 md:grid-cols-2 gap-px mt-[50px] rounded-[16px] overflow-hidden border border-line"
            style={{ background: "var(--line)" }}
          >
            <FeatCard
              num="01"
              title={
                <>
                  &ldquo;What did I{" "}
                  <span className="text-accent">actually</span> do?&rdquo;
                </>
              }
              desc="Notion and Linear answer what needs to be done. Neither answers what you've been doing. Across several projects, that question gets very hard to answer honestly without a record."
            />
            <FeatCard
              num="02"
              title="Journaling without the friction"
              desc="Most journaling apps make you context-switch into &ldquo;journaling mode.&rdquo; A menubar app with slash commands lets you log a thought in under five seconds — without ever leaving the work."
            />
            <FeatCard
              num="03"
              title="The neglect problem"
              desc="When you run five projects, one of them is being quietly starved of attention. The heatmap makes that visible — shown as days since you last logged, stated neutrally, never as a nag."
            />
            <FeatCard
              num="04"
              title="An honest record"
              desc="Most tools let you check things off before you do them, then edit history. Trace grounds everything in activity events, and locks them after 24 hours. The record stays honest because it can't be rewritten."
            />
          </Reveal>
        </div>
      </section>

      <div
        className="h-px max-w-[1140px] mx-auto"
        style={{ background: "var(--line)" }}
      />

      {/* ── DELIBERATELY NOT ────────────────────────────────────────── */}
      <section className="py-[92px] relative" id="not">
        <div className="max-w-[1140px] mx-auto px-7">
          <Reveal className="max-w-[64ch]">
            <span className="font-mono text-[12.5px] tracking-[.16em] uppercase text-ink-faint inline-flex items-center gap-[9px] whitespace-nowrap before:content-[''] before:w-[6px] before:h-[6px] before:rounded-full before:bg-accent before:shadow-[0_0_10px_var(--accent)]">
              Deliberately not
            </span>
            <h2 className="font-sans font-bold text-[clamp(26px,3.6vw,38px)] tracking-[-0.02em] leading-[1.1] mt-4 [text-wrap:balance]">
              What Trace refuses to be.
            </h2>
            <p className="mt-4 text-ink-dim text-[17px] max-w-[54ch] [text-wrap:pretty]">
              The discipline is the product. Every &ldquo;no&rdquo; below is a
              decision, not a missing feature.
            </p>
          </Reveal>
          <Reveal className="flex flex-wrap gap-3 mt-[46px]">
            {[
              ["Not a", "planner"],
              ["Not a", "team tool"],
              ["Not a", "knowledge base"],
              ["Not", "gamified"],
              ["Not", "AI-powered"],
              ["No", "accounts or sync"],
            ].map(([prefix, struck]) => (
              <div
                key={struck}
                className="font-mono text-[15px] inline-flex items-center gap-3 px-5 py-[14px] border border-line rounded-[11px] text-ink-dim"
                style={{ background: "var(--bg-2)" }}
              >
                <span
                  className="font-bold text-[16px]"
                  style={{ color: "#e06c6c" }}
                >
                  ✕
                </span>
                {prefix}{" "}
                <s className="[text-decoration-color:rgba(224,108,108,.5)] text-ink-faint">
                  {struck}
                </s>
              </div>
            ))}
          </Reveal>
          <p className="mt-[26px] text-[15px] text-ink-dim max-w-[60ch] [text-wrap:pretty]">
            No due dates, no reminders, no streaks-as-achievements. One person,
            one machine, one SQLite file. Phase 0 ships zero AI features — the
            loop gets proven before anything clever is added.
          </p>
        </div>
      </section>

      <div
        className="h-px max-w-[1140px] mx-auto"
        style={{ background: "var(--line)" }}
      />

      {/* ── PRINCIPLES ──────────────────────────────────────────────── */}
      <section className="py-[92px] relative">
        <div className="max-w-[1140px] mx-auto px-7">
          <Reveal className="max-w-[64ch]">
            <span className="font-mono text-[12.5px] tracking-[.16em] uppercase text-ink-faint inline-flex items-center gap-[9px] whitespace-nowrap before:content-[''] before:w-[6px] before:h-[6px] before:rounded-full before:bg-accent before:shadow-[0_0_10px_var(--accent)]">
              Design principles
            </span>
            <h2 className="font-sans font-bold text-[clamp(26px,3.6vw,38px)] tracking-[-0.02em] leading-[1.1] mt-4 [text-wrap:balance]">
              How every decision gets made.
            </h2>
          </Reveal>
          <Reveal className="grid grid-cols-1 md:grid-cols-3 gap-[34px] mt-[50px]">
            <div>
              <span className="font-mono text-[13px] text-accent">01</span>
              <h4 className="font-sans font-semibold text-[18px] mt-[14px] leading-[1.3] tracking-[-0.01em]">
                Frictionless logging beats every other feature.
              </h4>
              <p className="mt-[10px] text-ink-dim text-[14px] leading-[1.6]">
                One shortcut, one short string, Enter. If logging takes more
                than that, the tool has failed. This overrides every other
                consideration.
              </p>
            </div>
            <div>
              <span className="font-mono text-[13px] text-accent">02</span>
              <h4 className="font-sans font-semibold text-[18px] mt-[14px] leading-[1.3] tracking-[-0.01em]">
                The tool does not act on you; you act on it.
              </h4>
              <p className="mt-[10px] text-ink-dim text-[14px] leading-[1.6]">
                No notifications, no nags, no badge on the menubar icon — only a
                timer countdown while you&apos;ve chosen to run one. You open
                the app. The app never opens you.
              </p>
            </div>
            <div>
              <span className="font-mono text-[13px] text-accent">03</span>
              <h4 className="font-sans font-semibold text-[18px] mt-[14px] leading-[1.3] tracking-[-0.01em]">
                Asymmetric friction matches asymmetric importance.
              </h4>
              <p className="mt-[10px] text-ink-dim text-[14px] leading-[1.6]">
                Tasks are cheap to delete. Journal entries require confirmation.
                Archiving is a quiet toggle in the project header; permanent
                deletion doesn&apos;t exist.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FINAL CTA ───────────────────────────────────────────────── */}
      <section className="pt-[104px] text-center">
        <Reveal className="max-w-[1140px] mx-auto px-7">
          <Image
            className="w-[84px] h-[84px] rounded-[20px] mx-auto mb-[26px] block shadow-[0_24px_60px_-20px_color-mix(in_oklab,var(--accent)_45%,transparent)]"
            src="/trace-icon.png"
            alt="Trace"
            width={84}
            height={84}
          />
          <h2 className="font-sans font-bold text-[clamp(30px,5vw,50px)] tracking-[-0.025em] leading-[1.06] [text-wrap:balance] max-w-[18ch] mx-auto">
            Start keeping an honest record.
          </h2>
          <p className="mt-5 mx-auto text-ink-dim max-w-[50ch] text-[17px]">
            Download Trace, drag it to Applications, and log your first{" "}
            <span className="text-accent font-mono">/done</span> in the next
            five seconds.
          </p>
          <div className="flex gap-[13px] justify-center flex-wrap mt-8">
            <a
              className="font-mono text-[14.5px] font-semibold inline-flex items-center gap-[9px] px-6 py-[14px] rounded-[11px] border border-transparent bg-accent text-[#06140b] shadow-[0_0_0_1px_color-mix(in_oklab,var(--accent)_60%,transparent),0_8px_30px_-10px_color-mix(in_oklab,var(--accent)_60%,transparent)] hover:-translate-y-px transition-transform duration-[120ms] whitespace-nowrap"
              href={DMG_HREF}
              download
            >
              <DownloadIcon />
              Download for macOS
            </a>
            <a
              className="font-mono text-[14.5px] font-semibold inline-flex items-center gap-[9px] px-6 py-[14px] rounded-[11px] border border-line2 text-ink hover:bg-white/[0.04] hover:border-white/[0.22] transition-all duration-200 whitespace-nowrap"
              href="#top"
            >
              Back to top
            </a>
          </div>
          <div className="mt-[22px] font-mono text-[12.5px] text-ink-faint flex gap-[10px] justify-center flex-wrap items-center">
            <span className="whitespace-nowrap">macOS 14 Sonoma or later</span>
            <span className="w-[3px] h-[3px] rounded-full bg-ink-faint opacity-60" />
            <span className="whitespace-nowrap">
              Universal · Apple Silicon &amp; Intel
            </span>
            <span className="w-[3px] h-[3px] rounded-full bg-ink-faint opacity-60" />
            <span className="whitespace-nowrap">No account required</span>
          </div>
        </Reveal>

        <footer className="mt-24 border-t border-line pt-9 pb-[60px]">
          <div className="max-w-[1140px] mx-auto px-7 flex items-center justify-between gap-5 flex-wrap font-mono text-[12.5px] text-ink-faint">
            <div className="flex items-center gap-[9px] text-ink-dim whitespace-nowrap">
              <Image
                src="/trace-icon.png"
                alt=""
                width={20}
                height={20}
                className="rounded-[6px]"
              />
              <span>Trace — v0.1.0 · Phase 0</span>
            </div>
            <div className="flex gap-6 flex-wrap">
              <a
                href="#commands"
                className="whitespace-nowrap hover:text-ink transition-colors"
              >
                Commands
              </a>
              <a
                href="#features"
                className="whitespace-nowrap hover:text-ink transition-colors"
              >
                Features
              </a>
              <a
                href="#dev"
                className="whitespace-nowrap hover:text-ink transition-colors"
              >
                Developers
              </a>
              <a
                href={DMG_HREF}
                download
                className="whitespace-nowrap hover:text-ink transition-colors"
              >
                Download .dmg
              </a>
              <a
                href="#top"
                className="whitespace-nowrap hover:text-ink transition-colors"
              >
                Top
              </a>
            </div>
          </div>
        </footer>
      </section>
    </>
  );
}

/* ── Small reusable sub-components ─────────────────────────────────── */

function CmdItem({
  syn,
  desc,
}: {
  syn: React.ReactNode;
  desc: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[170px_1fr] gap-[18px] items-baseline px-1 py-[13px] border-b border-line">
      <span className="text-ink text-[14px] font-medium">{syn}</span>
      <span className="text-ink-dim text-[13px] font-sans">{desc}</span>
    </div>
  );
}

function CapCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: React.ReactNode;
  desc: React.ReactNode;
}) {
  return (
    <div
      className="p-[30px] pb-8 transition-colors duration-200 hover:bg-panel"
      style={{ background: "var(--bg-2)" }}
    >
      <div
        className="w-9 h-9 rounded-[10px] flex items-center justify-center border"
        style={{
          borderColor: "color-mix(in oklab,var(--accent) 28%,transparent)",
          background: "color-mix(in oklab,var(--accent) 9%,transparent)",
          color: "var(--accent)",
        }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-[18px] h-[18px]"
        >
          {icon}
        </svg>
      </div>
      <h3 className="font-sans font-semibold text-[16.5px] mt-[18px] tracking-[-0.01em] leading-[1.25]">
        {title}
      </h3>
      <p className="mt-[9px] text-ink-dim text-[13.5px] leading-[1.55] [text-wrap:pretty]">
        {desc}
      </p>
    </div>
  );
}

function DevListItem({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[auto_1fr] gap-[15px] items-start">
      <div className="w-8 h-8 rounded-[9px] flex-none flex items-center justify-center border border-line2 text-ink bg-white/[0.03]">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4"
        >
          {icon}
        </svg>
      </div>
      <div>
        <h4 className="font-sans font-semibold text-[15.5px] tracking-[-0.01em]">
          {title}
        </h4>
        <p className="mt-1 text-ink-dim text-[13.5px] leading-[1.5]">{desc}</p>
      </div>
    </div>
  );
}

function DevBtn({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="font-mono text-[12px] text-ink-dim inline-flex items-center gap-[7px] px-3 py-[7px] border border-line2 rounded-[9px] bg-white/[0.02] cursor-pointer hover:text-ink hover:border-white/[0.24] hover:bg-white/[0.05] transition-all duration-150">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-[14px] h-[14px]"
      >
        {icon}
      </svg>
      {label}
    </span>
  );
}

function FocusTask({
  state,
  text,
  age,
}: {
  state: "fresh" | "aging" | "rotting";
  text: string;
  age: string;
}) {
  const stateStyles = {
    fresh: {
      row: "",
      txt: "text-ink",
      age: "text-accent",
      ageBg: "color-mix(in oklab,var(--accent) 12%,transparent)",
    },
    aging: {
      row: "opacity-[0.82]",
      txt: "text-ink-dim",
      age: "text-[#e0a23c]",
      ageBg: "rgba(224,162,60,.12)",
    },
    rotting: {
      row: "opacity-55",
      txt: "text-ink-faint line-through decoration-[rgba(224,108,108,.4)]",
      age: "text-[#e06c6c]",
      ageBg: "rgba(224,108,108,.12)",
    },
  };
  const s = stateStyles[state];
  return (
    <div
      className={`grid grid-cols-[auto_1fr_auto] gap-[11px] items-center px-[9px] py-[9px] rounded-[9px] text-[13.5px] ${s.row}`}
    >
      <span className="w-[15px] h-[15px] rounded-[4px] border-[1.5px] border-ink-faint" />
      <span className={s.txt}>{text}</span>
      <span
        className={`font-mono text-[10.5px] px-[7px] py-[1px] rounded-[5px] whitespace-nowrap ${s.age}`}
        style={{ background: s.ageBg }}
      >
        {age}
      </span>
    </div>
  );
}

function FeatCard({
  num,
  title,
  desc,
}: {
  num: string;
  title: React.ReactNode;
  desc: string;
}) {
  return (
    <div
      className="p-[34px] px-8 transition-colors duration-200 hover:bg-panel"
      style={{ background: "var(--bg-2)" }}
    >
      <span className="font-mono text-[12px] text-ink-faint tracking-[.1em]">
        {num}
      </span>
      <h3 className="font-sans font-semibold text-[20px] tracking-[-0.01em] mt-[18px] leading-[1.25]">
        {title}
      </h3>
      <p className="mt-3 text-ink-dim text-[14.5px] leading-[1.6] [text-wrap:pretty]">
        {desc}
      </p>
    </div>
  );
}
