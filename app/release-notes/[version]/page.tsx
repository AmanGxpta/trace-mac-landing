import type { Metadata } from "next";
import { changelog, type ChangeKind } from "@/lib/changelog";

export const metadata: Metadata = {
  title: "Release notes",
  robots: { index: false, follow: false },
};

/**
 * The page Sparkle renders inside the update dialog.
 *
 * Deliberately not `/changelog`. That is a marketing page with a sticky nav, a
 * logo and a download button, and dropping it into a ~500px webview showed the
 * site header with the actual notes pushed below the fold — an update prompt
 * that appeared to have nothing to say. This route carries the notes for one
 * version and nothing else: no nav, no footer, no glow.
 *
 * Styled inline against `prefers-color-scheme` rather than with the site's
 * classes, because this is rendered by a native dialog rather than in the site,
 * and it should look like it belongs to the app that opened it.
 */

const LABELS: Record<ChangeKind, string> = {
  new: "New",
  improved: "Improved",
  fixed: "Fixed",
  removed: "Removed",
};

export default async function ReleaseNotesPage({
  params,
}: {
  params: Promise<{ version: string }>;
}) {
  const { version } = await params;
  const entry = changelog.find((e) => e.version === version);

  return (
    <div className="rn">
      {/* A dialog that says "here's what changed" and then shows a 404 reads as
          a broken update. An unknown version falls back to naming itself and
          pointing at the full list instead. */}
      {!entry ? (
        <>
          <h1>Trace {version}</h1>
          <p className="muted">
            Release notes for this version aren&rsquo;t posted yet. The full
            changelog lives at{" "}
            <a href="https://www.justrytrace.app/changelog">
              justrytrace.app/changelog
            </a>
            .
          </p>
        </>
      ) : (
        <>
          <h1>
            Trace {entry.version}
            {entry.title ? <span className="muted"> — {entry.title}</span> : null}
          </h1>
          <p className="date">{entry.date}</p>
          <ul>
            {entry.changes.map((change, i) => (
              <li key={i}>
                <span className={`tag ${change.kind}`}>
                  {LABELS[change.kind]}
                </span>
                <span>{change.text}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .rn {
              font: 13.5px/1.55 -apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif;
              color: #1d1d1f;
              padding: 16px 18px 22px;
              margin: 0;
            }
            .rn h1 { font-size: 15px; font-weight: 600; margin: 0 0 2px; }
            .rn .muted { color: #6e6e73; font-weight: 400; }
            .rn .date { color: #6e6e73; font-size: 12px; margin: 0 0 14px; }
            .rn ul { list-style: none; padding: 0; margin: 0; }
            .rn li {
              display: flex; gap: 8px; align-items: baseline;
              padding: 7px 0; border-top: 1px solid rgba(0,0,0,.08);
            }
            .rn li:first-child { border-top: 0; }
            .rn .tag {
              flex: none; min-width: 62px;
              font-size: 10.5px; font-weight: 600; letter-spacing: .04em;
              text-transform: uppercase; padding-top: 1px;
            }
            .rn .tag.new { color: #0a7d3f; }
            .rn .tag.improved { color: #0b63c5; }
            .rn .tag.fixed { color: #9a5b00; }
            .rn .tag.removed { color: #a33121; }
            .rn a { color: #0b63c5; }
            @media (prefers-color-scheme: dark) {
              .rn { color: #f2f2f7; }
              .rn .muted, .rn .date { color: #98989d; }
              .rn li { border-top-color: rgba(255,255,255,.10); }
              .rn .tag.new { color: #4ad07d; }
              .rn .tag.improved { color: #6fb2ff; }
              .rn .tag.fixed { color: #ffc464; }
              .rn .tag.removed { color: #ff8a75; }
              .rn a { color: #6fb2ff; }
            }
          `,
        }}
      />
    </div>
  );
}
