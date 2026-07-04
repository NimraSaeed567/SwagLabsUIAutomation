# Sample test summary (fabricated — not a real run)

This is a fictional example showing what `reporters/bug-report-reporter.ts` writes to
`test-summary.md` after every run. It's checked in here purely so the format is visible
without running the suite yourself. `test-summary.md` itself is gitignored and regenerated
fresh on every `npm test` — this file is a static snapshot for illustration only.

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
