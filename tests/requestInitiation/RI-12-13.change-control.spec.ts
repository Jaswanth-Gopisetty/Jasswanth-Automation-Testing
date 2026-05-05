import { test, expect, Page } from '@playwright/test';
import { loginAndNavigateToRequestInitiation } from './helpers/auth.helper';
import { RequestInitiationPage } from '../../pages/RequestInitiationPage';

test.describe('RI-12-13 | Change Control Behaviour', () => {
  let page: Page;
  let requestPage: RequestInitiationPage;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    await loginAndNavigateToRequestInitiation(page);
    requestPage = new RequestInitiationPage(page);
    await requestPage.waitForFormVisible();
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('TC-12 | RI-12 — Selecting Change Control "Yes" shows the CC list section', async () => {
    await requestPage.setChangeControlYes();
    await expect(requestPage.ccList).toBeVisible({ timeout: 5_000 });
  });

  test('TC-12b | RI-12 — CC view icon opens the CC details modal', async () => {
    await requestPage.setChangeControlYes();
    // Ensure at least one CC item with a view icon is present
    await requestPage.ccList.waitFor({ state: 'visible', timeout: 5_000 });
    await requestPage.clickCCViewIcon();
    await expect(requestPage.ccDetailsModal).toBeVisible({ timeout: 10_000 });
  });

  test('TC-13 | RI-13 — Selecting Change Control "No" hides the CC list section', async () => {
    // First enable Yes then switch to No
    await requestPage.setChangeControlYes();
    await expect(requestPage.ccList).toBeVisible({ timeout: 5_000 });

    await requestPage.setChangeControlNo();
    await page.waitForTimeout(300);
    await expect(requestPage.ccList).toBeHidden({ timeout: 5_000 });
  });

  test('TC-13b | RI-13 — Submitting with CC = Yes but no CC selected shows validation error', async () => {
    // Fill minimum required fields
    await requestPage.selectContentType();
    await requestPage.selectDepartment();
    await requestPage.selectAuthor();
    await requestPage.selectRequestApprover();
    await requestPage.contentTitleInput.fill('Title for CC test');
    await requestPage.purposeField.fill('Purpose text');
    await requestPage.setChangeControlYes();
    // Do NOT select a CC item

    await requestPage.clickSubmit();

    await expect(requestPage.ccSelectionError).toBeVisible({ timeout: 5_000 });
  });
});
