import { Resend } from "resend";
import { NextResponse } from "next/server";

// Reads raw headers per-request for signature verification, so it must not
// be statically prerendered.
export const dynamic = "force-dynamic";

const FORWARD_TO = process.env.RESEND_FORWARD_TO;
const FORWARD_FROM = process.env.RESEND_FORWARD_FROM ?? "support@justrytrace.app";

export async function POST(request: Request) {
  const payload = await request.text();

  const apiKey = process.env.RESEND_API_KEY;
  const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;
  if (!apiKey || !webhookSecret) {
    console.error("[resend-webhook] RESEND_API_KEY or RESEND_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  // Instantiated per-request rather than at module scope: the constructor
  // throws on a missing key, which would otherwise break page-data
  // collection at build time whenever the env var isn't set.
  const resend = new Resend(apiKey);

  let event;
  try {
    event = resend.webhooks.verify({
      payload,
      headers: {
        id: request.headers.get("svix-id") ?? "",
        timestamp: request.headers.get("svix-timestamp") ?? "",
        signature: request.headers.get("svix-signature") ?? "",
      },
      webhookSecret,
    });
  } catch (error) {
    console.error("[resend-webhook] signature verification failed", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type !== "email.received") {
    return NextResponse.json({ ok: true });
  }

  if (!FORWARD_TO) {
    console.error("[resend-webhook] RESEND_FORWARD_TO is not set");
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  try {
    await resend.emails.receiving.forward({
      emailId: event.data.email_id,
      to: FORWARD_TO,
      from: FORWARD_FROM,
    });
  } catch (error) {
    console.error("[resend-webhook] forward failed", error);
    return NextResponse.json({ error: "Forward failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
