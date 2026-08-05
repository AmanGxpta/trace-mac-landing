import type { Metadata } from "next";
import Link from "next/link";
import { FaApple } from "react-icons/fa";
import DocShell, { DocSection, DocList } from "../components/DocShell";
import DownloadLink from "../components/DownloadLink";
import { DMG_PATH, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Trace for Slack",
  description:
    "File work straight from Slack into your own private Trace, and ask Trace about it in a DM. Reads only the channels you pick, as you, and nothing leaves your Mac.",
  alternates: { canonical: "/slack" },
  openGraph: {
    title: `Trace for Slack — ${site.name}`,
    description:
      "File work straight from Slack into your own private Trace, and ask Trace about it in a DM.",
    url: "/slack",
  },
};

export default function SlackPage() {
  return (
    <DocShell
      eyebrow="Slack"
      title="The work you agreed to in Slack, in your own record."
      intro="Trace is a Mac app that keeps track of what you actually worked on. This integration lets you file things into it straight from Slack — and ask it questions without leaving the conversation."
    >
      <DocSection title="Install it">
        <p>
          Trace for Slack is part of the Trace Mac app, so the connection starts
          there rather than here. There is no &ldquo;Add to Slack&rdquo; button
          on this page on purpose: the sign-in has to begin on your machine for
          it to be secure.
        </p>
        <DocList
          items={[
            <>
              <strong className="text-ink">Download Trace</strong> and open it.
              macOS 14 or later.
            </>,
            <>
              <strong className="text-ink">Open /config</strong> from the project
              list, and find <em>Read a Slack channel</em>.
            </>,
            <>
              <strong className="text-ink">Press Connect Slack.</strong> Your
              browser opens Slack&rsquo;s approval screen. Approve it, and the
              tab hands you back to Trace.
            </>,
            <>
              <strong className="text-ink">Pick your channels.</strong> Open a
              project and run{" "}
              <code className="font-mono text-[13.5px] text-ink">
                /slack-connect
              </code>{" "}
              to choose which channels feed it.
            </>,
          ]}
        />
        <div className="pt-2">
          <DownloadLink
            location="slack_page"
            className="font-mono text-[13.5px] font-semibold inline-flex items-center gap-[9px] px-4 py-[9px] rounded-[9px] cursor-pointer border border-transparent transition-all duration-200 bg-accent text-[#06140b] shadow-[0_0_0_1px_color-mix(in_oklab,var(--accent)_60%,transparent),0_8px_30px_-10px_color-mix(in_oklab,var(--accent)_60%,transparent)] hover:-translate-y-px whitespace-nowrap"
            href={DMG_PATH}
          >
            <FaApple />
            Download Trace for macOS
          </DownloadLink>
        </div>
      </DocSection>

      <DocSection title="What you can do with it">
        <DocList
          items={[
            <>
              <strong className="text-ink">React 📌</strong> to any message to
              file it into Trace as a proposed task, in whichever project you
              bound that channel to. Nothing is written to your board until you
              accept it.
            </>,
            <>
              <strong className="text-ink">React 🔎 or ❓</strong> to ask Trace
              about that message. The answer comes back as a direct message.
            </>,
            <>
              <strong className="text-ink">Message Trace directly</strong> to ask
              what&rsquo;s on your plate, add or complete a task, or start work —
              and get the result back in the same conversation, including a
              recording of what was done.
            </>,
          ]}
        />
      </DocSection>

      <DocSection title="What it will never do">
        <p>
          Trace never posts, reacts or replies in a channel. Every reply it sends
          is a direct message to you and nobody else. It is not added to any
          channel and never appears in a channel&rsquo;s member list — nobody you
          work with will see that you are using it.
        </p>
      </DocSection>

      <DocSection title="What it can see">
        <p>
          Trace reads Slack <em>as you</em>, using your own authorization. It can
          only see channels you are already a member of, and only the ones you
          explicitly picked inside Trace. It cannot see anything you can&rsquo;t.
        </p>
        <p>
          Reactions count only when you added them. A colleague reacting to a
          message is their bookmark, not your record, and Trace ignores it.
        </p>
        <p>
          Everything read is stored on your own Mac. No message, reaction or
          token passes through a Trace server —{" "}
          <Link
            className="text-ink underline decoration-line2 underline-offset-[3px] hover:decoration-accent transition-colors"
            href="/privacy"
          >
            the privacy page
          </Link>{" "}
          spells out the one narrow exception and why it can&rsquo;t read
          anything.
        </p>
      </DocSection>

      <DocSection title="If you work somewhere with an admin">
        <p>
          Many companies require an administrator to approve any Slack app. If
          yours does, the first person to connect Trace will be asked to request
          approval instead of granting it, and an admin has to allow it once for
          the workspace. Everyone after that approves it just for themselves.
        </p>
        <p>
          The permissions Trace asks for are deliberately narrow, which makes
          that a short conversation: it reads only the channels one named person
          is already in, it cannot add itself anywhere, and it can only message
          that same person back.
        </p>
      </DocSection>

      <DocSection title="Help">
        <p>
          Something not working?{" "}
          <Link
            className="text-ink underline decoration-line2 underline-offset-[3px] hover:decoration-accent transition-colors"
            href="/support"
          >
            Support
          </Link>{" "}
          covers the common cases, or write to{" "}
          <a
            className="text-ink underline decoration-line2 underline-offset-[3px] hover:decoration-accent transition-colors"
            href="mailto:support@justrytrace.app"
          >
            support@justrytrace.app
          </a>
          .
        </p>
      </DocSection>
    </DocShell>
  );
}
