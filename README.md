# SwagLabs Automation

Playwright test suite for [saucedemo.com](https://www.saucedemo.com), using the Page Object Model.

## Structure

- `pages/` — page objects (Login, Inventory, Cart, Checkout)
- `fixtures/pages.js` — custom Playwright fixtures that inject page objects and a pre-authenticated `loggedInPage`
- `test-data/users.js` — SauceDemo user credentials
- `tests/` — spec files: `login`, `inventory`, `cart`, `checkout`

## Commands

```
npm test              # run all tests headless
npm run test:headed   # run with a visible browser
npm run test:ui       # open Playwright's UI mode
npm run report        # open the last HTML report
```
