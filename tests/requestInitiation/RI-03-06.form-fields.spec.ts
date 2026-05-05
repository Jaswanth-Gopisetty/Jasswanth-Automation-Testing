import { test, expect, Page } from '@playwright/test';
import { loginAndNavigateToRequestInitiation } from './helpers/auth.helper';
import { RequestInitiationPage } from '../../pages/RequestInitiationPage';

test.describe('RI-03-06 | Form Field Auto-population & Dropdowns', () => {
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

  test('TC-03 | RI-03 — Site ID field is auto-populated and read-only', async () => {
    const siteId = await requestPage.getSiteIdValue();
    expect(siteId.length).toBeGreaterThan(0);

    const isReadOnly = await requestPage.isSiteIdReadOnly();
    expect(isReadOnly).toBe(true);
  });

  test('TC-04 | RI-04 — Content ID is generated after selecting Content Type and Department', async () => {
    await requestPage.selectContentType();
    await requestPage.selectDepartment();
    await page.waitForTimeout(1_000);

    const contentId = await requestPage.getContentIdValue();
    expect(contentId.length).toBeGreaterThan(0);
  });

  test('TC-05 | RI-05 — Content Type dropdown lists all available content types', async () => {
    const options = await requestPage.getDropdownOptions(requestPage.contentTypeDropdown);
    expect(options.length).toBeGreaterThan(0);
  });

  test('TC-06 | RI-06 — Department dropdown lists all available departments', async () => {
    const options = await requestPage.getDropdownOptions(requestPage.departmentDropdown);
    expect(options.length).toBeGreaterThan(0);
  });
});
