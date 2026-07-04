class CartPage {
  constructor(page) {
    this.page = page;
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  itemByName(name) {
    return this.page.locator('.cart_item').filter({ hasText: name });
  }

  async removeItem(name) {
    await this.itemByName(name).getByRole('button', { name: 'Remove' }).click();
  }

  async getItemNames() {
    return this.page.locator('.inventory_item_name').allTextContents();
  }

  async checkout() {
    await this.checkoutButton.click();
  }
}

module.exports = { CartPage };
