import { expect, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { Timeout } from '../enums/timeouts';

export class ProfilePage extends BasePage {
  readonly userGreeting = this.page.locator('nav, [role="navigation"]').locator('text=/Welcome|Hello|Hi/').first();
  readonly userEmail = this.page.locator('main p').first(); // Email is in a paragraph in main
  readonly userName = this.page.locator('main h2').first(); // Name is in h2 in main
  readonly userRole = this.page.locator('main').locator('text=/Active|Inactive/').first(); // Role/status in main
  readonly logoutButton = this.page.locator('nav button:has-text("Logout")').first();
  readonly profileHeader = this.page.locator('header, banner').locator('text=/Profile|Farm Management/').first();
  readonly userInfoSection = this.page.locator('main').first();
  readonly mainContent = this.page.locator('main, [role="main"]');
  readonly navigationMenu = this.page.locator('nav.navbar').first();

  async open() {
    await this.goto('/profile.html');
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
    await expect(this.userEmail).not.toContainText('Loading...');
    await expect(this.userEmail).toContainText(email);
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
    await this.page.waitForURL('/', { timeout: Timeout.MEDIUM });
  }

  async expectNavigationMenuVisible(): Promise<void> {
    await expect(this.navigationMenu).toBeVisible();
  }

  async getNavigationLinks(): Promise<Locator> {
    return this.navigationMenu.locator('a, [role="link"]');
  }

  async expectUserInfoSectionComplete(): Promise<void> {
    await expect(this.userInfoSection).toBeVisible();
    const infoElements = this.userInfoSection.locator('[data-testid^="user-"]');
    const count = await infoElements.count();
    expect(count).toBeGreaterThan(0);
  }
}
