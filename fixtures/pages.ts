import { test as base, expect, type Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutStepOnePage, CheckoutStepTwoPage, CheckoutCompletePage } from '../pages/CheckoutPage';
import users from '../test-data/users';

type PageFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutStepOnePage: CheckoutStepOnePage;
  checkoutStepTwoPage: CheckoutStepTwoPage;
  checkoutCompletePage: CheckoutCompletePage;
  loggedInPage: Page;
};

const isHeadedRun = Number(process.env.SLOWMO) > 0;

export const test = base.extend<PageFixtures>({
  // Maximizes the real OS window via CDP before any test step runs. More
  // reliable than the --start-maximized launch arg alone on Windows.
  page: async ({ page, browserName }, use) => {
    if (isHeadedRun && browserName === 'chromium') {
      const session = await page.context().newCDPSession(page);
      const { windowId } = await session.send('Browser.getWindowForTarget');
      await session.send('Browser.setWindowBounds', {
        windowId,
        bounds: { windowState: 'maximized' },
      });
    }
    await use(page);
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutStepOnePage: async ({ page }, use) => {
    await use(new CheckoutStepOnePage(page));
  },
  checkoutStepTwoPage: async ({ page }, use) => {
    await use(new CheckoutStepTwoPage(page));
  },
  checkoutCompletePage: async ({ page }, use) => {
    await use(new CheckoutCompletePage(page));
  },
  // Starts each test already logged in as the standard user.
  loggedInPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);
    await page.waitForURL('**/inventory.html');
    await use(page);
  },
});

export { expect, users };
