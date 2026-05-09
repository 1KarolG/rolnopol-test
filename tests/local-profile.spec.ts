import { expect, test } from '../fixtures/fixtures';
import { demoUsers } from '../test-data/users';
import { Timeout } from '../enums/timeouts';

test.describe('Post-login user experience', () => {
  test.beforeEach(async ({ loginPage, page }) => {
    // Login before each test
    await loginPage.open();
    await loginPage.login(demoUsers.valid.email, demoUsers.valid.password);
    await page.waitForURL('**/profile.html', { timeout: Timeout.LONG });
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
      expect(greeting).toMatch(
        /welcome|hello|greetings|hi|biography|profile|user/i
      );
    });

    test('shows user profile information correctly', async ({ profilePage }) => {
      await profilePage.open();
      await profilePage.expectUserInfoSectionComplete();
      await profilePage.expectUserGreeting(/profile|welcome|user/i);
    });

    test('user email is displayed on profile', async ({ profilePage }) => {
      await profilePage.open();
      await profilePage.expectUserEmailDisplayed(demoUsers.valid.email);
    });

    test('profile header is visible and accessible', async ({ profilePage }) => {
      await profilePage.open();
      await expect(profilePage.profileHeader).toBeVisible();
      const headerText = await profilePage.profileHeader.textContent();
      expect(headerText).toBeTruthy();
      expect(headerText?.length).toBeGreaterThan(0);
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
      expect(linkCount).toBeGreaterThan(0);

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

      await expect(page).toHaveURL('/');
      // Verify we're on the home page (not logged in state)
      const loginLink = page.locator('nav a:has-text("Login")');
      await expect(loginLink).toBeVisible();
    });

    test('authentication token is cleared after logout', async ({
      profilePage,
      page,
    }) => {
      await profilePage.open();
      const cookiesBefore = await page.context().cookies();
      const tokenBefore = cookiesBefore.find((c) => c.name === 'rolnopolToken');
      expect(tokenBefore).toBeDefined();

      await profilePage.logout();

      const cookiesAfter = await page.context().cookies();
      const tokenAfter = cookiesAfter.find((c) => c.name === 'rolnopolToken');
      expect(tokenAfter).toBeUndefined();
    });

    test('cannot access profile after logout', async ({ profilePage, page }) => {
      await profilePage.open();
      await profilePage.logout();

      // Try to navigate back to profile
      await page.goto('/profile.html');
      // Should be redirected to login page
      await expect(page).toHaveURL(/\/login\.html$/);
    });
  });

  test.describe('Session persistence', () => {
    test('user remains logged in after page refresh', async ({
      profilePage,
      page,
    }) => {
      await profilePage.open();
      const cookies = await page.context().cookies();
      expect(cookies.find((c) => c.name === 'rolnopolToken')).toBeDefined();

      await page.reload();
      await expect(profilePage.profileHeader).toBeVisible({ timeout: Timeout.MEDIUM });

      const cookiesAfterRefresh = await page.context().cookies();
      expect(
        cookiesAfterRefresh.find((c) => c.name === 'rolnopolToken')
      ).toBeDefined();
    });

    test('direct navigation to profile works when authenticated', async ({
      profilePage,
    }) => {
      const page = profilePage.page;
      await page.goto('/profile.html');
      await expect(profilePage.profileHeader).toBeVisible({ timeout: Timeout.MEDIUM });
    });
  });

  test.describe('Page content verification', () => {
    test('profile page has valid HTML structure', async ({ page, profilePage }) => {
      await profilePage.open();
      const htmlTag = page.locator('html');
      await expect(htmlTag).toBeVisible();

      const bodyTag = page.locator('body');
      await expect(bodyTag).toBeVisible();
    });

    test('all critical profile sections are present', async ({ profilePage }) => {
      await profilePage.open();

      await expect(profilePage.profileHeader).toBeVisible();
      await expect(profilePage.userInfoSection).toBeVisible();
      await expect(profilePage.mainContent).toBeVisible();
    });

    test('profile page is responsive and readable', async ({
      profilePage,
    }) => {
      await profilePage.open();
      const mainContent = profilePage.mainContent;

      const boundingBox = await mainContent.boundingBox();
      expect(boundingBox).toBeDefined();
      expect(boundingBox?.height).toBeGreaterThan(0);
      expect(boundingBox?.width).toBeGreaterThan(0);
    });
  });

  test.describe('User context after login', () => {
    test('different users can log in and see their data', async ({
      loginPage,
      profilePage,
      page,
    }) => {
      // First logout to test another user
      await profilePage.open();
      await profilePage.logout();

      // Login with different user
      await loginPage.open();
      await loginPage.login(demoUsers.janeSmith.email, demoUsers.janeSmith.password);
      await page.waitForURL('**/profile.html', { timeout: Timeout.LONG });

      // Verify new user is logged in
      await profilePage.open();
      await profilePage.expectUserEmailDisplayed(demoUsers.janeSmith.email);
    });

    test('user email is consistent across page reloads', async ({
      profilePage,
      page,
    }) => {
      await profilePage.open();
      const emailBefore = await profilePage.getUserEmail();

      await page.reload();
      await expect(profilePage.profileHeader).toBeVisible({ timeout: Timeout.MEDIUM });
      const emailAfter = await profilePage.getUserEmail();

      expect(emailAfter).toBe(emailBefore);
    });
  });
});
