import { test, expect } from '@playwright/test';

/**
 * The shape every agent-authored flow should follow: drive the real page,
 * assert something a human actually cares about, and leave a video behind.
 *
 * Deliberately read-only. `lib/waitlist.ts` writes to the Postgres named in
 * `.env`, so submitting the waitlist form here would put junk rows in a real
 * table — the "remote agent reaches the production database" property that
 * makes this whole approach possible is also the one that makes a careless
 * test expensive. Nothing in this file submits a form.
 */

test('landing page states the promise above the fold', async ({ page }) => {
  await page.goto('/');

  const h1 = page.getByRole('heading', {
    level: 1,
    name: /the personal context manager for everyone/i,
  });
  await expect(h1).toBeVisible();

  // The sub-headline is the half of the promise that says what Trace *is*, and
  // it only does that job in the position it was asked for: under the h1 and
  // above the email field. Asserting the text alone would still pass if it had
  // drifted below the form, so the order is what's checked here.
  const sub = page.getByText(
    /brings your tasks, ideas, decisions and work history together so you can resume work instantly/i
  );
  await expect(sub).toBeVisible();

  // Scoped to the hero's #waitlist wrapper: the same form is rendered again in
  // the final CTA, and it's specifically the one above the fold that has to sit
  // below the new copy.
  const email = page.locator('#waitlist').getByLabel('Join the waitlist');
  await expect(email).toBeVisible();

  const [h1Y, subY, emailY] = await Promise.all(
    [h1, sub, email].map(async (el) => (await el.boundingBox())!.y)
  );
  expect(h1Y).toBeLessThan(subY);
  expect(subY).toBeLessThan(emailY);

  // The nav is the site's table of contents; a missing entry is the most
  // common thing a layout change silently breaks.
  //
  // Scoped to the nav landmark rather than the page: every one of these labels
  // also appears in the footer, and an unscoped match is ambiguous — which
  // Playwright treats as a failure rather than silently picking one. That
  // strictness is worth keeping, because "the footer link still works" is not
  // the thing being asserted.
  const nav = page.getByRole('navigation');
  for (const label of ['Commands', 'Screens', 'Features', 'Developers', 'Changelog']) {
    await expect(nav.getByRole('link', { name: label, exact: true })).toBeVisible();
  }
});

test('changelog is reachable from the nav and renders entries', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('navigation').getByRole('link', { name: 'Changelog', exact: true }).click();
  await expect(page).toHaveURL(/\/changelog/);

  // A changelog that loads but lists nothing is the actual failure mode worth
  // catching — the route existing proves much less than it looks like.
  await expect(page.getByRole('heading').first()).toBeVisible();
  await expect(page.locator('body')).toContainText(/v?\d+\.\d+/);
});
