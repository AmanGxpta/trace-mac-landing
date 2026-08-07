import type { Metadata } from "next";
import { revalidatePath } from "next/cache";
import {
  REFRESH_DAYS,
  fleetSummary,
  isAdmin,
  listInstalls,
  refreshBeta,
  setNote,
  setStatus,
  signIn,
  signOut,
  versionSpread,
} from "@/lib/admin";

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

function relative(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 90) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 48) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function day(date: Date | null): string {
  if (!date) return "—";
  return date.toISOString().slice(0, 10);
}

async function guard() {
  if (!(await isAdmin())) throw new Error("Unauthorized");
}

export default async function InstallsPage() {
  if (!(await isAdmin())) return <SignInForm />;

  const [installs, summary, versions] = await Promise.all([
    listInstalls(),
    fleetSummary(),
    versionSpread(),
  ]);

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
    <main className="mx-auto max-w-6xl px-6 py-10 font-sans">
      <header className="mb-8 flex items-baseline justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Installs</h1>
          <p className="mt-1 text-sm text-ink-faint">
            {summary.activeLast48h} of {summary.total} seen in the last 48 hours
          </p>
        </div>
        <form action={logout}>
          <button className="text-sm text-ink-faint underline underline-offset-4">
            Sign out
          </button>
        </form>
      </header>

      <section className="mb-8">
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-faint">
          Version spread
        </h2>
        <div className="flex flex-wrap gap-2">
          {versions.map((v) => (
            <span
              key={`${v.channel}-${v.version}`}
              className="rounded border border-line2 px-2 py-1 font-mono text-[13px] text-ink"
            >
              {v.channel} {v.version} · {v.count}
            </span>
          ))}
          {versions.length === 0 && (
            <span className="text-sm text-ink-faint">Nothing has checked in yet.</span>
          )}
        </div>
      </section>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-line2 text-left text-xs uppercase tracking-wide text-ink-faint">
              <th className="py-2 pr-3 font-medium">Install</th>
              <th className="py-2 pr-3 font-medium">Build</th>
              <th className="py-2 pr-3 font-medium">Seen</th>
              <th className="py-2 pr-3 font-medium">Licence</th>
              <th className="py-2 pr-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {installs.map((install) => (
              <tr key={install.id} className="border-b border-line2 align-top">
                <td className="py-3 pr-3">
                  <div className="font-mono text-[13px] text-ink">
                    {install.id.slice(0, 8)}
                  </div>
                  <form action={note} className="mt-1 flex gap-1">
                    <input type="hidden" name="id" value={install.id} />
                    <input
                      name="note"
                      defaultValue={install.note ?? ""}
                      placeholder="who is this?"
                      className="w-32 rounded border border-line2 px-1.5 py-0.5 text-xs"
                    />
                    <button className="text-xs text-ink-faint underline underline-offset-2">
                      save
                    </button>
                  </form>
                  {install.idSource !== "serial" && (
                    <div className="mt-1 text-xs text-ink-faint">
                      id from {install.idSource}
                    </div>
                  )}
                  {install.supersededById && (
                    <div className="mt-1 text-xs text-ink-faint">superseded</div>
                  )}
                </td>

                <td className="py-3 pr-3 text-[13px] text-ink">
                  {install.version} ({install.build})
                  <div className="text-xs text-ink-faint">
                    {install.channel} · macOS {install.osVersion} · {install.arch}
                  </div>
                </td>

                <td className="py-3 pr-3 text-[13px] text-ink">
                  {relative(install.lastSeenAt)}
                  <div className="text-xs text-ink-faint">
                    since {day(install.firstSeenAt)}
                  </div>
                </td>

                <td className="py-3 pr-3 text-[13px]">
                  <span
                    className={
                      install.status === "disabled"
                        ? "font-medium text-red-600"
                        : "text-ink"
                    }
                  >
                    {install.status}
                  </span>
                  <div className="text-xs text-ink-faint">
                    expires {day(install.betaExpiresAtOverride)}
                  </div>
                  {/* On the row, not in a log: refreshing is frictionless in
                      both directions, and without a visible count someone on
                      their sixth looks exactly like someone on their first. */}
                  {install.betaRefreshCount > 0 && (
                    <div className="text-xs text-ink-faint">
                      refreshed ×{install.betaRefreshCount}
                      {install.betaRefreshedAt
                        ? `, last ${day(install.betaRefreshedAt)}`
                        : ""}
                    </div>
                  )}
                </td>

                <td className="py-3 pr-3">
                  <div className="flex flex-col gap-1.5">
                    <form action={refresh}>
                      <input type="hidden" name="id" value={install.id} />
                      <button className="rounded border border-line2 px-2 py-1 text-xs text-ink hover:border-accent">
                        Refresh {REFRESH_DAYS} days
                      </button>
                    </form>

                    {install.status === "disabled" ? (
                      <form action={enable}>
                        <input type="hidden" name="id" value={install.id} />
                        <button className="rounded border border-line2 px-2 py-1 text-xs text-ink hover:border-accent">
                          Re-enable
                        </button>
                      </form>
                    ) : (
                      <form action={disable} className="flex gap-1">
                        <input type="hidden" name="id" value={install.id} />
                        <input
                          name="message"
                          placeholder="reason (shown in app)"
                          className="w-40 rounded border border-line2 px-1.5 py-0.5 text-xs"
                        />
                        <button className="rounded border border-line2 px-2 py-1 text-xs text-red-600 hover:border-red-600">
                          Disable
                        </button>
                      </form>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {installs.length === 0 && (
        <p className="mt-6 text-sm text-ink-faint">
          No installs yet. They appear about a minute after an app launches.
        </p>
      )}

      <p className="mt-8 text-xs text-ink-faint">
        A disable reaches an install on its next check-in, and stops being
        enforced if that install cannot reach us for 30 days — an unreachable
        server must never mean a locked app.
      </p>
    </main>
  );
}

function SignInForm() {
  async function attempt(formData: FormData) {
    "use server";
    await signIn(String(formData.get("password") ?? ""));
    revalidatePath(PATH);
  }

  return (
    <main className="mx-auto max-w-sm px-6 py-24 font-sans">
      <h1 className="mb-4 text-lg font-semibold text-ink">Installs</h1>
      <form action={attempt} className="flex gap-2">
        <input
          type="password"
          name="password"
          autoFocus
          className="flex-1 rounded border border-line2 px-2 py-1.5 text-sm"
        />
        <button className="rounded border border-line2 px-3 py-1.5 text-sm text-ink">
          Enter
        </button>
      </form>
    </main>
  );
}
