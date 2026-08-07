import { prisma } from "@/lib/prisma";
import { Prisma } from "@/lib/generated/prisma/client";

/**
 * Trace's install check-in.
 *
 * One call does two jobs: it tells us the install is alive and what version it
 * is on, and its *response* is the licence — whether this Mac may still run,
 * and until when. That pairing is deliberate. A separate licence poll would be
 * a second clock that can disagree with this one about whether an install is
 * live.
 *
 * The command counts are the only optional part of the payload, and they arrive
 * pre-aggregated by the app: a verb, a day, a source, a number. Nothing the
 * user typed is in here, and `CommandUsageDaily` has no column that could hold
 * it if it were.
 */

/**
 * Every slash command Trace will send, under its canonical name.
 *
 * Mirrors `SlashCommandCatalog` in the Trace repo. Users can rename commands,
 * and a renamed spelling is user-authored text — the app maps back to these
 * before counting, so nothing here should ever be a name someone chose.
 *
 * `__unknown` is what an unparseable verb is counted as. The count is useful
 * (people are reaching for verbs that don't exist); the text they typed is not
 * collected.
 */
export const CANONICAL_VERBS = new Set([
  "add-tag",
  "agent-logs",
  "canvas",
  "capture-screen",
  "claude-key",
  "claude-usage",
  "claude-usage-advanced",
  "cli",
  "config",
  "create-section",
  "delete-project",
  "done",
  "filter",
  "find",
  "help",
  "hide-tags",
  "inbox",
  "linear-connect",
  "linear-disconnect",
  "linear-sync",
  "log",
  "new",
  "recap",
  "remove-section",
  "remove-tag",
  "rename-project",
  "show-active",
  "show-all",
  "show-tags",
  "slack-connect",
  "slack-disconnect",
  "slack-sync",
  "task",
  "temp-logs",
  "trust",
  "usage",
  "weekly",
  "whatsonmyplate",
  "work",
  "__unknown",
]);

/** Typed by a person, driven by an agent over MCP, or spoken. */
export const SOURCES = new Set(["ui", "agent", "voice"]);

const ID_SOURCES = new Set(["serial", "uuid", "random"]);
const CHANNELS = new Set(["beta", "public"]);

/** `install_id` is 128 bits of hex we generated — anything else is junk. */
const INSTALL_ID_RE = /^[0-9a-f]{32}$/;
const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;

/** Bounds a single request. A year of heavy use is a few hundred rows. */
const MAX_COMMAND_ROWS = 2000;

/**
 * Writes are skipped for a check-in that arrives sooner than this after the
 * last one. The real cadence is twelve hours, so this only ever catches a retry
 * storm or someone poking the endpoint.
 *
 * Deliberately **drops the write, not the response**: a rate-limited install
 * still gets its verdict. Withholding that would mean a client hammering us is
 * also a client that can't learn it's been disabled.
 */
const MIN_INTERVAL_SECONDS = 10;

export type CommandRow = {
  day: string;
  verb: string;
  source: string;
  count: number;
};

export type Heartbeat = {
  installId: string;
  idSource: string;
  version: string;
  build: string;
  channel: string;
  osVersion: string;
  arch: string;
  firstSeenAt: Date;
  betaExpiresAt: Date | null;
  betaState: string | null;
  /**
   * `null` when the user has the toggle off, which is a different fact from an
   * empty array (on, but nothing used today) and is stored as such.
   */
  commands: CommandRow[] | null;
  /** Rows dropped for an unrecognised verb or source — see `parseHeartbeat`. */
  dropped: number;
};

export type Verdict = {
  status: "active" | "disabled";
  message: string | null;
  /** Unix seconds, or null when no refresh has been granted. */
  beta_expires_at: number | null;
  /** Command rows up to and including this day may be deleted by the app. */
  ack_through: string | null;
};

type ParseResult =
  | { ok: true; value: Heartbeat }
  | { ok: false; error: string };

// MARK: - Validation

function str(
  body: Record<string, unknown>,
  key: string,
  maxLength: number,
): string | null {
  const value = body[key];
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > maxLength) return null;
  return trimmed;
}

