import type { Metadata } from "next";
import DocShell, { DocSection, DocList } from "../components/DocShell";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: `How ${site.name} handles your data. Short version: it stays on your Mac.`,
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: `Privacy — ${site.name}`,
    description: `How ${site.name} handles your data. Short version: it stays on your Mac.`,
    url: "/privacy",
  },
};

const UPDATED = "7 August 2026";

export default function PrivacyPage() {
  return (
    <DocShell
      eyebrow="Privacy"
      title="Your work stays on your Mac."
      intro="Trace is a desktop app, not a service. There is no account to create, no server holding your record, and nothing to breach. This page says exactly what that means, including where the few genuine exceptions are."
    >
      <DocSection title="The short version">
        <p>
          Everything Trace records — your tasks, notes, decisions, screen
          captures and the contents of any Slack channel you connect — is stored
          in a database on your own machine. It is never uploaded to us. We
          cannot read it, cannot recover it for you, and do not know it exists.
        </p>
        <p>
          If you delete the app, that data goes with it. There is no copy
          anywhere else.
        </p>
      </DocSection>

      <DocSection title="Slack">
        <p>
          Connecting Slack authorizes Trace with your own Slack account. The
          resulting tokens are stored in your macOS Keychain and used only by
          the app on your Mac, which talks to Slack directly. No message, no
          reaction and no token passes through any server of ours.
        </p>
        <p>Trace reads Slack <em>as you</em>. That has two consequences worth stating plainly:</p>
        <DocList
          items={[
            <>
              It can only ever see what you can already see — channels you are a
              member of, and only the ones you explicitly pick inside Trace.
            </>,
            <>
              It cannot see anything your colleagues can see and you cannot.
              Trace is not added to any channel and never appears in a
              channel&rsquo;s member list.
            </>,
          ]}
        />
        <p>
          Trace never posts, reacts or replies in a channel. Every reply it
          sends is a direct message to you.
        </p>
        <p>
          One exception, and it is the only one: the page that completes the
          Slack sign-in,{" "}
          <code className="font-mono text-[13.5px] text-ink">
            {site.name.toLowerCase()}.app/slack/callback
          </code>
          , briefly receives the authorization code Slack issues and immediately
          redirects it to the app on your machine. That code cannot be used
          without a secret generated on your Mac that never leaves it, so the
          page cannot obtain a token, read a message, or act as you. It stores
          nothing and logs nothing.
        </p>
      </DocSection>

      <DocSection title="Screen recording">
        <p>
          Trace can record a window or your screen when you ask it to. Those
          recordings, and anything transcribed from them, are written to disk on
          your Mac and stay there.
        </p>
      </DocSection>

      <DocSection title="AI features">
        <p>
          Some features summarise or classify your own text. Where this runs on
          Apple&rsquo;s on-device models, nothing leaves the machine at all.
        </p>
        <p>
          Where you have configured Trace with your own API key for an outside
          model provider, the text needed for that request is sent to{" "}
          <em>that provider</em> under your own account and their terms — not to
          us. Trace never sends your content to a model provider on your behalf
          without a key you supplied.
        </p>
      </DocSection>

      <DocSection title="What we do collect">
        <p>
          Trace checks in with us about once a day. The list below is the whole
          of it — not a summary of it.
        </p>
        <DocList
          items={[
            <>
              <strong className="text-ink">An install ID.</strong> Your Mac&rsquo;s
              serial number, hashed with a secret built into the app. The serial
              itself never leaves your machine, and the ID identifies the
              computer rather than you — we cannot turn it back into a name, an
              email or a person.
            </>,
            <>
              <strong className="text-ink">Which version you are on</strong> —
              version, build, release channel, your macOS version and whether
              the Mac is Apple silicon or Intel. This is how we know an update
              actually reached people.
            </>,
            <>
              <strong className="text-ink">When your licence runs to</strong>,
              so the app can be told whether it may still run. The reply to this
              check-in <em>is</em> your licence, which is why this part is not
              optional.
            </>,
            <>
              <strong className="text-ink">
                Which slash commands you use, and how many times.
              </strong>{" "}
              A command&rsquo;s name, the date, and a number — nothing else.
              This is the one part you can switch off, in{" "}
              <code className="font-mono text-[13.5px] text-ink">/config</code>.
            </>,
          ]}
        />
        <p>
          What that last one never includes: the text of any task, note or
          journal entry, your project names, your{" "}
          <code className="font-mono text-[13.5px] text-ink">/find</code>{" "}
          questions, any command you ran with{" "}
          <code className="font-mono text-[13.5px] text-ink">/cli</code>, file
          paths, or anything else you typed after the command. If you have
          renamed a command, it is counted under Trace&rsquo;s own name for it,
          so the name you chose stays on your Mac.
        </p>
        <p>
          If you email us, join the waitlist, or request access, we keep what you
          sent us so we can reply to you. Nothing more.
        </p>
      </DocSection>

      <DocSection title="What we never do">
        <DocList
          items={[
            "Sell or share your data. There is nothing to sell — we do not have it.",
            "Upload your record, your captures, or your Slack messages.",
            "Read your Slack workspace, or hold credentials that could.",
            "Track you across other sites.",
            "Store the IP address a check-in arrives from. An anonymous ID plus an IP would be a person and a place, which is the thing hashing the serial exists to prevent.",
          ]}
        />
      </DocSection>

      <DocSection title="Your control">
        <p>
          Command usage sharing is on when you install Trace, and{" "}
          <code className="font-mono text-[13.5px] text-ink">/config</code>{" "}
          turns it off. Turning it off stops the counting as well as the
          sending, and discards whatever had been counted so far — it is not a
          switch that keeps a quiet record.
        </p>
        <p>
          Disconnecting Slack inside Trace revokes the app&rsquo;s access with
          Slack and deletes the stored tokens from your Keychain. Deleting the
          app removes the local database. Because we hold nothing, there is no
          request you need to send us to have your data erased — but if you have
          emailed us and want that deleted, ask and we will.
        </p>
      </DocSection>

      <DocSection title="Contact">
        <p>
          {site.publisher} — <a
            className="text-ink underline decoration-line2 underline-offset-[3px] hover:decoration-accent transition-colors"
            href="mailto:support@justrytrace.app"
          >
            support@justrytrace.app
          </a>
        </p>
        <p className="text-ink-faint text-[13.5px]">Last updated {UPDATED}.</p>
      </DocSection>
    </DocShell>
  );
}
