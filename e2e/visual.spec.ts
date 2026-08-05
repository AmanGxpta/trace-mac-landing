import { test, expect, type Page } from '@playwright/test';

/**
 * Visual regression — the half of the evidence that shouldn't be composed.
 *
 * When one of these fails, Playwright writes `*-expected.png`, `*-actual.png`
 * and `*-diff.png` into the output dir, and `evidence.mjs` picks the diff up
 * and sends it. That is the same before/after a person would have assembled by
 * hand, except it is *generated* — so it looks the same whoever ran it, and it
 * turns up whether or not anyone thought to make one.
 *
 * A failure here is not automatically a bug. Intentional visual changes are
 * meant to fail it once: look at the diff, then `bun run verify:accept` to move
 * the baseline and commit it alongside the change.
 */

/**
 * Waits for the things that actually move a pixel: web fonts (the first paint
 * can use a fallback face and reflow a moment later) and images that haven't
 * decoded yet.
 *
 * Deliberately *not* `waitForLoadState('networkidle')`. Next's dev server holds
 * an HMR connection open, so the network is never idle and that call hangs
 * until the test times out — 30s of nothing, reported as a visual failure.
 * Anyone writing a flow against a dev server will hit this.
 */
async function settle(page: Page) {
  await page.waitForLoadState('load');

  // Walk the page once so anything lazy starts loading. Without this a
  // full-page shot races the loader and half the sections come out blank —
  // and blank is a *stable* wrong answer, so the baseline would bake it in.
  await page.evaluate(async () => {
    const step = window.innerHeight;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
  });

  // Bounded, because both of these can wait forever: a lazy image below the
  // fold never fires onload until it scrolls into view, and `fonts.ready`
  // doesn't settle if a face 404s. An unbounded wait here reads as a visual
  // failure 30 seconds later, which is the least informative way to say
  // "an image didn't load".
  await page.evaluate(() => {
    const cap = new Promise<void>((r) => setTimeout(r, 2000));
    const fonts = document.fonts.ready.then(() => undefined);
    const images = Promise.all(
      Array.from(document.images)
        .filter((img) => !img.complete)
        .map((img) => new Promise<void>((done) => {
          img.onload = () => done();
          img.onerror = () => done();
        }))
    ).then(() => undefined);
    return Promise.race([Promise.all([fonts, images]).then(() => undefined), cap]);
  });

  // One frame for anything that reflowed as the last font landed.
  await page.waitForTimeout(300);
}

/**
 * The version badge in the nav moves with every release and has nothing to do
 * with layout, so it is painted over rather than compared. Masking is better
 * than excluding the nav: everything else up there still gets checked.
 */
function volatileRegions(page: Page) {
  return [page.getByText(/^v\d+\.\d+/).first()];
}

test('hero renders as designed', async ({ page }) => {
  await page.goto('/');
  await settle(page);

  // Scoped to the hero rather than the viewport: this is the region a copy or
  // layout change actually touches, and a tight crop means the diff image is
  // legible on a phone instead of being a full page shrunk to thumbnail size.
  await expect(page.locator('header').first()).toHaveScreenshot('hero.png');
});

test('page below the fold has not shifted', async ({ page }) => {
  await page.goto('/');
  await settle(page);

  // The wide net. The hero shot catches what was edited on purpose; this one
  // catches the section three screens down that moved because of it.
  await expect(page).toHaveScreenshot('full-page.png', {
    fullPage: true,
    mask: volatileRegions(page),
  });
});
