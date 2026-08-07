import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

/**
 * Encryption for the one genuinely identifying field Trace sends.
 *
 * The install id is a hash and cannot be read back, which is right for a
 * primary key and useless in a support conversation. So the Mac serial is
 * stored too — but encrypted, under a key that lives in the environment rather
 * than the database. A stolen dump is then still not a list of
 * warranty-resolvable Macs; it takes the database *and* the deployment's
 * secrets, which is a meaningfully higher bar than one of them.
 *
 * AES-256-GCM, random IV per record, authentication tag stored alongside. The
 * tag matters: without it a tampered ciphertext decrypts to plausible garbage
 * instead of failing, and this value is shown to a human as fact.
 *
 * Format: `v1.<iv-b64>.<tag-b64>.<ciphertext-b64>` — versioned so the scheme
 * can be changed later without guessing at what old rows are.
 */

const PREFIX = "v1";

function key(): Buffer | null {
  const raw = process.env.TELEMETRY_SERIAL_KEY;
  if (!raw) return null;
  // 32 bytes as hex. Generate with: openssl rand -hex 32
  const buf = Buffer.from(raw.trim(), "hex");
  return buf.length === 32 ? buf : null;
}

/** True when serials can be stored and read back at all. */
export function serialKeyConfigured(): boolean {
  return key() !== null;
}

/**
 * Returns null when no key is configured, so a missing key means the column
 * stays empty rather than silently filling with something unreadable.
 */
export function encryptSerial(serial: string): string | null {
  const k = key();
  if (!k) return null;

  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", k, iv);
  const enc = Buffer.concat([cipher.update(serial, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();

  return [
    PREFIX,
    iv.toString("base64"),
    tag.toString("base64"),
    enc.toString("base64"),
  ].join(".");
}

/**
 * Returns null on anything that doesn't decrypt cleanly — wrong key, tampered
 * value, unknown version. The caller shows a placeholder; it must never show a
 * guess, because the whole point of this field is that someone reads it out
 * loud to a customer.
 */
export function decryptSerial(stored: string | null): string | null {
  if (!stored) return null;
  const k = key();
  if (!k) return null;

  const parts = stored.split(".");
  if (parts.length !== 4 || parts[0] !== PREFIX) return null;

  try {
    const decipher = createDecipheriv(
      "aes-256-gcm",
      k,
      Buffer.from(parts[1], "base64"),
    );
    decipher.setAuthTag(Buffer.from(parts[2], "base64"));
    return Buffer.concat([
      decipher.update(Buffer.from(parts[3], "base64")),
      decipher.final(),
    ]).toString("utf8");
  } catch {
    return null;
  }
}
