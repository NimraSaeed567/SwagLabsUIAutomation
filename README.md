# SwagLabs Automation

TypeScript Playwright test suite for [saucedemo.com](https://www.saucedemo.com), using the Page Object Model.

## Structure

- `pages/` — page objects (Login, Inventory, Cart, Checkout)
- `fixtures/pages.ts` — custom Playwright fixtures that inject page objects and a pre-authenticated `loggedInPage`
- `test-data/users.ts` — SauceDemo user credentials
- `tests/` — spec files, run in order: `01-login`, `02-inventory`, `03-cart`, `04-checkout`, `05-e2e-flow` (full journey, runs last)
- `reporters/bug-report-reporter.ts` — custom reporter: a pass/fail count summary every run, plus a Markdown bug report per failure

## Commands

```
npm test              # run all tests headless
npm run test:headed   # run with a visible, maximized browser at a moderate pace
npm run test:e2e      # run just the full end-to-end flow, headed
npm run test:ui       # open Playwright's UI mode
npm run report        # open the last HTML report
npm run typecheck     # type-check the project with tsc, no build output
```

## Test summary and bug reports

Every run writes `test-summary.md` (gitignored, regenerated each run) with the total/passed/failed/skipped
counts and a per-test status table. See [`docs/sample-test-summary.md`](docs/sample-test-summary.md) for
what one looks like.

Any failing test additionally produces a short Markdown bug report under `bug-reports/` (gitignored,
regenerated each run): which steps passed/failed, a clean expected-vs-actual summary, a one-line repro
command, and links to the screenshot/video/trace captured for that failure. `bug-reports/index.md`
summarizes all failures for the run. Hand these files straight to developers — no manual write-up needed.
See [`docs/sample-bug-report.md`](docs/sample-bug-report.md) for what one looks like.
