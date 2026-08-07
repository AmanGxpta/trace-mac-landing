import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  activeDaysForInstall,
  commandUsageForInstall,
  isAdmin,
} from "@/lib/admin";

export const metadata: Metadata = {
  title: "Install",
  robots: { index: false, follow: false },
};

/** Same reasoning as the index page: the auth check can short-circuit before it
 *  touches cookies(), so the route must be told it is dynamic. */
export const dynamic = "force-dynamic";

function day(date: Date | null): string {
  return date ? date.toISOString().slice(0, 10) : "—";
}

export default async function InstallDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isAdmin())) {
    return (
      <main className="mx-auto max-w-sm px-6 py-24 font-sans">
        <p className="text-sm text-ink-faint">
          <Link href="/admin/installs" className="underline underline-offset-4">
            Sign in
          </Link>
        </p>
      </main>
    );
  }

  const { id } = await params;
  const install = await prisma.install.findUnique({ where: { id } });
  if (!install) notFound();

  const [usage, days] = await Promise.all([
    commandUsageForInstall(id),
    activeDaysForInstall(id),
  ]);

  const totalCommands = usage.reduce((sum, row) => sum + row.total, 0);
  const typedTotal = usage.reduce((sum, row) => sum + row.ui, 0);
  const busiest = Math.max(1, ...days.map((d) => d.count));

  return (
    <main className="mx-auto max-w-4xl px-6 py-10 font-sans">
      <Link
        href="/admin/installs"
        className="text-sm text-ink-faint underline underline-offset-4"
      >
        ← All installs
      </Link>

      <header className="mt-4 mb-8">
        <h1 className="font-mono text-xl font-semibold text-ink">
          {install.id.slice(0, 8)}
        </h1>
        <p className="mt-1 text-sm text-ink-faint">
          {install.note ? `${install.note} · ` : ""}
          {install.version} ({install.build}) · {install.channel} · macOS{" "}
          {install.osVersion} · {install.arch}
        </p>
        <p className="mt-1 text-sm text-ink-faint">
          {install.status} · first seen {day(install.firstSeenAt)} · last seen{" "}
          {day(install.lastSeenAt)}
          {install.betaRefreshCount > 0
            ? ` · refreshed ×${install.betaRefreshCount}`
            : ""}
        </p>
        <p className="mt-3 font-mono text-xs text-ink-faint">
          install id {install.id}
        </p>
      </header>

      <section className="mb-10">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-faint">
          Commands used · {typedTotal} typed of {totalCommands} total
        </h2>

        {usage.length === 0 ? (
          <p className="text-sm text-ink-faint">
            Nothing recorded. Either this person has switched command sharing
            off in <code className="font-mono">/config</code>, or they have not
            used a slash command since updating.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-line2 text-left text-xs uppercase tracking-wide text-ink-faint">
                  <th className="py-2 pr-3 font-medium">Command</th>
                  <th className="py-2 pr-3 font-medium">Typed</th>
                  <th className="py-2 pr-3 font-medium">Agent</th>
                  <th className="py-2 pr-3 font-medium">Voice</th>
                  <th className="py-2 pr-3 font-medium">Total</th>
                  <th className="py-2 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {usage.map((row) => (
                  <tr key={row.verb} className="border-b border-line2">
                    <td className="py-2 pr-3 font-mono text-[13px] text-ink">
                      /{row.verb}
                    </td>
                    <td className="py-2 pr-3 text-ink">{row.ui || "—"}</td>
                    <td className="py-2 pr-3 text-ink-faint">
                      {row.agent || "—"}
                    </td>
                    <td className="py-2 pr-3 text-ink-faint">
                      {row.voice || "—"}
                    </td>
                    <td className="py-2 pr-3 text-ink">{row.total}</td>
                    <td className="py-2 w-1/3">
                      <div
                        className="h-1.5 rounded bg-accent/60"
                        style={{
                          width: `${Math.round((row.total / usage[0].total) * 100)}%`,
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-faint">
          Recent days
        </h2>
        {days.length === 0 ? (
          <p className="text-sm text-ink-faint">No days recorded.</p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {days.map((d) => (
              <div
                key={d.day.toISOString()}
                title={`${day(d.day)} · ${d.count}`}
                className="flex h-12 w-12 flex-col items-center justify-end rounded border border-line2 p-1"
              >
                <div
                  className="w-full rounded-sm bg-accent/60"
                  style={{ height: `${Math.round((d.count / busiest) * 100)}%` }}
                />
                <span className="mt-0.5 text-[10px] text-ink-faint">
                  {day(d.day).slice(5)}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      <p className="mt-10 text-xs text-ink-faint">
        Counts are canonical command names only — never arguments, project
        names, or anything typed after the command. A renamed command is counted
        under Trace&rsquo;s own name for it.
      </p>
    </main>
  );
}
