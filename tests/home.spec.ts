import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const SECTIONS = ['home', 'work', 'about', 'now', 'contact'];

function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  return errors;
}

test('renders every section without errors', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('La Yaung Phyo');
  for (const id of SECTIONS) await expect(page.locator(`#${id}`)).toBeAttached();
  await expect(page.locator('#work details')).toHaveCount(5);
  expect(errors).toEqual([]);
});

test('floodwatch starts open and items toggle', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#project-floodwatch')).toHaveAttribute('open', '');
  const cinebook = page.locator('#project-cinebook');
  await expect(cinebook).not.toHaveAttribute('open');
  await cinebook.locator('summary').click();
  await expect(cinebook).toHaveAttribute('open', '');
  await page.keyboard.press('Escape');
  await expect(cinebook).not.toHaveAttribute('open');
});

test('site map lines jump to sections and open projects', async ({ page }) => {
  await page.goto('/');
  const map = page.getByRole('navigation', { name: /tree/ });
  await map.getByRole('link', { name: /cinebook\// }).click();
  await expect(page).toHaveURL(/#project-cinebook$/);
  await expect(page.locator('#project-cinebook')).toHaveAttribute('open', '');
  await map.getByRole('link', { name: /contact\.sh/ }).click();
  await expect(page).toHaveURL(/#contact$/);
});

test('keyboard shortcuts and the command palette', async ({ page, isMobile }) => {
  test.skip(isMobile, 'keyboard shortcuts are a desktop affordance');
  await page.goto('/');
  await page.keyboard.press('2');
  await expect(page).toHaveURL(/#about$/);

  const palette = page.getByRole('dialog', { name: 'command palette' });
  await page.keyboard.press('/');
  await expect(palette).toBeVisible();
  await page.keyboard.type('now');
  await expect(palette.getByRole('option')).toHaveCount(1);
  await page.keyboard.press('Enter');
  await expect(palette).toBeHidden();
  await expect(page).toHaveURL(/#now$/);

  await page.keyboard.press('Control+k');
  await expect(palette).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(palette).toBeHidden();
});

test('the mobile menu opens and closes the palette', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'the menu button only shows on small screens');
  await page.goto('/');
  await page.getByRole('button', { name: /menu/ }).click();
  const palette = page.getByRole('dialog', { name: 'command palette' });
  await expect(palette).toBeVisible();
  await palette.getByRole('button', { name: /close/ }).click();
  await expect(palette).toBeHidden();
});

test('has no serious accessibility violations', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.querySelectorAll('details').forEach((d) => (d.open = true)));
  const { violations } = await new AxeBuilder({ page }).analyze();
  const serious = violations
    .filter((v) => v.impact === 'serious' || v.impact === 'critical')
    .map(
      (v) =>
        `${v.id}: ${v.nodes
          .map((n) => n.target.join(' '))
          .slice(0, 5)
          .join(', ')}`,
    );
  expect(serious).toEqual([]);
});

test('unknown paths get the 404 page', async ({ page }) => {
  const res = await page.goto('/no-such-page');
  expect(res?.status()).toBe(404);
  await expect(page.getByText('no such file or directory')).toBeVisible();
});
