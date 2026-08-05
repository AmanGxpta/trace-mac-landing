import Image from "next/image";
import Link from "next/link";
import { FaApple } from "react-icons/fa";
import DownloadLink from "./DownloadLink";
import Reveal from "./Reveal";
import { DMG_PATH } from "@/lib/site";

/**
 * Chrome for the prose pages — privacy, support, the Slack install guide.
 *
 * These exist mostly because the Slack Marketplace requires them, and a
 * reviewer clicking through is the first reader. They are text, not marketing,
 * so they share one narrow column and one nav rather than each rebuilding the
 * homepage's sections.
 */
export default function DocShell({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="glow" />

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
              {eyebrow}
            </span>
          </Link>
          <div className="flex items-center gap-7">
            <Link
              href="/changelog"
              className="font-mono text-[13.5px] text-ink-dim hover:text-ink transition-colors duration-150 whitespace-nowrap hidden md:block"
            >
              Changelog
            </Link>
            <Link
              href="/support"
              className="font-mono text-[13.5px] text-ink-dim hover:text-ink transition-colors duration-150 whitespace-nowrap hidden md:block"
            >
              Support
            </Link>
            <DownloadLink
              location="doc_nav"
              className="font-mono text-[13.5px] font-semibold inline-flex items-center gap-[9px] px-4 py-[9px] rounded-[9px] cursor-pointer border border-transparent transition-all duration-200 bg-accent text-[#06140b] shadow-[0_0_0_1px_color-mix(in_oklab,var(--accent)_60%,transparent),0_8px_30px_-10px_color-mix(in_oklab,var(--accent)_60%,transparent)] hover:-translate-y-px whitespace-nowrap"
              href={DMG_PATH}
            >
              <FaApple />
              Download
            </DownloadLink>
          </div>
        </div>
      </nav>

      <header className="pt-[84px] pb-[10px] max-w-[1140px] mx-auto px-7">
        <Reveal className="max-w-[64ch]">
          <span className="font-mono text-[12.5px] tracking-[.16em] uppercase text-ink-faint inline-flex items-center gap-[9px] whitespace-nowrap before:content-[''] before:w-[6px] before:h-[6px] before:rounded-full before:bg-accent before:shadow-[0_0_10px_var(--accent)]">
            {eyebrow}
          </span>
          <h1 className="font-sans font-bold text-[clamp(32px,5vw,52px)] tracking-[-0.025em] leading-[1.06] mt-[18px] [text-wrap:balance]">
            {title}
          </h1>
          {intro && (
            <p className="text-ink-dim text-[16px] leading-[1.65] mt-5 [text-wrap:pretty]">
              {intro}
            </p>
          )}
        </Reveal>
      </header>

      <main className="pb-[110px] pt-[34px] max-w-[1140px] mx-auto px-7">
        <div className="max-w-[68ch] flex flex-col gap-[38px]">{children}</div>
      </main>
    </>
  );
}

/** One titled block of prose. */
export function DocSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal className="border-t border-line pt-[26px] first:border-t-0 first:pt-0">
      <h2 className="font-sans font-semibold text-[19px] tracking-[-0.015em] mb-[14px]">
        {title}
      </h2>
      <div className="flex flex-col gap-[13px] text-ink-dim text-[15px] leading-[1.68] [text-wrap:pretty]">
        {children}
      </div>
    </Reveal>
  );
}

/** A plain bulleted list in the same voice as the surrounding prose. */
export function DocList({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="flex flex-col gap-[10px]">
      {items.map((item, i) => (
        <li key={i} className="grid grid-cols-[14px_1fr] gap-x-[10px]">
          <span className="text-accent mt-[9px] w-[5px] h-[5px] rounded-full bg-accent justify-self-center" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
