/**
 * Request Initiation test-data generator — used by spec files to avoid
 * duplicate records when tests are run repeatedly.
 *
 * Usage:
 *   import { generateRandomRequestData, RequestInitiationData } from '../../utils/requestInitiationData';
 *   const data = generateRandomRequestData();                          // fully random
 *   const data = generateRandomRequestData({ purpose: 'Compliance' }); // partial override
 */

import { Page, Request, Response } from '@playwright/test';

// ─── Interface ────────────────────────────────────────────────────────────────

export interface RequestInitiationData {
  /** Unique document title (alphanumeric, max 100 chars) */
  title: string;
  purpose: string;
  justification: string;
  externalReviewerEmail: string;
  externalApproverEmail: string;
}

// ─── Data pools ───────────────────────────────────────────────────────────────

const PURPOSE_POOL = [
  'To ensure compliance with regulatory standards.',
  'To update outdated process documentation.',
  'To reflect recent changes in quality procedures.',
  'To improve clarity of existing work instructions.',
  'To support audit readiness and document control.',
  'To align with updated ISO requirements.',
  'To capture lessons learned from recent incidents.',
];

const JUSTIFICATION_POOL = [
  'This change is required due to regulatory update.',
  'Existing document contains outdated information.',
  'Process improvement initiative requires new SOP.',
  'Customer feedback necessitates documentation update.',
  'Internal audit finding requires corrective action.',
  'New equipment introduced requiring updated procedure.',
];

const VALID_REVIEWER_EMAILS = [
  'reviewer1@external.com',
  'approver.ext@qctest.com',
  'testreviewer@qcmetric.com',
  'external.review@testdomain.com',
];

// ─── Validation test data (negative cases) ────────────────────────────────────

/** Invalid email formats for negative email-validation tests (TC-45..TC-48). */
export const INVALID_EMAILS = [
  'notanemail',
  'test@',
  '@qcmetric.com',
  'test @qcmetric.com',
  'plaintext',
  'missing@dotcom',
];

/** Edge-case title strings for field-validation tests (TC-31..TC-42). */
export const EDGE_CASE_TITLES = {
  spacesOnly:      '   ',
  specialCharsOnly: '@#$%^&*',
  longTitle:       'A'.repeat(500),
  empty:           '',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Picks a random element from an array. */
function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Generates a unique document title by combining a descriptive prefix with
 * a short alphanumeric suffix, guaranteeing no duplicates across test runs.
 *
 * e.g. "Auto Request xk7p", "Auto Request bm3z"
 *
 * @param base  Optional fixed base — use when test requires a specific stem.
 */
export function uniqueRequestTitle(base?: string): string {
  const chars  = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const suffix = Array.from({ length: 4 }, () =>
    chars[Math.floor(Math.random() * chars.length)],
  ).join('');
  const stem = base ?? 'Auto Request';
  return `${stem} ${suffix}`.substring(0, 100);
}

// ─── Main generator ───────────────────────────────────────────────────────────

/**
 * Generates a full set of random Request Initiation form data.
 * Any field can be overridden by passing a partial `RequestInitiationData`.
 *
 * @example
 * // Fully random
 * const data = generateRandomRequestData();
 *
 * // Keep a fixed purpose but randomise everything else
 * const data = generateRandomRequestData({ purpose: 'Compliance update' });
 *
 * // Use CSV-driven base title
 * const data = generateRandomRequestData({ title: uniqueRequestTitle('SOP Review') });
 */
export function generateRandomRequestData(
  overrides?: Partial<RequestInitiationData>,
): RequestInitiationData {
  return {
    title:                 overrides?.title                 ?? uniqueRequestTitle(),
    purpose:               overrides?.purpose               ?? randomFrom(PURPOSE_POOL),
    justification:         overrides?.justification         ?? randomFrom(JUSTIFICATION_POOL),
    externalReviewerEmail: overrides?.externalReviewerEmail ?? randomFrom(VALID_REVIEWER_EMAILS),
    externalApproverEmail: overrides?.externalApproverEmail ?? randomFrom(VALID_REVIEWER_EMAILS),
  };
}

// ─── API Endpoint Constants ───────────────────────────────────────────────────

export const API_ENDPOINTS = {
  initiationForm:     '/api/requests/initiation/form',
  contentTypes:       '/api/master/content-types',
  departments:        '/api/master/departments',
  users:              '/api/master/users',
  generateContentId:  '/api/requests/generate-content-id',
  approvedCC:         '/api/change-control/approved',
  templates:          '/api/master/templates',
  submitRequest:      '/api/requests/submit',
  saveDraft:          '/api/requests/draft',
  notifications:      '/api/notifications',
  collaboratorsAdd:   '/api/requests/collaborators',
  collaboratorsDelete: (id: string) => `/api/requests/collaborators/${id}`,
  requestHistory:      (id: string) => `/api/requests/${id}/history`,
  templatePdf:         (id: string) => `/api/templates/${id}/pdf`,
};

// ─── API Intercept Helpers ────────────────────────────────────────────────────

/** Waits for a specific API response matching the given URL pattern. */
export async function waitForApiResponse(
  page: Page,
  urlPattern: string,
  method = 'GET',
): Promise<Response> {
  return page.waitForResponse(
    (response) =>
      response.url().includes(urlPattern) &&
      response.request().method() === method,
  );
}

/** Waits for a specific API request (without waiting for the response). */
export async function waitForApiRequest(
  page: Page,
  urlPattern: string,
  method = 'GET',
): Promise<Request> {
  return page.waitForRequest(
    (request) =>
      request.url().includes(urlPattern) && request.method() === method,
  );
}

/**
 * Asserts that no API call is made to the given URL within the timeout.
 * Useful for validating that client-side validation blocks form submission.
 */
export async function assertNoApiCall(
  page: Page,
  urlPattern: string,
  method = 'POST',
  timeoutMs = 2000,
): Promise<void> {
  let callMade = false;
  const handler = (request: Request) => {
    if (request.url().includes(urlPattern) && request.method() === method) {
      callMade = true;
    }
  };
  page.on('request', handler);
  await page.waitForTimeout(timeoutMs);
  page.off('request', handler);
  if (callMade) {
    throw new Error(
      `Unexpected API call to ${urlPattern} [${method}] was detected`,
    );
  }
}

/** Intercepts and mocks an API endpoint with the given JSON payload. */
export async function mockApiResponse(
  page: Page,
  urlPattern: string,
  responseBody: object,
  statusCode = 200,
): Promise<void> {
  await page.route(`**${urlPattern}**`, (route) => {
    route.fulfill({
      status: statusCode,
      contentType: 'application/json',
      body: JSON.stringify(responseBody),
    });
  });
}
