import { test, expect } from '../fixtures';
import { demoUsers } from '../test-data/users';

test.describe('Local login flow', () => {
  test('navigates to the login page and shows fields', async ({ loginPage }) => {
    await loginPage.open();
  });

  test('rejects invalid credentials with an error message', async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login(demoUsers.invalid.email, demoUsers.invalid.password);
    await loginPage.expectError(/invalid|incorrect|failed|error|credentials/i);
  });

  test('allows a valid demo user to sign in', async ({ loginPage, page }) => {
    await loginPage.open();
    await loginPage.login(demoUsers.valid.email, demoUsers.valid.password);

    await page.waitForURL('**/profile.html', { timeout: 10000 });
    await expect(page).toHaveURL(/\/profile\.html$/);
    const tokenCookie = await page.context().cookies();
    expect(tokenCookie.some((cookie) => cookie.name === 'rolnopolToken')).toBeTruthy();
  });
});
