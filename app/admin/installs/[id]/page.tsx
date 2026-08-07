import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  activeDaysForInstall,
  commandUsageForInstall,
  isAdmin,
  withSerial,
} from "@/lib/admin";

export const metadata: Metadata = {
  title: "Install",
  robots: { index: false, follow: false },
};

/** Same reasoning as the index page: the auth check can short-circuit before
 *  it touches cookies(), so the route must be told it is dynamic. */
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
      <main className="flex min-h-screen items-center justify-center px-6">
        <Link href="/admin/installs" className="btn">
          Sign in
        </Link>
      </main>
    );
  }

  const { id } = await params;
  const found = await prisma.install.findUnique({ where: { id } });
  if (!found) notFound();
  const install = withSerial(found);

  const [usage, days] = await Promise.all([
    commandUsageForInstall(id),
    activeDaysForInstall(id),
  ]);

  const totalCommands = usage.reduce((sum, row) => sum + row.total, 0);
  const typedTotal = usage.reduce((sum, row) => sum + row.ui, 0);
  const busiestDay = Math.max(1, ...days.map((d) => d.count));
  const off = install.status === "disabled";

  return (
    <main className="mx-auto max-w-[900px] px-7 py-10">
      <Link
        href="/admin/installs"
        className="eyebrow rise inline-block hover:text-ink"
      >
        ← Fleet
      </Link>

      <header className="rise mt-5 mb-9" style={{ animationDelay: "40ms" }}>
        <div className="flex flex-wrap items-center gap-3">
          <span className={`dot ${off ? "off" : "live"}`} />
          <h1 className="mono text-[24px] font-semibold tracking-tight">
            {install.serial ?? install.id.slice(0, 8)}
          </h1>
          <span className={`pill ${off ? "off" : ""}`}>
            {off ? "disabled" : "active"}
          </span>
          {install.note && (
            <span className="text-[14px] text-ink-dim">{install.note}</span>
          )}
        </div>

        <dl className="mt-5 grid gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Build">
            {install.version} · {install.build}
          </Field>
          <Field label="Channel">{install.channel}</Field>
          <Field label="System">
            macOS {install.osVersion} · {install.arch}
          </Field>
          <Field label="First seen">{day(install.firstSeenAt)}</Field>
          <Field label="Last seen">{day(install.lastSeenAt)}</Field>
          <Field label="Beta expires">
            {day(install.betaExpiresAtOverride)}
            {install.betaRefreshCount > 0
              ? ` · refreshed ×${install.betaRefreshCount}`
              : ""}
          </Field>
          <Field label="Install id">{install.id}</Field>
        </dl>
      </header>

      <section className="rise mb-10" style={{ animationDelay: "80ms" }}>
        <div className="eyebrow mb-4 flex items-center gap-2">
          <span>
            Commands used · {typedTotal} typed of {totalCommands}
          </span>
          <span className="rule flex-1" />
        </div>

        {usage.length === 0 ? (
          <p className="text-[13px] leading-relaxed text-ink-faint">
            Nothing recorded. Either this person has switched command sharing
            off in <span className="mono">/config</span>, or they have not used
            a slash command since updating.
          </p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left">
                {["Command", "Typed", "Agent", "Voice", "Total", ""].map((h) => (
                  <th key={h} className="eyebrow pb-2.5 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {usage.map((row) => (
                <tr key={row.verb} className="row">
                  <td className="mono py-2.5 pr-4 text-[13px]">/{row.verb}</td>
                  <td className="mono py-2.5 pr-4 text-[13px]">
                    {row.ui || <span className="text-ink-faint">—</span>}
                  </td>
                  <td className="mono py-2.5 pr-4 text-[13px] text-ink-faint">
                    {row.agent || "—"}
                  </td>
                  <td className="mono py-2.5 pr-4 text-[13px] text-ink-faint">
                    {row.voice || "—"}
                  </td>
                  <td className="mono py-2.5 pr-4 text-[13px]">{row.total}</td>
                  <td className="w-[38%] py-2.5">
                    <div className="bar-track">
                      <div
                        className="bar"
                        style={{
                          width: `${Math.round((row.total / usage[0].total) * 100)}%`,
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="rise" style={{ animationDelay: "120ms" }}>
        <div className="eyebrow mb-4 flex items-center gap-2">
          <span>Recent days</span>
          <span className="rule flex-1" />
        </div>
        {days.length === 0 ? (
          <p className="text-[13px] text-ink-faint">No days recorded.</p>
        ) : (
          <div className="flex flex-wrap items-end gap-1.5">
            {[...days].reverse().map((d) => (
              <div
                key={d.day.toISOString()}
                title={`${day(d.day)} · ${d.count}`}
                className="flex w-[38px] flex-col items-center gap-1.5"
              >
                <div
                  className="w-full rounded-[3px]"
                  style={{
                    height: `${Math.max(3, Math.round((d.count / busiestDay) * 46))}px`,
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,.45), rgba(255,255,255,.13))",
                  }}
                />
                <span className="mono text-[9.5px] text-ink-faint">
                  {day(d.day).slice(5)}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      <p className="mt-10 max-w-[70ch] text-[12px] leading-relaxed text-ink-faint">
        Counts are canonical command names only — never arguments, project
        names, or anything typed after the command. A renamed command is counted
        under Trace&rsquo;s own name for it.
      </p>
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="eyebrow">{label}</dt>
      <dd className="mono mt-1 text-[13px] break-all">{children}</dd>
    </div>
  );
}
