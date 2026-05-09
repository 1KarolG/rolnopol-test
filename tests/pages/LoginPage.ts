import { expect, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly emailInput = this.page.locator('[data-testid="email-input"]');
  readonly passwordInput = this.page.locator('[data-testid="password-input"]');
  readonly submitButton = this.page.locator('[data-testid="login-submit-btn"]');
  readonly formError = this.page.locator('[role="alert"], .error, .error-message');
  readonly loginForm = this.page.locator('[data-testid="login-form"]');
  readonly loginMessage = this.page.locator('[data-testid="login-message"]');

  constructor(page: Page) {
    super(page);
  }

  async open() {
    await this.goto('/login.html');

    if (await this.loginForm.count() === 0) {
      await this.goto('/');
      const loginLink = this.page.getByRole('link', { name: /login|sign in/i }).first();
      if (await loginLink.count()) {
        await loginLink.click();
      }
    }

    await expect(this.loginForm).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
  }

  async login(email: string, password: string) {
    await expect(this.emailInput).toBeVisible();
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async expectError(message?: RegExp | string) {
    await expect(this.formError).toBeVisible();
    if (message) {
      await expect(this.formError).toContainText(message);
    }
  }
}
