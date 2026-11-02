import { Page, Locator } from '@playwright/test';
import { PageBase } from './PageBase';

export class CartPage extends PageBase {

    readonly cartItemNames: Locator;
    readonly checkoutBtn: Locator;

    constructor(page: Page) {
        super(page);
        this.cartItemNames = page.getByTestId('inventory-item-name');
        this.checkoutBtn = page.getByTestId('checkout');
    }

    async clickCheckout(): Promise<void> {
        await this.checkoutBtn.click();
    }
}
