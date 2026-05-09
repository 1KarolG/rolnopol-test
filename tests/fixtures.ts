import { test as base, expect, Page, APIRequestContext } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';
import { demoUsers } from './test-data/users';

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
 * API test helper class
 * Encapsulates common API test operations
 */
class ApiHelper {
  constructor(private request: APIRequestContext) {}

  async getOpenAPISchema() {
    const response = await this.request.get('/schema/openapi.json');
    if (!response.ok()) {
      throw new Error(`Failed to fetch OpenAPI schema: ${response.status()}`);
    }
    return response.json();
  }

  async checkHealthcheck() {
    const response = await this.request.get('/api/v1/healthcheck');
    return {
      ok: response.ok(),
      status: response.status(),
      body: response.ok() ? await response.json() : null,
    };
  }

  async loginWithCredentials(email: string, password: string) {
    const response = await this.request.post('/api/v1/login', {
      data: { email, password },
    });

    return {
      ok: response.ok(),
      status: response.status(),
      body: await response.json(),
    };
  }

  async loginWithValidUser() {
    return this.loginWithCredentials(demoUsers.valid.email, demoUsers.valid.password);
  }

  async loginWithInvalidCredentials() {
    return this.loginWithCredentials(demoUsers.invalid.email, demoUsers.invalid.password);
  }
}

/**
 * Mock helper class
 * Encapsulates common mock/intercept operations
 */
class MockHelper {
  constructor(private page: Page) {}

  async setupUserProfileMock(mockData: Record<string, unknown> = {}) {
    const defaultData = { name: 'Demo User', role: 'tester' };
    const data = { ...defaultData, ...mockData };

    await this.page.route('**/api/user-profile', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(data),
      });
    });

    return data;
  }

  async evaluateFetch(url: string) {
    return this.page.evaluate(
      async (fetchUrl: string) => {
        const response = await fetch(fetchUrl);
        return response.ok ? response.json() : null;
      },
      url
    );
  }

  async navigateAndFetch(url: string, fetchUrl: string) {
    await this.page.goto(url);
    return this.evaluateFetch(fetchUrl);
  }
}

/**
 * Re-export expect for convenience
 */
export { expect };
