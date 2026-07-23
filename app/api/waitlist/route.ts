import { addToWaitlist } from "@/lib/waitlist";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const email =
    typeof body === "object" &&
    body !== null &&
    "email" in body &&
    typeof body.email === "string"
      ? body.email
      : null;

  const source =
    typeof body === "object" &&
    body !== null &&
    "source" in body &&
    typeof body.source === "string"
      ? body.source
      : undefined;

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    await addToWaitlist(email, source);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to join waitlist";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
