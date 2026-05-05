import { Page, Locator, expect } from '@playwright/test';
import { BASE_URL } from '../tests/shared/auth.helper';

export class RequestInitiationPage {
  readonly page: Page;

  // ─── Page container ────────────────────────────────────────────────────
  readonly createRequestPage: Locator;
  readonly initiationForm: Locator;
  readonly accessDeniedMessage: Locator;
  readonly sidebarCreateRequest: Locator;

  // ─── Auto-populated read-only fields ──────────────────────────────────
  readonly siteIdField: Locator;
  readonly contentIdField: Locator;

  // ─── Dropdowns ─────────────────────────────────────────────────────────
  readonly contentTypeDropdown: Locator;
  readonly departmentDropdown: Locator;
  readonly authorDropdown: Locator;
  readonly requestApproverDropdown: Locator;
  readonly templateDropdown: Locator;

  // ─── Input fields ──────────────────────────────────────────────────────
  readonly contentTitleInput: Locator;
  readonly purposeField: Locator;
  readonly justificationField: Locator;

  // ─── Validation errors ─────────────────────────────────────────────────
  readonly contentTitleError: Locator;
  readonly contentTypeError: Locator;
  readonly departmentError: Locator;
  readonly authorError: Locator;
  readonly approverError: Locator;
  readonly purposeError: Locator;
  readonly justificationError: Locator;
  readonly templateError: Locator;
  readonly ccSelectionError: Locator;

  // ─── Collaboration ──────────────────────────────────────────────────────
  readonly collaborationToggle: Locator;
  readonly collaboratorList: Locator;
  readonly addCollaboratorBtn: Locator;
  readonly collaboratorPicker: Locator;

  // ─── Change Control ─────────────────────────────────────────────────────
  readonly changeControlYesRadio: Locator;
  readonly changeControlNoRadio: Locator;
  readonly ccTypeDropdown: Locator;
  readonly ccList: Locator;
  readonly ccViewIcon: Locator;
  readonly ccDetailsModal: Locator;
  readonly ccSelection: Locator;

  // ─── Template ───────────────────────────────────────────────────────────
  readonly templateViewIcon: Locator;
  readonly pdfViewerModal: Locator;

  // ─── External Reviewer ──────────────────────────────────────────────────
  readonly externalReviewerCheckbox: Locator;
  readonly externalReviewerEmail: Locator;
  readonly externalReviewerEmailError: Locator;

  // ─── External Approver ──────────────────────────────────────────────────
  readonly externalApproverCheckbox: Locator;
  readonly externalApproverEmail: Locator;
  readonly externalApproverEmailError: Locator;

  // ─── Action buttons ─────────────────────────────────────────────────────
  readonly saveDraftBtn: Locator;
  readonly submitBtn: Locator;
  readonly successToast: Locator;

  // ─── History ────────────────────────────────────────────────────────────
  readonly historyIcon: Locator;
  readonly historyPanel: Locator;

