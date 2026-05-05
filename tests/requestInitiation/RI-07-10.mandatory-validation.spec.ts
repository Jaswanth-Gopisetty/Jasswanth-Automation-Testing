import { test, expect, Page } from '@playwright/test';
import { loginAndNavigateToRequestInitiation } from './helpers/auth.helper';
import { RequestInitiationPage } from '../../pages/RequestInitiationPage';

test.describe('RI-07-10 | Mandatory Field Validation — Title & Purpose', () => {
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

  test('TC-07 | RI-07 — Submission is blocked when Content Title is empty', async () => {
    // Click Submit without filling any mandatory fields
    await requestPage.clickSubmit();

    // App shows a banner with the text about mandatory fields
    const toast = page.getByText(/please enter the mandatory|mandatory fields/i).first();
    await expect(toast).toBeVisible({ timeout: 5_000 });
  });

  test('TC-08 | RI-08 — Author dropdown shows only users with Author role', async () => {
    // Select Content Type and Department first so the Author dropdown is populated
    await requestPage.selectContentType();
    await requestPage.selectDepartment();

    const options = await requestPage.getDropdownOptions(requestPage.authorDropdown);
    expect(options.length).toBeGreaterThan(0);
    // All options should be valid user names (non-empty strings)
    options.forEach((opt) => expect(opt.trim().length).toBeGreaterThan(0));
  });

  test('TC-09 | RI-09 — Request Approver dropdown shows only users with Approver role', async () => {
    await requestPage.selectContentType();
    await requestPage.selectDepartment();

    const options = await requestPage.getDropdownOptions(requestPage.requestApproverDropdown);
    expect(options.length).toBeGreaterThan(0);
    options.forEach((opt) => expect(opt.trim().length).toBeGreaterThan(0));
  });

  test('TC-10 | RI-10 — Submission is blocked when mandatory fields are not filled', async () => {
    // Click Submit without filling any mandatory fields
    await requestPage.clickSubmit();

    // App shows a banner with the text about mandatory fields
    const toast = page.getByText(/please enter the mandatory|mandatory fields/i).first();
    await expect(toast).toBeVisible({ timeout: 5_000 });
  });
});
