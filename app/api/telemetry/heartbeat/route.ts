import { parseHeartbeat, recordHeartbeat } from "@/lib/telemetry";
import { NextResponse } from "next/server";

/**
 * Trace's install check-in. See `lib/telemetry.ts` for the shape and the
 * merge rules; this file is transport only.
 *
 * ## The IP is deliberately not stored
 *
 * The platform hands us `x-forwarded-for` on every request. Storing it would
 * quietly undo the point of hashing the serial in the first place — an opaque
 * install id plus an IP is a person and a location. It is not read here, and it
 * must not start being read.
 *
 * ## The token is checked only once it exists
 *
 * `TELEMETRY_TOKEN` gates the endpoint when it is set, and is ignored when it
 * is not. That ordering is what makes the route deployable before the client
 * that talks to it: ship this, ship the app, then set the variable. Enforcing
 * from the first deploy would reject every install until both sides landed
 * together, which is the release everyone gets wrong.
 *
 * It is obfuscation, not security — it ships inside a downloadable app. The
 * worst case for this endpoint is polluted counts, not compromised users, and
 * pretending otherwise would buy complexity against the wrong threat.
 */
export async function POST(request: Request) {
  const expected = process.env.TELEMETRY_TOKEN;
  if (expected && request.headers.get("x-trace-token") !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = parseHeartbeat(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const verdict = await recordHeartbeat(parsed.value);
    return NextResponse.json(verdict);
  } catch (error) {
    console.error("[telemetry] heartbeat failed", error);
    // The client fails open on any non-answer, so a 500 here costs visibility,
    // never someone's access. Nothing about the failure goes back over the wire.
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