  constructor(page: Page) {
    this.page = page;

    // Page container
    this.createRequestPage    = page.locator('[data-testid="create-request-page"]');
    this.initiationForm       = page.locator('[data-testid="initiation-form"]');
    this.accessDeniedMessage  = page.locator('[data-testid="access-denied-message"]');
    this.sidebarCreateRequest = page.locator('[data-testid="sidebar-create-request"]');

    // Auto-populated read-only fields — first and second disabled inputs in the modal
    this.siteIdField    = page.locator('input[disabled], input[readonly]').first();
    this.contentIdField = page.locator('input[disabled], input[readonly]').nth(1);

    // Dropdowns — matched by placeholder text visible in the modal
    this.contentTypeDropdown      = page.locator('button, [role="combobox"]').filter({ hasText: /Select document type|Document Type/i }).first();
    this.departmentDropdown       = page.locator('button, [role="combobox"]').filter({ hasText: /Select department|Department/i }).first();
    this.authorDropdown           = page.locator('button, [role="combobox"]').filter({ hasText: /Search & select author|Author/i }).first();
    this.requestApproverDropdown  = page.locator('button, [role="combobox"]').filter({ hasText: /Search & select approver|Request Approver/i }).first();
    this.templateDropdown         = page.locator('button, [role="combobox"]').filter({ hasText: /Select template|Template/i }).first();

    // Input fields — matched by placeholder text visible in the modal
    this.contentTitleInput  = page.locator('textarea[placeholder*="document title" i], input[placeholder*="document title" i]').first();
    this.purposeField       = page.locator('textarea[placeholder*="purpose" i], input[placeholder*="purpose" i]').first();
    this.justificationField = page.locator('textarea[placeholder*="justification" i], input[placeholder*="justification" i]').first();

    // Validation — the app shows a single banner listing all missing mandatory fields.
    // Match by visible text since the element has no predictable class/role.
    const validationToast = page.getByText(/please enter the mandatory|mandatory fields|required fields/i).first();
    this.contentTitleError  = validationToast;
    this.contentTypeError   = validationToast;
    this.departmentError    = validationToast;
    this.authorError        = validationToast;
    this.approverError      = validationToast;
    this.purposeError       = validationToast;
    this.justificationError = validationToast;
    this.templateError      = validationToast;
    this.ccSelectionError   = validationToast;

    // Collaboration
    this.collaborationToggle  = page.locator('[data-testid="collaboration-toggle"]');
    this.collaboratorList     = page.locator('[data-testid="collaborator-list"]');
    this.addCollaboratorBtn   = page.locator('[data-testid="add-collaborator-btn"]');
    this.collaboratorPicker   = page.locator('[data-testid="collaborator-picker"]');

    // Change Control
    this.changeControlYesRadio = page.locator('[data-testid="change-control-yes-radio"]');
    this.changeControlNoRadio  = page.locator('[data-testid="change-control-no-radio"]');
    this.ccTypeDropdown        = page.locator('[data-testid="cc-type-dropdown"]');
    this.ccList                = page.locator('[data-testid="cc-list"]');
    this.ccViewIcon            = page.locator('[data-testid="cc-view-icon"]').first();
    this.ccDetailsModal        = page.locator('[data-testid="cc-details-modal"]');
    this.ccSelection           = page.locator('[data-testid="cc-selection"]');

    // Template
    this.templateViewIcon = page.locator('[data-testid="template-view-icon"]');
    this.pdfViewerModal   = page.locator('[data-testid="pdf-viewer-modal"]');

    // External Reviewer
    this.externalReviewerCheckbox  = page.locator('[data-testid="external-reviewer-checkbox"]');
    this.externalReviewerEmail     = page.locator('[data-testid="external-reviewer-email"]');
    this.externalReviewerEmailError = page.locator('[data-testid="external-reviewer-email-error"]');

    // External Approver
    this.externalApproverCheckbox   = page.locator('[data-testid="external-approver-checkbox"]');
    this.externalApproverEmail      = page.locator('[data-testid="external-approver-email"]');
    this.externalApproverEmailError = page.locator('[data-testid="external-approver-email-error"]');

    // Action buttons — matched by visible text
    this.saveDraftBtn = page.locator('button').filter({ hasText: /Save.*Draft|Save Draft/i }).first();
    this.submitBtn    = page.locator('button').filter({ hasText: /^Submit$/i }).first();
    this.successToast = page.locator('[data-testid="success-toast"], [class*="toast"], [class*="Toast"]').first();

    // History
    this.historyIcon  = page.locator('[data-testid="history-icon"]');
    this.historyPanel = page.locator('[data-testid="history-panel"]');
  }

  // ─── Navigation ─────────────────────────────────────────────────────────

  async goto(): Promise<void> {
    await this.page.goto(`${BASE_URL}/requests/create`);
    await this.page.waitForLoadState('domcontentloaded');
  }

  // ─── Dropdown helpers ────────────────────────────────────────────────────

  /** Clicks a dropdown then picks the first enabled option. Returns its text. */
  async selectFirstOption(dropdown: Locator): Promise<string> {
    await dropdown.click();
    await this.page.waitForTimeout(500);
    const option = this.page
      .locator('[role="option"]:not([aria-disabled="true"])')
      .first();
    const text = await option.textContent() ?? '';
    await option.click();
    return text.trim();
  }

  /** Clicks a dropdown then picks the option matching the given text. */
  async selectOptionByText(dropdown: Locator, optionText: string): Promise<void> {
    await dropdown.click();
    await this.page.waitForTimeout(500);
    await this.page
      .locator(`[role="option"]:has-text("${optionText}")`)
      .first()
      .click();
  }

  /** Returns all visible option texts from an open dropdown, then closes it. */
  async getDropdownOptions(dropdown: Locator): Promise<string[]> {
    await dropdown.click();
    await this.page.waitForTimeout(500);
    const options = await this.page
      .locator('[role="option"]:not([aria-disabled="true"])')
      .allTextContents();
    await this.page.keyboard.press('Escape');
    return options.map((o) => o.trim()).filter(Boolean);
  }

  // ─── Form field helpers ──────────────────────────────────────────────────

  async selectContentType(value?: string): Promise<string> {
    return value
      ? (await this.selectOptionByText(this.contentTypeDropdown, value), value)
      : this.selectFirstOption(this.contentTypeDropdown);
  }

  async selectDepartment(value?: string): Promise<string> {
    return value
      ? (await this.selectOptionByText(this.departmentDropdown, value), value)
      : this.selectFirstOption(this.departmentDropdown);
  }

  async selectAuthor(value?: string): Promise<string> {
    return value
      ? (await this.selectOptionByText(this.authorDropdown, value), value)
      : this.selectFirstOption(this.authorDropdown);
  }

  async selectRequestApprover(value?: string): Promise<string> {
    return value
      ? (await this.selectOptionByText(this.requestApproverDropdown, value), value)
      : this.selectFirstOption(this.requestApproverDropdown);
  }

  async selectTemplate(value?: string): Promise<string> {
    return value
      ? (await this.selectOptionByText(this.templateDropdown, value), value)
      : this.selectFirstOption(this.templateDropdown);
  }

  // ─── Collaboration ───────────────────────────────────────────────────────