/** Unix seconds to a Date, rejecting anything outside a sane window. */
function timestamp(value: unknown): Date | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  // 2020-01-01 .. 2100-01-01. A clock this far out is a broken device, and its
  // dates would sort ahead of every real row forever.
  if (value < 1577836800 || value > 4102444800) return null;
  return new Date(value * 1000);
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Validates the wire shape.
 *
 * Unknown *verbs and sources are dropped, not rejected* — the request still
 * lands with the rows we understood. Rejecting outright would mean that the day
 * Trace ships a new slash command, every updated install loses all of its
 * telemetry until the server catches up, which inverts the deployment order:
 * the client would only be safe to release *after* the server knew about it.
 * Dropping keeps the two independently deployable, and `dropped` makes the
 * disagreement visible rather than silent.
 *
 * Malformed *envelopes* are still rejected, because those are junk rather than
 * a version skew.
 */
export function parseHeartbeat(raw: unknown): ParseResult {
  if (!isPlainObject(raw)) return { ok: false, error: "Invalid request body" };

  const installId = str(raw, "install_id", 32);
  if (!installId || !INSTALL_ID_RE.test(installId)) {
    return { ok: false, error: "install_id must be 32 lowercase hex characters" };
  }

  const idSource = str(raw, "id_source", 16);
  if (!idSource || !ID_SOURCES.has(idSource)) {
    return { ok: false, error: "id_source must be serial, uuid, or random" };
  }

  const channel = str(raw, "channel", 16);
  if (!channel || !CHANNELS.has(channel)) {
    return { ok: false, error: "channel must be beta or public" };
  }

  const version = str(raw, "version", 32);
  const build = str(raw, "build", 32);
  const osVersion = str(raw, "os_version", 32);
  const arch = str(raw, "arch", 16);
  if (!version || !build || !osVersion || !arch) {
    return { ok: false, error: "Missing version, build, os_version, or arch" };
  }

  const firstSeenAt = timestamp(raw["first_seen_at"]);
  if (!firstSeenAt) {
    return { ok: false, error: "first_seen_at must be a unix timestamp" };
  }

  let betaExpiresAt: Date | null = null;
  let betaState: string | null = null;
  if (isPlainObject(raw["beta"])) {
    const beta = raw["beta"];
    betaExpiresAt = timestamp(beta["expires_at"]);
    betaState = typeof beta["state"] === "string" ? beta["state"].slice(0, 32) : null;
  }

  // Absent means the user turned command sharing off. An empty array means it
  // is on and nothing was used — a different fact, kept distinct.
  let commands: CommandRow[] | null = null;
  let dropped = 0;

  if (raw["commands"] !== undefined) {
    if (!Array.isArray(raw["commands"])) {
      return { ok: false, error: "commands must be an array" };
    }
    if (raw["commands"].length > MAX_COMMAND_ROWS) {
      return { ok: false, error: "Too many command rows" };
    }

    commands = [];
    for (const entry of raw["commands"]) {
      if (!isPlainObject(entry)) {
        dropped++;
        continue;
      }
      const day = typeof entry["day"] === "string" ? entry["day"] : "";
      const verb = typeof entry["verb"] === "string" ? entry["verb"] : "";
      const source = typeof entry["source"] === "string" ? entry["source"] : "";
      const count = entry["count"];

      const valid =
        DAY_RE.test(day) &&
        !Number.isNaN(Date.parse(`${day}T00:00:00Z`)) &&
        CANONICAL_VERBS.has(verb) &&
        SOURCES.has(source) &&
        typeof count === "number" &&
        Number.isInteger(count) &&
        count > 0 &&
        count <= 1_000_000;

      if (!valid) {
        dropped++;
        continue;
      }
      commands.push({ day, verb, source, count });
    }
  }

  return {
    ok: true,
    value: {
      installId,
      idSource,
      version,
      build,
      channel,
      osVersion,
      arch,
      firstSeenAt,
      betaExpiresAt,
      betaState,
      commands,
      dropped,
    },
  };
}

