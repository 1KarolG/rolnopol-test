import { test as base, Page } from '@playwright/test';

/**
 * Mock helper class
 * Encapsulates common mock/intercept operations
 */
export class MockHelper {
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
