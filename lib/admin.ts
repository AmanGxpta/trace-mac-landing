import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { decryptSerial } from "@/lib/serial";

/**
 * The control plane behind /admin/installs.
 *
 * One password in an environment variable, checked against a cookie. That is
 * deliberately the whole of it: this page turns one person's app on and off and
 * is used by one person, so a session store, a user table and a login flow
 * would be more moving parts than the thing they protect.
 */

const COOKIE = "trace_admin";

/** The cookie holds a digest, so the password itself is never stored in a jar. */
function digest(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

function expected(): string | null {
  const password = process.env.ADMIN_PASSWORD;
  return password ? digest(password) : null;
}

function constantTimeEquals(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  // timingSafeEqual throws on a length mismatch, which would itself leak.
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export async function isAdmin(): Promise<boolean> {
  const want = expected();
  // No password configured means no access, rather than open access. The
  // failure mode of the other choice is a public kill switch.
  if (!want) return false;
  const got = (await cookies()).get(COOKIE)?.value;
  return !!got && constantTimeEquals(got, want);
}

/** Every attribute the cookie is written with, so clearing can match them. */
const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/admin",
} as const;

export async function signIn(password: string): Promise<boolean> {
  const want = expected();
  if (!want || !constantTimeEquals(digest(password), want)) return false;

  (await cookies()).set(COOKIE, want, {
    ...COOKIE_OPTIONS,
    maxAge: 60 * 60 * 24 * 30,
  });
  return true;
}

/**
 * Overwrites with an expired cookie rather than calling `delete`.
 *
 * A cookie is identified by name *and* path, and `delete` did not reliably
 * carry the `/admin` path this one is scoped to — so the browser kept it and
 * signing out silently did nothing, which on a page that can switch someone's
 * app off is the wrong thing to get subtly wrong. Writing the same attributes
 * back with `maxAge: 0` is unambiguous.
 */
export async function signOut(): Promise<void> {
  (await cookies()).set(COOKIE, "", { ...COOKIE_OPTIONS, maxAge: 0 });
}

// MARK: - Looking someone up

/**
 * Turns a Mac serial into the install id derived from it.
 *
 * This is the other half of hashing the serial in the first place, and without
 * it the privacy choice is just an obstacle: the whole argument for storing a
 * digest was that support still works, *because the hash is deterministic and
 * we can recompute it*. That claim is only true if something here actually
 * recomputes it.
 *
 * Must use the same pepper the app was built with (`TRACE_TELEMETRY_PEPPER` in
 * the Xcode build settings) or every lookup silently misses. Returns null when
 * unset rather than hashing with an empty pepper and confidently finding
 * nothing.
 */
export function installIdForSerial(serial: string): string | null {
  const pepper = process.env.TELEMETRY_PEPPER;
  if (!pepper) return null;

  const trimmed = serial.trim();
  if (!trimmed) return null;

  const hash = createHash("sha256");
  hash.update(Buffer.from(pepper, "utf8"));
  // The app writes a single zero byte between the two, so a pepper ending "AB"
  // with serial "CD" can't collide with one ending "A" and serial "BCD".
  hash.update(Buffer.from([0]));
  hash.update(Buffer.from(trimmed, "utf8"));
  return hash.digest("hex").slice(0, 32);
}

const INSTALL_ID_RE = /^[0-9a-f]{32}$/i;

/**
 * Resolves whatever support pasted into the box.
 *
 * Accepts a full install id, the 8-character Machine ID shown in `/config`, or
 * a raw Mac serial. Apple prints serials uppercase and `IOPlatformSerialNumber`
 * returns them that way, but someone typing one out by hand will not always —
 * so both spellings are tried rather than making the person guess which one the
 * hash wants.
 */
export async function findInstalls(query: string) {
  const q = query.trim();
  if (!q) return [];

  const candidates = new Set<string>();
  if (INSTALL_ID_RE.test(q)) candidates.add(q.toLowerCase());
  for (const spelling of [q, q.toUpperCase()]) {
    const id = installIdForSerial(spelling);
    if (id) candidates.add(id);
  }

  const rows = await prisma.install.findMany({
    where: {
      OR: [
        { id: { in: [...candidates] } },
        // The 8 characters someone reads off the /config panel.
        { id: { startsWith: q.toLowerCase() } },
        { note: { contains: q, mode: "insensitive" } },
      ],
    },
    orderBy: { lastSeenAt: "desc" },
    take: 20,
  });
  return decorate(rows);
}

/** True when serial lookup can work at all — surfaced so the UI can say so. */
export function serialLookupConfigured(): boolean {
  return !!process.env.TELEMETRY_PEPPER;
}

// MARK: - Reading

export type InstallRow = Awaited<ReturnType<typeof listInstalls>>[number];

/**
 * Swaps the stored ciphertext for the serial itself.
 *
 * Done here, once, so no page ever holds a `serialCipher` it might render by
 * accident — the views only ever see either a real serial or null.
 */
export function withSerial<T extends { serialCipher: string | null }>(
  row: T,
): Omit<T, "serialCipher"> & { serial: string | null } {
  const { serialCipher, ...rest } = row;
  return { ...rest, serial: decryptSerial(serialCipher) };
}

/** Hours after which an install counts as gone quiet rather than live. */
export const QUIET_AFTER_HOURS = 48;

/**
 * Attaches how long ago an install was heard from.
 *
 * Computed here rather than in the page because reading the clock is impure,
 * and a component that does it during render can produce a different answer
 * every time React happens to re-run it. Fetching is the honest place for
 * "what time is it now".
 */
function withFreshness<T extends { lastSeenAt: Date }>(row: T, now: number) {
  const seconds = Math.floor((now - row.lastSeenAt.getTime()) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  const seenAgo =
    seconds < 90
      ? "just now"
      : minutes < 60
        ? `${minutes}m ago`
        : hours < 48
          ? `${hours}h ago`
          : `${Math.floor(hours / 24)}d ago`;

  return { ...row, seenAgo, isQuiet: hours >= QUIET_AFTER_HOURS };
}

function decorate<T extends { serialCipher: string | null; lastSeenAt: Date }>(
  rows: T[],
) {
  const now = Date.now();
  return rows.map((row) => withFreshness(withSerial(row), now));
}

export async function listInstalls() {
  const rows = await prisma.install.findMany({
    orderBy: { lastSeenAt: "desc" },
    select: {
      id: true,
      idSource: true,
      serialCipher: true,
      note: true,
      version: true,
      build: true,
      channel: true,
      osVersion: true,
      arch: true,
      firstSeenAt: true,
      lastSeenAt: true,
      status: true,
      statusMessage: true,
      betaExpiresAtOverride: true,
      betaRefreshedAt: true,
      betaRefreshCount: true,
      supersededById: true,
    },
  });
  return decorate(rows);
}

/** The two numbers worth having above the table. */
export async function fleetSummary() {
  const dayAgo = new Date(Date.now() - 48 * 3600 * 1000);
  const [total, active] = await Promise.all([
    prisma.install.count({ where: { supersededById: null } }),
    prisma.install.count({
      where: { supersededById: null, lastSeenAt: { gte: dayAgo } },
    }),
  ]);
  return { total, activeLast48h: active };
}

/** Version spread, so "did the update land" is answerable at a glance. */
export async function versionSpread() {
  const rows = await prisma.install.groupBy({
    by: ["channel", "version"],
    _count: { _all: true },
    where: { supersededById: null },
    orderBy: [{ channel: "asc" }, { version: "desc" }],
  });
  return rows.map((r) => ({
    channel: r.channel,
    version: r.version,
    count: r._count._all,
  }));
}

// MARK: - Command usage

/**
 * What one install has actually used, by verb.
 *
 * Split by source rather than summed, because the split is the interesting
 * part: a verb with a big `agent` number and no `ui` number is being scripted,
 * not loved, and totalling them would report the opposite of the truth.
 */
export async function commandUsageForInstall(installId: string) {
  const rows = await prisma.commandUsageDaily.groupBy({
    by: ["verb", "source"],
    where: { installId },
    _sum: { count: true },
  });

  const byVerb = new Map<
    string,
    { verb: string; ui: number; agent: number; voice: number; total: number }
  >();

  for (const row of rows) {
    const entry = byVerb.get(row.verb) ?? {
      verb: row.verb,
      ui: 0,
      agent: 0,
      voice: 0,
      total: 0,
    };
    const n = row._sum.count ?? 0;
    if (row.source === "ui") entry.ui += n;
    else if (row.source === "agent") entry.agent += n;
    else if (row.source === "voice") entry.voice += n;
    entry.total += n;
    byVerb.set(row.verb, entry);
  }

  return [...byVerb.values()].sort((a, b) => b.total - a.total);
}

/** Days this install has any recorded command activity, newest first. */
export async function activeDaysForInstall(installId: string) {
  const rows = await prisma.commandUsageDaily.groupBy({
    by: ["day"],
    where: { installId },
    _sum: { count: true },
    orderBy: { day: "desc" },
    take: 30,
  });
  return rows.map((r) => ({ day: r.day, count: r._sum.count ?? 0 }));
}

/**
 * The fleet-wide leaderboard — which features are actually earning their keep.
 *
 * Typed use only. Agent traffic is a different question ("what do agents
 * automate") and mixing it in here would make a scripted verb look like a
 * beloved one, which is the exact mistake the source tag exists to prevent.
 */
export async function topCommands(days = 30) {
  const since = new Date(Date.now() - days * 86400 * 1000);
  const rows = await prisma.commandUsageDaily.groupBy({
    by: ["verb"],
    where: { source: "ui", day: { gte: since } },
    _sum: { count: true },
    orderBy: { _sum: { count: "desc" } },
    take: 15,
  });

  // How many *distinct installs* used each verb — the number that separates
  // "everyone touches it once" from "two people live in it".
  //
  // Raw SQL because Prisma's groupBy `_count` counts rows, and the primary key
  // here includes `day` — so one person using a verb on ten days would come
  // back as ten people.
  const reach = await prisma.$queryRaw<{ verb: string; installs: bigint }[]>`
    SELECT "verb", COUNT(DISTINCT "installId") AS installs
    FROM "command_usage_daily"
    WHERE "source" = 'ui' AND "day" >= ${since}::date
    GROUP BY "verb"
  `;
  const reachByVerb = new Map(reach.map((r) => [r.verb, Number(r.installs)]));

  return rows.map((r) => ({
    verb: r.verb,
    count: r._sum.count ?? 0,
    installs: reachByVerb.get(r.verb) ?? 0,
  }));
}

// MARK: - Writing

export async function setStatus(
  installId: string,
  status: "active" | "disabled",
  message?: string,
) {
  await prisma.install.update({
    where: { id: installId },
    data: {
      status,
      // A message only makes sense attached to a disable; clearing it on the
      // way back out stops a stale reason reappearing at the next disable.
      statusMessage: status === "disabled" ? (message?.trim() || null) : null,
    },
  });
}

/** Length of a granted round. Matches TRACE_BETA_DAYS in the app. */
export const REFRESH_DAYS = 30;

/**
 * Grants another full window, starting now.
 *
 * Computes the date here, once, and stores it — the heartbeat then resends that
 * same absolute value every time. A "refresh" flag on the response would be
 * unreplayable if the delivery dropped and would double-apply if it retried.
 *
 * This cannot shorten anyone's window: `now + 30` is always at or beyond
 * `activatedAt + 30`, because `now` is at or beyond `activatedAt`. The app
 * still takes the later of its own date and this one, but there is no gesture
 * here that could produce a worse one.
 */
export async function refreshBeta(installId: string) {
  const now = new Date();
  const expires = new Date(now.getTime() + REFRESH_DAYS * 86400 * 1000);

  await prisma.install.update({
    where: { id: installId },
    data: {
      betaRefreshedAt: now,
      betaExpiresAtOverride: expires,
      betaRefreshCount: { increment: 1 },
    },
  });
}

export async function setNote(installId: string, note: string) {
  await prisma.install.update({
    where: { id: installId },
    data: { note: note.trim() || null },
  });
}
