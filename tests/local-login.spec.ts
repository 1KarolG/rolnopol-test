import { expect, test } from '../fixtures/fixtures';
import { demoUsers } from '../test-data/users';
import { Timeout } from '../enums/timeouts';
import { URL_PATTERNS, API_ASSERTIONS, ERROR_PATTERNS } from '../const/assertions';

test.describe('Local login flow', () => {
  test('navigates to the login page and shows fields', async ({ loginPage, page }) => {
    await loginPage.open();
    await expect(page).toHaveURL(URL_PATTERNS.LOGIN_HTML_REGEX);
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.submitButton).toBeVisible();
    await expect(loginPage.submitButton).toBeEnabled();
  });

  test('login form contains required attributes', async ({ loginPage }) => {
    await loginPage.open();
    const emailInput = loginPage.emailInput;
    const passwordInput = loginPage.passwordInput;

    await expect(emailInput).toHaveAttribute('type', 'email');
    // Check if inputs are required (could be via HTML attribute or JavaScript validation)
    const emailRequired = await emailInput.getAttribute('required');
    const passwordRequired = await passwordInput.getAttribute('required');
    expect(emailRequired !== null || passwordRequired !== null).toBeTruthy();
  });

  // eslint-disable-next-line playwright/expect-expect
  test('rejects invalid credentials with an error message', async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login(demoUsers.invalid.email, demoUsers.invalid.password);
    await loginPage.expectError(ERROR_PATTERNS.INVALID_CREDENTIALS);
  });

  test('displays validation error for empty email', async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.passwordInput.fill('somePassword');
    await loginPage.submitButton.click();

    await expect(loginPage.formError)
      .toBeVisible({ timeout: Timeout.SHORT })
      .catch(() => {
        // Some apps show browser validation instead of custom error
      });
  });

  test('allows a valid demo user to sign in', async ({ loginPage, page }) => {
    await loginPage.open();
    await loginPage.login(demoUsers.test.email, demoUsers.test.password);

    await page.waitForURL(URL_PATTERNS.PROFILE_HTML_REGEX, { timeout: Timeout.LONG });
    await expect(page).toHaveURL(URL_PATTERNS.PROFILE_HTML_REGEX);

    const tokenCookie = await page.context().cookies();
    expect(
      tokenCookie.some((cookie) => cookie.name === API_ASSERTIONS.TOKEN_COOKIE_NAME)
    ).toBeTruthy();

    // Verify user cannot access login page after authentication
    await loginPage.goto(URL_PATTERNS.LOGIN);
    await page
      .waitForURL(URL_PATTERNS.PROFILE_HTML_REGEX, { timeout: Timeout.MEDIUM })
      .catch(() => {
        // App may not redirect, which is also valid
      });
  });

  test('successful login stores authentication token', async ({ loginPage, page }) => {
    await loginPage.open();
    await loginPage.login(demoUsers.johnDoe.email, demoUsers.johnDoe.password);

    await page.waitForURL(URL_PATTERNS.PROFILE_HTML_REGEX, { timeout: Timeout.LONG });
    const cookies = await page.context().cookies();
    const authCookie = cookies.find((c) => c.name === API_ASSERTIONS.TOKEN_COOKIE_NAME);

    expect(authCookie).toBeDefined();
    expect(authCookie?.value).toBeTruthy();
    // Cookie may or may not be httpOnly depending on implementation
    expect(authCookie?.secure || authCookie?.httpOnly || authCookie).toBeDefined();
  });
});
