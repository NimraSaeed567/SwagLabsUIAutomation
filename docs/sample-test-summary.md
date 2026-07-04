# Sample test summary (fabricated — not a real run)

This is a fictional example showing what `reporters/bug-report-reporter.ts` writes to
`test-summary.md` after every run. It's checked in here purely so the format is visible
without running the suite yourself. `test-summary.md` itself is gitignored and regenerated
fresh on every `npm test` — this file is a static snapshot for illustration only.

## How this gets generated for real

**Prerequisites**
- Dependencies installed: `npm install`
- Playwright browsers installed: `npx playwright test install` (one-time)
- The custom reporter registered in `playwright.config.ts` (already done in this repo —
  see the `reporter: [...]` array, which includes `./reporters/bug-report-reporter.ts`)

**What triggers it**
Every test run, pass or fail, via any of:
```
npm test                              # all browsers, headless
npm run test:headed                   # all browsers, visible + maximized
npm run test:e2e                      # just the end-to-end flow, headed
npx playwright test --project=chromium  # any custom Playwright CLI invocation
```

**How it's built**
`BugReportReporter.onTestEnd` records the final result (status, browser project, timing) for
every test as it finishes — keyed by test so retries overwrite earlier attempts with the final
outcome, never double-counting. Once the whole run completes, `onEnd` tallies how many tests
ended up `passed`, `failed`, `timedOut`, or `skipped`, then writes:
1. A counts table (Total / Passed / Failed / Skipped), padded so it stays aligned as plain
   text, not just once a Markdown renderer touches it.
2. A per-test table (test name, browser, status) covering every test that ran.
3. If any test failed, a pointer to `bug-reports/index.md` for the detailed reports.

**Where to find it after a real run**
`test-summary.md` at the project root (same folder as `package.json`, not inside `docs/`).
It's gitignored and fully overwritten on every run — it always reflects only the *most recent*
run's results, scoped to whichever tests/projects you actually ran (e.g. `--project=chromium`
only shows those 18 tests, not the full 54 across all three browsers).

---

# Test Run Summary

Run: 2026-01-01T00:00:00.000Z

| Total | Passed | Failed | Skipped |
|-------|--------|--------|---------|
| 18    | 17     | 1      | 0       |

See `bug-reports/index.md` for per-failure bug reports.

## All tests

| Test                                              | Browser  | Status |
|--------------------------------------------------|----------|--------|
| standard user can log in successfully            | chromium | PASSED |
| locked out user sees an error message            | chromium | PASSED |
| invalid password shows an error message          | chromium | PASSED |
| empty credentials show a required-field error    | chromium | PASSED |
| displays six products                            | chromium | PASSED |
| can add and remove a product from the cart       | chromium | PASSED |
| cart badge reflects multiple added items         | chromium | PASSED |
| can sort products by price low to high           | chromium | PASSED |
| can sort products by name Z to A                 | chromium | PASSED |
| navigates to cart page                           | chromium | PASSED |
| shows added items with correct names             | chromium | PASSED |
| can remove an item from the cart                 | chromium | PASSED |
| continue shopping returns to inventory page      | chromium | PASSED |
| proceeds to checkout                             | chromium | PASSED |
| requires all fields before continuing            | chromium | PASSED |
| [example] cart badge shows wrong count           | chromium | FAILED |
| can cancel from overview and return to inventory | chromium | PASSED |
| login, shop, checkout, and return to home        | chromium | PASSED |
