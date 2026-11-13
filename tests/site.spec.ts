import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

for (const scheme of ['light', 'dark'] as const) {
  test.describe(scheme, () => {
    test.beforeEach(async ({ page }) => {
      await page.addInitScript((t) => localStorage.setItem('theme', t), scheme);
    });

    for (const path of ['/', '/blog', '/blog/hello-world']) {
      test(`${path} has no accessibility violations`, async ({ page }) => {
        await page.goto(path);
        await page.waitForLoadState('networkidle');
        await expect(page.locator('html')).toHaveClass(scheme === 'dark' ? /dark/ : /^(?!.*dark)/);
        const results = await new AxeBuilder({ page }).analyze();
        expect(results.violations).toEqual([]);
      });
    }
  });
}

test('home shows the main sections', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('La Yaung Phyo');
  for (const name of ['Selected work', 'About', 'Contact']) {
    await expect(page.getByRole('heading', { level: 2, name })).toBeVisible();
  }
  await expect(page.getByRole('heading', { level: 3, name: 'floodwatch' })).toBeVisible();
});

test('theme toggle switches and persists', async ({ page }) => {
  await page.goto('/');
  const html = page.locator('html');
  await expect(html).not.toHaveClass(/dark/);
  const toggle = page.getByRole('button', { name: 'Switch to dark mode' }).filter({ visible: true });
  if (!(await toggle.count())) await page.getByRole('button', { name: 'Open menu' }).click();
  await toggle.first().click();
  await expect(html).toHaveClass(/dark/);
  await page.reload();
  await expect(html).toHaveClass(/dark/);
});

test('mobile menu marks the current page and closes on navigation', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile', 'the menu only exists on small screens');
  await page.goto('/blog');
  await page.getByRole('button', { name: 'Open menu' }).click();
  const menu = page.getByRole('navigation', { name: 'Mobile' });
  await expect(menu.getByRole('link', { name: 'Blog' })).toHaveAttribute('aria-current', 'true');
  await page.getByRole('button', { name: 'Close menu' }).click();
  await expect(menu).toBeHidden();
  await page.getByRole('button', { name: 'Open menu' }).click();
  await menu.getByRole('link', { name: 'Work' }).click();
  await expect(page).toHaveURL(/\/#work$/);
  await expect(menu).toBeHidden();
});

test('mobile menu scrolls to the section, even when the hash is unchanged', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile', 'the menu only exists on small screens');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const work = page.locator('#work');
  for (let tap = 0; tap < 2; tap++) {
    await page.getByRole('button', { name: 'Open menu' }).click();
    await page.getByRole('navigation', { name: 'Mobile' }).getByRole('link', { name: 'Work' }).click();
    await expect(page).toHaveURL(/\/#work$/);
    await expect(work).toBeInViewport();
    await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }));
    await expect(work).not.toBeInViewport();
  }
});

test('mobile menu stays usable on short screens', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile', 'the menu only exists on small screens');
  await page.setViewportSize({ width: 600, height: 320 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Open menu' }).click();
  const resume = page.getByRole('link', { name: 'Résumé' });
  await resume.scrollIntoViewIfNeeded();
  await expect(resume).toBeInViewport({ ratio: 1 });
  await expect(page.getByRole('button', { name: 'Close menu' })).toBeInViewport({ ratio: 1 });
});

test('mobile menu shows everything on a normal phone without scrolling', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile', 'the menu only exists on small screens');
  await page.goto('/');
  await page.getByRole('button', { name: 'Open menu' }).click();
  const box = await page.getByRole('link', { name: 'Résumé' }).boundingBox();
  const height = page.viewportSize()!.height;
  expect(box!.y + box!.height).toBeLessThanOrEqual(height);
});

test('blog index links to a post and back', async ({ page }) => {
  await page.goto('/blog');
  await page.getByRole('link', { name: /Hello, world/ }).click();
  await expect(page).toHaveURL(/\/blog\/hello-world$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Hello, world' })).toBeVisible();
  await page.getByRole('link', { name: /All posts/ }).click();
  await expect(page).toHaveURL(/\/blog$/);
});

test('rss feed and sitemap are served', async ({ request }) => {
  const rss = await request.get('/blog/rss.xml');
  expect(rss.ok()).toBe(true);
  expect(await rss.text()).toContain('<title>Hello, world</title>');
  expect((await request.get('/sitemap.xml')).ok()).toBe(true);
});

test('unknown routes render the 404 page', async ({ page }) => {
  const res = await page.goto('/nope');
  expect(res?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
});
