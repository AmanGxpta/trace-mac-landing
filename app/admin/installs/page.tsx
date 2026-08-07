import type { Metadata } from "next";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import {
  REFRESH_DAYS,
  findInstalls,
  fleetSummary,
  isAdmin,
  listInstalls,
  refreshBeta,
  serialLookupConfigured,
  setNote,
  setStatus,
  signIn,
  signOut,
  topCommands,
  versionSpread,
} from "@/lib/admin";
import { serialKeyConfigured } from "@/lib/serial";

export const metadata: Metadata = {
  title: "Installs",
  robots: { index: false, follow: false },
};

/**
 * Required, and not belt-and-braces.
 *
 * `isAdmin()` short-circuits on a missing `ADMIN_PASSWORD` *before* it touches
 * `cookies()`, and at build time that variable isn't set — so Next sees no
 * dynamic API, prerenders the signed-out page and then serves that cached copy
 * forever. Signing in would appear to work and never show the table. Caught by
 * the build output reporting this route as ○ Static.
 */
export const dynamic = "force-dynamic";

const PATH = "/admin/installs";

function day(date: Date | null): string {
  return date ? date.toISOString().slice(0, 10) : "—";
}

async function guard() {
  if (!(await isAdmin())) throw new Error("Unauthorized");
}

