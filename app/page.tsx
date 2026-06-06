import Image from "next/image";
import HeroMockup from "./components/HeroMockup";
import Reveal from "./components/Reveal";
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

      {/* NAV */}
      <nav>
        <div className="nav-inner">
          <a className="brand" href="#top">
            <Image src="/trace-icon.png" alt="Trace" width={26} height={26} />
            <span>trace</span>
            <span className="v">v0.1.0</span>
          </a>
          <div className="nav-links">
            <a href="#commands">Commands</a>
            <a href="#heatmap">The heatmap</a>
            <a href="#not">What it isn&apos;t</a>
            <a className="btn btn-primary" href={DMG_HREF} download>
              <DownloadIcon />
              Download
            </a>
          </div>
        </div>
      </nav>

      <a id="top" />

      {/* HERO */}
      <header className="hero wrap">
        <span className="eyebrow">macOS menubar · keyboard-driven</span>
        <h1>
          An honest record of what you <em>actually</em> did.
        </h1>
        <p className="sub">
          Trace is a menubar app for people running several projects at once.
          Log tasks and notes with slash commands in under five seconds — then
          watch a per-project heatmap built from your real work, not your
          intentions.
        </p>
        <div className="cta-row">
          <a className="btn btn-primary btn-lg" href={DMG_HREF} download>
            <DownloadIcon />
            Download for macOS
          </a>
          <a className="btn btn-ghost btn-lg" href="#commands">
            See the commands
          </a>
        </div>
        <div className="meta-line">
          <span>Free</span>
          <span className="sep" />
          <span>macOS 13+</span>
          <span className="sep" />
          <span>Apple Silicon &amp; Intel</span>
          <span className="sep" />
          <span>.dmg · 8{" "}MB</span>
        </div>

        {/* APP MOCKUP */}
        <HeroMockup />
      </header>

      <div style={{ height: 40 }} />
      <div className="rule" />

      {/* COMMANDS */}
      <section className="sec" id="commands">
        <div className="wrap">
          <Reveal className="sec-head">
            <span className="eyebrow">The slash surface</span>
            <h2>Five verbs. Two utilities. One rule.</h2>
            <p>
              Project arguments are implicit when you&apos;re inside a project,
              explicit when you&apos;re working from global. No menus, no mouse,
              no mode-switching into &ldquo;journaling mode.&rdquo;
            </p>
          </Reveal>

          <div className="cmd-grid">
            <Reveal className="cmd-list">
              <div className="cmd-item">
                <span className="syn">
                  <b>/task</b> <span className="arg">&lt;text&gt;</span>
                </span>
                <span className="desc">
                  Create a pending task in the current project.
                </span>
              </div>
              <div className="cmd-item">
                <span className="syn">
                  <b>/done</b> <span className="arg">&lt;text&gt;</span>
                </span>
                <span className="desc">
                  Create and immediately complete a task. Counts as activity.
                </span>
              </div>
              <div className="cmd-item">
                <span className="syn">
                  <b>/log</b> <span className="arg">&lt;text&gt;</span>
                </span>
                <span className="desc">
                  Add a short journal entry. Counts as activity.
                </span>
              </div>
              <div className="cmd-item">
                <span className="syn">
                  <b>/archive</b>
                </span>
                <span className="desc">
                  Archive the current project out of the active list.
                </span>
              </div>
              <div className="cmd-item">
                <span className="syn">
                  <b>/bring-back</b>
                </span>
                <span className="desc">
                  Restore a project from the archived view.
                </span>
              </div>
              <div className="cmd-item">
                <span className="syn">
                  <b>/log</b> <span className="arg">#proj &lt;text&gt;</span>
                </span>
                <span className="desc">
                  Target any project by name from the global context.
                </span>
              </div>
              <div className="cmd-item">
                <span className="syn">
                  <b>/show-all</b>
                </span>
                <span className="desc">
                  Toggle archived projects into the list view.
                </span>
              </div>
              <div className="cmd-item">
                <span className="syn">
                  <b>/help</b>
                </span>
                <span className="desc">Show every command inline, in place.</span>
              </div>
            </Reveal>

            <Reveal>
              <div className="terminal">
                <div className="term-bar">
                  <span className="dots">
                    <i />
                    <i />
                    <i />
                  </span>
                  <span className="title">trace — #global</span>
                </div>
                <div className="term-body">
                  <div className="ln">
                    <span className="pr">›</span>/done #trace shipped heatmap
                    scale
                  </div>
                  <div className="out">
                    <span className="ok">✓</span> completed · logged to{" "}
                    <span className="ok">#trace</span>
                  </div>
                  <div className="ln">
                    <span className="pr">›</span>/log #llm-evals harness flaky on
                    retries
                  </div>
                  <div className="out">
                    <span className="vio">✎</span> entry saved ·{" "}
                    <span className="vio">#llm-evals</span>
                  </div>
                  <div className="ln">
                    <span className="pr">›</span>/task #field-notes draft week-7
                    summary
                  </div>
                  <div className="out">
                    ＋ pending task{" "}
                    <span style={{ color: "var(--ink-faint)" }}>
                      · not activity until /done
                    </span>
                  </div>
                  <div className="ln">
                    <span className="pr">›</span>/log shipped it yesterday
                  </div>
                  <div className="out" style={{ color: "#e06c6c" }}>
                    ✕ no project in scope — name one first
                  </div>
                </div>
              </div>
              <p className="cmd-note">
                <b>Explicit over magical.</b> Typos produce errors, not
                autocorrect. From global, you always name the project. The
                mental model is a small CLI for personal work.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <div className="rule" />

      {/* HEATMAP */}
      <section className="sec" id="heatmap">
        <div className="wrap">
          <Reveal className="sec-head">
            <span className="eyebrow">Honest by construction</span>
            <h2>
              The heatmap reflects real work — and it can&apos;t be edited into a
              lie.
            </h2>
            <p>
              Only completions and journal entries count as activity. Creating a
              task does not. And once an activity is more than 24 hours old,
              it&apos;s immutable — you can&apos;t backfill a green square you
              didn&apos;t earn.
            </p>
          </Reveal>

          <Reveal className="heat-wrap">
            <div className="heat-top">
              <div className="pname">
                <span className="dot" />
                #trace
              </div>
              <div className="stat">
                <b>{active}</b> active days in the last 26 weeks · last logged{" "}
                <b>2m ago</b>
              </div>
            </div>
            <div className="cal">
              <div className="cal-days">
                <span />
                <span>Mon</span>
                <span />
                <span>Wed</span>
                <span />
                <span>Fri</span>
                <span />
              </div>
              <div className="cal-main">
                <div className="cal-months">
                  {months.map((m, i) => (
                    <span key={i} style={{ width: `${17 * m.w}px` }}>
                      {m.name}
                    </span>
                  ))}
                </div>
                <div className="hm">
                  {levels.flatMap((week, w) =>
                    week.map((lvl, d) => (
                      <span key={`${w}-${d}`} className="cell" data-l={lvl} />
                    )),
                  )}
                </div>
              </div>
            </div>
            <div className="heat-legend">
              <span>Less</span>
              <span className="scale">
                <span className="cell" data-l="0" />
                <span className="cell" data-l="1" />
                <span className="cell" data-l="2" />
                <span className="cell" data-l="3" />
                <span className="cell" data-l="4" />
              </span>
              <span>More</span>
              <span style={{ marginLeft: "auto" }}>
                Task creation is not shown — only what you finished or wrote.
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="rule" />

      {/* FEATURES */}
      <section className="sec">
        <div className="wrap">
          <Reveal className="sec-head">
            <span className="eyebrow">Why it exists</span>
            <h2>Four problems no planner solves.</h2>
          </Reveal>
          <Reveal className="feat-grid">
            <div className="feat">
              <span className="ix">01</span>
              <h3>
                &ldquo;What did I <span className="accent">actually</span>{" "}
                do?&rdquo;
              </h3>
              <p>
                Notion and Linear answer what needs to be done. Neither answers
                what you&apos;ve been doing. Across several projects, that
                question gets very hard to answer honestly without a record.
              </p>
            </div>
            <div className="feat">
              <span className="ix">02</span>
              <h3>Journaling without the friction</h3>
              <p>
                Most journaling apps make you context-switch into
                &ldquo;journaling mode.&rdquo; A menubar app with slash commands
                lets you log a thought in under five seconds — without ever
                leaving the work.
              </p>
            </div>
            <div className="feat">
              <span className="ix">03</span>
              <h3>The neglect problem</h3>
              <p>
                When you run five projects, one of them is being quietly starved
                of attention. The heatmap makes that visible — shown as days
                since you last logged, stated neutrally, never as a nag.
              </p>
            </div>
            <div className="feat">
              <span className="ix">04</span>
              <h3>An honest record</h3>
              <p>
                Most tools let you check things off before you do them, then
                edit history. Trace grounds everything in activity events, and
                locks them after 24 hours. The record stays honest because it
                can&apos;t be rewritten.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="rule" />

      {/* DELIBERATELY NOT */}
      <section className="sec" id="not">
        <div className="wrap">
          <Reveal className="sec-head">
            <span className="eyebrow">Deliberately not</span>
            <h2>What Trace refuses to be.</h2>
            <p>
              The discipline is the product. Every &ldquo;no&rdquo; below is a
              decision, not a missing feature.
            </p>
          </Reveal>
          <Reveal className="not-grid">
            <div className="not">
              <span className="x">✕</span> Not a <s>planner</s>
            </div>
            <div className="not">
              <span className="x">✕</span> Not a <s>team tool</s>
            </div>
            <div className="not">
              <span className="x">✕</span> Not a <s>knowledge base</s>
            </div>
            <div className="not">
              <span className="x">✕</span> Not <s>gamified</s>
            </div>
            <div className="not">
              <span className="x">✕</span> Not <s>AI-powered</s>
            </div>
            <div className="not">
              <span className="x">✕</span> No <s>accounts or sync</s>
            </div>
          </Reveal>
          <p className="not-sub">
            No due dates, no reminders, no streaks-as-achievements. Single user,
            single machine, local storage. Phase 0 ships zero AI features — the
            loop gets proven before anything clever is added.
          </p>
        </div>
      </section>

      <div className="rule" />

      {/* PRINCIPLES */}
      <section className="sec">
        <div className="wrap">
          <Reveal className="sec-head">
            <span className="eyebrow">Design principles</span>
            <h2>How every decision gets made.</h2>
          </Reveal>
          <Reveal className="prin-grid">
            <div className="prin">
              <span className="n">01</span>
              <h4>Frictionless logging beats every other feature.</h4>
              <p>
                One shortcut, one short string, Enter. If logging takes more
                than that, the tool has failed. This overrides every other
                consideration.
              </p>
            </div>
            <div className="prin">
              <span className="n">02</span>
              <h4>The tool does not act on you; you act on it.</h4>
              <p>
                No notifications, no nags, no badge on the menubar icon. You
                open the app. The app never opens you.
              </p>
            </div>
            <div className="prin">
              <span className="n">03</span>
              <h4>Asymmetric friction matches asymmetric importance.</h4>
              <p>
                Tasks are cheap to delete. Journal entries require confirmation.
                Archiving is one command; permanent deletion doesn&apos;t exist.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="final">
        <Reveal className="wrap">
          <Image
            className="final-icon"
            src="/trace-icon.png"
            alt="Trace"
            width={84}
            height={84}
          />
          <h2>Start keeping an honest record.</h2>
          <p>
            Download Trace, drag it to Applications, and log your first{" "}
            <span className="accent mono">/done</span> in the next five seconds.
          </p>
          <div className="cta-row">
            <a className="btn btn-primary btn-lg" href={DMG_HREF} download>
              <DownloadIcon />
              Download for macOS
            </a>
            <a className="btn btn-ghost btn-lg" href="#top">
              Back to top
            </a>
          </div>
          <div className="meta-line" style={{ marginTop: 22 }}>
            <span>macOS 13 Ventura or later</span>
            <span className="sep" />
            <span>Universal · Apple Silicon &amp; Intel</span>
            <span className="sep" />
            <span>No account required</span>
          </div>
        </Reveal>

        <footer>
          <div className="wrap foot-inner">
            <div className="foot-brand">
              <Image src="/trace-icon.png" alt="" width={20} height={20} />
              <span>Trace — v0.1.0 · Phase 0</span>
            </div>
            <div className="links">
              <a href="#commands">Commands</a>
              <a href="#heatmap">Heatmap</a>
              <a href={DMG_HREF} download>
                Download .dmg
              </a>
              <a href="#top">Top</a>
            </div>
          </div>
        </footer>
      </section>
    </>
  );
}
