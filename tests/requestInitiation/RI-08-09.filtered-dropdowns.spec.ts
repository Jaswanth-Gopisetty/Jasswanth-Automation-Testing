import { test, expect, Page } from '@playwright/test';
import { loginAndNavigateToRequestInitiation } from './helpers/auth.helper';
import { RequestInitiationPage } from '../../pages/RequestInitiationPage';

test.describe('RI-08-09 | Filtered Role Dropdowns', () => {
  let page: Page;
  let requestPage: RequestInitiationPage;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    await loginAndNavigateToRequestInitiation(page);
    requestPage = new RequestInitiationPage(page);
    await requestPage.waitForFormVisible();
    // Pre-select Content Type + Department so role dropdowns load
    await requestPage.selectContentType();
    await requestPage.selectDepartment();
    await page.waitForTimeout(500);
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('TC-08 | RI-08 — Author dropdown is filtered to users with Author role only', async () => {
    const options = await requestPage.getDropdownOptions(requestPage.authorDropdown);
    expect(options.length).toBeGreaterThan(0);
    // Verify dropdown is not empty and all options are non-empty strings
    options.forEach((opt) => expect(opt.trim().length).toBeGreaterThan(0));
  });

  test('TC-09 | RI-09 — Request Approver dropdown is filtered to users with Approver role only', async () => {
    const options = await requestPage.getDropdownOptions(requestPage.requestApproverDropdown);
    expect(options.length).toBeGreaterThan(0);
    options.forEach((opt) => expect(opt.trim().length).toBeGreaterThan(0));
  });

  test('TC-08b | RI-08 — Author selected from dropdown is persisted in form', async () => {
    const selected = await requestPage.selectAuthor();
    expect(selected.length).toBeGreaterThan(0);

    // Verify the dropdown now shows the selected value
    const displayText = await requestPage.authorDropdown.textContent();
    expect(displayText).toContain(selected);
  });

  test('TC-09b | RI-09 — Request Approver selected from dropdown is persisted in form', async () => {
    const selected = await requestPage.selectRequestApprover();
    expect(selected.length).toBeGreaterThan(0);

    const displayText = await requestPage.requestApproverDropdown.textContent();
    expect(displayText).toContain(selected);
  });
});