export default async function InstallsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  if (!(await isAdmin())) return <SignInForm />;

  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  const [installs, summary, versions, commands] = await Promise.all([
    query ? findInstalls(query) : listInstalls(),
    fleetSummary(),
    versionSpread(),
    topCommands(),
  ]);

  const lookupReady = serialLookupConfigured();
  const serialsReady = serialKeyConfigured();
  const disabled = installs.filter((i) => i.status === "disabled").length;
  const busiest = Math.max(1, ...commands.map((c) => c.count));

  async function disable(formData: FormData) {
    "use server";
    await guard();
    await setStatus(
      String(formData.get("id")),
      "disabled",
      String(formData.get("message") ?? ""),
    );
    revalidatePath(PATH);
  }

  async function enable(formData: FormData) {
    "use server";
    await guard();
    await setStatus(String(formData.get("id")), "active");
    revalidatePath(PATH);
  }

  async function refresh(formData: FormData) {
    "use server";
    await guard();
    await refreshBeta(String(formData.get("id")));
    revalidatePath(PATH);
  }

  async function note(formData: FormData) {
    "use server";
    await guard();
    await setNote(String(formData.get("id")), String(formData.get("note") ?? ""));
    revalidatePath(PATH);
  }

  async function logout() {
    "use server";
    await signOut();
    revalidatePath(PATH);
  }

  return (
    <main className="mx-auto max-w-[1180px] px-7 py-10">
      {/* ── Masthead ─────────────────────────────────────────────── */}
      <header className="rise mb-9 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="eyebrow mb-1.5">Trace · operations</div>
          <h1 className="mono text-[26px] font-semibold leading-none tracking-tight">
            Installs
          </h1>
        </div>
        <form action={logout}>
          <button className="btn-quiet rounded-md text-[12.5px]">Sign out</button>
        </form>
      </header>

      {/* ── The four numbers ─────────────────────────────────────── */}
      <section
        className="rise mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
        style={{ animationDelay: "40ms" }}
      >
        <Stat label="Installs" value={summary.total} />
        <Stat
          label="Seen in 48h"
          value={summary.activeLast48h}
          tone={summary.activeLast48h > 0 ? "live" : undefined}
        />
        <Stat label="Switched off" value={disabled} tone={disabled ? "off" : undefined} />
        <Stat label="Commands tracked" value={commands.length} />
      </section>

      {/* ── Lookup ───────────────────────────────────────────────── */}
      {/* Trace sends a hash of the Mac serial, so this is the box that turns
          the serial someone reads off About This Mac back into their row. */}
      <section className="rise mb-8" style={{ animationDelay: "80ms" }}>
        <form method="get" className="flex flex-wrap items-center gap-2">
          <input
            name="q"
            defaultValue={query}
            placeholder="Mac serial, Machine ID, or who they are"
            className="field mono w-[320px] max-w-full"
            autoComplete="off"
          />
          <button className="btn">Look up</button>
          {query && (
            <Link href={PATH} className="btn-quiet rounded-md text-[12.5px]">
              Clear
            </Link>
          )}
          {query && (
            <span className="mono text-[12px] text-ink-faint">
              {installs.length} match{installs.length === 1 ? "" : "es"}
            </span>
          )}
        </form>

        {(!lookupReady || !serialsReady) && (
          <div className="mt-3 space-y-1">
            {!lookupReady && (
              <p className="text-[12.5px]" style={{ color: "var(--sig-quiet)" }}>
                TELEMETRY_PEPPER is not set — a serial cannot be turned into an
                install id, so serial lookup will find nothing.
              </p>
            )}
            {!serialsReady && (
              <p className="text-[12.5px]" style={{ color: "var(--sig-quiet)" }}>
                TELEMETRY_SERIAL_KEY is not set — serials cannot be stored or
                read back, so the column below stays empty.
              </p>
            )}
          </div>
        )}
      </section>

      {/* ── What people actually use ─────────────────────────────── */}
      <section className="rise mb-8" style={{ animationDelay: "120ms" }}>
        <div className="eyebrow mb-3">
          Most used commands · typed only, last 30 days
        </div>
        {commands.length === 0 ? (
          <p className="text-[13px] text-ink-faint">
            Nothing recorded yet. Counts arrive with the next check-in.
          </p>
        ) : (
          <div className="grid gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
            {commands.map((c) => (
              <div key={c.verb} className="flex items-center gap-3">
                <div className="mono w-[150px] shrink-0 truncate text-[13px]">
                  /{c.verb}
                </div>
                <div className="bar-track flex-1">
                  <div
                    className="bar"
                    style={{ width: `${Math.round((c.count / busiest) * 100)}%` }}
                  />
                </div>
                <div className="mono w-[64px] shrink-0 text-right text-[12px] text-ink-faint">
                  {c.count}
                  <span className="opacity-55"> · {c.installs}u</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Version spread ───────────────────────────────────────── */}
      <section className="rise mb-9" style={{ animationDelay: "160ms" }}>
        <div className="eyebrow mb-3">Version spread</div>
        <div className="flex flex-wrap gap-2">
          {versions.length === 0 && (
            <span className="text-[13px] text-ink-faint">
              Nothing has checked in yet.
            </span>
          )}
          {versions.map((v) => (
            <span
              key={`${v.channel}-${v.version}`}
              className="mono tile !px-3 !py-1.5 text-[12.5px]"
            >
              <span className="text-ink-faint">{v.channel}</span> {v.version}
              <span className="text-ink-faint"> · {v.count}</span>
            </span>
          ))}
        </div>
      </section>

      {/* ── The fleet ────────────────────────────────────────────── */}
      <section className="rise" style={{ animationDelay: "200ms" }}>
        <div className="eyebrow mb-3 flex items-center gap-2">
          <span>Fleet</span>
          <span className="rule flex-1" />
        </div>

        {installs.length === 0 ? (
          <p className="py-8 text-[13px] text-ink-faint">
            {query
              ? "No install matches that."
              : "No installs yet. They appear about a minute after an app launches."}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px] border-collapse">
              <thead>
                <tr className="text-left">
                  {["Machine", "Build", "Seen", "Licence", ""].map((h) => (
                    <th key={h} className="eyebrow pb-2.5 font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {installs.map((install) => {
                  const off = install.status === "disabled";
                  const live = !off && !install.isQuiet;

                  return (
                    <tr key={install.id} className="row align-top">
                      {/* Machine — the serial leads, because it is the thing a
                          person can read back to you over a message. */}
                      <td className="py-4 pr-5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`dot ${off ? "off" : live ? "live pulse" : "quiet"}`}
                          />
                          <Link
                            href={`/admin/installs/${install.id}`}
                            className="mono text-[14px] hover:underline underline-offset-4"
                          >
                            {install.serial ?? install.id.slice(0, 8)}
                          </Link>
                        </div>
                        <div className="mono mt-1 pl-4 text-[11px] text-ink-faint">
                          {install.serial ? `id ${install.id.slice(0, 8)}` : "serial not stored"}
                          {install.idSource !== "serial" && ` · via ${install.idSource}`}
                          {install.supersededById && " · superseded"}
                        </div>

                        {/* A real input group. The previous version was a bare
                            text link jammed against the field with no padding,
                            which was close to impossible to hit. */}
                        <form action={note} className="mt-2 flex gap-1.5 pl-4">
                          <input type="hidden" name="id" value={install.id} />
                          <input
                            name="note"
                            defaultValue={install.note ?? ""}
                            placeholder="who is this?"
                            className="field w-[150px] !py-1 !text-[12px]"
                            autoComplete="off"
                          />
                          <button className="btn !px-2.5 !py-1 !text-[11.5px]">
                            Save
                          </button>
                        </form>
                      </td>

                      <td className="py-4 pr-5">
                        <div className="mono text-[13px]">{install.version}</div>
                        <div className="mono mt-1 text-[11px] text-ink-faint">
                          {install.build}
                        </div>
                        <div className="mt-1 text-[11.5px] text-ink-faint">
                          {install.channel} · macOS {install.osVersion} ·{" "}
                          {install.arch}
                        </div>
                      </td>

                      <td className="py-4 pr-5">
                        <div className="text-[13px]">
                          {install.seenAgo}
                        </div>
                        <div className="mono mt-1 text-[11px] text-ink-faint">
                          since {day(install.firstSeenAt)}
                        </div>
                      </td>

                      <td className="py-4 pr-5">
                        <span className={`pill ${off ? "off" : ""}`}>
                          {off ? "disabled" : "active"}
                        </span>
                        <div className="mono mt-2 text-[11px] text-ink-faint">
                          expires {day(install.betaExpiresAtOverride)}
                        </div>
                        {/* On the row, not in a log: refreshing is frictionless
                            in both directions, and without a visible count
                            someone on their sixth looks like their first. */}
                        {install.betaRefreshCount > 0 && (
                          <div className="mono mt-0.5 text-[11px] text-ink-faint">
                            refreshed ×{install.betaRefreshCount}
                            {install.betaRefreshedAt
                              ? ` · ${day(install.betaRefreshedAt)}`
                              : ""}
                          </div>
                        )}
                      </td>

                      <td className="py-4">
                        <div className="flex flex-col items-start gap-1.5">
                          <form action={refresh}>
                            <input type="hidden" name="id" value={install.id} />
                            <button className="btn !py-1.5 !text-[12px]">
                              Refresh {REFRESH_DAYS} days
                            </button>
                          </form>

                          {off ? (
                            <form action={enable}>
                              <input
                                type="hidden"
                                name="id"
                                value={install.id}
                              />
                              <button className="btn !py-1.5 !text-[12px]">
                                Re-enable
                              </button>
                            </form>
                          ) : (
                            <form action={disable} className="flex gap-1.5">
                              <input
                                type="hidden"
                                name="id"
                                value={install.id}
                              />
                              <input
                                name="message"
                                placeholder="reason shown in app"
                                className="field w-[160px] !py-1.5 !text-[12px]"
                                autoComplete="off"
                              />
                              <button className="btn btn-danger !py-1.5 !text-[12px]">
                                Disable
                              </button>
                            </form>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <p className="mt-10 max-w-[70ch] text-[12px] leading-relaxed text-ink-faint">
        A disable reaches an install on its next check-in, and stops being
        enforced if that install cannot reach us for 30 days — an unreachable
        server must never mean a locked app. Serials are encrypted at rest under
        a key held outside the database.
      </p>
    </main>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone?: "live" | "off";
}) {
  return (
    <div className="tile">
      <div className="eyebrow mb-2 flex items-center gap-1.5">
        {tone && <span className={`dot ${tone}`} />}
        {label}
      </div>
      <div className="mono text-[28px] leading-none">{value}</div>
    </div>
  );
}

function SignInForm() {
  async function attempt(formData: FormData) {
    "use server";
    await signIn(String(formData.get("password") ?? ""));
    revalidatePath(PATH);
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="rise w-full max-w-[380px]">
        {/* The old version was one unlabelled box floating in black, which
            gave no clue what it was or what it wanted. */}
        <div className="mb-7">
          <div className="eyebrow mb-2">Trace · operations</div>
          <h1 className="mono text-[22px] font-semibold tracking-tight">
            Installs
          </h1>
          <p className="mt-2 text-[13px] leading-relaxed text-ink-faint">
            Licence state and command usage for every Mac running Trace.
          </p>
        </div>

        <form action={attempt} className="tile">
          <label
            htmlFor="admin-password"
            className="eyebrow mb-2 block"
          >
            Password
          </label>
          <div className="flex gap-2">
            <input
              id="admin-password"
              type="password"
              name="password"
              autoFocus
              autoComplete="current-password"
              className="field mono flex-1"
            />
            <button className="btn">Enter</button>
          </div>
        </form>

        <p className="mt-4 text-[11.5px] leading-relaxed text-ink-faint">
          This page can switch someone&rsquo;s copy of Trace off. It is not
          indexed and has no other way in.
        </p>
      </div>
    </main>
  );
}
