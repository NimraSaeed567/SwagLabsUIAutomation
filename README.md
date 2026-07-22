# SwagLabs Automation

TypeScript Playwright test suite for [saucedemo.com](https://www.saucedemo.com), using the Page Object Model.

## Structure

- `pages/` — page objects (Login, Logout, Inventory, Cart, Checkout)
- `fixtures/pages.ts` — custom Playwright fixtures that inject page objects and a pre-authenticated `loggedInPage`
- `test-data/users.ts` — SauceDemo user credentials
- `tests/` — spec files, run in order: `01-login`, `02-logout`, `03-inventory`, `04-cart`, `05-checkout`, `06-e2e-flow` (full journey, runs last)
- `reporters/bug-report-reporter.ts` — custom reporter: a pass/fail count summary every run, plus a Markdown bug report per failure

## Running tests

Every local run is headed (visible, maximized, moderate pace) by default — no flags or env vars needed,
and the browser closes itself automatically when done. Firefox always runs headless regardless, due to a
headed-mode display/GPU driver issue on some machines (see `playwright.config.ts` for details); Chromium
and WebKit run headed.

**Run everything, all 3 browsers:**
```
npm test
```

**Run everything, Chromium only** (faster, what you'll use most while developing):
```
npx playwright test --project=chromium
```

**Run one file** (swap the filename for any file under `tests/`):
```
npx playwright test tests/03-inventory.spec.ts --project=chromium
```

**Run one single test by name** (matches partial text, `-g` = grep):
```
npx playwright test -g "displays six products" --project=chromium
```

**Other useful commands:**
```
npm run test:e2e       # just the full end-to-end flow (tests/06-e2e-flow.spec.ts)
npm run test:headless  # force a headless run (what CI uses)
npm run test:ui        # open Playwright's UI mode
npm run report         # open the last HTML report
npm run typecheck      # type-check the project with tsc, no build output
```

### Running from the VS Code editor instead of the terminal

If the green ▶ run icons aren't showing up next to `test(...)` lines in the editor, the Playwright Test
extension's index is stale (common after files are renamed/moved, or if `playwright.config.ts` was
temporarily missing). Fix: `Ctrl+Shift+P` → type **Developer: Reload Window** → Enter. After it reloads,
open a spec file and the icons should reappear in the left gutter.

Note: running via that green icon uses VS Code's own Playwright extension settings (like "Reuse Browser"),
which behaves differently from the terminal commands above — notably it won't auto-close the browser
between runs. For the guaranteed open → run → close experience described above, use the terminal.

## Test summary and bug reports

Every run writes `test-summary.md` (gitignored, regenerated each run) with the total/passed/failed/skipped
counts and a per-test status table. See [`docs/sample-test-summary.md`](docs/sample-test-summary.md) for
what one looks like.

Any failing test additionally produces a short Markdown bug report under `bug-reports/` (gitignored,
regenerated each run): which steps passed/failed, a clean expected-vs-actual summary, a one-line repro
command, and links to the screenshot/video/trace captured for that failure. `bug-reports/index.md`
summarizes all failures for the run. Hand these files straight to developers — no manual write-up needed.
See [`docs/sample-bug-report.md`](docs/sample-bug-report.md) for what one looks like.
