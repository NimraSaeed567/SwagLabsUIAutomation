import * as fs from 'fs';
import * as path from 'path';
import type { Reporter, TestCase, TestResult } from '@playwright/test/reporter';

const ESC = String.fromCharCode(27);
const ANSI_PATTERN = new RegExp(ESC + '\\[[0-9;]*m', 'g');
const stripAnsi = (str?: string) => (str || '').replace(ANSI_PATTERN, '');

// Attachments meant for Playwright's own AI-debugging assistant, not for a
// human bug report (e.g. the accessibility-tree page snapshot dump).
const NOISY_ATTACHMENTS = new Set(['_error-context', 'error-context']);

// Keeps the assertion summary (locator/expected/received/timeout) and drops
// the repeated polling log and internal test-file stack frames.
function summarizeError(message?: string): string {
  const clean = stripAnsi(message).split(/\n\s*Call log:/)[0];
  return (
    clean
      .split('\n')
      .filter((line) => !/^\s*at\s/.test(line))
      .join('\n')
      .trim() || 'Unknown error'
  );
}

function projectNameOf(test: TestCase): string {
  return test.parent.project()?.name || test.titlePath()[1] || 'unknown';
}

type TableRow = Array<string | number>;

// Pads every column to a fixed width so the table lines up as plain text too,
// not just once a Markdown renderer gets hold of it.
function renderTable(headers: string[], rows: TableRow[]): string {
  const widths = headers.map((header, i) =>
    Math.max(header.length, ...rows.map((row) => String(row[i]).length), 3)
  );
  const line = (cells: TableRow) => `| ${cells.map((cell, i) => String(cell).padEnd(widths[i])).join(' | ')} |`;
  const separator = `|${widths.map((w) => '-'.repeat(w + 2)).join('|')}|`;
  return [line(headers), separator, ...rows.map(line)].join('\n');
}

interface BugReportReporterOptions {
  outputDir?: string;
  summaryFile?: string;
}

// Writes two things after every run:
//  - test-summary.md — total/passed/failed/skipped counts, always generated.
//  - bug-reports/*.md — one short, developer-readable bug report per failing
//    test, only generated when there's something to report.
export default class BugReportReporter implements Reporter {
  private bugReportDir: string;
  private summaryFile: string;
  // Keyed by test so retries overwrite earlier attempts with the final outcome.
  private resultsByTest = new Map<TestCase, TestResult>();

  constructor(options: BugReportReporterOptions = {}) {
    this.bugReportDir = options.outputDir || 'bug-reports';
    this.summaryFile = options.summaryFile || 'test-summary.md';
  }

  onTestEnd(test: TestCase, result: TestResult) {
    this.resultsByTest.set(test, result);
  }

  onEnd() {
    const entries = [...this.resultsByTest.entries()];

    const counts = { passed: 0, failed: 0, skipped: 0, other: 0 };
    for (const [, result] of entries) {
      if (result.status === 'passed') counts.passed++;
      else if (result.status === 'failed' || result.status === 'timedOut') counts.failed++;
      else if (result.status === 'skipped') counts.skipped++;
      else counts.other++;
    }
    const total = entries.length;
    const now = new Date().toISOString();

    const countsTable = renderTable(
      ['Total', 'Passed', 'Failed', 'Skipped'],
      [[total, counts.passed, counts.failed, counts.skipped + (counts.other ? ` (+${counts.other} other)` : '')]]
    );

    const testsTable = renderTable(
      ['Test', 'Browser', 'Status'],
      entries.map(([test, result]) => [test.title, projectNameOf(test), result.status.toUpperCase()])
    );

    const summary = `# Test Run Summary

Run: ${now}

${countsTable}

${counts.failed > 0 ? `See \`${this.bugReportDir}/index.md\` for per-failure bug reports.\n\n` : ''}## All tests

${testsTable}
`;

    fs.writeFileSync(this.summaryFile, summary);
    console.log(`\nTest summary written to ${this.summaryFile} (${counts.passed}/${total} passed)`);

    const failures = entries.filter(([, result]) => result.status === 'failed' || result.status === 'timedOut');

    fs.rmSync(this.bugReportDir, { recursive: true, force: true });
    if (failures.length === 0) return;
    fs.mkdirSync(this.bugReportDir, { recursive: true });

    const indexRows: TableRow[] = [];

    for (const [test, result] of failures) {
      const projectName = projectNameOf(test);
      const slug = `${projectName}-${test.title}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      const fileName = `${slug}.md`;

      const steps = result.steps
        .filter((s) => s.category === 'test.step')
        .map((s) => `${s.error ? 'FAILED' : 'ok'} — ${s.title}`)
        .join('\n');

      const error = result.errors[0] || result.error;
      const errorSummary = summarizeError(error?.message);

      const attachments = result.attachments
        .filter((a) => !NOISY_ATTACHMENTS.has(a.name))
        .map((a) => `- ${a.name}: \`${a.path || '(inline)'}\``)
        .join('\n');

      const repro = `npx playwright test -g "${test.title}" --project=${projectName}`;

      const content = `# ${test.title}

Browser: ${projectName} | Status: ${result.status.toUpperCase()} | Detected: ${now}

## Steps
${steps || '_No test.step() breadcrumbs recorded for this test._'}

## What went wrong
\`\`\`
${errorSummary}
\`\`\`

## Reproduce
\`\`\`
${repro}
\`\`\`

## Evidence
${attachments || '_None captured._'}
`;

      fs.writeFileSync(path.join(this.bugReportDir, fileName), content);
      indexRows.push([`[${test.title}](./${fileName})`, projectName, result.status.toUpperCase()]);
    }

    const index = `# Bug Report Summary

Run: ${now}
Failures: ${failures.length}

${renderTable(['Test', 'Browser', 'Status'], indexRows)}
`;

    fs.writeFileSync(path.join(this.bugReportDir, 'index.md'), index);
    console.log(`Bug reports written to ${this.bugReportDir}/ (${failures.length} failure(s))`);
  }
}
