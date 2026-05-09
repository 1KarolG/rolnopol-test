import { expect, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly heading = this.page.locator('h1');
  readonly loginLink = this.page.getByRole('link', { name: /login|sign in/i });
  readonly body = this.page.locator('body');
  readonly html = this.page.locator('html');
  readonly loginHeading = this.page.getByRole('heading', { name: /login|sign in/i });
  readonly allLinks = this.page.locator('a');

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

  async expectBodyVisible(): Promise<void> {
    await expect(this.body).toBeVisible();
  }

  async expectHtmlVisible(): Promise<void> {
    await expect(this.html).toBeVisible();
  }

  async expectLoginHeadingVisible(): Promise<void> {
    await expect(this.loginHeading).toBeVisible();
  }

  async getAllLinks(): Promise<Locator> {
    return this.allLinks;
  }

  async getLinkCount(): Promise<number> {
    return this.allLinks.count();
  }
}