  async enableCollaboration(): Promise<void> {
    const isChecked = await this.collaborationToggle
      .isChecked()
      .catch(async () => {
        const aria = await this.collaborationToggle.getAttribute('aria-checked');
        return aria === 'true';
      });
    if (!isChecked) {
      await this.collaborationToggle.click();
      await this.page.waitForTimeout(300);
    }
  }

  async addCollaborator(collaboratorName?: string): Promise<void> {
    await this.addCollaboratorBtn.waitFor({ state: 'visible', timeout: 10_000 });
    await this.addCollaboratorBtn.click();
    await this.page.waitForTimeout(500);
    if (collaboratorName) {
      await this.selectOptionByText(this.collaboratorPicker, collaboratorName);
    } else {
      await this.selectFirstOption(this.collaboratorPicker);
    }
  }

  async removeCollaborator(index = 0): Promise<void> {
    const removeBtn = this.collaboratorList
      .locator('[data-testid="remove-collaborator-btn"]')
      .nth(index);
    await removeBtn.click();
    await this.page.waitForTimeout(300);
  }

  async getCollaboratorCount(): Promise<number> {
    return this.collaboratorList
      .locator('li, [data-testid="collaborator-item"]')
      .count();
  }

  // ─── Change Control ──────────────────────────────────────────────────────

  async setChangeControlYes(): Promise<void> {
    await this.changeControlYesRadio.click();
    await this.page.waitForTimeout(300);
  }

  async setChangeControlNo(): Promise<void> {
    await this.changeControlNoRadio.click();
    await this.page.waitForTimeout(300);
  }

  async clickCCViewIcon(): Promise<void> {
    await this.ccViewIcon.waitFor({ state: 'visible', timeout: 10_000 });
    await this.ccViewIcon.click();
  }

  // ─── Template ────────────────────────────────────────────────────────────

  async clickTemplateViewIcon(): Promise<void> {
    await this.templateViewIcon.waitFor({ state: 'visible', timeout: 10_000 });
    await this.templateViewIcon.click();
  }

  // ─── External Reviewer / Approver ────────────────────────────────────────

  async enableExternalReviewer(): Promise<void> {
    await this.externalReviewerCheckbox.check();
    await this.page.waitForTimeout(300);
  }

  async disableExternalReviewer(): Promise<void> {
    await this.externalReviewerCheckbox.uncheck();
    await this.page.waitForTimeout(300);
  }

  async enableExternalApprover(): Promise<void> {
    await this.externalApproverCheckbox.check();
    await this.page.waitForTimeout(300);
  }

  async disableExternalApprover(): Promise<void> {
    await this.externalApproverCheckbox.uncheck();
    await this.page.waitForTimeout(300);
  }

  // ─── Form actions ─────────────────────────────────────────────────────────

  async clickSubmit(): Promise<void> {
    await this.submitBtn.waitFor({ state: 'visible', timeout: 10_000 });
    await this.submitBtn.click();
  }

  async clickSaveDraft(): Promise<void> {
    await this.saveDraftBtn.waitFor({ state: 'visible', timeout: 10_000 });
    await this.saveDraftBtn.click();
  }

  // ─── Assertions ──────────────────────────────────────────────────────────

  async waitForFormVisible(): Promise<void> {
    // The form opens as a modal — wait for the "New Request" heading
    await this.page
      .getByText('New Request', { exact: false })
      .waitFor({ state: 'visible', timeout: 15_000 });
  }

  async getSiteIdValue(): Promise<string> {
    // Find the input near the "Site ID" label
    const field = this.page
      .locator('label, p, span, div')
      .filter({ hasText: /^Site ID/i })
      .locator('..') 
      .locator('input')
      .first();
    const fallback = this.page.locator('input').filter({ hasText: '' }).first();
    // Use the first readonly/disabled input in the Document Information section
    const siteInput = this.page
      .locator('input[disabled], input[readonly]')
      .first();
    return await siteInput.inputValue().catch(() => '');
  }

  async isSiteIdReadOnly(): Promise<boolean> {
    // The Site ID input is the first disabled/readonly input in the modal
    const siteInput = this.page
      .locator('input[disabled], input[readonly]')
      .first();
    const disabled = await siteInput.isDisabled().catch(() => false);
    const readOnly = await siteInput.getAttribute('readonly').catch(() => null);
    return disabled || readOnly !== null;
  }

  async getContentIdValue(): Promise<string> {
    // Document ID is the second auto-generated (disabled/readonly) input
    const docIdInput = this.page
      .locator('input[disabled], input[readonly]')
      .nth(1);
    return await docIdInput.inputValue().catch(() => '');
  }

  async hasValidationError(testId: string): Promise<boolean> {
    const error = this.page.locator(`[data-testid="${testId}"]`);
    try {
      await error.waitFor({ state: 'visible', timeout: 3_000 });
      return true;
    } catch {
      return false;
    }
  }

  async getValidationErrorText(errorLocator: Locator): Promise<string> {
    try {
      await errorLocator.waitFor({ state: 'visible', timeout: 3_000 });
      return (await errorLocator.textContent()) ?? '';
    } catch {
      return '';
    }
  }
}
