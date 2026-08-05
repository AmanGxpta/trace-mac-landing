import { defineConfig, devices } from '@playwright/test';

/**
 * Verification harness for the remote-agent loop.
 *
 * This config exists to produce two artifacts an agent can send back to Slack
 * when it finishes work: a pass/fail assertion list, and a short video of the
 * interaction that produced it. See Trace's docs/feature-remote-verification.md
 * — the assertions are the verification, the video is the receipt.
 *
 * Headless on purpose. It renders in its own process rather than driving the
 * screen, so this runs with the Mac locked and the lid shut — which is the
 * whole point of starting the work from a phone.
 */
export default defineConfig({
  testDir: './e2e',
  // A remote run has nobody to read a hung test, so fail rather than hang.
  timeout: 30_000,
  expect: {
    timeout: 5_000,
    toHaveScreenshot: {
      // Font rasterisation and antialiasing differ by a pixel or two between
      // runs on the same machine. A hard zero would fail on that noise, and a
      // check that cries wolf is a check everyone learns to ignore — which is
      // worse than not having it.
      maxDiffPixelRatio: 0.01,
      animations: 'disabled',
      caret: 'hide',
      // CSS pixels rather than device pixels, so a baseline taken on a Retina
      // Mac still means something on a machine that isn't one.
      scale: 'css',
    },
  },
  // Retries hide flakes, and a flake reported as a pass is worse than a
  // failure when the person reading it is on a phone and can't check.
  retries: 0,
  reporter: [['list'], ['json', { outputFile: 'e2e/artifacts/results.json' }]],
  outputDir: 'e2e/artifacts',

  use: {
    baseURL: 'http://127.0.0.1:3000',
    // 'on' rather than 'retain-on-failure': a passing run is exactly the case
    // we want footage of, because the question being answered is "does this
    // feel right", not only "did it break".
    video: { mode: 'on', size: { width: 1280, height: 720 } },
    trace: 'retain-on-failure',
    viewport: { width: 1280, height: 720 },
  },

  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],

  webServer: {
    command: 'bun run dev',
    url: 'http://127.0.0.1:3000',
    // Reuse whatever is already up — an agent shouldn't fight a dev server the
    // human left running, and `bun run dev` on an occupied port would.
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
