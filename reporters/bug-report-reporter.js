const fs = require('fs');
const path = require('path');

const ESC = String.fromCharCode(27);
const ANSI_PATTERN = new RegExp(ESC + '\\[[0-9;]*m', 'g');
const stripAnsi = (str) => (str || '').replace(ANSI_PATTERN, '');

// Turns each failing test into a developer-readable bug report (Markdown),
// so a red run in CI/local automation drops ready-to-triage bug files
// instead of just a pass/fail line.
class BugReportReporter {
  constructor(options = {}) {
    this.outputDir = options.outputDir || 'bug-reports';
    this.failures = [];
  }

  onTestEnd(test, result) {
    if (result.status === 'passed' || result.status === 'skipped') return;
    this.failures.push({ test, result });
  }

  onEnd() {
    if (this.failures.length === 0) return;

    fs.rmSync(this.outputDir, { recursive: true, force: true });
    fs.mkdirSync(this.outputDir, { recursive: true });

    const now = new Date().toISOString();
    const indexRows = [];

    for (const { test, result } of this.failures) {
      const projectName = test.parent.project()?.name || test.titlePath()[1] || 'unknown';
      const suiteName = test.parent.title || '(root)';
      const slug = `${projectName}-${test.title}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      const fileName = `${slug}.md`;

      const steps = result.steps
        .filter((s) => s.category === 'test.step')
        .map((s) => `- ${s.error ? '[FAILED] ' : '[OK] '}${s.title}`)
        .join('\n');

      const error = result.errors[0] || result.error;
      const errorMessage = stripAnsi(error?.message?.split('\n')[0]) || 'Unknown error';
      const errorStack = stripAnsi(error?.stack || error?.message) || 'No stack trace captured';

      const attachments = result.attachments
        .map((a) => `- **${a.name}**: \`${a.path || '(inline)'}\``)
        .join('\n');

      const repro = `npx playwright test -g "${test.title}" --project=${projectName}`;

      const content = `# Bug: ${test.title}

| Field | Value |
|---|---|
| Suite | ${suiteName} |
| Browser | ${projectName} |
| Status | ${result.status.toUpperCase()} |
| Retries | ${result.retry} |
| Duration | ${result.duration}ms |
| Detected | ${now} |

## Steps to reproduce
${steps || '_No test.step() breadcrumbs recorded for this test._'}

Or run directly:
\`\`\`
${repro}
\`\`\`

## Expected result
The steps above complete with no thrown error or failed assertion.

## Actual result
\`\`\`
${errorMessage}
\`\`\`

<details>
<summary>Full stack trace</summary>

\`\`\`
${errorStack}
\`\`\`
</details>

## Attachments
${attachments || '_None captured._'}
`;

      fs.writeFileSync(path.join(this.outputDir, fileName), content);
      indexRows.push(`| [${test.title}](./${fileName}) | ${projectName} | ${result.status.toUpperCase()} |`);
    }

    const index = `# Bug Report Summary

Run: ${now}
Failures: ${this.failures.length}

| Test | Browser | Status |
|---|---|---|
${indexRows.join('\n')}
`;

    fs.writeFileSync(path.join(this.outputDir, 'index.md'), index);
    console.log(`\nBug reports written to ${this.outputDir}/ (${this.failures.length} failure(s))`);
  }
}

module.exports = BugReportReporter;
