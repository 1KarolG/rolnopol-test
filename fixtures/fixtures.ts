import { test as base, expect } from '@playwright/test';
import { ApiHelper } from '../helpers/api-helper';
import { MockHelper } from '../helpers/mock-helper';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';

/**
 * Custom fixtures for Playwright tests
 * Provides reusable test utilities and page objects
 */
export const test = base.extend<{
  loginPage: LoginPage;
  homePage: HomePage;
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

  apiHelper: async ({ request }, use) => {
    const apiHelper = new ApiHelper(request);
    await use(apiHelper);
  },

  mockHelper: async ({ page }, use) => {
    const mockHelper = new MockHelper(page);
    await use(mockHelper);
  },
});

/**
 * Re-export expect for convenience
 */
export { expect };
