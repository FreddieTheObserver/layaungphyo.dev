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
  const toggle = page.getByRole('button', { name: 'Switch to dark mode' });
  await toggle.first().click();
  await expect(html).toHaveClass(/dark/);
  await page.reload();
  await expect(html).toHaveClass(/dark/);
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
