import * as fs from 'fs';
import * as path from 'path';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface CsvRow {
  [key: string]: string;
}

export interface TestCaseRow extends CsvRow {
  'Test Case #': string;
  'Test Scenario ID': string;
  'Test Case Description': string;
  'Pre-conditions': string;
  'Test Steps': string;
  'Test Data': string;
  'Expected Result': string;
  'Priority': string;
  'Status': string;
}

// ─── CSV Parser ───────────────────────────────────────────────────────────────

/**
 * Parses a CSV string into an array of row objects keyed by header names.
 * Handles quoted fields that may contain commas or newlines.
 */
export function parseCsv(content: string): CsvRow[] {
  const lines: string[] = [];
  let current = '';
  let insideQuotes = false;

  for (let i = 0; i < content.length; i++) {
    const ch = content[i];
    if (ch === '"') {
      if (insideQuotes && content[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if ((ch === '\n' || ch === '\r') && !insideQuotes) {
      if (ch === '\r' && content[i + 1] === '\n') i++;
      lines.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  if (current.trim()) lines.push(current);

  if (lines.length < 2) return [];

  const headers = splitCsvLine(lines[0]);
  const rows: CsvRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const values = splitCsvLine(line);
    const row: CsvRow = {};
    headers.forEach((header, idx) => {
      row[header.trim()] = (values[idx] ?? '').trim();
    });
    rows.push(row);
  }

  return rows;
}

function splitCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (insideQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (ch === ',' && !insideQuotes) {
      result.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

// ─── Data Loaders ─────────────────────────────────────────────────────────────

const CSV_PATH = path.resolve(
  __dirname,
  '../test-data/QCMetric_RequestInitiation_TestCases_AutomationReady.csv'
);

let _cachedRows: TestCaseRow[] | null = null;

/** Loads all rows from the CSV, caching the result. */
export function loadTestData(): TestCaseRow[] {
  if (_cachedRows) return _cachedRows;
  const content = fs.readFileSync(CSV_PATH, 'utf-8');
  _cachedRows = parseCsv(content) as TestCaseRow[];
  return _cachedRows;
}

/**
 * Returns the single test-case row matching the given ID (e.g. `'RI-01'`).
 * Throws if not found.
 */
export function getTestCase(testCaseId: string): TestCaseRow {
  const rows = loadTestData();
  const row = rows.find(
    (r) =>
      r['Test Case #']?.trim() === testCaseId ||
      r['Test Scenario ID']?.trim() === testCaseId
  );
  if (!row) throw new Error(`Test case "${testCaseId}" not found in CSV.`);
  return row;
}

/**
 * Returns all test-case rows whose Scenario ID starts with the given prefix
 * (e.g. `'RI-'`).
 */
export function getTestsByScenario(prefix: string): TestCaseRow[] {
  return loadTestData().filter(
    (r) =>
      r['Test Case #']?.trim().startsWith(prefix) ||
      r['Test Scenario ID']?.trim().startsWith(prefix)
  );
}

/**
 * Parses the semi-structured `Test Data` field of a row.
 * Returns the value for the given key (e.g. `'Email'`).
 *
 * Supported formats:
 *   - `Key: Value`
 *   - `Key = Value`
 *   - Lines separated by `\n` or `;`
 */
export function parseTestDataField(row: TestCaseRow, key: string): string {
  const raw = row['Test Data'] ?? '';
  const entries = raw.split(/[\n;]+/);
  for (const entry of entries) {
    const [k, ...rest] = entry.split(/[:=]/);
    if (k && k.trim().toLowerCase() === key.trim().toLowerCase()) {
      return rest.join('=').trim();
    }
  }
  return '';
}
