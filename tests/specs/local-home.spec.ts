import { test, expect } from '../fixtures';

test.describe('Local homepage', () => {
  test('loads the root URL and shows the page body', async ({ homePage, page }) => {
    await homePage.open();
    await expect(page.locator('body')).toBeVisible();
  });

  test('shows a main heading or login link on home', async ({ homePage }) => {
    await homePage.open();
    const headingVisible = await homePage.heading.isVisible().catch(() => false);
    const loginLinkVisible = await homePage.hasLoginLink();
    expect(headingVisible || loginLinkVisible).toBeTruthy();
  });

  test('navigates to login from the home page', async ({ homePage, page }) => {
    await homePage.open();
    await homePage.navigateToLogin();
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole('heading', { name: /login|sign in/i })).toBeVisible();
  });
});
