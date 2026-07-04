import type { Locator, Page } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly inventoryItems: Locator;
  readonly sortDropdown: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;
  readonly pageTitle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.inventoryItems = page.locator('.inventory_item');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.cartLink = page.locator('.shopping_cart_link');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.pageTitle = page.locator('.title');
  }

  itemByName(name: string): Locator {
    return this.page.locator('.inventory_item').filter({ hasText: name });
  }

  async addItemToCart(name: string) {
    await this.itemByName(name).getByRole('button', { name: 'Add to cart' }).click();
  }

  async removeItemFromCart(name: string) {
    await this.itemByName(name).getByRole('button', { name: 'Remove' }).click();
  }

  async sortBy(optionValue: string) {
    await this.sortDropdown.selectOption(optionValue);
  }

  async getItemNames(): Promise<string[]> {
    return this.page.locator('.inventory_item_name').allTextContents();
  }

  async getItemPrices(): Promise<number[]> {
    const texts = await this.page.locator('.inventory_item_price').allTextContents();
    return texts.map((t) => parseFloat(t.replace('$', '')));
  }

  async goToCart() {
    await this.cartLink.click();
  }
}
