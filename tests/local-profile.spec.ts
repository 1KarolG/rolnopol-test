import { expect, test } from '../fixtures/fixtures';
import { demoUsers } from '../test-data/users';
import { Timeout } from '../enums/timeouts';
import {
  URL_PATTERNS,
  GREETING_PATTERNS,
  API_ASSERTIONS,
  PAGE_ASSERTIONS,
  ELEMENT_ASSERTIONS,
} from '../const/assertions';

test.describe('Post-login user experience', () => {
  test.beforeEach(async ({ loginPage, page }) => {
    // Login before each test with an isolated parallel account
    await loginPage.open();
    await loginPage.login(demoUsers.johnDoe.email, demoUsers.johnDoe.password);
    await page.waitForURL(URL_PATTERNS.PROFILE_HTML_REGEX, { timeout: Timeout.LONG });
  });

  test.describe('Profile page display', () => {
    test('profile page loads successfully after login', async ({ profilePage }) => {
      await profilePage.open();
      await profilePage.expectProfilePageLoaded();
      await expect(profilePage.mainContent).toBeVisible();
    });

    test('displays user greeting with personal message', async ({ profilePage }) => {
      await profilePage.open();
      const greeting = await profilePage.getUserGreeting();
      expect(greeting).toBeTruthy();
      expect(greeting).toMatch(GREETING_PATTERNS.USER_GREETING);
    });

    test('shows user profile information correctly', async ({ profilePage }) => {
      await profilePage.open();
      await profilePage.expectUserInfoSectionComplete();
      await profilePage.expectUserGreeting(GREETING_PATTERNS.PROFILE_HEADER);
    });

    test('profile header is visible and accessible', async ({ profilePage }) => {
      await profilePage.open();
      await expect(profilePage.profileHeader).toBeVisible();
      const headerText = await profilePage.profileHeader.textContent();
      expect(headerText).toBeTruthy();
      expect(headerText?.length).toBeGreaterThan(PAGE_ASSERTIONS.MIN_STRING_LENGTH);
    });
  });

  test.describe('Navigation and menu', () => {
    test('navigation menu is visible on profile', async ({ profilePage }) => {
      await profilePage.open();
      await profilePage.expectNavigationMenuVisible();
    });

    test('navigation contains clickable links', async ({ profilePage }) => {
      await profilePage.open();
      const navLinks = await profilePage.getNavigationLinks();
      const linkCount = await navLinks.count();
      expect(linkCount).toBeGreaterThan(ELEMENT_ASSERTIONS.MIN_COUNT);

      for (let i = 0; i < linkCount; i++) {
        const link = navLinks.nth(i);
        await expect(link).toBeVisible();
        await expect(link).toBeEnabled();
      }
    });
  });

  test.describe('Logout functionality', () => {
    test('logout button is visible and enabled', async ({ profilePage }) => {
      await profilePage.open();
      await profilePage.expectLogoutButtonVisible();
    });

    test('logout button redirects to home page', async ({ profilePage, page }) => {
      await profilePage.open();
      await profilePage.logout();

      await expect(page).toHaveURL(URL_PATTERNS.HOME);
      // Verify we're on the home page (not logged in state)
      await expect(profilePage.loginLink).toBeVisible();
    });

    test('authentication token is cleared after logout', async ({ profilePage, page }) => {
      await profilePage.open();
      const cookiesBefore = await page.context().cookies();
      const tokenBefore = cookiesBefore.find((c) => c.name === API_ASSERTIONS.TOKEN_COOKIE_NAME);
      expect(tokenBefore).toBeDefined();

      await profilePage.logout();

      const cookiesAfter = await page.context().cookies();
      const tokenAfter = cookiesAfter.find((c) => c.name === API_ASSERTIONS.TOKEN_COOKIE_NAME);
      expect(tokenAfter).toBeUndefined();
    });

    test('cannot access profile after logout', async ({ profilePage, page }) => {
      await profilePage.open();
      await profilePage.logout();

      // Try to navigate back to profile
      await page.goto(URL_PATTERNS.PROFILE);
      // Should be redirected to login page
      await expect(page).toHaveURL(URL_PATTERNS.LOGIN_HTML_REGEX);
    });
  });

  test.describe('Session persistence', () => {
    test('user remains logged in after page refresh', async ({ profilePage, page }) => {
      await profilePage.open();
      const cookies = await page.context().cookies();
      expect(cookies.find((c) => c.name === API_ASSERTIONS.TOKEN_COOKIE_NAME)).toBeDefined();

      await page.reload();
      await expect(profilePage.profileHeader).toBeVisible({ timeout: Timeout.MEDIUM });

      const cookiesAfterRefresh = await page.context().cookies();
      expect(
        cookiesAfterRefresh.find((c) => c.name === API_ASSERTIONS.TOKEN_COOKIE_NAME)
      ).toBeDefined();
    });

    test('direct navigation to profile works when authenticated', async ({ profilePage }) => {
      const page = profilePage.page;
      await page.goto(URL_PATTERNS.PROFILE);
      await expect(profilePage.profileHeader).toBeVisible({ timeout: Timeout.MEDIUM });
    });
  });

  test.describe('Page content verification', () => {
    test('profile page has valid HTML structure', async ({ profilePage }) => {
      await profilePage.open();
      await profilePage.expectHtmlVisible();

      await expect(profilePage.body).toBeVisible();
    });

    test('all critical profile sections are present', async ({ profilePage }) => {
      await profilePage.open();

      await expect(profilePage.profileHeader).toBeVisible();
      await expect(profilePage.userInfoSection).toBeVisible();
      await expect(profilePage.mainContent).toBeVisible();
    });

    test('profile page is responsive and readable', async ({ profilePage }) => {
      await profilePage.open();
      const mainContent = profilePage.mainContent;

      const boundingBox = await mainContent.boundingBox();
      expect(boundingBox).toBeDefined();
      expect(boundingBox?.height).toBeGreaterThan(0);
      expect(boundingBox?.width).toBeGreaterThan(0);
    });
  });
});
