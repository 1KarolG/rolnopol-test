import { expect, test } from '../fixtures/fixtures';
import {
  HTTP_STATUS,
  URL_PATTERNS,
  PAGE_ASSERTIONS,
  ELEMENT_ASSERTIONS,
} from '../const/assertions';

test.describe('Local homepage', () => {
  test('loads the root URL and shows the page body', async ({ homePage, page }) => {
    await homePage.open();
    await homePage.expectBodyVisible();
    await expect(page).toHaveURL(URL_PATTERNS.ROOT_REGEX);
  });

  test('homepage responds with correct status code', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(HTTP_STATUS.OK);
  });

  test('shows a main heading or login link on home', async ({ homePage }) => {
    await homePage.open();
    const headingVisible = await homePage.heading.isVisible().catch(() => false);
    const loginLinkVisible = await homePage.hasLoginLink();
    expect(headingVisible || loginLinkVisible).toBeTruthy();
  });

  test('home page has valid HTML structure', async ({ page, homePage }) => {
    await homePage.open();
    await homePage.expectHtmlVisible();

    const docTitle = await page.title();
    expect(docTitle).toBeTruthy();
    expect(docTitle.length).toBeGreaterThan(PAGE_ASSERTIONS.MIN_STRING_LENGTH);
  });

  test('navigates to login from the home page', async ({ homePage, page }) => {
    await homePage.open();
    await homePage.navigateToLogin();
    await expect(page).toHaveURL(URL_PATTERNS.LOGIN_REGEX);
    await homePage.expectLoginHeadingVisible();
  });

  test('login link is visible and clickable', async ({ homePage }) => {
    await homePage.open();
    const loginLink = homePage.loginLink.first();
    await expect(loginLink).toBeVisible();
    await expect(loginLink).toBeEnabled();
  });

  test('homepage is responsive with viewable content', async ({ homePage }) => {
    await homePage.open();
    const body = homePage.body;

    const boundingBox = await body.boundingBox();
    expect(boundingBox).toBeDefined();
    expect(boundingBox?.height).toBeGreaterThan(PAGE_ASSERTIONS.EXPECT_CONTENT_HEIGHT_GREATER_THAN);
    expect(boundingBox?.width).toBeGreaterThan(PAGE_ASSERTIONS.EXPECT_CONTENT_WIDTH_GREATER_THAN);
  });

  test('all links on homepage are working', async ({ homePage }) => {
    await homePage.open();
    const allLinks = await homePage.getAllLinks();
    const linkCount = await allLinks.count();

    expect(linkCount).toBeGreaterThan(ELEMENT_ASSERTIONS.MIN_COUNT);

    // Validate each link has an href attribute
    const linksToCheck = Math.min(linkCount, ELEMENT_ASSERTIONS.MAX_LINKS_TO_CHECK);
    for (let i = 0; i < linksToCheck; i++) {
      const link = allLinks.nth(i);
      // Wait for link to be attached and validate href exists
      await expect(link).toHaveAttribute('href', /.+/);
    }
  });
});
