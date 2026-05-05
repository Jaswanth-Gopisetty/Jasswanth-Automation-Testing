import { test, expect, Page } from '@playwright/test';
import { loginAndNavigateToRequestInitiation } from './helpers/auth.helper';
import { RequestInitiationPage } from '../../pages/RequestInitiationPage';

test.describe('RI-17-22 | Template Behaviour', () => {
  let page: Page;
  let requestPage: RequestInitiationPage;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    await loginAndNavigateToRequestInitiation(page);
    requestPage = new RequestInitiationPage(page);
    await requestPage.waitForFormVisible();
    // Template dropdown depends on Content Type
    await requestPage.selectContentType();
    await requestPage.selectDepartment();
    await page.waitForTimeout(500);
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('TC-17 | RI-17 — Template dropdown is visible after selecting Content Type', async () => {
    await expect(requestPage.templateDropdown).toBeVisible({ timeout: 5_000 });
  });

  test('TC-18 | RI-18 — Template dropdown lists templates filtered by Content Type', async () => {
    const options = await requestPage.getDropdownOptions(requestPage.templateDropdown);
    expect(options.length).toBeGreaterThan(0);
    options.forEach((opt) => expect(opt.trim().length).toBeGreaterThan(0));
  });

  test('TC-19 | RI-19 — Selecting a template shows the view icon', async () => {
    await requestPage.selectTemplate();
    await page.waitForTimeout(500);
    await expect(requestPage.templateViewIcon).toBeVisible({ timeout: 5_000 });
  });

  test('TC-20 | RI-20 — Clicking template view icon opens the PDF viewer modal', async () => {
    await requestPage.selectTemplate();
    await page.waitForTimeout(500);
    await requestPage.clickTemplateViewIcon();
    await expect(requestPage.pdfViewerModal).toBeVisible({ timeout: 10_000 });
  });

  test('TC-21 | RI-21 — PDF viewer modal can be closed', async () => {
    await requestPage.selectTemplate();
    await page.waitForTimeout(500);
    await requestPage.clickTemplateViewIcon();
    await requestPage.pdfViewerModal.waitFor({ state: 'visible', timeout: 10_000 });

    // Close via Escape or a close button
    await page.keyboard.press('Escape');
    await expect(requestPage.pdfViewerModal).toBeHidden({ timeout: 5_000 });
  });

  test('TC-22 | RI-22 — Template is not required — form submits without a template', async () => {
    await requestPage.selectAuthor();
    await requestPage.selectRequestApprover();
    await requestPage.contentTitleInput.fill(`No Template Title ${Date.now()}`);
    await requestPage.purposeField.fill('Purpose without template');
    // Do NOT select a template

    await requestPage.clickSubmit();

    // Should NOT show template error
    const hasError = await requestPage.hasValidationError('template-error');
    expect(hasError).toBe(false);
  });
});
