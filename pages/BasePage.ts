import { type Page, expect } from '@playwright/test';

export class BasePage {
  constructor(public readonly page: Page) {}

  async goto(path = '/') {
    await this.page.goto(path);
  }

  async expectTitle(text: RegExp | string) {
    await expect(this.page).toHaveTitle(text);
  }
}
