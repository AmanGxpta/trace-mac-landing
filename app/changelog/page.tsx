import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FaApple } from "react-icons/fa";
import Reveal from "../components/Reveal";
import DownloadLink from "../components/DownloadLink";
import { changelog, type ChangeKind } from "@/lib/changelog";
import { DMG_PATH, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Changelog",
  description: `Every Trace release, version by version — what's new, improved, and fixed in ${site.name}.`,
  alternates: { canonical: "/changelog" },
  openGraph: {
    title: `Changelog — ${site.name}`,
    description: `Every Trace release, version by version — what's new, improved, and fixed in ${site.name}.`,
    url: "/changelog",
  },
};

export default function ChangelogPage() {
  return (
    <>
      <div className="glow" />

      {/* ── NAV ─────────────────────────────────────────────────────── */}
      <nav
        className="sticky top-0 z-50 backdrop-blur-[14px] saturate-120 border-b border-line"
        style={{ background: "color-mix(in oklab, var(--bg) 72%, transparent)" }}
      >
        <div className="max-w-[1140px] mx-auto h-[62px] px-7 flex items-center justify-between">
          <Link
            href="/"
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
              Changelog
            </span>
          </Link>
          <div className="flex items-center gap-7">
            <Link
              href="/#commands"
              className="font-mono text-[13.5px] text-ink-dim hover:text-ink transition-colors duration-150 whitespace-nowrap hidden md:block"
            >
              Commands
            </Link>
            <Link
              href="/#inside"
              className="font-mono text-[13.5px] text-ink-dim hover:text-ink transition-colors duration-150 whitespace-nowrap hidden md:block"
            >
              Screens
            </Link>
            <Link
              href="/#features"
              className="font-mono text-[13.5px] text-ink-dim hover:text-ink transition-colors duration-150 whitespace-nowrap hidden md:block"
            >
              Features
            </Link>
            <Link
              href="/#dev"
              className="font-mono text-[13.5px] text-ink-dim hover:text-ink transition-colors duration-150 whitespace-nowrap hidden md:block"
            >
              Developers
            </Link>
            <Link
              href="/changelog"
              className="font-mono text-[13.5px] text-ink hover:text-ink transition-colors duration-150 whitespace-nowrap hidden md:block"
            >
              Changelog
            </Link>
            <DownloadLink
              location="changelog_nav"
              className="font-mono text-[13.5px] font-semibold inline-flex items-center gap-[9px] px-4 py-[9px] rounded-[9px] cursor-pointer border border-transparent transition-all duration-200 bg-accent text-[#06140b] shadow-[0_0_0_1px_color-mix(in_oklab,var(--accent)_60%,transparent),0_8px_30px_-10px_color-mix(in_oklab,var(--accent)_60%,transparent)] hover:-translate-y-px whitespace-nowrap"
              href={DMG_PATH}
            >
              <FaApple />
              Download
            </DownloadLink>
          </div>
        </div>
      </nav>

      {/* ── HEADER ──────────────────────────────────────────────────── */}
      <header className="pt-[84px] pb-[10px] max-w-[1140px] mx-auto px-7">
        <Reveal className="max-w-[64ch]">
          <span className="font-mono text-[12.5px] tracking-[.16em] uppercase text-ink-faint inline-flex items-center gap-[9px] whitespace-nowrap before:content-[''] before:w-[6px] before:h-[6px] before:rounded-full before:bg-accent before:shadow-[0_0_10px_var(--accent)]">
            Changelog
          </span>
          <h1 className="font-sans font-bold text-[clamp(32px,5vw,52px)] tracking-[-0.025em] leading-[1.06] mt-[18px] [text-wrap:balance]">
            Every release, in the open.
          </h1>
          <p className="mt-5 text-ink-dim text-[clamp(16px,2vw,18px)] max-w-[56ch] leading-[1.6] [text-wrap:pretty]">
            What changed, version by version — newest first. The same honest
            record, applied to the app itself.
          </p>
        </Reveal>
      </header>

      {/* ── ENTRIES ─────────────────────────────────────────────────── */}
      <main className="pb-[110px] pt-[40px] max-w-[1140px] mx-auto px-7">
        <div className="flex flex-col">
          {changelog.map((entry, i) => (
            <Reveal
              key={entry.version}
              className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-x-[40px] gap-y-5 py-[38px] border-t border-line first:border-t-0"
            >
              <div className="flex md:flex-col items-baseline md:items-start gap-x-3 gap-y-[6px] md:sticky md:top-[86px] md:self-start">
                <span className="font-mono text-[16px] font-semibold inline-flex items-center gap-[9px]">
                  <span className="text-ink">v{entry.version}</span>
                  {i === 0 && (
                    <span className="text-[10.5px] font-medium tracking-[.08em] uppercase text-accent px-[7px] py-[2px] border border-line2 rounded-[5px]">
                      Latest
                    </span>
                  )}
                </span>
                <time
                  dateTime={entry.date}
                  className="font-mono text-[12.5px] text-ink-faint"
                >
                  {new Date(entry.date + "T00:00:00").toLocaleDateString(
                    "en-US",
                    { year: "numeric", month: "short", day: "numeric" },
                  )}
                </time>
              </div>

              <div className="flex flex-col gap-[16px]">
                {entry.title && (
                  <h2 className="font-sans font-semibold text-[18px] tracking-[-0.01em] leading-[1.3]">
                    {entry.title}
                  </h2>
                )}
                <ul className="flex flex-col gap-[12px]">
                  {entry.changes.map((c, j) => (
                    <li
                      key={j}
                      className="grid grid-cols-[78px_1fr] gap-3 items-baseline"
                    >
                      <ChangeTag kind={c.kind} />
                      <span className="text-ink-dim text-[14.5px] leading-[1.55] [text-wrap:pretty]">
                        {c.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </main>
    </>
  );
}

function ChangeTag({ kind }: { kind: ChangeKind }) {
  const label = { new: "New", improved: "Improved", fixed: "Fixed" }[kind];
  const color = {
    new: "var(--accent)",
    improved: "var(--ink-dim)",
    fixed: "var(--ink-faint)",
  }[kind];
  return (
    <span
      className="font-mono text-[10.5px] font-medium tracking-[.08em] uppercase px-[7px] py-[3px] rounded-[5px] border text-center justify-self-start"
      style={{
        color,
        borderColor: "var(--line-2)",
        background: "color-mix(in oklab, currentColor 7%, transparent)",
      }}
    >
      {label}
    </span>
  );
}
