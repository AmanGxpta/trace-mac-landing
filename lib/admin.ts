import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

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

export async function signIn(password: string): Promise<boolean> {
  const want = expected();
  if (!want || !constantTimeEquals(digest(password), want)) return false;

  (await cookies()).set(COOKIE, want, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
    path: "/admin",
  });
  return true;
}

export async function signOut(): Promise<void> {
  (await cookies()).delete({ name: COOKIE, path: "/admin" });
}

// MARK: - Reading

export type InstallRow = Awaited<ReturnType<typeof listInstalls>>[number];

export async function listInstalls() {
  return prisma.install.findMany({
    orderBy: { lastSeenAt: "desc" },
    select: {
      id: true,
      idSource: true,
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
