import { test as base, expect } from '@playwright/test';
import { ApiHelper } from '../helpers/api-helper';
import { MockHelper } from '../helpers/mock-helper';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { ProfilePage } from '../pages/ProfilePage';

/**
 * Custom fixtures for Playwright tests
 * Provides reusable test utilities and page objects
 */
export const test = base.extend<{
  loginPage: LoginPage;
  homePage: HomePage;
  profilePage: ProfilePage;
  apiHelper: ApiHelper;
  mockHelper: MockHelper;
}>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },

  profilePage: async ({ page }, use) => {
    const profilePage = new ProfilePage(page);
    await use(profilePage);
  },

  apiHelper: async ({ request }, use) => {
    const apiHelper = new ApiHelper(request);
    await use(apiHelper);
  },

  mockHelper: async ({ page }, use) => {
    const mockHelper = new MockHelper(page);
    await use(mockHelper);
  },
});

// Global cleanup fixture - clears cookies and local storage after each test
test.afterEach(async ({ page }) => {
  // Clear browser cookies and permissions to avoid cross-test state
  await page.context().clearCookies();
  await page.context().clearPermissions();

  try {
    const pageUrl = page.url();
    if (
      pageUrl === 'about:blank' ||
      pageUrl.startsWith('http://') ||
      pageUrl.startsWith('https://')
    ) {
      await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });
    }
  } catch (error) {
    // Ignore storage cleanup failures for pages without accessible storage or cross-origin contexts
  }
});

/**
 * Re-export expect for convenience
 */
export { expect };
