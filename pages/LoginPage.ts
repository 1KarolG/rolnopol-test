import { expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { URL_PATTERNS } from '../const/assertions';

export class LoginPage extends BasePage {
  readonly emailInput = this.page.locator('[data-testid="email-input"]');
  readonly passwordInput = this.page.locator('[data-testid="password-input"]');
  readonly submitButton = this.page.locator('[data-testid="login-submit-btn"]');
  readonly formError = this.page.locator('[role="alert"], .error, .error-message');
  readonly loginForm = this.page.locator('[data-testid="login-form"]');
  readonly loginMessage = this.page.locator('[data-testid="login-message"]');
  readonly loginLink = this.page.locator('nav a:has-text("Login")').first();
  readonly errorLocator = this.page.locator('[role="alert"], .error, .error-message').first();

  async open() {
    await this.goto(URL_PATTERNS.LOGIN);

    if ((await this.loginForm.count()) === 0) {
      await this.goto(URL_PATTERNS.HOME);
      if (await this.loginLink.count()) {
        await this.loginLink.click();
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
    await expect(this.errorLocator).toBeVisible();
    if (message) {
      await expect(this.errorLocator).toContainText(message);
    }
  }
}
