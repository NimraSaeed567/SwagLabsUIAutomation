# SwagLabs Automation

Playwright test suite for [saucedemo.com](https://www.saucedemo.com), using the Page Object Model.

## Structure

- `pages/` — page objects (Login, Inventory, Cart, Checkout)
- `fixtures/pages.js` — custom Playwright fixtures that inject page objects and a pre-authenticated `loggedInPage`
- `test-data/users.js` — SauceDemo user credentials
- `tests/` — spec files, run in order: `01-login`, `02-inventory`, `03-cart`, `04-checkout`, `05-e2e-flow` (full journey, runs last)
- `reporters/bug-report-reporter.js` — custom reporter that turns every failing test into a Markdown bug report

## Commands

```
npm test              # run all tests headless
npm run test:headed   # run with a visible, maximized browser at a moderate pace
npm run test:e2e      # run just the full end-to-end flow, headed
npm run test:ui       # open Playwright's UI mode
npm run report        # open the last HTML report
```

## Bug reports

Any failing test automatically produces a Markdown bug report under `bug-reports/` (gitignored, regenerated
each run): steps to reproduce, expected vs. actual result, full stack trace, a one-line repro command, and
links to the screenshot/video/trace captured for that failure. `bug-reports/index.md` summarizes all
failures for the run. Hand these files straight to developers — no manual write-up needed.