// MARK: - Recording

/**
 * The newest day the app may delete locally.
 *
 * **Everything strictly below the newest day in the payload**, which is a
 * deliberately conservative rule and the one place this design could go quietly
 * wrong.
 *
 * Counts merge with `GREATEST`, not `+=`, so that a resent day can't double
 * itself. That is only correct while a day's local counter rises monotonically
 * — and it stops rising monotonically the moment the app deletes a day that is
 * still being written to. Acking the current day would have the app drop a row
 * at 12, count 3 more, resend 3, and `GREATEST(12, 3)` would keep 12 while the
 * truth was 15.
 *
 * So the newest day in any payload is never acked: it may well be today. The
 * cost is that one already-complete day gets resent once more after an offline
 * stretch, which is idempotent and a few bytes.
 */
function ackThrough(commands: CommandRow[]): string | null {
  if (commands.length === 0) return null;
  const days = [...new Set(commands.map((c) => c.day))].sort();
  return days.length < 2 ? null : days[days.length - 2];
}

/** What the app is told, given the install's row. */
function verdictFor(install: {
  status: string;
  statusMessage: string | null;
  betaExpiresAtOverride: Date | null;
}): Omit<Verdict, "ack_through"> {
  return {
    status: install.status === "disabled" ? "disabled" : "active",
    message: install.statusMessage,
    beta_expires_at: install.betaExpiresAtOverride
      ? Math.floor(install.betaExpiresAtOverride.getTime() / 1000)
      : null,
  };
}

/**
 * Upserts the install, merges any command counts, and returns the verdict.
 */
export async function recordHeartbeat(hb: Heartbeat): Promise<Verdict> {
  const now = new Date();

  const existing = await prisma.install.findUnique({
    where: { id: hb.installId },
    select: {
      status: true,
      statusMessage: true,
      betaExpiresAtOverride: true,
      lastSeenAt: true,
    },
  });

  // Too soon since the last one: keep the row as it stands, but still answer.
  if (
    existing &&
    now.getTime() - existing.lastSeenAt.getTime() < MIN_INTERVAL_SECONDS * 1000
  ) {
    return { ...verdictFor(existing), ack_through: null };
  }

  const fields = {
    idSource: hb.idSource,
    lastSeenAt: now,
    version: hb.version,
    build: hb.build,
    channel: hb.channel,
    osVersion: hb.osVersion,
    arch: hb.arch,
    betaExpiresAt: hb.betaExpiresAt,
    betaState: hb.betaState,
  };

  const install = await prisma.install.upsert({
    where: { id: hb.installId },
    // `firstSeenAt` is set once, on create, and never updated. It is the app's
    // own reckoning of when this install began, and the answer to "how long has
    // this person actually had Trace" — which is exactly the question a beta
    // refresh would otherwise erase.
    create: { id: hb.installId, firstSeenAt: hb.firstSeenAt, ...fields },
    update: fields,
    select: {
      status: true,
      statusMessage: true,
      betaExpiresAtOverride: true,
    },
  });

  if (hb.commands && hb.commands.length > 0) {
    await mergeCommandCounts(hb.installId, hb.commands);
  }

  return {
    ...verdictFor(install),
    ack_through: hb.commands ? ackThrough(hb.commands) : null,
  };
}

/**
 * One statement for the whole batch, merging with `GREATEST` so a resent day
 * settles at the true count instead of accumulating one copy per delivery.
 */
async function mergeCommandCounts(installId: string, rows: CommandRow[]) {
  const values = Prisma.join(
    rows.map(
      (r) =>
        Prisma.sql`(${installId}, ${r.day}::date, ${r.verb}, ${r.source}, ${r.count})`,
    ),
  );

  await prisma.$executeRaw`
    INSERT INTO "command_usage_daily" ("installId", "day", "verb", "source", "count")
    VALUES ${values}
    ON CONFLICT ("installId", "day", "verb", "source")
    DO UPDATE SET "count" = GREATEST("command_usage_daily"."count", EXCLUDED."count")
  `;
}
