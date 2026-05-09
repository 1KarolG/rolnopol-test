import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly heading = this.page.locator('h1');
  readonly loginLink = this.page.getByRole('link', { name: /login|sign in/i });

  async open() {
    await this.goto('/');
  }

  async expectMainHeading() {
    await expect(this.heading).toBeVisible();
  }

  async hasLoginLink() {
    return this.loginLink.count().then((count) => count > 0);
  }

  async navigateToLogin() {
    if (await this.hasLoginLink()) {
      await this.loginLink.first().click();
    }
  }
}
