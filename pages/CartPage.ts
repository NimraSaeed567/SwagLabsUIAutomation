import type { Locator, Page } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  itemByName(name: string): Locator {
    return this.page.locator('.cart_item').filter({ hasText: name });
  }

  async removeItem(name: string) {
    await this.itemByName(name).getByRole('button', { name: 'Remove' }).click();
  }

  async getItemNames(): Promise<string[]> {
    return this.page.locator('.inventory_item_name').allTextContents();
  }

  async checkout() {
    await this.checkoutButton.click();
  }
}
