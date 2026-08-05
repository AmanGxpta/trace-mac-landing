import { NextResponse } from "next/server";

/**
 * The Slack OAuth redirect for the Trace Mac app, which does one thing: bounce
 * straight back to the loopback listener on the Mac that started the flow.
 *
 * WHY IT HAS TO BE HERE. Slack forbids "desktop redirects" from requesting bot
 * scopes, and a `localhost`/`127.0.0.1` redirect under PKCE *is* a desktop
 * redirect. Trace needs bot scopes for exactly one thing — replying to you in
 * a DM as @Trace — so the redirect Slack sees has to be an ordinary HTTPS web
 * redirect. That is this route, and it is the whole of Trace's server-side
 * involvement in Slack.
 *
 * WHAT IT CAN AND CANNOT DO. It sees one OAuth authorization code, in transit,
 * once per setup. It can do nothing with it: under PKCE the code is worthless
 * without the `code_verifier`, which is generated inside the Trace process on
 * the user's Mac and never leaves it. So this route cannot obtain a token,
 * cannot read a message, and cannot impersonate anyone — which is what keeps
 * the app's no-infrastructure promise true. A redirect that forwards a query
 * string is a different thing from hosted OAuth, and the difference is the
 * verifier.
 *
 * Consequently: do not log the query string, and do not add analytics to this
 * route. There is nothing here worth capturing and one thing worth not
 * capturing.
 */

// The port Trace's local server listens on by default. Overridable only for
// debug builds, which run on a shifted port so they don't collide with an
// installed copy — see `TraceServer.port` in the Trace repo.
const DEFAULT_PORT = 8787;
const MIN_PORT = 1024;
const MAX_PORT = 65535;

// Reads searchParams, so it must not be statically prerendered.
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const incoming = new URL(request.url).searchParams;

  // Absent in normal use — Trace only sends `port` when a debug build is on a
  // shifted port, so the production redirect URL stays byte-identical to the
  // one registered with Slack. Validated because this value decides where a
  // browser gets sent: the host and path below are fixed and cannot be
  // influenced, but an out-of-range or non-numeric port falls back rather than
  // being trusted.
  const requested = Number(incoming.get("port"));
  const port =
    Number.isInteger(requested) && requested >= MIN_PORT && requested <= MAX_PORT
      ? requested
      : DEFAULT_PORT;

  // Everything else — `code` and `state`, or `error` and `error_description` —
  // is forwarded untouched. TraceServer's /slack/callback route already reads
  // both shapes, including the declined case, and renders the page the user
  // actually sees. Nothing is interpreted here.
  const forwarded = new URLSearchParams(incoming);
  forwarded.delete("port");

  const target = `http://127.0.0.1:${port}/slack/callback?${forwarded.toString()}`;

  // 302 rather than 307/308: this is a GET with no body to preserve, and a
  // temporary redirect is what it is. `no-store` so no cache anywhere holds a
  // URL carrying an authorization code.
  return NextResponse.redirect(target, {
    status: 302,
    headers: {
      "Cache-Control": "no-store, max-age=0",
      "Referrer-Policy": "no-referrer",
    },
  });
}
