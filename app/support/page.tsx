import type { Metadata } from "next";
import Link from "next/link";
import DocShell, { DocSection, DocList } from "../components/DocShell";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Support",
  description: `Get help with ${site.name} — setup, Slack, and anything that isn't behaving.`,
  alternates: { canonical: "/support" },
  openGraph: {
    title: `Support — ${site.name}`,
    description: `Get help with ${site.name} — setup, Slack, and anything that isn't behaving.`,
    url: "/support",
  },
};

const SUPPORT_EMAIL = "support@justrytrace.app";

function Mail({ children }: { children: React.ReactNode }) {
  return (
    <a
      className="text-ink underline decoration-line2 underline-offset-[3px] hover:decoration-accent transition-colors"
      href={`mailto:${SUPPORT_EMAIL}`}
    >
      {children}
    </a>
  );
}

export default function SupportPage() {
  return (
    <DocShell
      eyebrow="Support"
      title="Something not behaving? Write to us."
      intro="Trace is made by a small team, which means the person who reads your email is the person who can fix the thing. We aim to reply within one business day."
    >
      <DocSection title="Get in touch">
        <p>
          Email <Mail>{SUPPORT_EMAIL}</Mail>. That reaches us directly.
        </p>
        <p>
          It helps enormously if you include your Trace version (shown in{" "}
          <code className="font-mono text-[13.5px] text-ink">/config</code>),
          your macOS version, and what you expected to happen instead of what
          did.
        </p>
      </DocSection>

      <DocSection title="Slack: nothing is being read">
        <p>
          Trace reads Slack as you, so it can only see channels you are a member
          of. If a channel is bound but producing nothing, the usual cause is
          that you are not in it — the channel picker marks those{" "}
          <em>you&rsquo;re not in it</em>. Join it in Slack and Trace will start
          reading it.
        </p>
        <p>
          The other cause is that no channel is bound yet. Binding happens per
          project: open the project and run{" "}
          <code className="font-mono text-[13.5px] text-ink">
            /slack-connect
          </code>
          .
        </p>
      </DocSection>

      <DocSection title="Slack: a 📌 did nothing">
        <DocList
          items={[
            "The reaction has to be yours. A teammate reacting to a message is their bookmark, not your record, and Trace deliberately ignores it.",
            <>
              The channel has to be bound to a project at the time you react.
              Bind it first with{" "}
              <code className="font-mono text-[13.5px] text-ink">
                /slack-connect
              </code>
              , then react.
            </>,
            "Reactions added while Trace was closed are not picked up. Trace re-reads what you have reacted to when it starts, but treats it as history rather than a fresh instruction — otherwise every old pin would arrive at once.",
          ]}
        />
      </DocSection>

      <DocSection title="Slack: your admin has to approve it">
        <p>
          Many companies require an administrator to approve any app before it
          can be installed. If your Slack workspace does, the first person to
          connect Trace will see a request-to-install screen rather than a
          consent screen, and an admin has to allow it. Everyone after that just
          approves it for themselves.
        </p>
        <p>
          Some workspaces are stricter still and only permit apps listed on the
          Slack Marketplace. Trace&rsquo;s listing is in progress; until it is
          published, those workspaces will refuse the install outright and there
          is nothing we can change on our side to allow it.
        </p>
      </DocSection>

      <DocSection title="Slack: Trace stopped replying">
        <p>
          Disconnect and connect again from{" "}
          <code className="font-mono text-[13.5px] text-ink">/config</code> →
          Read a Slack channel. That re-authorizes cleanly and is the fix for
          almost every credential problem. If it recurs, tell us — that is a bug
          and we want it.
        </p>
      </DocSection>

      <DocSection title="Privacy and data">
        <p>
          Your record lives on your own Mac and we cannot see it — which also
          means we cannot recover it for you. See{" "}
          <Link
            className="text-ink underline decoration-line2 underline-offset-[3px] hover:decoration-accent transition-colors"
            href="/privacy"
          >
            the privacy page
          </Link>{" "}
          for exactly what that covers.
        </p>
      </DocSection>

      <DocSection title="Reporting something security-related">
        <p>
          Mail <Mail>{SUPPORT_EMAIL}</Mail> with &ldquo;security&rdquo; in the
          subject and we will come back to you quickly. Please give us a chance
          to fix it before publishing.
        </p>
      </DocSection>
    </DocShell>
  );
}
