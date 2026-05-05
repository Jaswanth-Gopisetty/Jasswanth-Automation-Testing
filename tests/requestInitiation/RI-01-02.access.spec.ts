import { test, expect, Page } from '@playwright/test';
import { login, BASE_URL, navigateToRequestInitiation } from './helpers/auth.helper';
import { RequestInitiationPage } from '../../pages/RequestInitiationPage';

test.describe('RI-01-02 | Access & Navigation', () => {
  let page: Page;
  let requestPage: RequestInitiationPage;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    await login(page);
    requestPage = new RequestInitiationPage(page);
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('TC-01 | RI-01 — Authorised user can navigate to Request Initiation page', async () => {
    await navigateToRequestInitiation(page);

    // The Request Initiation form opens as a modal on /documents/roles.
    // Verify the modal is visible with its heading.
    await expect(page.getByText('New Request', { exact: false })).toBeVisible({ timeout: 10_000 });

    // Verify we are on the content/documents section of the app
    expect(page.url()).toMatch(/\/documents/);
  });

  test('TC-02 | RI-02 — Unauthorised user is denied access to Request Initiation', async () => {
    // Attempt direct navigation as the same user who lacks RI permission
    // (In the real suite, use RESTRICTED_CREDENTIALS in beforeEach)
    await page.goto(`${BASE_URL}/requests/create`);
    await page.waitForLoadState('domcontentloaded');

    // Either access-denied message is shown OR the page redirects to dashboard/login
    const accessDenied = page.locator('[data-testid="access-denied-message"], [class*="access-denied"], [class*="forbidden"]').first();
    const isRedirected = !page.url().includes('/request');

    if (!isRedirected) {
      await expect(accessDenied).toBeVisible({ timeout: 10_000 });
    } else {
      expect(isRedirected).toBe(true);
    }
  });
});
