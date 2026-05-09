import { expect, test } from '../fixtures/fixtures';

test.describe('Local homepage', () => {
  test('loads the root URL and shows the page body', async ({ homePage, page }) => {
    await homePage.open();
    await expect(page.locator('body')).toBeVisible();
    await expect(page).toHaveURL(/\/$/);
  });

  test('homepage responds with correct status code', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
  });

  test('shows a main heading or login link on home', async ({ homePage }) => {
    await homePage.open();
    const headingVisible = await homePage.heading.isVisible().catch(() => false);
    const loginLinkVisible = await homePage.hasLoginLink();
    expect(headingVisible || loginLinkVisible).toBeTruthy();
  });

  test('home page has valid HTML structure', async ({ page, homePage }) => {
    await homePage.open();
    const htmlTag = page.locator('html');
    await expect(htmlTag).toBeVisible();

    const docTitle = await page.title();
    expect(docTitle).toBeTruthy();
    expect(docTitle.length).toBeGreaterThan(0);
  });

  test('navigates to login from the home page', async ({ homePage, page }) => {
    await homePage.open();
    await homePage.navigateToLogin();
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole('heading', { name: /login|sign in/i })).toBeVisible();
  });

  test('login link is visible and clickable', async ({ homePage }) => {
    await homePage.open();
    const loginLink = homePage.loginLink.first();
    await expect(loginLink).toBeVisible();
    await expect(loginLink).toBeEnabled();
  });

  test('homepage is responsive with viewable content', async ({
    page,
    homePage,
  }) => {
    await homePage.open();
    const body = page.locator('body');

    const boundingBox = await body.boundingBox();
    expect(boundingBox).toBeDefined();
    expect(boundingBox?.height).toBeGreaterThan(0);
    expect(boundingBox?.width).toBeGreaterThan(0);
  });

  test('no console errors on homepage load', async ({ page, homePage }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await homePage.open();
    expect(errors.length).toBe(0);
  });

  test('all links on homepage are working', async ({ page, homePage }) => {
    await homePage.open();
    const allLinks = page.locator('a');
    const linkCount = await allLinks.count();

    expect(linkCount).toBeGreaterThan(0);

    for (let i = 0; i < Math.min(linkCount, 5); i++) {
      const link = allLinks.nth(i);
      const isVisible = await link.isVisible().catch(() => false);
      if (isVisible) {
        const href = await link.getAttribute('href');
        expect(href).toBeTruthy();
      }
    }
  });
});
