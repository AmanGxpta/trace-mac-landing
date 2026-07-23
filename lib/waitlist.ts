import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

const WAITLIST_PATH = path.join(process.cwd(), "data", "waitlist.json");

interface WaitlistEntry {
  email: string;
  createdAt: string;
  source?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email);
}

export async function addToWaitlist(
  email: string,
  source?: string,
): Promise<void> {
  const normalizedEmail = email.trim().toLowerCase();

  if (!isValidEmail(normalizedEmail)) {
    throw new Error("Invalid email address");
  }

  await mkdir(path.dirname(WAITLIST_PATH), { recursive: true });

  let entries: WaitlistEntry[] = [];
  try {
    const raw = await readFile(WAITLIST_PATH, "utf8");
    entries = JSON.parse(raw) as WaitlistEntry[];
  } catch {
    entries = [];
  }

  const alreadyJoined = entries.some(
    (entry) => entry.email === normalizedEmail,
  );
  if (alreadyJoined) return;

  entries.push({
    email: normalizedEmail,
    createdAt: new Date().toISOString(),
    source,
  });

  await writeFile(WAITLIST_PATH, JSON.stringify(entries, null, 2));
}
