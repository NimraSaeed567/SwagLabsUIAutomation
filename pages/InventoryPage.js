class InventoryPage {
  constructor(page) {
    this.page = page;
    this.inventoryItems = page.locator('.inventory_item');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.cartLink = page.locator('.shopping_cart_link');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.pageTitle = page.locator('.title');
  }

  itemByName(name) {
    return this.page.locator('.inventory_item').filter({ hasText: name });
  }

  async addItemToCart(name) {
    await this.itemByName(name).getByRole('button', { name: 'Add to cart' }).click();
  }

  async removeItemFromCart(name) {
    await this.itemByName(name).getByRole('button', { name: 'Remove' }).click();
  }

  async sortBy(optionValue) {
    await this.sortDropdown.selectOption(optionValue);
  }

  async getItemNames() {
    return this.page.locator('.inventory_item_name').allTextContents();
  }

  async getItemPrices() {
    const texts = await this.page.locator('.inventory_item_price').allTextContents();
    return texts.map((t) => parseFloat(t.replace('$', '')));
  }

  async goToCart() {
    await this.cartLink.click();
  }
}

module.exports = { InventoryPage };
