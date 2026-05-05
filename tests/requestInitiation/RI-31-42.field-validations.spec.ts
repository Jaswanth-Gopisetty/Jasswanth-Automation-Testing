import { test, expect, Page } from '@playwright/test';
import { loginAndNavigateToRequestInitiation } from './helpers/auth.helper';
import { RequestInitiationPage } from '../../pages/RequestInitiationPage';

/** Fills the minimum set of fields, skipping the one under test. */
async function fillAllExcept(
  requestPage: RequestInitiationPage,
  skip: 'contentType' | 'department' | 'author' | 'approver' | 'none' = 'none'
): Promise<void> {
  if (skip !== 'contentType')  await requestPage.selectContentType();
  if (skip !== 'department')   await requestPage.selectDepartment();
  if (skip !== 'author')       await requestPage.selectAuthor();
  if (skip !== 'approver')     await requestPage.selectRequestApprover();
  await requestPage.contentTitleInput.fill(`Title ${Date.now()}`);
  await requestPage.purposeField.fill('Valid purpose text');
}

test.describe('RI-31-42 | Remaining Mandatory Field Validations', () => {
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

  test('TC-31 | RI-31 — Submission is blocked when Content Type is not selected', async () => {
    await fillAllExcept(requestPage, 'contentType');
    await requestPage.clickSubmit();
    await expect(requestPage.contentTypeError).toBeVisible({ timeout: 5_000 });
  });

  test('TC-32 | RI-32 — Submission is blocked when Department is not selected', async () => {
    await fillAllExcept(requestPage, 'department');
    await requestPage.clickSubmit();
    await expect(requestPage.departmentError).toBeVisible({ timeout: 5_000 });
  });

  test('TC-33 | RI-33 — Submission is blocked when Author is not selected', async () => {
    await fillAllExcept(requestPage, 'author');
    await requestPage.clickSubmit();
    await expect(requestPage.authorError).toBeVisible({ timeout: 5_000 });
  });

  test('TC-34 | RI-34 — Submission is blocked when Request Approver is not selected', async () => {
    await fillAllExcept(requestPage, 'approver');
    await requestPage.clickSubmit();
    await expect(requestPage.approverError).toBeVisible({ timeout: 5_000 });
  });

  test('TC-35 | RI-35 — Content Title with whitespace only is rejected', async () => {
    await requestPage.selectContentType();
    await requestPage.selectDepartment();
    await requestPage.selectAuthor();
    await requestPage.selectRequestApprover();
    await requestPage.contentTitleInput.fill('     ');
    await requestPage.purposeField.fill('Valid purpose');

    await requestPage.clickSubmit();

    await expect(requestPage.contentTitleError).toBeVisible({ timeout: 5_000 });
  });

  test('TC-36 | RI-36 — Content Title with special characters only is rejected', async () => {
    await requestPage.selectContentType();
    await requestPage.selectDepartment();
    await requestPage.selectAuthor();
    await requestPage.selectRequestApprover();
    await requestPage.contentTitleInput.fill('!@#$%^&*()');
    await requestPage.purposeField.fill('Valid purpose');

    await requestPage.clickSubmit();

    await expect(requestPage.contentTitleError).toBeVisible({ timeout: 5_000 });
  });

  test('TC-37 | RI-37 — Content Title enforces maximum character limit', async () => {
    const oversizedTitle = 'A'.repeat(300); // Exceeds any reasonable limit
    await requestPage.selectContentType();
    await requestPage.selectDepartment();
    await requestPage.selectAuthor();
    await requestPage.selectRequestApprover();
    await requestPage.contentTitleInput.fill(oversizedTitle);
    await requestPage.purposeField.fill('Valid purpose');

    await requestPage.clickSubmit();

    await expect(requestPage.contentTitleError).toBeVisible({ timeout: 5_000 });
    const errText = await requestPage.contentTitleError.textContent();
    expect(errText?.toLowerCase()).toMatch(/max|limit|character|exceed/);
  });

  test('TC-38 | RI-38 — Purpose field with whitespace only is rejected', async () => {
    await requestPage.selectContentType();
    await requestPage.selectDepartment();
    await requestPage.selectAuthor();
    await requestPage.selectRequestApprover();
    await requestPage.contentTitleInput.fill(`Valid Title ${Date.now()}`);
    await requestPage.purposeField.fill('     ');

    await requestPage.clickSubmit();

    await expect(requestPage.purposeError).toBeVisible({ timeout: 5_000 });
  });

  test('TC-39 | RI-39 — Content ID is NOT generated when only Content Type is selected', async () => {
    await requestPage.selectContentType();
    await page.waitForTimeout(1_000);

    const contentId = await requestPage.getContentIdValue();
    expect(contentId.length).toBe(0);
  });

  test('TC-40 | RI-40 — Content ID is NOT generated when only Department is selected', async () => {
    await requestPage.selectDepartment();
    await page.waitForTimeout(1_000);

    const contentId = await requestPage.getContentIdValue();
    expect(contentId.length).toBe(0);
  });

  test('TC-41 | RI-41 — Submission is blocked when Change Control = Yes but no CC is selected', async () => {
    await requestPage.selectContentType();
    await requestPage.selectDepartment();
    await requestPage.selectAuthor();
    await requestPage.selectRequestApprover();
    await requestPage.contentTitleInput.fill(`CC Test Title ${Date.now()}`);
    await requestPage.purposeField.fill('CC validation test');
    await requestPage.setChangeControlYes();
    // Do NOT select a CC item

    await requestPage.clickSubmit();

    await expect(requestPage.ccSelectionError).toBeVisible({ timeout: 5_000 });
  });

  test('TC-42 | RI-42 — Justification field with whitespace only is rejected when Change Control = No', async () => {
    await requestPage.selectContentType();
    await requestPage.selectDepartment();
    await requestPage.selectAuthor();
    await requestPage.selectRequestApprover();
    await requestPage.contentTitleInput.fill(`Justification Test ${Date.now()}`);
    await requestPage.purposeField.fill('Valid purpose');
    await requestPage.setChangeControlNo();
    await requestPage.justificationField.fill('     ');

    await requestPage.clickSubmit();

    await expect(requestPage.justificationError).toBeVisible({ timeout: 5_000 });
  });
});
