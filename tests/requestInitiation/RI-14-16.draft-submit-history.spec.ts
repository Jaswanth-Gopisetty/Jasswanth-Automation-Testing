import { test, expect, Page } from '@playwright/test';
import { loginAndNavigateToRequestInitiation } from './helpers/auth.helper';
import { RequestInitiationPage } from '../../pages/RequestInitiationPage';

/** Fills all mandatory form fields with valid data. */
async function fillRequiredFields(requestPage: RequestInitiationPage): Promise<void> {
  await requestPage.selectContentType();
  await requestPage.selectDepartment();
  await requestPage.selectAuthor();
  await requestPage.selectRequestApprover();
  await requestPage.contentTitleInput.fill(`Automation Title ${Date.now()}`);
  await requestPage.purposeField.fill('Automated test purpose');
}

test.describe('RI-14-16 | Draft, Submit & History', () => {
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

  test('TC-14 | RI-14 — Form can be saved as draft', async () => {
    await fillRequiredFields(requestPage);
    await requestPage.clickSaveDraft();
    await expect(requestPage.successToast).toBeVisible({ timeout: 10_000 });
    const toastText = await requestPage.successToast.textContent();
    expect(toastText?.toLowerCase()).toMatch(/draft|saved/);
  });

  test('TC-15 | RI-15 — Completed form can be submitted successfully', async () => {
    await fillRequiredFields(requestPage);
    await requestPage.clickSubmit();
    await expect(requestPage.successToast).toBeVisible({ timeout: 15_000 });
    const toastText = await requestPage.successToast.textContent();
    expect(toastText?.toLowerCase()).toMatch(/success|submitted|request/);
  });

  test('TC-16 | RI-16 — History icon opens the request history panel', async () => {
    // The history icon may be present on an existing request or after submitting
    // Navigate to the request list first if history icon is per-row
    await fillRequiredFields(requestPage);
    await requestPage.clickSaveDraft();
    await requestPage.successToast.waitFor({ state: 'visible', timeout: 10_000 });

    // The history icon should now be clickable
    await requestPage.historyIcon.waitFor({ state: 'visible', timeout: 10_000 });
    await requestPage.historyIcon.click();

    await expect(requestPage.historyPanel).toBeVisible({ timeout: 10_000 });
  });
});
