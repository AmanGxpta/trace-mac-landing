#!/usr/bin/env node
/**
 * Turns a Playwright run into the two artifacts a remote agent sends back:
 *
 *   e2e/artifacts/summary.txt    the assertion list — the verification
 *   e2e/artifacts/evidence.mp4   the interaction — the receipt
 *
 * Run after `playwright test`. Reads the JSON reporter output rather than
 * re-running anything, so the summary always describes the same run the video
 * came from.
 *
 * Exits non-zero when the run failed. A remote caller decides what to send on
 * that basis, and "the tests failed" has to be distinguishable from "the
 * bundler broke" — hence the distinct exit codes below.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ARTIFACTS = resolve(dirname(fileURLToPath(import.meta.url)), 'artifacts');
const RESULTS = join(ARTIFACTS, 'results.json');

if (!existsSync(RESULTS)) {
  console.error(`No results.json at ${RESULTS} — run \`playwright test\` first.`);
  process.exit(2);
}

/** Playwright nests suites arbitrarily deep; specs are the leaves that matter. */
function collectSpecs(node, out = []) {
  for (const spec of node.specs ?? []) out.push(spec);
  for (const child of node.suites ?? []) collectSpecs(child, out);
  return out;
}

const report = JSON.parse(readFileSync(RESULTS, 'utf8'));
const specs = collectSpecs(report).concat(...(report.suites ?? []).map((s) => collectSpecs(s)));
// A spec can be reached through both walks above; de-duplicate by title+line.
const seen = new Map();
for (const s of specs) seen.set(`${s.file}:${s.line}:${s.title}`, s);
const unique = [...seen.values()];

const passed = unique.filter((s) => s.ok);
const failed = unique.filter((s) => !s.ok);

const lines = [];
lines.push(
  failed.length === 0
    ? `✅ ${passed.length}/${unique.length} assertions passed`
    : `❌ ${failed.length} of ${unique.length} assertions failed`
);
for (const spec of unique) lines.push(`${spec.ok ? '·' : '✗'} ${spec.title}`);

// The first failure's message is the one worth carrying — a phone-sized reply
// with five stack traces in it is a reply nobody reads.
//
// Stripped of ANSI colour first: Playwright writes terminal escapes into the
// JSON report too, and Slack renders them as literal `[2m` noise rather than
// as formatting.
const stripAnsi = (s) => s.replace(/\[[0-9;]*m/g, '');
const firstFailure = failed[0]?.tests?.[0]?.results?.[0]?.error?.message;
if (firstFailure) {
  lines.push('', stripAnsi(firstFailure).split('\n').slice(0, 4).join('\n'));
}

const summary = lines.join('\n');
writeFileSync(join(ARTIFACTS, 'summary.txt'), summary + '\n');
console.log(summary);

// --- video ---------------------------------------------------------------

const videos = readdirSync(ARTIFACTS, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => join(ARTIFACTS, d.name, 'video.webm'))
  .filter(existsSync)
  .sort();

if (videos.length === 0) {
  console.error('\nNo videos found — is `video` enabled in playwright.config.ts?');
  process.exit(failed.length ? 1 : 0);
}

const listFile = join(ARTIFACTS, 'concat.txt');
writeFileSync(listFile, videos.map((v) => `file '${v.replace(/'/g, "'\\''")}'`).join('\n') + '\n');
const output = join(ARTIFACTS, 'evidence.mp4');

try {
  // Re-encoded rather than stream-copied: the sources are VP8 in webm, which
  // Slack renders unreliably, and h264 in mp4 is the format it plays inline.
  // faststart so it begins playing before the whole file arrives.
  execFileSync(
    'ffmpeg',
    [
      '-y', '-loglevel', 'error',
      '-f', 'concat', '-safe', '0', '-i', listFile,
      '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '26',
      '-pix_fmt', 'yuv420p', '-vf', 'scale=1280:-2',
      '-movflags', '+faststart',
      output,
    ],
    { stdio: ['ignore', 'inherit', 'inherit'] }
  );
} catch {
  console.error('\nffmpeg failed — is it installed? (brew install ffmpeg)');
  process.exit(2);
} finally {
  rmSync(listFile, { force: true });
}

const bytes = readFileSync(output).length;
console.log(`\nevidence.mp4 — ${(bytes / 1_000_000).toFixed(1)} MB from ${videos.length} clip(s)`);

// --- visual diffs --------------------------------------------------------

// Written by a failing toHaveScreenshot: expected / actual / diff side by side.
// The diff is the generated equivalent of the before/after a person would have
// assembled by hand, so it ships with the video rather than instead of it.
const diffs = readdirSync(ARTIFACTS, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .flatMap((d) => {
    const dir = join(ARTIFACTS, d.name);
    return readdirSync(dir)
      .filter((f) => f.endsWith('-diff.png'))
      .map((f) => join(dir, f));
  })
  .sort();

if (diffs.length) {
  console.log(`\n${diffs.length} visual diff(s) — the page changed where a baseline said it shouldn't:`);
  for (const d of diffs) console.log(`  ${d}`);
  console.log('If the change was intended: bun run verify:accept, then commit the new baseline.');
}

// The manifest an agent reads to know what to attach, in the order the Slack
// message should carry them: the run first, then what annotates it. Printing
// this rather than leaving it to be inferred is the difference between
// predictable evidence and whatever the agent felt like sending.
const send = [output, ...diffs];
writeFileSync(join(ARTIFACTS, 'artifacts.json'), JSON.stringify({ send }, null, 2) + '\n');
console.log(`\nSEND THESE (${send.length}):`);
for (const f of send) console.log(`  ${f}`);

process.exit(failed.length ? 1 : 0);
