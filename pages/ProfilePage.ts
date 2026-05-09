import { expect, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { Timeout } from '../enums/timeouts';
import { URL_PATTERNS } from '../const/assertions';

export class ProfilePage extends BasePage {
  readonly userGreeting = this.page
    .locator('nav, [role="navigation"]')
    .locator('text=/Welcome|Hello|Hi/')
    .first();
  readonly userEmail = this.page.locator('#profileEmail');
  readonly userName = this.page.locator('main h2').first(); // Name is in h2 in main
  readonly userRole = this.page.locator('main').locator('text=/Active|Inactive/').first(); // Role/status in main
  readonly logoutButton = this.page.locator('nav button:has-text("Logout")').first();
  readonly profileHeader = this.page
    .locator('header, banner')
    .locator('text=/Profile|Farm Management/')
    .first();
  readonly userInfoSection = this.page.locator('main').first();
  readonly mainContent = this.page.locator('main, [role="main"]');
  readonly navigationMenu = this.page.locator('nav.navbar').first();
  readonly navigationLinks = this.navigationMenu.locator('a, [role="link"]');
  readonly html = this.page.locator('html');
  readonly body = this.page.locator('body');
  readonly loginLink = this.page.locator('nav a:has-text("Login")');
  readonly infoElements = this.userInfoSection.locator('[data-testid^="user-"]');

  async open() {
    await this.goto(URL_PATTERNS.PROFILE);
    await this.expectProfilePageLoaded();
  }

  async expectProfilePageLoaded(): Promise<void> {
    await expect(this.profileHeader).toBeVisible({ timeout: Timeout.MEDIUM });
    await expect(this.userInfoSection).toBeVisible();
    await expect(this.mainContent).toBeVisible();
  }

  async getUserGreeting(): Promise<string> {
    const text = await this.userGreeting.textContent();
    return text ?? '';
  }

  async getUserEmail(): Promise<string> {
    const text = await this.userEmail.textContent();
    return text ?? '';
  }

  async getUserName(): Promise<string> {
    const text = await this.userName.textContent();
    return text ?? '';
  }

  async getUserRole(): Promise<string> {
    const text = await this.userRole.textContent();
    return text ?? '';
  }

  async expectUserGreeting(expectedText: RegExp | string): Promise<void> {
    await expect(this.userGreeting).toContainText(expectedText);
  }

  async expectUserEmailDisplayed(email: string): Promise<void> {
    await expect(this.userEmail).toContainText(email, {
      timeout: Timeout.LONG,
    });
  }

  async expectUserNameDisplayed(name: string): Promise<void> {
    await expect(this.userName).toContainText(name);
  }

  async expectLogoutButtonVisible(): Promise<void> {
    await expect(this.logoutButton).toBeVisible();
    await expect(this.logoutButton).toBeEnabled();
  }

  async logout(): Promise<void> {
    await this.logoutButton.click();
    await this.page.waitForURL(URL_PATTERNS.HOME, { timeout: Timeout.MEDIUM });
  }

  async expectNavigationMenuVisible(): Promise<void> {
    await expect(this.navigationMenu).toBeVisible();
  }

  async getNavigationLinks(): Promise<Locator> {
    return this.navigationLinks;
  }

  async expectHtmlVisible(): Promise<void> {
    await expect(this.html).toBeVisible();
  }

  async expectUserInfoSectionComplete(): Promise<void> {
    await expect(this.userInfoSection).toBeVisible();
    const count = await this.infoElements.count();
    expect(count).toBeGreaterThan(0);
  }
}
